// Utilidades compartidas por la previsualizacion y el exportador.
function hexToRgbComponents(hex) {
  if (!hex) return '127, 109, 246';
  let cleanHex = hex.trim();
  if (cleanHex.startsWith('#')) {
    cleanHex = cleanHex.substring(1);
    if (cleanHex.length === 3) {
      cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
    }
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }
  } else if (cleanHex.startsWith('rgb')) {
    const matches = cleanHex.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*/i);
    if (matches) {
      return `${matches[1]}, ${matches[2]}, ${matches[3]}`;
    }
  }
  return cleanHex;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeExternalUrl(value) {
  const url = String(value).trim();
  return /^(https?:|mailto:)/i.test(url) ? escapeHtml(url) : '#';
}

function getOfficialDefault(mode, variableName, fallback = '') {
  return officialDefaultVariables?.[mode]?.[variableName] ?? fallback;
}

function parseHexColor(hex) {
  if (typeof hex !== 'string') return null;
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((char) => char + char).join('');
  }
  if (!/^[0-9a-f]{6}$/i.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function mixHexColor(hex, targetHex, amount) {
  const source = parseHexColor(hex);
  const target = parseHexColor(targetHex);
  if (!source || !target) return hex;
  const mix = (start, end) => Math.round(start + (end - start) * amount);
  return `#${[mix(source.r, target.r), mix(source.g, target.g), mix(source.b, target.b)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

function deriveAccentHover(accent, mode) {
  return mixHexColor(accent, mode === 'dark' ? '#ffffff' : '#000000', mode === 'dark' ? 0.12 : 0.1);
}

function colorWithAlpha(color, alpha) {
  const rgb = parseHexColor(color) || parseHexColor(getOfficialDefault('dark', '--interactive-accent'));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

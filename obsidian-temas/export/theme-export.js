// Compilacion, persistencia y descarga de temas

    async function saveThemeDataLocalAndServer() {
      const dot = document.getElementById('save-status-dot');
      const text = document.getElementById('save-status-text');

      saveToLocalStorage();

      const themeName = document.getElementById('header-meta-name').value.trim() || 'Tema Personalizado';
      const author = document.getElementById('meta-author').value.trim() || 'Autor';
      const description = document.getElementById('meta-description').value.trim() || '';
      const manifest = {
        name: themeName,
        version: '1.0.0',
        minAppVersion: '1.9.0',
        author
      };
      const themeCss = rebuildThemeCssString(themeName, author, description);

      if (dot) dot.className = 'status-dot';
      if (text) text.textContent = 'Guardado en navegador';
    }

    function triggerDownloadAndOffboarding() {
      const themeNameRaw = document.getElementById('header-meta-name').value.trim() || 'Tema Personalizado';
      const author = document.getElementById('meta-author').value.trim() || 'Autor';
      const description = document.getElementById('meta-description').value.trim() || '';
      const cleanThemeName = themeNameRaw.replace(/[\\/:*?"<>|]/g, '').trim() || 'Tema Personalizado';

      const manifest = {
        name: cleanThemeName,
        version: '1.0.0',
        minAppVersion: '1.9.0',
        author
      };
      const themeCss = rebuildThemeCssString(cleanThemeName, author, description);
      const manifestJson = JSON.stringify(manifest, null, 2);

      const zip = new JSZip();
      const themeFolder = zip.folder(cleanThemeName);
      themeFolder.file('theme.css', themeCss);
      themeFolder.file('manifest.json', manifestJson);

      zip.generateAsync({ type: 'blob' }).then((content) => {
        const filename = `${cleanThemeName}.zip`;
        const blobUrl = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        document.getElementById('downloaded-filename').textContent = filename;
        showScreen('success');
      }).catch((err) => {
        alert('Error al empaquetar el tema: ' + err.message);
      });
    }


    function rebuildThemeCssString(themeName, author, description) {
      const dark = themeVariables.dark;
      const light = themeVariables.light;


      function getThemeVariablesCss(theme, mode) {
        const inherited = (key) => theme[key] || getOfficialDefault(mode, key);
        const accentRgb = hexToRgbComponents(inherited('--interactive-accent'));
        const requestedBackgroundImage = theme['--global-background-image'] || 'none';
        const safeBackgroundImage = requestedBackgroundImage === 'none' || /^url\(["']?data:image\//i.test(requestedBackgroundImage)
          ? requestedBackgroundImage
          : 'none';
        return `  /* Fondos de Interfaz */
  --background-primary: ${theme['--background-primary']};
  --background-primary-alt: ${theme['--background-primary-alt']};
  --background-secondary: ${theme['--background-secondary']};
  --background-secondary-alt: ${theme['--background-secondary-alt']};
  --background-modifier-border: ${theme['--background-modifier-border']};

  /* Opacidad de sidebar translúcido */
  --opacity-glass: ${theme['--opacity-glass']};

  /* Textos y Acentos */
  --text-normal: ${theme['--text-normal']};
  --text-muted: ${theme['--text-muted']};
  --text-bold: ${theme['--text-bold']};
  --text-italic: ${theme['--text-italic']};
  --text-highlight-bg: ${theme['--text-highlight-bg']};
  --color-accent: ${theme['--interactive-accent']};
  --color-accent-hover: ${theme['--interactive-accent-hover']};
  --color-accent-rgb: ${accentRgb};
  --interactive-accent: ${theme['--interactive-accent']};
  --interactive-accent-hover: ${theme['--interactive-accent-hover']};
  --interactive-accent-rgb: ${accentRgb};
  --text-accent: ${theme['--interactive-accent']};
  --text-on-accent: ${theme['--text-on-accent']};

  /* Encabezados */
  --h1-color: ${theme['--h1-color']};
  --h2-color: ${theme['--h2-color']};
  --h3-color: ${theme['--h3-color']};
  --h4-color: ${theme['--h4-color']};
  --h5-color: ${theme['--h5-color']};
  --h6-color: ${theme['--h6-color']};

  /* Enlaces */
  --link-color: ${theme['--link-color']};
  --link-color-hover: ${theme['--link-color-hover']};
  --link-decoration: ${theme['--link-decoration']};
  --link-border-bottom: ${theme['--link-border-bottom']};

  /* Workspace UI */
  --tab-background-active: ${theme['--tab-background-active']};
  --tab-text-active: ${theme['--tab-text-active']};
  --tab-background-inactive: ${theme['--tab-background-inactive']};
  --tab-text-inactive: ${theme['--tab-text-inactive']};
  --nav-item-background-active: ${theme['--nav-item-background-active']};
  --nav-item-text-active: ${theme['--nav-item-text-active']};
  --nav-item-background-hover: ${theme['--nav-item-background-hover']};
  --nav-item-text-hover: ${theme['--nav-item-text-hover']};
  --nav-item-tag-color: ${inherited('--nav-item-tag-color') || inherited('--interactive-accent')};
  --status-bar-background: ${theme['--status-bar-background']};
  --status-bar-text: ${theme['--status-bar-text']};
  --scrollbar-thumb-bg: ${theme['--scrollbar-thumb-bg']};

  /* Barra de Título */
  --titlebar-background: ${theme['--titlebar-background']};
  --titlebar-text-color-focused: ${theme['--titlebar-text-color-focused']};

  /* Interactividad */
  --button-primary-background: ${theme['--button-primary-background']};
  --button-primary-background-hover: ${theme['--button-primary-background-hover']};
  --button-primary-background-active: ${theme['--button-primary-background-active']};
  --button-primary-text: ${theme['--button-primary-text']};
  --button-primary-text-hover: ${theme['--button-primary-text-hover']};
  --button-primary-text-active: ${theme['--button-primary-text-active']};
  --button-background: ${theme['--button-background']};
  --button-background-hover: ${theme['--button-background-hover']};
  --button-background-active: ${theme['--button-background-active']};
  --button-text: ${theme['--button-text']};
  --button-text-hover: ${theme['--button-text-hover']};
  --button-text-active: ${theme['--button-text-active']};
  --button-border-color: ${theme['--button-border-color']};
  --button-font-family: ${theme['--button-font-family']};
  --button-font-size: ${theme['--button-font-size']};
  --checkbox-checked-color: ${theme['--checkbox-checked-color']};
  --text-selection: ${theme['--text-selection']};
  --search-result-background: ${theme['--search-result-background']};

  /* Bloques de Citas y Separadores */
  --blockquote-border-color: ${theme['--blockquote-border-color']};
  --blockquote-border-width: ${theme['--blockquote-border-width'] || '4px'};
  --blockquote-bg: ${theme['--blockquote-bg']};
  --blockquote-background-color: var(--blockquote-bg);
  --hr-color: ${theme['--hr-color'] || '#303030'};
  --hr-thickness: ${theme['--hr-thickness'] || '2px'};

  /* Bloques de Nota */
  --callout-border-color: ${theme['--callout-border-color']};
  --callout-bg-color: ${theme['--callout-bg-color']};
  --callout-note: ${hexToRgbComponents(theme['--callout-color-note'] || '#008da5')};
  --callout-info: ${hexToRgbComponents(theme['--callout-color-note'] || '#008da5')};
  --callout-todo: ${hexToRgbComponents(theme['--callout-color-note'] || '#008da5')};
  --callout-success: ${hexToRgbComponents(theme['--callout-color-success'] || '#4abd89')};
  --callout-tip: ${hexToRgbComponents(theme['--callout-color-success'] || '#4abd89')};
  --callout-hint: ${hexToRgbComponents(theme['--callout-color-success'] || '#4abd89')};
  --callout-important: ${hexToRgbComponents(theme['--callout-color-success'] || '#4abd89')};
  --callout-warning: ${hexToRgbComponents(theme['--callout-color-warning'] || '#d97706')};
  --callout-caution: ${hexToRgbComponents(theme['--callout-color-warning'] || '#d97706')};
  --callout-attention: ${hexToRgbComponents(theme['--callout-color-warning'] || '#d97706')};
  --callout-danger: ${hexToRgbComponents(theme['--callout-color-danger'] || '#e74c3c')};
  --callout-error: ${hexToRgbComponents(theme['--callout-color-danger'] || '#e74c3c')};
  --callout-bug: ${hexToRgbComponents(theme['--callout-color-danger'] || '#e74c3c')};
  --callout-fail: ${hexToRgbComponents(theme['--callout-color-danger'] || '#e74c3c')};
  --callout-failure: ${hexToRgbComponents(theme['--callout-color-danger'] || '#e74c3c')};
  --callout-missing: ${hexToRgbComponents(theme['--callout-color-danger'] || '#e74c3c')};
  --callout-example: ${hexToRgbComponents(theme['--callout-color-example'] || '#7c3aed')};
  --callout-quote: ${hexToRgbComponents(theme['--callout-color-quote'] || '#6b7280')};
  --callout-abstract: ${hexToRgbComponents(theme['--callout-color-quote'] || '#6b7280')};
  --callout-summary: ${hexToRgbComponents(theme['--callout-color-quote'] || '#6b7280')};
  --callout-tldr: ${hexToRgbComponents(theme['--callout-color-quote'] || '#6b7280')};
  --table-border-color: ${theme['--table-border-color']};
  --table-header-bg: ${theme['--table-header-bg']};
  --table-row-alt-bg: ${theme['--table-row-alt-bg']};
  --metadata-background: ${theme['--metadata-background'] || 'rgba(0,0,0,0.15)'};
  --metadata-property-background: ${theme['--metadata-property-background'] || theme['--metadata-background'] || 'rgba(0,0,0,0.15)'};
  --metadata-label-text-color: ${theme['--metadata-label-text-color'] || '#a3a3a3'};
  --metadata-value-text-color: ${theme['--metadata-value-text-color'] || '#e5e5e5'};
  --metadata-key-bg: ${theme['--metadata-key-bg']};
  --metadata-value-bg: ${theme['--metadata-value-bg']};
  --code-background: ${theme['--code-background']};
  --code-normal: ${theme['--code-normal']};
  --tag-color: ${theme['--tag-color']};
  --tag-background: ${theme['--tag-background']};
  --tag-border: ${theme['--tag-border']};
  --tag-border-color: ${theme['--tag-border']};
  --table-row-hover-bg: ${theme['--table-row-hover-bg']};
  --table-width: ${theme['--table-width']};
  --ribbon-background-hover: ${theme['--ribbon-background-hover']};
  --ribbon-background-active: ${theme['--ribbon-background-active']};
  --ribbon-item-color-hover: ${theme['--ribbon-item-color-hover']};
  --ribbon-item-color-active: ${theme['--ribbon-item-color-active']};

  /* Listas y Guías */
  --list-marker-color: ${theme['--list-marker-color']};
  --list-indentation-guide-color: ${theme['--list-indentation-guide-color']};
  --nav-indentation-guide-color: ${theme['--nav-indentation-guide-color']};

  /* Fondos Avanzados */
  --global-background-image: ${safeBackgroundImage};

  /* Vistas */
  --graph-node: ${theme['--graph-node']};
  --graph-node-focused: ${theme['--graph-node-focused']};
  --graph-line: ${theme['--graph-line']};
  --graph-text: ${theme['--graph-text']};
  --graph-controls-bg: ${theme['--graph-controls-bg']};
  --canvas-background: ${theme['--canvas-background']};
  --canvas-card-bg: ${theme['--canvas-card-bg']};
  --canvas-arrow-color: ${theme['--canvas-arrow-color']};
  --canvas-arrow-width: ${theme['--canvas-arrow-width'] || '2px'};
  --popover-background: ${theme['--popover-background']};
  --popover-border-color: ${theme['--popover-border-color']};
  --popover-width: ${theme['--popover-width'] || '450px'};
  --popover-height: ${theme['--popover-height'] || '350px'};
  --db-toolbar-btn-color: ${theme['--db-toolbar-btn-color']};
  --db-toolbar-btn-hover-bg: ${theme['--db-toolbar-btn-hover-bg']};
  --db-row-hover-bg: ${theme['--db-row-hover-bg']};
  --db-card-bg: ${theme['--db-card-bg']};
  --db-card-border: ${theme['--db-card-border']};
  --db-card-border-hover: ${theme['--db-card-border-hover']};

  /* CodeMirror 6 Syntax Highlighting */
  --code-keyword: ${theme['--code-keyword']};
  --code-string: ${theme['--code-string']};
  --code-comment: ${theme['--code-comment']};

  /* Menus y Tooltips */
  --menu-background: ${theme['--menu-background']};
  --menu-item-hover: ${theme['--menu-item-hover']};
  --tooltip-background: ${theme['--tooltip-background']};
  --tooltip-text-color: ${theme['--tooltip-text-color']};

  /* Modales */
  --modal-background: ${theme['--modal-background']};
  --modal-border: ${theme['--modal-border']};
  --modal-backdrop-blur: ${theme['--modal-backdrop-blur']};
  --background-modifier-cover: ${theme['--background-modifier-cover']};

  /* Settings Panel */
  --settings-tab-background: ${theme['--settings-tab-background']};
  --settings-dropdown-bg: ${theme['--settings-dropdown-bg']};

  /* Variables Base */
  --font-text: ${theme['--font-text']};
  --font-interface: ${theme['--font-text']};
  --font-monospace: ${theme['--font-monospace']};
  --border-width: ${theme['--border-width']};
  --radius-s: ${theme['--radius-s']};
  --radius-m: ${theme['--radius-m']};
  --radius-l: ${theme['--radius-l']};
  --scrollbar-width: ${theme['--scrollbar-width']};
  --h1-size: ${theme['--h1-size']};
  --h1-line-height: ${theme['--h1-line-height'] || '1.2'};
  --h1-margin-bottom: ${theme['--h1-margin-bottom'] || '0.5em'};
  --h1-weight: ${theme['--h1-weight']};
  --h1-font: ${theme['--h1-font']};
  --h2-size: ${theme['--h2-size']};
  --h2-line-height: ${theme['--h2-line-height'] || '1.2'};
  --h2-margin-bottom: ${theme['--h2-margin-bottom'] || '0.5em'};
  --h2-weight: ${theme['--h2-weight']};
  --h2-font: ${theme['--h2-font']};
  --h3-size: ${theme['--h3-size']};
  --h3-line-height: ${theme['--h3-line-height'] || '1.2'};
  --h3-margin-bottom: ${theme['--h3-margin-bottom'] || '0.5em'};
  --h3-weight: ${theme['--h3-weight']};
  --h3-font: ${theme['--h3-font']};
  --h4-size: ${theme['--h4-size']};
  --h4-line-height: ${theme['--h4-line-height'] || '1.2'};
  --h4-margin-bottom: ${theme['--h4-margin-bottom'] || '0.5em'};
  --h4-weight: ${theme['--h4-weight']};
  --h4-font: ${theme['--h4-font']};
  --h5-size: ${theme['--h5-size']};
  --h5-line-height: ${theme['--h5-line-height'] || '1.2'};
  --h5-margin-bottom: ${theme['--h5-margin-bottom'] || '0.5em'};
  --h5-weight: ${theme['--h5-weight']};
  --h5-font: ${theme['--h5-font']};
  --h6-size: ${theme['--h6-size']};
  --h6-line-height: ${theme['--h6-line-height'] || '1.2'};
  --h6-margin-bottom: ${theme['--h6-margin-bottom'] || '0.5em'};
  --h6-weight: ${theme['--h6-weight']};
  --h6-font: ${theme['--h6-font']};
  --checkbox-radius: ${theme['--checkbox-radius']};
  --callout-radius: ${theme['--callout-radius']};
  --callout-border-width: ${theme['--callout-border-width']};
  --callout-padding: ${theme['--callout-padding'] || '12px 16px'};
  --callout-margin: ${theme['--callout-margin'] || '1.2rem 0'};
  --callout-title-size: ${theme['--callout-title-size'] || 'inherit'};
  --callout-title-weight: ${theme['--callout-title-weight'] || '600'};
  --callout-title-font: ${theme['--callout-title-font'] || 'inherit'};
  --callout-title-spacing: ${theme['--callout-title-spacing'] || '6px'};
  --callout-body-size: ${theme['--callout-body-size'] || 'inherit'};
  --table-border-width: ${theme['--table-border-width']};
  --global-background-blur: ${theme['--global-background-blur']};
  --list-spacing: ${theme['--list-spacing'] || '0.075em'};
  --list-line-height: ${theme['--list-line-height'] || '1.5'};
  --p-spacing: ${theme['--p-spacing'] || '0.8em'};
  --heading-spacing: ${theme['--heading-spacing'] || '1em'};
  --line-height-normal: ${theme['--line-height-normal'] || '1.5'};
  --file-line-width: ${theme['--file-line-width'] || '700px'};`;
      }

      return `/*
 * TEMA: ${themeName}
 * AUTOR: ${author}
 * DESCRIPCIÓN:${description ? ` ${description}` : ''}
 */

/* ==========================================
   1. VARIABLES GLOBALES / CONFIGURACIÓN BASE
   ========================================== */
:root {
${getThemeVariablesCss(dark, 'dark')}
}

/* ==========================================
   2. CONFIGURACIÓN DEL MODO OSCURO (.theme-dark)
   ========================================== */
.theme-dark {
${getThemeVariablesCss(dark, 'dark')}
}


/* ==========================================
   3. CONFIGURACIÓN DEL MODO CLARO (.theme-light)
   ========================================== */
.theme-light {
${getThemeVariablesCss(light, 'light')}
}

/* Tipografía y espaciado nativos de Obsidian. */
.markdown-rendered,
.markdown-preview-view,
.markdown-source-view.mod-cm6 .cm-content {
  line-height: var(--line-height-normal, 1.5);
}

/* Separación posterior individual; Obsidian gestiona altura y espacio superior. */
.markdown-rendered h1,
.markdown-preview-view h1 {
  margin-block-end: var(--h1-margin-bottom, 0.5em);
}

.markdown-rendered h2,
.markdown-preview-view h2 {
  margin-block-end: var(--h2-margin-bottom, 0.5em);
}

.markdown-rendered h3,
.markdown-preview-view h3 {
  margin-block-end: var(--h3-margin-bottom, 0.5em);
}

.markdown-rendered h4,
.markdown-preview-view h4 {
  margin-block-end: var(--h4-margin-bottom, 0.5em);
}

.markdown-rendered h5,
.markdown-preview-view h5 {
  margin-block-end: var(--h5-margin-bottom, 0.5em);
}

.markdown-rendered h6,
.markdown-preview-view h6 {
  margin-block-end: var(--h6-margin-bottom, 0.5em);
}

/* La altura de lista es una extensión propia; --list-spacing es nativa. */
.markdown-rendered ul,
.markdown-rendered ol,
.markdown-preview-view ul,
.markdown-preview-view ol {
  line-height: var(--list-line-height, var(--line-height-normal, 1.5));
}

.markdown-rendered li,
.markdown-preview-view li {
  line-height: var(--list-line-height, var(--line-height-normal, 1.5));
}

/* Live Preview: usar padding vertical, nunca margen sobre líneas CodeMirror. */
.markdown-source-view.mod-cm6 .cm-line.HyperMD-header-1 {
  padding-bottom: var(--h1-margin-bottom, 0.5em);
}

.markdown-source-view.mod-cm6 .cm-line.HyperMD-header-2 {
  padding-bottom: var(--h2-margin-bottom, 0.5em);
}

.markdown-source-view.mod-cm6 .cm-line.HyperMD-header-3 {
  padding-bottom: var(--h3-margin-bottom, 0.5em);
}

.markdown-source-view.mod-cm6 .cm-line.HyperMD-header-4 {
  padding-bottom: var(--h4-margin-bottom, 0.5em);
}

.markdown-source-view.mod-cm6 .cm-line.HyperMD-header-5 {
  padding-bottom: var(--h5-margin-bottom, 0.5em);
}

.markdown-source-view.mod-cm6 .cm-line.HyperMD-header-6 {
  padding-bottom: var(--h6-margin-bottom, 0.5em);
}

.markdown-source-view.mod-cm6 .cm-line.HyperMD-list-line {
  line-height: var(--list-line-height, var(--line-height-normal, 1.5));
}

/* Hover de filas en tablas Markdown, tanto en lectura como en Live Preview. */
.markdown-rendered table tbody tr > td,
.markdown-source-view.mod-cm6 .cm-table-widget table tbody tr > td,
.markdown-source-view.mod-cm6 table.cm-table-widget tbody tr > td {
  transition: background-color 0.12s ease;
}

.markdown-rendered table tbody tr:hover > td,
.markdown-source-view.mod-cm6 .cm-table-widget table tbody tr:hover > td,
.markdown-source-view.mod-cm6 table.cm-table-widget tbody tr:hover > td {
  background-color: var(--table-row-hover-bg, transparent);
}

`;
    }

// Sincronizacion de variables y aplicacion reactiva del tema




    function updateControlPanelInputs() {
      const vars = themeVariables[currentMode];
      
      for (const [idKey, varName] of Object.entries(inputMappings)) {
        const val = vars[varName];
        if (!val) continue;

        const valLabel = document.getElementById(`val-${idKey}`);
        if (valLabel) valLabel.textContent = val;

        const picker = document.getElementById(`picker-${idKey}`);
        const textInput = document.getElementById(`text-${idKey}`);
        
        if (textInput) textInput.value = val;
        if (picker) {
          if (val.startsWith('#') && val.length === 7) {
            picker.value = val;
          } else if (val.startsWith('rgba')) {
            const matches = val.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,.*/i);
            if (matches) {
              const r = parseInt(matches[1]).toString(16).padStart(2, '0');
              const g = parseInt(matches[2]).toString(16).padStart(2, '0');
              const b = parseInt(matches[3]).toString(16).padStart(2, '0');
              picker.value = `#${r}${g}${b}`;
            }
          }
        }

        const range = document.getElementById(`range-${idKey}`);
        if (range) range.value = parseFloat(val);

        const select = document.getElementById(`select-${idKey}`);
        if (select) {
          const cleanVal = val.replace(/['"]/g, '').trim();
          for (let i = 0; i < select.options.length; i++) {
            const option = select.options[i];
            const cleanOpt = option.value.replace(/['"]/g, '').trim();
            if (cleanOpt === cleanVal || cleanVal.startsWith(cleanOpt) || cleanOpt.startsWith(cleanVal)) {
              select.value = option.value;
              break;
            }
          }
        }
      }

      // Sincronizar select-link-decoration
      const selectLinkDec = document.getElementById('select-link-decoration');
      if (selectLinkDec) {
        const dec = vars['--link-decoration'];
        const border = vars['--link-border-bottom'];
        if (border && border !== 'none') {
          selectLinkDec.value = 'dashed';
        } else if (dec === 'underline') {
          selectLinkDec.value = 'underline';
        } else {
          selectLinkDec.value = 'none';
        }
      }

      // Sincronizar todos los swatches de color personalizados
      for (const idKey of Object.keys(inputMappings)) {
        updateSwatchPreview(idKey);
      }
      // Sincronizar inputs del Modo Básico
      const basicAccent = vars['--interactive-accent'];
      const basicBg = vars['--background-primary'];
      
      const setBasicPickerAndText = (pickerId, textId, valId, val) => {
        const picker = document.getElementById(pickerId);
        const textInput = document.getElementById(textId);
        const labelVal = document.getElementById(valId);
        if (textInput) textInput.value = val;
        if (labelVal) labelVal.textContent = val;
        if (picker) {
          if (val.startsWith('#') && val.length === 7) {
            picker.value = val;
          } else if (val.startsWith('rgba')) {
            const matches = val.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,.*/i);
            if (matches) {
              const r = parseInt(matches[1]).toString(16).padStart(2, '0');
              const g = parseInt(matches[2]).toString(16).padStart(2, '0');
              const b = parseInt(matches[3]).toString(16).padStart(2, '0');
              picker.value = `#${r}${g}${b}`;
            }
          }
        }
      };

      if (basicAccent) setBasicPickerAndText('picker-basic-accent', 'text-basic-accent', 'val-basic-accent', basicAccent);
      if (basicBg) setBasicPickerAndText('picker-basic-bg', 'text-basic-bg', 'val-basic-bg', basicBg);

      const basicFont = vars['--font-text'];
      if (basicFont) {
        const basicFontSelect = document.getElementById('select-basic-font');
        if (basicFontSelect) {
          const cleanFont = basicFont.replace(/['"]/g, '').trim();
          for (let i = 0; i < basicFontSelect.options.length; i++) {
            const opt = basicFontSelect.options[i];
            const cleanOpt = opt.value.replace(/['"]/g, '').trim();
            if (cleanOpt === cleanFont || cleanFont.startsWith(cleanOpt) || cleanOpt.startsWith(cleanFont)) {
              basicFontSelect.value = opt.value;
              break;
            }
          }
        }
      }

      const basicRadius = vars['--radius-m'];
      if (basicRadius) {
        const basicRadiusRange = document.getElementById('range-basic-radius');
        const basicRadiusVal = document.getElementById('val-basic-radius');
        if (basicRadiusRange) basicRadiusRange.value = parseFloat(basicRadius);
        if (basicRadiusVal) basicRadiusVal.textContent = basicRadius;
      }

      // También sincronizar swatches del Modo Básico
      updateSwatchPreview('basic-accent');
      updateSwatchPreview('basic-bg');

      // Sincronizar select-button-font
      const buttonFont = vars['--button-font-family'] || 'inherit';
      const buttonFontSelect = document.getElementById('select-button-font');
      if (buttonFontSelect) {
        buttonFontSelect.value = buttonFont;
      }

      // Sincronizar toggle-table-row-hover
      const tableRowHoverBg = vars['--table-row-hover-bg'] || 'transparent';
      const toggleTableHover = document.getElementById('toggle-table-row-hover');
      const tableHoverColorContainer = document.getElementById('table-row-hover-color-container');
      if (toggleTableHover) {
        const isHoverActive = (tableRowHoverBg !== 'transparent' && tableRowHoverBg !== 'none' && tableRowHoverBg.trim() !== '');
        toggleTableHover.checked = isHoverActive;
        if (tableHoverColorContainer) {
          tableHoverColorContainer.style.display = isHoverActive ? 'block' : 'none';
        }
      }

      // Sincronizar el color en la pestaña Opciones -> Apariencia
      const currentAccent = vars['--interactive-accent'] || getOfficialDefault(currentMode, '--interactive-accent');
      const optionsAccentCircle = document.getElementById('options-accent-circle');
      const optionsAccentPicker = document.getElementById('options-accent-picker');
      if (optionsAccentCircle) {
        optionsAccentCircle.style.backgroundColor = currentAccent;
      }
      if (optionsAccentPicker) {
        optionsAccentPicker.value = currentAccent;
      }
    }

    function propagateAccentColorChange(oldAccent, newAccent, mode) {
      const activeVars = themeVariables[mode];
      if (!activeVars) return;

      const oldRgb = parseHexColor(oldAccent);
      const newRgb = parseHexColor(newAccent);
      if (!oldRgb || !newRgb) return;

      const solidInherited = [
        '--link-color',
        '--tag-color',
        '--callout-border-color',
        '--canvas-arrow-color',
        '--button-primary-background',
        '--button-primary-background-active',
        '--checkbox-checked-color',
        '--nav-item-text-active',
        '--nav-item-tag-color',
        '--blockquote-border-color',
        '--ribbon-item-color-active',
        '--graph-node',
        '--db-card-border-hover',
        '--list-marker-color'
      ];
      const defaultAccent = getOfficialDefault(mode, '--interactive-accent').trim().toLowerCase();

      solidInherited.forEach(v => {
        const currentVal = activeVars[v];
        if (currentVal) {
          const currentValClean = currentVal.trim().toLowerCase();
          const oldAccentClean = oldAccent.trim().toLowerCase();
          const defaultVal = officialDefaultVariables[mode][v] ? officialDefaultVariables[mode][v].trim().toLowerCase() : '';
          let shouldUpdate = (currentValClean === oldAccentClean);
          
          if (defaultVal && oldAccentClean === defaultAccent && currentValClean === defaultVal) {
            shouldUpdate = true;
          }
          
          if (shouldUpdate) {
            activeVars[v] = newAccent;
          }
        }
      });

      const hoverInherited = [
        '--interactive-accent-hover', '--link-color-hover',
        '--button-primary-background-hover', '--graph-node-focused'
      ];
      const oldHover = deriveAccentHover(oldAccent, mode).toLowerCase();
      const newHover = deriveAccentHover(newAccent, mode);
      hoverInherited.forEach((variableName) => {
        const current = activeVars[variableName]?.trim().toLowerCase();
        const official = getOfficialDefault(mode, variableName).trim().toLowerCase();
        if (current === oldHover || current === oldAccent.trim().toLowerCase() ||
            (oldAccent.trim().toLowerCase() === defaultAccent && current === official)) {
          activeVars[variableName] = newHover;
        }
      });

      const rgbaInherited = [
        '--callout-bg-color',
        '--blockquote-bg',
        '--tag-background',
        '--tag-border',
        '--ribbon-background-active',
        '--text-selection'
      ];

      rgbaInherited.forEach(v => {
        const currentVal = activeVars[v];
        if (currentVal && currentVal.includes('rgba')) {
          const rgbRegex = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/i;
          const match = currentVal.match(rgbRegex);
          if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            const alpha = parseFloat(match[4]);
            
            let shouldUpdate = (r === oldRgb.r && g === oldRgb.g && b === oldRgb.b);
            
            const defaultVal = officialDefaultVariables[mode][v];
            if (defaultVal && oldAccent.trim().toLowerCase() === defaultAccent) {
              const defMatch = defaultVal.match(rgbRegex);
              if (defMatch) {
                const defR = parseInt(defMatch[1]);
                const defG = parseInt(defMatch[2]);
                const defB = parseInt(defMatch[3]);
                if (r === defR && g === defG && b === defB) {
                  shouldUpdate = true;
                }
              }
            }
            
            if (shouldUpdate) {
              activeVars[v] = `rgba(${newRgb.r}, ${newRgb.g}, ${newRgb.b}, ${alpha})`;
            }
          }
        }
      });
    }

    function updatePreviewVariableDirectly(varName, newVal) {
      const windowEl = document.getElementById('obsidian-window');
      if (!windowEl) return;
      windowEl.style.setProperty(varName, newVal);

      if (varName === '--interactive-accent') {
        const oldVal = themeVariables[currentMode]['--interactive-accent'] || getOfficialDefault(currentMode, '--interactive-accent');
        const newRgb = parseHexColor(newVal);
        const oldRgb = parseHexColor(oldVal);
        if (!newRgb || !oldRgb) return;
        const activeVars = themeVariables[currentMode];
        
        const solidInherited = [
          '--link-color',
          '--tag-color',
          '--callout-border-color',
          '--canvas-arrow-color',
          '--button-primary-background',
          '--button-primary-background-active',
          '--checkbox-checked-color',
          '--nav-item-text-active',
          '--nav-item-tag-color',
          '--blockquote-border-color',
          '--ribbon-item-color-active',
          '--graph-node',
          '--db-card-border-hover',
          '--list-marker-color'
        ];
        solidInherited.forEach(v => {
          const currentVal = activeVars[v];
          if (currentVal && currentVal.trim().toLowerCase() === oldVal.trim().toLowerCase()) {
            windowEl.style.setProperty(v, newVal);
          }
        });
        ['--interactive-accent-hover', '--link-color-hover', '--button-primary-background-hover', '--graph-node-focused']
          .forEach((variableName) => windowEl.style.setProperty(variableName, deriveAccentHover(newVal, currentMode)));

        const rgbaInherited = [
          '--callout-bg-color',
          '--blockquote-bg',
          '--tag-background',
          '--tag-border',
          '--ribbon-background-active',
          '--text-selection'
        ];
        rgbaInherited.forEach(v => {
          const currentVal = activeVars[v];
          if (currentVal && currentVal.includes('rgba')) {
            const rgbRegex = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/i;
            const match = currentVal.match(rgbRegex);
            if (match) {
              const r = parseInt(match[1]);
              const g = parseInt(match[2]);
              const b = parseInt(match[3]);
              const alpha = parseFloat(match[4]);
              if (r === oldRgb.r && g === oldRgb.g && b === oldRgb.b) {
                windowEl.style.setProperty(v, `rgba(${newRgb.r}, ${newRgb.g}, ${newRgb.b}, ${alpha})`);
              }
            }
          }
        });

        // Sincronizar el color en la pestaña Opciones -> Apariencia
        const optionsAccentCircle = document.getElementById('options-accent-circle');
        const optionsAccentPicker = document.getElementById('options-accent-picker');
        if (optionsAccentCircle) {
          optionsAccentCircle.style.backgroundColor = newVal;
        }
        if (optionsAccentPicker) {
          optionsAccentPicker.value = newVal;
        }
      }
      
      if (varName.startsWith('--callout-color-')) {
        const category = varName.replace('--callout-color-', '');
        const rgbVal = hexToRgbComponents(newVal);
        windowEl.style.setProperty(`--callout-${category}`, rgbVal);
        if (category === 'note') {
          windowEl.style.setProperty('--callout-info', rgbVal);
          windowEl.style.setProperty('--callout-todo', rgbVal);
        } else if (category === 'success') {
          windowEl.style.setProperty('--callout-tip', rgbVal);
          windowEl.style.setProperty('--callout-hint', rgbVal);
          windowEl.style.setProperty('--callout-important', rgbVal);
        } else if (category === 'warning') {
          windowEl.style.setProperty('--callout-caution', rgbVal);
          windowEl.style.setProperty('--callout-attention', rgbVal);
        } else if (category === 'danger') {
          windowEl.style.setProperty('--callout-error', rgbVal);
          windowEl.style.setProperty('--callout-bug', rgbVal);
          windowEl.style.setProperty('--callout-fail', rgbVal);
          windowEl.style.setProperty('--callout-failure', rgbVal);
          windowEl.style.setProperty('--callout-missing', rgbVal);
        } else if (category === 'example') {
          windowEl.style.setProperty('--callout-example', rgbVal);
        } else if (category === 'quote') {
          windowEl.style.setProperty('--callout-abstract', rgbVal);
          windowEl.style.setProperty('--callout-summary', rgbVal);
          windowEl.style.setProperty('--callout-tldr', rgbVal);
        }
      }
      
      if (varName === '--opacity-glass') {
        const sidebar = document.getElementById('obsidian-sidebar-glass');
        const ribbon = document.getElementById('obsidian-ribbon-glass');
        const rightSidebar = document.getElementById('obsidian-right-sidebar-glass');
        const pct = parseInt(parseFloat(newVal) * 100);
        if (sidebar) sidebar.style.backgroundColor = `color-mix(in srgb, var(--background-secondary) ${pct}%, transparent)`;
        if (ribbon) ribbon.style.backgroundColor = `color-mix(in srgb, var(--background-secondary-alt) ${pct}%, transparent)`;
        if (rightSidebar) rightSidebar.style.backgroundColor = `color-mix(in srgb, var(--background-secondary) ${pct}%, transparent)`;
      }
    }

    function applyThemeToPreview() {
      const windowEl = document.getElementById('obsidian-window');
      
      if (currentMode === 'dark') {
        windowEl.classList.remove('theme-light');
        windowEl.classList.add('theme-dark');
      } else {
        windowEl.classList.remove('theme-dark');
        windowEl.classList.add('theme-light');
      }

      const activeVars = themeVariables[currentMode];
      
      // Sincronizar variables nativas de acento
      const colorAccent = activeVars['--interactive-accent'] || getOfficialDefault(currentMode, '--interactive-accent');
      const colorAccentHover = activeVars['--interactive-accent-hover'] || deriveAccentHover(colorAccent, currentMode);
      const accentRgb = hexToRgbComponents(colorAccent);
      windowEl.style.setProperty('--color-accent', colorAccent);
      windowEl.style.setProperty('--color-accent-hover', colorAccentHover);
      windowEl.style.setProperty('--color-accent-rgb', accentRgb);
      windowEl.style.setProperty('--interactive-accent-rgb', accentRgb);

      let cssText = `#obsidian-window {\n`;
      cssText += `  --color-accent: ${colorAccent};\n`;
      cssText += `  --color-accent-hover: ${colorAccentHover};\n`;
      cssText += `  --color-accent-rgb: ${accentRgb};\n`;
      cssText += `  --interactive-accent-rgb: ${accentRgb};\n`;

      for (const [varName, value] of Object.entries(activeVars)) {
        cssText += `  ${varName}: ${value};\n`;
        windowEl.style.setProperty(varName, value);
      }
      
      // Inject granular callout category rgb variables
      const calloutRgb = (key) => hexToRgbComponents(activeVars[key] || getOfficialDefault(currentMode, key));
      const noteRgb = calloutRgb('--callout-color-note');
      const successRgb = calloutRgb('--callout-color-success');
      const warningRgb = calloutRgb('--callout-color-warning');
      const dangerRgb = calloutRgb('--callout-color-danger');
      const exampleRgb = calloutRgb('--callout-color-example');
      const quoteRgb = calloutRgb('--callout-color-quote');
      
      cssText += `  --callout-note: ${noteRgb};\n`;
      cssText += `  --callout-info: ${noteRgb};\n`;
      cssText += `  --callout-todo: ${noteRgb};\n`;
      cssText += `  --callout-success: ${successRgb};\n`;
      cssText += `  --callout-tip: ${successRgb};\n`;
      cssText += `  --callout-hint: ${successRgb};\n`;
      cssText += `  --callout-important: ${successRgb};\n`;
      cssText += `  --callout-warning: ${warningRgb};\n`;
      cssText += `  --callout-caution: ${warningRgb};\n`;
      cssText += `  --callout-attention: ${warningRgb};\n`;
      cssText += `  --callout-danger: ${dangerRgb};\n`;
      cssText += `  --callout-error: ${dangerRgb};\n`;
      cssText += `  --callout-bug: ${dangerRgb};\n`;
      cssText += `  --callout-fail: ${dangerRgb};\n`;
      cssText += `  --callout-failure: ${dangerRgb};\n`;
      cssText += `  --callout-missing: ${dangerRgb};\n`;
      cssText += `  --callout-example: ${exampleRgb};\n`;
      cssText += `  --callout-quote: ${quoteRgb};\n`;
      cssText += `  --callout-abstract: ${quoteRgb};\n`;
      cssText += `  --callout-summary: ${quoteRgb};\n`;
      cssText += `  --callout-tldr: ${quoteRgb};\n`;

      cssText += `}\n`;

      // Sincronizar también las variables derivadas en línea
      windowEl.style.setProperty('--callout-note', noteRgb);
      windowEl.style.setProperty('--callout-info', noteRgb);
      windowEl.style.setProperty('--callout-todo', noteRgb);
      windowEl.style.setProperty('--callout-success', successRgb);
      windowEl.style.setProperty('--callout-tip', successRgb);
      windowEl.style.setProperty('--callout-hint', successRgb);
      windowEl.style.setProperty('--callout-important', successRgb);
      windowEl.style.setProperty('--callout-warning', warningRgb);
      windowEl.style.setProperty('--callout-caution', warningRgb);
      windowEl.style.setProperty('--callout-attention', warningRgb);
      windowEl.style.setProperty('--callout-danger', dangerRgb);
      windowEl.style.setProperty('--callout-error', dangerRgb);
      windowEl.style.setProperty('--callout-bug', dangerRgb);
      windowEl.style.setProperty('--callout-fail', dangerRgb);
      windowEl.style.setProperty('--callout-failure', dangerRgb);
      windowEl.style.setProperty('--callout-missing', dangerRgb);
      windowEl.style.setProperty('--callout-example', exampleRgb);
      windowEl.style.setProperty('--callout-quote', quoteRgb);
      windowEl.style.setProperty('--callout-abstract', quoteRgb);
      windowEl.style.setProperty('--callout-summary', quoteRgb);
      windowEl.style.setProperty('--callout-tldr', quoteRgb);
      
      // Aplicar filtros de opacidad cristal
      const glassOpacity = activeVars['--opacity-glass'] || '0.85';
      cssText += `#obsidian-sidebar-glass { background-color: color-mix(in srgb, var(--background-secondary) ${parseInt(parseFloat(glassOpacity)*100)}%, transparent) !important; backdrop-filter: blur(10px); }\n`;
      cssText += `#obsidian-ribbon-glass { background-color: color-mix(in srgb, var(--background-secondary-alt) ${parseInt(parseFloat(glassOpacity)*100)}%, transparent) !important; backdrop-filter: blur(10px); }\n`;
      cssText += `#obsidian-right-sidebar-glass { background-color: color-mix(in srgb, var(--background-secondary) ${parseInt(parseFloat(glassOpacity)*100)}%, transparent) !important; backdrop-filter: blur(10px); }\n`;

      document.getElementById('theme-preview-vars').textContent = cssText;
    }

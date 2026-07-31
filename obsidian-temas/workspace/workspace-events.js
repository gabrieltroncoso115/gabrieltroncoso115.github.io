// Eventos e interacciones del workspace de previsualizacion


    function setupWorkspaceEvents() {
      const homeButton = document.getElementById('btn-go-home-header');
      if (homeButton) {
        homeButton.addEventListener('click', () => {
          if (!confirmDiscardThemeChanges()) return;
          showScreen('onboarding');
        });
      }

      // Acordeones Avanzados
      const allTabs = ['theme', 'foundations', 'text', 'notes', 'workspace', 'controls', 'views'];
      allTabs.forEach(tab => {
        const header = document.getElementById(`accordion-header-${tab}`);
        if (header) {
          header.addEventListener('click', () => {
            switchAdvancedTab(tab);
          });
        }
      });

      // Botón de Refrescar Manual
      const btnRefresh = document.getElementById('btn-refresh-preview');
      if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
          applyThemeToPreview();
          updateControlPanelInputs();
          showToast('Vista y controles actualizados');
        });
      }

      // Atajo universal para deshacer, incluso cuando el foco está en un campo de texto.
      document.addEventListener('keydown', (event) => {
        const isUndoShortcut = (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'z';
        if (!isUndoShortcut) return;
        event.preventDefault();
        performUndo();
      });

      // Toggles de Modo Claro/Oscuro
      const bindModeButtons = (darkBtnId, lightBtnId) => {
        const db = document.getElementById(darkBtnId);
        const lb = document.getElementById(lightBtnId);
        if (!db || !lb) return;
        db.addEventListener('click', () => {
          currentMode = 'dark';
          db.classList.add('active'); lb.classList.remove('active');
          updateModeButtonsActiveStates();
          updateControlPanelInputs();
          applyThemeToPreview();
        });
        lb.addEventListener('click', () => {
          currentMode = 'light';
          lb.classList.add('active'); db.classList.remove('active');
          updateModeButtonsActiveStates();
          updateControlPanelInputs();
          applyThemeToPreview();
        });
      };
      bindModeButtons('basic-mode-dark', 'basic-mode-light');
      bindModeButtons('adv-mode-dark', 'adv-mode-light');

      // Vincular controles de entrada
      for (const [idKey, varName] of Object.entries(inputMappings)) {
        const picker = document.getElementById(`picker-${idKey}`);
        const textInput = document.getElementById(`text-${idKey}`);
        const range = document.getElementById(`range-${idKey}`);
        const select = document.getElementById(`select-${idKey}`);
        const labelText = document.getElementById(`val-${idKey}`);

        const isGlobal = varName.startsWith('--font-') || 
                         varName.startsWith('--line-') || 
                         varName.startsWith('--p-') || 
                         varName === '--heading-spacing' ||
                         varName === '--list-line-height' ||
                         varName.startsWith('--radius-') || 
                         (varName.startsWith('--h') && (varName.endsWith('-size') || varName.endsWith('-weight') || varName.endsWith('-font') || varName.endsWith('-line-height') || varName.endsWith('-margin-bottom'))) ||
                         varName === '--global-background-blur' ||
                         varName === '--modal-backdrop-blur' ||
                         varName === '--popover-width' ||
                         varName === '--popover-height' ||
                         varName === '--button-font-family' ||
                         varName === '--button-font-size' ||
                         varName === '--callout-radius' ||
                         varName === '--callout-border-width' ||
                         varName === '--blockquote-border-width' ||
                         varName === '--hr-thickness' ||
                         varName === '--table-border-width' ||
                         varName === '--table-width' ||
                         varName === '--table-row-hover-bg' ||
                         varName === '--scrollbar-width' ||
                         varName === '--checkbox-radius' ||
                         varName === '--border-width';

        const updateValueDirectly = (newVal) => {
          if (labelText) labelText.textContent = newVal;
          updateSwatchPreview(idKey, newVal);
          updatePreviewVariableDirectly(varName, newVal);
        };

        const commitValue = (newVal) => {
          if (varName === '--interactive-accent') {
            const oldVal = themeVariables[currentMode]['--interactive-accent'] || getOfficialDefault(currentMode, '--interactive-accent');
            if (isGlobal) {
              propagateAccentColorChange(oldVal, newVal, 'dark');
              propagateAccentColorChange(oldVal, newVal, 'light');
              themeVariables.dark[varName] = newVal;
              themeVariables.light[varName] = newVal;
            } else {
              propagateAccentColorChange(oldVal, newVal, currentMode);
              themeVariables[currentMode][varName] = newVal;
            }
            updateControlPanelInputs();
          } else {
            if (isGlobal) {
              themeVariables.dark[varName] = newVal;
              themeVariables.light[varName] = newVal;
            } else {
              themeVariables[currentMode][varName] = newVal;
            }
          }
          if (labelText) labelText.textContent = newVal;
          updateSwatchPreview(idKey, newVal);
          applyThemeToPreview();
          triggerAutoSave();
        };

        if (textInput) {
          if (picker) {
            picker.addEventListener('input', (e) => {
              const hexColor = e.target.value;
              const currentText = textInput.value.trim();
              let newVal = hexColor;
              if (currentText.startsWith('rgba')) {
                const alphaMatch = currentText.match(/rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/i);
                const alpha = alphaMatch ? parseFloat(alphaMatch[1]) : 0.15;
                const r = parseInt(hexColor.slice(1, 3), 16);
                const g = parseInt(hexColor.slice(3, 5), 16);
                const b = parseInt(hexColor.slice(5, 7), 16);
                newVal = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              }
              textInput.value = newVal;
              updateValueDirectly(newVal);
            });
            
            picker.addEventListener('change', (e) => {
              const hexColor = e.target.value;
              const currentText = textInput.value.trim();
              let newVal = hexColor;
              if (currentText.startsWith('rgba')) {
                const alphaMatch = currentText.match(/rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/i);
                const alpha = alphaMatch ? parseFloat(alphaMatch[1]) : 0.15;
                const r = parseInt(hexColor.slice(1, 3), 16);
                const g = parseInt(hexColor.slice(3, 5), 16);
                const b = parseInt(hexColor.slice(5, 7), 16);
                newVal = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              }
              commitValue(newVal);
            });

            const handleTextChangeOrBlur = (e) => {
              let val = e.target.value.trim();
              if (/^[0-9a-fA-F]{6}$/.test(val)) {
                val = '#' + val;
                e.target.value = val;
              } else if (/^[0-9a-fA-F]{3}$/.test(val)) {
                val = '#' + val;
                e.target.value = val;
              }
              commitValue(val);
              if (val.startsWith('#') && (val.length === 7 || val.length === 4)) {
                let hex = val;
                if (hex.length === 4) {
                  hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
                }
                picker.value = hex.toLowerCase();
              } else if (val.startsWith('rgba') || val.startsWith('rgb')) {
                const matches = val.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*/i);
                if (matches) {
                  const r = parseInt(matches[1]).toString(16).padStart(2, '0');
                  const g = parseInt(matches[2]).toString(16).padStart(2, '0');
                  const b = parseInt(matches[3]).toString(16).padStart(2, '0');
                  picker.value = `#${r}${g}${b}`.toLowerCase();
                }
              }
            };

            textInput.addEventListener('input', (e) => {
              let val = e.target.value.trim();
              if (/^[0-9a-fA-F]{6}$/.test(val)) {
                val = '#' + val;
              } else if (/^[0-9a-fA-F]{3}$/.test(val)) {
                val = '#' + val;
              }
              updateValueDirectly(val);
              if (val.startsWith('#') && (val.length === 7 || val.length === 4)) {
                let hex = val;
                if (hex.length === 4) {
                  hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
                }
                picker.value = hex.toLowerCase();
              } else if (val.startsWith('rgba') || val.startsWith('rgb')) {
                const matches = val.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*/i);
                if (matches) {
                  const r = parseInt(matches[1]).toString(16).padStart(2, '0');
                  const g = parseInt(matches[2]).toString(16).padStart(2, '0');
                  const b = parseInt(matches[3]).toString(16).padStart(2, '0');
                  picker.value = `#${r}${g}${b}`.toLowerCase();
                }
              }
            });

            textInput.addEventListener('change', handleTextChangeOrBlur);
            textInput.addEventListener('blur', handleTextChangeOrBlur);
          } else {
            textInput.addEventListener('input', (e) => {
              let val = e.target.value.trim();
              if (idKey === 'global-bg-image') {
                val = (val === '' || val === 'none') ? 'none' : `url("${val}")`;
              }
              updateValueDirectly(val);
            });
            textInput.addEventListener('change', (e) => {
              let val = e.target.value.trim();
              if (idKey === 'global-bg-image') {
                val = (val === '' || val === 'none') ? 'none' : `url("${val}")`;
              }
              commitValue(val);
            });
            textInput.addEventListener('blur', (e) => {
              let val = e.target.value.trim();
              if (idKey === 'global-bg-image') {
                val = (val === '' || val === 'none') ? 'none' : `url("${val}")`;
              }
              commitValue(val);
            });
          }
        }

        if (range) {
          const unit = sliderUnits[idKey] || '';
          range.addEventListener('input', (e) => {
            let val = e.target.value;
            val = val + unit;
            updateValueDirectly(val);
          });
          range.addEventListener('change', (e) => {
            let val = e.target.value;
            val = val + unit;
            commitValue(val);
          });
        }

        if (select) {
          select.addEventListener('change', (e) => {
            if (idKey === 'link-decoration') {
              const val = e.target.value;
              let dec = 'none';
              let border = 'none';
              if (val === 'dashed') {
                border = '1px dashed var(--interactive-accent)';
              } else if (val === 'underline') {
                dec = 'underline';
              }
              themeVariables.dark['--link-decoration'] = dec;
              themeVariables.dark['--link-border-bottom'] = border;
              themeVariables.light['--link-decoration'] = dec;
              themeVariables.light['--link-border-bottom'] = border;
              applyThemeToPreview();
              triggerAutoSave();
            } else {
              commitValue(e.target.value);
            }
          });
        }
      }

      // Geometría de callouts: los valores numéricos se ajustan sólo con deslizadores.
      const paddingVertical = document.getElementById('range-callout-padding-vertical');
      const paddingHorizontal = document.getElementById('range-callout-padding-horizontal');
      const calloutMargin = document.getElementById('range-callout-margin');
      const calloutTitleSpacing = document.getElementById('range-callout-title-spacing');

      const setGlobalThemeValue = (variable, value, commit) => {
        updatePreviewVariableDirectly(variable, value);
        if (commit) {
          themeVariables.dark[variable] = value;
          themeVariables.light[variable] = value;
          applyThemeToPreview();
          triggerAutoSave();
        }
      };

      const syncCalloutPadding = (commit) => {
        if (!paddingVertical || !paddingHorizontal) return;
        const value = `${paddingVertical.value}px ${paddingHorizontal.value}px`;
        const label = document.getElementById('val-callout-padding');
        const input = document.getElementById('text-callout-padding');
        if (label) label.textContent = value;
        if (input) input.value = value;
        setGlobalThemeValue('--callout-padding', value, commit);
      };
      const syncCalloutMargin = (commit) => {
        if (!calloutMargin) return;
        const value = `${calloutMargin.value}rem 0`;
        const label = document.getElementById('val-callout-margin');
        const input = document.getElementById('text-callout-margin');
        if (label) label.textContent = value;
        if (input) input.value = value;
        setGlobalThemeValue('--callout-margin', value, commit);
      };
      const syncCalloutTitleSpacing = (commit) => {
        if (!calloutTitleSpacing) return;
        const value = `${calloutTitleSpacing.value}px`;
        const label = document.getElementById('val-callout-title-spacing');
        const input = document.getElementById('text-callout-title-spacing');
        if (label) label.textContent = value;
        if (input) input.value = value;
        setGlobalThemeValue('--callout-title-spacing', value, commit);
      };

      [[paddingVertical, syncCalloutPadding], [paddingHorizontal, syncCalloutPadding], [calloutMargin, syncCalloutMargin], [calloutTitleSpacing, syncCalloutTitleSpacing]].forEach(([control, sync]) => {
        if (!control) return;
        control.addEventListener('input', () => sync(false));
        control.addEventListener('change', () => sync(true));
      });

      const bindCalloutReset = (id, reset, sync) => {
        const button = document.getElementById(id);
        if (button) button.addEventListener('click', () => {
          reset();
          sync(true);
        });
      };
      bindCalloutReset('reset-callout-padding', () => { paddingVertical.value = 12; paddingHorizontal.value = 16; }, syncCalloutPadding);
      bindCalloutReset('reset-callout-margin', () => { calloutMargin.value = 1.2; }, syncCalloutMargin);
      bindCalloutReset('reset-callout-title-spacing', () => { calloutTitleSpacing.value = 6; }, syncCalloutTitleSpacing);

      // Sincronización de Controles del Modo Básico Especiales
      const basicAccentPicker = document.getElementById('picker-basic-accent');
      const basicAccentText = document.getElementById('text-basic-accent');
      const basicAccentVars = [
        '--interactive-accent',
        '--interactive-accent-hover',
        '--link-color',
        '--link-color-hover',
        '--tag-color',
        '--callout-border-color',
        '--canvas-arrow-color',
        '--button-primary-background',
        '--checkbox-checked-color'
      ];
      
      const applyBasicAccentDirect = (colorVal) => {
        basicAccentVars.forEach(v => {
          updatePreviewVariableDirectly(v, colorVal);
        });
        updateSwatchPreview('basic-accent', colorVal);
      };

      const applyBasicAccentCommit = (colorVal) => {
        basicAccentVars.forEach(v => {
          themeVariables[currentMode][v] = colorVal;
        });
        updateSwatchPreview('basic-accent', colorVal);
        applyThemeToPreview();
        updateControlPanelInputs();
        triggerAutoSave();
      };

      basicAccentPicker.addEventListener('input', (e) => {
        basicAccentText.value = e.target.value;
        applyBasicAccentDirect(e.target.value);
      });
      basicAccentPicker.addEventListener('change', (e) => {
        applyBasicAccentCommit(e.target.value);
      });

      basicAccentText.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (/^[0-9a-fA-F]{6}$/.test(val) || /^[0-9a-fA-F]{3}$/.test(val)) {
          val = '#' + val;
        }
        applyBasicAccentDirect(val);
        if (val.startsWith('#') && (val.length === 7 || val.length === 4)) {
          let hex = val;
          if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
          }
          basicAccentPicker.value = hex.toLowerCase();
        }
      });
      const handleBasicAccentTextCommit = (e) => {
        let val = e.target.value.trim();
        if (/^[0-9a-fA-F]{6}$/.test(val) || /^[0-9a-fA-F]{3}$/.test(val)) {
          val = '#' + val;
          e.target.value = val;
        }
        applyBasicAccentCommit(val);
      };
      basicAccentText.addEventListener('change', handleBasicAccentTextCommit);
      basicAccentText.addEventListener('blur', handleBasicAccentTextCommit);

      const basicBgPicker = document.getElementById('picker-basic-bg');
      const basicBgText = document.getElementById('text-basic-bg');
      
      const applyBasicBgDirect = (colorVal) => {
        updatePreviewVariableDirectly('--background-primary', colorVal);
        updateSwatchPreview('basic-bg', colorVal);
      };

      const applyBasicBgCommit = (colorVal) => {
        themeVariables[currentMode]['--background-primary'] = colorVal;
        updateSwatchPreview('basic-bg', colorVal);
        applyThemeToPreview();
        updateControlPanelInputs();
        triggerAutoSave();
      };

      basicBgPicker.addEventListener('input', (e) => {
        basicBgText.value = e.target.value;
        applyBasicBgDirect(e.target.value);
      });
      basicBgPicker.addEventListener('change', (e) => {
        applyBasicBgCommit(e.target.value);
      });

      basicBgText.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (/^[0-9a-fA-F]{6}$/.test(val) || /^[0-9a-fA-F]{3}$/.test(val)) {
          val = '#' + val;
        }
        applyBasicBgDirect(val);
        if (val.startsWith('#') && (val.length === 7 || val.length === 4)) {
          let hex = val;
          if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
          }
          basicBgPicker.value = hex.toLowerCase();
        }
      });
      const handleBasicBgTextCommit = (e) => {
        let val = e.target.value.trim();
        if (/^[0-9a-fA-F]{6}$/.test(val) || /^[0-9a-fA-F]{3}$/.test(val)) {
          val = '#' + val;
          e.target.value = val;
        }
        applyBasicBgCommit(val);
      };
      basicBgText.addEventListener('change', handleBasicBgTextCommit);
      basicBgText.addEventListener('blur', handleBasicBgTextCommit);

      document.getElementById('select-basic-font').addEventListener('change', (e) => {
        themeVariables.dark['--font-text'] = e.target.value;
        themeVariables.light['--font-text'] = e.target.value;
        applyThemeToPreview();
        updateControlPanelInputs();
        triggerAutoSave();
      });

      document.getElementById('select-button-font').addEventListener('change', (e) => {
        themeVariables.dark['--button-font-family'] = e.target.value;
        themeVariables.light['--button-font-family'] = e.target.value;
        applyThemeToPreview();
        updateControlPanelInputs();
        triggerAutoSave();
      });

      const basicRadiusRange = document.getElementById('range-basic-radius');
      basicRadiusRange.addEventListener('input', (e) => {
        const val = e.target.value + 'px';
        updatePreviewVariableDirectly('--radius-m', val);
        updatePreviewVariableDirectly('--callout-radius', val);
      });
      basicRadiusRange.addEventListener('change', (e) => {
        const val = e.target.value + 'px';
        themeVariables.dark['--radius-m'] = val;
        themeVariables.light['--radius-m'] = val;
        themeVariables.dark['--callout-radius'] = val;
        themeVariables.light['--callout-radius'] = val;
        applyThemeToPreview();
        updateControlPanelInputs();
        triggerAutoSave();
      });

      document.getElementById('toggle-table-row-hover').addEventListener('change', (e) => {
        const active = e.target.checked;
        const textInput = document.getElementById('text-table-row-hover-bg');
        let val = 'transparent';
        if (active) {
          const inheritedHover = colorWithAlpha(themeVariables[currentMode]['--interactive-accent'], 0.08);
          val = (textInput ? textInput.value.trim() : '') || inheritedHover;
          if (val === 'transparent') val = inheritedHover;
        }
        themeVariables.dark['--table-row-hover-bg'] = val;
        themeVariables.light['--table-row-hover-bg'] = val;
        applyThemeToPreview();
        updateControlPanelInputs();
        triggerAutoSave();
      });

      // Toggles de cambio de Vistas en Ribbon
      const views = {
        'btn-view-notes': 'view-editor',
        'btn-view-canvas': 'view-canvas'
      };
      Object.entries(views).forEach(([btnId, viewId]) => {
        document.getElementById(btnId).addEventListener('click', () => {
          Object.keys(views).forEach(b => document.getElementById(b).classList.remove('active'));
          Object.values(views).forEach(v => {
            document.getElementById(v).classList.remove('active');
            document.getElementById(v).style.display = (v === 'view-editor') ? '' : 'none';
          });
          document.getElementById('view-database').classList.remove('active');
          document.getElementById('view-database').style.display = 'none';

          document.getElementById(btnId).classList.add('active');
          activeRibbonView = viewId;

          if (viewId === 'view-editor' && activeNoteId === 'database') {
            document.getElementById('view-database').classList.add('active');
          } else {
            document.getElementById(viewId).classList.add('active');
            if (viewId !== 'view-editor') {
              document.getElementById(viewId).style.display = 'block';
            }
          }
        });
      });

      // Toggles de Edición vs Lectura
      const btnViewEdit = document.getElementById('btn-view-edit');
      const btnViewReading = document.getElementById('btn-view-reading');
      const editorWrapper = document.getElementById('editor-wrapper');
      btnViewEdit.addEventListener('click', () => {
        btnViewEdit.classList.add('active'); btnViewReading.classList.remove('active');
        document.getElementById('obsidian-window').classList.remove('reading-view');
      });
      btnViewReading.addEventListener('click', () => {
        btnViewReading.classList.add('active'); btnViewEdit.classList.remove('active');
        document.getElementById('obsidian-window').classList.add('reading-view');
      });

      // Selector de Simulación de S.O. (macOS vs Windows)
      const selectOsSim = document.getElementById('select-os-sim');
      if (selectOsSim) {
        selectOsSim.addEventListener('change', (e) => {
          const val = e.target.value;
          const windowEl = document.getElementById('obsidian-window');
          if (windowEl) {
            if (val === 'windows') {
              windowEl.classList.remove('macos-view');
              windowEl.classList.add('windows-view');
              showToast('Simulando ventana de Windows');
            } else {
              windowEl.classList.remove('windows-view');
              windowEl.classList.add('macos-view');
              showToast('Simulando ventana de macOS');
            }
          }
        });
      }

      // Navegación Notas
      document.querySelectorAll('[data-note]').forEach(trigger => {
        trigger.addEventListener('click', () => {
          loadMockNote(trigger.getAttribute('data-note'));
        });
      });

      // Inspector Gotero
      const btnInspector = document.getElementById('btn-inspector');
      const obsWindow = document.getElementById('obsidian-window');
      const inspectorLabels = {
        'p-spacing': 'Espacio entre bloques de texto (Enter)',
        'callout-margin': 'Espacio entre callouts',
        'line-height-normal': 'Altura de los bloques de texto',
        'heading-spacing': 'Espacio antes de los títulos',
        'h1-margin-bottom': 'Separación después de H1',
        'h2-margin-bottom': 'Separación después de H2',
        'h3-margin-bottom': 'Separación después de H3',
        'h4-margin-bottom': 'Separación después de H4',
        'h5-margin-bottom': 'Separación después de H5',
        'h6-margin-bottom': 'Separación después de H6',
        'list-spacing': 'Separación entre viñetas',
        'list-line-height': 'Altura de línea de viñetas'
      };
      let currentInspectorTarget = null;
      let inspectorLabel = document.getElementById('inspector-target-label');
      if (!inspectorLabel) {
        inspectorLabel = document.createElement('div');
        inspectorLabel.id = 'inspector-target-label';
        document.body.appendChild(inspectorLabel);
      }

      const clearInspectorTarget = () => {
        if (currentInspectorTarget) currentInspectorTarget.classList.remove('inspector-target-current');
        currentInspectorTarget = null;
        inspectorLabel.style.display = 'none';
      };

      const clearPreviousInspectorFocus = () => {
        document.querySelectorAll('.inspector-focus').forEach((element) => {
          element.classList.remove('inspector-focus', 'highlight-pulse');
          element.removeAttribute('data-inspector-focus');
        });
        document.querySelectorAll('.control-panel.inspector-focus-mode').forEach((panel) => {
          panel.classList.remove('inspector-focus-mode');
        });
        document.querySelectorAll('.inspector-reset-view').forEach((button) => button.remove());
        document.querySelectorAll('.hsl-sliders-panel').forEach((panel) => panel.remove());
      };

      const getSpacingTarget = (event) => {
        const content = event.target.closest('.editor-body-content');
        if (!content) return null;
        const blocks = Array.from(content.children).filter(block => block.getClientRects().length);
        for (let index = 0; index < blocks.length - 1; index += 1) {
          const previous = blocks[index].getBoundingClientRect();
          const next = blocks[index + 1].getBoundingClientRect();
          if (next.top > previous.bottom && event.clientY >= previous.bottom && event.clientY <= next.top) {
            const involvesCallout = blocks[index].classList.contains('callout') || blocks[index + 1].classList.contains('callout');
            return { element: blocks[index + 1], key: involvesCallout ? 'callout-margin' : 'p-spacing' };
          }
        }
        return null;
      };

      const getInspectorSelection = (event) => {
        // La cinta tiene dos zonas editables distintas: el glifo (color) y el
        // área libre del botón (fondo). Priorizarla evita que el atributo del
        // contenedor o el estado hover determinen el ajuste por accidente.
        const ribbonItem = event.target.closest('.ribbon-icon');
        if (ribbonItem) {
          const isActive = ribbonItem.classList.contains('active');
          const isGlyph = Boolean(event.target.closest('svg'));
          return {
            element: isGlyph ? event.target.closest('svg') : ribbonItem,
            key: isGlyph
              ? (isActive ? 'ribbon-item-active' : 'ribbon-item-hover')
              : (isActive ? 'ribbon-bg-active' : 'ribbon-bg-hover')
          };
        }

        const spacingTarget = getSpacingTarget(event);
        if (spacingTarget) return spacingTarget;

        const headingTarget = event.target.closest(
          '.editor-body-content > h1, .editor-body-content > h2, .editor-body-content > h3, ' +
          '.editor-body-content > h4, .editor-body-content > h5, .editor-body-content > h6'
        );
        if (headingTarget) {
          return {
            element: headingTarget,
            key: `${headingTarget.tagName.toLowerCase()}-margin-bottom`
          };
        }

        // La superficie del párrafo abre su separación exterior. La altura de
        // línea permanece disponible justo al lado en Espaciado y estructura.
        // Los elementos inline conservan sus propios ajustes de color.
        const inlineTextTarget = event.target.closest('a, strong, em, mark, code, s');
        const textBlock = event.target.closest('.editor-body-content > .editor-p, .editor-body-content > p');
        if (textBlock && !inlineTextTarget) {
          return { element: textBlock, key: 'p-spacing' };
        }

        // Una viñeta representa la separación vertical de su lista. El color del
        // marcador sigue disponible desde el panel, pero el gotero sobre un ítem
        // debe llevar al control que afecta su distribución.
        const listItem = event.target.closest('.editor-body-content li');
        if (listItem) return { element: listItem, key: 'list-spacing' };

        const element = event.target.closest('[data-inspect-target]');
        return element ? { element, key: element.getAttribute('data-inspect-target') } : null;
      };

      const updateInspectorTarget = (event) => {
        if (!isInspectorActive) return;
        const selection = getInspectorSelection(event);
        if (!selection || !obsWindow.contains(selection.element)) {
          clearInspectorTarget();
          return;
        }
        const { element: target, key } = selection;

        if (currentInspectorTarget !== target) {
          clearInspectorTarget();
          currentInspectorTarget = target;
          currentInspectorTarget.classList.add('inspector-target-current');
        }
        inspectorLabel.textContent = `Ajustar: ${inspectorLabels[key] || key}`;
        inspectorLabel.style.left = `${event.clientX + 16}px`;
        inspectorLabel.style.top = `${event.clientY + 16}px`;
        inspectorLabel.style.display = 'block';
      };

      if (btnInspector) {
        btnInspector.addEventListener('click', () => {
          isInspectorActive = !isInspectorActive;
          if (isInspectorActive) {
            // Cada nueva captura comienza limpia: no debe quedar abierto ni
            // resaltado el control de la captura anterior.
            clearPreviousInspectorFocus();
            btnInspector.classList.add('active');
            if (obsWindow) obsWindow.classList.add('inspector-active');
            showToast('Gotero activo: pasa sobre un elemento para ver el ajuste que se abrirá');
          } else {
            btnInspector.classList.remove('active');
            if (obsWindow) obsWindow.classList.remove('inspector-active');
            clearInspectorTarget();
          }
        });
      }

      if (obsWindow) {
        obsWindow.addEventListener('mousemove', updateInspectorTarget);
        obsWindow.addEventListener('mouseleave', clearInspectorTarget);
        obsWindow.addEventListener('click', (e) => {
          if (!isInspectorActive) return;
          
          const selection = getInspectorSelection(e);
          if (selection) {
            e.preventDefault();
            e.stopPropagation();
            
            const { key } = selection;
            
            // Desactivar gotero
            isInspectorActive = false;
            if (btnInspector) btnInspector.classList.remove('active');
            obsWindow.classList.remove('inspector-active');
            clearInspectorTarget();
            
            // Enfocar el input correspondiente
            focusSettingInput(key);
          }
        }, true); // fase de captura
      }

      document.getElementById('header-meta-name').addEventListener('input', triggerAutoSave);
      document.getElementById('meta-author').addEventListener('input', triggerAutoSave);
      document.getElementById('meta-description').addEventListener('input', triggerAutoSave);

      document.getElementById('btn-download-theme').addEventListener('click', triggerDownloadAndOffboarding);
      document.getElementById('btn-back-editor').addEventListener('click', () => showScreen('workspace'));
      document.getElementById('btn-go-home').addEventListener('click', () => showScreen('onboarding'));

      // ======================================================================
      // EVENTOS DE LA VISTA DE BASE DE DATOS (Plugin de Bases / .base)
      // ======================================================================
      const dbViewBtn = document.getElementById('db-view-selector-btn');
      const dbViewDropdown = document.getElementById('db-view-dropdown');
      const dbSelTable = document.getElementById('db-sel-table');
      const dbSelGrid = document.getElementById('db-sel-grid');
      const dbActiveName = document.getElementById('db-active-view-name');
      const dbActiveIcon = document.getElementById('db-active-view-icon');
      
      const dbViewTableContent = document.getElementById('db-view-table-content');
      const dbViewGridContent = document.getElementById('db-view-grid-content');

      const dbBtnSort = document.getElementById('db-btn-sort');
      const dbSortPopover = document.getElementById('db-sort-popover');

      const dbBtnProperties = document.getElementById('db-btn-properties');
      const dbPropertiesPopover = document.getElementById('db-properties-popover');

      const dbBtnSearch = document.getElementById('db-btn-search');
      const dbSearchRow = document.getElementById('db-search-row');
      const dbSearchField = document.getElementById('db-search-field');
      const dbResultsCount = document.getElementById('db-results-count');

      // Toggles de Popovers y Dropdowns
      if (dbViewBtn && dbViewDropdown) {
        dbViewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dbViewDropdown.style.display = dbViewDropdown.style.display === 'block' ? 'none' : 'block';
          if (dbSortPopover) dbSortPopover.style.display = 'none';
          if (dbPropertiesPopover) dbPropertiesPopover.style.display = 'none';
        });
      }

      if (dbBtnSort && dbSortPopover) {
        dbBtnSort.addEventListener('click', (e) => {
          e.stopPropagation();
          dbSortPopover.style.display = dbSortPopover.style.display === 'block' ? 'none' : 'block';
          if (dbViewDropdown) dbViewDropdown.style.display = 'none';
          if (dbPropertiesPopover) dbPropertiesPopover.style.display = 'none';
        });
      }

      if (dbBtnProperties && dbPropertiesPopover) {
        dbBtnProperties.addEventListener('click', (e) => {
          e.stopPropagation();
          dbPropertiesPopover.style.display = dbPropertiesPopover.style.display === 'block' ? 'none' : 'block';
          if (dbViewDropdown) dbViewDropdown.style.display = 'none';
          if (dbSortPopover) dbSortPopover.style.display = 'none';
        });
      }

      if (dbBtnSearch && dbSearchRow) {
        dbBtnSearch.addEventListener('click', (e) => {
          e.stopPropagation();
          const isHidden = dbSearchRow.style.display === 'none' || dbSearchRow.style.display === '';
          dbSearchRow.style.display = isHidden ? 'block' : 'none';
          if (isHidden && dbSearchField) {
            dbSearchField.focus();
          }
        });
      }

      // Cerrar popovers al hacer click fuera
      document.addEventListener('click', () => {
        if (dbViewDropdown) dbViewDropdown.style.display = 'none';
        if (dbSortPopover) dbSortPopover.style.display = 'none';
        if (dbPropertiesPopover) dbPropertiesPopover.style.display = 'none';
      });

      // Detener propagación para clicks dentro de los popovers
      [dbViewDropdown, dbSortPopover, dbPropertiesPopover].forEach(pop => {
        if (pop) {
          pop.addEventListener('click', (e) => e.stopPropagation());
        }
      });

      // Seleccionar Vista: Tabla
      if (dbSelTable) {
        dbSelTable.addEventListener('click', () => {
          dbActiveName.textContent = 'Tabla';
          dbActiveIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`;
          
          dbViewTableContent.style.display = 'block';
          dbViewGridContent.style.display = 'none';
          
          dbSelTable.classList.add('active');
          if (dbSelGrid) dbSelGrid.classList.remove('active');
          if (dbViewDropdown) dbViewDropdown.style.display = 'none';
          
          filterDatabaseContent();
        });
      }

      // Seleccionar Vista: Tarjetas (Grid)
      if (dbSelGrid) {
        dbSelGrid.addEventListener('click', () => {
          dbActiveName.textContent = 'Vista';
          dbActiveIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`;
          
          dbViewTableContent.style.display = 'none';
          dbViewGridContent.style.display = 'block';
          
          dbSelGrid.classList.add('active');
          if (dbSelTable) dbSelTable.classList.remove('active');
          if (dbViewDropdown) dbViewDropdown.style.display = 'none';
          
          filterDatabaseContent();
        });
      }

      // Filtrado en vivo de base de datos
      function filterDatabaseContent() {
        if (!dbSearchField) return;
        const query = dbSearchField.value.toLowerCase().trim();
        let visibleCount = 0;

        if (dbViewTableContent && dbViewTableContent.style.display !== 'none') {
          // Filtrar Filas de la Tabla
          const rows = dbViewTableContent.querySelectorAll('.bases-tbody .bases-tr');
          rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query)) {
              row.style.display = '';
              visibleCount++;
            } else {
              row.style.display = 'none';
            }
          });
        } else if (dbViewGridContent && dbViewGridContent.style.display !== 'none') {
          // Filtrar Tarjetas de la Cuadrícula
          const cards = dbViewGridContent.querySelectorAll('.bases-cards-item');
          cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
              card.style.display = 'flex';
              visibleCount++;
            } else {
              card.style.display = 'none';
            }
          });
        }

        if (dbResultsCount) {
          dbResultsCount.textContent = `${visibleCount} resultados`;
        }
      }

      if (dbSearchField) {
        dbSearchField.addEventListener('input', filterDatabaseContent);
      }

      // Clicks interactivos en links/tarjetas de la base de datos
      const dbLinks = document.querySelectorAll('.db-link');
      dbLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const name = link.textContent.trim();
          showToast(`Abriendo nota: ${name}`);
        });
      });

      const dbCards = document.querySelectorAll('.bases-cards-item');
      dbCards.forEach(card => {
        card.addEventListener('click', () => {
          const name = card.textContent.trim();
          if (name.includes('Ayudas de juego')) {
            loadMockNote('database');
          } else {
            showToast(`Abriendo archivo: ${name}`);
          }
        });
      });

      // --- CONTROLES DE LA PESTAÑA OPCIONES SIMULADA ---
      const optionsSidebar = document.querySelector('#view-options .simulated-settings-sidebar');
      if (optionsSidebar) {
        optionsSidebar.querySelectorAll('.simulated-settings-sidebar-item').forEach(item => {
          item.addEventListener('click', () => {
            // Remove active from all sidebar items
            optionsSidebar.querySelectorAll('.simulated-settings-sidebar-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const targetTab = item.getAttribute('data-settings-tab');
            const sectAcerca = document.getElementById('settings-sect-acerca');
            const sectEditor = document.getElementById('settings-sect-editor');
            const sectApariencia = document.getElementById('settings-sect-apariencia');
            const sectGeneric = document.getElementById('settings-sect-generic');
            
            if (targetTab === 'acerca') {
              sectAcerca.style.display = 'block';
              sectEditor.style.display = 'none';
              sectApariencia.style.display = 'none';
              sectGeneric.style.display = 'none';
            } else if (targetTab === 'editor') {
              sectAcerca.style.display = 'none';
              sectEditor.style.display = 'block';
              sectApariencia.style.display = 'none';
              sectGeneric.style.display = 'none';

              const paragraphSpacing = themeVariables[currentMode]['--p-spacing'] || '0.8em';
              const spacingSlider = document.getElementById('settings-paragraph-spacing');
              const spacingValue = document.getElementById('settings-paragraph-spacing-value');
              if (spacingSlider) spacingSlider.value = parseFloat(paragraphSpacing);
              if (spacingValue) spacingValue.textContent = paragraphSpacing;
            } else if (targetTab === 'apariencia') {
              sectAcerca.style.display = 'none';
              sectEditor.style.display = 'none';
              sectApariencia.style.display = 'block';
              sectGeneric.style.display = 'none';
              
              // Sync the appearance tab theme dropdown and colors when opened
              const selectTheme = document.getElementById('simulated-theme-selector-options');
              if (selectTheme) {
                selectTheme.value = currentMode;
                selectTheme.options[0].text = `Adaptar al sistema (${currentMode === 'dark' ? 'Oscuro' : 'Claro'})`;
              }
              const accentCircle = document.getElementById('options-accent-circle');
              const accentPicker = document.getElementById('options-accent-picker');
              const currentAccentColor = themeVariables[currentMode]['--interactive-accent'] || getOfficialDefault(currentMode, '--interactive-accent');
              if (accentCircle) {
                accentCircle.style.backgroundColor = currentAccentColor;
              }
              if (accentPicker) {
                accentPicker.value = currentAccentColor;
              }
            } else {
              sectAcerca.style.display = 'none';
              sectEditor.style.display = 'none';
              sectApariencia.style.display = 'none';
              sectGeneric.style.display = 'block';
              
              const genericTitle = document.getElementById('sect-generic-title');
              if (genericTitle) {
                genericTitle.textContent = item.textContent;
              }
            }
          });
        });
      }

      // Sync toggle ribbon inside Options -> Appearance
      const optionsToggleRibbon = document.getElementById('options-toggle-ribbon');
      if (optionsToggleRibbon) {
        optionsToggleRibbon.addEventListener('change', (e) => {
          const showRibbon = e.target.checked;
          const ribbon = document.querySelector('.obsidian-ribbon');
          if (ribbon) {
            ribbon.style.display = showRibbon ? 'flex' : 'none';
          }
        });
      }
    }

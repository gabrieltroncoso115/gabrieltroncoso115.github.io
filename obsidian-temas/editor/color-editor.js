// Editor avanzado de color y acciones de controles



    function injectActionButtons() {
      // 1. Color input wrappers
      document.querySelectorAll('.color-input-wrapper').forEach(wrapper => {
        try {
          const textInput = wrapper.querySelector('input[type="text"]');
          const colorInput = wrapper.querySelector('input[type="color"]');
          if (!textInput || !colorInput) return;
          const id = (textInput || colorInput).id;
          const key = id.replace('text-', '').replace('picker-', '');

          // Swatch de color personalizado
          const swatchBtn = document.createElement('div');
          swatchBtn.className = 'color-swatch-btn';
          swatchBtn.id = `swatch-${key}`;
          
          const swatchFill = document.createElement('div');
          swatchFill.className = 'color-swatch-btn-fill';
          swatchBtn.appendChild(swatchFill);

          // Reemplazar input de color nativo
          colorInput.parentNode.replaceChild(swatchBtn, colorInput);

          // Evento click para abrir/cerrar panel HSL
          swatchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleHslPanel(key, wrapper);
          });

          // Configurar previsualización inicial
          updateSwatchPreview(key);

          appendActionButtons(wrapper, key, 'color');
        } catch (err) {
          console.error("Error al inyectar swatch de color:", err);
        }
      });

      // 2. Sliders
      document.querySelectorAll('.slider-container').forEach(container => {
        const rangeInput = container.querySelector('input[type="range"]');
        if (!rangeInput) return;
        const key = rangeInput.id.replace('range-', '');
        appendActionButtons(container, key, 'range');
      });

      // 3. Select fields
      document.querySelectorAll('.select-input-field').forEach(select => {
        const key = select.id.replace('select-', '');
        
        // Wrap select in a flex container so buttons align next to it
        const wrapper = document.createElement('div');
        wrapper.className = 'select-action-wrapper';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '8px';
        wrapper.style.width = '100%';
        
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);
        
        appendActionButtons(wrapper, key, 'select');
      });
    }

    function hsvToHsl(h, s, v) {
      s /= 100;
      v /= 100;
      let l = v * (1 - s / 2);
      let hslS = 0;
      if (l > 0 && l < 1) {
        hslS = (v - l) / Math.min(l, 1 - l);
      }
      return {
        h: h,
        s: Math.round(hslS * 100),
        l: Math.round(l * 100)
      };
    }

    function hslToHsv(h, s, l) {
      s /= 100;
      l /= 100;
      let v = l + s * Math.min(l, 1 - l);
      let hsvS = 0;
      if (v > 0) {
        hsvS = 2 * (1 - l / v);
      }
      return {
        h: h,
        s: Math.round(hsvS * 100),
        v: Math.round(v * 100)
      };
    }

    function hslToRgb(h, s, l) {
      s /= 100;
      l /= 100;
      let c = (1 - Math.abs(2 * l - 1)) * s;
      let x = c * (1 - Math.abs((h / 60) % 2 - 1));
      let m = l - c / 2;
      let r = 0, g = 0, b = 0;
      if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
      } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
      } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
      } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
      } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
      } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
      }
      return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
      };
    }

    function rgbToHex(r, g, b) {
      return [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    let activeHslPanel = null;
    let activeHslKey = null;

    function toggleHslPanel(key, wrapper) {
      const inputGroup = wrapper.closest('.input-group');
      if (!inputGroup) return;

      const existingPanel = inputGroup.querySelector('.hsl-sliders-panel');
      if (existingPanel) {
        existingPanel.remove();
        if (activeHslKey === key) {
          activeHslKey = null;
          activeHslPanel = null;
          return;
        }
      }

      if (activeHslPanel) {
        activeHslPanel.remove();
      }

      const panel = document.createElement('div');
      panel.className = 'hsl-sliders-panel';

      let currentVal = '';
      if (key.startsWith('basic-')) {
        const input = document.getElementById(`text-${key}`);
        if (input) currentVal = input.value;
      } else {
        const cssVar = inputMappings[key];
        if (cssVar) currentVal = themeVariables[currentMode][cssVar];
      }

      const hsla = parseColorToHSLA(currentVal || getOfficialDefault(currentMode, '--text-normal'));
      
      let currentH = hsla.h;
      const initialHsv = hslToHsv(hsla.h, hsla.s, hsla.l);
      let currentS_v = initialHsv.s;
      let currentV = initialHsv.v;
      let currentA = hsla.a;
      
      let currentFormat = 'hex';
      const cleanVal = (currentVal || '').trim().toLowerCase();
      if (cleanVal.startsWith('rgb')) {
        currentFormat = 'rgb';
      } else if (cleanVal.startsWith('hsl')) {
        currentFormat = 'hsl';
      }

      // 1. SV Canvas
      const canvasContainer = document.createElement('div');
      canvasContainer.className = 'color-picker-canvas-container';
      
      const canvasBase = document.createElement('div');
      canvasBase.className = 'color-picker-canvas';
      canvasBase.style.backgroundColor = `hsl(${currentH}, 100%, 50%)`;
      
      const overlayWhite = document.createElement('div');
      overlayWhite.className = 'canvas-overlay-white';
      
      const overlayBlack = document.createElement('div');
      overlayBlack.className = 'canvas-overlay-black';
      
      const marker = document.createElement('div');
      marker.className = 'canvas-marker';
      
      canvasContainer.appendChild(canvasBase);
      canvasContainer.appendChild(overlayWhite);
      canvasContainer.appendChild(overlayBlack);
      canvasContainer.appendChild(marker);
      panel.appendChild(canvasContainer);

      // 2. Hue Slider Wrapper
      const hueWrapper = document.createElement('div');
      hueWrapper.className = 'color-picker-slider-wrapper';
      
      const hueInput = document.createElement('input');
      hueInput.type = 'range';
      hueInput.className = 'color-picker-slider';
      hueInput.min = '0';
      hueInput.max = '360';
      hueInput.value = currentH;
      hueInput.style.background = 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)';
      
      hueWrapper.appendChild(hueInput);
      panel.appendChild(hueWrapper);

      // 3. Opacity Slider Wrapper
      const opacityWrapper = document.createElement('div');
      opacityWrapper.className = 'color-picker-slider-wrapper';
      
      const checkerboard = document.createElement('div');
      checkerboard.className = 'opacity-slider-checkerboard';
      
      const opacityOverlay = document.createElement('div');
      opacityOverlay.className = 'opacity-slider-overlay';
      
      const opacityInput = document.createElement('input');
      opacityInput.type = 'range';
      opacityInput.className = 'opacity-slider-input';
      opacityInput.min = '0';
      opacityInput.max = '1';
      opacityInput.step = '0.01';
      opacityInput.value = currentA;
      
      checkerboard.appendChild(opacityOverlay);
      checkerboard.appendChild(opacityInput);
      opacityWrapper.appendChild(checkerboard);
      panel.appendChild(opacityWrapper);

      // 4. Footer
      const footer = document.createElement('div');
      footer.className = 'color-picker-footer';
      
      const preview = document.createElement('div');
      preview.className = 'color-picker-preview';
      
      const previewFill = document.createElement('div');
      previewFill.className = 'color-picker-preview-fill';
      preview.appendChild(previewFill);
      
      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'color-picker-input-wrapper';
      
      const prefixSpan = document.createElement('span');
      prefixSpan.className = 'color-picker-input-prefix';
      prefixSpan.textContent = '#';
      
      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.className = 'color-picker-input';
      
      inputWrapper.appendChild(prefixSpan);
      inputWrapper.appendChild(textInput);
      
      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'color-picker-copy-btn';
      copyBtn.title = 'Copiar color';
      copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;
      
      const formatSelect = document.createElement('select');
      formatSelect.className = 'color-picker-format-select';
      
      const optHex = document.createElement('option');
      optHex.value = 'hex';
      optHex.textContent = 'Hex';
      
      const optRgb = document.createElement('option');
      optRgb.value = 'rgb';
      optRgb.textContent = 'RGB';
      
      const optHsl = document.createElement('option');
      optHsl.value = 'hsl';
      optHsl.textContent = 'HSL';
      
      formatSelect.appendChild(optHex);
      formatSelect.appendChild(optRgb);
      formatSelect.appendChild(optHsl);
      formatSelect.value = currentFormat;
      
      footer.appendChild(preview);
      footer.appendChild(inputWrapper);
      footer.appendChild(copyBtn);
      footer.appendChild(formatSelect);
      panel.appendChild(footer);

      inputGroup.appendChild(panel);
      activeHslPanel = panel;
      activeHslKey = key;

      function applyColorChange(colorString, commit = false) {
        if (key.startsWith('basic-')) {
          const input = document.getElementById(`text-${key}`);
          if (input) {
            input.value = colorString;
            input.dispatchEvent(new Event(commit ? 'change' : 'input'));
          }
        } else {
          const cssVar = inputMappings[key];
          if (cssVar) {
            const textInputEl = document.getElementById(`text-${key}`);
            if (textInputEl) textInputEl.value = colorString;
            const valLabel = document.getElementById(`val-${key}`);
            if (valLabel) valLabel.textContent = colorString;

            if (commit) {
              themeVariables[currentMode][cssVar] = colorString;
              applyThemeToPreview();
              triggerAutoSave();
            } else {
              updatePreviewVariableDirectly(cssVar, colorString);
            }
          }
        }
        updateSwatchPreview(key, colorString);
      }

      function updateUI(updateText = true, commit = false) {
        canvasBase.style.backgroundColor = `hsl(${currentH}, 100%, 50%)`;
        
        marker.style.left = `${currentS_v}%`;
        marker.style.top = `${100 - currentV}%`;
        
        hueInput.value = currentH;
        opacityInput.value = currentA;
        
        const hsl = hsvToHsl(currentH, currentS_v, currentV);
        
        const rgbOpaque = hslToRgb(currentH, hsl.s, hsl.l);
        opacityOverlay.style.background = `linear-gradient(to right, rgba(${rgbOpaque.r}, ${rgbOpaque.g}, ${rgbOpaque.b}, 0), rgba(${rgbOpaque.r}, ${rgbOpaque.g}, ${rgbOpaque.b}, 1))`;
        
        // Calculate format specific color string
        let colorString = '';
        if (currentFormat === 'hex') {
          const hex = rgbToHex(rgbOpaque.r, rgbOpaque.g, rgbOpaque.b);
          if (currentA < 1) {
            const alphaHex = Math.round(currentA * 255).toString(16).padStart(2, '0').toUpperCase();
            colorString = '#' + hex + alphaHex;
          } else {
            colorString = '#' + hex;
          }
        } else if (currentFormat === 'rgb') {
          if (currentA < 1) {
            colorString = `rgba(${rgbOpaque.r}, ${rgbOpaque.g}, ${rgbOpaque.b}, ${currentA})`;
          } else {
            colorString = `rgb(${rgbOpaque.r}, ${rgbOpaque.g}, ${rgbOpaque.b})`;
          }
        } else if (currentFormat === 'hsl') {
          if (currentA < 1) {
            colorString = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${currentA})`;
          } else {
            colorString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
          }
        }

        // Preview uses a direct CSS color string
        previewFill.style.backgroundColor = colorString;
        
        if (updateText) {
          if (currentFormat === 'hex') {
            prefixSpan.style.display = 'inline';
            prefixSpan.textContent = '#';
            const hex = rgbToHex(rgbOpaque.r, rgbOpaque.g, rgbOpaque.b);
            if (currentA < 1) {
              const alphaHex = Math.round(currentA * 255).toString(16).padStart(2, '0').toUpperCase();
              textInput.value = hex + alphaHex;
            } else {
              textInput.value = hex;
            }
          } else {
            prefixSpan.style.display = 'none';
            textInput.value = colorString;
          }
        }
        
        applyColorChange(colorString, commit);
      }

      function handleCanvasDrag(e) {
        const rect = canvasContainer.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        x = Math.max(0, Math.min(rect.width, x));
        y = Math.max(0, Math.min(rect.height, y));
        
        currentS_v = Math.round((x / rect.width) * 100);
        currentV = Math.round((1 - (y / rect.height)) * 100);
        
        updateUI(true, false);
      }

      canvasContainer.addEventListener('mousedown', (e) => {
        handleCanvasDrag(e);
        
        function onMouseMove(moveEvent) {
          handleCanvasDrag(moveEvent);
        }
        
        function onMouseUp() {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          updateUI(true, true);
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      hueInput.addEventListener('input', () => {
        currentH = parseInt(hueInput.value);
        updateUI(true, false);
      });
      hueInput.addEventListener('change', () => {
        updateUI(true, true);
      });

      opacityInput.addEventListener('input', () => {
        currentA = parseFloat(opacityInput.value);
        updateUI(true, false);
      });
      opacityInput.addEventListener('change', () => {
        updateUI(true, true);
      });

      formatSelect.addEventListener('change', () => {
        currentFormat = formatSelect.value;
        updateUI(true, true);
      });

      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(textInput.value).then(() => {
          showToast('Color copiado al portapapeles!');
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--ui-accent);">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
          }, 1500);
        }).catch(err => {
          console.error('Error al copiar: ', err);
        });
      });

      function handleManualInput(commit = false) {
        let val = textInput.value.trim();
        if (currentFormat === 'hex') {
          if (val.startsWith('#')) {
            val = val.slice(1);
          }
          const hslaParsed = parseColorToHSLA('#' + val);
          if (hslaParsed) {
            currentH = hslaParsed.h;
            currentA = hslaParsed.a;
            const hsv = hslToHsv(hslaParsed.h, hslaParsed.s, hslaParsed.l);
            currentS_v = hsv.s;
            currentV = hsv.v;
            updateUI(false, commit);
          }
        } else {
          const hslaParsed = parseColorToHSLA(val);
          if (hslaParsed) {
            currentH = hslaParsed.h;
            currentA = hslaParsed.a;
            const hsv = hslToHsv(hslaParsed.h, hslaParsed.s, hslaParsed.l);
            currentS_v = hsv.s;
            currentV = hsv.v;
            updateUI(false, commit);
          }
        }
      }

      textInput.addEventListener('input', () => handleManualInput(false));
      textInput.addEventListener('change', () => handleManualInput(true));
      textInput.addEventListener('blur', () => handleManualInput(true));

      updateUI(true, false);
    }

    function updateSwatchPreview(key, optVal) {
      const swatch = document.getElementById(`swatch-${key}`);
      if (!swatch) return;
      const fill = swatch.querySelector('.color-swatch-btn-fill');
      if (!fill) return;

      let val = optVal;
      if (!val) {
        if (key.startsWith('basic-')) {
          const input = document.getElementById(`text-${key}`);
          if (input) val = input.value;
        } else {
          const cssVar = inputMappings[key];
          if (cssVar) val = themeVariables[currentMode][cssVar];
        }
      }

      if (val) {
        fill.style.backgroundColor = val;
      }
    }

    function parseColorToHSLA(colorStr) {
      colorStr = colorStr.trim().toLowerCase();
      let r = 255, g = 255, b = 255, a = 1;

      if (colorStr.startsWith('#')) {
        let hex = colorStr.slice(1);
        if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 4) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
          a = parseInt(hex[3] + hex[3], 16) / 255;
        } else if (hex.length === 6) {
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
        } else if (hex.length === 8) {
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
          a = parseInt(hex.slice(6, 8), 16) / 255;
        }
      } else if (colorStr.startsWith('rgb')) {
        const matches = colorStr.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
        if (matches) {
          r = parseInt(matches[1]);
          g = parseInt(matches[2]);
          b = parseInt(matches[3]);
          if (matches[4] !== undefined) a = parseFloat(matches[4]);
        }
      } else if (colorStr.startsWith('hsl')) {
        const matches = colorStr.match(/hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+))?\s*\)/);
        if (matches) {
          return {
            h: parseFloat(matches[1]),
            s: parseFloat(matches[2]),
            l: parseFloat(matches[3]),
            a: matches[4] !== undefined ? parseFloat(matches[4]) : 1
          };
        }
      }

      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
        a: a
      };
    }

    function hslaToRgbaString(h, s, l, a) {
      s /= 100;
      l /= 100;
      let c = (1 - Math.abs(2 * l - 1)) * s;
      let x = c * (1 - Math.abs((h / 60) % 2 - 1));
      let m = l - c / 2;
      let r = 0, g = 0, b = 0;

      if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
      } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
      } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
      } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
      } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
      } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      if (a === 1) {
        return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
      }
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    function appendActionButtons(parentEl, key, type) {
      // Droplet (eyedropper) button for color inputs
      if (type === 'color') {
        const dropletBtn = document.createElement('button');
        dropletBtn.className = 'control-action-btn';
        dropletBtn.type = 'button';
        dropletBtn.title = 'Capturar color de la pantalla';
        dropletBtn.innerHTML = '💧';
        dropletBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          if (!window.EyeDropper) {
            showToast('El gotero de pantalla no está soportado en este navegador');
            return;
          }
          try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            
            // Result.sRGBHex contains the hex color
            const hexVal = result.sRGBHex.toLowerCase();
            
            // Set the value back
            const picker = document.getElementById(`picker-${key}`);
            const textInput = document.getElementById(`text-${key}`);
            
            let finalVal = hexVal;
            if (textInput) {
              const currentText = textInput.value.trim();
              // Preserve alpha channel if it was an rgba color
              if (currentText.startsWith('rgba')) {
                const alphaMatch = currentText.match(/rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/i);
                const alpha = alphaMatch ? parseFloat(alphaMatch[1]) : 1;
                const r = parseInt(hexVal.slice(1, 3), 16);
                const g = parseInt(hexVal.slice(3, 5), 16);
                const b = parseInt(hexVal.slice(5, 7), 16);
                finalVal = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              }
              textInput.value = finalVal;
            }
            if (picker) {
              picker.value = hexVal;
            }
            
            // Commit and update values
            if (key.startsWith('basic-')) {
              if (key === 'basic-accent') {
                applyBasicAccentCommit(finalVal);
              } else if (key === 'basic-bg') {
                applyBasicBgCommit(finalVal);
              }
            } else {
              const cssVar = inputMappings[key];
              if (cssVar) {
                const isGlobal = cssVar.startsWith('--font-') || 
                                 cssVar.startsWith('--line-') || 
                                 cssVar.startsWith('--p-') || 
                                 cssVar.startsWith('--radius-') || 
                                 (cssVar.startsWith('--h') && (cssVar.endsWith('-size') || cssVar.endsWith('-weight') || cssVar.endsWith('-font'))) ||
                                 cssVar === '--global-background-blur' ||
                                 cssVar === '--popover-width' ||
                                 cssVar === '--popover-height' ||
                                 cssVar === '--button-font-family' ||
                                 cssVar === '--button-font-size' ||
                                 cssVar === '--callout-radius' ||
                                 cssVar === '--callout-border-width' ||
                                 cssVar === '--table-border-width' ||
                                 cssVar === '--table-width' ||
                                 cssVar === '--table-row-hover-bg' ||
                                 cssVar === '--scrollbar-width' ||
                                 cssVar === '--checkbox-radius' ||
                                 cssVar === '--border-width';
                if (isGlobal) {
                  themeVariables.dark[cssVar] = finalVal;
                  themeVariables.light[cssVar] = finalVal;
                } else {
                  themeVariables[currentMode][cssVar] = finalVal;
                }
                const labelText = document.getElementById(`val-${key}`);
                if (labelText) labelText.textContent = finalVal;
                updateSwatchPreview(key, finalVal);
                applyThemeToPreview();
                triggerAutoSave();
              }
            }
            
            showToast(`Capturado: ${hexVal}`);
          } catch (err) {
            console.log("Gotero cancelado o error:", err);
          }
        });
        parentEl.appendChild(dropletBtn);
      }

      // Copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'control-action-btn';
      copyBtn.type = 'button';
      copyBtn.title = 'Copiar valor';
      copyBtn.innerHTML = '📋';
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        copyControlValue(key, type);
      });

      // Reset button
      const resetBtn = document.createElement('button');
      resetBtn.className = 'control-action-btn';
      resetBtn.type = 'button';
      resetBtn.title = 'Restaurar original';
      resetBtn.innerHTML = '↺';
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetControlValue(key, type);
      });

      parentEl.appendChild(copyBtn);
      parentEl.appendChild(resetBtn);
    }

    function copyControlValue(key, type) {
      let val = '';
      if (key.startsWith('basic-')) {
        const input = document.getElementById(`picker-${key}`) || 
                      document.getElementById(`text-${key}`) ||
                      document.getElementById(`range-${key}`) ||
                      document.getElementById(`select-${key}`);
        if (input) val = input.value;
      } else {
        const cssVar = inputMappings[key];
        if (cssVar) {
          val = themeVariables[currentMode][cssVar];
        }
      }

      if (val) {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`Copiado: ${val}`);
        }).catch(err => {
          const temp = document.createElement('textarea');
          temp.value = val;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          showToast(`Copiado: ${val}`);
        });
      }
    }

    function resetControlValue(key, type) {
      if (key.startsWith('basic-')) {
        let defaultVal = '';
        if (key === 'basic-accent') defaultVal = getOfficialDefault(currentMode, '--interactive-accent');
        else if (key === 'basic-bg') defaultVal = '#1e1e1e';
        else if (key === 'basic-font') defaultVal = 'Inter';
        else if (key === 'basic-radius') defaultVal = '4';
        
        applyResetVal(key, defaultVal, type);
        showToast('Restaurado a valor por defecto');
      } else {
        const cssVar = inputMappings[key];
        if (cssVar) {
          let defaultVal = officialDefaultVariables[currentMode][cssVar];
          
          const inheritsFromAccent = [
            '--interactive-accent-hover',
            '--link-color',
            '--link-color-hover',
            '--tag-color',
            '--callout-border-color',
            '--canvas-arrow-color',
            '--button-primary-background',
            '--button-primary-background-hover',
            '--button-primary-background-active',
            '--checkbox-checked-color',
            '--nav-item-text-active',
            '--nav-item-tag-color',
            '--blockquote-border-color',
            '--ribbon-item-color-active',
            '--graph-node',
            '--graph-node-focused',
            '--db-card-border-hover',
            '--list-marker-color',
            '--callout-bg-color',
            '--blockquote-bg',
            '--tag-background',
            '--tag-border',
            '--ribbon-background-active',
            '--text-selection'
          ];

          if (inheritsFromAccent.includes(cssVar)) {
            const currentAccent = themeVariables[currentMode]['--interactive-accent'] || getOfficialDefault(currentMode, '--interactive-accent');
            if (['--callout-bg-color', '--blockquote-bg', '--tag-background', '--tag-border', '--ribbon-background-active', '--text-selection'].includes(cssVar)) {
              const officialDef = officialDefaultVariables[currentMode][cssVar];
              let alpha = 0.1;
              if (officialDef && officialDef.includes('rgba')) {
                const match = officialDef.match(/rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/i);
                if (match) alpha = parseFloat(match[1]);
              }
              let clean = currentAccent.trim().replace('#', '');
              if (clean.length === 3) {
                clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
              }
              const r = parseInt(clean.substring(0, 2), 16) || 127;
              const g = parseInt(clean.substring(2, 4), 16) || 109;
              const b = parseInt(clean.substring(4, 6), 16) || 246;
              defaultVal = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            } else if (cssVar === '--interactive-accent-hover' || cssVar === '--link-color-hover' || cssVar === '--button-primary-background-hover' || cssVar === '--graph-node-focused') {
              defaultVal = themeVariables[currentMode]['--interactive-accent-hover'] || currentAccent;
            } else {
              defaultVal = currentAccent;
            }
          }

          if (defaultVal !== undefined) {
            const isGlobal = cssVar.startsWith('--font-') || 
                             cssVar.startsWith('--line-') || 
                             cssVar.startsWith('--p-') || 
                             cssVar.startsWith('--radius-') || 
                             (cssVar.startsWith('--h') && (cssVar.endsWith('-size') || cssVar.endsWith('-weight') || cssVar.endsWith('-font'))) ||
                             cssVar === '--global-background-blur' ||
                             cssVar === '--popover-width' ||
                             cssVar === '--popover-height' ||
                             cssVar === '--button-font-family' ||
                             cssVar === '--button-font-size' ||
                             cssVar === '--callout-radius' ||
                             cssVar === '--callout-border-width' ||
                             cssVar === '--table-border-width' ||
                             cssVar === '--scrollbar-width' ||
                             cssVar === '--checkbox-radius' ||
                             cssVar === '--border-width';

            if (isGlobal) {
              themeVariables.dark[cssVar] = defaultVal;
              themeVariables.light[cssVar] = defaultVal;
            } else {
              themeVariables[currentMode][cssVar] = defaultVal;
            }
            updateControlPanelInputs();
            applyThemeToPreview();
            triggerAutoSave();
            showToast('Restaurado a valor oficial/heredado');
          }
        }
      }
    }

    function applyResetVal(key, val, type) {
      const picker = document.getElementById(`picker-${key}`);
      const text = document.getElementById(`text-${key}`);
      const range = document.getElementById(`range-${key}`);
      const select = document.getElementById(`select-${key}`);
      
      if (picker) {
        picker.value = val;
        picker.dispatchEvent(new Event('input'));
      }
      if (text) {
        text.value = val;
        text.dispatchEvent(new Event('input'));
      }
      if (range) {
        range.value = val;
        range.dispatchEvent(new Event('input'));
      }
      if (select) {
        select.value = val;
        select.dispatchEvent(new Event('change'));
      }
    }

    function showToast(msg) {
      let toast = document.getElementById('toast-notification');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toast.timeoutId);
      toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    }

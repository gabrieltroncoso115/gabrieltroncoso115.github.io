// Importacion, restauracion y persistencia local de temas


    function handleUploadedFile(file) {
      if (!confirmDiscardThemeChanges()) return;
      if (file.name.endsWith('.zip')) {
        loadZipFile(file);
      } else if (file.name.endsWith('.json')) {
        loadJsonFile(file);
      } else {
        alert("Sube un archivo .zip de tema o un archivo .json de sesión.");
      }
    }

    async function loadZipFile(file) {
      try {
        const jsZip = new JSZip();
        const zip = await jsZip.loadAsync(file);
        
        let manifestEntry = null;
        let cssEntry = null;

        for (const [relativePath, entry] of Object.entries(zip.files)) {
          if (relativePath.includes('__MACOSX') || relativePath.split('/').pop().startsWith('.')) {
            continue;
          }
          if (relativePath.endsWith('manifest.json')) manifestEntry = entry;
          else if (relativePath.endsWith('theme.css')) cssEntry = entry;
        }

        if (!manifestEntry || !cssEntry) {
          alert("El ZIP debe contener theme.css y manifest.json válidos.");
          return;
        }

        const manifestText = await manifestEntry.async('text');
        const manifest = JSON.parse(manifestText);
        const cssText = await cssEntry.async('text');

        document.getElementById('header-meta-name').value = manifest.name || "Tema Importado";
        document.getElementById('meta-author').value = manifest.author || "Autor";
        document.getElementById('meta-description').value = manifest.description || "";

        copyVariables(officialDefaultVariables, themeVariables);
        parseAndMergeCssVariables(cssText);
        updateControlPanelInputs();
        applyThemeToPreview();
        markThemeAsClean();
        showScreen('workspace');
        loadMockNote('nota'); // Poblar el editor al cargar ZIP
      } catch (err) {
        alert("Error al analizar el ZIP: " + err.message);
      }
    }

    async function loadJsonFile(file) {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.manifest) {
          document.getElementById('header-meta-name').value = data.manifest.name || "Tema Importado";
          document.getElementById('meta-author').value = data.manifest.author || "";
          document.getElementById('meta-description').value = data.manifest.description || "";
        }
        if (data.variables) {
          copyVariables(data.variables, themeVariables);
        }
        updateControlPanelInputs();
        applyThemeToPreview();
        markThemeAsClean();
        showScreen('workspace');
        loadMockNote('nota'); // Poblar el editor al cargar JSON
      } catch (err) {
        alert("Error al analizar el JSON: " + err.message);
      }
    }

    function saveToLocalStorage() {
      try {
        const state = {
          manifest: {
            name: document.getElementById('header-meta-name').value.trim(),
            author: document.getElementById('meta-author').value.trim(),
            description: document.getElementById('meta-description').value.trim()
          },
          variables: themeVariables
        };
        localStorage.setItem('obsidian_theme_builder_pro_v2', JSON.stringify(state));
        document.getElementById('restore-session-container').style.display = 'block';
      } catch (e) {}
    }

    function loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('obsidian_theme_builder_pro_v2');
        if (saved) {
          const state = JSON.parse(saved);
          if (state.manifest) {
            document.getElementById('header-meta-name').value = state.manifest.name || "Tema Importado";
            document.getElementById('meta-author').value = state.manifest.author || "";
            document.getElementById('meta-description').value = state.manifest.description || "";
          }
          if (state.variables) {
            const restoredVariables = structuredClone(state.variables);
            for (const mode of ['dark', 'light']) {
              const restoredMode = restoredVariables[mode];
              if (!restoredMode || restoredMode['--h1-margin-bottom'] !== undefined) continue;

              // Los borradores creados mientras el control se llamaba "altura"
              // podían guardar un interlineado extremo. La nueva versión controla
              // el margen después del título, por lo que restauramos el interlineado
              // tipográfico y dejamos que los nuevos márgenes tomen sus valores base.
              for (let level = 1; level <= 6; level += 1) {
                const key = `--h${level}-line-height`;
                restoredMode[key] = officialDefaultVariables[mode][key];
              }
            }
            copyVariables(restoredVariables, themeVariables);
          }
          return true;
        }
      } catch (err) {}
      return false;
    }

    function migrateLegacyVariableSet(variables) {
      const migrated = { ...variables };
      if (migrated['--p-spacing'] === undefined && migrated['--p-margin-bottom'] !== undefined) {
        migrated['--p-spacing'] = migrated['--p-margin-bottom'];
      }
      if (migrated['--heading-spacing'] === undefined && migrated['--tb-heading-spacing'] !== undefined) {
        migrated['--heading-spacing'] = migrated['--tb-heading-spacing'];
      }
      if (migrated['--heading-line-height'] !== undefined) {
        for (let level = 1; level <= 6; level += 1) {
          const key = `--h${level}-line-height`;
          if (migrated[key] === undefined) migrated[key] = migrated['--heading-line-height'];
        }
      }
      delete migrated['--p-margin-bottom'];
      delete migrated['--tb-heading-spacing'];
      delete migrated['--heading-line-height'];
      return migrated;
    }

    function copyVariables(source, dest) {
      const merged = structuredClone(officialDefaultVariables);
      for (const mode of ['dark', 'light']) {
        if (source[mode]) {
          const migratedMode = migrateLegacyVariableSet(source[mode]);
          for (const [key, val] of Object.entries(migratedMode)) {
            if (val !== undefined && val !== null) {
              merged[mode][key] = val;
            }
          }
        }
      }
      for (const mode of ['dark', 'light']) {
        for (const key of Object.keys(dest[mode])) {
          delete dest[mode][key];
        }
        for (const [key, val] of Object.entries(merged[mode])) {
          dest[mode][key] = val;
        }
      }
    }

    async function loadInitialDataFromServer() {
      try {
        const manifestRes = await fetch('./manifest.json');
        if (manifestRes.ok) {
          const manifest = await manifestRes.json();
          document.getElementById('header-meta-name').value = manifest.name || 'Personalizado Pro';
          document.getElementById('meta-author').value = manifest.author || 'Gabriel Troncoso';
          document.getElementById('meta-description').value = manifest.description || '';
        }
        const cssRes = await fetch('./theme.css');
        if (cssRes.ok) {
          const cssText = await cssRes.text();
          parseAndMergeCssVariables(cssText);
        }
      } catch (err) {}
    }

    function parseAndMergeCssVariables(cssText) {
      const extractVars = (selector) => {
        const regexBlock = new RegExp(`${selector}\\s*\\{([^}]+)\\}`, 'i');
        const match = cssText.match(regexBlock);
        if (!match) return {};
        const content = match[1];
        const regexVar = /(--[a-zA-Z0-9-]+)\s*:\s*([^;]+)/g;
        const result = {};
        let m;
        while ((m = regexVar.exec(content)) !== null) {
          result[m[1].trim()] = m[2].trim();
        }
        return result;
      };

      const rgbToHex = (rgbStr) => {
        if (!rgbStr) return '';
        const parts = rgbStr.split(',').map(p => parseInt(p.trim(), 10));
        if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
          const r = parts[0].toString(16).padStart(2, '0');
          const g = parts[1].toString(16).padStart(2, '0');
          const b = parts[2].toString(16).padStart(2, '0');
          return `#${r}${g}${b}`;
        }
        return rgbStr;
      };

      const bodyVars = { ...extractVars(':root'), ...extractVars('body') };
      const darkVars = migrateLegacyVariableSet(extractVars('\\.theme-dark'));
      const lightVars = migrateLegacyVariableSet(extractVars('\\.theme-light'));
      const migratedBodyVars = migrateLegacyVariableSet(bodyVars);

      const convertRgbVarToHex = (varsObj) => {
        if (varsObj['--callout-note']) varsObj['--callout-color-note'] = rgbToHex(varsObj['--callout-note']);
        if (varsObj['--callout-success']) varsObj['--callout-color-success'] = rgbToHex(varsObj['--callout-success']);
        if (varsObj['--callout-warning']) varsObj['--callout-color-warning'] = rgbToHex(varsObj['--callout-warning']);
        if (varsObj['--callout-danger']) varsObj['--callout-color-danger'] = rgbToHex(varsObj['--callout-danger']);
        if (varsObj['--callout-example']) varsObj['--callout-color-example'] = rgbToHex(varsObj['--callout-example']);
        if (varsObj['--callout-quote']) varsObj['--callout-color-quote'] = rgbToHex(varsObj['--callout-quote']);
      };
      
      convertRgbVarToHex(darkVars);
      convertRgbVarToHex(lightVars);

      for (const [key, val] of Object.entries(migratedBodyVars)) {
        if (themeVariables.dark.hasOwnProperty(key)) themeVariables.dark[key] = val;
        if (themeVariables.light.hasOwnProperty(key)) themeVariables.light[key] = val;
      }
      for (const [key, val] of Object.entries(darkVars)) {
        if (themeVariables.dark.hasOwnProperty(key)) themeVariables.dark[key] = val;
      }
      for (const [key, val] of Object.entries(lightVars)) {
        if (themeVariables.light.hasOwnProperty(key)) themeVariables.light[key] = val;
      }
    }

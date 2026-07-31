// Configuración de errores y logs del servidor
    window.onerror = function (message, source, lineno, colno, error) {
      const payload = { message: `${message} at ${source}:${lineno}:${colno}`, stack: error ? error.stack : '' };
      fetch('/api/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
      return false;
    };

    let currentMode = 'dark'; // 'dark' | 'light'
    let activeNoteId = 'nota';         // Pestaña de nota activa
    let activeRibbonView = 'view-editor'; // Vista de ribbon activa
    let isInspectorActive = false;     // Estado del gotero inspector


    const themeVariables = {
      dark: JSON.parse(JSON.stringify(officialDefaultVariables.dark)),
      light: JSON.parse(JSON.stringify(officialDefaultVariables.light))
    };


    document.addEventListener('DOMContentLoaded', async () => {
      setupOnboardingEvents();

      try {
        if (localStorage.getItem('obsidian_theme_builder_pro_v2')) {
          document.getElementById('restore-session-container').style.display = 'block';
        }
      } catch (e) {}

      await loadInitialDataFromServer();
      await initVaultExplorer();
      setupAdvancedAccordion();
      setupWorkspaceEvents();
      setupPopoverSimulation();
      setupSimulatedTooltips();
      setupSimulatedContextMenu();
      setupCommandPaletteShortcuts();

      window.addEventListener('beforeunload', (event) => {
        if (!hasThemeChanges()) return;
        event.preventDefault();
        // Los navegadores muestran su propio texto de confirmación por seguridad.
        event.returnValue = '';
      });

      const btnSearch = document.getElementById('titlebar-search-icon');
      if (btnSearch) {
        btnSearch.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openCommandPalette();
        });
      }

      const btnSettings = document.getElementById('btn-open-settings');
      if (btnSettings) {
        btnSettings.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openSimulatedSettings();
        });
      }

      loadMockNote('nota');
      injectActionButtons();
      setupSidebarResizers();
      setupSidebarToggles();
      setupSoundboardInteractions();

      window.addEventListener('resize', () => {
        if (activeNoteId === 'graph' && window.vaultFiles) {
          updateGraphView(window.vaultFiles, activeNoteId);
        }
      });

      const editorBody = document.getElementById('editor-body-content');
      if (editorBody) {
        editorBody.addEventListener('input', () => {
          updateWordCount();
          updateOutlineSidebar();
        });
      }
    });

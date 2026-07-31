// Historial, deshacer y coordinacion de autoguardado


    // Estructura de Historial / Undo
    let saveTimeout = null;
    const undoHistory = [];
    const maxHistoryStates = 10;
    let hasPendingThemeChanges = false;

    function markThemeAsClean() {
      hasPendingThemeChanges = false;
    }

    function hasThemeChanges() {
      return hasPendingThemeChanges;
    }

    function confirmDiscardThemeChanges() {
      if (!hasThemeChanges()) return true;
      return window.confirm('Tienes ajustes sin guardar. Si continúas, los cambios se perderán. ¿Quieres continuar?');
    }

    function saveHistoryState() {
      if (!themeVariables || !themeVariables.dark || !themeVariables.light) {
        return;
      }
      const stateCopy = {
        dark: JSON.parse(JSON.stringify(themeVariables.dark)),
        light: JSON.parse(JSON.stringify(themeVariables.light))
      };
      
      if (undoHistory.length > 0) {
        const lastState = undoHistory[undoHistory.length - 1];
        if (JSON.stringify(lastState) === JSON.stringify(stateCopy)) {
          return; 
        }
      }

      undoHistory.push(stateCopy);
      if (undoHistory.length > maxHistoryStates) {
        undoHistory.shift();
      }
    }

    function performUndo() {
      if (undoHistory.length <= 1) {
        showToast("No hay más acciones para deshacer");
        return;
      }

      undoHistory.pop();
      const previousState = undoHistory[undoHistory.length - 1];
      
      themeVariables.dark = JSON.parse(JSON.stringify(previousState.dark));
      themeVariables.light = JSON.parse(JSON.stringify(previousState.light));
      hasPendingThemeChanges = true;
      
      updateControlPanelInputs();
      applyThemeToPreview();
      
      // Save changes to localstorage/server without adding new undo history
      const dot = document.getElementById('save-status-dot');
      const text = document.getElementById('save-status-text');
      if (dot) dot.className = 'status-dot saving';
      if (text) text.textContent = 'Guardando...';

      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveToLocalStorage();
        if (dot) dot.className = 'status-dot success';
        if (text) text.textContent = 'Borrador guardado en navegador';
      }, 600);

      showToast("Deshacer aplicado con éxito ↺");
    }

    function triggerAutoSave() {
      // Registrar el estado antes de guardar los nuevos cambios
      saveHistoryState();
      hasPendingThemeChanges = true;

      const dot = document.getElementById('save-status-dot');
      const text = document.getElementById('save-status-text');
      if (dot) dot.className = 'status-dot saving';
      if (text) text.textContent = 'Guardando...';

      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveThemeDataLocalAndServer();
      }, 600);
    }

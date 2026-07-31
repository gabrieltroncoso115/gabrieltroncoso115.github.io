// Shell, onboarding y superficies simuladas del workspace



    function setupSidebarResizers() {
      const leftSidebar = document.getElementById('obsidian-sidebar-glass');
      const rightSidebar = document.getElementById('obsidian-right-sidebar-glass');
      const leftResizer = document.getElementById('left-sidebar-resizer');
      const rightResizer = document.getElementById('right-sidebar-resizer');
      const windowBody = document.querySelector('.window-body');

      if (leftSidebar && leftResizer) {
        leftResizer.addEventListener('mousedown', (e) => {
          e.preventDefault();
          document.body.classList.add('is-dragging-sidebar');
          leftResizer.classList.add('is-dragging');
          
          const doDrag = (moveEvent) => {
            const bodyRect = windowBody.getBoundingClientRect();
            let newWidth = moveEvent.clientX - bodyRect.left - 44; 
            if (newWidth < 120) newWidth = 120;
            if (newWidth > 400) newWidth = 400;
            leftSidebar.style.width = `${newWidth}px`;
          };
          
          const stopDrag = () => {
            document.body.classList.remove('is-dragging-sidebar');
            leftResizer.classList.remove('is-dragging');
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            if (activeNoteId === 'graph' && window.vaultFiles) {
              updateGraphView(window.vaultFiles, activeNoteId);
            }
          };
          
          document.addEventListener('mousemove', doDrag);
          document.addEventListener('mouseup', stopDrag);
        });
      }

      if (rightSidebar && rightResizer) {
        rightResizer.addEventListener('mousedown', (e) => {
          e.preventDefault();
          document.body.classList.add('is-dragging-sidebar');
          rightResizer.classList.add('is-dragging');
          
          const doDrag = (moveEvent) => {
            const bodyRect = windowBody.getBoundingClientRect();
            let newWidth = bodyRect.right - moveEvent.clientX;
            if (newWidth < 180) newWidth = 180;
            if (newWidth > 500) newWidth = 500;
            rightSidebar.style.width = `${newWidth}px`;
          };
          
          const stopDrag = () => {
            document.body.classList.remove('is-dragging-sidebar');
            rightResizer.classList.remove('is-dragging');
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            if (activeNoteId === 'graph' && window.vaultFiles) {
              updateGraphView(window.vaultFiles, activeNoteId);
            }
          };
          
          document.addEventListener('mousemove', doDrag);
          document.addEventListener('mouseup', stopDrag);
        });
      }
    }

    function updateOutlineSidebar(noteId = activeNoteId) {
      const rightSidebarContent = document.querySelector('.right-sidebar .graph-view-pane');
      const rightSidebarTitle = document.getElementById('right-sidebar-title');
      if (!rightSidebarContent) return;
      
      const editorBody = document.getElementById('editor-body-content');
      
      // If we are in Canvas, Database, Options or Graph view
      if (noteId === 'canvas' || noteId === 'database' || noteId === 'options' || noteId === 'graph') {
        if (rightSidebarTitle) rightSidebarTitle.textContent = 'Información';
        rightSidebarContent.innerHTML = `
          <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.78rem; font-style: italic; display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; height: 100%; box-sizing: border-box;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.5;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>Esquema no disponible para esta vista</span>
          </div>
        `;
        return;
      }
      
      if (rightSidebarTitle) rightSidebarTitle.textContent = 'Esquema';
      
      if (!editorBody) {
        rightSidebarContent.innerHTML = `
          <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.78rem; font-style: italic; display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; height: 100%; box-sizing: border-box;">
            <span>Ningún archivo abierto</span>
          </div>
        `;
        return;
      }
      
      // Parse headings from the editor body HTML
      const headings = editorBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) {
        rightSidebarContent.innerHTML = `
          <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.78rem; font-style: italic; display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; height: 100%; box-sizing: border-box;">
            <span>Sin encabezados en esta nota</span>
          </div>
        `;
        return;
      }
      
      let html = '<div class="outline-container" style="padding: 12px 14px; overflow-y: auto; height: 100%; display: flex; flex-direction: column; gap: 8px; box-sizing: border-box;">';
      
      headings.forEach((heading, idx) => {
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent.trim() || `Encabezado H${level}`;
        const indent = (level - 1) * 12; // Indent based on heading level
        
        let id = heading.id;
        if (!id || id.startsWith('heading-outline-')) {
          id = `heading-outline-${idx}`;
          heading.id = id;
        }
        
        // Render outline item matching user's real Obsidian app screenshot styling
        html += `
          <div class="outline-item" data-target="${escapeHtml(id)}" data-inspect-target="h${level}-color" style="padding-left: ${indent}px; font-size: 0.76rem; line-height: 1.4; color: var(--text-muted); cursor: pointer; display: flex; align-items: flex-start; gap: 6px; transition: all 0.15s ease;"
               onclick="document.getElementById(this.dataset.target).scrollIntoView({ behavior: 'smooth', block: 'start' });"
               onmouseover="this.style.color='var(--text-normal)'; this.style.transform='translateX(2px)';"
               onmouseout="this.style.color='var(--text-muted)'; this.style.transform='none';">
            <span style="opacity: 0.35; font-size: 0.65rem; font-weight: 600; margin-top: 2px; width: 14px; text-align: right;">H${level}</span>
            <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(text)}</span>
          </div>
        `;
      });
      
      html += '</div>';
      rightSidebarContent.innerHTML = html;
    }

    function setupSidebarToggles() {
      // Toggle left sidebar
      const btnToggleLeft = document.getElementById('btn-toggle-left-sidebar');
      if (btnToggleLeft) {
        btnToggleLeft.addEventListener('click', () => {
          const sidebar = document.getElementById('obsidian-sidebar-glass');
          const resizer = document.getElementById('left-sidebar-resizer');
          if (sidebar) {
            if (sidebar.style.display === 'none') {
              sidebar.style.display = 'flex';
              if (resizer) resizer.style.display = 'block';
              btnToggleLeft.classList.add('active');
            } else {
              sidebar.style.display = 'none';
              if (resizer) resizer.style.display = 'none';
              btnToggleLeft.classList.remove('active');
            }
          }
        });
      }

      // Toggle right sidebar
      const btnToggleRight = document.getElementById('btn-toggle-right-sidebar');
      if (btnToggleRight) {
        btnToggleRight.addEventListener('click', () => {
          const sidebar = document.getElementById('obsidian-right-sidebar-glass');
          const resizer = document.getElementById('right-sidebar-resizer');
          if (sidebar) {
            if (sidebar.style.display === 'none') {
              sidebar.style.display = 'flex';
              if (resizer) resizer.style.display = 'block';
              btnToggleRight.classList.add('active');
            } else {
              sidebar.style.display = 'none';
              if (resizer) resizer.style.display = 'none';
              btnToggleRight.classList.remove('active');
            }
          }
        });
      }
    }

    function setupSoundboardInteractions() {
      // Replaced by Graph View Sidebar Panel
      const rightSidebar = document.getElementById('obsidian-right-sidebar-glass');
      const rightResizer = document.getElementById('right-sidebar-resizer');
      if (rightSidebar) rightSidebar.style.display = 'flex';
      if (rightResizer) rightResizer.style.display = 'block';
    }



    function setupPopoverSimulation() {
      const popover = document.getElementById('simulated-hover-popover');
      const obsidianWindow = document.getElementById('obsidian-window');
      
      if (!popover || !obsidianWindow) return;

      // Event delegation inside obsidian window
      obsidianWindow.addEventListener('mouseover', (e) => {
        // If inspector is active, don't show the hover preview to avoid interference
        if (isInspectorActive) return;

        const link = e.target.closest('.internal-link');
        if (!link) return;

        const path = link.getAttribute('data-path');
        if (path) {
          fetchPopoverContent(path);
        }

        popover.style.display = 'block';
        const linkRect = link.getBoundingClientRect();
        const windowRect = obsidianWindow.getBoundingClientRect();
        
        // Calculate relative position
        let top = linkRect.bottom - windowRect.top + 8;
        let left = linkRect.left - windowRect.left;
        
        // Dynamically compute size including padding & border constraints
        const popoverWidth = popover.offsetWidth;
        const popoverHeight = popover.offsetHeight;

        // Check boundary to avoid going out of bottom
        if (top + popoverHeight > windowRect.height) {
          top = linkRect.top - windowRect.top - popoverHeight - 8;
        }
        // Check boundary to avoid going out of top
        if (top < 8) {
          top = 8;
        }
        // Check boundary to avoid going out of right
        if (left + popoverWidth > windowRect.width) {
          left = windowRect.width - popoverWidth - 16;
        }
        // Check boundary to avoid going out of left
        if (left < 16) {
          left = 16;
        }
        
        popover.style.top = `${top}px`;
        popover.style.left = `${left}px`;
      });

      obsidianWindow.addEventListener('mouseout', (e) => {
        const link = e.target.closest('.internal-link');
        if (!link) return;

        setTimeout(() => {
          if (!popover.matches(':hover') && !link.matches(':hover') && popover.dataset.pinned !== 'true') {
            popover.style.display = 'none';
          }
        }, 100);
      });

      popover.addEventListener('mouseleave', () => {
        setTimeout(() => {
          const hoveredLink = document.querySelector('.internal-link:hover');
          if (!hoveredLink && !popover.matches(':hover') && popover.dataset.pinned !== 'true') {
            popover.style.display = 'none';
          }
        }, 100);
      });

      // Click toggle to pin/unpin popover and toggle checkboxes
      obsidianWindow.addEventListener('click', (e) => {
        const checkbox = e.target.closest('.editor-checkbox');
        if (checkbox) {
          if (isInspectorActive) return; // let inspector handle click
          checkbox.classList.toggle('checked');
          return;
        }

        const link = e.target.closest('.internal-link');
        if (link) {
          if (isInspectorActive) return; // let inspector handle click
          e.preventDefault();
          e.stopPropagation();
          
          if (popover.style.display === 'block' && popover.dataset.pinned === 'true') {
            popover.dataset.pinned = 'false';
            popover.style.display = 'none';
          } else {
            popover.dataset.pinned = 'true';
            popover.style.display = 'block';
          }
        } else if (!e.target.closest('#simulated-hover-popover')) {
          // Click outside popover closes it
          popover.dataset.pinned = 'false';
          popover.style.display = 'none';
        }
      }, true);
    }

    function openCommandPalette() {
      const modal = document.getElementById('simulated-cmd-palette');
      if (modal) {
        modal.style.display = 'flex';
        const input = document.getElementById('cmd-palette-input');
        if (input) {
          input.value = '';
          setTimeout(() => input.focus(), 50);
        }
      }
    }

    function closeCommandPalette() {
      const modal = document.getElementById('simulated-cmd-palette');
      if (modal) modal.style.display = 'none';
    }

    function openSimulatedSettings() {
      const modal = document.getElementById('simulated-settings-modal');
      if (modal) {
        modal.style.display = 'flex';
        const selector = document.getElementById('simulated-theme-selector');
        if (selector) selector.value = currentMode;
      }
    }

    function closeSettingsModal() {
      const modal = document.getElementById('simulated-settings-modal');
      if (modal) modal.style.display = 'none';
    }

    function toggleSimulatedTheme(mode) {
      currentMode = mode;
      updateModeButtonsActiveStates();
      updateControlPanelInputs();
      applyThemeToPreview();
      
      const selector = document.getElementById('simulated-theme-selector');
      if (selector) selector.value = mode;
    }

    function setupSimulatedTooltips() {
      const tooltip = document.getElementById('simulated-tooltip');
      const win = document.getElementById('obsidian-window');
      if (!tooltip || !win) return;
      
      win.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (!target || isInspectorActive) return;
        
        const text = target.getAttribute('data-tooltip');
        tooltip.textContent = text;
        tooltip.style.display = 'block';
        
        const rect = target.getBoundingClientRect();
        const winRect = win.getBoundingClientRect();
        
        const left = rect.left - winRect.left + (rect.width - tooltip.offsetWidth) / 2;
        const top = rect.bottom - winRect.top + 6;
        
        tooltip.style.left = `${Math.max(4, left)}px`;
        tooltip.style.top = `${top}px`;
      });
      
      win.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target) {
          tooltip.style.display = 'none';
        }
      });
    }

    function setupSimulatedContextMenu() {
      const menu = document.getElementById('simulated-context-menu');
      const win = document.getElementById('obsidian-window');
      if (!menu || !win) return;
      
      win.addEventListener('contextmenu', (e) => {
        if (isInspectorActive) return;
        e.preventDefault();
        
        const rect = win.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.style.display = 'block';
      });
      
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#simulated-context-menu')) {
          menu.style.display = 'none';
        }
      });
    }

    function setupCommandPaletteShortcuts() {
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
          e.preventDefault();
          openCommandPalette();
        }
        if (e.key === 'Escape') {
          closeCommandPalette();
          closeSettingsModal();
        }
      });
    }

    function showScreen(screenId) {
      const onboarding = document.getElementById('onboarding-screen');
      const workspace = document.getElementById('screen-workspace');
      const success = document.getElementById('success-screen');
      
      if (screenId === 'workspace') {
        onboarding.classList.add('hidden');
        setTimeout(() => onboarding.style.display = 'none', 400);
        workspace.style.display = 'flex';
        success.classList.remove('active');
        success.style.display = 'none';
      } else if (screenId === 'onboarding') {
        onboarding.style.display = 'flex';
        onboarding.offsetHeight;
        onboarding.classList.remove('hidden');
        workspace.style.display = 'none';
        success.classList.remove('active');
        success.style.display = 'none';
      } else if (screenId === 'success') {
        onboarding.classList.add('hidden');
        onboarding.style.display = 'none';
        workspace.style.display = 'none';
        success.style.display = 'flex';
        success.offsetHeight;
        success.classList.add('active');
      }
    }

    function setupOnboardingEvents() {
      document.getElementById('btn-new-theme').addEventListener('click', () => {
        copyVariables(officialDefaultVariables, themeVariables);
        document.getElementById('header-meta-name').value = "Tema Personalizado";
        document.getElementById('meta-author').value = "Creador de Temas";
        document.getElementById('meta-description').value = "Un tema elegante para Obsidian.";
        updateControlPanelInputs();
        applyThemeToPreview();
        markThemeAsClean();
        saveHistoryState(); // Seed initial history
        showScreen('workspace');
        loadMockNote('nota'); // Poblar el editor al entrar al workspace
      });

      const onboardingScreen = document.getElementById('onboarding-screen');
      const loadThemeCard = document.getElementById('btn-load-theme');
      const dragZone = document.getElementById('drag-zone');
      const fileInput = document.getElementById('file-input');
      
      if (loadThemeCard && fileInput) {
        loadThemeCard.addEventListener('click', () => {
          // Abre el selector nativo del sistema (Finder en macOS / Explorador en Windows).
          fileInput.value = '';
          fileInput.click();
        });
      }
      if (dragZone) {
        dragZone.addEventListener('click', (event) => {
          event.stopPropagation();
          fileInput.value = '';
          fileInput.click();
        });
      }
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          if (e.target.files.length > 0) handleUploadedFile(e.target.files[0]);
        });
      }

      if (onboardingScreen) {
        onboardingScreen.addEventListener('dragover', (e) => { 
          e.preventDefault(); 
          if (dragZone) dragZone.classList.add('dragover'); 
        });
        onboardingScreen.addEventListener('dragleave', () => { 
          if (dragZone) dragZone.classList.remove('dragover'); 
        });
        onboardingScreen.addEventListener('drop', (e) => {
          e.preventDefault();
          if (dragZone) dragZone.classList.remove('dragover');
          if (e.dataTransfer.files.length > 0) handleUploadedFile(e.dataTransfer.files[0]);
        });
      }

      document.getElementById('link-restore-session').addEventListener('click', (e) => {
        e.preventDefault();
        if (loadFromLocalStorage()) {
          updateControlPanelInputs();
          applyThemeToPreview();
          markThemeAsClean();
          saveHistoryState(); // Seed initial history
          showScreen('workspace');
          loadMockNote(activeNoteId || 'nota'); // Restaurar contenido del editor
        }
      });
    }

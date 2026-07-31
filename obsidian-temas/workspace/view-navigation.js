// Navegacion de vistas y paneles de configuracion




    function setupAdvancedAccordion() {
      if (document.getElementById('content-advanced-accordion')) return;

      const tabsBar = document.getElementById('advanced-tabs-bar');
      if (tabsBar) tabsBar.style.display = 'none';

      const container = document.getElementById('panel-controls-container');
      if (!container) return;

      const globalContent = document.getElementById('content-global');
      const getCardByTitle = (title) => [...document.querySelectorAll('.config-card')]
        .find((card) => card.querySelector('.config-card-header')?.textContent.trim() === title);
      const createCard = (title) => {
        const card = document.createElement('div');
        card.className = 'config-card';
        card.innerHTML = `<div class="config-card-header">${title}</div><div class="config-card-body"></div>`;
        return card;
      };

      const accordionWrapper = document.createElement('div');
      accordionWrapper.id = 'content-advanced-accordion';
      accordionWrapper.className = 'accordion-container';
      accordionWrapper.style.display = 'flex';

      const searchContainer = document.createElement('div');
      searchContainer.className = 'settings-search';
      searchContainer.innerHTML = `
        <label class="settings-search-label" for="settings-search-input">Buscar ajustes</label>
        <div class="settings-search-field">
          <svg class="settings-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-4-4"></path>
          </svg>
          <input id="settings-search-input" type="search" autocomplete="off" placeholder="Ej.: color H1, borde, callout" aria-describedby="settings-search-status">
          <button id="settings-search-clear" class="settings-search-clear" type="button" aria-label="Limpiar búsqueda" title="Limpiar búsqueda">×</button>
        </div>
        <p id="settings-search-status" class="settings-search-status" aria-live="polite"></p>
      `;

      if (globalContent && globalContent.parentNode) {
        const contentParent = globalContent.parentNode;
        contentParent.insertBefore(searchContainer, globalContent);
        contentParent.insertBefore(accordionWrapper, globalContent);
      } else {
        container.appendChild(searchContainer);
        container.appendChild(accordionWrapper);
      }

      const modeSelector = getCardByTitle('Metadatos del Manifest')?.querySelector('.mode-selector-container');
      if (modeSelector) {
        const modeContext = document.createElement('div');
        modeContext.className = 'settings-mode-context';
        modeContext.appendChild(modeSelector);
        accordionWrapper.parentNode.insertBefore(modeContext, accordionWrapper);
      }

      const sections = [
        { id: 'theme', name: 'Tema y modos', description: 'Identidad y modo de visualización' },
        { id: 'foundations', name: 'Fundamentos visuales', description: 'Color, bordes y tipografía global' },
        { id: 'text', name: 'Texto y composición', description: 'Lectura, enlaces, encabezados y espaciado' },
        { id: 'notes', name: 'Contenido de notas', description: 'Propiedades, bloques y listas' },
        { id: 'workspace', name: 'Navegación y espacio de trabajo', description: 'Ventana, explorador y pestañas' },
        { id: 'controls', name: 'Controles y ventanas', description: 'Botones, menús, modales y popovers' },
        { id: 'views', name: 'Vistas especiales', description: 'Canvas, grafo y bases' }
      ];
      const sectionContents = {};

      sections.forEach(sec => {
        const contentDiv = document.createElement('div');
        contentDiv.id = `content-${sec.id}`;
        contentDiv.className = 'tab-content accordion-content';
        contentDiv.style.display = 'none';
        sectionContents[sec.id] = contentDiv;

        const item = document.createElement('div');
        item.className = 'accordion-item';
        item.id = `accordion-item-${sec.id}`;

        const header = document.createElement('div');
        header.className = 'accordion-header';
        header.id = `accordion-header-${sec.id}`;
        header.innerHTML = `
          <span class="accordion-heading"><span class="accordion-title">${sec.name}</span><span class="accordion-description">${sec.description}</span></span>
          <svg class="accordion-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        `;

        item.appendChild(header);
        item.appendChild(contentDiv);
        accordionWrapper.appendChild(item);
      });

      const moveCard = (title, destination) => {
        const card = getCardByTitle(title);
        if (card) destination.appendChild(card);
      };

      moveCard('Metadatos del Manifest', sectionContents.theme);
      ['Colores de Fondo Core', 'Color de Acento Global', 'Bordes, Esquinas y Checkboxes', 'Familias Tipográficas']
        .forEach((title) => moveCard(title, sectionContents.foundations));
      ['Texto Base y Enlaces', 'Estilo de Encabezados (H1 - H6)', 'Espaciado y Estructura']
        .forEach((title) => moveCard(title, sectionContents.text));
      ['Metadatos (Properties) y Etiquetas (Tags)', 'Cajas Destacadas (Callouts)', 'Bloques de Código y Citas (Blockquotes)', 'Tablas, Listas y Guías de Indentación']
        .forEach((title) => moveCard(title, sectionContents.notes));
      moveCard('Entorno de la App (App Shell)', sectionContents.workspace);
      ['Lienzo Infinito (Canvas)', 'Mapa de Relaciones (Grafo)', 'Vistas de Base de Datos (Plugin Bases)']
        .forEach((title) => moveCard(title, sectionContents.views));
      moveCard('Ventanas Flotantes (Popovers)', sectionContents.controls);

      const workspaceCard = getCardByTitle('Área de Trabajo (Workspace)');
      if (workspaceCard) {
        const groups = [...workspaceCard.querySelector('.config-card-body').children];
        const navigationCard = createCard('Explorador, pestañas y barra de estado');
        const controlsCard = createCard('Botones, menús y ajustes');
        groups.slice(0, 4).forEach((group) => navigationCard.querySelector('.config-card-body').appendChild(group));
        groups.slice(4).forEach((group) => controlsCard.querySelector('.config-card-body').appendChild(group));
        sectionContents.workspace.appendChild(navigationCard);
        sectionContents.controls.insertBefore(controlsCard, sectionContents.controls.firstChild);
        workspaceCard.remove();
      }

      setupHeadingSubgroups();

      // Los contenedores antiguos pueden conservar controles de compatibilidad invisibles.
      ['content-global', 'content-shell', 'content-note', 'content-advanced'].forEach((id) => {
        const oldContent = document.getElementById(id);
        if (oldContent) oldContent.style.display = 'none';
      });

      switchAdvancedTab('theme');
      setupSettingsSearch(searchContainer, accordionWrapper);
    }

    function setupHeadingSubgroups() {
      document.querySelectorAll('.heading-settings-group').forEach((group, index) => {
        if (group.querySelector('.heading-settings-toggle')) return;
        const title = group.firstElementChild;
        const heading = title?.textContent.trim() || `Encabezado H${index + 1}`;
        const level = heading.match(/H[1-6]/)?.[0].toLowerCase();
        if (!title || !level) return;

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'heading-settings-toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = `<span>${heading}</span><span aria-hidden="true">⌄</span>`;
        group.dataset.settingGroup = level;
        title.replaceWith(toggle);
        toggle.addEventListener('click', () => {
          const expanded = group.classList.toggle('is-expanded');
          toggle.setAttribute('aria-expanded', String(expanded));
        });
      });
    }

    function setupSettingsSearch(searchContainer, accordionWrapper) {
      const searchInput = searchContainer.querySelector('#settings-search-input');
      const clearButton = searchContainer.querySelector('#settings-search-clear');
      const status = searchContainer.querySelector('#settings-search-status');
      if (!searchInput || !clearButton || !status) return;

      const normalize = (value) => value
        .toLocaleLowerCase('es')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const setExpanded = (item, expanded) => {
        const content = item.querySelector('.accordion-content');
        const header = item.querySelector('.accordion-header');
        if (!content || !header) return;
        content.style.display = expanded ? 'flex' : 'none';
        header.classList.toggle('active', expanded);
      };

      const clearSearch = () => {
        accordionWrapper.querySelectorAll('.config-card').forEach((card) => {
          card.style.display = '';
          card.classList.remove('is-search-match');
        });
        accordionWrapper.querySelectorAll('.accordion-item').forEach((item) => {
          item.style.display = '';
          if (item.dataset.searchWasExpanded !== undefined) {
            setExpanded(item, item.dataset.searchWasExpanded === 'true');
            delete item.dataset.searchWasExpanded;
          }
        });
        searchContainer.classList.remove('has-search', 'has-no-results');
        status.textContent = '';
      };

      const filterSettings = () => {
        const query = normalize(searchInput.value.trim());
        clearButton.classList.toggle('is-visible', query.length > 0);

        if (!query) {
          clearSearch();
          return;
        }

        searchContainer.classList.add('has-search');
        let resultCount = 0;

        accordionWrapper.querySelectorAll('.accordion-item').forEach((item) => {
          if (item.dataset.searchWasExpanded === undefined) {
            const content = item.querySelector('.accordion-content');
            item.dataset.searchWasExpanded = String(content && content.style.display === 'flex');
          }

          const cards = [...item.querySelectorAll('.config-card')];
          const matchingCards = cards.filter((card) => normalize(card.textContent).includes(query));
          matchingCards.forEach((card) => card.classList.add('is-search-match'));
          cards.filter((card) => !matchingCards.includes(card)).forEach((card) => card.classList.remove('is-search-match'));
          cards.forEach((card) => { card.style.display = matchingCards.includes(card) ? '' : 'none'; });

          const hasMatches = matchingCards.length > 0;
          item.style.display = hasMatches ? '' : 'none';
          if (hasMatches) {
            setExpanded(item, true);
            resultCount += matchingCards.length;
          }
        });

        searchContainer.classList.toggle('has-no-results', resultCount === 0);
        status.textContent = resultCount === 0
          ? `No se encontraron ajustes para “${searchInput.value.trim()}”.`
          : `${resultCount} ${resultCount === 1 ? 'sección encontrada' : 'secciones encontradas'}.`;
      };

      searchInput.addEventListener('input', filterSettings);
      clearButton.addEventListener('click', () => {
        searchInput.value = '';
        filterSettings();
        searchInput.focus();
      });
    }

    function switchAdvancedTab(tabId) {
      const content = document.getElementById(`content-${tabId}`);
      const header = document.getElementById(`accordion-header-${tabId}`);
      const arrow = header ? header.querySelector('.accordion-chevron') : null;
      
      if (!content || !header) return;

      const isExpanded = content.style.display === 'flex';
      
      if (isExpanded) {
        content.style.display = 'none';
        header.classList.remove('active');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      } else {
        content.style.display = 'flex';
        header.classList.add('active');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      }
    }

    function focusSettingInput(key) {
      // Buscar el control correspondiente en el panel izquierdo
      let targetInput = document.getElementById(`picker-${key}`) || 
                        document.getElementById(`text-${key}`) ||
                        document.getElementById(`range-${key}`) ||
                        document.getElementById(`select-${key}`);

      if (!targetInput) {
        // Fallback con prefijo callout
        targetInput = document.getElementById(`picker-callout-color-${key}`) ||
                      document.getElementById(`text-callout-color-${key}`);
      }

      const specialMappings = {
        // Colores interactivos
        'interactive-accent': 'link-color',
        'interactive-accent-hover': 'link-color',
        // Fondo canvas/titlebar
        'canvas-bg': 'canvas-bg',
        'titlebar-bg': 'titlebar-bg',
        'titlebar-text': 'titlebar-text',
        // Fondos
        'bg-secondary-alt': 'bg-secondary-alt',
        'bg-secondary': 'bg-secondary',
        'bg-primary': 'bg-primary',
        // Pestañas
        'tab-text-active': 'tab-text-active',
        'tab-text-inactive': 'tab-text-inactive',
        // Botones
        'button-bg': 'button-background',
        'button-primary-bg': 'button-primary-bg',
        // Navegador lateral
        'nav-item-tag-color': 'tag-color',
        'nav-item-color': 'text-normal',
        'nav-item-color-active': 'text-on-accent',
        // Listas y marcadores
        'list-marker-color': 'list-marker-color',
        // Tags
        'tag-color': 'tag-color',
        'tag-bg': 'tag-color',
        'tag-border-color': 'tag-border-color',
        // Ribbon
        'ribbon-item-active': 'ribbon-item-active',
        // Metadatos
        'metadata-background': 'bg-secondary',
        'metadata-label-text-color': 'text-muted',
        'metadata-value-text-color': 'text-normal',
        // Texto
        'text-normal': 'text-normal',
        'text-muted': 'text-muted',
        'text-faint': 'text-faint',
        'text-on-accent': 'text-on-accent',
        // Encabezados
        'h1-color': 'h1-color',
        'h2-color': 'h2-color',
        'h3-color': 'h3-color',
        'h4-color': 'h4-color',
        'h5-color': 'h5-color',
        'h6-color': 'h6-color',
        // Callouts
        'callout-note': 'callout-color-note',
        'callout-tip': 'callout-color-tip',
        'callout-warning': 'callout-color-warning',
        'callout-danger': 'callout-color-danger',
      };

      if (!targetInput && specialMappings[key]) {
        const mappedKey = specialMappings[key];
        targetInput = document.getElementById(`picker-${mappedKey}`) || 
                      document.getElementById(`text-${mappedKey}`) ||
                      document.getElementById(`range-${mappedKey}`) ||
                      document.getElementById(`select-${mappedKey}`);
      }

      if (!targetInput) {
        showToast(`Variable "${key}" no encontrada en el panel — prueba la pestaña Avanzado`);
        return;
      }

      // Una selección del inspector nunca debe heredar un editor de color que
      // hubiera quedado abierto por una edición manual anterior.
      document.querySelectorAll('.hsl-sliders-panel').forEach((panel) => panel.remove());

      // ----- Expandir acordeones / pestañas que contengan el input -----

      // 1) Buscar en tab-content (pestaña avanzada)
      const tabContent = targetInput.closest('.tab-content');
      if (tabContent) {
        const tabId = tabContent.id.replace('content-', '');
        const header = document.getElementById(`accordion-header-${tabId}`);
        const content = document.getElementById(`content-${tabId}`);
        const arrow = header ? header.querySelector('.accordion-chevron') : null;
        if (content && content.style.display !== 'flex') {
          content.style.display = 'flex';
          if (header) header.classList.add('active');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
      }

      // 2) Buscar en paneles básicos (basic-panel) — mostrar el panel correcto
      const basicPanel = targetInput.closest('.basic-panel');
      if (basicPanel) {
        // Asegurar que el panel esté visible
        document.querySelectorAll('.basic-panel').forEach(p => p.style.display = 'none');
        basicPanel.style.display = 'block';
        // Activar su tab botón correspondiente
        const panelId = basicPanel.id;
        const tabBtn = document.querySelector(`.basic-tab-btn[data-panel="${panelId}"]`);
        if (tabBtn) {
          document.querySelectorAll('.basic-tab-btn').forEach(b => b.classList.remove('active'));
          tabBtn.classList.add('active');
        }
      }

      // ----- Scroll suave al input -----
      const inputGroup = targetInput.closest('.input-group') || targetInput.closest('.config-card') || targetInput;
      const headingGroup = /^h[1-6]-(?:color|line-height|margin-bottom)$/.test(key)
        ? targetInput.closest('.heading-settings-group')
        : null;
      if (headingGroup) {
        headingGroup.classList.add('is-expanded');
        headingGroup.querySelector('.heading-settings-toggle')?.setAttribute('aria-expanded', 'true');
      }
      const focusGroup = headingGroup || inputGroup;
      const controlPanel = targetInput.closest('.control-panel');

      // Dejar una referencia persistente y aislada del ajuste elegido con la gotita.
      document.querySelectorAll('.inspector-focus').forEach(element => {
        element.classList.remove('inspector-focus');
        element.removeAttribute('data-inspector-focus');
      });
      document.querySelectorAll('.control-panel.inspector-focus-mode').forEach(panel => {
        panel.classList.remove('inspector-focus-mode');
      });
      document.querySelectorAll('.inspector-reset-view').forEach(button => button.remove());
      focusGroup.classList.add('inspector-focus');
      if (controlPanel) controlPanel.classList.add('inspector-focus-mode');

      // Una vez aplicado el cambio, devolver el panel a su estado normal.
      let resetViewButton;
      const clearInspectorFocus = () => {
        if (!focusGroup.classList.contains('inspector-focus')) return;
        focusGroup.classList.remove('inspector-focus', 'highlight-pulse');
        focusGroup.removeAttribute('data-inspector-focus');
        if (controlPanel) controlPanel.classList.remove('inspector-focus-mode');
        if (resetViewButton) resetViewButton.remove();
      };
      resetViewButton = document.createElement('button');
      resetViewButton.type = 'button';
      resetViewButton.className = 'inspector-reset-view';
      resetViewButton.textContent = '↩ Vista normal';
      resetViewButton.title = 'Quitar el resaltado y mostrar todos los ajustes';
      resetViewButton.addEventListener('click', clearInspectorFocus);
      focusGroup.appendChild(resetViewButton);
      focusGroup.querySelectorAll('input, select, textarea').forEach(control => {
        control.addEventListener('change', clearInspectorFocus, { once: true });
      });

      setTimeout(() => {
        focusGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);

      // ----- Animación de destello -----
      focusGroup.classList.remove('highlight-pulse');
      void focusGroup.offsetWidth;
      focusGroup.classList.add('highlight-pulse');

      // La gotita lleva al control, pero no abre el editor HSL automáticamente:
      // así no tapa otros ajustes ni cambia el foco por un clic accidental.
      const mappedKey = specialMappings[key] || key;
      targetInput.focus({ preventScroll: true });

      let displayName = mappedKey.replace('-color', '').replace('picker-', '').replace('text-', '');
      displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      focusGroup.setAttribute('data-inspector-focus', headingGroup ? `Encabezado H${key[1]}: tipografía completa` : `Seleccionado: ${displayName}`);
      showToast(`🎨 Ajustando: ${displayName}`);
    }

    function updateModeButtonsActiveStates() {
      const isDark = currentMode === 'dark';
      const bmd = document.getElementById('basic-mode-dark');
      const bml = document.getElementById('basic-mode-light');
      const amd = document.getElementById('adv-mode-dark');
      const aml = document.getElementById('adv-mode-light');

      if (bmd) bmd.className = isDark ? 'mode-btn active' : 'mode-btn';
      if (bml) bml.className = isDark ? 'mode-btn' : 'mode-btn active';
      if (amd) amd.className = isDark ? 'mode-btn active' : 'mode-btn';
      if (aml) aml.className = isDark ? 'mode-btn' : 'mode-btn active';
    }

    function loadMockNote(noteId) {
      // Guard: don't run if workspace isn't visible yet
      const workspaceScreen = document.getElementById('screen-workspace');
      if (!workspaceScreen || workspaceScreen.style.display === 'none') return;

      // Helper for safe element access
      const getEl = (id) => document.getElementById(id);

      updateOutlineSidebar(noteId);

      if (noteId === 'options') {
        // Show options view, hide others
        getEl('view-editor')?.classList.remove('active');
        getEl('view-graph')?.classList.remove('active');
        getEl('view-canvas')?.classList.remove('active');
        getEl('view-database')?.classList.remove('active');
        const viewGraph = getEl('view-graph');
        const viewCanvas = getEl('view-canvas');
        const viewDatabase = getEl('view-database');
        if (viewGraph) viewGraph.style.display = 'none';
        if (viewCanvas) viewCanvas.style.display = 'none';
        if (viewDatabase) viewDatabase.style.display = 'none';

        const viewOptions = getEl('view-options');
        if (viewOptions) {
          viewOptions.classList.add('active');
          viewOptions.style.display = 'flex';
        }

        // Highlight active tab
        activeNoteId = noteId;
        document.querySelectorAll('[data-note]').forEach(el => el.classList.remove('active'));
        const tabNode = getEl(`tab-note-${noteId}`);
        const expNode = getEl(`exp-${noteId}`);
        if (tabNode) tabNode.classList.add('active');
        if (expNode) expNode.classList.add('active');

        // Update ribbon button states
        document.querySelectorAll('.obsidian-ribbon .ribbon-icon').forEach(btn => btn.classList.remove('active'));

        const previewWinTitle = getEl('preview-window-title');
        if (previewWinTitle) {
          previewWinTitle.textContent = `Opciones - Obsidian v1.6`;
        }
        return;
      }

      if (noteId === 'graph') {
        // Switch ribbon view programmatically
        getEl('view-editor')?.classList.remove('active');
        getEl('view-canvas')?.classList.remove('active');
        getEl('view-database')?.classList.remove('active');
        getEl('view-options')?.classList.remove('active');
        const viewCanvas = getEl('view-canvas');
        const viewDatabase = getEl('view-database');
        const viewOptions = getEl('view-options');
        if (viewCanvas) viewCanvas.style.display = 'none';
        if (viewDatabase) viewDatabase.style.display = 'none';
        if (viewOptions) viewOptions.style.display = 'none';
        
        const viewGraph = getEl('view-graph');
        if (viewGraph) {
          viewGraph.classList.add('active');
          viewGraph.style.display = 'block';
        }
        
        // Update ribbon button states
        document.querySelectorAll('.obsidian-ribbon .ribbon-icon').forEach(btn => btn.classList.remove('active'));
        getEl('btn-view-graph')?.classList.add('active');
        activeRibbonView = 'view-graph';
        
        // Highlight active note class
        activeNoteId = noteId;
        document.querySelectorAll('[data-note]').forEach(el => el.classList.remove('active'));
        const tabNode = getEl(`tab-note-${noteId}`);
        const expNode = getEl(`exp-${noteId}`);
        if (tabNode) tabNode.classList.add('active');
        if (expNode) expNode.classList.add('active');
        
        const previewWinTitle = getEl('preview-window-title');
        if (previewWinTitle) {
          previewWinTitle.textContent = `Vista de Grafo - Obsidian v1.6`;
        }
        if (window.vaultFiles) {
          updateGraphView(window.vaultFiles, noteId);
        }
        return;
      }

      if (noteId === 'canvas') {
        // Switch ribbon view programmatically to Canvas
        getEl('view-editor')?.classList.remove('active');
        getEl('view-graph')?.classList.remove('active');
        getEl('view-database')?.classList.remove('active');
        getEl('view-options')?.classList.remove('active');
        const viewGraph = getEl('view-graph');
        const viewDatabase = getEl('view-database');
        const viewOptions = getEl('view-options');
        if (viewGraph) viewGraph.style.display = 'none';
        if (viewDatabase) viewDatabase.style.display = 'none';
        if (viewOptions) viewOptions.style.display = 'none';
        
        const viewCanvas = getEl('view-canvas');
        if (viewCanvas) {
          viewCanvas.classList.add('active');
          viewCanvas.style.display = 'block';
        }
        
        // Update ribbon button states
        document.querySelectorAll('.obsidian-ribbon .ribbon-icon').forEach(btn => btn.classList.remove('active'));
        getEl('btn-view-canvas')?.classList.add('active');
        activeRibbonView = 'view-canvas';
        
        // Highlight active note class
        activeNoteId = noteId;
        document.querySelectorAll('[data-note]').forEach(el => el.classList.remove('active'));
        const tabNode = getEl(`tab-note-${noteId}`);
        const expNode = getEl(`exp-${noteId}`);
        if (tabNode) tabNode.classList.add('active');
        if (expNode) expNode.classList.add('active');
        
        const previewWinTitle = getEl('preview-window-title');
        if (previewWinTitle) {
          previewWinTitle.textContent = `Lienzo - Obsidian v1.6`;
        }
        return;
      }

      const note = notesData[noteId];
      if (!note) return;
      activeNoteId = noteId;

      document.querySelectorAll('[data-note]').forEach(el => el.classList.remove('active'));
      const expNode = getEl(`exp-${noteId}`);
      const tabNode = getEl(`tab-note-${noteId}`);
      if (expNode) expNode.classList.add('active');
      if (tabNode) tabNode.classList.add('active');

      const previewWinTitle = getEl('preview-window-title');

      if (noteId === 'database') {
        // Show database view, hide markdown views
        getEl('view-editor')?.classList.remove('active');
        getEl('view-graph')?.classList.remove('active');
        getEl('view-canvas')?.classList.remove('active');
        getEl('view-options')?.classList.remove('active');
        const viewGraph = getEl('view-graph');
        const viewCanvas = getEl('view-canvas');
        const viewOptions = getEl('view-options');
        if (viewGraph) viewGraph.style.display = 'none';
        if (viewCanvas) viewCanvas.style.display = 'none';
        if (viewOptions) viewOptions.style.display = 'none';

        getEl('view-database')?.classList.add('active');

        // Update ribbon states
        document.querySelectorAll('.obsidian-ribbon .ribbon-icon').forEach(btn => btn.classList.remove('active'));

        if (previewWinTitle) {
          previewWinTitle.textContent = `${note.title} - Obsidian v1.6`;
        }
      } else {
        // Hide database view
        const viewDatabase = getEl('view-database');
        if (viewDatabase) {
          viewDatabase.classList.remove('active');
          viewDatabase.style.display = 'none';
        }

        // Hide options view
        const viewOptions = getEl('view-options');
        if (viewOptions) {
          viewOptions.classList.remove('active');
          viewOptions.style.display = 'none';
        }

        // Set ribbon button active to editor if the ribbon was previously on graph or canvas
        if (activeRibbonView === 'view-graph' || activeRibbonView === 'view-canvas') {
          activeRibbonView = 'view-editor';
          document.querySelectorAll('.obsidian-ribbon .ribbon-icon').forEach(btn => btn.classList.remove('active'));
          getEl('btn-view-notes')?.classList.add('active');
        }

        // Restore active ribbon view
        getEl('view-editor')?.classList.remove('active');
        getEl('view-graph')?.classList.remove('active');
        getEl('view-canvas')?.classList.remove('active');
        const viewGraph = getEl('view-graph');
        const viewCanvas = getEl('view-canvas');
        if (viewGraph) viewGraph.style.display = 'none';
        if (viewCanvas) viewCanvas.style.display = 'none';

        getEl(activeRibbonView)?.classList.add('active');
        const activeView = getEl(activeRibbonView);
        if (activeView) {
          activeView.style.display = (activeRibbonView === 'view-editor') ? '' : 'block';
        }

        const editorTitle = getEl('editor-title');
        const editorBody = getEl('editor-body-content');
        if (editorTitle) editorTitle.textContent = note.title;
        if (editorBody) editorBody.innerHTML = note.html;
        if (previewWinTitle) {
          previewWinTitle.textContent = `${note.title} - Obsidian v1.6`;
        }

        updateWordCount();
        updateOutlineSidebar(noteId);
      }
    }

    function updateWordCount() {
      const editor = document.getElementById('editor-body-content');
      const counter = document.getElementById('status-word-count');
      if (!editor || !counter) return;
      const text = editor.innerText || editor.textContent || '';
      const cleanText = text.trim();
      if (!cleanText) {
        counter.textContent = '0 palabras';
        return;
      }
      const words = cleanText.split(/\s+/).filter(w => w.length > 0);
      counter.textContent = `${words.length} palabras`;
    }

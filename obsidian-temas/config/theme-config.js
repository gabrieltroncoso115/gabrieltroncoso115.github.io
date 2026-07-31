// Datos estaticos del constructor

    // Notas de previsualización
    const notesData = {
      'nota': {
        title: "Nota Principal",
        html: `
          <!-- Bloque 1: Properties (Frontmatter Nativo) -->
          <div class="metadata-container" style="margin-bottom: 20px;">
            <div class="metadata-title" style="font-size: 0.8rem; font-weight: 600; margin-bottom: 8px; color: var(--text-muted);">Properties</div>
            <div class="metadata-properties" style="display: flex; flex-direction: column; gap: 6px;">
              <div class="metadata-property" style="display: flex; align-items: center; font-size: 0.8rem;">
                <div class="metadata-property-key" data-inspect-target="metadata-label-text-color" style="width: 120px; display: flex; align-items: center; gap: 4px; color: var(--metadata-label-text-color);">
                  <span style="opacity: 0.8;">✍️</span> <span>autor</span>
                </div>
                <div class="metadata-property-value" data-inspect-target="metadata-value-text-color" style="flex: 1; color: var(--metadata-value-text-color);">
                  <input type="text" class="metadata-property-key-input" value="Gabriel Troncoso" data-inspect-target="metadata-value-bg" style="background-color: var(--metadata-value-bg, rgba(0,0,0,0.15)); border: none; border-radius: var(--radius-s); padding: 2px 6px; font-size: 0.8rem; color: inherit; width: 150px;">
                </div>
              </div>
              <div class="metadata-property" style="display: flex; align-items: center; font-size: 0.8rem;">
                <div class="metadata-property-key" data-inspect-target="metadata-label-text-color" style="width: 120px; display: flex; align-items: center; gap: 4px; color: var(--metadata-label-text-color);">
                  <span style="opacity: 0.8;">🏷️</span> <span>etiquetas</span>
                </div>
                <div class="metadata-property-value" style="flex: 1; display: flex; gap: 4px; align-items: center;">
                  <span class="metadata-tag" data-inspect-target="tag-color" style="color: var(--tag-color); background-color: var(--tag-background); border: 1px solid var(--tag-border-color); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">#importante</span>
                  <span class="metadata-tag" data-inspect-target="tag-color" style="color: var(--tag-color); background-color: var(--tag-background); border: 1px solid var(--tag-border-color); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">#proyecto</span>
                </div>
              </div>
              <div class="metadata-property" style="display: flex; align-items: center; font-size: 0.8rem;">
                <div class="metadata-property-key" data-inspect-target="metadata-label-text-color" style="width: 120px; display: flex; align-items: center; gap: 4px; color: var(--metadata-label-text-color);">
                  <span style="opacity: 0.8;">🔗</span> <span>enlace</span>
                </div>
                <div class="metadata-property-value" data-inspect-target="metadata-value-text-color" style="flex: 1; color: var(--metadata-value-text-color);">
                  <a href="#" class="internal-link" data-inspect-target="link-color" style="color: var(--link-color); text-decoration: var(--link-decoration); border-bottom: var(--link-border-bottom);">[[Plan de Trabajo 2026]]</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Bloque 2: Tipografía y Elementos Base -->
          <h1 class="editor-h1" contenteditable="true" data-inspect-target="h1-color">Encabezado H1: Título Principal</h1>
          <h2 class="editor-h2" contenteditable="true" data-inspect-target="h2-color">Encabezado H2: Título Secundario</h2>
          <h3 class="editor-h3" contenteditable="true" data-inspect-target="h3-color">Encabezado H3: Subtítulo</h3>
          <h4 class="editor-h4" contenteditable="true" data-inspect-target="h4-color">Encabezado H4</h4>
          <h5 class="editor-h5" contenteditable="true" data-inspect-target="h5-color">Encabezado H5</h5>
          <h6 class="editor-h6" contenteditable="true" data-inspect-target="h6-color">Encabezado H6</h6>

          <div class="editor-p" contenteditable="true" data-inspect-target="text-normal" style="margin-top: 16px;">
            Párrafo normal con <strong data-inspect-target="text-bold">negrita</strong>, <em data-inspect-target="text-italic">cursiva</em>, <s>tachado</s>, <mark data-inspect-target="text-highlight-bg">resaltado</mark>, <code class="editor-inline-code">código en línea</code>, <a href="#" class="internal-link" data-inspect-target="link-color">enlace interno</a>, <a href="#" class="internal-link broken" data-inspect-target="link-color">enlace inexistente</a>, <a href="https://obsidian.md" class="external-link" data-inspect-target="link-color">enlace externo ↗</a> y una nota al pie<sup><a href="#nota-pie" class="internal-link" data-inspect-target="link-color">1</a></sup>.
          </div>

          <ul style="margin-top: 15px;">
            <li><span data-inspect-target="list-marker-color" style="cursor:pointer;">Elemento principal de la lista (Nivel 1)</span></li>
            <li><span data-inspect-target="list-marker-color" style="cursor:pointer;">Segundo elemento de primer nivel</span>
              <ul data-inspect-target="list-indentation-guide-color">
                <li><span data-inspect-target="list-marker-color" style="cursor:pointer;">Sub-elementos anificados (Nivel 2) para guías</span></li>
                <li><span data-inspect-target="list-marker-color" style="cursor:pointer;">Otro sub-elemento en el segundo nivel</span></li>
              </ul>
            </li>
          </ul>

          <ol>
            <li><span data-inspect-target="list-marker-color">Primer paso de una lista numerada</span></li>
            <li><span data-inspect-target="list-marker-color">Segundo paso de una lista numerada</span></li>
          </ol>

          <div class="editor-checklist-item"><div class="editor-checkbox checked" data-inspect-target="checkbox-checked-color"></div><span>Tarea completada</span></div>
          <div class="editor-checklist-item"><div class="editor-checkbox" data-inspect-target="checkbox-checked-color"></div><span>Tarea pendiente</span></div>

          <div style="margin-top: 12px; margin-bottom: 20px;">
            <a href="#" class="tag" data-inspect-target="tag-color">#importante</a>
            <a href="#" class="tag" data-inspect-target="tag-color">#proyecto</a>
          </div>
          <div id="nota-pie" class="editor-p" style="font-size: 0.85em; color: var(--text-muted);">1. Ejemplo de una nota al pie.</div>
        `
      },
      'elementos': {
        title: "Bloques y Contenedores",
        html: `
          <div class="editor-p" contenteditable="true" data-inspect-target="text-normal">
            Esta nota reúne los elementos que ocupan un bloque propio: separadores, citas, código, callouts, ecuaciones, archivos incrustados y tablas. Los elementos de texto, listas y tareas se muestran sólo en «Nota Principal».
          </div>

          <hr style="border: 0; border-top: 1px solid var(--background-modifier-border); margin: 20px 0;">

          <div class="editor-p" style="margin: 12px 0;">
            Ecuación de bloque: <span style="display: block; text-align: center; padding: 10px; font-family: var(--font-monospace, monospace);">E = mc²</span>
          </div>

          <div class="internal-embed" style="margin: 12px 0; padding: 12px; border: 1px solid var(--background-modifier-border); border-radius: var(--radius-s); background: var(--background-primary-alt);">
            <strong>📎 Archivo incrustado</strong><br><span style="color: var(--text-muted); font-size: 0.85em;">![[diagrama-de-boveda.png]]</span>
          </div>

          <!-- Bloques de Código (CodeMirror 6) -->
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-normal); margin-top: 16px; margin-bottom: 8px;">Bloque de Código (CodeMirror 6)</div>
          <div style="position: relative; margin: 12px 0;">
            <div class="code-block-flair" data-tooltip="Copiar código al portapapeles">js</div>
            <pre class="cm-content" style="padding: 12px; border-radius: var(--radius-m); overflow-x: auto; font-size: 0.8em; border: 1px solid var(--background-modifier-border); margin: 0; white-space: pre-wrap;">
<div class="cm-line"><span class="cm-keyword">const</span> <span class="cm-variable">vault</span> = <span class="cm-string">"Mi Bóveda"</span>; <span class="cm-comment">// Configuración</span></div><div class="cm-line"><span class="cm-keyword">function</span> <span class="cm-variable">initTheme</span>() {</div><div class="cm-line">  <span class="cm-keyword">return</span> <span class="cm-string">"Obsidian Pro"</span>;</div><div class="cm-line">}</div></pre>
          </div>

          <!-- Coincidencias de Búsqueda -->
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-normal); margin-top: 16px; margin-bottom: 8px;">Resultados de Búsqueda (Search Match)</div>
          <div class="editor-p" style="margin: 12px 0;">
            Coincidencia activa en texto: <span class="cm-searchMatch" style="border-radius: 2px; padding: 1px 3px;">palabra_buscada</span>.
            <div class="search-result-file-matches" style="padding: 6px 12px; border-radius: var(--radius-s); margin-top: 8px; display: block; font-size: 0.75rem; border: 1px solid var(--background-modifier-border);">
              Línea con coincidencia de búsqueda: "...encontrando la <span class="cm-searchMatch" style="font-weight: 600;">palabra_buscada</span> en la nota."
            </div>
          </div>

          <!-- Bloque de Cita -->
          <div class="editor-blockquote" contenteditable="true" data-inspect-target="blockquote-bg" style="border-left: var(--blockquote-border-width, 4px) solid var(--blockquote-border-color, var(--interactive-accent)); background-color: var(--blockquote-bg); margin: 16px 0; padding: 10px 14px;">
            "La productividad no se trata de hacer más cosas de manera acelerada, sino de crear el espacio mental necesario para concentrarse en lo que realmente aporta valor y estructurar el conocimiento de forma duradera para el largo plazo."
          </div>

          <!-- Cajas Destacadas (Callouts) -->
          <div class="callout" data-callout="default" data-inspect-target="callout-border-color" style="margin: 12px 0;">
            <div class="callout-title">
              <span class="callout-icon">📌</span>
              <span class="callout-title-inner" contenteditable="true">Callout General (Default)</span>
            </div>
            <div class="callout-content" contenteditable="true">
              Este callout utiliza las variables generales de borde y fondo de callout del panel de control.
            </div>
          </div>

          <div class="callout" data-callout="note" data-inspect-target="callout-color-note" style="margin: 12px 0;">
            <div class="callout-title">
              <span class="callout-icon">ℹ️</span>
              <span class="callout-title-inner" contenteditable="true">Nota Informativa (Note)</span>
            </div>
            <div class="callout-content" contenteditable="true">
              Este es un callout informativo estándar. Muestra información general relevante y responde a la variable de color Nota.
            </div>
          </div>

          <div class="callout" data-callout="tip" data-inspect-target="callout-color-success" style="margin: 12px 0;">
            <div class="callout-title">
              <span class="callout-icon">💡</span>
              <span class="callout-title-inner" contenteditable="true">Consejo Práctico (Tip)</span>
            </div>
            <div class="callout-content" contenteditable="true">
              Este bloque de consejo responde a la variable de color de Éxito / Éxitos y Consejos (Success / Tip).
            </div>
          </div>

          <div class="callout" data-callout="warning" data-inspect-target="callout-color-warning" style="margin: 12px 0;">
            <div class="callout-title">
              <span class="callout-icon">⚠️</span>
              <span class="callout-title-inner" contenteditable="true">Advertencia (Warning)</span>
            </div>
            <div class="callout-content" contenteditable="true">
              Este bloque de advertencia responde a la variable de color de Alerta (Warning).
            </div>
          </div>

          <div class="callout" data-callout="danger" data-inspect-target="callout-color-danger" style="margin: 12px 0;">
            <div class="callout-title">
              <span class="callout-icon">❌</span>
              <span class="callout-title-inner" contenteditable="true">Peligro Crítico (Danger)</span>
            </div>
            <div class="callout-content" contenteditable="true">
              Este bloque de peligro responde a la variable de color de Peligro / Peligro y Errores (Danger / Error).
            </div>
          </div>

          <div class="callout" data-callout="example" data-inspect-target="callout-color-example" style="margin: 12px 0;">
            <div class="callout-title"><span class="callout-icon">🧪</span><span class="callout-title-inner" contenteditable="true">Ejemplo (Example)</span></div>
            <div class="callout-content" contenteditable="true">Callout para muestras o demostraciones.</div>
          </div>

          <div class="callout" data-callout="quote" data-inspect-target="callout-color-quote" style="margin: 12px 0;">
            <div class="callout-title"><span class="callout-icon">❝</span><span class="callout-title-inner" contenteditable="true">Cita (Quote)</span></div>
            <div class="callout-content" contenteditable="true">Callout para una cita, resumen o abstract.</div>
          </div>

          <!-- Tabla Estándar de Markdown -->
          <table style="margin-top: 16px;">
            <thead>
              <tr data-inspect-target="table-header-bg">
                <th contenteditable="true" data-inspect-target="table-header-bg">Componente</th>
                <th contenteditable="true" data-inspect-target="table-header-bg">Estado de Soporte</th>
              </tr>
            </thead>
            <tbody>
              <tr data-inspect-target="table-border-color">
                <td contenteditable="true" data-inspect-target="table-border-color">Bloques de Código</td>
                <td contenteditable="true" data-inspect-target="table-border-color">Completo</td>
              </tr>
              <tr class="table-zebra-row" data-inspect-target="table-row-alt-bg">
                <td contenteditable="true" data-inspect-target="table-border-color">Vistas Especiales</td>
                <td contenteditable="true" data-inspect-target="table-border-color">Parcial</td>
              </tr>
            </tbody>
          </table>
        `
      },
      'database': {
        title: "Ayudas de juego.base",
        html: `
          <div class="bases-view">
            <!-- Fila de Filtros Activos (Compacta y Estilizada) -->
            <div class="bases-header" style="display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; margin-bottom: 8px; background-color: var(--background-primary-alt); border-radius: var(--radius-s); border: 1px solid var(--background-modifier-border); font-size: 0.7rem; color: var(--text-muted);">
              <span style="font-weight: 500;">Filtros: Ninguno</span>
              <div style="display: flex; gap: 4px;">
                <button class="db-toolbar-btn db-toolbar-btn-color" data-inspect-target="db-toolbar-btn-color" style="font-size: 0.65rem; padding: 2px 6px;">+ Add filter</button>
                <button class="db-toolbar-btn db-toolbar-btn-color" data-inspect-target="db-toolbar-btn-hover-bg" style="font-size: 0.65rem; padding: 2px 6px;">Sort</button>
              </div>
            </div>
            
            <div style="overflow-x: auto; width: 100%;">
              <table class="bases-table">
                <thead class="bases-thead">
                  <tr class="bases-tr">
                    <th class="bases-th" style="width: 32%;">
                      <div class="bases-th-content">
                        <span class="db-prop-name">Proyecto</span>
                      </div>
                    </th>
                    <th class="bases-th" style="width: 18%;">
                      <div class="bases-th-content">
                        <span class="db-prop-name">Prioridad</span>
                      </div>
                    </th>
                    <th class="bases-th" style="width: 25%;">
                      <div class="bases-th-content">
                        <span class="db-prop-name">Fecha de Entrega</span>
                      </div>
                    </th>
                    <th class="bases-th" style="width: 25%;">
                      <div class="bases-th-content">
                        <span class="db-prop-name">Estado</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="bases-tbody">
                  <tr class="bases-tr db-row db-row-hover-bg" data-inspect-target="db-row-hover-bg">
                    <td class="bases-td" style="font-weight: 500;">
                      <span style="margin-right: 6px; opacity: 0.8;">📄</span>
                      <a href="#" class="db-link" style="color: var(--link-color, #7f6df6); text-decoration: none;">Rediseño Web</a>
                    </td>
                    <td class="bases-td">
                      <span class="db-status-pill pill-danger">Alta</span>
                    </td>
                    <td class="bases-td" style="color: var(--text-muted);">2026-07-01</td>
                    <td class="bases-td">
                      <div class="editor-checkbox checked" data-inspect-target="checkbox-checked-color"></div>
                    </td>
                  </tr>
                  <tr class="bases-tr db-row db-row-hover-bg" data-inspect-target="db-row-hover-bg">
                    <td class="bases-td" style="font-weight: 500;">
                      <span style="margin-right: 6px; opacity: 0.8;">📄</span>
                      <a href="#" class="db-link" style="color: var(--link-color, #7f6df6); text-decoration: none;">Revisión de Estilos</a>
                    </td>
                    <td class="bases-td">
                      <span class="db-status-pill pill-warning">Media</span>
                    </td>
                    <td class="bases-td" style="color: var(--text-muted);">2026-08-12</td>
                    <td class="bases-td">
                      <div class="editor-checkbox" data-inspect-target="checkbox-checked-color"></div>
                    </td>
                  </tr>
                  <tr class="bases-tr db-row db-row-hover-bg" data-inspect-target="db-row-hover-bg">
                    <td class="bases-td" style="font-weight: 500;">
                      <span style="margin-right: 6px; opacity: 0.8;">📄</span>
                      <a href="#" class="db-link" style="color: var(--link-color, #7f6df6); text-decoration: none;">Pruebas de Compilación</a>
                    </td>
                    <td class="bases-td">
                      <span class="db-status-pill pill-info">Baja</span>
                    </td>
                    <td class="bases-td" style="color: var(--text-muted);">2026-09-15</td>
                    <td class="bases-td">
                      <div class="editor-checkbox" data-inspect-target="checkbox-checked-color"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `
      }
    };

    // Valores por Defecto Oficiales
    const officialDefaultVariables = {
      dark: {
        '--background-primary': '#1e1e1e',
        '--background-primary-alt': '#161616',
        '--background-secondary': '#202020',
        '--background-secondary-alt': '#1a1a1a',
        '--background-modifier-border': '#303030',
        '--border-width': '1px',
        '--opacity-glass': '0.85',
        '--text-normal': '#dcddde',
        '--text-muted': '#a4a6a8',
        '--text-bold': '#ffffff',
        '--text-italic': '#dcddde',
        '--text-highlight-bg': 'rgba(245, 158, 11, 0.3)',
        '--link-color': '#7f6df6',
        '--link-color-hover': '#8b7bf7',
        '--link-decoration': 'none',
        '--link-border-bottom': 'none',
        '--interactive-accent': '#7f6df6',
        '--interactive-accent-hover': '#8b7bf7',
        '--tab-background-active': '#1e1e1e',
        '--tab-text-active': '#ffffff',
        '--tab-background-inactive': '#1a1a1a',
        '--tab-text-inactive': '#a4a6a8',
        '--nav-item-background-active': 'rgba(255, 255, 255, 0.05)',
        '--nav-item-text-active': '#7f6df6',
        '--nav-item-background-hover': 'rgba(255, 255, 255, 0.03)',
        '--nav-item-text-hover': '#ffffff',
        '--nav-item-tag-color': '#7f6df6',
        '--status-bar-background': '#1a1a1a',
        '--status-bar-text': '#a4a6a8',
        '--scrollbar-thumb-bg': '#303030',
        '--scrollbar-width': '8px',
        '--button-primary-background': '#7f6df6',
        '--button-primary-background-hover': '#8b7bf7',
        '--button-primary-background-active': '#6b59e2',
        '--button-primary-text': '#ffffff',
        '--button-primary-text-hover': '#ffffff',
        '--button-primary-text-active': '#ffffff',
        '--button-background': '#303030',
        '--button-background-hover': '#3e3e3e',
        '--button-background-active': '#242424',
        '--button-text': '#dcddde',
        '--button-text-hover': '#ffffff',
        '--button-text-active': '#ffffff',
        '--button-border-color': '#303030',
        '--button-font-family': 'inherit',
        '--button-font-size': '0.85em',
        '--checkbox-radius': '4px',
        '--checkbox-checked-color': '#7f6df6',
        '--text-selection': 'rgba(127, 109, 246, 0.3)',
        '--search-result-background': 'rgba(245, 158, 11, 0.35)',
        '--callout-border-color': '#7f6df6',
        '--callout-bg-color': 'rgba(127, 109, 246, 0.08)',
        '--callout-border-width': '3px',
        '--callout-radius': '8px',
        '--callout-padding': '12px 16px',
        '--callout-margin': '1.2rem 0',
        '--callout-title-size': 'inherit',
        '--callout-title-weight': '600',
        '--callout-title-font': 'inherit',
        '--callout-title-spacing': '6px',
        '--callout-body-size': 'inherit',
        '--callout-color-note': '#008da5',
        '--callout-color-success': '#4abd89',
        '--callout-color-warning': '#d97706',
        '--callout-color-danger': '#e74c3c',
        '--callout-color-example': '#7c3aed',
        '--callout-color-quote': '#6b7280',
        '--blockquote-border-color': '#7f6df6',
        '--blockquote-border-width': '4px',
        '--blockquote-bg': 'rgba(127, 109, 246, 0.03)',
        '--hr-color': '#303030',
        '--hr-thickness': '2px',
        '--table-border-color': '#303030',
        '--table-header-bg': '#161616',
        '--table-row-alt-bg': 'rgba(26, 26, 26, 0.5)',
        '--table-border-width': '1px',
        '--metadata-background': 'rgba(0, 0, 0, 0.15)',
        '--metadata-label-text-color': '#a3a3a3',
        '--metadata-value-text-color': '#e5e5e5',
        '--metadata-key-bg': 'rgba(255, 255, 255, 0.03)',
        '--metadata-value-bg': 'rgba(255, 255, 255, 0.05)',
        '--code-background': '#282828',
        '--code-normal': '#e0e0e0',
        '--code-keyword': '#f472b6',
        '--code-string': '#34d399',
        '--code-comment': '#78716c',
        '--menu-background': '#242424',
        '--menu-item-hover': 'rgba(255, 255, 255, 0.05)',
        '--tooltip-background': '#000000',
        '--tooltip-text-color': '#ffffff',
        '--modal-background': '#202020',
        '--modal-border': '#303030',
        '--modal-backdrop-blur': '4px',
        '--background-modifier-cover': 'rgba(0, 0, 0, 0.6)',
        '--settings-tab-background': '#1a1a1a',
        '--settings-dropdown-bg': '#282828',
        '--graph-controls-bg': 'rgba(32, 32, 32, 0.85)',
        '--tag-color': '#7f6df6',
        '--tag-background': 'rgba(127, 109, 246, 0.1)',
        '--tag-border': 'rgba(127, 109, 246, 0.2)',
        '--table-row-hover-bg': 'transparent',
        '--table-width': '100%',
        '--ribbon-background-hover': 'rgba(255, 255, 255, 0.05)',
        '--ribbon-background-active': 'rgba(127, 109, 246, 0.1)',
        '--ribbon-item-color-hover': '#ffffff',
        '--ribbon-item-color-active': '#7f6df6',
        '--graph-node': '#7f6df6',
        '--graph-node-focused': '#8b7bf7',
        '--graph-line': '#303030',
        '--graph-text': '#a4a6a8',
        '--canvas-background': '#161616',
        '--canvas-card-bg': '#1e1e1e',
        '--canvas-arrow-color': '#7f6df6',
        '--canvas-arrow-width': '2px',
        '--popover-background': '#202020',
        '--popover-border-color': '#303030',
        '--font-text': 'Inter, sans-serif',
        '--font-monospace': 'Fira Code, monospace',
        '--h1-size': '1.8em',
        '--h1-line-height': '1.2',
        '--h1-margin-bottom': '0.5em',
        '--h1-color': '#ffffff',
        '--h2-size': '1.5em',
        '--h2-line-height': '1.2',
        '--h2-margin-bottom': '0.5em',
        '--h2-color': '#f2f2f2',
        '--h3-size': '1.25em',
        '--h3-line-height': '1.2',
        '--h3-margin-bottom': '0.5em',
        '--h3-color': '#f2f2f2',
        '--h4-size': '1.1em',
        '--h4-line-height': '1.2',
        '--h4-margin-bottom': '0.5em',
        '--h4-color': '#a4a6a8',
        '--h5-size': '1.0em',
        '--h5-line-height': '1.2',
        '--h5-margin-bottom': '0.5em',
        '--h5-color': '#a4a6a8',
        '--h6-size': '0.85em',
        '--h6-line-height': '1.2',
        '--h6-margin-bottom': '0.5em',
        '--h6-color': '#a4a6a8',
        '--radius-s': '4px',
        '--radius-m': '8px',
        '--radius-l': '12px',
        '--h1-weight': '600',
        '--h1-font': 'inherit',
        '--h2-weight': '600',
        '--h2-font': 'inherit',
        '--h3-weight': '600',
        '--h3-font': 'inherit',
        '--h4-weight': '600',
        '--h4-font': 'inherit',
        '--h5-weight': '600',
        '--h5-font': 'inherit',
        '--h6-weight': '600',
        '--h6-font': 'inherit',
        '--list-marker-color': '#7f6df6',
        '--list-indentation-guide-color': '#303030',
        '--nav-indentation-guide-color': '#303030',
        '--titlebar-background': '#1a1a1a',
        '--titlebar-text-color-focused': '#a4a6a8',
        '--global-background-blur': '0px',
        '--global-background-image': 'none',
        '--text-on-accent': '#ffffff',
        '--db-toolbar-btn-color': '#a4a6a8',
        '--db-toolbar-btn-hover-bg': 'rgba(255, 255, 255, 0.05)',
        '--db-row-hover-bg': 'rgba(255, 255, 255, 0.05)',
        '--db-card-bg': '#161616',
        '--db-card-border': '#303030',
        '--db-card-border-hover': '#7f6df6',
        '--list-spacing': '0.5em',
        '--list-line-height': '1.5',
        '--p-spacing': '0.8em',
        '--heading-spacing': '1em',
        '--line-height-normal': '1.5',
        '--popover-width': '450px',
        '--popover-height': '350px',
        '--file-line-width': '700px'
      },
      light: {
        '--background-primary': '#ffffff',
        '--background-primary-alt': '#fafafa',
        '--background-secondary': '#f2f2f2',
        '--background-secondary-alt': '#e8e8e8',
        '--background-modifier-border': '#e0e0e0',
        '--border-width': '1px',
        '--opacity-glass': '0.9',
        '--text-normal': '#2e2e2e',
        '--text-muted': '#646464',
        '--text-bold': '#111111',
        '--text-italic': '#2e2e2e',
        '--text-highlight-bg': 'rgba(245, 158, 11, 0.2)',
        '--link-color': '#7f6df6',
        '--link-color-hover': '#6b59e2',
        '--link-decoration': 'none',
        '--link-border-bottom': 'none',
        '--interactive-accent': '#7f6df6',
        '--interactive-accent-hover': '#6b59e2',
        '--tab-background-active': '#ffffff',
        '--tab-text-active': '#111111',
        '--tab-background-inactive': '#e8e8e8',
        '--tab-text-inactive': '#646464',
        '--nav-item-background-active': 'rgba(0, 0, 0, 0.05)',
        '--nav-item-text-active': '#7f6df6',
        '--nav-item-background-hover': 'rgba(0, 0, 0, 0.03)',
        '--nav-item-text-hover': '#111111',
        '--nav-item-tag-color': '#7f6df6',
        '--status-bar-background': '#e8e8e8',
        '--status-bar-text': '#646464',
        '--scrollbar-thumb-bg': '#e0e0e0',
        '--scrollbar-width': '8px',
        '--button-primary-background': '#7f6df6',
        '--button-primary-background-hover': '#6b59e2',
        '--button-primary-background-active': '#5847c9',
        '--button-primary-text': '#ffffff',
        '--button-primary-text-hover': '#ffffff',
        '--button-primary-text-active': '#ffffff',
        '--button-background': '#f0f0f0',
        '--button-background-hover': '#e0e0e0',
        '--button-background-active': '#d0d0d0',
        '--button-text': '#111111',
        '--button-text-hover': '#000000',
        '--button-text-active': '#000000',
        '--button-border-color': '#cccccc',
        '--button-font-family': 'inherit',
        '--button-font-size': '0.85em',
        '--checkbox-radius': '4px',
        '--checkbox-checked-color': '#7f6df6',
        '--text-selection': 'rgba(107, 70, 193, 0.2)',
        '--search-result-background': 'rgba(245, 158, 11, 0.25)',
        '--callout-border-color': '#7f6df6',
        '--callout-bg-color': 'rgba(127, 109, 246, 0.05)',
        '--callout-border-width': '3px',
        '--callout-radius': '8px',
        '--callout-padding': '12px 16px',
        '--callout-margin': '1.2rem 0',
        '--callout-title-size': 'inherit',
        '--callout-title-weight': '600',
        '--callout-title-font': 'inherit',
        '--callout-title-spacing': '6px',
        '--callout-body-size': 'inherit',
        '--callout-color-note': '#008da5',
        '--callout-color-success': '#4abd89',
        '--callout-color-warning': '#d97706',
        '--callout-color-danger': '#e74c3c',
        '--callout-color-example': '#7c3aed',
        '--callout-color-quote': '#6b7280',
        '--blockquote-border-color': '#7f6df6',
        '--blockquote-border-width': '4px',
        '--blockquote-bg': 'rgba(127, 109, 246, 0.02)',
        '--hr-color': '#e0e0e0',
        '--hr-thickness': '2px',
        '--table-border-color': '#e0e0e0',
        '--table-header-bg': '#f5f5f5',
        '--table-row-alt-bg': 'rgba(250, 250, 250, 0.5)',
        '--table-border-width': '1px',
        '--metadata-background': 'rgba(0, 0, 0, 0.05)',
        '--metadata-label-text-color': '#666666',
        '--metadata-value-text-color': '#222222',
        '--metadata-key-bg': 'rgba(0, 0, 0, 0.02)',
        '--metadata-value-bg': 'rgba(0, 0, 0, 0.04)',
        '--code-background': '#f5f5f5',
        '--code-normal': '#2e2e2e',
        '--code-keyword': '#db2777',
        '--code-string': '#059669',
        '--code-comment': '#78716c',
        '--menu-background': '#ffffff',
        '--menu-item-hover': 'rgba(0, 0, 0, 0.05)',
        '--tooltip-background': '#111111',
        '--tooltip-text-color': '#ffffff',
        '--modal-background': '#ffffff',
        '--modal-border': '#e0e0e0',
        '--modal-backdrop-blur': '4px',
        '--background-modifier-cover': 'rgba(0, 0, 0, 0.2)',
        '--settings-tab-background': '#e8e8e8',
        '--settings-dropdown-bg': '#f5f5f5',
        '--graph-controls-bg': 'rgba(255, 255, 255, 0.85)',
        '--tag-color': '#7f6df6',
        '--tag-background': 'rgba(127, 109, 246, 0.05)',
        '--tag-border': 'rgba(127, 109, 246, 0.15)',
        '--table-row-hover-bg': 'transparent',
        '--table-width': '100%',
        '--ribbon-background-hover': 'rgba(0, 0, 0, 0.05)',
        '--ribbon-background-active': 'rgba(127, 109, 246, 0.15)',
        '--ribbon-item-color-hover': '#111111',
        '--ribbon-item-color-active': '#7f6df6',
        '--graph-node': '#7f6df6',
        '--graph-node-focused': '#6b59e2',
        '--graph-line': '#e0e0e0',
        '--graph-text': '#646464',
        '--canvas-background': '#fafafa',
        '--canvas-card-bg': '#ffffff',
        '--canvas-arrow-color': '#7f6df6',
        '--canvas-arrow-width': '2px',
        '--popover-background': '#ffffff',
        '--popover-border-color': '#e0e0e0',
        '--font-text': 'Inter, sans-serif',
        '--font-monospace': 'Fira Code, monospace',
        '--h1-size': '1.8em',
        '--h1-line-height': '1.2',
        '--h1-margin-bottom': '0.5em',
        '--h1-color': '#111111',
        '--h2-size': '1.5em',
        '--h2-line-height': '1.2',
        '--h2-margin-bottom': '0.5em',
        '--h2-color': '#222222',
        '--h3-size': '1.25em',
        '--h3-line-height': '1.2',
        '--h3-margin-bottom': '0.5em',
        '--h3-color': '#222222',
        '--h4-size': '1.1em',
        '--h4-line-height': '1.2',
        '--h4-margin-bottom': '0.5em',
        '--h4-color': '#646464',
        '--h5-size': '1.0em',
        '--h5-line-height': '1.2',
        '--h5-margin-bottom': '0.5em',
        '--h5-color': '#646464',
        '--h6-size': '0.85em',
        '--h6-line-height': '1.2',
        '--h6-margin-bottom': '0.5em',
        '--h6-color': '#646464',
        '--radius-s': '4px',
        '--radius-m': '8px',
        '--radius-l': '12px',
        '--h1-weight': '600',
        '--h1-font': 'inherit',
        '--h2-weight': '600',
        '--h2-font': 'inherit',
        '--h3-weight': '600',
        '--h3-font': 'inherit',
        '--h4-weight': '600',
        '--h4-font': 'inherit',
        '--h5-weight': '600',
        '--h5-font': 'inherit',
        '--h6-weight': '600',
        '--h6-font': 'inherit',
        '--list-marker-color': '#7f6df6',
        '--list-indentation-guide-color': '#e0e0e0',
        '--nav-indentation-guide-color': '#e0e0e0',
        '--titlebar-background': '#e8e8e8',
        '--titlebar-text-color-focused': '#646464',
        '--global-background-blur': '0px',
        '--global-background-image': 'none',
        '--text-on-accent': '#ffffff',
        '--db-toolbar-btn-color': '#646464',
        '--db-toolbar-btn-hover-bg': 'rgba(0, 0, 0, 0.05)',
        '--db-row-hover-bg': 'rgba(0, 0, 0, 0.05)',
        '--db-card-bg': '#fafafa',
        '--db-card-border': '#e0e0e0',
        '--db-card-border-hover': '#7f6df6',
        '--list-spacing': '0.5em',
        '--list-line-height': '1.5',
        '--p-spacing': '0.8em',
        '--heading-spacing': '1em',
        '--line-height-normal': '1.5',
        '--popover-width': '450px',
        '--popover-height': '350px',
        '--file-line-width': '700px'
      }
    };
    // Mapeo entre IDs de Controles y variables CSS
    const inputMappings = {
      'bg-primary': '--background-primary',
      'bg-primary-alt': '--background-primary-alt',
      'bg-secondary': '--background-secondary',
      'bg-secondary-alt': '--background-secondary-alt',
      'bg-border': '--background-modifier-border',
      'border-width': '--border-width',
      'opacity-glass': '--opacity-glass',
      'text-normal': '--text-normal',
      'text-muted': '--text-muted',
      'text-bold': '--text-bold',
      'text-italic': '--text-italic',
      'text-highlight-bg': '--text-highlight-bg',
      'link-color': '--link-color',
      'link-color-hover': '--link-color-hover',
      'link-decoration': '--link-decoration',
      'accent': '--interactive-accent',
      'accent-hover': '--interactive-accent-hover',
      'tab-bg-active': '--tab-background-active',
      'tab-text-active': '--tab-text-active',
      'tab-bg-inactive': '--tab-background-inactive',
      'tab-text-inactive': '--tab-text-inactive',
      'nav-bg-active': '--nav-item-background-active',
      'nav-text-active': '--nav-item-text-active',
      'nav-bg-hover': '--nav-item-background-hover',
      'nav-text-hover': '--nav-item-text-hover',
      'nav-item-tag-color': '--nav-item-tag-color',
      'status-bg': '--status-bar-background',
      'status-text': '--status-bar-text',
      'scrollbar-thumb': '--scrollbar-thumb-bg',
      'scrollbar-width': '--scrollbar-width',
      'button-primary-bg': '--button-primary-background',
      'button-primary-bg-hover': '--button-primary-background-hover',
      'button-primary-bg-active': '--button-primary-background-active',
      'button-primary-text': '--button-primary-text',
      'button-primary-text-hover': '--button-primary-text-hover',
      'button-primary-text-active': '--button-primary-text-active',
      'button-bg': '--button-background',
      'button-bg-hover': '--button-background-hover',
      'button-bg-active': '--button-background-active',
      'button-text': '--button-text',
      'button-text-hover': '--button-text-hover',
      'button-text-active': '--button-text-active',
      'button-border': '--button-border-color',
      'button-font': '--button-font-family',
      'button-font-size': '--button-font-size',
      'checkbox-radius': '--checkbox-radius',
      'checkbox-checked-color': '--checkbox-checked-color',
      'text-selection': '--text-selection',
      'search-result-bg': '--search-result-background',
      'callout-border-color': '--callout-border-color',
      'callout-bg': '--callout-bg-color',
      'callout-border-width': '--callout-border-width',
      'callout-radius': '--callout-radius',
      'callout-padding': '--callout-padding',
      'callout-margin': '--callout-margin',
      'callout-title-size': '--callout-title-size',
      'callout-title-weight': '--callout-title-weight',
      'callout-title-font': '--callout-title-font',
      'callout-title-spacing': '--callout-title-spacing',
      'callout-body-size': '--callout-body-size',
      'callout-color-note': '--callout-color-note',
      'callout-color-success': '--callout-color-success',
      'callout-color-warning': '--callout-color-warning',
      'callout-color-danger': '--callout-color-danger',
      'callout-color-example': '--callout-color-example',
      'callout-color-quote': '--callout-color-quote',
      'blockquote-border-color': '--blockquote-border-color',
      'blockquote-border-width': '--blockquote-border-width',
      'blockquote-bg': '--blockquote-bg',
      'hr-color': '--hr-color',
      'hr-thickness': '--hr-thickness',
      'table-border-color': '--table-border-color',
      'table-header-bg': '--table-header-bg',
      'table-row-alt-bg': '--table-row-alt-bg',
      'table-border-width': '--table-border-width',
      'metadata-label-text-color': '--metadata-label-text-color',
      'metadata-value-text-color': '--metadata-value-text-color',
      'metadata-key-bg': '--metadata-key-bg',
      'metadata-value-bg': '--metadata-value-bg',
      'code-bg': '--code-background',
      'code-normal': '--code-normal',
      'code-keyword': '--code-keyword',
      'code-string': '--code-string',
      'code-comment': '--code-comment',
      'tag-color': '--tag-color',
      'tag-bg': '--tag-background',
      'tag-border-color': '--tag-border',
      'table-row-hover-bg': '--table-row-hover-bg',
      'table-width': '--table-width',
      'ribbon-bg-hover': '--ribbon-background-hover',
      'ribbon-bg-active': '--ribbon-background-active',
      'ribbon-item-hover': '--ribbon-item-color-hover',
      'ribbon-item-active': '--ribbon-item-color-active',
      'graph-node': '--graph-node',
      'graph-node-focused': '--graph-node-focused',
      'graph-line': '--graph-line',
      'graph-text': '--graph-text',
      'graph-controls-bg': '--graph-controls-bg',
      'canvas-bg': '--canvas-background',
      'canvas-card-bg': '--canvas-card-bg',
      'canvas-arrow-color': '--canvas-arrow-color',
      'canvas-arrow-width': '--canvas-arrow-width',
      'font-text': '--font-text',
      'font-monospace': '--font-monospace',
      'h1-size': '--h1-size',
      'h1-line-height': '--h1-line-height',
      'h1-margin-bottom': '--h1-margin-bottom',
      'h1-color': '--h1-color',
      'h2-size': '--h2-size',
      'h2-line-height': '--h2-line-height',
      'h2-margin-bottom': '--h2-margin-bottom',
      'h2-color': '--h2-color',
      'h3-size': '--h3-size',
      'h3-line-height': '--h3-line-height',
      'h3-margin-bottom': '--h3-margin-bottom',
      'h3-color': '--h3-color',
      'h4-size': '--h4-size',
      'h4-line-height': '--h4-line-height',
      'h4-margin-bottom': '--h4-margin-bottom',
      'h4-color': '--h4-color',
      'h5-size': '--h5-size',
      'h5-line-height': '--h5-line-height',
      'h5-margin-bottom': '--h5-margin-bottom',
      'h5-color': '--h5-color',
      'h6-size': '--h6-size',
      'h6-line-height': '--h6-line-height',
      'h6-margin-bottom': '--h6-margin-bottom',
      'h6-color': '--h6-color',
      'radius-s': '--radius-s',
      'radius-m': '--radius-m',
      'radius-l': '--radius-l',
      'h1-weight': '--h1-weight',
      'h1-font': '--h1-font',
      'h2-weight': '--h2-weight',
      'h2-font': '--h2-font',
      'h3-weight': '--h3-weight',
      'h3-font': '--h3-font',
      'h4-weight': '--h4-weight',
      'h4-font': '--h4-font',
      'h5-weight': '--h5-weight',
      'h5-font': '--h5-font',
      'h6-weight': '--h6-weight',
      'h6-font': '--h6-font',
      'list-marker-color': '--list-marker-color',
      'list-indentation-guide-color': '--list-indentation-guide-color',
      'nav-indentation-guide-color': '--nav-indentation-guide-color',
      'titlebar-bg': '--titlebar-background',
      'titlebar-text': '--titlebar-text-color-focused',
      'global-bg-image': '--global-background-image',
      'global-bg-blur': '--global-background-blur',
      'popover-bg': '--popover-background',
      'popover-border': '--popover-border-color',
      'text-on-accent': '--text-on-accent',
      'db-toolbar-btn-color': '--db-toolbar-btn-color',
      'db-toolbar-btn-hover-bg': '--db-toolbar-btn-hover-bg',
      'db-row-hover-bg': '--db-row-hover-bg',
      'db-card-bg': '--db-card-bg',
      'db-card-border': '--db-card-border',
      'db-card-border-hover': '--db-card-border-hover',
      'list-spacing': '--list-spacing',
      'list-line-height': '--list-line-height',
      'p-spacing': '--p-spacing',
      'heading-spacing': '--heading-spacing',
      'line-height-normal': '--line-height-normal',
      'popover-width': '--popover-width',
      'popover-height': '--popover-height',
      'menu-bg': '--menu-background',
      'menu-item-hover': '--menu-item-hover',
      'tooltip-bg': '--tooltip-background',
      'tooltip-text': '--tooltip-text-color',
      'modal-bg': '--modal-background',
      'modal-border': '--modal-border',
      'modal-backdrop-blur': '--modal-backdrop-blur',
      'modal-backdrop-color': '--background-modifier-cover',
      'settings-tab-bg': '--settings-tab-background',
      'settings-dropdown-bg': '--settings-dropdown-bg',
      'file-line-width': '--file-line-width'
    };

    const sliderUnits = {
      'border-width': 'px',
      'canvas-arrow-width': 'px',
      'opacity-glass': '',
      'scrollbar-width': 'px',
      'checkbox-radius': 'px',
      'callout-border-width': 'px',
      'callout-radius': 'px',
      'blockquote-border-width': 'px',
      'hr-thickness': 'px',
      'table-border-width': 'px',
      'h1-size': 'em',
      'h1-line-height': '',
      'h1-margin-bottom': 'em',
      'h2-size': 'em',
      'h2-line-height': '',
      'h2-margin-bottom': 'em',
      'h3-size': 'em',
      'h3-line-height': '',
      'h3-margin-bottom': 'em',
      'h4-size': 'em',
      'h4-line-height': '',
      'h4-margin-bottom': 'em',
      'h5-size': 'em',
      'h5-line-height': '',
      'h5-margin-bottom': 'em',
      'h6-size': 'em',
      'h6-line-height': '',
      'h6-margin-bottom': 'em',
      'radius-s': 'px',
      'radius-m': 'px',
      'radius-l': 'px',
      'global-bg-blur': 'px',
      'list-spacing': 'em',
      'list-line-height': '',
      'p-spacing': 'em',
      'heading-spacing': 'em',
      'line-height-normal': '',
      'popover-width': 'px',
      'popover-height': 'px',
      'button-font-size': 'em',
      'modal-backdrop-blur': 'px',
      'file-line-width': 'px'
    };

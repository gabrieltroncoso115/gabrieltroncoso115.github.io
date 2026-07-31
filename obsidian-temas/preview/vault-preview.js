// Explorador de boveda y renderizado de vistas de Obsidian


    function findFilePathInVault(filename, items) {
      for (let item of items) {
        if (item.type === 'file' && item.name.toLowerCase() === filename.toLowerCase()) {
          return item.path;
        }
        if (item.type === 'folder' && item.children) {
          const found = findFilePathInVault(filename, item.children);
          if (found) return found;
        }
      }
      return filename;
    }

    function findFirstMdFile(items) {
      for (let item of items) {
        if (item.type === 'file' && item.name.endsWith('.md')) return item.path;
        if (item.type === 'folder' && item.children) {
          const found = findFirstMdFile(item.children);
          if (found) return found;
        }
      }
      return null;
    }

    function updateDatabaseView(files) {
      const tbody = document.querySelector('.bases-tbody');
      const cardsContainer = document.querySelector('.bases-cards-container');
      if (!tbody || !cardsContainer) return;
      
      function flattenFiles(items) {
        let list = [];
        items.forEach(item => {
          list.push(item);
          if (item.type === 'folder' && item.children) {
            list = list.concat(flattenFiles(item.children));
          }
        });
        return list;
      }
      
      const allItems = flattenFiles(files);
      
      let rowsHtml = '';
      allItems.forEach((item, idx) => {
        const isFolder = item.type === 'folder';
        const icon = isFolder ? '📁' : '📄';
        const rowClass = idx % 2 === 0 ? 'table-row-hover-bg' : 'table-row-alt-bg';
        
        const priority = isFolder ? 'Carpeta' : (item.name.length % 3 === 0 ? 'Alta' : (item.name.length % 3 === 1 ? 'Media' : 'Baja'));
        const pillColorClass = isFolder ? 'pill-info' : (priority === 'Alta' ? 'pill-danger' : (priority === 'Media' ? 'pill-warning' : 'pill-info'));
        const date = `2026-06-${String((idx % 28) + 1).padStart(2, '0')}`;
        const checked = item.name.length % 2 === 0 ? 'checked' : '';
        
        rowsHtml += `
          <tr class="bases-tr" data-inspect-target="${rowClass}" style="cursor: pointer;" onclick="openVaultFile('${item.path}')">
            <td class="bases-td" style="font-weight: 500;">
              <span style="margin-right: 6px; opacity: 0.8;">${icon}</span>
              <a href="#" class="db-link" style="color: var(--link-color, var(--interactive-accent)); text-decoration: none;" onclick="event.preventDefault();">${item.name}</a>
            </td>
            <td class="bases-td">
              <span class="db-status-pill ${pillColorClass}">${priority}</span>
            </td>
            <td class="bases-td" style="color: var(--text-muted);">${date}</td>
            <td class="bases-td">
              <div class="editor-checkbox ${checked}" data-inspect-target="checkbox-checked-color"></div>
            </td>
          </tr>
        `;
      });
      tbody.innerHTML = rowsHtml;
      
      let cardsHtml = '';
      allItems.forEach(item => {
        const isFolder = item.type === 'folder';
        const icon = isFolder ? '📁' : '📄';
        cardsHtml += `
          <div class="bases-cards-item" data-inspect-target="db-card-bg" style="padding: 10px; cursor: pointer;" onclick="openVaultFile('${item.path}')">
            <span>${icon} ${item.name}</span>
          </div>
        `;
      });
      cardsContainer.innerHTML = cardsHtml;
      
      const countEl = document.getElementById('db-results-count');
      if (countEl) {
        countEl.textContent = `${allItems.length} resultados`;
      }
    }

    function updateGraphView(files, activePath) {
      const svgs = document.querySelectorAll('.graph-view-pane svg');
      if (svgs.length === 0) return;
      
      function flattenFiles(items) {
        let list = [];
        items.forEach(item => {
          if (item.type === 'file') {
            list.push(item);
          }
          if (item.type === 'folder' && item.children) {
            list = list.concat(flattenFiles(item.children));
          }
        });
        return list;
      }
      
      const allFiles = flattenFiles(files);
      if (allFiles.length === 0) return;
      
      svgs.forEach(svg => {
        const width = svg.clientWidth || svg.getBoundingClientRect().width || 250;
        const height = svg.clientHeight || svg.getBoundingClientRect().height || 250;
        const cx = width / 2;
        const cy = height / 2;
        const R = Math.min(width, height) * 0.35;
        
        let activeIdx = allFiles.findIndex(f => f.path === activePath);
        if (activeIdx === -1) activeIdx = 0;
        
        const activeFile = allFiles[activeIdx];
        const otherFiles = allFiles.filter((f, idx) => idx !== activeIdx);
        
        let linesHtml = '';
        let nodesHtml = '';
        
        // Render focused node at the center (glowing accent color!)
        nodesHtml += `
          <g class="graph-node-group" style="cursor: pointer;" onclick="openVaultFile('${activeFile.path}')">
            <circle cx="${cx}" cy="${cy}" r="11" class="graph-node-focused" data-inspect-target="graph-node-focused" />
            <text x="${cx}" y="${cy + 25}" class="graph-text" data-inspect-target="graph-text" font-weight="600" text-anchor="middle">${activeFile.name.replace(/\.md$/, '')}</text>
          </g>
        `;
        
        // Calculate staggered, organic coordinates for other nodes
        const positions = [];
        otherFiles.forEach((file, idx) => {
          // Stagger the radius to form a beautiful organic layout
          const radiusMult = 0.55 + ((idx % 3) * 0.28) + (Math.sin(idx * 2.3) * 0.08);
          const R_organic = R * radiusMult;
          // Apply a deterministic angular stagger
          const angle = (2 * Math.PI * idx) / otherFiles.length + (Math.cos(idx * 1.7) * 0.12);
          
          const x = cx + R_organic * Math.cos(angle);
          const y = cy + R_organic * Math.sin(angle);
          positions.push({ x, y, file });
        });
        
        // Draw primary connections from center
        positions.forEach(pos => {
          linesHtml += `
            <line x1="${cx}" y1="${cy}" x2="${pos.x}" y2="${pos.y}" class="graph-line" data-inspect-target="graph-line" />
          `;
        });
        
        // Draw organic secondary cross-connections to make it look like a real network
        for (let i = 0; i < positions.length; i++) {
          // Add connections between every few nodes
          if (i % 2 === 0 && positions.length > 3) {
            const nextIdx = (i + 3) % positions.length;
            linesHtml += `
              <line x1="${positions[i].x}" y1="${positions[i].y}" x2="${positions[nextIdx].x}" y2="${positions[nextIdx].y}" class="graph-line" data-inspect-target="graph-line" style="opacity: 0.25; stroke-dasharray: 2 2;" />
            `;
          }
          if (i % 3 === 0 && positions.length > 5) {
            const nextIdx = (i + 5) % positions.length;
            linesHtml += `
              <line x1="${positions[i].x}" y1="${positions[i].y}" x2="${positions[nextIdx].x}" y2="${positions[nextIdx].y}" class="graph-line" data-inspect-target="graph-line" style="opacity: 0.2; stroke-dasharray: 2 2;" />
            `;
          }
        }
        
        // Draw other nodes and text
        positions.forEach(pos => {
          // Shift text labels slightly to the side to avoid overlapping
          const dx = pos.x < cx ? -10 : 10;
          const textAnchor = pos.x < cx ? 'end' : 'start';
          
          nodesHtml += `
            <g class="graph-node-group" style="cursor: pointer;" onclick="openVaultFile('${pos.file.path}')">
              <circle cx="${pos.x}" cy="${pos.y}" r="6" class="graph-node" data-inspect-target="graph-node" />
              <text x="${pos.x + dx}" y="${pos.y + 4}" class="graph-text" data-inspect-target="graph-text" text-anchor="${textAnchor}">${pos.file.name.replace(/\.md$/, '')}</text>
            </g>
          `;
        });
        
        svg.innerHTML = `
          <g>${linesHtml}</g>
          <g>${nodesHtml}</g>
        `;
      });
    }

    async function fetchPopoverContent(path) {
      const popover = document.getElementById('simulated-hover-popover');
      if (!popover) return;
      
      const bodyContent = popover.querySelector('.popover-content-body');
      if (bodyContent) {
        bodyContent.innerHTML = `<p style="color: var(--text-muted); font-style: italic;">Cargando vista previa...</p>`;
      }
      
      try {
        const response = await fetch(`/api/vault/file?path=${encodeURIComponent(path)}`);
        if (!response.ok) throw new Error();
        const text = await response.text();
        
        const parsedHtml = parseMarkdown(text);
        
        if (bodyContent) {
          bodyContent.innerHTML = `
            <div class="markdown-preview-sizer markdown-preview-section">
              ${parsedHtml}
            </div>
          `;
        }
        
        const expandBtn = popover.querySelector('.popover-expand-btn');
        if (expandBtn) {
          expandBtn.onclick = (e) => {
            e.stopPropagation();
            openVaultFile(path);
            popover.dataset.pinned = 'false';
            popover.style.display = 'none';
          };
        }
      } catch (err) {
        if (bodyContent) {
          bodyContent.innerHTML = `<p style="color: var(--text-muted); font-style: italic;">No se pudo cargar la vista previa.</p>`;
        }
      }
    }

    function parseInline(text) {
      let escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
        
      escaped = escaped.replace(/`([^`]+)`/g, '<code class="editor-inline-code" data-inspect-target="code-bg">$1</code>');

      escaped = escaped.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, imageName, width) => {
        const cleanImgName = imageName.trim();
        const resolvedPath = findFilePathInVault(cleanImgName, window.vaultFiles || []);
        const cleanWidth = width && /^\d{1,4}$/.test(width.trim()) ? width.trim() : '';
        const widthAttr = cleanWidth ? `width="${cleanWidth}"` : '';
        return `<span class="image-embed"><img src="/api/vault/file?path=${encodeURIComponent(resolvedPath)}" ${widthAttr} style="max-width: 100%; border-radius: var(--radius-m); margin: 8px 0;"></span>`;
      });

      escaped = escaped.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, target, alias) => {
        const cleanTarget = target.trim();
        let resolvedPath = cleanTarget;
        let found = false;
        const extensions = ['.md', '.base', '.canvas'];
        for (let ext of extensions) {
          const searchName = cleanTarget.endsWith(ext) ? cleanTarget : cleanTarget + ext;
          const path = findFilePathInVault(searchName, window.vaultFiles || []);
          if (path !== searchName) {
            resolvedPath = path;
            found = true;
            break;
          }
        }
        if (!found) {
          resolvedPath = findFilePathInVault(cleanTarget, window.vaultFiles || []);
        }
        const displayText = alias ? alias.trim() : cleanTarget;
        return `<a class="internal-link" data-path="${escapeHtml(resolvedPath)}" data-inspect-target="link-color" style="cursor: pointer; font-weight: 500;" onclick="openVaultFile(this.dataset.path)">[[${displayText}]]</a>`;
      });

      escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
        return `<a href="${safeExternalUrl(url)}" target="_blank" rel="noopener noreferrer" class="external-link" data-inspect-target="link-color">${label}</a>`;
      });

      escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong data-inspect-target="text-bold">$1</strong>');
      escaped = escaped.replace(/__([^_]+)__/g, '<strong data-inspect-target="text-bold">$1</strong>');

      escaped = escaped.replace(/\*([^*]+)\*/g, '<em data-inspect-target="text-italic">$1</em>');
      escaped = escaped.replace(/_([^_]+)_/g, '<em data-inspect-target="text-italic">$1</em>');

      escaped = escaped.replace(/==([^=]+)==/g, '<mark data-inspect-target="text-highlight-bg">$1</mark>');

      escaped = escaped.replace(/~~([^~]+)~~/g, '<s style="text-decoration: line-through; opacity: 0.6;">$1</s>');

      return escaped;
    }

    function renderListBlock(items) {
      let html = '';
      let stack = [];
      
      items.forEach(item => {
        const isOrdered = /^\d/.test(item.marker);
        const type = isOrdered ? 'ol' : 'ul';
        
        let last = stack[stack.length - 1];
        if (!last) {
          html += `<${type} style="margin-top: 15px;">`;
          stack.push({ indent: item.indent, type: type });
        } else if (item.indent > last.indent) {
          html += `<${type} data-inspect-target="list-indentation-guide-color">`;
          stack.push({ indent: item.indent, type: type });
        } else if (item.indent < last.indent) {
          while (stack.length > 0 && stack[stack.length - 1].indent > item.indent) {
            const closed = stack.pop();
            html += `</${closed.type}>`;
          }
          last = stack[stack.length - 1];
          if (!last || last.type !== type) {
            if (last) {
              html += `</${last.type}><${type}>`;
              last.type = type;
            } else {
              html += `<${type}>`;
              stack.push({ indent: item.indent, type: type });
            }
          }
        } else if (last.type !== type) {
          html += `</${last.type}><${type}>`;
          last.type = type;
        }
        
        let content = item.content;
        const taskMatch = content.match(/^\[([ xX\-\/])\]\s*(.*)$/);
        if (taskMatch) {
          const checkMarker = taskMatch[1].toLowerCase();
          const taskText = parseInline(taskMatch[2]);
          
          let checkboxHtml = '';
          let isChecked = checkMarker === 'x';
          let textStyle = '';
          
          if (checkMarker === 'x') {
            checkboxHtml = `<input type="checkbox" class="task-list-item-checkbox" checked disabled>`;
            textStyle = `style="text-decoration: line-through; opacity: 0.6;"`;
          } else if (checkMarker === '/') {
            checkboxHtml = `<input type="checkbox" class="task-list-item-checkbox" disabled>`;
            textStyle = `style="color: var(--text-accent); font-weight: 500;"`;
          } else if (checkMarker === '-') {
            checkboxHtml = `<input type="checkbox" class="task-list-item-checkbox" disabled>`;
            textStyle = `style="text-decoration: line-through; opacity: 0.4;"`;
          } else {
            checkboxHtml = `<input type="checkbox" class="task-list-item-checkbox" disabled>`;
          }
          
          html += `
            <li class="task-list-item${isChecked ? ' is-checked' : ''}">
              ${checkboxHtml}
              <span data-inspect-target="list-marker-color" ${textStyle}>${taskText}</span>
            </li>
          `;
        } else {
          html += `<li><span data-inspect-target="list-marker-color" style="cursor:pointer;">${parseInline(content)}</span></li>`;
        }
      });
      
      while (stack.length > 0) {
        const closed = stack.pop();
        html += `</${closed.type}>`;
      }
      
      return html;
    }

    function parseMarkdown(text) {
      let propertiesHtml = '';
      let markdownContent = text;
      const frontmatterMatch = text.match(/^\s*---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (frontmatterMatch) {
        markdownContent = text.slice(frontmatterMatch[0].length);
        const yaml = frontmatterMatch[1];
        const lines = yaml.split(/\r?\n/);
        let rowsHtml = '';
        lines.forEach(line => {
          const idx = line.indexOf(':');
          if (idx !== -1) {
            const key = line.slice(0, idx).trim();
            const value = line.slice(idx + 1).trim();
            if (value.startsWith('[') && value.endsWith(']')) {
              const tags = value.slice(1, -1).split(',').map(t => t.trim().replace(/^['"]|['"]$/g, ''));
              let tagSpans = tags.map(tag => `<span class="metadata-tag" data-inspect-target="tag-color">${tag.startsWith('#') ? tag : '#' + tag}</span>`).join(' ');
              rowsHtml += `
                <div class="metadata-row">
                  <span class="metadata-key" data-inspect-target="metadata-label-text-color">🏷️ ${key}</span>
                  <div class="metadata-value-tags">${tagSpans}</div>
                </div>
              `;
            } else {
              const valClean = value.replace(/^['"]|['"]$/g, '');
              rowsHtml += `
                <div class="metadata-row">
                  <span class="metadata-key" data-inspect-target="metadata-label-text-color">⚙️ ${key}</span>
                  <div class="metadata-value" data-inspect-target="metadata-value-text-color">${valClean}</div>
                </div>
              `;
            }
          }
        });
        propertiesHtml = `
          <div class="metadata-container">
            <div class="metadata-content">
              <div class="metadata-box" data-inspect-target="metadata-background" style="margin-bottom: 20px;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase;">Propiedades</div>
                ${rowsHtml}
              </div>
            </div>
          </div>
        `;
      }

      const lines = markdownContent.split(/\r?\n/);
      let html = '';
      
      let i = 0;
      while (i < lines.length) {
        let line = lines[i];
        
        if (line.trim() === '') {
          i++;
          continue;
        }
        
        if (line.trim().startsWith('```')) {
          const lang = line.trim().slice(3).trim() || 'txt';
          let codeLines = [];
          i++;
          while (i < lines.length && !lines[i].trim().startsWith('```')) {
            codeLines.push(lines[i]);
            i++;
          }
          i++;
          
          const cmLinesHtml = codeLines.map(cl => {
            const escaped = cl.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<div class="cm-line">${escaped}</div>`;
          }).join('');
          
          html += `
            <div style="position: relative; margin: 12px 0;">
              <div class="code-block-flair" data-tooltip="Copiar código">${lang}</div>
              <pre class="cm-content" style="padding: 12px; border-radius: var(--radius-m); overflow-x: auto; font-size: 0.8em; border: 1px solid var(--background-modifier-border); margin: 0; white-space: pre-wrap;">${cmLinesHtml}</pre>
            </div>
          `;
          continue;
        }
        
        const headingMatch = line.match(/^(\#{1,6})\s+(.*)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const content = parseInline(headingMatch[2]);
          html += `<h${level} class="editor-h${level}" contenteditable="true" data-inspect-target="h${level}-color">${content}</h${level}>`;
          i++;
          continue;
        }
        
        if (line.trim().startsWith('>')) {
          let quoteLines = [];
          while (i < lines.length && lines[i].trim().startsWith('>')) {
            quoteLines.push(lines[i]);
            i++;
          }
          
          const firstLine = quoteLines[0];
          const calloutMatch = firstLine.match(/^>\s*\[!([a-zA-Z0-9_-]+)\](?:\s*(.*))?$/);
          if (calloutMatch) {
            const type = calloutMatch[1].toLowerCase();
            let title = calloutMatch[2] || (type.charAt(0).toUpperCase() + type.slice(1));
            
            const contentLines = quoteLines.slice(1).map(l => {
              return l.trim().replace(/^>\s*/, '');
            });
            
            const calloutContentHtml = parseMarkdown(contentLines.join('\n'));
            
            let icon = '📌';
            let inspectTarget = 'callout-border-color';
            if (type === 'note') { icon = 'ℹ️'; inspectTarget = 'callout-color-note'; }
            else if (type === 'tip') { icon = '💡'; inspectTarget = 'callout-color-success'; }
            else if (type === 'warning') { icon = '⚠️'; inspectTarget = 'callout-color-warning'; }
            else if (type === 'danger') { icon = '❌'; inspectTarget = 'callout-color-danger'; }
            
            html += `
              <div class="callout" data-callout="${type}" data-inspect-target="${inspectTarget}" style="margin: 12px 0;">
                <div class="callout-title">
                  <span class="callout-icon">${icon}</span>
                  <span class="callout-title-inner" contenteditable="true">${title}</span>
                </div>
                <div class="callout-content" contenteditable="true">
                  ${calloutContentHtml}
                </div>
              </div>
            `;
          } else {
            const content = quoteLines.map(l => l.trim().replace(/^>\s*/, '')).join(' ');
            html += `
              <blockquote class="editor-blockquote" data-inspect-target="blockquote-bg" style="border-left: var(--blockquote-border-width, 4px) solid var(--blockquote-border-color, var(--interactive-accent)); background-color: var(--blockquote-bg); margin: 16px 0; padding: 10px 14px;">
                <p>${parseInline(content)}</p>
              </blockquote>
            `;
          }
          continue;
        }
        
        if (line.trim().startsWith('|')) {
          let tableLines = [];
          while (i < lines.length && lines[i].trim().startsWith('|')) {
            tableLines.push(lines[i]);
            i++;
          }
          
          if (tableLines.length >= 2) {
            const parseRow = (rowText) => {
              return rowText.trim().slice(1, -1).split('|').map(c => c.trim());
            };
            
            const headerCols = parseRow(tableLines[0]);
            let rowsHtml = '';
            for (let r = 2; r < tableLines.length; r++) {
              const cols = parseRow(tableLines[r]);
              const colsHtml = cols.map(col => `<td data-inspect-target="table-border-color">${parseInline(col)}</td>`).join('');
              rowsHtml += `<tr data-inspect-target="table-border-color">${colsHtml}</tr>`;
            }
            
            const headersHtml = headerCols.map(col => `<th data-inspect-target="table-header-bg">${parseInline(col)}</th>`).join('');
            
            html += `
              <table style="margin-top: 16px;">
                <thead>
                  <tr data-inspect-target="table-header-bg">${headersHtml}</tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            `;
          } else {
            html += `<div class="editor-p" contenteditable="true" data-inspect-target="text-normal">${parseInline(line)}</div>`;
            i++;
          }
          continue;
        }
        
        const listMatch = line.match(/^(\s*)([\*\-\+]|\d+\.)\s+(.*)$/);
        if (listMatch) {
          let listLines = [];
          while (i < lines.length) {
            const itemMatch = lines[i].match(/^(\s*)([\*\-\+]|\d+\.)\s+(.*)$/);
            if (itemMatch) {
              listLines.push({
                indent: itemMatch[1].length,
                marker: itemMatch[2],
                content: itemMatch[3]
              });
              i++;
            } else {
              break;
            }
          }
          html += renderListBlock(listLines);
          continue;
        }
        
        html += `<div class="editor-p" contenteditable="true" data-inspect-target="text-normal">${parseInline(line)}</div>`;
        i++;
      }

      return propertiesHtml + html;
    }

    async function openVaultFile(path) {
      console.log("Cargando nota: " + path);
      
      const lowerPath = path.toLowerCase();
      window.activeNotePath = path;
      
      if (lowerPath.endsWith('.base')) {
        loadMockNote('database');
        if (window.vaultFiles) {
          updateDatabaseView(window.vaultFiles);
          updateGraphView(window.vaultFiles, path);
        }
        return;
      }
      if (lowerPath.endsWith('.canvas')) {
        loadMockNote('canvas');
        if (window.vaultFiles) {
          updateGraphView(window.vaultFiles, path);
        }
        return;
      }
      if (lowerPath.endsWith('.png') || lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg')) {
        const viewDatabase = document.getElementById('view-database');
        if (viewDatabase) {
          viewDatabase.classList.remove('active');
          viewDatabase.style.display = 'none';
        }
        const viewCanvas = document.getElementById('view-canvas');
        if (viewCanvas) {
          viewCanvas.classList.remove('active');
          viewCanvas.style.display = 'none';
        }
        const viewOptions = document.getElementById('view-options');
        if (viewOptions) {
          viewOptions.classList.remove('active');
          viewOptions.style.display = 'none';
        }
        
        document.getElementById('view-editor').classList.add('active');
        
        const filename = path.split('/').pop();
        const nameParts = filename.split('.');
        const ext = nameParts.pop();
        const title = nameParts.join('.');
        
        document.getElementById('editor-title').textContent = title;
        
        const imgUrl = `/api/vault/file?path=${encodeURIComponent(path)}`;
        const editorBody = document.getElementById('editor-body-content');
        if (editorBody) {
          editorBody.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; min-height: 400px; padding: 20px; box-sizing: border-box; background-color: var(--background-primary);">
              <img src="${imgUrl}" alt="${title}" style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: var(--radius-m); box-shadow: 0 4px 20px rgba(0,0,0,0.25); border: 1px solid var(--background-modifier-border);">
            </div>
          `;
        }
        
        window.activeNoteId = path;
        document.querySelectorAll('[data-note]').forEach(el => el.classList.remove('active'));
        const activeItem = document.querySelector(`.explorer-item[data-path="${path}"]`);
        if (activeItem) activeItem.classList.add('active');
        
        const previewWinTitle = document.getElementById('preview-window-title');
        if (previewWinTitle) {
          previewWinTitle.textContent = `${title}.${ext} - Obsidian v1.6`;
        }
        
        updateWordCount();
        return;
      }
      
      try {
        const response = await fetch(`/api/vault/file?path=${encodeURIComponent(path)}`);
        if (!response.ok) throw new Error('Failed to fetch file');
        const text = await response.text();
        
        document.getElementById('view-database').classList.remove('active');
        document.getElementById('view-database').style.display = 'none';
        document.getElementById('view-canvas').classList.remove('active');
        document.getElementById('view-canvas').style.display = 'none';
        document.getElementById('view-options').classList.remove('active');
        document.getElementById('view-options').style.display = 'none';
        
        document.getElementById('view-editor').classList.add('active');
        
        const filename = path.split('/').pop();
        const nameParts = filename.split('.');
        if (nameParts.length > 1 && nameParts[nameParts.length - 1].toLowerCase() === 'md') {
          nameParts.pop();
        }
        const title = nameParts.join('.');
        
        document.getElementById('editor-title').textContent = title;
        
        const parsedHtml = parseMarkdown(text);
        
        const htmlWrapper = `
          <div class="markdown-reading-view">
            <div class="markdown-preview-view markdown-rendered">
              <div class="markdown-preview-sizer markdown-preview-section">
                ${parsedHtml}
              </div>
            </div>
          </div>
        `;
        
        document.getElementById('editor-body-content').innerHTML = htmlWrapper;
        
        const previewWinTitle = document.getElementById('preview-window-title');
        if (previewWinTitle) {
          previewWinTitle.textContent = `${title} - Obsidian v1.6`;
        }
        
        const explorerTree = document.querySelector('.explorer-tree');
        if (explorerTree) {
          explorerTree.querySelectorAll('.explorer-item').forEach(el => el.classList.remove('active'));
          const activeItem = explorerTree.querySelector(`.explorer-item[data-path="${path}"]`);
          if (activeItem) {
            activeItem.classList.add('active');
          }
        }
        
        updateWordCount();
        if (window.vaultFiles) {
          updateGraphView(window.vaultFiles, path);
        }
        
      } catch (err) {
        console.error('Error cargando el archivo:', err);
      }
    }
    window.openVaultFile = openVaultFile;

    async function initVaultExplorer() {
      const explorerTree = document.querySelector('.explorer-tree');
      if (!explorerTree) return;

      const staticTreeHtml = explorerTree.innerHTML;

      try {
        const response = await fetch('/api/vault/list');
        if (!response.ok) throw new Error('API response not ok');
        const files = await response.json();
        if (files && files.length > 0) {
          window.vaultFiles = files;
          explorerTree.innerHTML = buildVaultTreeHtml(files);
          bindVaultExplorerEvents(explorerTree);
          
          const welcomePath = findFilePathInVault("Bienvenid@ !.md", files);
          if (welcomePath && welcomePath !== "Bienvenid@ !.md") {
            openVaultFile(welcomePath);
          } else {
            const firstFile = findFirstMdFile(files);
            if (firstFile) openVaultFile(firstFile);
          }
        }
      } catch (err) {
        console.warn('Fallback al explorador estático por error:', err);
      }
    }

    function buildVaultTreeHtml(items) {
      let html = '';
      items.forEach(item => {
        if (item.type === 'folder') {
          html += `
            <div class="nav-folder" style="display: flex; flex-direction: column; gap: 2px;">
              <div class="nav-folder-title" style="display: flex; align-items: center; gap: 4px; padding: 4px; font-weight: 600; color: var(--text-normal); font-size: 0.75rem; cursor: pointer;">
                <svg class="nav-folder-collapse-indicator" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.1s ease; display: inline-block; transform: rotate(90deg); color: var(--text-muted);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                <span>${escapeHtml(item.name)}</span>
              </div>
              <div class="nav-folder-children" style="margin-left: 8px; padding-left: 8px; border-left: 1px solid var(--nav-indentation-guide-color); display: flex; flex-direction: column; gap: 2px;">
                ${buildVaultTreeHtml(item.children)}
              </div>
            </div>
          `;
        } else {
          const nameParts = item.name.split('.');
          const ext = nameParts.length > 1 ? nameParts.pop() : '';
          const baseName = nameParts.join('.');
          
          let tagHtml = '';
          if (ext && ext.toLowerCase() !== 'md') {
            tagHtml = `<span class="nav-file-tag" data-inspect-target="nav-item-tag-color" style="font-size: 0.6rem; padding: 1px 4px; border-radius: 3px; font-weight: bold; background-color: var(--background-modifier-border); color: var(--text-muted); margin-left: 4px;">${escapeHtml(ext.toUpperCase())}</span>`;
          }
          
          const displayName = baseName || item.name;
          
          html += `
            <div class="explorer-item" data-path="${escapeHtml(item.path)}" style="display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; border-radius: var(--radius-s); font-size: 0.75rem; color: var(--text-muted); cursor: pointer;">
              <span>${escapeHtml(displayName)}</span>
              ${tagHtml}
            </div>
          `;
        }
      });
      return html;
    }

    function bindVaultExplorerEvents(explorerTree) {
      const folderTitles = explorerTree.querySelectorAll('.nav-folder-title');
      folderTitles.forEach(title => {
        title.addEventListener('click', (e) => {
          e.stopPropagation();
          const childrenContainer = title.nextElementSibling;
          const indicator = title.querySelector('.nav-folder-collapse-indicator');
          if (childrenContainer) {
            if (childrenContainer.style.display === 'none') {
              childrenContainer.style.display = 'flex';
              if (indicator) {
                indicator.style.transform = 'rotate(90deg)';
              }
            } else {
              childrenContainer.style.display = 'none';
              if (indicator) {
                indicator.style.transform = 'rotate(0deg)';
              }
            }
          }
        });
      });

      const fileItems = explorerTree.querySelectorAll('.explorer-item');
      fileItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          explorerTree.querySelectorAll('.explorer-item').forEach(el => el.classList.remove('active'));
          item.classList.add('active');
          const path = item.getAttribute('data-path');
          openVaultFile(path);
        });
      });
    }

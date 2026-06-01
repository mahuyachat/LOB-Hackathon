// Shared shell chrome for the WEM-Lyra UI kit.
// Inserts the top bar (smile mark + product menu + right-side icons) and the
// nav rail (collapse toggle + nav items). Each page calls renderShell({...})
// in a small inline script before its own content.

(function(){
  function smileMarkSVG(){
    return `<img src="../../assets/nice-smile-black-blue-eyes.svg" alt="NiCE">`;
  }

  function chevSVG(){
    return `<svg class="chev" viewBox="0 0 16 16"><path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function topbarHTML(productName){
    return `
      <div class="brand">
        <div class="brand-mark">${smileMarkSVG()}</div>
        <div class="app-title" id="app-title">
          <span>${productName}</span>${chevSVG()}
        </div>
      </div>
      <div class="grow"></div>

      <div class="hdr-icon" title="Help">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2 2.2-2.5 3.2"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/></svg>
      </div>
      <div class="hdr-icon" title="App switcher">
        <svg viewBox="0 0 24 24"><rect x="3.5" y="6.5" width="17" height="11" rx="2"/><path d="M3.5 10h17M8 14h8"/></svg>
      </div>
      <div class="hdr-icon" title="Notifications">
        <svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0c0 5 2.5 7 2.5 7H3.5S6 14 6 9z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
        <span class="dot-badge">3</span>
      </div>
      <div class="hdr-avatar">
        <div class="ava">JS</div>
        <svg class="chev" viewBox="0 0 16 16"><path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    `;
  }

  // ICON LIBRARY: small kebab-cased name -> path d's
  // Stroke 1.6, viewBox 24, no fill.
  const NAV_ICONS = {
    "schedule": '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    "clock":    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "list":     '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    "forecast": '<path d="M3 17l4-4 4 4 6-7 4 4"/><path d="M14 10h4v4"/>',
    "calendar": '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    "spark":    '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
    "shield":   '<path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z"/>',
    "umbrella": '<path d="M2.5 12.5C2.5 6.7 6.8 2.5 12 2.5s9.5 4.2 9.5 10c0 0-3-1.5-4.75 0S12 11 12 12.5 10.25 14 8.5 12.5 5.5 12.5 2.5 12.5z"/><path d="M12 12.5V20a2.5 2.5 0 0 0 5 0"/>',
    "settings": '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    "users":    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "page":     '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    "folder":   '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  };

  function navIcon(name){
    return `<svg class="ico" viewBox="0 0 24 24">${NAV_ICONS[name] || NAV_ICONS["page"]}</svg>`;
  }

  function navHTML(items){
    let html = `<div class="nav-collapse" title="Collapse">
      <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
    </div>`;
    for (const it of items) {
      if (it.type === 'group') {
        const cls = it.expanded ? '' : 'collapsed';
        const childCls = it.expanded ? '' : 'hidden';
        html += `<div class="nav-item ${cls}" onclick="this.classList.toggle('collapsed');this.nextElementSibling.classList.toggle('hidden')">${navIcon(it.icon)}${it.label}${chevSVG()}</div>`;
        html += `<div class="nav-children ${childCls}">`;
        for (const c of (it.children || [])) {
          html += `<div class="nav-leaf ${c.active?'active':''}">${c.label}</div>`;
        }
        html += `</div>`;
      } else {
        const cls = it.active ? 'active' : '';
        html += `<div class="nav-item ${cls}">${navIcon(it.icon)}${it.label}</div>`;
      }
    }
    return html;
  }

  function renderShell({ product, nav }){
    document.getElementById('topbar').innerHTML = topbarHTML(product);
    document.getElementById('nav').innerHTML = navHTML(nav);
  }

  window.LyraShell = { renderShell };
})();

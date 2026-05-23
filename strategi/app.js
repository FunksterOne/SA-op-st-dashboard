// =====================================================================
// strategi-v2 — app shell (sidebar + topbar)
// =====================================================================
// Bruker SA_CONFIG.selskaper og window.getAktivtSelskapId fra config.js.
// =====================================================================

(function () {
  'use strict';

  function getActiveSelskap() {
    const id = window.getAktivtSelskapId();
    return window.getSelskap(id);
  }
  function setActiveSelskap(id) {
    localStorage.setItem('sa-strat-selskap', id);
    location.reload();
  }

  const NAV = [
    { mode: 'strat', label: 'Strategisk', items: [
      { id: 'oversikt',   nr: '01', label: 'Oversikt',           href: 'index.html' },
      { id: 'dokument',   nr: '02', label: 'Strategi-dokument',  href: 'dokument.html' },
      { id: 'scenarier',  nr: '03', label: 'Scenarier',          href: 'scenarier.html' },
      { id: 'tiltak',     nr: '04', label: 'Tiltak & status',    href: 'tiltak.html' },
      { id: 'styre',      nr: '05', label: 'Styremateriell',     href: 'styre.html' },
    ]},
    { mode: 'edit', label: 'Eier (DL)', items: [
      { id: 'rediger',    nr: '✎', label: 'Rediger strategi',    href: 'rediger.html' },
    ]},
    { mode: 'ref', label: 'Markedsdata', items: [
      { id: 'rot',        nr: '06', label: 'ROT-marked',         href: '#', disabled: true },
      { id: 'cmp',        nr: '07', label: 'Sammenlikning',      href: '#', disabled: true },
    ]},
  ];

  function buildSidebar(activeId) {
    const sel = getActiveSelskap();
    const navHtml = NAV.map(group => `
      <div class="group" data-mode="${group.mode}">
        <div class="gl">${group.label}</div>
        ${group.items.map(item => `
          <a class="link ${item.id === activeId ? 'active' : ''} ${item.disabled ? 'disabled' : ''}"
             href="${item.disabled ? '#' : item.href}"
             ${item.disabled ? 'onclick="event.preventDefault()" style="opacity:0.45;cursor:not-allowed"' : ''}>
            <span class="ic">${item.nr}</span>${item.label}
          </a>
        `).join('')}
      </div>
    `).join('');

    const scopeOptionsHtml = window.SA_CONFIG.selskaper.map(s => `
      <button class="item ${s.id === sel.id ? 'active' : ''}"
              ${!s.aktiv ? 'disabled' : ''}
              data-scope-id="${s.id}">
        <div class="nm">${s.label}</div>
        <div class="meta">${s.by} · ${s.ansatte} ans · ${s.omsetning_mnok.toFixed(1)} M</div>
      </button>
    `).join('');

    return `
      <aside class="side">
        <div class="brand">
          <div class="mark"><span class="glyph">SA</span> Bygg-portefølje</div>
          <div class="sub">ServiceAlliansen</div>
        </div>

        <div class="scope">
          <div class="label">Aktiv visning</div>
          <button class="switcher" id="scope-btn">
            <div>
              <div class="nm">${sel.label}</div>
              <div class="meta">${sel.by} · ${sel.ansatte} ans · ${sel.omsetning_mnok.toFixed(1)} M</div>
            </div>
            <div class="chev">▾</div>
          </button>
          <div class="scope-popover" id="scope-pop">
            <div class="group">Porteføljen</div>
            ${scopeOptionsHtml}
          </div>
        </div>

        <nav class="nav">${navHtml}</nav>

        <div class="foot">
          <div class="av">${sel.dl_init}</div>
          <div>
            <div class="who">${sel.dl}</div>
            <div class="role">DL · ${sel.kort}</div>
          </div>
        </div>
      </aside>
    `;
  }

  function buildTopbar(opts) {
    const o = opts || {};
    const src = o.src || '';
    return `
      <div class="topbar">
        <div class="tabs">
          <a class="tab" data-m="d" href="#"
             onclick="event.preventDefault();alert('Operativ-portalen ligger i hovedrepoet (../index.html)')">
            <span class="dot"></span>Daglig
          </a>
          <a class="tab active" data-m="s" href="index.html">
            <span class="dot"></span>Strategisk
          </a>
          <a class="tab" href="#" onclick="event.preventDefault()">
            <span class="dot"></span>Markedsdata
          </a>
        </div>
        <div class="right">
          <span class="ts" id="tb-time"></span>
          <span class="src">${src}</span>
        </div>
      </div>
    `;
  }

  function updateTime() {
    const t = new Date();
    const days = ['søn','man','tir','ons','tor','fre','lør'];
    const mns = ['jan','feb','mar','apr','mai','jun','jul','aug','sep','okt','nov','des'];
    const el = document.getElementById('tb-time');
    if (el) el.textContent = `${days[t.getDay()]} ${t.getDate()}. ${mns[t.getMonth()]} · ${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`;
  }

  function wireScopePicker() {
    const btn = document.getElementById('scope-btn');
    const pop = document.getElementById('scope-pop');
    if (!btn || !pop) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      pop.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !pop.contains(e.target)) pop.classList.remove('open');
    });
    pop.querySelectorAll('[data-scope-id]').forEach(el => {
      el.addEventListener('click', () => {
        if (el.disabled) return;
        setActiveSelskap(el.dataset.scopeId);
      });
    });
  }

  // Public mount API
  window.SA = {
    mount(opts) {
      opts = opts || {};
      const slot = document.getElementById('app-mount');
      if (!slot) return;

      let content = opts.content;
      if (!content) {
        content = slot.dataset.content;
      }
      if (!content) {
        const tmpl = document.getElementById('page');
        if (tmpl) {
          content = tmpl.innerHTML;
          tmpl.remove();
        } else {
          content = '';
        }
      }

      const sidebarHtml = buildSidebar(opts.active || 'oversikt');
      const topbarHtml = buildTopbar(opts);
      slot.innerHTML = `
        <div class="app">
          ${sidebarHtml}
          <main class="main">
            ${topbarHtml}
            ${content}
          </main>
        </div>
      `;
      updateTime();
      setInterval(updateTime, 30000);
      wireScopePicker();
    },
    getActiveSelskap,
  };
})();

// =====================================================================
// SIDEBAR.JS — Global navigasjon (sidebar + topbar) for hele portalen
// =====================================================================
// Inkluderes etter selskaper.js. Bygger:
//   1. Venstre sidebar med scope-velger og navigasjonsliste
//   2. Sticky topbar med mode-tabs (Daglig / Strategisk / Referanse) +
//      scope-info + tid + live-status
// Mode-tabs ruter til standard side i hver mode.
// =====================================================================

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // Mode-konfigurasjon — hver navigasjons-modul tilhører én av tre moder
  // ------------------------------------------------------------------
  const MODE_DAGLIG = 'daglig';
  const MODE_STRATEGISK = 'strategisk';
  const MODE_IMPL = 'implementering';
  const MODE_REFERANSE = 'referanse';

  const MODE_LABEL = {
    [MODE_DAGLIG]: 'Daglig',
    [MODE_STRATEGISK]: 'Strategisk',
    [MODE_IMPL]: 'Implementering',
    [MODE_REFERANSE]: 'Markedsdata',
  };

  // Standard landingsside for hver mode (tab-klikk i topbar)
  const MODE_DEFAULT = {
    [MODE_DAGLIG]: 'dashboard',
    [MODE_STRATEGISK]: 'strategi',
    [MODE_IMPL]: 'implementering',
    [MODE_REFERANSE]: 'bransjekart',
  };

  // Navigasjonstre — én entry per modul som kan navigeres til.
  // Hovedsporet i Daglig: Dashboard → Anbud → Prosjekter (drill-down per prosjekt).
  const NAV = [
    { section: 'Daglig', mode: MODE_DAGLIG, part: 'operativ', items: [
      { id: 'dashboard',      icon: '◉', label: 'Dashboard',       page: 'Dashboard' },
      { id: 'anbud',          icon: '►', label: 'Anbudspipeline',  page: 'Anbudspipeline' },
      { id: 'overlevering',   icon: '⇄', label: 'Overlevering',    page: 'Overlevering — anbud → prosjekt' },
      { id: 'prosjekter',     icon: '▣', label: 'Prosjekter',      page: 'Prosjekter' },
      { id: 'okonomi',        icon: '$', label: 'Økonomi (live)',  page: 'Økonomi (live)' },
      { id: 'bruksanvisning', icon: '?', label: 'Bruksanvisning',  page: 'Bruksanvisning' },
    ]},
    { section: 'Strategisk', mode: MODE_STRATEGISK, part: 'strategi', items: [
      { id: 'strategi-doc',    icon: '⚑', label: 'Strategi-dokument', page: 'Strategi-dokument' },
      { id: 'strategi-status', icon: '◷', label: 'Strategi-status',   page: 'Strategi-status' },
      { id: 'strategi',        icon: '↗', label: 'Vekst-scenarier',   page: 'Vekst-scenarier' },
      { id: 'styrerapport',    icon: '◧', label: 'Styrerapport',      page: 'Styrerapport (kvartal)' },
      { id: 'ma-screening',    icon: '+', label: 'M&A-screening',     page: 'M&A-screening' },
      { id: 'ma-konsern',      icon: '⊞', label: 'M&A konsern',       page: 'M&A konsern' },
    ]},
    { section: 'Implementering', mode: MODE_IMPL, part: 'operativ', items: [
      { id: 'implementering',  icon: '⚙', label: 'Teknisk plan',     page: 'Teknisk implementering' },
      { id: 'm5-poweroffice',  icon: '∷', label: 'M5/M6 PowerOffice', page: 'M5/M6 PowerOffice-integrasjon' },
      { id: 'forsikring',      icon: '◆', label: 'M9 Forsikring',     page: 'M9 SA Forsikringsstrøm' },
      { id: 'epc-satsing',     icon: '⊕', label: 'EPC-satsing',       page: 'EPC-satsing — konsekvens' },
    ]},
    { section: 'Markedsdata', mode: MODE_REFERANSE, part: 'strategi', items: [
      { id: 'bransjekart',     icon: '·', label: 'ROT-marked',      page: 'ROT-marked' },
      { id: 'oversikt',        icon: '·', label: 'Konsernoversikt', page: 'Konsernoversikt' },
      { id: 'sa-rapport',      icon: '·', label: 'SA-rapport',      page: 'SA-konsernrapport' },
    ]},
  ];

  // Hvilken del en modul tilhører — styrer hvilken sidebar som vises
  function getPartFor(moduleId) {
    const eff = MODULE_PARENT[moduleId] || moduleId;
    for (const sec of NAV) {
      if (sec.items.find(i => i.id === eff)) return sec.part;
    }
    return 'operativ';
  }

  // Modul kan ha "kontekstuell" mode (samme sb-link), brukes når man drar til
  // detalj-sider som ikke er primær-modul (f.eks. prosjekt → tilhører prosjekter).
  const MODULE_PARENT = {
    'prosjekt':       'prosjekter',
    'anbud-detalj':   'anbud',
    'scenario':       'strategi',
    'ma-kandidat':    'ma-screening',
  };

  function getModeFor(moduleId) {
    const eff = MODULE_PARENT[moduleId] || moduleId;
    for (const sec of NAV) {
      if (sec.items.find(i => i.id === eff)) return sec.mode;
    }
    return MODE_DAGLIG;
  }
  function getPageLabel(moduleId) {
    const eff = MODULE_PARENT[moduleId] || moduleId;
    for (const sec of NAV) {
      const item = sec.items.find(i => i.id === eff);
      if (item) return item.page || item.label;
    }
    return moduleId;
  }
  // Returnerer hvilket sidebar-element som skal markeres som aktivt
  // (foreldre-modul hvis vi er på en detalj-side)
  function getActiveSidebarId(moduleId) {
    return MODULE_PARENT[moduleId] || moduleId;
  }

  // ------------------------------------------------------------------
  // CSS — sidebar + supplerende topbar-stil (topbar er hovedsakelig i style.css)
  // ------------------------------------------------------------------
  const SIDEBAR_CSS = `
body.has-sidebar { padding-left: 248px; min-height: 100vh }
.sa-sidebar {
  position: fixed; top: 0; left: 0; width: 248px; height: 100vh;
  background: var(--panel, #161b22); border-right: 1px solid var(--line, #2a313c);
  display: flex; flex-direction: column; z-index: 50;
  font: 13.5px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  color: var(--text, #e6edf3);
}
.sa-sidebar .sb-brand {
  padding: 18px 20px 14px; border-bottom: 1px solid var(--line, #2a313c);
}
.sa-sidebar .sb-brand .sb-product {
  font-size: 10px; color: var(--accent, #4f9da6); text-transform: uppercase;
  letter-spacing: 0.16em; font-weight: 700;
}
.sa-sidebar .sb-brand .sb-name {
  font-size: 15px; font-weight: 600; margin-top: 4px; letter-spacing: -0.005em;
}
.sa-sidebar .sb-scope {
  padding: 14px 16px 12px; border-bottom: 1px solid var(--line, #2a313c);
  position: relative;
}
.sa-sidebar .sb-scope .sb-scope-label {
  font-size: 9.5px; color: var(--muted, #8b95a3); text-transform: uppercase;
  letter-spacing: 0.12em; font-weight: 600; margin-bottom: 6px;
}
.sa-sidebar .sb-scope-btn {
  width: 100%; background: var(--panel-2, #1f2630); border: 1px solid var(--line, #2a313c);
  color: var(--text, #e6edf3); padding: 9px 11px; font: inherit; font-size: 12.5px;
  text-align: left; cursor: pointer; border-radius: 6px; transition: 0.15s;
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
}
.sa-sidebar .sb-scope-btn:hover { border-color: var(--accent, #4f9da6) }
.sa-sidebar .sb-scope-btn .sb-scope-info { flex: 1; min-width: 0 }
.sa-sidebar .sb-scope-btn .sb-scope-name {
  font-weight: 600; font-size: 13px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sa-sidebar .sb-scope-btn .sb-scope-sub { font-size: 10.5px; color: var(--muted, #8b95a3); margin-top: 1px }
.sa-sidebar .sb-scope-btn .sb-chevron { color: var(--muted, #8b95a3); flex-shrink: 0 }
.sa-sidebar .sb-scope-popover {
  position: absolute; top: 100%; left: 0; right: 0; margin: 4px 16px 0;
  background: var(--panel-2, #1f2630); border: 1px solid var(--line, #2a313c);
  border-radius: 6px; padding: 6px; box-shadow: var(--shadow-pop, 0 8px 22px rgba(0,0,0,.35));
  display: none; z-index: 100;
}
.sa-sidebar .sb-scope-popover.open { display: block }
.sa-sidebar .sb-scope-popover .sb-pop-section {
  font-size: 9.5px; color: var(--muted, #8b95a3); text-transform: uppercase;
  letter-spacing: 0.1em; font-weight: 600; padding: 8px 10px 4px;
}
.sa-sidebar .sb-scope-popover .sb-pop-item {
  display: block; width: 100%; padding: 7px 10px; background: transparent;
  border: 0; color: var(--text, #e6edf3); font: inherit; font-size: 12.5px;
  text-align: left; cursor: pointer; border-radius: 4px; transition: 0.1s;
}
.sa-sidebar .sb-scope-popover .sb-pop-item:hover { background: var(--panel-3, #262d38) }
.sa-sidebar .sb-scope-popover .sb-pop-item.active {
  background: var(--panel-3, #262d38);
  box-shadow: inset 0 0 0 1px var(--accent, #4f9da6);
}
.sa-sidebar .sb-scope-popover .sb-pop-item .sb-pop-sub {
  font-size: 10.5px; color: var(--muted, #8b95a3); display: block; margin-top: 1px;
}
.sa-sidebar .sb-nav { flex: 1; overflow-y: auto; padding: 6px 0 14px }
.sa-sidebar .sb-section { padding: 12px 0 4px }
.sa-sidebar .sb-section .sb-section-label {
  font-size: 9.5px; text-transform: uppercase;
  letter-spacing: 0.14em; font-weight: 700; padding: 0 20px 6px;
  display: flex; align-items: center; gap: 7px;
}
.sa-sidebar .sb-section .sb-section-label::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}
.sa-sidebar .sb-section[data-mode="daglig"] .sb-section-label { color: var(--mode-daglig, #66c2cc) }
.sa-sidebar .sb-section[data-mode="daglig"] .sb-section-label::before { background: var(--mode-daglig, #66c2cc) }
.sa-sidebar .sb-section[data-mode="strategisk"] .sb-section-label { color: var(--mode-strategisk, #d29922) }
.sa-sidebar .sb-section[data-mode="strategisk"] .sb-section-label::before { background: var(--mode-strategisk, #d29922) }
.sa-sidebar .sb-section[data-mode="implementering"] .sb-section-label { color: var(--mode-implementering, #58a6ff) }
.sa-sidebar .sb-section[data-mode="implementering"] .sb-section-label::before { background: var(--mode-implementering, #58a6ff) }
.sa-sidebar .sb-section[data-mode="referanse"] .sb-section-label { color: var(--muted, #8b95a3) }
.sa-sidebar .sb-section[data-mode="referanse"] .sb-section-label::before { background: var(--muted, #8b95a3) }
.sa-sidebar .sb-link {
  display: flex; align-items: center; gap: 10px;
  padding: 7px 20px; color: var(--text, #e6edf3); text-decoration: none;
  font-size: 13px; transition: 0.1s; border-left: 2px solid transparent;
}
.sa-sidebar .sb-link:hover { background: var(--panel-2, #1f2630); text-decoration: none }
.sa-sidebar .sb-section[data-mode="daglig"] .sb-link.active {
  background: var(--mode-daglig-soft, rgba(102,194,204,0.14));
  border-left-color: var(--mode-daglig, #66c2cc);
  color: var(--mode-daglig, #66c2cc); font-weight: 600;
}
.sa-sidebar .sb-section[data-mode="strategisk"] .sb-link.active {
  background: var(--mode-strategisk-soft, rgba(210,153,34,0.14));
  border-left-color: var(--mode-strategisk, #d29922);
  color: var(--mode-strategisk, #d29922); font-weight: 600;
}
.sa-sidebar .sb-section[data-mode="implementering"] .sb-link.active {
  background: var(--mode-implementering-soft, rgba(88,166,255,0.14));
  border-left-color: var(--mode-implementering, #58a6ff);
  color: var(--mode-implementering, #58a6ff); font-weight: 600;
}
.sa-sidebar .sb-section[data-mode="referanse"] .sb-link.active {
  background: var(--panel-2, #1f2630);
  border-left-color: var(--muted, #8b95a3);
  color: var(--text, #e6edf3); font-weight: 600;
}
.sa-sidebar .sb-link .sb-icon {
  width: 16px; flex-shrink: 0; font-size: 11px; color: var(--muted, #8b95a3);
}
.sa-sidebar .sb-link.active .sb-icon { color: inherit }
.sa-sidebar .sb-section[data-mode="referanse"] .sb-link {
  color: var(--muted, #8b95a3); font-size: 12.5px;
}
.sa-sidebar .sb-section[data-mode="referanse"] .sb-link:hover { color: var(--text, #e6edf3) }

.sa-sidebar .sb-bridge {
  margin-top: 14px; padding-top: 10px;
  border-top: 1px dashed var(--line, #2a313c);
}
.sa-sidebar .sb-bridge-link {
  color: var(--muted, #8b95a3); font-size: 12px; font-style: italic;
}
.sa-sidebar .sb-bridge-link:hover { color: var(--accent, #4f9da6) }
.sa-sidebar .sb-foot {
  padding: 11px 16px 14px; border-top: 1px solid var(--line, #2a313c);
  display: flex; gap: 8px; align-items: center;
}
.sa-sidebar .sb-foot .theme-toggle {
  background: var(--panel-2, #1f2630); border: 1px solid var(--line, #2a313c); color: var(--muted, #8b95a3);
  width: 32px; height: 32px; border-radius: 6px; cursor: pointer;
  font: inherit; font-size: 14px; display: inline-flex; align-items: center; justify-content: center;
  transition: 0.15s;
}
.sa-sidebar .sb-foot .theme-toggle:hover { color: var(--text, #e6edf3); border-color: var(--accent, #4f9da6) }
.sa-sidebar .sb-foot .t-icon-light { display: none }
:root[data-theme="light"] .sa-sidebar .sb-foot .t-icon-dark { display: none }
:root[data-theme="light"] .sa-sidebar .sb-foot .t-icon-light { display: inline }
.sa-sidebar .sb-foot .sb-foot-info { flex: 1; font-size: 10px; color: var(--muted, #8b95a3); line-height: 1.3 }
.sa-sidebar .sb-toggle-mobile { display: none }

@media print {
  body.has-sidebar { padding-left: 0 }
  .sa-sidebar { display: none }
}
@media (max-width: 900px) {
  body.has-sidebar { padding-left: 0 }
  .sa-sidebar { transform: translateX(-100%); transition: transform 0.2s }
  .sa-sidebar.open { transform: translateX(0) }
  .sa-sidebar .sb-toggle-mobile {
    display: inline-flex; position: fixed; top: 8px; left: 8px; z-index: 60;
    background: var(--panel, #161b22); border: 1px solid var(--line, #2a313c);
    width: 38px; height: 38px; border-radius: 6px; align-items: center; justify-content: center;
    color: var(--text, #e6edf3); cursor: pointer; font-size: 16px;
  }
}
`;

  function injectCss() {
    if (document.getElementById('sa-sidebar-css')) return;
    const style = document.createElement('style');
    style.id = 'sa-sidebar-css';
    style.textContent = SIDEBAR_CSS;
    document.head.appendChild(style);
  }

  // ------------------------------------------------------------------
  // Sidebar HTML-bygging
  // ------------------------------------------------------------------
  function buildScopePopover() {
    const active = getActiveScope();
    const isActive = (type, id) => active.type === type && active.id === id;

    let html = '';
    html += '<div class="sb-pop-section">Selskap</div>';
    SELSKAPER.forEach(s => {
      html += `
        <button class="sb-pop-item ${isActive('selskap', s.id) ? 'active' : ''}" data-scope='{"type":"selskap","id":"${s.id}"}'>
          <span style="color:${s.farge};font-weight:600">${s.label}</span>
          <span class="sb-pop-sub">${s.lokasjon.by} · ${s.regnskap_2024.ansatte} ans · ${s.regnskap_2024.omsetning_mnok.toFixed(0)} M</span>
        </button>`;
    });
    html += '<div class="sb-pop-section">By (sum)</div>';
    BYER.forEach(b => {
      const oms = b.selskaper.reduce((acc, sid) => {
        const s = getSelskap(sid); return acc + (s?.regnskap_2024.omsetning_mnok || 0);
      }, 0);
      const ans = b.selskaper.reduce((acc, sid) => {
        const s = getSelskap(sid); return acc + (s?.regnskap_2024.ansatte || 0);
      }, 0);
      html += `
        <button class="sb-pop-item ${isActive('by', b.id) ? 'active' : ''}" data-scope='{"type":"by","id":"${b.id}"}'>
          <span style="color:${b.farge};font-weight:600">${b.label}</span>
          <span class="sb-pop-sub">${b.sub} · ${ans} ans · ${oms.toFixed(0)} M</span>
        </button>`;
    });
    html += '<div class="sb-pop-section">Konsern</div>';
    const totOms = SELSKAPER.reduce((s, x) => s + x.regnskap_2024.omsetning_mnok, 0);
    const totAns = SELSKAPER.reduce((s, x) => s + x.regnskap_2024.ansatte, 0);
    html += `
      <button class="sb-pop-item ${isActive('konsern', 'konsern') ? 'active' : ''}" data-scope='{"type":"konsern","id":"konsern"}'>
        <span style="font-weight:600">SA Bygg (alle tre)</span>
        <span class="sb-pop-sub">${SELSKAPER.length} selskap · ${totAns} ans · ${totOms.toFixed(0)} M</span>
      </button>`;
    return html;
  }

  function buildNav(activeId, part) {
    const sidebarActive = getActiveSidebarId(activeId);
    let html = '';
    NAV.filter(sec => sec.part === part).forEach(sec => {
      html += `<div class="sb-section" data-mode="${sec.mode}">
        <div class="sb-section-label">${sec.section}</div>`;
      sec.items.forEach(item => {
        const href = getRouteFor(item.id);
        const cls = item.id === sidebarActive ? 'sb-link active' : 'sb-link';
        html += `<a class="${cls}" href="${href}"><span class="sb-icon">${item.icon}</span>${item.label}</a>`;
      });
      html += '</div>';
    });
    // Bro-lenke til den andre delen
    if (part === 'operativ') {
      html += `<div class="sb-section sb-bridge"><a class="sb-link sb-bridge-link" href="${getRouteFor('strategi')}">
        <span class="sb-icon">↗</span>Strategi →</a></div>`;
    } else {
      html += `<div class="sb-section sb-bridge"><a class="sb-link sb-bridge-link" href="${getRouteFor('dashboard')}">
        <span class="sb-icon">←</span>Operativ</a></div>`;
    }
    return html;
  }

  function buildSidebarHTML(activeId, part) {
    const scopeLabel = getScopeLabel();
    return `
      <button class="sb-toggle-mobile" aria-label="Vis meny">☰</button>
      <div class="sb-brand">
        <div class="sb-product">ServiceAlliansen</div>
        <div class="sb-name">Bygg-portefølje</div>
      </div>
      <div class="sb-scope">
        <div class="sb-scope-label">Aktiv visning</div>
        <button class="sb-scope-btn" data-scope-toggle>
          <span class="sb-scope-info">
            <span class="sb-scope-name" style="color:${scopeLabel.farge}">${scopeLabel.label}</span>
            <span class="sb-scope-sub">${scopeLabel.sub}</span>
          </span>
          <span class="sb-chevron">▾</span>
        </button>
        <div class="sb-scope-popover" data-scope-popover>
          ${buildScopePopover()}
        </div>
      </div>
      <nav class="sb-nav">
        ${buildNav(activeId, part)}
      </nav>
      <div class="sb-foot">
        <button class="theme-toggle" data-theme-toggle onclick="toggleTheme()" title="Bytt tema" aria-label="Bytt tema">
          <span class="t-icon-dark">☾</span>
          <span class="t-icon-light">☀</span>
        </button>
        <div class="sb-foot-info">DL Brynjar Storvik (Bodø)<br>DL Øyvind Berggren (Trondheim)</div>
      </div>
    `;
  }

  // ------------------------------------------------------------------
  // Topbar HTML
  // ------------------------------------------------------------------
  function buildTopbarHTML(activeId, part) {
    const currentMode = getModeFor(activeId);
    const pageLabel = getPageLabel(activeId);
    const scope = getActiveScope();
    const scopeLabel = getScopeLabel(scope);

    // Topbar-tabs: bare moder som tilhører aktiv del
    const tabModes = part === 'strategi'
      ? [MODE_STRATEGISK, MODE_REFERANSE]
      : [MODE_DAGLIG, MODE_IMPL];
    const tabs = tabModes.map(m => {
      const isActive = m === currentMode;
      const defaultModule = MODE_DEFAULT[m];
      const href = getRouteFor(defaultModule);
      return `
        <a class="tb-tab ${isActive ? 'active' : ''}" data-mode="${m}" href="${href}">
          <span class="tb-tab-dot"></span>${MODE_LABEL[m]}
        </a>
      `;
    }).join('');

    return `
      <div class="tb-left">
        <div class="tb-tabs">${tabs}</div>
        <div class="tb-divider"></div>
        <div class="tb-page">${pageLabel}</div>
      </div>
      <div class="tb-right">
        <span class="tb-scope-info" title="Aktiv visning">
          <span class="tb-scope-dot" style="background:${scopeLabel.farge}"></span>
          ${scopeLabel.label}
        </span>
        <span class="tb-time" id="sa-tb-time"></span>
        <span class="tb-live">Live</span>
        <button class="tb-theme-toggle" data-theme-toggle onclick="toggleTheme()" title="Bytt tema" aria-label="Bytt tema">
          <span class="t-icon-dark">☾</span>
          <span class="t-icon-light">☀</span>
        </button>
      </div>
    `;
  }

  function buildTopbar(activeId, part) {
    // Skap topbar-element
    let bar = document.querySelector('.sa-topbar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'sa-topbar';
      // Putt rett etter sidebar-div eller helt øverst i body
      const sidebar = document.querySelector('.sa-sidebar');
      if (sidebar && sidebar.nextSibling) {
        sidebar.parentNode.insertBefore(bar, sidebar.nextSibling);
      } else {
        document.body.insertBefore(bar, document.body.firstChild);
      }
    }
    bar.innerHTML = buildTopbarHTML(activeId, part);
    bar.dataset.mode = getModeFor(activeId);

    // Live-tid
    function updateTime() {
      const t = new Date();
      const days = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'];
      const mns = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
      const el = document.getElementById('sa-tb-time');
      if (el) el.textContent = `${days[t.getDay()]} ${t.getDate()}. ${mns[t.getMonth()]} · ${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`;
    }
    updateTime();
    if (window._saTopbarTimer) clearInterval(window._saTopbarTimer);
    window._saTopbarTimer = setInterval(updateTime, 30000);
  }

  // ------------------------------------------------------------------
  // Wiring
  // ------------------------------------------------------------------
  function wireSidebar(root) {
    const btn = root.querySelector('[data-scope-toggle]');
    const pop = root.querySelector('[data-scope-popover]');
    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      pop.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) pop?.classList.remove('open');
    });
    root.querySelectorAll('[data-scope]').forEach(el => {
      el.addEventListener('click', () => {
        try {
          const scope = JSON.parse(el.dataset.scope);
          setActiveScope(scope);
          location.reload();
        } catch (e) { console.error(e); }
      });
    });
    const mob = root.querySelector('.sb-toggle-mobile');
    mob?.addEventListener('click', () => root.classList.toggle('open'));
  }

  function build() {
    const slots = document.querySelectorAll('[data-sidebar]');
    if (slots.length === 0) return;
    let activeId = 'dashboard';
    let part = 'operativ';
    slots.forEach(slot => {
      activeId = slot.dataset.active || activeId;
      // data-section overstyrer auto-deteksjon; ellers ut fra modul
      part = slot.dataset.section || getPartFor(activeId);
      slot.classList.add('sa-sidebar');
      slot.dataset.part = part;
      slot.innerHTML = buildSidebarHTML(activeId, part);
      wireSidebar(slot);
    });
    document.body.classList.add('has-sidebar');
    document.body.dataset.mode = getModeFor(activeId);
    document.body.dataset.part = part;
    buildTopbar(activeId, part);
  }

  injectCss();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

  // Eksponér
  window.buildSidebar = build;
  window._saMode = getModeFor;
})();

// Strategi-portal — egen minimal sidebar (adskilt fra operativ)
(function () {
  'use strict';

  const PAGES = [
    { id: 'oversikt', label: 'Oversikt', href: 'index.html', icon: '★' },
    { id: 'rediger', label: 'Rediger', href: 'rediger.html', icon: '✎' },
    { id: 'styre', label: 'Styremateriell', href: 'styre.html', icon: '◧' },
  ];

  function operativUrl() {
    const base = (typeof window !== 'undefined' && window.SA_BASE) ? window.SA_BASE : '../';
    return base + 'index.html';
  }

  function buildSidebar(active, selskap) {
    const links = PAGES.map(p => {
      const cls = p.id === active ? 'st-link active' : 'st-link';
      return `<a class="${cls}" href="${p.href}"><span>${p.icon}</span> ${p.label}</a>`;
    }).join('');

    return `
      <aside class="st-sidebar" data-strategi-sidebar>
        <div class="st-brand">
          <div class="st-product">ServiceAlliansen</div>
          <div class="st-name">Strategi</div>
        </div>
        <div class="st-selskap">
          <div class="st-sl">Selskap</div>
          <div class="st-sn" style="color:${selskap.farge}">${selskap.label}</div>
          <div class="st-sub">${selskap.by} · DL ${selskap.dl}</div>
        </div>
        <nav>${links}</nav>
        <div class="st-bridge">
          <a class="st-link" href="${operativUrl()}"><span>←</span> Operativ portal</a>
        </div>
        <div class="st-foot">
          <button type="button" class="theme-toggle" data-theme-toggle onclick="toggleTheme()" title="Bytt tema">
            <span class="t-icon-dark">☾</span>
            <span class="t-icon-light">☀</span>
          </button>
        </div>
      </aside>
    `;
  }

  function mount() {
    const el = document.querySelector('[data-strategi-sidebar-mount]');
    if (!el) return;
    const active = el.getAttribute('data-active') || 'oversikt';
    const sid = getAktivtSelskapId();
    const selskap = getSelskapMeta(sid);
    if (!selskap) return;
    document.body.classList.add('has-strategi-sidebar');
    el.innerHTML = buildSidebar(active, selskap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

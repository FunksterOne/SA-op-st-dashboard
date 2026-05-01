// =====================================================================
// THEME.JS — Felles dark/light tema-toggle for alle dashboards
// Inkluderes med <script src="theme.js"></script> i <head>
// =====================================================================
(function() {
  const KEY = 'tom-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(KEY) || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    // oppdater alle toggle-ikoner
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Bytt til lyst tema' : 'Bytt til mørkt tema');
      btn.title = theme === 'dark' ? 'Bytt til lyst tema' : 'Bytt til mørkt tema';
    });
  }

  // Sett tema umiddelbart for å unngå "flash of unstyled content"
  applyTheme(getStoredTheme());

  // Eksponér global toggle-funksjon
  window.toggleTheme = function() {
    const next = getStoredTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  };

  window.getTheme = getStoredTheme;
  window.applyTheme = applyTheme;

  // Bygg toggle-knapp ved init hvis det er en placeholder
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-toggle-slot]').forEach(slot => {
      slot.innerHTML = `
        <button class="theme-toggle" data-theme-toggle onclick="toggleTheme()"
          title="Bytt tema" aria-label="Bytt tema">
          <span class="t-icon-dark">☾</span>
          <span class="t-icon-light">☀</span>
        </button>`;
    });
    applyTheme(getStoredTheme());
  });
})();

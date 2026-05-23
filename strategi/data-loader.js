// =====================================================================
// strategi-v2 — data-loader
// =====================================================================
// Henter strategien fra strategi/data/{id}.json (delt med v1).
// Lokal autosave-buffer i localStorage. Push til Vercel API ved Lagre.
// =====================================================================

(function () {
  'use strict';

  const DRAFT_KEY_PREFIX = 'sa-strat-v2-draft-';

  function getPushUrl() {
    try {
      const override = localStorage.getItem('STRATEGI_PUSH_URL');
      if (override) return override;
    } catch (e) { /* ignore */ }
    // Vercel-deploy: relativ /api fungerer
    // GH Pages: må overstyres til Vercel-URL
    if (location.origin.includes('github.io')) {
      return window.SA_CONFIG.vercelFallbackUrl;
    }
    return window.SA_CONFIG.defaultPushUrl;
  }

  function dataUrls(selskapId) {
    const list = window.SA_CONFIG.dataUrls || ['../strategi/data/{id}.json'];
    return list.map(p => p.replace('{id}', selskapId) + '?v=' + Date.now());
  }

  async function fetchStrategi(selskapId) {
    const urls = dataUrls(selskapId);
    let lastErr = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) return await res.json();
        lastErr = new Error(`${url} → ${res.status}`);
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error('Ingen data-URL fungerte');
  }

  function loadDraft(selskapId) {
    try {
      const raw = localStorage.getItem(DRAFT_KEY_PREFIX + selskapId);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  function saveDraft(selskapId, doc) {
    try {
      const wrapped = { doc, savedAt: Date.now() };
      localStorage.setItem(DRAFT_KEY_PREFIX + selskapId, JSON.stringify(wrapped));
      return true;
    } catch (e) {
      console.warn('saveDraft failed', e);
      return false;
    }
  }

  function clearDraft(selskapId) {
    try {
      localStorage.removeItem(DRAFT_KEY_PREFIX + selskapId);
    } catch (e) { /* ignore */ }
  }

  function getDraftMeta(selskapId) {
    try {
      const raw = localStorage.getItem(DRAFT_KEY_PREFIX + selskapId);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return { savedAt: parsed.savedAt };
    } catch (e) { return null; }
  }

  // Public: load strategy with draft-overlay logic.
  // Returns: { doc, source: 'json'|'draft', draftMeta }
  async function loadStrategi(selskapId) {
    const id = selskapId || window.getAktivtSelskapId();
    let jsonDoc = null;
    let fetchErr = null;
    try {
      jsonDoc = await fetchStrategi(id);
    } catch (e) {
      fetchErr = e;
    }

    const draft = loadDraft(id);
    if (draft && draft.doc) {
      // Draft finnes — bruk den hvis den er nyere enn JSON.meta.sist_endret
      const jsonDate = jsonDoc?.meta?.sist_endret;
      const draftDate = new Date(draft.savedAt).toISOString().slice(0, 10);
      // Hvis JSON ikke finnes ELLER draften er nyere, bruk draft
      if (!jsonDoc || (jsonDate && draftDate >= jsonDate)) {
        return { doc: draft.doc, source: 'draft', draftMeta: { savedAt: draft.savedAt }, jsonDoc };
      }
    }

    if (!jsonDoc) {
      throw fetchErr || new Error('Ingen strategi-data tilgjengelig');
    }
    return { doc: jsonDoc, source: 'json', draftMeta: null };
  }

  // Push to API
  async function pushStrategi({ selskap_id, passord, dl_navn, strategi }) {
    const url = getPushUrl();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selskap_id, passord, dl_navn, strategi }),
    });
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch (e) { body = { error: text }; }
    if (!res.ok) {
      throw new Error(body?.error || `HTTP ${res.status}`);
    }
    return body;
  }

  // expose
  window.DATA = {
    loadStrategi,
    saveDraft,
    loadDraft,
    clearDraft,
    getDraftMeta,
    pushStrategi,
    getPushUrl,
  };
})();

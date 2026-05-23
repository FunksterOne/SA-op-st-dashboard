// =====================================================================
// STRATEGI-CORE — felles logikk for strategi-portalen (v1)
// =====================================================================

const STRATEGI_SCHEMA = '1.0';
const STRATEGI_SELSKAP_ID = 'byggmester-fritzoe';

const STRATEGI_SELSKAP = {
  'byggmester-fritzoe': {
    id: 'byggmester-fritzoe',
    label: 'Byggmester Fritzøe',
    kortnavn: 'Fritzøe',
    orgnr: '984343442',
    farge: '#4f9da6',
    by: 'Bodø',
    dl: 'Brynjar Storvik',
    ansatte: 31,
    omsetning_mnok: 76,
    aktiv: true,
  },
  'areal-byggservice': {
    id: 'areal-byggservice',
    label: 'Areal Byggservice',
    kortnavn: 'Areal',
    farge: '#66c2cc',
    by: 'Bodø',
    dl: 'Brynjar Storvik',
    aktiv: false,
  },
  'braa-sorvaag-bygg': {
    id: 'braa-sorvaag-bygg',
    label: 'Braa og Sørvåg Bygg',
    kortnavn: 'Braa',
    farge: '#d29922',
    by: 'Trondheim',
    dl: 'Øyvind Berggren',
    aktiv: false,
  },
};

const DEFAULT_PUSH_URL = 'https://sa-op-st-dashboard.vercel.app/api/push-strategi';

const META_STATUS_LABEL = {
  utkast: 'Utkast',
  validert: 'Validert av DL',
  vedtatt: 'Vedtatt av styret',
};

const TILTAK_STATUS_LABEL = {
  'pa-sporet': 'På sporet',
  'i-planlegging': 'I planlegging',
  risiko: 'Risiko',
  forsinket: 'Forsinket',
  fullfort: 'Fullført',
  'ikke-startet': 'Ikke startet',
};

const MAAL_STATUS_LABEL = {
  'pa-sporet': 'På sporet',
  risiko: 'Risiko',
  'ikke-startet': 'Ikke startet',
  'ikke-malt': 'Ikke målt',
  oppnaadd: 'Oppnådd',
};

function getPushUrl() {
  try {
    return localStorage.getItem('STRATEGI_PUSH_URL') || DEFAULT_PUSH_URL;
  } catch (e) {
    return DEFAULT_PUSH_URL;
  }
}

function getAktivtSelskapId() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('selskap');
  if (q && STRATEGI_SELSKAP[q]?.aktiv) return q;
  return STRATEGI_SELSKAP_ID;
}

function getSelskapMeta(id) {
  return STRATEGI_SELSKAP[id] || null;
}

/** Base-URL for data/ — relativ til strategi-core.js (fungerer på GH Pages under /SA-op-st-dashboard/) */
function getDataBaseUrl() {
  const core = document.querySelector('script[src*="strategi-core.js"]');
  if (core?.src) {
    try {
      return new URL('data/', core.src).href;
    } catch (e) { /* fall through */ }
  }
  return new URL('data/', window.location.href).href;
}

function dataFileUrl(selskapId, ext) {
  return getDataBaseUrl() + selskapId + '.' + ext + '?v=' + Date.now();
}

function loadStrategiViaScript(selskapId) {
  return new Promise((resolve, reject) => {
    window.STRATEGI_PAYLOAD = undefined;
    const s = document.createElement('script');
    s.src = dataFileUrl(selskapId, 'js');
    s.onload = () => {
      const data = window.STRATEGI_PAYLOAD;
      if (!data || data.selskap_id !== selskapId) {
        reject(new Error('Strategidata mangler eller ugyldig selskap-id'));
        return;
      }
      resolve(JSON.parse(JSON.stringify(data)));
    };
    s.onerror = () => reject(new Error('SCRIPT_LOAD_FAILED'));
    document.head.appendChild(s);
  });
}

async function loadStrategiViaFetch(selskapId) {
  if (window.location.protocol === 'file:') {
    throw new Error('FILE_PROTOCOL');
  }
  const res = await fetch(dataFileUrl(selskapId, 'json'));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.selskap_id !== selskapId) throw new Error('Selskap-id i fil stemmer ikke');
  return data;
}

async function loadStrategi(selskapId) {
  try {
    return await loadStrategiViaScript(selskapId);
  } catch (scriptErr) {
    try {
      return await loadStrategiViaFetch(selskapId);
    } catch (fetchErr) {
      if (window.location.protocol === 'file:' || scriptErr.message === 'SCRIPT_LOAD_FAILED') {
        throw new Error(
          'Kan ikke laste strategi når du åpner filen direkte i nettleseren. ' +
          'Bruk Live Server i VS Code/Cursor, eller kjør: npx serve . fra prosjektmappa og åpne /strategi/'
        );
      }
      if (fetchErr.message === 'Failed to fetch' || fetchErr.name === 'TypeError') {
        throw new Error(
          'Kunne ikke hente strategidata. Sjekk at strategi/data/' + selskapId + '.js finnes i repo og at siden kjøres over http(s), ikke file://.'
        );
      }
      throw fetchErr;
    }
  }
}

function escapeHtml(s) {
  if (s == null || s === '') return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function newId(prefix) {
  return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function currentKvartal() {
  const d = new Date();
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}-Q${q}`;
}

function sortFokus(list) {
  return [...(list || [])]
    .filter(f => f.aktiv !== false)
    .sort((a, b) => (a.rekkefolge || 99) - (b.rekkefolge || 99));
}

function sortTiltak(list) {
  return [...(list || [])].sort((a, b) => {
    const order = { forsinket: 0, risiko: 1, 'i-planlegging': 2, 'pa-sporet': 3, 'ikke-startet': 4, fullfort: 5 };
    const da = a.frist || '9999';
    const db = b.frist || '9999';
    if (da !== db) return da.localeCompare(db);
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  });
}

function validateStrategi(doc) {
  const errors = [];
  if (!doc || doc.schema !== STRATEGI_SCHEMA) errors.push('Ugyldig schema');
  if (!doc.retning?.kort?.trim()) errors.push('Retning (kort) er påkrevd');
  const fokusAktiv = (doc.fokus || []).filter(f => f.aktiv !== false);
  if (fokusAktiv.length > 5) errors.push('Maks 5 aktive fokuspunkter');
  if ((doc.maal || []).length > 4) errors.push('Maks 4 mål');
  if ((doc.tiltak || []).length > 7) errors.push('Maks 7 tiltak');
  (doc.tiltak || []).forEach((t, i) => {
    if (t.status !== 'ikke-startet' && !(t.neste_steg || '').trim()) {
      errors.push(`Tiltak ${i + 1}: neste steg er påkrevd`);
    }
  });
  return errors;
}

function emptyStrategi(selskapId) {
  return {
    schema: STRATEGI_SCHEMA,
    selskap_id: selskapId,
    meta: { status: 'utkast', sist_endret: todayIsoDate(), sist_endret_av: '' },
    retning: { kort: '', lang: '' },
    fokus: [],
    maal: [],
    tiltak: [],
    kvartal: { periode: currentKvartal(), notat: '', endringer: '' },
    bakgrunn: { swot: { styrker: [], svakheter: [], muligheter: [], trusler: [] } },
    okonomi: typeof emptyOkonomi === 'function' ? emptyOkonomi(selskapId) : { regnskap: [], budsjett: { '2027': {} } },
  };
}

async function saveStrategi({ selskapId, passord, dlNavn, dokument }) {
  const errors = validateStrategi(dokument);
  if (errors.length) throw new Error(errors.join('. '));

  dokument.meta = dokument.meta || {};
  dokument.meta.sist_endret = todayIsoDate();
  if (dlNavn) dokument.meta.sist_endret_av = dlNavn;

  const res = await fetch(getPushUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      selskap_id: selskapId,
      passord,
      dl_navn: dlNavn,
      strategi: dokument,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Lagring feilet (${res.status})`);
  return body;
}

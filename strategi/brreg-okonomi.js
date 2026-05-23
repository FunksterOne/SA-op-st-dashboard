// Brreg → strategi okonomi (samme tall som Proff.no)

const DEFAULT_REGNSKAP_API =
  (typeof window !== 'undefined' && window.SA_REGNSKAP_API) ||
  'https://sa-op-st-dashboard.vercel.app/api/hent-regnskap';

function getRegnskapApiUrl() {
  try {
    return localStorage.getItem('STRATEGI_REGNSKAP_API') || DEFAULT_REGNSKAP_API;
  } catch (e) {
    return DEFAULT_REGNSKAP_API;
  }
}

function krTilMnok(kr) {
  if (kr == null || Number.isNaN(kr)) return null;
  return Math.round((kr / 1e6) * 100) / 100;
}

function fmtKr(kr) {
  if (kr == null) return '—';
  return Math.round(kr).toLocaleString('nb-NO') + ' kr';
}

function fmtMnok(kr) {
  const m = krTilMnok(kr);
  if (m == null) return '—';
  return m.toFixed(2).replace('.', ',') + ' MNOK';
}

function fmtPct(p) {
  if (p == null) return '—';
  return String(p).replace('.', ',') + ' %';
}

async function hentRegnskapFraBrreg(orgnr) {
  const url = getRegnskapApiUrl() + '?orgnr=' + encodeURIComponent(orgnr);
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Kunne ikke hente regnskap (' + res.status + ')');
  return body;
}

/** Slår Brreg-svar inn i strategi-dokumentets okonomi-felt */
function mergeBrregInnIOkonomi(doc, brregPayload) {
  doc.okonomi = doc.okonomi || {};
  doc.okonomi.kilde = {
    leverandor: brregPayload.kilde?.leverandor || 'brreg_regnskapsregisteret',
    vises_som: brregPayload.kilde?.vises_som || 'Brønnøysundregistrene (Proff.no)',
    orgnr: brregPayload.orgnr,
    sist_hentet: brregPayload.kilde?.sist_hentet || todayIsoDate(),
  };

  const eksisterende = doc.okonomi.regnskap || [];
  const byAr = Object.fromEntries(eksisterende.map(r => [r.ar, r]));

  (brregPayload.regnskap || []).forEach(b => {
    if (!b.ar) return;
    const prev = byAr[b.ar] || {};
    byAr[b.ar] = {
      ...prev,
      ar: b.ar,
      periode_fra: b.periode_fra,
      periode_til: b.periode_til,
      driftsinntekter_kr: b.driftsinntekter_kr,
      driftsresultat_kr: b.driftsresultat_kr,
      resultat_foer_skatt_kr: b.resultat_foer_skatt_kr,
      arsresultat_kr: b.arsresultat_kr,
      sum_eiendeler_kr: b.sum_eiendeler_kr,
      sum_egenkapital_kr: b.sum_egenkapital_kr,
      driftsmargin_pct: b.driftsmargin_pct,
      valuta: b.valuta || 'NOK',
      fra_brreg: true,
      redigerbar: prev.redigerbar !== false,
    };
  });

  doc.okonomi.regnskap = Object.values(byAr).sort((a, b) => (b.ar || 0) - (a.ar || 0));

  if (!doc.okonomi.budsjett?.['2027']) {
    const siste = doc.okonomi.regnskap[0];
    doc.okonomi.budsjett = doc.okonomi.budsjett || {};
    doc.okonomi.budsjett['2027'] = defaultBudsjett2027(siste);
  }

  return doc;
}

function defaultBudsjett2027(sisteRegnskap) {
  const oms = sisteRegnskap?.driftsinntekter_kr;
  const margin = sisteRegnskap?.driftsmargin_pct ?? 7.7;
  const oms2027 = oms ? Math.round(oms * 1.08) : null;
  const dr2027 = oms2027 ? Math.round(oms2027 * (margin / 100)) : null;
  return {
    driftsinntekter_kr: oms2027,
    driftsresultat_kr: dr2027,
    driftsmargin_pct: margin,
    arsresultat_kr: null,
    kommentar: 'Utkast — juster for styregodkjenning',
    redigerbar: true,
  };
}

function emptyOkonomi(orgnr) {
  return {
    kilde: { leverandor: null, vises_som: null, orgnr, sist_hentet: null },
    regnskap: [],
    budsjett: { '2027': defaultBudsjett2027(null) },
  };
}

function parseKrInput(val) {
  if (val == null || val === '') return null;
  const n = Number(String(val).replace(/\s/g, '').replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function recalcMargin(r) {
  if (r.driftsinntekter_kr && r.driftsresultat_kr != null) {
    r.driftsmargin_pct = Math.round((r.driftsresultat_kr / r.driftsinntekter_kr) * 1000) / 10;
  }
}

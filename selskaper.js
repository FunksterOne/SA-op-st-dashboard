// =====================================================================
// SELSKAPER.JS — Multi-tenant datamodell for ServiceAlliansen-portefølje
// =====================================================================
// Modell:
//   - 3 separate datterselskap, alle direkte eid av ServiceAlliansen
//   - Dimensjoner: SELSKAP / BY / KONSERN
//   - Aktivt valg lagres som { type, id } i localStorage
//
// Tall: Brreg regnskapsregister 2024 (verifisert).
// =====================================================================

const KONSERN = {
  id: 'serviceAlliansen',
  navn: 'ServiceAlliansen',
  rolle: 'Konsern',
  hovedvirksomhet: 'Forsikringsskade-reparasjon (landsbasis) + byggservice via porteføljebedrifter',
  forsikringsavtaler: ['Gjensidige', 'If', 'Tryg', 'Fremtind'],
  felles_tjenester: {
    hr_sentralt: 'Visma Lønn 5.0 + felles rekrutterer',
    onboarding: 'SA Onboarding-platform',
    laeringsplattform: 'SA Læring',
    revisor: 'Hordaland Revisjon AS',
    innkjop: 'SA-konsernavtaler (trelast, festemidler)',
  },
};

// =====================================================================
// SELSKAPER — én entry per juridisk enhet
// =====================================================================
const SELSKAPER = [
  {
    id: 'byggmester-fritzoe',
    label: 'Byggmester Fritzøe',
    kortnavn: 'Fritzøe',
    orgnr: '984343442',
    nace: '41.000',
    nace_navn: 'Oppføring av bygninger',
    fagprofil: 'Snekker / tømrer / bygg-rehab',
    farge: '#4f9da6',
    farge_lys: 'rgba(79,157,166,0.15)',
    by: 'bodo',
    eierskap_sa: '2024-06',
    storage_key_anbud: 'fritzoe-anbud-state-v1',

    ledelse: {
      dl: 'Brynjar Storvik (f. 1970)',
      dl_kort: 'Brynjar Storvik',
      delt_dl_med: 'areal-byggservice',
      styreleder: 'Mads Jespersen (f. 1972) — felles for hele SA-porteføljen',
      regnskapsfoerer: 'lokal i Bodø',
    },

    lokasjon: {
      by: 'Bodø',
      adresse: 'Påls vei 1B, 8008 Bodø',
      kommunenummer: '1804',
      fylke: 'Nordland',
      fylkenummer: '18',
    },

    // Brreg regnskapsregister 2024
    regnskap_2024: {
      omsetning_mnok: 72.04,
      driftsresultat_mnok: 5.56,
      driftsmargin_pct: 7.7,
      arsresultat_mnok: 4.41,
      ek_mnok: 1.48,
      ansatte: 31,
    },

    historikk: { y2022: 60, y2023: 66, y2024: 72 },

    // Operativ seed — KPI-fallback når localStorage er tom
    operativ_seed: {
      innkommende_pipeline: 6,
      innkommende_detail: '2 Doffin · 3 Mercell · 1 TendSign',
      pending_anbud: 2,
      pending_detail: '2 anbud venter avgjørelse',
      pipeline_verdi_kr: 28500000,
      pipeline_mal_kr: 40000000,        // kvartalsmål
      hit_rate_pct: 72,
      hit_rate_mal_pct: 70,
      hit_rate_detail: '13 vunnet av 18 avgjorte siste 90 dager',
      margin_pct: 7.4,
      margin_mal_pct: 7.5,
      margin_detail: '12 pågående prosjekter, snitt-margin pr i dag',
      frister_neste_7d: 4,
      frister_neste_14d: 7,
      frister_kritiske: 1,
      aktive_prosjekter: 8,
      prosjekter_flagget: 1,
      prosjekter_pa_sporet: 7,
      preview_innkommende: [
        { kilde: 'Mercell', tittel: 'Bodø rådhus — kontorrehab 4. etg', kunde: 'Bodø kommune', frist: '2026-05-07', match: 92, urgent: true },
        { kilde: 'Doffin', tittel: 'Rammeavtale bygg- og vedlikehold 2027–2030', kunde: 'Helse Nord RHF', frist: '2026-06-12', match: 100, strategisk: true },
        { kilde: 'TendSign', tittel: 'Bodin vgs — innvendig rehab', kunde: 'Nordland fylkeskommune', frist: '2026-05-15', match: 87 },
        { kilde: 'Mercell', tittel: 'Forsvarsbygg Bodøsjøen — bolig 27', kunde: 'Forsvarsbygg', frist: '2026-05-22', match: 94 },
      ],
      prosjekter_med_status: [
        { navn: 'Skarmoen barnehage — byggeteknisk rehab', status: 'red', kommentar: '298 t brukt ved 25 % fremdrift · marginvarsel', fremdrift: 25 },
        { navn: 'Hunstad ungdomsskole — garderoberehab', status: 'green', kommentar: '+5,8 % over plan', fremdrift: 95 },
        { navn: 'Saltstraumen skole — dør og vindu', status: 'green', kommentar: '+9,2 % over plan', fremdrift: 85 },
        { navn: 'Forsvarsbygg Bodøsjøen — kontorrehab', status: 'green', kommentar: '+7,2 % projisert', fremdrift: 32 },
      ],
    },

    pipeline_kilder: ['Doffin', 'Mercell', 'TendSign', 'CoBrief', 'SA Forsikring', 'E-post'],
    rot_andel_pct: 65,
    nybygg_andel_pct: 0,
  },

  {
    id: 'areal-byggservice',
    label: 'Areal Byggservice',
    kortnavn: 'Areal',
    orgnr: '996373207',
    nace: '43.320',
    nace_navn: 'Snekkerarbeid',
    fagprofil: 'Maler / overflate / lett snekker',
    farge: '#66c2cc',
    farge_lys: 'rgba(102,194,204,0.15)',
    by: 'bodo',
    eierskap_sa: '2024-06',
    storage_key_anbud: 'areal-anbud-state-v1',

    ledelse: {
      dl: 'Brynjar Storvik (f. 1970)',
      dl_kort: 'Brynjar Storvik',
      delt_dl_med: 'byggmester-fritzoe',
      styreleder: 'Mads Jespersen (f. 1972) — felles for hele SA-porteføljen',
      regnskapsfoerer: 'lokal i Bodø',
    },

    lokasjon: {
      by: 'Bodø',
      adresse: 'Påls vei 1B, 8008 Bodø',
      kommunenummer: '1804',
      fylke: 'Nordland',
      fylkenummer: '18',
    },

    regnskap_2024: {
      omsetning_mnok: 45.25,
      driftsresultat_mnok: 3.38,
      driftsmargin_pct: 7.5,
      arsresultat_mnok: 2.79,
      ek_mnok: 1.30,
      ansatte: 28,
    },

    historikk: { y2022: 38, y2023: 41, y2024: 45 },

    operativ_seed: {
      innkommende_pipeline: 4,
      innkommende_detail: '1 Doffin · 2 Mercell · 1 e-post',
      pending_anbud: 1,
      pending_detail: '1 anbud venter avgjørelse',
      pipeline_verdi_kr: 17300000,
      pipeline_mal_kr: 22000000,
      hit_rate_pct: 75,
      hit_rate_mal_pct: 70,
      hit_rate_detail: '9 vunnet av 12 avgjorte siste 90 dager',
      margin_pct: 7.6,
      margin_mal_pct: 7.5,
      margin_detail: '4 pågående prosjekter, snitt-margin pr i dag',
      frister_neste_7d: 3,
      frister_neste_14d: 5,
      frister_kritiske: 0,
      aktive_prosjekter: 4,
      prosjekter_flagget: 0,
      prosjekter_pa_sporet: 4,
      preview_innkommende: [
        { kilde: 'Mercell', tittel: 'Stordalshallen — innvendig maling', kunde: 'Bodø kommune', frist: '2026-05-12', match: 95, urgent: true },
        { kilde: 'Doffin', tittel: 'Rammeavtale maler/overflate 2027–2030', kunde: 'Bodø kommune', frist: '2026-06-20', match: 100, strategisk: true },
        { kilde: 'Mercell', tittel: 'Mørkvedhallen — gulvbelegg', kunde: 'Bodø kommune', frist: '2026-05-28', match: 88 },
        { kilde: 'E-post', tittel: 'Borettslag Mørkved — fasade-vurdering', kunde: 'BBL Mørkved', frist: '2026-06-05', match: 80 },
      ],
      prosjekter_med_status: [
        { navn: 'Bodø rådhus — innvendig maling 3. etg', status: 'green', kommentar: '+3,2 % over plan', fremdrift: 65 },
        { navn: 'Hunstad bibliotek — overflate', status: 'green', kommentar: '+2,8 % over plan', fremdrift: 40 },
        { navn: 'Mørkved senior — utvendig maling', status: 'yellow', kommentar: 'Vær-forsinkelse · på rammen', fremdrift: 28 },
        { navn: 'Bankgata skole — maling fløy A', status: 'green', kommentar: '+4,1 % over plan', fremdrift: 72 },
      ],
    },

    pipeline_kilder: ['Doffin', 'Mercell', 'TendSign', 'CoBrief', 'SA Forsikring', 'E-post'],
    rot_andel_pct: 58,
    nybygg_andel_pct: 0,
  },

  {
    id: 'braa-sorvaag-bygg',
    label: 'Braa og Sørvåg Bygg',
    kortnavn: 'Braa og Sørvåg',
    orgnr: '962246931',
    nace: '43.320',
    nace_navn: 'Snekkerarbeid',
    fagprofil: 'Snekker / total-rehab',
    farge: '#d29922',
    farge_lys: 'rgba(210,153,34,0.15)',
    by: 'trondheim',
    eierskap_sa: '2024',
    storage_key_anbud: 'braa-anbud-state-v1',

    ledelse: {
      dl: 'Øyvind Björnänger Berggren (f. 1985)',
      dl_kort: 'Øyvind Berggren',
      delt_dl_med: null,
      styreleder: 'Mads Jespersen (f. 1972) — felles for hele SA-porteføljen',
      styremedlemmer: ['Alexander Oleshchuk', 'Fredrik Toft Bysveen', 'Morten Faye Eriksen'],
      regnskapsfoerer: 'Alpha Økonomi AS',
    },

    lokasjon: {
      by: 'Trondheim',
      adresse: 'Tillerbruvegen 76, 7092 Tiller',
      kommunenummer: '5001',
      fylke: 'Trøndelag',
      fylkenummer: '50',
    },

    regnskap_2024: {
      omsetning_mnok: 57.73,
      driftsresultat_mnok: 0.37,
      driftsmargin_pct: 0.6,
      arsresultat_mnok: 0.27,
      ek_mnok: 13.46,
      ansatte: 32,
    },

    historikk: { y2022: 50, y2023: 54, y2024: 58 },

    operativ_seed: {
      innkommende_pipeline: 14,
      innkommende_detail: '3 Doffin · 5 Mercell · 2 TendSign · 3 CoBrief · 1 SA Forsikring',
      pending_anbud: 2,
      pending_detail: '2 anbud venter avgjørelse',
      pipeline_verdi_kr: 5900000,
      pipeline_mal_kr: 18000000,
      hit_rate_pct: 67,
      hit_rate_mal_pct: 70,
      hit_rate_detail: '16 vunnet av 24 avgjorte siste 90 dager',
      margin_pct: 4.2,
      margin_mal_pct: 6.0,
      margin_detail: '12 pågående prosjekter — marginløft er hovedoppgave 2026',
      frister_neste_7d: 3,
      frister_neste_14d: 5,
      frister_kritiske: 1,
      aktive_prosjekter: 12,
      prosjekter_flagget: 1,
      prosjekter_pa_sporet: 11,
      preview_innkommende: [
        { kilde: 'SA Forsikring', tittel: 'Vannskade — Strindveien 102', kunde: 'Gjensidige Forsikring', frist: '2026-05-02', match: 91, urgent: true },
        { kilde: 'Mercell', tittel: 'Strinda vgs — biologirommet ombygging', kunde: 'Trøndelag fylkeskommune', frist: '2026-05-10', match: 88, urgent: true },
        { kilde: 'Doffin', tittel: 'Rammeavtale bygg 2027–2030', kunde: 'Helse Midt-Norge RHF', frist: '2026-06-14', match: 100, strategisk: true },
        { kilde: 'TendSign', tittel: 'Persaunet leir — bolig 14, 15, 16', kunde: 'Forsvarsbygg', frist: '2026-05-25', match: 94 },
      ],
      prosjekter_med_status: [
        { navn: 'Lade barnehage — byggeteknisk rehab', status: 'red', kommentar: '348 t brukt ved 25 % fremdrift · marginvarsel', fremdrift: 25 },
        { navn: 'Charlottenlund vgs — garderobe', status: 'green', kommentar: '+8,3 % over plan', fremdrift: 75 },
        { navn: 'Heimdal vgs — innvendig fløy A', status: 'green', kommentar: '+9,2 % over plan', fremdrift: 92 },
        { navn: 'NTNU Gløshaugen — Inst.bygg', status: 'green', kommentar: '+7,2 % projisert', fremdrift: 28 },
      ],
    },

    pipeline_kilder: ['Doffin', 'Mercell', 'TendSign', 'CoBrief', 'SA Forsikring', 'E-post'],
    rot_andel_pct: 55,
    nybygg_andel_pct: 15,
  },
];

// =====================================================================
// BYER — geografisk dimensjon
// =====================================================================
const BYER = [
  {
    id: 'bodo',
    label: 'Bodø',
    sub: 'Fritzøe + Areal',
    farge: '#4f9da6',
    selskaper: ['byggmester-fritzoe', 'areal-byggservice'],
    fylke: 'Nordland',
    marked: {
      sysselsetting_fylke_2024: 10619,
      sysselsetting_fylke_2025: 10508,
      sysselsetting_endring_pct: -1.0,
      igangsatte_boliger_2020: 420,
      igangsatte_boliger_2024: 261,
      igangsetting_endring_pct: -38,
    },
    // Strategi-scenarioer per by (felles for selskapene i byen)
    scenarioer: {
      base: {
        navn: 'Base — lokalt Bodø',
        cagr_pct: 5,
        rot_2026: 130, rot_2027: 137, rot_2028: 144, rot_2029: 151,
        forsikring_2026: 10, forsikring_2027: 12, forsikring_2028: 14, forsikring_2029: 16,
        ebit_margin_2029_pct: 7.3,
        ansatte_2029: 65,
        kapitalbehov: 'Drift',
        beskrivelse: 'Holder posisjonen i Bodø, ingen geografisk utvidelse, ingen oppkjøp.',
      },
      offensiv: {
        navn: 'Offensiv — Salten + nabokommuner',
        cagr_pct: 15,
        rot_2026: 135, rot_2027: 156, rot_2028: 180, rot_2029: 207,
        forsikring_2026: 10, forsikring_2027: 14, forsikring_2028: 18, forsikring_2029: 22,
        ebit_margin_2029_pct: 7.8,
        ansatte_2029: 95,
        kapitalbehov: '25–40 MNOK',
        beskrivelse: 'Geografisk utvidelse til Fauske, Saltdal, Sørfold, Steigen + 1–2 oppkjøp.',
      },
      bull: {
        navn: 'Bull — hele Nordland',
        cagr_pct: 25,
        rot_2026: 140, rot_2027: 175, rot_2028: 220, rot_2029: 280,
        forsikring_2026: 12, forsikring_2027: 18, forsikring_2028: 24, forsikring_2029: 30,
        ebit_margin_2029_pct: 8.3,
        ansatte_2029: 140,
        kapitalbehov: '75–120 MNOK',
        beskrivelse: 'Salten + Helgeland + Lofoten/Vesterålen, 3–4 oppkjøp, ledende ROT-aktør.',
      },
    },
  },
  {
    id: 'trondheim',
    label: 'Trondheim',
    sub: 'Braa og Sørvåg',
    farge: '#d29922',
    selskaper: ['braa-sorvaag-bygg'],
    fylke: 'Trøndelag',
    marked: {
      sysselsetting_fylke_2024: 22147,
      sysselsetting_fylke_2025: 21595,
      sysselsetting_endring_pct: -2.5,
      igangsatte_boliger_2020: 1802,
      igangsatte_boliger_2024: 1392,
      igangsetting_endring_pct: -23,
    },
    scenarioer: {
      base: {
        navn: 'Base — lokalt Trondheim',
        cagr_pct: 6,
        rot_2026: 65, rot_2027: 69, rot_2028: 73, rot_2029: 77,
        forsikring_2026: 12, forsikring_2027: 14, forsikring_2028: 16, forsikring_2029: 18,
        ebit_margin_2029_pct: 5.5,
        ansatte_2029: 38,
        kapitalbehov: 'Drift',
        beskrivelse: 'Konsolidering i Trondheim, marginløft som hovedfokus, ingen geografisk vekst.',
      },
      offensiv: {
        navn: 'Offensiv — Trøndelag',
        cagr_pct: 13,
        rot_2026: 70, rot_2027: 79, rot_2028: 90, rot_2029: 102,
        forsikring_2026: 14, forsikring_2027: 18, forsikring_2028: 22, forsikring_2029: 25,
        ebit_margin_2029_pct: 7.0,
        ansatte_2029: 50,
        kapitalbehov: '20–35 MNOK',
        beskrivelse: 'Innherred + Stjørdal-Fosen + 1 oppkjøp. Marginløft via felles SA-prosesser.',
      },
      bull: {
        navn: 'Bull — hele Midt-Norge',
        cagr_pct: 22,
        rot_2026: 75, rot_2027: 92, rot_2028: 112, rot_2029: 137,
        forsikring_2026: 16, forsikring_2027: 22, forsikring_2028: 28, forsikring_2029: 35,
        ebit_margin_2029_pct: 8.0,
        ansatte_2029: 75,
        kapitalbehov: '60–100 MNOK',
        beskrivelse: 'Trøndelag + Møre og Romsdal-grenseland. 2–3 oppkjøp. Ledende posisjon.',
      },
    },
  },
];

// =====================================================================
// AKTIVT VALG — { type: 'selskap'|'by'|'konsern', id: string }
// =====================================================================
const ACTIVE_KEY = 'sa-active-scope-v2';

function getActiveScope() {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  // Default: Byggmester Fritzøe
  return { type: 'selskap', id: 'byggmester-fritzoe' };
}

function setActiveScope(scope) {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(scope));
  window.dispatchEvent(new CustomEvent('scope-changed', { detail: scope }));
}

function getSelskap(id) {
  return SELSKAPER.find(s => s.id === id);
}

function getBy(id) {
  return BYER.find(b => b.id === id);
}

function getSelskaperInScope(scope = null) {
  scope = scope || getActiveScope();
  if (scope.type === 'konsern') return SELSKAPER;
  if (scope.type === 'by') {
    const by = getBy(scope.id);
    return by ? SELSKAPER.filter(s => by.selskaper.includes(s.id)) : [];
  }
  if (scope.type === 'selskap') {
    const s = getSelskap(scope.id);
    return s ? [s] : [];
  }
  return [];
}

function getScopeLabel(scope = null) {
  scope = scope || getActiveScope();
  if (scope.type === 'konsern') return { label: 'Konsern', sub: 'ServiceAlliansen Bygg', farge: '#8b95a3' };
  if (scope.type === 'by') {
    const by = getBy(scope.id);
    return by ? { label: by.label, sub: by.sub, farge: by.farge } : null;
  }
  const s = getSelskap(scope.id);
  return s ? { label: s.label, sub: `${s.lokasjon.by} · ${s.regnskap_2024.ansatte} ansatte`, farge: s.farge } : null;
}

// =====================================================================
// KPI-AGGREGERING
// =====================================================================

function getOperativKpiFor(selskap) {
  const seed = selskap.operativ_seed || {};
  try {
    const raw = localStorage.getItem(selskap.storage_key_anbud);
    if (raw) {
      const state = JSON.parse(raw);
      if (Array.isArray(state.anbud)) {
        const won = state.anbud.filter(a => a.resultat === 'Vunnet').length;
        const lost = state.anbud.filter(a => a.resultat === 'Tapt').length;
        const pending = state.anbud.filter(a => a.resultat === 'Pending');
        const pipelineVerdi = pending.reduce((s, a) => s + (a.verdi || 0), 0);
        const decided = won + lost;
        return {
          ...seed,
          innkommende_pipeline: Math.max(0, (seed.innkommende_pipeline || 0) - (state.consumedPipeIds || []).length),
          pending_anbud: pending.length,
          pipeline_verdi_kr: pipelineVerdi || seed.pipeline_verdi_kr,
          hit_rate_pct: decided ? Math.round(won / decided * 100) : seed.hit_rate_pct,
          hit_rate_detail: decided ? `${won} vunnet av ${decided} avgjorte` : seed.hit_rate_detail,
          _won: won, _lost: lost,
          _selskap_id: selskap.id,
          _selskap_navn: selskap.kortnavn,
          _selskap_farge: selskap.farge,
        };
      }
    }
  } catch (e) {}
  return {
    ...seed, _won: 0, _lost: 0,
    _selskap_id: selskap.id, _selskap_navn: selskap.kortnavn, _selskap_farge: selskap.farge,
  };
}

function getOperativKpi(scope = null) {
  const selskaper = getSelskaperInScope(scope);
  if (selskaper.length === 0) return null;
  if (selskaper.length === 1) return getOperativKpiFor(selskaper[0]);

  // Aggregér flere selskap (by eller konsern)
  const all = selskaper.map(getOperativKpiFor);
  const sum = (key) => all.reduce((s, k) => s + (k[key] || 0), 0);
  const wonTotal = sum('_won');
  const lostTotal = sum('_lost');
  const decidedTotal = wonTotal + lostTotal;

  // Vektet snitt for margin (etter pipeline-verdi som proxy for selskap-størrelse)
  const totVerdi = sum('pipeline_verdi_kr') || 1;
  const marginVektet = all.reduce((s, k) => s + (k.margin_pct || 0) * (k.pipeline_verdi_kr || 0), 0) / totVerdi;
  const malMarginSnitt = all.reduce((s, k) => s + (k.margin_mal_pct || 0), 0) / all.length;

  return {
    innkommende_pipeline: sum('innkommende_pipeline'),
    innkommende_detail: `Aggregert: ${selskaper.length} selskap`,
    pending_anbud: sum('pending_anbud'),
    pending_detail: `${sum('pending_anbud')} anbud venter avgjørelse på tvers`,
    pipeline_verdi_kr: sum('pipeline_verdi_kr'),
    pipeline_mal_kr: sum('pipeline_mal_kr'),
    hit_rate_pct: decidedTotal ? Math.round(wonTotal / decidedTotal * 100)
      : Math.round(all.reduce((s, k) => s + (k.hit_rate_pct || 0), 0) / all.length),
    hit_rate_mal_pct: Math.round(all.reduce((s, k) => s + (k.hit_rate_mal_pct || 0), 0) / all.length),
    hit_rate_detail: decidedTotal ? `${wonTotal} vunnet av ${decidedTotal} avgjorte (aggregert)`
      : 'Ingen avgjørelser registrert ennå (aggregert)',
    margin_pct: Math.round(marginVektet * 10) / 10,
    margin_mal_pct: Math.round(malMarginSnitt * 10) / 10,
    margin_detail: `Vektet snitt på tvers av ${selskaper.length} selskap`,
    frister_neste_7d: sum('frister_neste_7d'),
    frister_neste_14d: sum('frister_neste_14d'),
    frister_kritiske: sum('frister_kritiske'),
    aktive_prosjekter: sum('aktive_prosjekter'),
    prosjekter_flagget: sum('prosjekter_flagget'),
    prosjekter_pa_sporet: sum('prosjekter_pa_sporet'),
    preview_innkommende: all.flatMap(k =>
      (k.preview_innkommende || []).map(p => ({...p, _selskap: k._selskap_navn, _farge: k._selskap_farge}))
    ).sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0)).slice(0, 6),
    prosjekter_med_status: all.flatMap(k =>
      (k.prosjekter_med_status || []).map(p => ({...p, _selskap: k._selskap_navn, _farge: k._selskap_farge}))
    ).sort((a, b) => {
      const order = { red: 0, yellow: 1, green: 2 };
      return (order[a.status] || 9) - (order[b.status] || 9);
    }).slice(0, 6),
    _aggregated: true,
  };
}

// =====================================================================
// REGNSKAP-AGGREGERING
// =====================================================================

function getRegnskap2024(scope = null) {
  const selskaper = getSelskaperInScope(scope);
  if (selskaper.length === 0) return null;
  if (selskaper.length === 1) return { ...selskaper[0].regnskap_2024, n: 1 };

  const sum = (key) => selskaper.reduce((s, x) => s + (x.regnskap_2024[key] || 0), 0);
  const oms = sum('omsetning_mnok');
  const drift = sum('driftsresultat_mnok');
  return {
    omsetning_mnok: Math.round(oms * 100) / 100,
    driftsresultat_mnok: Math.round(drift * 100) / 100,
    driftsmargin_pct: oms ? Math.round((drift / oms) * 1000) / 10 : 0,
    arsresultat_mnok: Math.round(sum('arsresultat_mnok') * 100) / 100,
    ek_mnok: Math.round(sum('ek_mnok') * 100) / 100,
    ansatte: sum('ansatte'),
    n: selskaper.length,
  };
}

// =====================================================================
// SCENARIO-AGGREGERING (per by / konsern)
// =====================================================================

function getScenarioForScope(scenario, year, scope = null) {
  scope = scope || getActiveScope();
  // Selskap: bruker by-scenarioet (fordi scenarioene er per by)
  if (scope.type === 'selskap') {
    const s = getSelskap(scope.id);
    if (!s) return { rot: 0, forsikring: 0, total: 0 };
    const by = BYER.find(b => b.id === s.by);
    const sc = by?.scenarioer?.[scenario];
    if (!sc) return { rot: 0, forsikring: 0, total: 0 };
    // Skaler etter selskapets andel av byens omsetning
    const byOms = by.selskaper.reduce((acc, sid) => acc + (getSelskap(sid)?.regnskap_2024.omsetning_mnok || 0), 0);
    const andel = byOms ? s.regnskap_2024.omsetning_mnok / byOms : 1;
    const rot = (sc[`rot_${year}`] || 0) * andel;
    const forsikring = (sc[`forsikring_${year}`] || 0) * andel;
    return { rot, forsikring, total: rot + forsikring };
  }
  if (scope.type === 'by') {
    const by = getBy(scope.id);
    const sc = by?.scenarioer?.[scenario];
    if (!sc) return { rot: 0, forsikring: 0, total: 0 };
    const rot = sc[`rot_${year}`] || 0;
    const forsikring = sc[`forsikring_${year}`] || 0;
    return { rot, forsikring, total: rot + forsikring };
  }
  // Konsern: sum over alle byer
  let rot = 0, forsikring = 0;
  BYER.forEach(by => {
    const sc = by.scenarioer?.[scenario];
    if (sc) {
      rot += sc[`rot_${year}`] || 0;
      forsikring += sc[`forsikring_${year}`] || 0;
    }
  });
  return { rot, forsikring, total: rot + forsikring };
}

// =====================================================================
// ROUTING — hvilken side hører til hvilken modul, gitt scope
// =====================================================================
// Sidebar bruker dette til å bygge riktige href-er
function getRouteFor(modul, scope = null) {
  scope = scope || getActiveScope();
  const isTrondheim = scope.type === 'selskap' ? getSelskap(scope.id)?.by === 'trondheim'
    : scope.type === 'by' ? scope.id === 'trondheim' : false;
  switch (modul) {
    case 'dashboard': return 'index.html';
    case 'anbud': return isTrondheim ? 'anbud-trondheim.html' : 'anbud.html';
    case 'anbud-detalj': return 'anbud-detalj.html';
    case 'overlevering': return 'overlevering.html';
    case 'prosjekter': return 'prosjekter.html';
    case 'prosjekt': return 'prosjekt.html';
    case 'okonomi': return isTrondheim ? 'okonomi-trondheim.html' : 'okonomi.html';
    case 'bruksanvisning': return isTrondheim ? 'bruksanvisning-trondheim.html' : 'bruksanvisning.html';
    case 'strategi': return 'strategi.html';
    case 'scenario': return 'scenario.html';
    case 'styrerapport': return 'styrerapport.html';
    case 'ma-screening': return isTrondheim ? 'ma-screening-trondheim.html' : 'ma-screening-bodo.html';
    case 'ma-kandidat': return 'ma-kandidat.html';
    case 'ma-konsern': return 'ma-konsern.html';
    case 'forsikring': return 'm9-konsekvens.html';
    case 'm5-poweroffice': return 'm5-konsekvens.html';
    case 'epc-satsing': return 'epc-konsekvens.html';
    case 'implementering': return 'implementering.html';
    case 'bransjekart': return isTrondheim ? 'dashboard-trondheim.html' : 'dashboard.html';
    case 'oversikt': return isTrondheim ? 'oversikt-trondheim.html' : 'oversikt.html';
    case 'sa-rapport': return 'sa-rapport.html';
    default: return 'index.html';
  }
}

// =====================================================================
// LEGACY-KOMPATIBILITET — gamle helper-funksjoner som filer fortsatt bruker
// =====================================================================
function getActiveSelskapId() {
  const scope = getActiveScope();
  if (scope.type === 'selskap') return scope.id;
  if (scope.type === 'by') return scope.id === 'bodo' ? 'byggmester-fritzoe' : 'braa-sorvaag-bygg';
  return 'byggmester-fritzoe';
}

function setActiveSelskapId(id) {
  // Map legacy id-er til scope
  if (id === 'konsern') return setActiveScope({ type: 'konsern', id: 'konsern' });
  if (id === 'fritzoe-areal-bodo') return setActiveScope({ type: 'by', id: 'bodo' });
  if (id === 'braa-sorvaag-trondheim') return setActiveScope({ type: 'selskap', id: 'braa-sorvaag-bygg' });
  if (getSelskap(id)) return setActiveScope({ type: 'selskap', id });
  setActiveScope({ type: 'selskap', id: 'byggmester-fritzoe' });
}

function getActiveSelskap() {
  const scope = getActiveScope();
  if (scope.type === 'selskap') return getSelskap(scope.id);
  // For by/konsern: returner første selskap (legacy)
  return getSelskaperInScope(scope)[0] || null;
}

// Legacy konsern-aggregering (eldre filer kaller denne)
function aggregateKonsern(metricKey, source = 'regnskap_2024') {
  return SELSKAPER.reduce((sum, s) => sum + (s[source]?.[metricKey] || 0), 0);
}

function aggregateScenarioMNOK(scenario, year) {
  let rot = 0, forsikring = 0;
  BYER.forEach(by => {
    const sc = by.scenarioer?.[scenario];
    if (sc) {
      rot += sc[`rot_${year}`] || 0;
      forsikring += sc[`forsikring_${year}`] || 0;
    }
  });
  return { rot, forsikring, total: rot + forsikring };
}

function getKonsernOversikt() {
  const r = getRegnskap2024({ type: 'konsern', id: 'konsern' });
  return {
    navn: KONSERN.navn,
    selskaper: SELSKAPER.length,
    omsetning_2024_mnok: r.omsetning_mnok,
    ebit_2024_mnok: r.driftsresultat_mnok,
    ek_2024_mnok: r.ek_mnok,
    ansatte_2024: r.ansatte,
    snitt_margin_2024: r.driftsmargin_pct,
  };
}

// Legacy stubs — gamle filer som bygde egen velger kan kalle disse uten å krasje.
// Sidebar.js erstatter funksjonen, så disse er no-ops.
function buildSelskapVelgerHTML() { return ''; }
function wireSelskapVelger() {}
function injectSelskapVelgerCss() {}

// =====================================================================
// strategi-v2 — config (static reference data)
// =====================================================================
// Selskap-meta, horisonter og scenarier som ikke endres ofte.
// Den redigerbare strategien (retning, fokus, mål, tiltak, økonomi) ligger
// i strategi/data/{selskap-id}.json og lastes via data-loader.js.
// =====================================================================

window.SA_CONFIG = {

  // Default push-URL for API. Kan overstyres via:
  //   localStorage.setItem('STRATEGI_PUSH_URL', '<URL>')
  // På Vercel-deploy fungerer relativ '/api/push-strategi' direkte.
  defaultPushUrl: '/api/push-strategi',
  vercelFallbackUrl: 'https://sa-op-st-dashboard.vercel.app/api/push-strategi',

  // Datafil (JSON) relativ til strategi/-mappa.
  dataUrls: [
    'data/{id}.json',
  ],

  // Selskap i porteføljen — kun fritzoe er aktiv i v1 av strategi-portalen
  selskaper: [
    {
      id: 'byggmester-fritzoe',
      label: 'Byggmester Fritzøe',
      kort: 'Fritzøe',
      orgnr: '984343442',
      by: 'Bodø',
      ansatte: 31,
      omsetning_mnok: 75.6,
      dl: 'Brynjar Storvik',
      dl_init: 'BS',
      aktiv: true,
    },
    {
      id: 'areal-byggservice',
      label: 'Areal Byggservice',
      kort: 'Areal',
      orgnr: '923456789',
      by: 'Bodø',
      ansatte: 18,
      omsetning_mnok: 42.1,
      dl: 'Brynjar Storvik',
      dl_init: 'BS',
      aktiv: false,
    },
    {
      id: 'braa-sorvaag-bygg',
      label: 'Braa og Sørvåg Bygg',
      kort: 'Braa',
      orgnr: '912345678',
      by: 'Trondheim',
      ansatte: 24,
      omsetning_mnok: 58.3,
      dl: 'Øyvind Berggren',
      dl_init: 'ØB',
      aktiv: false,
    },
  ],

  // Tre horisonter per selskap (statisk strategisk rammeverk)
  horisonter: {
    'byggmester-fritzoe': [
      {
        tag: 'Horisont 1',
        tittel: 'Effektivisering',
        periode: '2026 – 2027',
        fokus: 'Anbudsdisiplin + AI-screening (CoBrief), hit-rate til 75 %, rammeavtaler offentlig sektor, lærlingprogram 5→8. Marginen holdes på 7,7 %.',
        scenario: 'Base+ · driftet',
      },
      {
        tag: 'Horisont 2',
        tittel: 'Geografi + forsikring',
        periode: '2028',
        fokus: 'Salten-satellitt (Fauske/Saltdal/Sørfold/Steigen), SA forsikringsstrøm aktivert, energi-rehab pakke etter TEK17/EPBD lansert.',
        scenario: 'Offensiv+ · krever 25–40 MNOK',
      },
      {
        tag: 'Horisont 3',
        tittel: 'Skalering',
        periode: '2029 +',
        fokus: 'Helgeland / Lofoten-Vesterålen, ledende ROT-aktør i Nordland, evt. integrering med Areal Byggservice, 1–2 M&A i Salten.',
        scenario: 'Bull · styrebeslutning',
      },
    ],
  },

  // Scenarier per selskap (omsetning, margin, ansatte, kapital 2029)
  scenarier: {
    'byggmester-fritzoe': [
      {
        id: 'base',
        navn: 'Hold posisjon.',
        tag: 'Scenario A · Base',
        desc: 'Holder dagens posisjon i Bodø: tømrere, snekkere og lærlinger uten utvidelse. 5 % årlig vekst, lønnsomhet stabil på 7,7 %, bemanning uendret.',
        omsetning_2029_mnok: 92,
        driftsmargin_2029_pct: 7.7,
        ansatte_2029: 31,
        forsikring_2029_mnok: 0,
        kapitalbehov: 'Drift / kontantstrøm',
        anbefalt: false,
        // For chart — interpolerte verdier 2026,2027,2028,2029
        ramp: [76, 79, 84, 92],
      },
      {
        id: 'offensiv',
        navn: 'Geografisk utvidelse.',
        tag: 'Scenario B · Offensiv',
        desc: 'Aktivér SA forsikringsstrøm, etabler Salten-satellitt, lanser energi-rehab-pakke. Krever 25–40 MNOK i SA-konserninnskudd + utvidet bemanning fra 2028.',
        omsetning_2029_mnok: 141,
        driftsmargin_2029_pct: 7.8,
        ansatte_2029: 52,
        forsikring_2029_mnok: 6,
        kapitalbehov: '25–40 MNOK',
        anbefalt: true,
        ramp: [76, 82, 110, 141],
      },
      {
        id: 'bull',
        navn: 'Markedsledende i Nordland.',
        tag: 'Scenario C · Bull',
        desc: 'Helgeland / Lofoten-Vesterålen + 1–2 M&A i Salten + evt. integrering med Areal. Forutsetter både offensiv-løypa og styrebeslutning om M&A i 2028.',
        omsetning_2029_mnok: 198,
        driftsmargin_2029_pct: 8.1,
        ansatte_2029: 86,
        forsikring_2029_mnok: 12,
        kapitalbehov: '60–90 MNOK',
        anbefalt: false,
        ramp: [76, 84, 128, 198],
      },
    ],
  },

  // Status-mapping (matcher api/push-strategi.js sin validering)
  statusLabels: {
    meta: { utkast: 'Utkast', validert: 'Validert av DL', vedtatt: 'Vedtatt av styret' },
    maal: {
      'pa-sporet': 'På sporet',
      'risiko': 'Risiko',
      'ikke-startet': 'Ikke startet',
      'ikke-malt': 'Ikke målt',
      'oppnaadd': 'Oppnådd',
    },
    tiltak: {
      'pa-sporet': 'På sporet',
      'i-planlegging': 'I planlegging',
      'risiko': 'Risiko',
      'forsinket': 'Forsinket',
      'fullfort': 'Fullført',
      'ikke-startet': 'Ikke startet',
    },
  },

  // Visuell klasse-mapping for status (brukes i CSS-klasser)
  tiltakStatusClass: {
    'pa-sporet': 'pa-sporet',
    'i-planlegging': 'i-plan',
    'risiko': 'risiko',
    'forsinket': 'risiko',
    'fullfort': 'pa-sporet',
    'ikke-startet': 'ikke',
  },
};

// Helpers exposed globally
window.getSelskap = function (id) {
  return window.SA_CONFIG.selskaper.find(s => s.id === id) || window.SA_CONFIG.selskaper[0];
};
window.getAktivtSelskapId = function () {
  const id = localStorage.getItem('sa-strat-selskap') || 'byggmester-fritzoe';
  const s = window.SA_CONFIG.selskaper.find(x => x.id === id);
  return s?.aktiv ? id : 'byggmester-fritzoe';
};

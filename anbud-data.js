// =====================================================================
// ANBUD-DATA.JS — anbud-data og helpers (lifecycle, AI-vurdering, kalkulasjon)
// =====================================================================
// Hovedsporet — anbud-versjonen:
//   Dashboard → Anbudspipeline → Anbud (drill) → Lifecycle / AI / Kalkulasjon / Konkurrenter / Dokumenter
//
// Lifecycle-faser:
//   1. Varsel mottatt (fra portal)
//   2. Vurdering / AI-screening
//   3. Go/No-Go beslutning (DL)
//   4. Kalkulasjon (Holte SmartKalk)
//   5. Tilbud levert
//   6. Pending — venter på kunde
//   7. Vunnet / Tapt / Trukket
//   8. Kontrakt → overleveres som prosjekt (link til prosjekt.html)
//
// Lastes etter selskaper.js. Eksponerer:
//   - ANBUD (array) · getAnbudInScope · getAnbudById
//   - aggregateAnbud(anbud) — beregner derived margin, kostnader
//   - aktivAnbudFase(anbud) — gir nåværende fase
//   - getAnbudKilder() — returnerer unik liste over kilder for filter
// =====================================================================

const ANBUD_KILDE_LABEL = {
  Mercell: 'Mercell',
  Doffin: 'Doffin',
  TendSign: 'TendSign',
  CoBrief: 'CoBrief',
  'SA Forsikring': 'SA Forsikring',
  'E-post': 'E-post',
};

const ANBUD_STATUS_LABEL = {
  pending: 'Pending',
  vunnet: 'Vunnet',
  tapt: 'Tapt',
  trukket: 'Trukket',
  no_go: 'No-Go',
};

const ANBUD = [
  // ===================================================================
  // Byggmester Fritzøe — Bodø
  // ===================================================================
  {
    id: 'AN-2025-014',
    selskap_id: 'byggmester-fritzoe',
    tittel: 'Bodø rådhus — kontorrehab 4. etg',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    kilde: 'Mercell',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab', 'Snekker'],
    status: 'vunnet',
    verdi_estimert_kr: 7000000,
    verdi_levert_kr: 6800000,
    frist: '2025-12-15',
    innkommende: '2025-11-01',
    levert: '2025-11-28',
    avgjort: '2025-12-16',
    vinner: '',
    prosjekt_id: 'PRJ-FR-2026-001',
    ai_score: 92,
    ai_vurdering: { fag_match: 95, kunde_historikk: 88, konkurransebilde: 85, margin_potensial: 90, kapasitet: 100 },
    ai_kommentar: 'Sterk match. Kjent kunde, kjent ramme, fagkombinasjon i kjernevirksomhet. Forventet 3-4 konkurrenter.',
    kalkulasjon: {
      materiell_kr: 2400000, lonn_kr: 3000000, ue_kr: 800000, admin_kr: 200000,
      risiko_kr: 100000, margin_kr: 300000, margin_pct: 4.4, timer_estimert: 2400,
    },
    konkurrenter: [
      { navn: "Snekker'n AS",     sannsynlighet: 'Høy', historikk: '4 anbud · 1 vunnet' },
      { navn: 'Hammeron Bygg',     sannsynlighet: 'Mid', historikk: '2 anbud · 0 vunnet' },
      { navn: 'JN Tømrer',         sannsynlighet: 'Lav', historikk: 'Sjelden i denne ramme' },
    ],
    faser: [
      { fase: 'Varsel mottatt',         start: '2025-11-01', slutt: '2025-11-01', status: 'completed', ansvarlig: 'Auto · Mercell' },
      { fase: 'Vurdering / AI-screening', start: '2025-11-01', slutt: '2025-11-03', status: 'completed', ansvarlig: 'Lars (kalkulator)' },
      { fase: 'Go / No-Go beslutning',   start: '2025-11-04', slutt: '2025-11-04', status: 'completed', ansvarlig: 'Brynjar Storvik (DL)' },
      { fase: 'Kalkulasjon',             start: '2025-11-05', slutt: '2025-11-26', status: 'completed', ansvarlig: 'Lars + Marius' },
      { fase: 'Tilbud levert',           start: '2025-11-28', slutt: '2025-11-28', status: 'completed', ansvarlig: 'Lars · via Mercell' },
      { fase: 'Pending avgjørelse',      start: '2025-11-28', slutt: '2025-12-15', status: 'completed', ansvarlig: 'Bodø kommune' },
      { fase: 'Vunnet',                  start: '2025-12-16', slutt: '2025-12-16', status: 'completed', ansvarlig: 'Bodø kommune' },
      { fase: 'Kontrakt → Prosjekt',     start: '2026-01-05', slutt: '2026-01-05', status: 'completed', ansvarlig: 'Brynjar Storvik' },
    ],
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: 'AN-2025-014_konkurransegrunnlag.pdf', kilde: 'Mercell' },
      { type: 'Tegninger',           navn: 'A1_tegninger_R4.pdf',                kilde: 'Mercell' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Fritzoe_AN-2025-014.pdf',     kilde: 'Holte SmartKalk' },
      { type: 'Kontrakt',            navn: 'Kontrakt_BodoKommune_2025-014.pdf',  kilde: 'Vunnet · BoKom' },
    ],
  },
  {
    id: 'AN-2026-005',
    selskap_id: 'byggmester-fritzoe',
    tittel: 'Skarmoen barnehage — byggeteknisk rehab',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    kilde: 'Mercell',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab'],
    status: 'vunnet',
    verdi_estimert_kr: 5000000,
    verdi_levert_kr: 4800000,
    frist: '2026-01-15',
    innkommende: '2025-12-01',
    levert: '2026-01-10',
    avgjort: '2026-01-20',
    vinner: '',
    prosjekt_id: 'PRJ-FR-2026-002',
    ai_score: 88,
    ai_vurdering: { fag_match: 92, kunde_historikk: 88, konkurransebilde: 75, margin_potensial: 86, kapasitet: 95 },
    ai_kommentar: 'God match. Større volum enn snitt. Kapasitet utfordring hvis vi også vinner Aspåsen.',
    kalkulasjon: {
      materiell_kr: 1500000, lonn_kr: 2400000, ue_kr: 600000, admin_kr: 180000,
      risiko_kr: 120000, margin_kr: 0, margin_pct: 0, timer_estimert: 1900,
    },
    konkurrenter: [
      { navn: "Snekker'n AS",     sannsynlighet: 'Høy', historikk: '4 anbud · 1 vunnet' },
      { navn: 'Bodø Bygg & Rehab', sannsynlighet: 'Mid', historikk: '3 anbud · 1 vunnet' },
    ],
    faser: [
      { fase: 'Varsel mottatt',         start: '2025-12-01', slutt: '2025-12-01', status: 'completed', ansvarlig: 'Auto · Mercell' },
      { fase: 'Vurdering / AI-screening', start: '2025-12-01', slutt: '2025-12-03', status: 'completed', ansvarlig: 'Lars (kalkulator)' },
      { fase: 'Go / No-Go beslutning',   start: '2025-12-04', slutt: '2025-12-04', status: 'completed', ansvarlig: 'Brynjar Storvik (DL)' },
      { fase: 'Kalkulasjon',             start: '2025-12-05', slutt: '2026-01-08', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Tilbud levert',           start: '2026-01-10', slutt: '2026-01-10', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Pending avgjørelse',      start: '2026-01-10', slutt: '2026-01-20', status: 'completed', ansvarlig: 'Bodø kommune' },
      { fase: 'Vunnet',                  start: '2026-01-20', slutt: '2026-01-20', status: 'completed', ansvarlig: 'Bodø kommune' },
      { fase: 'Kontrakt → Prosjekt',     start: '2026-02-01', slutt: '2026-02-12', status: 'completed', ansvarlig: 'Brynjar Storvik' },
    ],
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: 'AN-2026-005_grunnlag.pdf', kilde: 'Mercell' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Fritzoe_AN-2026-005.pdf', kilde: 'Holte SmartKalk' },
      { type: 'Kontrakt',            navn: 'Kontrakt_Skarmoen.pdf', kilde: 'Vunnet · BoKom' },
    ],
  },
  {
    id: 'AN-2026-PEND-001',
    selskap_id: 'byggmester-fritzoe',
    tittel: 'Bodin vgs — innvendig rehab',
    kunde: 'Nordland fylkeskommune',
    ramme: 'Bygg-rehab fylke 2025-28',
    kilde: 'TendSign',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab', 'Maler'],
    status: 'pending',
    verdi_estimert_kr: 3200000,
    verdi_levert_kr: 3050000,
    frist: '2026-05-15',
    innkommende: '2026-04-02',
    levert: '2026-04-28',
    avgjort: null,
    vinner: '',
    prosjekt_id: null,
    ai_score: 87,
    ai_vurdering: { fag_match: 88, kunde_historikk: 75, konkurransebilde: 80, margin_potensial: 90, kapasitet: 92 },
    ai_kommentar: 'God fag-fit, men ny kunde. Areal kan ta maler-pakken som UE-andel.',
    kalkulasjon: {
      materiell_kr: 1050000, lonn_kr: 1300000, ue_kr: 480000, admin_kr: 110000,
      risiko_kr: 60000, margin_kr: 50000, margin_pct: 1.6, timer_estimert: 1100,
    },
    konkurrenter: [
      { navn: 'Skotterud Entreprenør', sannsynlighet: 'Mid', historikk: '2 anbud · 1 vunnet' },
      { navn: 'NLB Bygg',              sannsynlighet: 'Lav', historikk: 'Sjelden hos fylke' },
    ],
    faser: [
      { fase: 'Varsel mottatt',         start: '2026-04-02', slutt: '2026-04-02', status: 'completed', ansvarlig: 'Auto · TendSign' },
      { fase: 'Vurdering / AI-screening', start: '2026-04-02', slutt: '2026-04-05', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Go / No-Go beslutning',   start: '2026-04-06', slutt: '2026-04-06', status: 'completed', ansvarlig: 'Brynjar Storvik' },
      { fase: 'Kalkulasjon',             start: '2026-04-07', slutt: '2026-04-26', status: 'completed', ansvarlig: 'Lars + Areal-bidrag' },
      { fase: 'Tilbud levert',           start: '2026-04-28', slutt: '2026-04-28', status: 'completed', ansvarlig: 'Lars · via TendSign' },
      { fase: 'Pending avgjørelse',      start: '2026-04-28', slutt: '2026-05-15', status: 'in_progress', ansvarlig: 'Nordland fylkeskommune' },
      { fase: 'Vunnet / Tapt',           start: null,          slutt: '2026-05-20', status: 'planned',   ansvarlig: 'Nordland fylkeskommune' },
    ],
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: 'TS-2026-Bodin.pdf', kilde: 'TendSign' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Fritzoe_Bodin.pdf', kilde: 'Holte SmartKalk' },
    ],
  },
  {
    id: 'AN-2026-PEND-002',
    selskap_id: 'byggmester-fritzoe',
    tittel: 'Forsvarsbygg Bodøsjøen — bolig 27',
    kunde: 'Forsvarsbygg',
    ramme: 'Salten rammeavtale 2024-28',
    kilde: 'Mercell',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab', 'Snekker'],
    status: 'pending',
    verdi_estimert_kr: 4400000,
    verdi_levert_kr: 4250000,
    frist: '2026-05-22',
    innkommende: '2026-04-08',
    levert: '2026-05-05',
    avgjort: null,
    vinner: '',
    prosjekt_id: null,
    ai_score: 94,
    ai_vurdering: { fag_match: 96, kunde_historikk: 95, konkurransebilde: 90, margin_potensial: 92, kapasitet: 88 },
    ai_kommentar: 'Veldig sterk match. Vunnet 3 av 4 siste hos Forsvarsbygg Bodøsjøen. Kapasitet er tett — krever oppstart august.',
    kalkulasjon: {
      materiell_kr: 1450000, lonn_kr: 1900000, ue_kr: 500000, admin_kr: 180000,
      risiko_kr: 80000, margin_kr: 140000, margin_pct: 3.3, timer_estimert: 1500,
    },
    konkurrenter: [
      { navn: 'NLB Bygg',           sannsynlighet: 'Mid', historikk: '5 anbud · 2 vunnet' },
      { navn: 'Skotterud Entreprenør', sannsynlighet: 'Lav', historikk: 'Sjelden Forsvarsbygg' },
    ],
    faser: [
      { fase: 'Varsel mottatt',         start: '2026-04-08', slutt: '2026-04-08', status: 'completed', ansvarlig: 'Auto · Mercell' },
      { fase: 'Vurdering / AI-screening', start: '2026-04-08', slutt: '2026-04-10', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Go / No-Go beslutning',   start: '2026-04-11', slutt: '2026-04-11', status: 'completed', ansvarlig: 'Brynjar Storvik' },
      { fase: 'Kalkulasjon',             start: '2026-04-12', slutt: '2026-05-03', status: 'completed', ansvarlig: 'Lars + Marius' },
      { fase: 'Tilbud levert',           start: '2026-05-05', slutt: '2026-05-05', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Pending avgjørelse',      start: '2026-05-05', slutt: '2026-05-22', status: 'in_progress', ansvarlig: 'Forsvarsbygg' },
      { fase: 'Vunnet / Tapt',           start: null,          slutt: '2026-05-30', status: 'planned',   ansvarlig: 'Forsvarsbygg' },
    ],
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: 'Mercell-FB-Bolig27.pdf', kilde: 'Mercell' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Fritzoe_Bolig27.pdf', kilde: 'Holte SmartKalk' },
    ],
  },
  {
    id: 'AN-2025-LOST-001',
    selskap_id: 'byggmester-fritzoe',
    tittel: 'Tverlandet skole — parkettlegging',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    kilde: 'Mercell',
    type: 'Mini-konkurranse',
    fag: ['Snekker'],
    status: 'tapt',
    verdi_estimert_kr: 700000,
    verdi_levert_kr: 685000,
    frist: '2025-11-15',
    innkommende: '2025-10-15',
    levert: '2025-11-08',
    avgjort: '2025-11-22',
    vinner: "Snekker'n AS",
    prosjekt_id: null,
    ai_score: 65,
    ai_vurdering: { fag_match: 80, kunde_historikk: 88, konkurransebilde: 45, margin_potensial: 60, kapasitet: 90 },
    ai_kommentar: 'Lite anbud, sterk konkurranse fra spesialist. Kalkylebufferen for høy — Snekker\'n vant med 6,5 % lavere pris.',
    kalkulasjon: {
      materiell_kr: 240000, lonn_kr: 320000, ue_kr: 0, admin_kr: 60000,
      risiko_kr: 35000, margin_kr: 30000, margin_pct: 4.4, timer_estimert: 240,
    },
    konkurrenter: [
      { navn: "Snekker'n AS",     sannsynlighet: 'Høy', historikk: '5 anbud · 3 vunnet · spesialist' },
      { navn: 'Bodø Snekker',     sannsynlighet: 'Mid', historikk: '2 anbud · 0 vunnet' },
    ],
    faser: [
      { fase: 'Varsel mottatt',         start: '2025-10-15', slutt: '2025-10-15', status: 'completed', ansvarlig: 'Auto · Mercell' },
      { fase: 'Vurdering / AI-screening', start: '2025-10-15', slutt: '2025-10-17', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Go / No-Go beslutning',   start: '2025-10-18', slutt: '2025-10-18', status: 'completed', ansvarlig: 'Brynjar Storvik' },
      { fase: 'Kalkulasjon',             start: '2025-10-19', slutt: '2025-11-06', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Tilbud levert',           start: '2025-11-08', slutt: '2025-11-08', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Pending avgjørelse',      start: '2025-11-08', slutt: '2025-11-22', status: 'completed', ansvarlig: 'Bodø kommune' },
      { fase: 'Tapt',                    start: '2025-11-22', slutt: '2025-11-22', status: 'completed', ansvarlig: "Snekker'n AS vant" },
    ],
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: 'Mercell-Tverlandet.pdf', kilde: 'Mercell' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Tverlandet.pdf', kilde: 'Holte SmartKalk' },
      { type: 'Læringspunkt',        navn: 'Tap_2025_Q4_analyse.md', kilde: 'Internt' },
    ],
  },

  // ===================================================================
  // Areal Byggservice — Bodø
  // ===================================================================
  {
    id: 'AN-2025-019',
    selskap_id: 'areal-byggservice',
    tittel: 'Bodø rådhus — innvendig maling 3. etg',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    kilde: 'Mercell',
    type: 'Mini-konkurranse',
    fag: ['Maler'],
    status: 'vunnet',
    verdi_estimert_kr: 900000,
    verdi_levert_kr: 850000,
    frist: '2025-09-24',
    innkommende: '2025-08-20',
    levert: '2025-09-18',
    avgjort: '2025-09-26',
    vinner: '',
    prosjekt_id: 'PRJ-AR-2026-001',
    ai_score: 94,
    ai_vurdering: { fag_match: 100, kunde_historikk: 92, konkurransebilde: 88, margin_potensial: 92, kapasitet: 96 },
    ai_kommentar: 'Perfekt fag-fit (ren maler). Areal har vunnet 6 av 8 maler-anbud hos Bodø kommune siste 12 mnd.',
    kalkulasjon: {
      materiell_kr: 240000, lonn_kr: 460000, ue_kr: 0, admin_kr: 50000,
      risiko_kr: 15000, margin_kr: 85000, margin_pct: 10.0, timer_estimert: 730,
    },
    konkurrenter: [
      { navn: 'Bodø Malermester', sannsynlighet: 'Høy', historikk: '6 anbud · 1 vunnet' },
      { navn: 'Nord-Norsk Maler', sannsynlighet: 'Mid', historikk: '3 anbud · 0 vunnet' },
    ],
    faser: [
      { fase: 'Varsel mottatt',         start: '2025-08-20', slutt: '2025-08-20', status: 'completed', ansvarlig: 'Auto · Mercell' },
      { fase: 'Vurdering / AI-screening', start: '2025-08-20', slutt: '2025-08-22', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Go / No-Go beslutning',   start: '2025-08-23', slutt: '2025-08-23', status: 'completed', ansvarlig: 'Brynjar Storvik (DL)' },
      { fase: 'Kalkulasjon',             start: '2025-08-25', slutt: '2025-09-15', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Tilbud levert',           start: '2025-09-18', slutt: '2025-09-18', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Pending avgjørelse',      start: '2025-09-18', slutt: '2025-09-26', status: 'completed', ansvarlig: 'Bodø kommune' },
      { fase: 'Vunnet',                  start: '2025-09-26', slutt: '2025-09-26', status: 'completed', ansvarlig: 'Bodø kommune' },
      { fase: 'Kontrakt → Prosjekt',     start: '2025-12-15', slutt: '2026-01-05', status: 'completed', ansvarlig: 'Brynjar Storvik' },
    ],
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: 'Mercell-Radhus-3etg.pdf', kilde: 'Mercell' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Areal_AN-2025-019.pdf', kilde: 'Holte SmartKalk' },
      { type: 'Kontrakt',            navn: 'Kontrakt_Areal_Radhus3.pdf', kilde: 'Vunnet · BoKom' },
    ],
  },
  {
    id: 'AN-2026-PEND-AR-001',
    selskap_id: 'areal-byggservice',
    tittel: 'Stordalshallen — innvendig maling',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    kilde: 'Mercell',
    type: 'Mini-konkurranse',
    fag: ['Maler'],
    status: 'pending',
    verdi_estimert_kr: 1300000,
    verdi_levert_kr: 1280000,
    frist: '2026-05-12',
    innkommende: '2026-04-04',
    levert: '2026-04-30',
    avgjort: null,
    vinner: '',
    prosjekt_id: null,
    ai_score: 95,
    ai_vurdering: { fag_match: 100, kunde_historikk: 92, konkurransebilde: 90, margin_potensial: 95, kapasitet: 88 },
    ai_kommentar: 'Sterk match. Areal har erfaring med tilsvarende hall (Mørkvedhallen) — kalkyle nøyaktig.',
    kalkulasjon: {
      materiell_kr: 360000, lonn_kr: 720000, ue_kr: 0, admin_kr: 80000,
      risiko_kr: 35000, margin_kr: 85000, margin_pct: 6.6, timer_estimert: 1100,
    },
    konkurrenter: [
      { navn: 'Bodø Malermester', sannsynlighet: 'Høy', historikk: '6 anbud · 1 vunnet' },
    ],
    faser: [
      { fase: 'Varsel mottatt',         start: '2026-04-04', slutt: '2026-04-04', status: 'completed', ansvarlig: 'Auto · Mercell' },
      { fase: 'Vurdering / AI-screening', start: '2026-04-04', slutt: '2026-04-06', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Go / No-Go beslutning',   start: '2026-04-07', slutt: '2026-04-07', status: 'completed', ansvarlig: 'Brynjar Storvik' },
      { fase: 'Kalkulasjon',             start: '2026-04-08', slutt: '2026-04-28', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Tilbud levert',           start: '2026-04-30', slutt: '2026-04-30', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Pending avgjørelse',      start: '2026-04-30', slutt: '2026-05-12', status: 'in_progress', ansvarlig: 'Bodø kommune' },
      { fase: 'Vunnet / Tapt',           start: null,          slutt: '2026-05-20', status: 'planned',   ansvarlig: 'Bodø kommune' },
    ],
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: 'Mercell-Stordalshallen.pdf', kilde: 'Mercell' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Areal_Stordal.pdf', kilde: 'Holte SmartKalk' },
    ],
  },
  {
    id: 'AN-2025-LOST-AR-001',
    selskap_id: 'areal-byggservice',
    tittel: 'Saltstraumen barneskole — utvendig maling',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    kilde: 'Mercell',
    type: 'Mini-konkurranse',
    fag: ['Maler'],
    status: 'tapt',
    verdi_estimert_kr: 850000,
    verdi_levert_kr: 820000,
    frist: '2025-10-12',
    innkommende: '2025-09-10',
    levert: '2025-10-04',
    avgjort: '2025-10-18',
    vinner: 'Nord-Norsk Maler',
    prosjekt_id: null,
    ai_score: 78,
    ai_vurdering: { fag_match: 100, kunde_historikk: 92, konkurransebilde: 50, margin_potensial: 60, kapasitet: 95 },
    ai_kommentar: 'Tapt på pris. Vår margin 9 % vs vinner 4 %. Vurder margin-grense for utvendig sesongarbeid.',
    kalkulasjon: {
      materiell_kr: 280000, lonn_kr: 420000, ue_kr: 0, admin_kr: 70000,
      risiko_kr: 30000, margin_kr: 20000, margin_pct: 2.4, timer_estimert: 670,
    },
    konkurrenter: [
      { navn: 'Nord-Norsk Maler', sannsynlighet: 'Mid', historikk: '3 anbud · 1 vunnet · agresiv pris' },
      { navn: 'Bodø Malermester', sannsynlighet: 'Høy', historikk: '6 anbud · 1 vunnet' },
    ],
    faser: [
      { fase: 'Varsel mottatt',         start: '2025-09-10', slutt: '2025-09-10', status: 'completed', ansvarlig: 'Auto · Mercell' },
      { fase: 'Vurdering / AI-screening', start: '2025-09-10', slutt: '2025-09-12', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Go / No-Go beslutning',   start: '2025-09-13', slutt: '2025-09-13', status: 'completed', ansvarlig: 'Brynjar Storvik' },
      { fase: 'Kalkulasjon',             start: '2025-09-15', slutt: '2025-10-02', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Tilbud levert',           start: '2025-10-04', slutt: '2025-10-04', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Pending avgjørelse',      start: '2025-10-04', slutt: '2025-10-18', status: 'completed', ansvarlig: 'Bodø kommune' },
      { fase: 'Tapt',                    start: '2025-10-18', slutt: '2025-10-18', status: 'completed', ansvarlig: 'Nord-Norsk Maler vant' },
    ],
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: 'Mercell-Saltstraumen.pdf', kilde: 'Mercell' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Areal_Saltstraumen.pdf', kilde: 'Holte SmartKalk' },
      { type: 'Læringspunkt',        navn: 'Tap_Q4_2025_pris-analyse.md', kilde: 'Internt' },
    ],
  },

  // ===================================================================
  // Braa og Sørvåg Bygg — Trondheim
  // ===================================================================
  {
    id: 'BS-2026-009',
    selskap_id: 'braa-sorvaag-bygg',
    tittel: 'Lade barnehage — byggeteknisk rehab',
    kunde: 'Trondheim kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    kilde: 'Mercell',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab'],
    status: 'vunnet',
    verdi_estimert_kr: 5200000,
    verdi_levert_kr: 4800000,
    frist: '2026-04-15',
    innkommende: '2026-02-15',
    levert: '2026-04-10',
    avgjort: '2026-04-18',
    vinner: '',
    prosjekt_id: 'PRJ-BS-2026-001',
    ai_score: 78,
    ai_vurdering: { fag_match: 92, kunde_historikk: 70, konkurransebilde: 65, margin_potensial: 75, kapasitet: 88 },
    ai_kommentar: 'God fag-fit, men aggressiv konkurranse. Vunnet med tynn margin — krever streng oppfølging.',
    kalkulasjon: {
      materiell_kr: 1500000, lonn_kr: 2400000, ue_kr: 600000, admin_kr: 200000,
      risiko_kr: 100000, margin_kr: 0, margin_pct: 0, timer_estimert: 2100,
    },
    konkurrenter: [
      { navn: 'Byggmester Knudsen',    sannsynlighet: 'Høy', historikk: '8 anbud · 4 vunnet' },
      { navn: 'Modulvegger Trøndelag', sannsynlighet: 'Høy', historikk: '6 anbud · 2 vunnet' },
      { navn: 'Snekkerverk Trondheim', sannsynlighet: 'Mid', historikk: '4 anbud · 1 vunnet' },
    ],
    faser: [
      { fase: 'Varsel mottatt',         start: '2026-02-15', slutt: '2026-02-15', status: 'completed', ansvarlig: 'Auto · Mercell' },
      { fase: 'Vurdering / AI-screening', start: '2026-02-15', slutt: '2026-02-18', status: 'completed', ansvarlig: 'Sigurd K. (kalkulator)' },
      { fase: 'Go / No-Go beslutning',   start: '2026-02-19', slutt: '2026-02-19', status: 'completed', ansvarlig: 'Øyvind Berggren (DL)' },
      { fase: 'Kalkulasjon',             start: '2026-02-22', slutt: '2026-04-08', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Tilbud levert',           start: '2026-04-10', slutt: '2026-04-10', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Pending avgjørelse',      start: '2026-04-10', slutt: '2026-04-18', status: 'completed', ansvarlig: 'Trondheim kommune' },
      { fase: 'Vunnet',                  start: '2026-04-18', slutt: '2026-04-18', status: 'completed', ansvarlig: 'Trondheim kommune' },
      { fase: 'Kontrakt → Prosjekt',     start: '2026-04-25', slutt: '2026-05-10', status: 'completed', ansvarlig: 'Øyvind Berggren' },
    ],
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: 'Mercell-Lade.pdf', kilde: 'Mercell' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Braa_Lade.pdf', kilde: 'Holte SmartKalk' },
      { type: 'Kontrakt',            navn: 'Kontrakt_Braa_Lade.pdf', kilde: 'Vunnet · Trondheim kommune' },
    ],
  },
  {
    id: 'BS-2026-PEND-001',
    selskap_id: 'braa-sorvaag-bygg',
    tittel: 'Strinda vgs — biologirommet ombygging',
    kunde: 'Trøndelag fylkeskommune',
    ramme: 'Bygg-rehab fylke 2024-28',
    kilde: 'Mercell',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab'],
    status: 'pending',
    verdi_estimert_kr: 2300000,
    verdi_levert_kr: 2180000,
    frist: '2026-05-10',
    innkommende: '2026-03-25',
    levert: '2026-04-26',
    avgjort: null,
    vinner: '',
    prosjekt_id: null,
    ai_score: 82,
    ai_vurdering: { fag_match: 88, kunde_historikk: 78, konkurransebilde: 70, margin_potensial: 80, kapasitet: 95 },
    ai_kommentar: 'God fit. Trøndelag fylke har tre vunne anbud i porteføljen — rammeavtale-bonus.',
    kalkulasjon: {
      materiell_kr: 720000, lonn_kr: 1100000, ue_kr: 250000, admin_kr: 90000,
      risiko_kr: 70000, margin_kr: 50000, margin_pct: 2.3, timer_estimert: 950,
    },
    konkurrenter: [
      { navn: 'Modulvegger Trøndelag', sannsynlighet: 'Høy', historikk: '6 anbud · 2 vunnet' },
      { navn: 'Trønder-Bygg',          sannsynlighet: 'Mid', historikk: '3 anbud · 0 vunnet' },
    ],
    faser: [
      { fase: 'Varsel mottatt',         start: '2026-03-25', slutt: '2026-03-25', status: 'completed', ansvarlig: 'Auto · Mercell' },
      { fase: 'Vurdering / AI-screening', start: '2026-03-25', slutt: '2026-03-27', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Go / No-Go beslutning',   start: '2026-03-28', slutt: '2026-03-28', status: 'completed', ansvarlig: 'Øyvind Berggren' },
      { fase: 'Kalkulasjon',             start: '2026-03-30', slutt: '2026-04-24', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Tilbud levert',           start: '2026-04-26', slutt: '2026-04-26', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Pending avgjørelse',      start: '2026-04-26', slutt: '2026-05-10', status: 'in_progress', ansvarlig: 'Trøndelag fylkeskommune' },
      { fase: 'Vunnet / Tapt',           start: null,          slutt: '2026-05-20', status: 'planned',   ansvarlig: 'Trøndelag fylkeskommune' },
    ],
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: 'Mercell-Strinda.pdf', kilde: 'Mercell' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Braa_Strinda.pdf', kilde: 'Holte SmartKalk' },
    ],
  },
  {
    id: 'BS-FORS-2026-001',
    selskap_id: 'braa-sorvaag-bygg',
    tittel: 'Vannskade Strindveien 102 — innvendig rehab',
    kunde: 'Gjensidige Forsikring',
    ramme: 'SA Forsikring-distribusjon',
    kilde: 'SA Forsikring',
    type: 'Forsikringsoppdrag',
    fag: ['Bygg-rehab', 'Snekker'],
    status: 'pending',
    verdi_estimert_kr: 480000,
    verdi_levert_kr: 460000,
    frist: '2026-05-02',
    innkommende: '2026-04-25',
    levert: '2026-04-30',
    avgjort: null,
    vinner: '',
    prosjekt_id: null,
    ai_score: 91,
    ai_vurdering: { fag_match: 90, kunde_historikk: 100, konkurransebilde: 100, margin_potensial: 88, kapasitet: 75 },
    ai_kommentar: 'Single-source via SA-distribusjon — ingen konkurranse. Kapasitet er stram (Lade-prosjekt aktivt).',
    kalkulasjon: {
      materiell_kr: 140000, lonn_kr: 220000, ue_kr: 50000, admin_kr: 30000,
      risiko_kr: 10000, margin_kr: 10000, margin_pct: 2.2, timer_estimert: 280,
    },
    konkurrenter: [],
    faser: [
      { fase: 'Varsel mottatt',         start: '2026-04-25', slutt: '2026-04-25', status: 'completed', ansvarlig: 'Auto · SA Forsikring' },
      { fase: 'Vurdering / AI-screening', start: '2026-04-25', slutt: '2026-04-26', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Go / No-Go beslutning',   start: '2026-04-27', slutt: '2026-04-27', status: 'completed', ansvarlig: 'Øyvind Berggren' },
      { fase: 'Kalkulasjon',             start: '2026-04-28', slutt: '2026-04-29', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Tilbud levert',           start: '2026-04-30', slutt: '2026-04-30', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Pending avgjørelse',      start: '2026-04-30', slutt: '2026-05-02', status: 'in_progress', ansvarlig: 'Gjensidige' },
      { fase: 'Vunnet / Tapt',           start: null,          slutt: '2026-05-05', status: 'planned',   ansvarlig: 'Gjensidige' },
    ],
    dokumenter: [
      { type: 'Skadeskjema',         navn: 'Gjensidige-Strindveien102.pdf', kilde: 'SA Forsikring' },
      { type: 'Vårt tilbud',         navn: 'Tilbud_Braa_Strindveien.pdf', kilde: 'Holte SmartKalk' },
    ],
  },
];

// =====================================================================
// Legacy seed — alle anbud-IDene fra anbud.html og anbud-trondheim.html.
// Disse blir konvertert til full struktur on-the-fly via buildAnbudFromLegacy
// slik at drill-down virker selv uten håndskrevet rik detalj.
// =====================================================================
const LEGACY_ANBUD_SEED = [
  // Bodø — fra anbud.html. selskap mappes via _bodo (Fritzøe/Areal/Kombinert).
  { id: 'AN-2025-015', _bodo: 'Fritzøe',   tittel: 'Bodø sentralfengsel — cellerehab fløy A',     kunde: 'Statsbygg',                  ramme: '—',                                  type: 'Hovedanbud',      fag: ['Bygg-rehab','Total-rehab'],          verdi: 12500000, frist: '2025-08-15', resultat: 'Tapt',    vinner: 'Backe Nord' },
  { id: 'AN-2025-016', _bodo: 'Areal',     tittel: 'Stordalshallen — innvendig maling',           kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Maler'],                            verdi: 1200000,  frist: '2025-08-22', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2025-017', _bodo: 'Kombinert', tittel: 'Hunstad ungdomsskole — garderoberehab',       kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Bygg-rehab','Snekker','Maler'],     verdi: 3800000,  frist: '2025-09-05', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2025-018', _bodo: 'Fritzøe',   tittel: 'Aspåsen skole — tak og taksrenner',           kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Tak'],                              verdi: 4200000,  frist: '2025-09-12', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2025-020', _bodo: 'Kombinert', tittel: 'Nordlandssykehuset — dagkirurgisk rehab',     kunde: 'Helse Nord',                 ramme: 'Bygg-rehab Helse Nord 2025-29',      type: 'Hovedanbud',      fag: ['Total-rehab','Bygg-rehab','Maler'], verdi: 18500000, frist: '2025-10-08', resultat: 'Tapt',    vinner: 'Veidekke Bygg Nord' },
  { id: 'AN-2025-021', _bodo: 'Fritzøe',   tittel: 'Bodø lufthavn — terminalrehab fase 2',        kunde: 'Avinor',                     ramme: '—',                                  type: 'Hovedanbud',      fag: ['Bygg-rehab'],                       verdi: 22000000, frist: '2025-10-15', resultat: 'Tapt',    vinner: 'Consto Anlegg Nord' },
  { id: 'AN-2025-022', _bodo: 'Kombinert', tittel: 'Mørkved barnehage — vindusutskifting',        kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Vinduer','Snekker'],                verdi: 1900000,  frist: '2025-10-28', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2025-023', _bodo: 'Kombinert', tittel: 'Forsvarsbygg Bodøsjøen — kontorrehab',        kunde: 'Forsvarsbygg',               ramme: 'Salten rammeavtale 2024-28',         type: 'Mini-konkurranse', fag: ['Bygg-rehab','Snekker','Maler'],     verdi: 5400000,  frist: '2025-11-05', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2025-024', _bodo: 'Areal',     tittel: 'Tverlandet skole — parkettlegging',           kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Snekker'],                          verdi: 650000,   frist: '2025-11-15', resultat: 'Tapt',    vinner: "Snekker'n AS" },
  { id: 'AN-2025-025', _bodo: 'Fritzøe',   tittel: 'Heggmoen skytebane — klubbhus',               kunde: 'Forsvarsbygg',               ramme: 'Salten rammeavtale 2024-28',         type: 'Mini-konkurranse', fag: ['Bygg-rehab'],                       verdi: 2200000,  frist: '2025-11-22', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2025-026', _bodo: 'Areal',     tittel: 'Mørkvedhallen — innvendig oppussing',         kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Maler','Snekker'],                  verdi: 1400000,  frist: '2025-12-04', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2025-027', _bodo: 'Fritzøe',   tittel: 'Bodø havn — fasaderehab adminbygg',           kunde: 'Bodø Havn KF',               ramme: '—',                                  type: 'Hovedanbud',      fag: ['Fasade'],                           verdi: 8900000,  frist: '2025-12-12', resultat: 'Tapt',    vinner: 'Fasaderenovering AS' },
  { id: 'AN-2025-028', _bodo: 'Kombinert', tittel: 'Saltstraumen brygge — kafé-rehab',            kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Total-rehab','Snekker','Maler'],    verdi: 2800000,  frist: '2025-12-20', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2026-001', _bodo: 'Kombinert', tittel: 'Nordlandssykehuset — personalkantine',        kunde: 'Helse Nord',                 ramme: 'Bygg-rehab Helse Nord 2025-29',      type: 'Mini-konkurranse', fag: ['Bygg-rehab','Snekker'],             verdi: 3200000,  frist: '2026-01-15', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2026-002', _bodo: 'Areal',     tittel: 'Bankgata skole — maling fløy A',              kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Maler'],                            verdi: 950000,   frist: '2026-01-28', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2026-003', _bodo: 'Fritzøe',   tittel: 'Politihuset Bodø — vinduer 1.-3. etg',        kunde: 'Statsbygg',                  ramme: '—',                                  type: 'Hovedanbud',      fag: ['Vinduer'],                          verdi: 6500000,  frist: '2026-02-08', resultat: 'Tapt',    vinner: 'NCC Building' },
  { id: 'AN-2026-004', _bodo: 'Areal',     tittel: 'Hunstad bibliotek — innvendig oppussing',     kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Maler','Snekker'],                  verdi: 1100000,  frist: '2026-02-19', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2026-006', _bodo: 'Kombinert', tittel: 'Bodø vgs — garderobeanlegg ombygging',        kunde: 'Nordland fylkeskommune',     ramme: 'Bygg-rehab fylke 2025-28',           type: 'Hovedanbud',      fag: ['Total-rehab','Bygg-rehab','Snekker','Maler'], verdi: 14200000, frist: '2026-03-18', resultat: 'Pending', vinner: '' },
  { id: 'AN-2026-007', _bodo: 'Fritzøe',   tittel: 'Sølvsuper helsesenter — tak og takvinduer',   kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Tak','Vinduer'],                    verdi: 2600000,  frist: '2026-04-02', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2026-008', _bodo: 'Areal',     tittel: 'Bodø sykehjem — korridormaling',              kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Maler'],                            verdi: 700000,   frist: '2026-04-15', resultat: 'Vunnet',  vinner: '' },
  { id: 'AN-2026-009', _bodo: 'Kombinert', tittel: 'Forsvarsbygg Bodøsjøen — boligrehab fase 1',  kunde: 'Forsvarsbygg',               ramme: 'Salten rammeavtale 2024-28',         type: 'Hovedanbud',      fag: ['Total-rehab','Bygg-rehab','Maler','Snekker'], verdi: 28000000, frist: '2026-04-23', resultat: 'Pending', vinner: '' },
  { id: 'AN-2026-010', _bodo: 'Areal',     tittel: 'Mørkved senior — utvendig maling',            kunde: 'Bodø kommune',               ramme: 'Bygg-vedlikehold 2024-27',           type: 'Mini-konkurranse', fag: ['Maler'],                            verdi: 1600000,  frist: '2026-04-30', resultat: 'Pending', vinner: '' },

  // Trondheim — alle → braa-sorvaag-bygg
  { id: 'BS-2025-018', _t: true, tittel: 'Charlottenlund vgs — garderobe og dusj',           kunde: 'Trøndelag fylkeskommune', ramme: 'Bygg-rehab fylke 2024-28',     type: 'Mini-konkurranse', fag: ['Bygg-rehab','Snekker'],         verdi: 3400000, frist: '2025-08-12', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2025-019', _t: true, tittel: 'Trondheim rådhus — innvendig maling 4. etg',       kunde: 'Trondheim kommune',       ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Maler'],                        verdi: 850000,  frist: '2025-08-22', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2025-020', _t: true, tittel: 'Sjøgangen barnehage — tak',                        kunde: 'Trondheim kommune',       ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Tak'],                          verdi: 1100000, frist: '2025-09-04', resultat: 'Tapt',   vinner: 'Norsk Bygg & Tak AS' },
  { id: 'BS-2025-021', _t: true, tittel: 'St. Olavs Bevegelsessenteret — innvendig rehab',    kunde: 'Helse Midt-Norge',        ramme: 'Bygg-rehab Helse Midt 2023-27', type: 'Hovedanbud',      fag: ['Total-rehab','Bygg-rehab'],      verdi: 5200000, frist: '2025-09-18', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2025-022', _t: true, tittel: 'Bymarka skole — gymsal oppussing',                  kunde: 'Trondheim kommune',       ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Bygg-rehab','Maler'],           verdi: 1600000, frist: '2025-09-26', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2025-023', _t: true, tittel: 'Tinghuset Trondheim — garderoberehab',             kunde: 'Statsbygg',               ramme: '—',                            type: 'Hovedanbud',      fag: ['Bygg-rehab'],                   verdi: 8200000, frist: '2025-10-08', resultat: 'Tapt',   vinner: 'NCC Building' },
  { id: 'BS-2025-024', _t: true, tittel: 'Trondheim rådhus — Bytårnet 5. etg',               kunde: 'Trondheim kommune',       ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Bygg-rehab'],                   verdi: 2100000, frist: '2025-10-15', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2025-025', _t: true, tittel: 'Brundalen omsorgssenter — inngangsparti',           kunde: 'Trondheim Eiendom KF',    ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Bygg-rehab'],                   verdi: 920000,  frist: '2025-10-30', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2025-026', _t: true, tittel: 'Heimdal vgs — innvendig oppussing fløy A',          kunde: 'Trøndelag fylkeskommune', ramme: 'Bygg-rehab fylke 2024-28',     type: 'Mini-konkurranse', fag: ['Maler','Bygg-rehab'],           verdi: 1300000, frist: '2025-11-10', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2025-027', _t: true, tittel: 'Polsken sykehjem — fellesarealer maling',           kunde: 'Trondheim Eiendom KF',    ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Maler'],                        verdi: 680000,  frist: '2025-11-22', resultat: 'Tapt',   vinner: 'Trondheim Maleri AS' },
  { id: 'BS-2025-028', _t: true, tittel: 'Selsbakk skole — dør og vindusutskifting',          kunde: 'Trondheim kommune',       ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Vinduer','Snekker'],            verdi: 4600000, frist: '2025-12-04', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2025-029', _t: true, tittel: 'Lade kirke — tårnrehab',                            kunde: 'Den norske kirke Trondheim', ramme: '—',                          type: 'Hovedanbud',      fag: ['Tak','Bygg-rehab'],             verdi: 6800000, frist: '2025-12-15', resultat: 'Tapt',   vinner: 'Trondheim Bygg AS' },
  { id: 'BS-2025-030', _t: true, tittel: 'Persaunet leir — bolig 8 og 9 vinduer',            kunde: 'Forsvarsbygg',            ramme: 'Salten Trøndelag 2024-28',     type: 'Mini-konkurranse', fag: ['Vinduer'],                      verdi: 2400000, frist: '2025-12-22', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2026-001', _t: true, tittel: 'Tyholt brannstasjon — garderobeombygging',          kunde: 'Trondheim kommune',       ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Bygg-rehab','Snekker'],         verdi: 1900000, frist: '2026-01-18', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2026-002', _t: true, tittel: 'NTNU Gløshaugen — Inst.bygg kontorrehab',           kunde: 'Statsbygg',               ramme: '—',                            type: 'Hovedanbud',      fag: ['Bygg-rehab','Total-rehab'],      verdi: 7800000, frist: '2026-02-03', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2026-003', _t: true, tittel: 'Heimdal vgs — fasaderehab',                         kunde: 'Trøndelag fylkeskommune', ramme: 'Bygg-rehab fylke 2024-28',     type: 'Mini-konkurranse', fag: ['Fasade'],                       verdi: 3100000, frist: '2026-02-12', resultat: 'Tapt',   vinner: 'Trønder Fasade AS' },
  { id: 'BS-2026-004', _t: true, tittel: 'Trondheim havn — administrasjonsbygg fasade',       kunde: 'Trondheim Havn IKS',      ramme: '—',                            type: 'Hovedanbud',      fag: ['Fasade','Bygg-rehab'],          verdi: 8200000, frist: '2026-02-20', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2026-005', _t: true, tittel: 'Persaunet leir — bolig 12 totalrehab',              kunde: 'Forsvarsbygg',            ramme: 'Salten Trøndelag 2024-28',     type: 'Hovedanbud',      fag: ['Total-rehab','Bygg-rehab'],      verdi: 3500000, frist: '2026-03-04', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2026-006', _t: true, tittel: 'Saupstad senter — rehab inngangsparti',             kunde: 'Trondheim Eiendom KF',    ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Bygg-rehab'],                   verdi: 1450000, frist: '2026-03-15', resultat: 'Tapt',   vinner: 'Snekkerverk Trondheim AS' },
  { id: 'BS-2026-007', _t: true, tittel: 'Brundalen omsorgsboliger — innvendig maling',       kunde: 'Trondheim Eiendom KF',    ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Maler'],                        verdi: 1100000, frist: '2026-03-25', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2026-008', _t: true, tittel: 'Adolf Øiens skole — vinduer fløy B',                kunde: 'Trøndelag fylkeskommune', ramme: 'Bygg-rehab fylke 2024-28',     type: 'Mini-konkurranse', fag: ['Vinduer','Snekker'],            verdi: 2800000, frist: '2026-04-08', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2026-010', _t: true, tittel: 'Olavshallen — innvendig oppgradering foaje',        kunde: 'Trondheim Eiendom KF',    ramme: '—',                            type: 'Hovedanbud',      fag: ['Bygg-rehab','Maler'],           verdi: 2400000, frist: '2026-04-22', resultat: 'Vunnet', vinner: '' },
  { id: 'BS-2026-011', _t: true, tittel: 'St. Olavs hospital — Kvinneklinikken vinduer',      kunde: 'Helse Midt-Norge',        ramme: 'Bygg-rehab Helse Midt 2023-27', type: 'Mini-konkurranse', fag: ['Vinduer'],                      verdi: 4200000, frist: '2026-04-28', resultat: 'Pending', vinner: '' },
  { id: 'BS-2026-012', _t: true, tittel: 'Skarvegen senior — utskifting vinduer',             kunde: 'Trondheim Eiendom KF',    ramme: 'Bygg-vedlikehold 2024-27',     type: 'Mini-konkurranse', fag: ['Vinduer'],                      verdi: 1700000, frist: '2026-04-30', resultat: 'Pending', vinner: '' },
];

// Konverterer en legacy-entry til full anbud-struktur med syntetisk lifecycle,
// kalkulasjon og AI-score basert på status.
function buildAnbudFromLegacy(legacy) {
  const selskap_id = legacy._t ? 'braa-sorvaag-bygg'
    : legacy._bodo === 'Areal' ? 'areal-byggservice'
    : 'byggmester-fritzoe';
  const status = ({ Vunnet: 'vunnet', Tapt: 'tapt', Pending: 'pending', Trukket: 'trukket', Utkast: 'pending' })[legacy.resultat] || 'pending';

  const frist = new Date(legacy.frist);
  const innkommendeD = new Date(frist); innkommendeD.setDate(innkommendeD.getDate() - 45);
  const levertD = new Date(frist); levertD.setDate(levertD.getDate() - 5);
  const avgjortD = new Date(frist); avgjortD.setDate(avgjortD.getDate() + 6);
  const iso = (d) => d.toISOString().slice(0, 10);

  const verdi = legacy.verdi || 0;
  const kalkulasjon = {
    materiell_kr: Math.round(verdi * 0.34),
    lonn_kr: Math.round(verdi * 0.50),
    ue_kr: Math.round(verdi * 0.10),
    admin_kr: Math.round(verdi * 0.04),
    risiko_kr: Math.round(verdi * 0.02),
    margin_kr: 0,
    margin_pct: 0,
    timer_estimert: Math.max(1, Math.round(verdi / 1500)),
  };

  const aiByStatus = { vunnet: 84, pending: 78, tapt: 62, trukket: 50 };
  const ai_score = aiByStatus[status] || 75;
  const ai_vurdering = {
    fag_match:        Math.min(100, ai_score + 6),
    kunde_historikk:  ai_score - 4,
    konkurransebilde: ai_score - 8,
    margin_potensial: ai_score,
    kapasitet:        Math.min(100, ai_score + 4),
  };
  const ai_kommentar = status === 'vunnet'
    ? 'Vunnet anbud — historiske data, detaljert AI-screening ikke registrert.'
    : status === 'tapt'
    ? 'Tapt anbud — sannsynlig pris-/konkurransefaktor. Læringspunkter under analyse.'
    : status === 'pending'
    ? 'Levert tilbud, venter på kunde-avgjørelse.'
    : 'Trukket før innlevering.';

  // Lifecycle: 8 faser tilpasset status
  const faser = [
    { fase: 'Varsel mottatt',           start: iso(innkommendeD), slutt: iso(innkommendeD), status: 'completed', ansvarlig: 'Auto · ' + (legacy._t ? 'Mercell' : 'Mercell') },
    { fase: 'Vurdering / AI-screening', start: iso(innkommendeD), slutt: iso(new Date(innkommendeD.getTime() + 2 * 86400000)), status: 'completed', ansvarlig: 'Kalkulator' },
    { fase: 'Go / No-Go beslutning',    start: iso(new Date(innkommendeD.getTime() + 3 * 86400000)), slutt: iso(new Date(innkommendeD.getTime() + 3 * 86400000)), status: 'completed', ansvarlig: 'DL' },
    { fase: 'Kalkulasjon',              start: iso(new Date(innkommendeD.getTime() + 5 * 86400000)), slutt: iso(new Date(levertD.getTime() - 1 * 86400000)), status: 'completed', ansvarlig: 'Kalkulator' },
    { fase: 'Tilbud levert',            start: iso(levertD), slutt: iso(levertD), status: status === 'pending' || status === 'vunnet' || status === 'tapt' ? 'completed' : 'planned', ansvarlig: 'Kalkulator' },
    { fase: 'Pending avgjørelse',       start: iso(levertD), slutt: legacy.frist,
      status: status === 'pending' ? 'in_progress' : (status === 'vunnet' || status === 'tapt') ? 'completed' : 'planned',
      ansvarlig: legacy.kunde },
    {
      fase: status === 'tapt' ? 'Tapt' : status === 'vunnet' ? 'Vunnet' : status === 'trukket' ? 'Trukket' : 'Vunnet / Tapt',
      start: status === 'pending' ? null : iso(avgjortD),
      slutt: status === 'pending' ? iso(new Date(avgjortD.getTime())) : iso(avgjortD),
      status: status === 'pending' || status === 'trukket' ? 'planned' : 'completed',
      ansvarlig: status === 'tapt' && legacy.vinner ? legacy.vinner + ' vant' : legacy.kunde,
    },
    { fase: 'Kontrakt → Prosjekt',
      start: status === 'vunnet' ? iso(new Date(avgjortD.getTime() + 14 * 86400000)) : null,
      slutt: status === 'vunnet' ? iso(new Date(avgjortD.getTime() + 21 * 86400000)) : null,
      status: status === 'vunnet' ? 'completed' : 'planned',
      ansvarlig: 'DL' },
  ];

  // Match prosjekt fra prosjekter.js hvis tilgjengelig
  const linkedProsjekt = (typeof PROSJEKTER !== 'undefined')
    ? PROSJEKTER.find(p => p.anbud_id === legacy.id)
    : null;

  return {
    id: legacy.id,
    selskap_id,
    tittel: legacy.tittel,
    kunde: legacy.kunde,
    ramme: legacy.ramme,
    kilde: 'Mercell',
    type: legacy.type,
    fag: legacy.fag,
    status,
    verdi_estimert_kr: verdi,
    verdi_levert_kr: status === 'pending' || status === 'vunnet' || status === 'tapt' ? verdi : null,
    frist: legacy.frist,
    innkommende: iso(innkommendeD),
    levert: status === 'pending' || status === 'vunnet' || status === 'tapt' ? iso(levertD) : null,
    avgjort: status === 'vunnet' || status === 'tapt' ? iso(avgjortD) : null,
    vinner: legacy.vinner || '',
    prosjekt_id: status === 'vunnet' && linkedProsjekt ? linkedProsjekt.id : null,
    ai_score,
    ai_vurdering,
    ai_kommentar,
    kalkulasjon,
    konkurrenter: [],
    faser,
    dokumenter: [
      { type: 'Konkurransegrunnlag', navn: legacy.id + '_grunnlag.pdf',     kilde: 'Mercell' },
      ...(status === 'pending' || status === 'vunnet' || status === 'tapt'
        ? [{ type: 'Vårt tilbud',     navn: 'Tilbud_' + legacy.id + '.pdf', kilde: 'Holte SmartKalk' }]
        : []),
      ...(status === 'vunnet'
        ? [{ type: 'Kontrakt',        navn: 'Kontrakt_' + legacy.id + '.pdf', kilde: 'Vunnet' }]
        : []),
      ...(status === 'tapt'
        ? [{ type: 'Læringspunkt',    navn: 'Tap_' + legacy.id + '.md',     kilde: 'Internt' }]
        : []),
    ],
    _legacy: true, // marker så UI kan vise "basis-info"
  };
}

// Bygd "merget" liste — rik ANBUD pluss legacy-entries (de som ikke allerede er i ANBUD)
let _ALL_ANBUD_CACHE = null;
function getAllAnbud() {
  if (_ALL_ANBUD_CACHE) return _ALL_ANBUD_CACHE;
  const richIds = new Set(ANBUD.map(a => a.id));
  const fromLegacy = LEGACY_ANBUD_SEED
    .filter(l => !richIds.has(l.id))
    .map(buildAnbudFromLegacy);
  _ALL_ANBUD_CACHE = [...ANBUD, ...fromLegacy];
  return _ALL_ANBUD_CACHE;
}

// =====================================================================
// Helpers
// =====================================================================

function getAnbudInScope(scope) {
  scope = scope || (typeof getActiveScope === 'function' ? getActiveScope() : null);
  const all = getAllAnbud();
  if (!scope) return all;
  if (scope.type === 'selskap') return all.filter(a => a.selskap_id === scope.id);
  if (scope.type === 'by') {
    const by = (typeof getBy === 'function') ? getBy(scope.id) : null;
    if (!by) return [];
    return all.filter(a => by.selskaper.includes(a.selskap_id));
  }
  return all;
}

function getAnbudById(id) {
  return getAllAnbud().find(a => a.id === id);
}

function aktivAnbudFase(a) {
  return (a.faser || []).find(f => f.status === 'in_progress')
    || (a.faser || []).slice().reverse().find(f => f.status === 'completed')
    || (a.faser || [])[0];
}

function aggregateAnbud(a) {
  const k = a.kalkulasjon || {};
  const sumKost = (k.materiell_kr || 0) + (k.lonn_kr || 0) + (k.ue_kr || 0) + (k.admin_kr || 0) + (k.risiko_kr || 0);
  const margin = (a.verdi_levert_kr || 0) - sumKost;
  const marginPct = a.verdi_levert_kr ? margin / a.verdi_levert_kr * 100 : 0;
  const aiAvg = a.ai_vurdering
    ? Object.values(a.ai_vurdering).reduce((s, x) => s + x, 0) / Object.values(a.ai_vurdering).length
    : a.ai_score;
  return {
    sumKost,
    margin_kr: margin,
    margin_pct: Math.round(marginPct * 10) / 10,
    ai_avg: Math.round(aiAvg),
    dager_til_frist: a.frist ? Math.ceil((new Date(a.frist) - Date.now()) / 86400000) : null,
    dager_pending: a.levert && (a.avgjort || !a.frist)
      ? Math.ceil(((a.avgjort ? new Date(a.avgjort) : Date.now()) - new Date(a.levert)) / 86400000)
      : null,
  };
}

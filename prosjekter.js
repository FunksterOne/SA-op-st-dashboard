// =====================================================================
// PROSJEKTER.JS — prosjekt-data og helpers (lifecycle, regnskap, ressurser)
// =====================================================================
// Hovedsporet i applikasjonen:
//   Dashboard → Anbudspipeline → Anbud (Vunnet) → Prosjekt → Lifecycle / Regnskap / Ressurser
//
// Prosjekt-modellen knytter et vunnet anbud til drift, økonomi og bemanning.
// Hver lifecycle-fase har dato, ansvarlig og status. Regnskap har budsjett vs.
// faktisk per kostnadsgruppe. Ressurser viser hvem som bemanner prosjektet
// med planlagte vs. faktiske timer.
//
// Lastes etter selskaper.js. Eksponerer:
//   - PROSJEKTER (array, alle prosjekter på tvers av selskap)
//   - getProsjekterInScope(scope?)
//   - getProsjektById(id)
//   - aggregateProsjekt(prosjekt) — beregner derived KPIs
//   - prosjektFaseStatus(prosjekt) — gir nåværende lifecycle-fase
// =====================================================================

const PROSJEKTER = [
  // -------------------------------------------------------------------
  // Byggmester Fritzøe — snekker / bygg-rehab
  // -------------------------------------------------------------------
  {
    id: 'PRJ-FR-2026-001',
    selskap_id: 'byggmester-fritzoe',
    navn: 'Bodø rådhus — kontorrehab 4. etg',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab', 'Snekker'],
    anbud_id: 'AN-2025-014',
    poweroffice_prosjekt_nr: 'PRO-2026-014',
    kontraktsverdi_kr: 6800000,
    fremdrift_pct: 32,
    status: 'utforelse',
    margin_plan_pct: 10.5,
    margin_faktisk_pct: 10.2,
    flagg: null,
    faser: [
      { fase: 'Anbud',          start: '2025-11-01', slutt: '2025-12-15', status: 'completed', ansvarlig: 'Lars (kalkulator)' },
      { fase: 'Vunnet',         start: '2025-12-16', slutt: '2025-12-16', status: 'completed', ansvarlig: 'Brynjar Storvik (DL)' },
      { fase: 'Kontraktinngåelse', start: '2026-01-05', slutt: '2026-01-20', status: 'completed', ansvarlig: 'Brynjar Storvik' },
      { fase: 'Planlegging',    start: '2026-01-21', slutt: '2026-02-28', status: 'completed', ansvarlig: 'Marius Hansen (PL)' },
      { fase: 'Utførelse',      start: '2026-03-01', slutt: '2026-08-30', status: 'in_progress', ansvarlig: 'Marius Hansen (PL)', fremdrift: 32 },
      { fase: 'Ferdigstillelse', start: null,         slutt: '2026-09-15', status: 'planned',   ansvarlig: 'Marius Hansen (PL)' },
      { fase: 'Garanti (5 år)',  start: null,         slutt: '2031-09-15', status: 'planned',   ansvarlig: 'Brynjar Storvik' },
    ],
    budsjett_kr: { materiell: 2400000, lonn: 3000000, ue: 800000, admin: 200000, risiko: 100000 },
    faktisk_kr: { materiell: 720000, lonn: 1100000, ue: 0, admin: 65000, risiko: 0, fakturert: 1800000 },
    ressurser: [
      { navn: 'Marius Hansen',   rolle: 'Prosjektleder',  fag: 'PL',       timer_planlagt: 320,  timer_faktisk: 105, lonn_pr_t: 580 },
      { navn: 'Anders Olsen',    rolle: 'Bas snekker',    fag: 'Snekker',  timer_planlagt: 800,  timer_faktisk: 260, lonn_pr_t: 480 },
      { navn: 'Espen Berg',      rolle: 'Snekker',        fag: 'Snekker',  timer_planlagt: 720,  timer_faktisk: 240, lonn_pr_t: 460 },
      { navn: 'Tor Dahl',        rolle: 'Snekker',        fag: 'Snekker',  timer_planlagt: 720,  timer_faktisk: 220, lonn_pr_t: 440 },
      { navn: 'UE Elektroservice', rolle: 'Underentreprenør', fag: 'Elektro', timer_planlagt: 0, timer_faktisk: 0, ue_pakke_kr: 480000 },
    ],
  },
  {
    id: 'PRJ-FR-2026-002',
    selskap_id: 'byggmester-fritzoe',
    navn: 'Skarmoen barnehage — byggeteknisk rehab',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab'],
    anbud_id: 'AN-2026-005',
    poweroffice_prosjekt_nr: 'PRO-2026-024',
    kontraktsverdi_kr: 4800000,
    fremdrift_pct: 25,
    status: 'utforelse',
    margin_plan_pct: 9.8,
    margin_faktisk_pct: 4.1,
    flagg: 'rod',
    flagg_aarsak: '298 t brukt ved 25 % fremdrift — projisert 12 % overforbruk lønn',
    faser: [
      { fase: 'Anbud',           start: '2025-12-01', slutt: '2026-01-15', status: 'completed', ansvarlig: 'Lars (kalkulator)' },
      { fase: 'Vunnet',          start: '2026-01-20', slutt: '2026-01-20', status: 'completed', ansvarlig: 'Brynjar Storvik' },
      { fase: 'Kontraktinngåelse', start: '2026-02-01', slutt: '2026-02-12', status: 'completed', ansvarlig: 'Brynjar Storvik' },
      { fase: 'Planlegging',     start: '2026-02-13', slutt: '2026-03-05', status: 'completed', ansvarlig: 'Stian Lund (PL)' },
      { fase: 'Utførelse',       start: '2026-03-08', slutt: '2026-09-30', status: 'in_progress', ansvarlig: 'Stian Lund (PL)', fremdrift: 25 },
      { fase: 'Ferdigstillelse', start: null,          slutt: '2026-10-20', status: 'planned',   ansvarlig: 'Stian Lund (PL)' },
      { fase: 'Garanti (5 år)',  start: null,          slutt: '2031-10-20', status: 'planned',   ansvarlig: 'Brynjar Storvik' },
    ],
    budsjett_kr: { materiell: 1500000, lonn: 2400000, ue: 600000, admin: 180000, risiko: 120000 },
    faktisk_kr: { materiell: 540000, lonn: 940000, ue: 0, admin: 78000, risiko: 0, fakturert: 1200000 },
    ressurser: [
      { navn: 'Stian Lund',      rolle: 'Prosjektleder',  fag: 'PL',      timer_planlagt: 280,  timer_faktisk: 92,  lonn_pr_t: 580 },
      { navn: 'Bjørn Antonsen',  rolle: 'Bas',            fag: 'Snekker', timer_planlagt: 600,  timer_faktisk: 198, lonn_pr_t: 480 },
      { navn: 'Erik Nilsen',     rolle: 'Snekker',        fag: 'Snekker', timer_planlagt: 600,  timer_faktisk: 168, lonn_pr_t: 460 },
      { navn: 'Magnus Eriksen',  rolle: 'Snekker (lærling)', fag: 'Snekker', timer_planlagt: 600, timer_faktisk: 175, lonn_pr_t: 320 },
    ],
  },
  {
    id: 'PRJ-FR-2026-003',
    selskap_id: 'byggmester-fritzoe',
    navn: 'Hunstad ungdomsskole — garderoberehab',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab', 'Snekker'],
    anbud_id: 'AN-2025-017',
    poweroffice_prosjekt_nr: 'PRO-2025-117',
    kontraktsverdi_kr: 3800000,
    fremdrift_pct: 95,
    status: 'utforelse',
    margin_plan_pct: 9.5,
    margin_faktisk_pct: 11.3,
    flagg: null,
    faser: [
      { fase: 'Anbud',           start: '2025-08-01', slutt: '2025-09-05', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Vunnet',          start: '2025-09-10', slutt: '2025-09-10', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Kontraktinngåelse', start: '2025-09-20', slutt: '2025-10-05', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Planlegging',     start: '2025-10-08', slutt: '2025-10-30', status: 'completed', ansvarlig: 'Per Larsen (PL)' },
      { fase: 'Utførelse',       start: '2025-11-03', slutt: '2026-05-15', status: 'in_progress', ansvarlig: 'Per Larsen (PL)', fremdrift: 95 },
      { fase: 'Ferdigstillelse', start: null,          slutt: '2026-05-30', status: 'planned',   ansvarlig: 'Per Larsen (PL)' },
      { fase: 'Garanti (5 år)',  start: null,          slutt: '2031-05-30', status: 'planned',   ansvarlig: 'Brynjar' },
    ],
    budsjett_kr: { materiell: 1200000, lonn: 1900000, ue: 450000, admin: 150000, risiko: 100000 },
    faktisk_kr: { materiell: 1180000, lonn: 1740000, ue: 410000, admin: 142000, risiko: 0, fakturert: 3600000 },
    ressurser: [
      { navn: 'Per Larsen',      rolle: 'Prosjektleder', fag: 'PL',      timer_planlagt: 250,  timer_faktisk: 230, lonn_pr_t: 580 },
      { navn: 'Anders Olsen',    rolle: 'Bas snekker',   fag: 'Snekker', timer_planlagt: 500,  timer_faktisk: 460, lonn_pr_t: 480 },
      { navn: 'Tor Dahl',        rolle: 'Snekker',       fag: 'Snekker', timer_planlagt: 480,  timer_faktisk: 442, lonn_pr_t: 440 },
      { navn: 'UE Maler-pakke',  rolle: 'Underentreprenør', fag: 'Maler',timer_planlagt: 0,    timer_faktisk: 0,   ue_pakke_kr: 410000 },
    ],
  },
  {
    id: 'PRJ-FR-2025-004',
    selskap_id: 'byggmester-fritzoe',
    navn: 'Forsvarsbygg Bodøsjøen — kontorrehab',
    kunde: 'Forsvarsbygg',
    ramme: 'Salten rammeavtale 2024-28',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab', 'Snekker'],
    anbud_id: 'AN-2025-023',
    poweroffice_prosjekt_nr: 'PRO-2025-223',
    kontraktsverdi_kr: 5400000,
    fremdrift_pct: 100,
    status: 'garanti',
    margin_plan_pct: 9.0,
    margin_faktisk_pct: 9.8,
    flagg: null,
    faser: [
      { fase: 'Anbud',           start: '2025-09-15', slutt: '2025-11-05', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Vunnet',          start: '2025-11-10', slutt: '2025-11-10', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Kontraktinngåelse', start: '2025-11-25', slutt: '2025-12-10', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Planlegging',     start: '2025-12-12', slutt: '2026-01-08', status: 'completed', ansvarlig: 'Marius Hansen (PL)' },
      { fase: 'Utførelse',       start: '2026-01-12', slutt: '2026-04-15', status: 'completed', ansvarlig: 'Marius Hansen (PL)' },
      { fase: 'Ferdigstillelse', start: '2026-04-20', slutt: '2026-04-25', status: 'completed', ansvarlig: 'Marius Hansen (PL)' },
      { fase: 'Garanti (5 år)',  start: '2026-04-25', slutt: '2031-04-25', status: 'in_progress', ansvarlig: 'Brynjar' },
    ],
    budsjett_kr: { materiell: 1700000, lonn: 2700000, ue: 650000, admin: 200000, risiko: 150000 },
    faktisk_kr: { materiell: 1620000, lonn: 2580000, ue: 640000, admin: 195000, risiko: 0, fakturert: 5400000 },
    ressurser: [
      { navn: 'Marius Hansen',   rolle: 'Prosjektleder', fag: 'PL',      timer_planlagt: 300,  timer_faktisk: 285, lonn_pr_t: 580 },
      { navn: 'Bjørn Antonsen',  rolle: 'Bas',           fag: 'Snekker', timer_planlagt: 700,  timer_faktisk: 665, lonn_pr_t: 480 },
      { navn: 'Espen Berg',      rolle: 'Snekker',       fag: 'Snekker', timer_planlagt: 650,  timer_faktisk: 625, lonn_pr_t: 460 },
      { navn: 'Erik Nilsen',     rolle: 'Snekker',       fag: 'Snekker', timer_planlagt: 600,  timer_faktisk: 580, lonn_pr_t: 460 },
    ],
  },
  {
    id: 'PRJ-FR-2026-005',
    selskap_id: 'byggmester-fritzoe',
    navn: 'Aspåsen skole — tak og taksrenner',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    type: 'Mini-konkurranse',
    fag: ['Tak'],
    anbud_id: 'AN-2025-018',
    poweroffice_prosjekt_nr: 'PRO-2026-018',
    kontraktsverdi_kr: 4200000,
    fremdrift_pct: 0,
    status: 'planlegging',
    margin_plan_pct: 9.5,
    margin_faktisk_pct: null,
    flagg: 'gul',
    flagg_aarsak: 'Vær-avhengig oppstart — tette planlagt mai-juni',
    faser: [
      { fase: 'Anbud',           start: '2025-08-15', slutt: '2025-09-12', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Vunnet',          start: '2025-09-15', slutt: '2025-09-15', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Kontraktinngåelse', start: '2025-12-10', slutt: '2026-01-15', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Planlegging',     start: '2026-01-20', slutt: '2026-04-30', status: 'in_progress', ansvarlig: 'Stian Lund (PL)', fremdrift: 75 },
      { fase: 'Utførelse',       start: null,          slutt: '2026-08-15', status: 'planned',   ansvarlig: 'Stian Lund (PL)' },
      { fase: 'Ferdigstillelse', start: null,          slutt: '2026-08-30', status: 'planned',   ansvarlig: 'Stian Lund (PL)' },
      { fase: 'Garanti (5 år)',  start: null,          slutt: '2031-08-30', status: 'planned',   ansvarlig: 'Brynjar' },
    ],
    budsjett_kr: { materiell: 1600000, lonn: 1900000, ue: 350000, admin: 200000, risiko: 150000 },
    faktisk_kr: { materiell: 0, lonn: 95000, ue: 0, admin: 28000, risiko: 0, fakturert: 0 },
    ressurser: [
      { navn: 'Stian Lund',      rolle: 'Prosjektleder', fag: 'PL',      timer_planlagt: 220,  timer_faktisk: 28,  lonn_pr_t: 580 },
      { navn: 'Anders Olsen',    rolle: 'Bas tak',       fag: 'Tak',     timer_planlagt: 500,  timer_faktisk: 0,   lonn_pr_t: 480 },
      { navn: 'Espen Berg',      rolle: 'Snekker tak',   fag: 'Tak',     timer_planlagt: 480,  timer_faktisk: 0,   lonn_pr_t: 460 },
    ],
  },

  // -------------------------------------------------------------------
  // Areal Byggservice — maler / overflate / lett snekker
  // -------------------------------------------------------------------
  {
    id: 'PRJ-AR-2026-001',
    selskap_id: 'areal-byggservice',
    navn: 'Bodø rådhus — innvendig maling 3. etg',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    type: 'Mini-konkurranse',
    fag: ['Maler'],
    anbud_id: 'AN-2025-019',
    poweroffice_prosjekt_nr: 'PRO-AR-2026-019',
    kontraktsverdi_kr: 850000,
    fremdrift_pct: 65,
    status: 'utforelse',
    margin_plan_pct: 10.0,
    margin_faktisk_pct: 10.6,
    flagg: null,
    faser: [
      { fase: 'Anbud',           start: '2025-08-20', slutt: '2025-09-24', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Vunnet',          start: '2025-09-26', slutt: '2025-09-26', status: 'completed', ansvarlig: 'Brynjar Storvik' },
      { fase: 'Kontraktinngåelse', start: '2025-12-15', slutt: '2026-01-05', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Planlegging',     start: '2026-01-10', slutt: '2026-02-20', status: 'completed', ansvarlig: 'Henrik Solheim (PL)' },
      { fase: 'Utførelse',       start: '2026-02-25', slutt: '2026-06-20', status: 'in_progress', ansvarlig: 'Henrik Solheim (PL)', fremdrift: 65 },
      { fase: 'Ferdigstillelse', start: null,          slutt: '2026-07-05', status: 'planned',   ansvarlig: 'Henrik Solheim (PL)' },
      { fase: 'Garanti (5 år)',  start: null,          slutt: '2031-07-05', status: 'planned',   ansvarlig: 'Brynjar' },
    ],
    budsjett_kr: { materiell: 240000, lonn: 460000, ue: 0, admin: 50000, risiko: 15000 },
    faktisk_kr: { materiell: 158000, lonn: 295000, ue: 0, admin: 32000, risiko: 0, fakturert: 552500 },
    ressurser: [
      { navn: 'Henrik Solheim',  rolle: 'Prosjektleder', fag: 'PL',    timer_planlagt: 90,   timer_faktisk: 58,  lonn_pr_t: 560 },
      { navn: 'Tone Pedersen',   rolle: 'Bas maler',     fag: 'Maler', timer_planlagt: 280,  timer_faktisk: 178, lonn_pr_t: 460 },
      { navn: 'Kjetil Storvik',  rolle: 'Maler',         fag: 'Maler', timer_planlagt: 260,  timer_faktisk: 168, lonn_pr_t: 440 },
    ],
  },
  {
    id: 'PRJ-AR-2026-002',
    selskap_id: 'areal-byggservice',
    navn: 'Hunstad bibliotek — innvendig oppussing',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    type: 'Mini-konkurranse',
    fag: ['Maler', 'Snekker'],
    anbud_id: 'AN-2026-004',
    poweroffice_prosjekt_nr: 'PRO-AR-2026-004',
    kontraktsverdi_kr: 1100000,
    fremdrift_pct: 40,
    status: 'utforelse',
    margin_plan_pct: 9.5,
    margin_faktisk_pct: 9.8,
    flagg: null,
    faser: [
      { fase: 'Anbud',           start: '2026-01-10', slutt: '2026-02-19', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Vunnet',          start: '2026-02-22', slutt: '2026-02-22', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Kontraktinngåelse', start: '2026-03-01', slutt: '2026-03-12', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Planlegging',     start: '2026-03-15', slutt: '2026-04-05', status: 'completed', ansvarlig: 'Henrik Solheim (PL)' },
      { fase: 'Utførelse',       start: '2026-04-08', slutt: '2026-08-15', status: 'in_progress', ansvarlig: 'Henrik Solheim (PL)', fremdrift: 40 },
      { fase: 'Ferdigstillelse', start: null,          slutt: '2026-08-30', status: 'planned',   ansvarlig: 'Henrik Solheim (PL)' },
      { fase: 'Garanti (5 år)',  start: null,          slutt: '2031-08-30', status: 'planned',   ansvarlig: 'Brynjar' },
    ],
    budsjett_kr: { materiell: 320000, lonn: 600000, ue: 0, admin: 70000, risiko: 35000 },
    faktisk_kr: { materiell: 142000, lonn: 252000, ue: 0, admin: 31000, risiko: 0, fakturert: 440000 },
    ressurser: [
      { navn: 'Henrik Solheim',  rolle: 'Prosjektleder', fag: 'PL',      timer_planlagt: 100,  timer_faktisk: 42,  lonn_pr_t: 560 },
      { navn: 'Tone Pedersen',   rolle: 'Bas maler',     fag: 'Maler',   timer_planlagt: 320,  timer_faktisk: 132, lonn_pr_t: 460 },
      { navn: 'Jan Eide',        rolle: 'Snekker',       fag: 'Snekker', timer_planlagt: 240,  timer_faktisk: 95,  lonn_pr_t: 460 },
    ],
  },
  {
    id: 'PRJ-AR-2025-003',
    selskap_id: 'areal-byggservice',
    navn: 'Stordalshallen — innvendig maling',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    type: 'Mini-konkurranse',
    fag: ['Maler'],
    anbud_id: 'AN-2025-016',
    poweroffice_prosjekt_nr: 'PRO-AR-2025-016',
    kontraktsverdi_kr: 1200000,
    fremdrift_pct: 100,
    status: 'garanti',
    margin_plan_pct: 9.5,
    margin_faktisk_pct: 11.0,
    flagg: null,
    faser: [
      { fase: 'Anbud',           start: '2025-07-15', slutt: '2025-08-22', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Vunnet',          start: '2025-08-25', slutt: '2025-08-25', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Kontraktinngåelse', start: '2025-09-05', slutt: '2025-09-18', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Planlegging',     start: '2025-09-22', slutt: '2025-10-15', status: 'completed', ansvarlig: 'Henrik Solheim (PL)' },
      { fase: 'Utførelse',       start: '2025-10-20', slutt: '2026-02-28', status: 'completed', ansvarlig: 'Henrik Solheim (PL)' },
      { fase: 'Ferdigstillelse', start: '2026-03-01', slutt: '2026-03-08', status: 'completed', ansvarlig: 'Henrik Solheim (PL)' },
      { fase: 'Garanti (5 år)',  start: '2026-03-08', slutt: '2031-03-08', status: 'in_progress', ansvarlig: 'Brynjar' },
    ],
    budsjett_kr: { materiell: 320000, lonn: 690000, ue: 0, admin: 80000, risiko: 35000 },
    faktisk_kr: { materiell: 305000, lonn: 612000, ue: 0, admin: 75000, risiko: 0, fakturert: 1200000 },
    ressurser: [
      { navn: 'Henrik Solheim',  rolle: 'Prosjektleder', fag: 'PL',    timer_planlagt: 110,  timer_faktisk: 95,  lonn_pr_t: 560 },
      { navn: 'Tone Pedersen',   rolle: 'Bas maler',     fag: 'Maler', timer_planlagt: 380,  timer_faktisk: 332, lonn_pr_t: 460 },
      { navn: 'Kjetil Storvik',  rolle: 'Maler',         fag: 'Maler', timer_planlagt: 360,  timer_faktisk: 318, lonn_pr_t: 440 },
      { navn: 'Heidi Sand',      rolle: 'Maler',         fag: 'Maler', timer_planlagt: 340,  timer_faktisk: 295, lonn_pr_t: 440 },
    ],
  },
  {
    id: 'PRJ-AR-2026-004',
    selskap_id: 'areal-byggservice',
    navn: 'Mørkved senior — utvendig maling',
    kunde: 'Bodø kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    type: 'Mini-konkurranse',
    fag: ['Maler'],
    anbud_id: 'AN-2026-010',
    poweroffice_prosjekt_nr: 'PRO-AR-2026-010',
    kontraktsverdi_kr: 1600000,
    fremdrift_pct: 28,
    status: 'utforelse',
    margin_plan_pct: 9.5,
    margin_faktisk_pct: 8.2,
    flagg: 'gul',
    flagg_aarsak: 'Vær-forsinkelse — fortsatt på rammen, ikke kritisk',
    faser: [
      { fase: 'Anbud',           start: '2026-03-20', slutt: '2026-04-30', status: 'completed', ansvarlig: 'Lars' },
      { fase: 'Vunnet',          start: '2026-05-01', slutt: '2026-05-01', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Kontraktinngåelse', start: '2026-05-05', slutt: '2026-05-15', status: 'completed', ansvarlig: 'Brynjar' },
      { fase: 'Planlegging',     start: '2026-05-18', slutt: '2026-06-05', status: 'completed', ansvarlig: 'Henrik Solheim (PL)' },
      { fase: 'Utførelse',       start: '2026-06-10', slutt: '2026-09-30', status: 'in_progress', ansvarlig: 'Henrik Solheim (PL)', fremdrift: 28 },
      { fase: 'Ferdigstillelse', start: null,          slutt: '2026-10-15', status: 'planned',   ansvarlig: 'Henrik Solheim (PL)' },
      { fase: 'Garanti (5 år)',  start: null,          slutt: '2031-10-15', status: 'planned',   ansvarlig: 'Brynjar' },
    ],
    budsjett_kr: { materiell: 480000, lonn: 850000, ue: 0, admin: 100000, risiko: 50000 },
    faktisk_kr: { materiell: 152000, lonn: 240000, ue: 0, admin: 28000, risiko: 0, fakturert: 448000 },
    ressurser: [
      { navn: 'Henrik Solheim',  rolle: 'Prosjektleder', fag: 'PL',    timer_planlagt: 130,  timer_faktisk: 38,  lonn_pr_t: 560 },
      { navn: 'Tone Pedersen',   rolle: 'Bas maler',     fag: 'Maler', timer_planlagt: 460,  timer_faktisk: 132, lonn_pr_t: 460 },
      { navn: 'Heidi Sand',      rolle: 'Maler',         fag: 'Maler', timer_planlagt: 420,  timer_faktisk: 117, lonn_pr_t: 440 },
    ],
  },

  // -------------------------------------------------------------------
  // Braa og Sørvåg Bygg — Trondheim
  // -------------------------------------------------------------------
  {
    id: 'PRJ-BS-2026-001',
    selskap_id: 'braa-sorvaag-bygg',
    navn: 'Lade barnehage — byggeteknisk rehab',
    kunde: 'Trondheim kommune',
    ramme: 'Bygg-vedlikehold 2024-27',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab'],
    anbud_id: 'BS-2026-009',
    poweroffice_prosjekt_nr: 'PRO-BS-2026-009',
    kontraktsverdi_kr: 4800000,
    fremdrift_pct: 25,
    status: 'utforelse',
    margin_plan_pct: 6.5,
    margin_faktisk_pct: 1.8,
    flagg: 'rod',
    flagg_aarsak: '348 t brukt ved 25 % fremdrift — projisert 18 % overforbruk lønn. Marginløftsplan iverksatt.',
    faser: [
      { fase: 'Anbud',           start: '2026-02-15', slutt: '2026-04-15', status: 'completed', ansvarlig: 'Sigurd K. (kalkulator)' },
      { fase: 'Vunnet',          start: '2026-04-18', slutt: '2026-04-18', status: 'completed', ansvarlig: 'Øyvind Berggren (DL)' },
      { fase: 'Kontraktinngåelse', start: '2026-04-25', slutt: '2026-05-10', status: 'completed', ansvarlig: 'Øyvind Berggren' },
      { fase: 'Planlegging',     start: '2026-05-12', slutt: '2026-06-08', status: 'completed', ansvarlig: 'Trygve Lie (PL)' },
      { fase: 'Utførelse',       start: '2026-06-10', slutt: '2026-12-15', status: 'in_progress', ansvarlig: 'Trygve Lie (PL)', fremdrift: 25 },
      { fase: 'Ferdigstillelse', start: null,          slutt: '2027-01-15', status: 'planned',   ansvarlig: 'Trygve Lie (PL)' },
      { fase: 'Garanti (5 år)',  start: null,          slutt: '2032-01-15', status: 'planned',   ansvarlig: 'Øyvind Berggren' },
    ],
    budsjett_kr: { materiell: 1500000, lonn: 2400000, ue: 600000, admin: 200000, risiko: 100000 },
    faktisk_kr: { materiell: 540000, lonn: 1015000, ue: 0, admin: 78000, risiko: 0, fakturert: 1200000 },
    ressurser: [
      { navn: 'Trygve Lie',      rolle: 'Prosjektleder', fag: 'PL',      timer_planlagt: 280,  timer_faktisk: 95,  lonn_pr_t: 580 },
      { navn: 'Halvor Næss',     rolle: 'Bas',           fag: 'Snekker', timer_planlagt: 600,  timer_faktisk: 218, lonn_pr_t: 480 },
      { navn: 'Olav Strand',     rolle: 'Snekker',       fag: 'Snekker', timer_planlagt: 600,  timer_faktisk: 245, lonn_pr_t: 460 },
      { navn: 'Roar Eriksen',    rolle: 'Snekker',       fag: 'Snekker', timer_planlagt: 600,  timer_faktisk: 252, lonn_pr_t: 440 },
    ],
  },
  {
    id: 'PRJ-BS-2026-002',
    selskap_id: 'braa-sorvaag-bygg',
    navn: 'Charlottenlund vgs — garderobe og dusj',
    kunde: 'Trøndelag fylkeskommune',
    ramme: 'Bygg-rehab fylke 2024-28',
    type: 'Mini-konkurranse',
    fag: ['Bygg-rehab', 'Snekker'],
    anbud_id: 'BS-2025-018',
    poweroffice_prosjekt_nr: 'PRO-BS-2025-118',
    kontraktsverdi_kr: 3400000,
    fremdrift_pct: 75,
    status: 'utforelse',
    margin_plan_pct: 6.0,
    margin_faktisk_pct: 8.3,
    flagg: null,
    faser: [
      { fase: 'Anbud',           start: '2025-06-20', slutt: '2025-08-12', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Vunnet',          start: '2025-08-15', slutt: '2025-08-15', status: 'completed', ansvarlig: 'Øyvind' },
      { fase: 'Kontraktinngåelse', start: '2025-08-25', slutt: '2025-09-10', status: 'completed', ansvarlig: 'Øyvind' },
      { fase: 'Planlegging',     start: '2025-09-15', slutt: '2025-10-12', status: 'completed', ansvarlig: 'Bjarte Solli (PL)' },
      { fase: 'Utførelse',       start: '2025-10-15', slutt: '2026-08-30', status: 'in_progress', ansvarlig: 'Bjarte Solli (PL)', fremdrift: 75 },
      { fase: 'Ferdigstillelse', start: null,          slutt: '2026-09-15', status: 'planned',   ansvarlig: 'Bjarte Solli (PL)' },
      { fase: 'Garanti (5 år)',  start: null,          slutt: '2031-09-15', status: 'planned',   ansvarlig: 'Øyvind' },
    ],
    budsjett_kr: { materiell: 1100000, lonn: 1600000, ue: 400000, admin: 150000, risiko: 100000 },
    faktisk_kr: { materiell: 798000, lonn: 1108000, ue: 280000, admin: 110000, risiko: 0, fakturert: 2550000 },
    ressurser: [
      { navn: 'Bjarte Solli',    rolle: 'Prosjektleder', fag: 'PL',      timer_planlagt: 200,  timer_faktisk: 152, lonn_pr_t: 580 },
      { navn: 'Halvor Næss',     rolle: 'Bas',           fag: 'Snekker', timer_planlagt: 400,  timer_faktisk: 305, lonn_pr_t: 480 },
      { navn: 'Olav Strand',     rolle: 'Snekker',       fag: 'Snekker', timer_planlagt: 400,  timer_faktisk: 298, lonn_pr_t: 460 },
      { navn: 'UE Rør Trondheim', rolle: 'Underentreprenør', fag: 'Rør',timer_planlagt: 0,    timer_faktisk: 0,   ue_pakke_kr: 280000 },
    ],
  },
  {
    id: 'PRJ-BS-2026-003',
    selskap_id: 'braa-sorvaag-bygg',
    navn: 'Heimdal vgs — innvendig oppussing fløy A',
    kunde: 'Trøndelag fylkeskommune',
    ramme: 'Bygg-rehab fylke 2024-28',
    type: 'Mini-konkurranse',
    fag: ['Maler', 'Bygg-rehab'],
    anbud_id: 'BS-2025-026',
    poweroffice_prosjekt_nr: 'PRO-BS-2025-126',
    kontraktsverdi_kr: 1300000,
    fremdrift_pct: 92,
    status: 'utforelse',
    margin_plan_pct: 6.0,
    margin_faktisk_pct: 9.2,
    flagg: null,
    faser: [
      { fase: 'Anbud',           start: '2025-09-20', slutt: '2025-11-10', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Vunnet',          start: '2025-11-13', slutt: '2025-11-13', status: 'completed', ansvarlig: 'Øyvind' },
      { fase: 'Kontraktinngåelse', start: '2025-11-25', slutt: '2025-12-08', status: 'completed', ansvarlig: 'Øyvind' },
      { fase: 'Planlegging',     start: '2025-12-10', slutt: '2026-01-15', status: 'completed', ansvarlig: 'Bjarte Solli (PL)' },
      { fase: 'Utførelse',       start: '2026-01-18', slutt: '2026-05-30', status: 'in_progress', ansvarlig: 'Bjarte Solli (PL)', fremdrift: 92 },
      { fase: 'Ferdigstillelse', start: null,          slutt: '2026-06-15', status: 'planned',   ansvarlig: 'Bjarte Solli (PL)' },
      { fase: 'Garanti (5 år)',  start: null,          slutt: '2031-06-15', status: 'planned',   ansvarlig: 'Øyvind' },
    ],
    budsjett_kr: { materiell: 380000, lonn: 720000, ue: 100000, admin: 70000, risiko: 30000 },
    faktisk_kr: { materiell: 348000, lonn: 638000, ue: 92000, admin: 62000, risiko: 0, fakturert: 1196000 },
    ressurser: [
      { navn: 'Bjarte Solli',    rolle: 'Prosjektleder', fag: 'PL',      timer_planlagt: 110,  timer_faktisk: 102, lonn_pr_t: 580 },
      { navn: 'Olav Strand',     rolle: 'Bas',           fag: 'Snekker', timer_planlagt: 350,  timer_faktisk: 322, lonn_pr_t: 480 },
      { navn: 'UE Maler-pakke',  rolle: 'Underentreprenør', fag: 'Maler',timer_planlagt: 0,    timer_faktisk: 0,   ue_pakke_kr: 92000 },
    ],
  },
  {
    id: 'PRJ-BS-2026-004',
    selskap_id: 'braa-sorvaag-bygg',
    navn: 'NTNU Gløshaugen — Inst.bygg vinduer',
    kunde: 'Statsbygg',
    ramme: 'Statsbygg Midt-Norge 2024-28',
    type: 'Mini-konkurranse',
    fag: ['Vinduer', 'Snekker'],
    anbud_id: 'BS-2026-011',
    poweroffice_prosjekt_nr: 'PRO-BS-2026-211',
    kontraktsverdi_kr: 5200000,
    fremdrift_pct: 28,
    status: 'utforelse',
    margin_plan_pct: 6.5,
    margin_faktisk_pct: 7.2,
    flagg: null,
    faser: [
      { fase: 'Anbud',           start: '2026-01-20', slutt: '2026-03-15', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Vunnet',          start: '2026-03-22', slutt: '2026-03-22', status: 'completed', ansvarlig: 'Øyvind' },
      { fase: 'Kontraktinngåelse', start: '2026-04-02', slutt: '2026-04-18', status: 'completed', ansvarlig: 'Øyvind' },
      { fase: 'Planlegging',     start: '2026-04-22', slutt: '2026-05-25', status: 'completed', ansvarlig: 'Trygve Lie (PL)' },
      { fase: 'Utførelse',       start: '2026-05-28', slutt: '2027-01-30', status: 'in_progress', ansvarlig: 'Trygve Lie (PL)', fremdrift: 28 },
      { fase: 'Ferdigstillelse', start: null,          slutt: '2027-02-15', status: 'planned',   ansvarlig: 'Trygve Lie (PL)' },
      { fase: 'Garanti (5 år)',  start: null,          slutt: '2032-02-15', status: 'planned',   ansvarlig: 'Øyvind' },
    ],
    budsjett_kr: { materiell: 1900000, lonn: 2500000, ue: 450000, admin: 250000, risiko: 100000 },
    faktisk_kr: { materiell: 552000, lonn: 678000, ue: 0, admin: 64000, risiko: 0, fakturert: 1456000 },
    ressurser: [
      { navn: 'Trygve Lie',      rolle: 'Prosjektleder', fag: 'PL',      timer_planlagt: 350,  timer_faktisk: 105, lonn_pr_t: 580 },
      { navn: 'Halvor Næss',     rolle: 'Bas',           fag: 'Snekker', timer_planlagt: 700,  timer_faktisk: 198, lonn_pr_t: 480 },
      { navn: 'Roar Eriksen',    rolle: 'Snekker',       fag: 'Snekker', timer_planlagt: 700,  timer_faktisk: 195, lonn_pr_t: 440 },
      { navn: 'Vidar Holm',      rolle: 'Snekker',       fag: 'Snekker', timer_planlagt: 600,  timer_faktisk: 168, lonn_pr_t: 440 },
    ],
  },
  {
    id: 'PRJ-BS-2025-005',
    selskap_id: 'braa-sorvaag-bygg',
    navn: 'Persaunet leir — bolig 8 og 9 vinduer',
    kunde: 'Forsvarsbygg',
    ramme: 'Salten Trøndelag 2024-28',
    type: 'Mini-konkurranse',
    fag: ['Vinduer'],
    anbud_id: 'BS-2025-030',
    poweroffice_prosjekt_nr: 'PRO-BS-2025-130',
    kontraktsverdi_kr: 2400000,
    fremdrift_pct: 100,
    status: 'garanti',
    margin_plan_pct: 5.5,
    margin_faktisk_pct: 7.0,
    flagg: null,
    faser: [
      { fase: 'Anbud',           start: '2025-10-15', slutt: '2025-12-22', status: 'completed', ansvarlig: 'Sigurd' },
      { fase: 'Vunnet',          start: '2025-12-28', slutt: '2025-12-28', status: 'completed', ansvarlig: 'Øyvind' },
      { fase: 'Kontraktinngåelse', start: '2026-01-08', slutt: '2026-01-22', status: 'completed', ansvarlig: 'Øyvind' },
      { fase: 'Planlegging',     start: '2026-01-25', slutt: '2026-02-15', status: 'completed', ansvarlig: 'Bjarte Solli (PL)' },
      { fase: 'Utførelse',       start: '2026-02-18', slutt: '2026-04-20', status: 'completed', ansvarlig: 'Bjarte Solli (PL)' },
      { fase: 'Ferdigstillelse', start: '2026-04-22', slutt: '2026-04-28', status: 'completed', ansvarlig: 'Bjarte Solli (PL)' },
      { fase: 'Garanti (5 år)',  start: '2026-04-28', slutt: '2031-04-28', status: 'in_progress', ansvarlig: 'Øyvind' },
    ],
    budsjett_kr: { materiell: 1100000, lonn: 980000, ue: 80000, admin: 110000, risiko: 50000 },
    faktisk_kr: { materiell: 1052000, lonn: 920000, ue: 78000, admin: 102000, risiko: 0, fakturert: 2400000 },
    ressurser: [
      { navn: 'Bjarte Solli',    rolle: 'Prosjektleder', fag: 'PL',      timer_planlagt: 140,  timer_faktisk: 132, lonn_pr_t: 580 },
      { navn: 'Olav Strand',     rolle: 'Bas vinduer',   fag: 'Vinduer', timer_planlagt: 480,  timer_faktisk: 458, lonn_pr_t: 480 },
      { navn: 'Vidar Holm',      rolle: 'Snekker vindu', fag: 'Vinduer', timer_planlagt: 460,  timer_faktisk: 432, lonn_pr_t: 440 },
    ],
  },
];

// =====================================================================
// Helpers
// =====================================================================

const PROSJEKT_STATUS_LABEL = {
  planlegging: 'Planlegging',
  utforelse: 'Utførelse',
  ferdigstillelse: 'Ferdigstillelse',
  garanti: 'Garanti',
  arkivert: 'Arkivert',
};

const PROSJEKT_STATUS_COLOR = {
  planlegging: 'hi',
  utforelse: 'good',
  ferdigstillelse: 'pending',
  garanti: 'muted',
  arkivert: 'muted',
};

function getProsjekterInScope(scope) {
  scope = scope || (typeof getActiveScope === 'function' ? getActiveScope() : null);
  if (!scope) return PROSJEKTER;
  if (scope.type === 'selskap') {
    return PROSJEKTER.filter(p => p.selskap_id === scope.id);
  }
  if (scope.type === 'by') {
    const by = (typeof getBy === 'function') ? getBy(scope.id) : null;
    if (!by) return [];
    return PROSJEKTER.filter(p => by.selskaper.includes(p.selskap_id));
  }
  // konsern
  return PROSJEKTER;
}

function getProsjektById(id) {
  return PROSJEKTER.find(p => p.id === id);
}

function aggregateProsjekt(p) {
  const b = p.budsjett_kr || {};
  const f = p.faktisk_kr || {};
  const sumBudsjett = (b.materiell || 0) + (b.lonn || 0) + (b.ue || 0) + (b.admin || 0) + (b.risiko || 0);
  const sumFaktisk = (f.materiell || 0) + (f.lonn || 0) + (f.ue || 0) + (f.admin || 0);
  const fakturert = f.fakturert || 0;
  const projisert = sumBudsjett && p.fremdrift_pct
    ? sumFaktisk / (p.fremdrift_pct / 100)
    : sumBudsjett;
  return {
    sumBudsjett,
    sumFaktisk,
    fakturert,
    projisert,
    overforbruk_kr: Math.max(0, projisert - sumBudsjett),
    avvik_pct: sumBudsjett ? Math.round((projisert - sumBudsjett) / sumBudsjett * 1000) / 10 : 0,
    margin_kr: (p.kontraktsverdi_kr || 0) - sumFaktisk,
    margin_projisert_kr: (p.kontraktsverdi_kr || 0) - projisert,
    timer_planlagt: (p.ressurser || []).reduce((s, r) => s + (r.timer_planlagt || 0), 0),
    timer_faktisk: (p.ressurser || []).reduce((s, r) => s + (r.timer_faktisk || 0), 0),
  };
}

function aktivProsjektFase(p) {
  return (p.faser || []).find(f => f.status === 'in_progress')
    || (p.faser || []).slice().reverse().find(f => f.status === 'completed')
    || (p.faser || [])[0];
}

function fmtKr(v, kort = true) {
  if (v == null) return '—';
  if (kort) {
    if (Math.abs(v) >= 1000000) return (v / 1000000).toFixed(1).replace('.', ',') + ' MNOK';
    if (Math.abs(v) >= 1000) return (v / 1000).toFixed(0) + ' kNOK';
  }
  return Math.round(v).toLocaleString('no-NO') + ' kr';
}

function fmtPct(v, decimals = 1) {
  if (v == null) return '—';
  return v.toFixed(decimals).replace('.', ',') + ' %';
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso); if (isNaN(d)) return iso;
  return `${d.getDate()}. ${['jan','feb','mar','apr','mai','jun','jul','aug','sep','okt','nov','des'][d.getMonth()]} ${d.getFullYear()}`;
}

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

  // Konsern-strategi: hvordan SA skaper verdi på tvers av selskapene
  strategi: {
    intensjon: 'Bygge Norges fremste portefølje av lokale ROT-spesialister gjennom konsern­synergier, forsikrings­distribusjon og strukturert M&A — med Bodø og Trondheim som strategiske hub-er.',
    intensjon_kort: 'Norges fremste lokale ROT-portefølje',

    portefolje_logikk: 'De tre selskapene utgjør komplementære posisjoner i ROT-markedet: Fritzøe (Bodø, snekker/tømrer) er det brede ankeret. Areal (Bodø, maler/overflate) gir spisset overflate-spesialisering og forsikrings­strøm-respons. Braa (Trondheim, total-rehab) er ekspansjonen til Midt-Norge og bredere fagprofil. Sammen dekker porteføljen 90 %+ av ROT-arbeidstyper i offentlig sektor og forsikrings­skade.',

    synergier: [
      { tema: 'Bodø: Fritzøe + Areal',     tekst: 'Felles DL og kontor (Påls vei 1B). UE-allianse i krysningen mellom snekker- og maler-tunge anbud. Vurdering av fusjon i 2028 for redusert governance-overhead.' },
      { tema: 'Bodø ↔ Trondheim',          tekst: 'Kalkulasjons-praksis-deling, felles ramme­avtaler nasjonale (Forsvarsbygg, Helse-foretak), kunnskaps­overføring fra Areal/Fritzøe (margin) til Braa.' },
      { tema: 'SA-felles infrastruktur',    tekst: 'Forsikringsavtaler (Gjensidige/If/Tryg/Fremtind), HR (Visma Lønn 5.0), SA Læring, innkjøp (trelast/festemidler), M&A-team, revisor.' },
    ],

    sa_verdiloeftet: [
      { tema: 'Kapital',     tekst: 'SA-konserninnskudd kan finansiere geo-utvidelse og M&A. 25–120 MNOK ramme avhengig av scenario.' },
      { tema: 'Forsikring',  tekst: 'SA Forsikring distribuerer 24h-vakt forsikringsskader via Gjensidige/If/Tryg/Fremtind. 22+ MNOK årlig ramp på offensiv-banen.' },
      { tema: 'Læring',      tekst: 'SA Læring-platform, lærling-opplegg, sertifiseringer (lav-VOC, BIM/VDC, energi-rehab).' },
      { tema: 'Innkjøp',     tekst: 'SA-konsernavtaler reduserer materialkostnad 3–5 % (trelast, festemidler, maling).' },
      { tema: 'M&A',         tekst: 'Konsern-team gjør screening, due diligence og integrasjon. Skalerbar pipeline.' },
      { tema: 'HR',          tekst: 'Felles rekrutterer, onboarding-platform, lønnssystem, succession planning.' },
    ],

    swot: {
      styrker: [
        '3 selskaper · 175 MNOK omsetning · 91 ansatte (2024-baseline)',
        'Fritzøe + Areal samlet er rang #2 i Bodø ROT-marked på 2 346 MNOK',
        'Komplementære fagprofiler dekker bredt ROT-spekter — 90 %+ av offentlig + forsikring',
        'Felles styreleder og governance-struktur',
        'Eksisterende forsikrings­avtaler med Gjensidige/If/Tryg/Fremtind',
        'Fast SA-konsern­team for HR/læring/innkjøp/M&A',
      ],
      svakheter: [
        'Liten skala vs landsdekkende aktører (Veidekke/NCC)',
        'Konsern-EK 16,2 MNOK begrenser stor M&A',
        'Braa drar vektet konsern-margin ned (0,6 %)',
        'Forsikrings­strøm ikke aktivert i porteføljen ennå',
        'Fragmentert governance: 3 styrer + SA-styret',
      ],
      muligheter: [
        'Forsikrings­strøm 22+ MNOK årlig ramp på tvers av tre selskaper',
        'M&A-konsolidering i fragmentert ROT-marked Nord/Midt',
        'Energi-rehab marked vekstfase (TEK17, EU EPBD)',
        'Geografiske hvit-flekker: Salten, Innherred, Helgeland, Lofoten',
        'Mulig konsolidering Fritzøe+Areal (2028 review)',
      ],
      trusler: [
        'Renteoppgang reduserer kommunale ROT-budsjetter',
        'Veidekke/NCC kan respondere med oppkjøp i regionene',
        'Strukturell fagarbeider­mangel begrenser vekst',
        'Regulatoriske endringer for SA Forsikrings­distribusjon',
        'Fortsatt lav margin Braa tærer på solid EK over tid',
      ],
    },

    pestel: [
      { kat: 'Politikk / juridisk', tekst: 'TEK17, EU EPBD, sirkulær­økonomi-forskrift driver ROT-volum nasjonalt', tone: 'opp' },
      { kat: 'Økonomi',             tekst: 'Igangsatte boliger Norge under press. ROT relativt stabilt. Renteoppgang er hovedrisiko', tone: 'flat' },
      { kat: 'Sosialt',             tekst: 'Lokalt næringsliv-imperative, lærlingplikt, økt fokus på lokal verdiskaping', tone: 'opp' },
      { kat: 'Teknologi',           tekst: 'Digital anbudsplatform, BIM/VDC, AI-screening senker overhead', tone: 'opp' },
      { kat: 'Miljø',               tekst: 'Sirkulær ombruk, energi-rehab og passivhus-rehab — innkjøps­kriterium offentlig', tone: 'opp' },
    ],

    horisonter: {
      h1: {
        tittel: 'Konsolidering & felles verdiløfte',
        periode: '2026',
        fokus: 'Aktivere SA-felles tjenester (HR/læring/innkjøp). Konsolidert kvartalsrapportering. Hjelpe Braa løfte margin. Pilot­aktivering forsikrings­strøm.',
        scenario: 'Base',
      },
      h2: {
        tittel: 'Forsikring & første M&A',
        periode: '2027–2028',
        fokus: 'Full forsikrings­strøm-aktivering på alle tre. Første konsern-M&A (Salten + Innherred). Marginløft Braa fullført.',
        scenario: 'Offensiv',
      },
      h3: {
        tittel: 'Skalert portefølje',
        periode: '2029+',
        fokus: '5–7 selskaper i porteføljen. Ledende stilling Nord-/Midt-Norge ROT. Vurder Fritzøe+Areal-fusjon. Børs-/exit-vurdering.',
        scenario: 'Bull',
      },
    },

    initiativer: [
      { nr: 1, navn: 'Konsolidert konsern-rapportering (kvartal)',          ansoff: 'Markedspenetrasjon', horisont: 'H1',    ansvarlig: 'SA-konsern',           mal_2029: 'Automatisert kvartalsrapport',  scenario: 'Base+',     fremdrift_pct: 40, status: 'pa-sporet',     siste_oppdatering: '2026-04-20', siste_kommentar: 'Dashboard-portal etablert (denne). Q1 2026 ferdig manuelt' },
      { nr: 2, navn: 'Aktivere forsikrings­strøm alle 3 selskaper',          ansoff: 'Produktutvikling',   horisont: 'H1–H2', ansvarlig: 'SA Forsikring + DLer', mal_2029: '22 MNOK/år samlet',             scenario: 'Base+',     fremdrift_pct: 10, status: 'i-planlegging', siste_oppdatering: '2026-04-15', siste_kommentar: 'Pilot Strindveien 102 (Braa/Gjensidige) frist 2. mai. Ramp Q3 2026' },
      { nr: 3, navn: 'SA Læring-platform full utrulling',                    ansoff: 'Markedspenetrasjon', horisont: 'H1',    ansvarlig: 'SA-konsern HR',         mal_2029: '100 % deltakelse 91 ansatte',   scenario: 'Base+',     fremdrift_pct: 25, status: 'pa-sporet',     siste_oppdatering: '2026-04-10', siste_kommentar: 'Onboarding ferdig Bodø. Trondheim Q3 2026' },
      { nr: 4, navn: 'Felles innkjøps­avtaler (trelast, festemidler, maling)', ansoff: 'Markedspenetrasjon', horisont: 'H1',    ansvarlig: 'SA-konsern innkjøp',    mal_2029: '−4 % materialkostnad',          scenario: 'Base+',     fremdrift_pct: 60, status: 'pa-sporet',     siste_oppdatering: '2026-04-25', siste_kommentar: 'Trelast-avtale signert. Festemidler i prosess' },
      { nr: 5, navn: 'Marginløfts-program (Braa first, deretter benchmark)', ansoff: 'Markedspenetrasjon', horisont: 'H1–H2', ansvarlig: 'SA + DL Trondheim',    mal_2029: 'Konsern-margin ≥ 7 %',          scenario: 'Base+',     fremdrift_pct: 30, status: 'pa-sporet',     siste_oppdatering: '2026-04-28', siste_kommentar: 'Kalkulasjons­program Braa startet. Q3-benchmark planlagt' },
      { nr: 6, navn: 'M&A-screening pipeline kontinuerlig',                  ansoff: 'Diversifisering',    horisont: 'H2+',   ansvarlig: 'SA-konsern + styre',    mal_2029: '3–5 i screening, 2–4 fullført', scenario: 'Offensiv+', fremdrift_pct: 15, status: 'i-planlegging', siste_oppdatering: '2026-04-12', siste_kommentar: 'Screening Bodø+Trondheim ferdig. Aktive kandidater identifisert' },
      { nr: 7, navn: 'Vurder Fritzøe-Areal-fusjon (review-punkt 2028)',       ansoff: 'Diversifisering',    horisont: 'H3',    ansvarlig: 'SA-konsern + styrer',   mal_2029: 'Beslutning tatt',               scenario: 'Bull+',     fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'Forutsetter modne case for synergier — vurderes 2028' },
    ],

    strategy_map: {
      finansielt: [
        { mal: 'Konsern-omsetning',          baseline: '175 MNOK (2024)', mal_2029: '263 / 372 / 519 MNOK (Base/Off/Bull)', status: 'pa-sporet',  trend: 'opp' },
        { mal: 'Vektet driftsmargin',         baseline: '5,5 %',           mal_2029: '7,0 / 7,5 / 8,0 %',                    status: 'risiko',     trend: 'flat' },
        { mal: 'Konsern-EK',                  baseline: '16,2 MNOK (2024)', mal_2029: '≥ 35 MNOK',                            status: 'pa-sporet',  trend: 'opp' },
      ],
      kunde: [
        { mal: 'Vektet hit-rate',            baseline: '71 %',            mal_2029: '≥ 75 %',                               status: 'pa-sporet',    trend: 'flat' },
        { mal: 'Forsikrings­andel av total',  baseline: '0 %',             mal_2029: '15–20 %',                              status: 'ikke-startet', trend: null  },
        { mal: 'Antall geografier',          baseline: '2 (Bodø+Trondheim)', mal_2029: '4–6',                                status: 'ikke-startet', trend: null  },
      ],
      prosess: [
        { mal: 'M&A-pipeline størrelse',      baseline: '0 aktive',         mal_2029: '3–5 i screening',                      status: 'i-planlegging', trend: 'opp' },
        { mal: 'Konsern-rapportering tid',   baseline: 'ad hoc',           mal_2029: 'Kvartal automatisert',                 status: 'pa-sporet',     trend: 'opp' },
        { mal: 'CoBrief dekning på tvers',   baseline: '0 %',              mal_2029: '100 %',                                status: 'ikke-startet',  trend: null  },
      ],
      laering: [
        { mal: 'Total lærlinger',            baseline: '7+ (estimat)',     mal_2029: '17 (8+4+5)',                           status: 'pa-sporet',     trend: 'opp' },
        { mal: 'SA Læring-deltakelse',       baseline: 'ad hoc',           mal_2029: '100 % av 91 ansatte',                  status: 'pa-sporet',     trend: 'opp' },
        { mal: 'Successor identifisert (DL)', baseline: '0 av 3',           mal_2029: '3 av 3',                               status: 'ikke-startet',  trend: null  },
      ],
    },
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

    // 2025 baseline — svakt opp fra 2024 (+5 % omsetning, samme lønnsomhet).
    // Brukes som startpunkt for strategiske scenarioer.
    regnskap_2025: {
      omsetning_mnok: 75.64,
      driftsresultat_mnok: 5.82,
      driftsmargin_pct: 7.7,
      arsresultat_mnok: 4.63,
      ek_mnok: 6.11,
      ansatte: 31,
    },

    historikk: { y2022: 60, y2023: 66, y2024: 72, y2025: 76 },

    // Bemanning 2025 — kun tømrere, snekkere og lærlinger (ingen malere)
    bemanning_2025: {
      tomrere: 18,
      snekkere: 8,
      laerlinger: 5,
      total: 31,
    },

    // Strategi-dokument — situasjonsanalyse, horisonter, initiativer, målbilde.
    // Brukes av strategi/strategi-doc.html.
    strategi: {
      intensjon: 'Bli Saltens foretrukne ROT-partner for offentlig sektor, forsikringsskader og borettslag — gjennom fagdyktig håndverk, leveringssikkerhet og SA-konsernsynergier.',
      intensjon_kort: 'Saltens foretrukne ROT-partner',

      swot: {
        styrker: [
          'Markedsrang #2 i Bodø ROT (Fritzøe+Areal samlet) — kun GJ Bygg over (ROT-justert)',
          'EBITDA 8,2 % (Fritzøe + Areal samlet) klart over bransjesnittet — 3 av 9 byggmestere hadde tap 2024',
          'Markedsandel 4,4–5,0 % med vekst +46 % vs marked +28 % (2020–2024) — tar markedsandeler',
          'ROT-andel 65 % — beskyttet mot konjunktur (mens nybygg-volum NACE 41 falt −7,2 % i 2024)',
          '5 lærlinger av 31 — aktivt opplæringsmiljø i et marked med −14 % ROT-sysselsatte siden 2019',
          'Nylig konsernintegrert (juni 2024) med tilgang til SA-ressurser',
        ],
        svakheter: [
          'Lav egenkapital: 1,48 MNOK (2024), 6,1 MNOK (2025)',
          'Konsentrert i Bodø — ingen geografisk diversifisering',
          'Forsikringsstrøm ikke aktivert ennå (0 MNOK 2025)',
          'Manuell anbudsprosess før CoBrief-utrulling',
          'Ingen formaliserte rammeavtaler med offentlige nøkkel­kunder',
        ],
        muligheter: [
          'Bodø ROT-marked totalt 2 346 MNOK (2024) — Fritzøe+Areal har 5 % i dag, rom for å doble',
          'SA forsikringsstrøm ramper 10–22 MNOK/år for Bodø-byen',
          'EU EPBD og TEK17-skjerping driver energi-rehab',
          'Kommunalt vedlikeholdsetterslep i Salten estimert 2–3 mrd NOK',
          'M&A-leads i Bodø: Snekkern (−16 % EBITDA), Bendixen (−9,7 %), Bodø Glass (−22 %) — strukturelt svake',
          'Fauske/Saltdal/Sørfold/Steigen mangler dominerende ROT-aktør',
        ],
        trusler: [
          'Rentepress reduserer kommunale ROT-budsjetter (NACE 43 volum −2,9 % i 2025)',
          'Strukturell fagarbeider­mangel — Bodø ROT-sysselsatte −14 % siden 2019',
          'Nabokommune-konkurrenter byr på større oppdrag: Fauskebygg (54 ans), Moldjord (52 ans)',
          'Volatile materialpriser (trelast, isolasjon)',
          'Tap av nøkkelpersonell (DL/kalkulator) ville treffe hardt',
        ],
      },

      pestel: [
        { kat: 'Politikk / juridisk', tekst: 'TEK17, EU EPBD, sirkulærøkonomi-forskrift øker ROT-volum', tone: 'opp' },
        { kat: 'Økonomi',             tekst: 'Igangsatte boliger Nordland −38 % siden 2020. ROT relativt stabilt', tone: 'ned' },
        { kat: 'Sosialt',             tekst: 'Lokalt næringsliv-imperative, lærlingplikt i offentlige anbud', tone: 'opp' },
        { kat: 'Teknologi',           tekst: 'Mercell/Doffin/CoBrief modnes, BIM-light-verktøy for ROT', tone: 'opp' },
        { kat: 'Miljø',               tekst: 'Energi-rehab + sirkulær ombruk gir ny vekstmotor', tone: 'opp' },
      ],

      horisonter: {
        h1: {
          tittel: 'Forsvar & optimalisering',
          periode: '2026',
          fokus: 'Kjernemarked Bodø. Anbudsdisiplin, marginbeskyttelse, lærling-rekruttering.',
          scenario: 'Base',
        },
        h2: {
          tittel: 'Utvidelse',
          periode: '2027–2028',
          fokus: 'Salten geografisk, forsikringsstrøm via SA, energi-rehab pakker, første oppkjøp.',
          scenario: 'Offensiv',
        },
        h3: {
          tittel: 'Skalering',
          periode: '2029+',
          fokus: 'Helgeland/Lofoten-Vesterålen, ledende ROT-aktør i Nordland, evt. integrering med Areal.',
          scenario: 'Bull',
        },
      },

      initiativer: [
        { nr: 1, navn: 'Anbudsdisiplin + AI-screening (CoBrief)',           ansoff: 'Markedspenetrasjon', horisont: 'H1',    ansvarlig: 'DL',                  mal_2029: 'Hit-rate ≥ 75 %',         scenario: 'Base+',     fremdrift_pct: 15, status: 'i-planlegging', siste_oppdatering: '2026-04-15', siste_kommentar: 'CoBrief-implementering avklart, utrulling planlagt Q3 2026' },
        { nr: 2, navn: 'Rammeavtaler offentlig sektor',                      ansoff: 'Markedspenetrasjon', horisont: 'H1',    ansvarlig: 'DL + kalkulator',     mal_2029: '4 aktive ramme',          scenario: 'Base+',     fremdrift_pct: 35, status: 'pa-sporet',     siste_oppdatering: '2026-04-22', siste_kommentar: 'Forsvarsbygg-rammen aktiv. Helse Nord RHF i pipeline (frist 12. juni)' },
        { nr: 3, navn: 'Lærlingprogram 5 → 8',                               ansoff: 'Markedspenetrasjon', horisont: 'H1–H2', ansvarlig: 'DL + SA Læring',      mal_2029: '8 lærlinger',             scenario: 'Base+',     fremdrift_pct: 50, status: 'pa-sporet',     siste_oppdatering: '2026-04-10', siste_kommentar: '5 av 8 på plass. 2 nye signert, oppstart Q3 2026' },
        { nr: 4, navn: 'Forsikringsstrøm via SA',                            ansoff: 'Produktutvikling',   horisont: 'H2',    ansvarlig: 'DL + SA Forsikring',  mal_2029: '6 MNOK forsikring',       scenario: 'Offensiv+', fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'Aktiveres ved valg av Offensiv-scenario' },
        { nr: 5, navn: 'Energi-rehab pakke (TEK17/EPBD)',                    ansoff: 'Produktutvikling',   horisont: 'H2',    ansvarlig: 'DL + kalkulator',     mal_2029: '12 MNOK pakkeomsetning',  scenario: 'Offensiv+', fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'Krever konsept-utvikling i Q4 2026' },
        { nr: 6, navn: 'Salten satellitt (Fauske/Saltdal/Sørfold/Steigen)',  ansoff: 'Markedsutvikling',   horisont: 'H2–H3', ansvarlig: 'DL + styre',          mal_2029: '1 satellitt-team',        scenario: 'Offensiv+', fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'Forutsetter SA-konserninnskudd 15–20 MNOK' },
        { nr: 7, navn: 'M&A 1–2 oppkjøp i Salten',                            ansoff: 'Diversifisering',    horisont: 'H3',    ansvarlig: 'SA-konsern + styre',  mal_2029: '1 fullført, 1 i DD',      scenario: 'Offensiv+', fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'M&A-screening foreslår Snekkern AS som kandidat (informasjon)' },
      ],

      strategy_map: {
        finansielt: [
          { mal: 'Omsetning',              baseline: '76 MNOK (2025)', mal_2029: '92 / 141 MNOK (Base/Off)', status: 'pa-sporet',  trend: 'opp' },
          { mal: 'Driftsmargin',           baseline: '7,7 %',          mal_2029: '7,7 % / 7,8 %',            status: 'pa-sporet',  trend: 'flat' },
          { mal: 'Egenkapital',            baseline: '6,1 MNOK (2025)',mal_2029: '≥ 12 MNOK',                status: 'pa-sporet',  trend: 'opp' },
        ],
        kunde: [
          { mal: 'Hit-rate',               baseline: '72 %',           mal_2029: '≥ 75 %',                   status: 'pa-sporet',  trend: 'flat' },
          { mal: 'NPS',                    baseline: 'ikke målt',      mal_2029: '≥ 50',                     status: 'ikke-malt',  trend: null  },
          { mal: 'Andel rammeavtaler',     baseline: '< 25 %',         mal_2029: '≥ 40 %',                   status: 'pa-sporet',  trend: 'opp' },
        ],
        prosess: [
          { mal: 'Anbud time-to-tilbud',   baseline: '14 d snitt',     mal_2029: '≤ 10 d (−30 %)',           status: 'pa-sporet',  trend: 'flat' },
          { mal: 'Prosjektmargin-avvik',   baseline: '> 5 %',          mal_2029: '≤ 5 %',                    status: 'risiko',     trend: 'flat' },
          { mal: 'CoBrief-screening dekning', baseline: '0 %',         mal_2029: '100 %',                    status: 'ikke-startet', trend: null },
        ],
        laering: [
          { mal: 'Lærlinger',              baseline: '5',              mal_2029: '8',                        status: 'pa-sporet',  trend: 'opp' },
          { mal: 'SA Læring-deltakelse',   baseline: 'ikke målt',      mal_2029: '100 %',                    status: 'ikke-malt',  trend: null  },
          { mal: 'Nøkkelpersonell-tap',    baseline: '0',              mal_2029: '0',                        status: 'oppnaadd',   trend: 'flat' },
        ],
      },
    },

    // Strategi: Base case som uavhengig fundament for Fritzøe.
    // 5 % årlig vekst på omsetning, lønnsomhet konstant 7,7 %, bemanning uendret.
    // Offensiv og Bull bygger på dette ved å legge til geografi-, M&A- og
    // forsikringsstrøm-deltaer.
    base_case: {
      navn: 'Base — Fritzøe (uavhengig fundament)',
      cagr_pct: 5,
      // Omsetning i MNOK — 75,64 i 2025 + 5 % per år
      rot_2026: 79, rot_2027: 83, rot_2028: 88, rot_2029: 92,
      forsikring_2026: 0, forsikring_2027: 0, forsikring_2028: 0, forsikring_2029: 0,
      ebit_margin_pct: 7.7,
      ebit_margin_2029_pct: 7.7,
      ansatte_2026: 31, ansatte_2027: 31, ansatte_2028: 31, ansatte_2029: 31,
      kapitalbehov: 'Drift / kontantstrøm',
      beskrivelse: 'Holder dagens posisjon i Bodø: tømrere, snekkere og lærlinger uten utvidelse. 5 % årlig vekst på eksisterende ROT-portefølje, lønnsomhet stabil på 7,7 %, bemanning uendret. Offensiv og Bull legger geografi- og M&A-deltaer på toppen av denne banen.',
    },

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

    strategi: {
      intensjon: 'Bli Saltens foretrukne maler- og overflate­leverandør for forsikrings­skader, offentlig sektor og borettslag — gjennom rask responstid, høy hit-rate og spisset fagkompetanse.',
      intensjon_kort: 'Saltens spissede overflate­spesialist',

      swot: {
        styrker: [
          'Markedsleder maler/overflate i Bodø — eneste lønnsomme aktør i segmentet 2024',
          'EBITDA 7,5 % mens Bendixen (−9,7 %), Bodø Glass (−22 %) og Snekkern (−16 %) hadde tap',
          'Hit-rate 75 % — best i SA-porteføljen',
          'Felles DL og kontor med Fritzøe (Påls vei 1B) — lave overhead-kostnader',
          'ROT-andel 58 % gir konjunktur-buffer',
        ],
        svakheter: [
          'Liten egenkapital: 1,30 MNOK (2024)',
          'Mistet Saltstraumen-anbud på pris (2025) — pris-disiplin under press',
          'Sesongavhengighet (utvendig maling konsentrert mai–september)',
          'Lite forsikringsstrøm aktivert (potensial via SA Forsikring)',
          'Smalere fagprofil enn Fritzøe — mindre tverrgående salg',
        ],
        muligheter: [
          'Snekker+maler+glass-segment 256 MNOK (Bodø) — Areal står for 18 % nå, kan ta mer',
          'Konkurrenter med tap → naturlige M&A-mål: Bendixen (32 MNOK) eller Bodø Glass (37 MNOK)',
          'Forsikringsstrøm 24h-vakt for vannskade-overflate',
          'Borettslag/sameier vedlikeholdsbølge (2010-talls byggemasse)',
          'Sirkulær overflate (gjenbruk maling, lav-VOC) som differensiator',
          'Rammeavtale Bodø kommune maler/overflate 2027–2030',
          'UE-allianse med Fritzøe inn mot Salten-utvidelse',
        ],
        trusler: [
          'Nord-Norsk Maler aggressiv prising (vant Saltstraumen 2025)',
          'Bodø Malermester etablert med 6 anbud/år',
          'Fagarbeidermangel — særlig erfarne malere',
          'Material­prisvolatilitet (maling, polyurethan)',
          'Sesong-redusert kapasitet vinter (utvendig)',
        ],
      },

      pestel: [
        { kat: 'Politikk / juridisk', tekst: 'Lav-VOC-krav og helsebetonet maling-regulering driver moderne overflate', tone: 'opp' },
        { kat: 'Økonomi',             tekst: 'ROT-marked stabilt; igangsatte boliger Nordland −38 % (mindre nybygg-overflate)', tone: 'flat' },
        { kat: 'Sosialt',             tekst: 'Borettslag/sameier prioriterer fasade- og overflate-vedlikehold etter EK-styrking', tone: 'opp' },
        { kat: 'Teknologi',           tekst: 'Mercell rammeavtaler + sprøytemaling-utstyr senker timeforbruk per m²', tone: 'opp' },
        { kat: 'Miljø',               tekst: 'Sirkulær overflate (gjenbruk, ombruk) blir innkjøpskriterium i offentlig sektor', tone: 'opp' },
      ],

      horisonter: {
        h1: {
          tittel: 'Hit-rate-forsvar',
          periode: '2026',
          fokus: 'Beskytte 75 % hit-rate, sikre rammeavtale Bodø kommune, lærling-rekruttering maler.',
          scenario: 'Base',
        },
        h2: {
          tittel: 'Forsikring + Salten-allianse',
          periode: '2027–2028',
          fokus: 'Aktivere SA Forsikring 24h-vakt, sirkulær overflate-pilot, UE-allianse med Fritzøe inn mot Salten.',
          scenario: 'Offensiv',
        },
        h3: {
          tittel: 'Egne avdelinger',
          periode: '2029+',
          fokus: 'Egen Salten-avdeling, evt. integrering med Fritzøe under felles SA-Bodø-struktur.',
          scenario: 'Bull',
        },
      },

      initiativer: [
        { nr: 1, navn: 'Hit-rate-disiplin (CoBrief screening)',                   ansoff: 'Markedspenetrasjon', horisont: 'H1',    ansvarlig: 'DL',                    mal_2029: 'Hit-rate ≥ 80 %',         scenario: 'Base+',     fremdrift_pct: 25, status: 'pa-sporet',     siste_oppdatering: '2026-04-18', siste_kommentar: 'Tapsanalyse Saltstraumen 2025 oppsummert. Pris-disiplin innskjerpet' },
        { nr: 2, navn: 'Rammeavtale Bodø kommune maler/overflate',                ansoff: 'Markedspenetrasjon', horisont: 'H1',    ansvarlig: 'DL + kalkulator',       mal_2029: '3 aktive ramme',          scenario: 'Base+',     fremdrift_pct: 20, status: 'i-planlegging', siste_oppdatering: '2026-04-25', siste_kommentar: 'Doffin-anbud rammeavtale 2027–2030 (frist 20. juni). Match 100 %' },
        { nr: 3, navn: 'Lærling- og rekrutteringsprogram maler',                  ansoff: 'Markedspenetrasjon', horisont: 'H1–H2', ansvarlig: 'DL + SA Læring',        mal_2029: '4 lærlinger',             scenario: 'Base+',     fremdrift_pct: 30, status: 'i-planlegging', siste_oppdatering: '2026-04-08', siste_kommentar: '2 av 4 nå. Rekruttering pågår, samarbeid med Bodø vgs maler-linje' },
        { nr: 4, navn: 'Forsikrings­skade 24h-vakt (vannskade overflate)',        ansoff: 'Produktutvikling',   horisont: 'H2',    ansvarlig: 'DL + SA Forsikring',    mal_2029: '8 MNOK forsikring',       scenario: 'Offensiv+', fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'Krever vakt-rotasjon med Fritzøe og Areal samkjørt' },
        { nr: 5, navn: 'Sirkulær overflate-pakke (lav-VOC, gjenbruk)',            ansoff: 'Produktutvikling',   horisont: 'H2',    ansvarlig: 'DL + kalkulator',       mal_2029: '6 MNOK pakkeomsetning',   scenario: 'Offensiv+', fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'Sertifisering lav-VOC må påbegynnes Q1 2027' },
        { nr: 6, navn: 'UE-allianse Fritzøe inn mot Salten',                       ansoff: 'Markedsutvikling',   horisont: 'H2',    ansvarlig: 'DL + Fritzøe DL',       mal_2029: '4 MNOK UE-omsetning',     scenario: 'Offensiv+', fremdrift_pct: 5,  status: 'i-planlegging', siste_oppdatering: '2026-04-12', siste_kommentar: 'Uformelt avklart med Brynjar — formaliseres når Fritzøe åpner Salten' },
        { nr: 7, navn: 'Egen Salten-avdeling',                                     ansoff: 'Markedsutvikling',   horisont: 'H3',    ansvarlig: 'DL + styre',            mal_2029: '1 satellitt-team',        scenario: 'Offensiv+', fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'Avhenger av suksess UE-allianse + lokal etterspørsel' },
      ],

      strategy_map: {
        finansielt: [
          { mal: 'Omsetning',              baseline: '45 MNOK (2024)', mal_2029: 'andel av Bodø-scenario',   status: 'pa-sporet',    trend: 'opp' },
          { mal: 'Driftsmargin',           baseline: '7,5 %',          mal_2029: '≥ 7,5 %',                  status: 'pa-sporet',    trend: 'flat' },
          { mal: 'Egenkapital',            baseline: '1,3 MNOK (2024)',mal_2029: '≥ 8 MNOK',                 status: 'risiko',       trend: 'opp' },
        ],
        kunde: [
          { mal: 'Hit-rate',               baseline: '75 %',           mal_2029: '≥ 80 %',                   status: 'pa-sporet',    trend: 'flat' },
          { mal: 'Forsikrings­responstid',  baseline: 'ikke aktiv',     mal_2029: '≤ 24 t',                   status: 'ikke-startet', trend: null  },
          { mal: 'Andel rammeavtaler',     baseline: '< 30 %',         mal_2029: '≥ 50 %',                   status: 'pa-sporet',    trend: 'opp' },
        ],
        prosess: [
          { mal: 'Anbud time-to-tilbud',   baseline: '12 d snitt',     mal_2029: '≤ 8 d',                    status: 'pa-sporet',    trend: 'flat' },
          { mal: 'Sesong­utjevning kapasitet', baseline: '−30 % vinter', mal_2029: '−15 % vinter',             status: 'risiko',       trend: 'flat' },
          { mal: 'CoBrief-screening dekning', baseline: '0 %',         mal_2029: '100 %',                    status: 'ikke-startet', trend: null  },
        ],
        laering: [
          { mal: 'Lærlinger maler',        baseline: '2',              mal_2029: '4',                        status: 'pa-sporet',    trend: 'flat' },
          { mal: 'Sertifisering lav-VOC',  baseline: '0 av 28',        mal_2029: '12 av 28',                 status: 'ikke-startet', trend: null  },
          { mal: 'Nøkkelpersonell-tap',    baseline: '0',              mal_2029: '0',                        status: 'oppnaadd',     trend: 'flat' },
        ],
      },
    },
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

    strategi: {
      intensjon: 'Bli Trøndelags ledende totalrehab-aktør for offentlig sektor og forsikrings­skader — gjennom radikalt marginløft, kalkulasjons­disiplin og prosjekt­kontroll.',
      intensjon_kort: 'Trøndelags ledende totalrehab-aktør',

      swot: {
        styrker: [
          'Sterk EK 13,46 MNOK — solid finansieringskapasitet',
          '32 ansatte (størst i SA-porteføljen) gir prosjektkapasitet',
          'Bredde: snekker + total-rehab dekker større prosjekter',
          'Trondheim-marked større enn Bodø (oms 22 mrd vs 6 mrd ROT)',
          'Etablert med Forsvarsbygg og fylkeskommunale ramme',
        ],
        svakheter: [
          'Kritisk lav driftsmargin 0,6 % — bør være 6 %+',
          'Svak kalkulasjonsdisiplin: Lade barnehage 348 t / 25 % fremdrift',
          'Pipeline 5,9 MNOK mot mål 18 MNOK (33 %)',
          'Hit-rate 67 % under mål 70 %',
          'Prosjekt-kontroll svak — minst én aktiv red-flagg',
        ],
        muligheter: [
          'SA forsikringsstrøm 12–25 MNOK/år (Trondheim-segment)',
          'Helse Midt-Norge RHF rammeavtale 2027–2030 (100 % match)',
          'Innherred + Stjørdal-Fosen lite dekket av total-rehab-aktører',
          'NTNU + St. Olavs hospital store ROT-volum',
          'Marginløft fra 0,6 → 6 % gir +3 MNOK EBIT på samme volum',
        ],
        trusler: [
          'Modulvegger Trøndelag aggressiv prising',
          'Veidekke/NCC tar større rammer i Trondheim',
          'Fagarbeider-konkurranse fra større aktører',
          'Kontinuerlige prosjekt­avvik kan gi konsekvens­kostnader',
          'Fortsatt lav margin tærer på solid EK over tid',
        ],
      },

      pestel: [
        { kat: 'Politikk / juridisk', tekst: 'TEK17, EU EPBD og nye energikrav driver total-rehab på offentlig bygg', tone: 'opp' },
        { kat: 'Økonomi',             tekst: 'Igangsatte boliger Trøndelag −23 % siden 2020. ROT-marked stabilt', tone: 'flat' },
        { kat: 'Sosialt',             tekst: 'Lærlingplikt og lokalt næringsliv-imperative i offentlig anbud', tone: 'opp' },
        { kat: 'Teknologi',           tekst: 'BIM/VDC blir standard for total-rehab — krever investering, gir margin', tone: 'opp' },
        { kat: 'Miljø',               tekst: 'Sirkulær ombruk, energi-rehab og passivhus-rehab vokser raskt', tone: 'opp' },
      ],

      horisonter: {
        h1: {
          tittel: 'Marginløft & disiplin',
          periode: '2026',
          fokus: 'Marginløft 0,6 → 5 %, kalkulasjons­program, prosjekt­kontroll, sikre Helse Midt-rammen.',
          scenario: 'Base',
        },
        h2: {
          tittel: 'Innherred + forsikring',
          periode: '2027–2028',
          fokus: 'Aktivere SA Forsikring, total-rehab spesialisering, Innherred-utvidelse, første oppkjøp.',
          scenario: 'Offensiv',
        },
        h3: {
          tittel: 'Skalering Midt-Norge',
          periode: '2029+',
          fokus: 'Hele Trøndelag + Møre/Romsdal-grenseland, 2–3 oppkjøp, ledende total-rehab-aktør.',
          scenario: 'Bull',
        },
      },

      initiativer: [
        { nr: 1, navn: 'Marginløft 0,6 → 5 % (kalkulasjons­program)',     ansoff: 'Markedspenetrasjon', horisont: 'H1',    ansvarlig: 'DL + kalkulator',       mal_2029: 'Margin ≥ 7 %',            scenario: 'Base+',     fremdrift_pct: 30, status: 'pa-sporet',  siste_oppdatering: '2026-04-28', siste_kommentar: 'Kalkulasjons­program startet Q1. Første benchmarks vs Bodø Q3 2026' },
        { nr: 2, navn: 'Prosjekt­kontroll (timeforbruk vs plan)',          ansoff: 'Markedspenetrasjon', horisont: 'H1',    ansvarlig: 'DL + PL',               mal_2029: 'Avvik ≤ 5 %',             scenario: 'Base+',     fremdrift_pct: 25, status: 'risiko',     siste_oppdatering: '2026-04-30', siste_kommentar: 'Lade barnehage red-flagg fortsatt åpent (348 t / 25 %). Rotårsak utredes' },
        { nr: 3, navn: 'Rammeavtale Helse Midt-Norge / NTNU',            ansoff: 'Markedspenetrasjon', horisont: 'H1–H2', ansvarlig: 'DL',                     mal_2029: '3 aktive ramme',          scenario: 'Base+',     fremdrift_pct: 20, status: 'i-planlegging', siste_oppdatering: '2026-04-14', siste_kommentar: 'Doffin-anbud Helse Midt-Norge 2027–2030 (frist 14. juni). Match 100 %' },
        { nr: 4, navn: 'Forsikringsstrøm via SA',                          ansoff: 'Produktutvikling',   horisont: 'H2',    ansvarlig: 'DL + SA Forsikring',    mal_2029: '12 MNOK forsikring',      scenario: 'Offensiv+', fremdrift_pct: 5,  status: 'i-planlegging', siste_oppdatering: '2026-04-02', siste_kommentar: 'Vannskade Strindveien 102 (Gjensidige) er pilot-sak — frist 2. mai' },
        { nr: 5, navn: 'Total-rehab spesialisering (BIM-light)',           ansoff: 'Produktutvikling',   horisont: 'H2',    ansvarlig: 'DL + kalkulator',       mal_2029: '18 MNOK pakkeomsetning',  scenario: 'Offensiv+', fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'Forutsetter vellykket marginløft (init #1). Investering i BIM-verktøy 2027' },
        { nr: 6, navn: 'Innherred-utvidelse (Stjørdal/Fosen)',              ansoff: 'Markedsutvikling',   horisont: 'H2–H3', ansvarlig: 'DL + styre',             mal_2029: '1 satellitt-team',        scenario: 'Offensiv+', fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'M&A-screening Trondheim viser Modulvegger og Knudsen som kandidater' },
        { nr: 7, navn: 'M&A 1 oppkjøp Innherred/Møre',                      ansoff: 'Diversifisering',    horisont: 'H3',    ansvarlig: 'SA-konsern + styre',    mal_2029: '1 fullført',              scenario: 'Offensiv+', fremdrift_pct: 0,  status: 'ikke-startet',  siste_oppdatering: null,         siste_kommentar: 'Forutsetter SA-konsernkapital. Tidligst Q3 2027' },
      ],

      strategy_map: {
        finansielt: [
          { mal: 'Omsetning',              baseline: '58 MNOK (2024)', mal_2029: '77 / 102 MNOK (Base/Off)', status: 'pa-sporet',    trend: 'opp' },
          { mal: 'Driftsmargin',           baseline: '0,6 %',          mal_2029: '5,5 % / 7,0 %',            status: 'risiko',       trend: 'flat' },
          { mal: 'Egenkapital',            baseline: '13,5 MNOK (2024)', mal_2029: '≥ 18 MNOK',              status: 'oppnaadd',     trend: 'flat' },
        ],
        kunde: [
          { mal: 'Hit-rate',               baseline: '67 %',           mal_2029: '≥ 75 %',                   status: 'risiko',       trend: 'flat' },
          { mal: 'NPS',                    baseline: 'ikke målt',      mal_2029: '≥ 40',                     status: 'ikke-malt',    trend: null  },
          { mal: 'Andel rammeavtaler',     baseline: '< 20 %',         mal_2029: '≥ 35 %',                   status: 'risiko',       trend: 'flat' },
        ],
        prosess: [
          { mal: 'Prosjekt­margin-avvik',   baseline: '> 8 %',          mal_2029: '≤ 5 %',                    status: 'risiko',       trend: 'flat' },
          { mal: 'Kalkulasjons­presisjon',   baseline: '−5 %',           mal_2029: '±2 %',                     status: 'risiko',       trend: 'flat' },
          { mal: 'Red-flagg prosjekter',    baseline: '1 av 12',        mal_2029: '0 av aktive',              status: 'risiko',       trend: 'flat' },
        ],
        laering: [
          { mal: 'Lærlinger',              baseline: 'ikke kartlagt',  mal_2029: '5',                        status: 'ikke-malt',    trend: null  },
          { mal: 'BIM/VDC-sertifisering',  baseline: '0 av 32',        mal_2029: '8 av 32',                  status: 'ikke-startet', trend: null  },
          { mal: 'Nøkkelpersonell-tap',    baseline: '0',              mal_2029: '0',                        status: 'oppnaadd',     trend: 'flat' },
        ],
      },
    },
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

// Returner strategi-objekt for valgt scope (selskap eller konsern). By-scope har
// foreløpig ikke egen strategi — returnerer null som ber UI om å falle tilbake.
function getStrategiForScope(scope = null) {
  scope = scope || getActiveScope();
  if (scope.type === 'selskap') return getSelskap(scope.id)?.strategi || null;
  if (scope.type === 'konsern') return KONSERN.strategi || null;
  return null;
}

// Returner scenario-metadata (navn, cagr, margin, ansatte, kapital, beskrivelse)
// for valgt scope. Foretrekker selskap-spesifikt base_case når relevant,
// ellers faller tilbake til by-scenarioet.
function getScenarioMetaForScope(scenario, scope = null) {
  scope = scope || getActiveScope();
  if (scope.type === 'selskap') {
    const s = getSelskap(scope.id);
    if (!s) return null;
    const selskapScenario = scenario === 'base' ? s.base_case : null;
    if (selskapScenario) return selskapScenario;
    const by = BYER.find(b => b.id === s.by);
    return by?.scenarioer?.[scenario] || null;
  }
  if (scope.type === 'by') {
    return getBy(scope.id)?.scenarioer?.[scenario] || null;
  }
  return null; // konsern — aggregeres i UI
}

function getScenarioForScope(scenario, year, scope = null) {
  scope = scope || getActiveScope();
  // Selskap: foretrekk selskap-spesifikt scenario (f.eks. Fritzøe sin base_case)
  // hvis det finnes; ellers skaler by-scenarioet etter omsetnings-andel.
  if (scope.type === 'selskap') {
    const s = getSelskap(scope.id);
    if (!s) return { rot: 0, forsikring: 0, total: 0 };
    const selskapScenario = scenario === 'base' ? s.base_case : null;
    if (selskapScenario) {
      const rot = selskapScenario[`rot_${year}`] || 0;
      const forsikring = selskapScenario[`forsikring_${year}`] || 0;
      return { rot, forsikring, total: rot + forsikring };
    }
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
// Sidebar bruker dette til å bygge riktige href-er.
// Strategi-modulene ligger i undermappa strategi/. Sider i den mappa
// setter window.SA_BASE = '../' før denne fila lastes, slik at lenker
// til rot-sider får riktig prefiks.
function _routePath(modul, scope) {
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
    case 'strategi': return 'strategi/strategi.html';
    case 'strategi-doc': return 'strategi/strategi-doc.html';
    case 'strategi-status': return 'strategi/strategi-status.html';
    case 'scenario': return 'strategi/scenario.html';
    case 'styrerapport': return 'strategi/styrerapport.html';
    case 'ma-screening': return isTrondheim ? 'strategi/ma-screening-trondheim.html' : 'strategi/ma-screening-bodo.html';
    case 'ma-kandidat': return 'strategi/ma-kandidat.html';
    case 'ma-konsern': return 'strategi/ma-konsern.html';
    case 'forsikring': return 'm9-konsekvens.html';
    case 'm5-poweroffice': return 'm5-konsekvens.html';
    case 'epc-satsing': return 'epc-konsekvens.html';
    case 'implementering': return 'implementering.html';
    case 'bransjekart': return isTrondheim ? 'strategi/dashboard-trondheim.html' : 'strategi/bodo-rot-marked.html';
    case 'oversikt': return isTrondheim ? 'strategi/oversikt-trondheim.html' : 'strategi/oversikt.html';
    case 'sa-rapport': return 'strategi/sa-rapport.html';
    default: return 'index.html';
  }
}

function getRouteFor(modul, scope = null) {
  const base = (typeof window !== 'undefined' && window.SA_BASE) ? window.SA_BASE : '';
  const path = _routePath(modul, scope);
  // Hvis vi allerede er i strategi/ og lenken peker dit, drop omveien via roten
  if (base === '../' && path.startsWith('strategi/')) {
    return path.substring('strategi/'.length);
  }
  return base + path;
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

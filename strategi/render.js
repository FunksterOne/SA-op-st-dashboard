// =====================================================================
// strategi-v2 — render helpers
// =====================================================================
// Pure functions: tar (doc, config?) og returnerer HTML-strenger.
// Hver side komponerer egen layout ved å kalle disse i riktig rekkefølge.
// =====================================================================

(function () {
  'use strict';

  // ----------------------------------------------------------------
  // helpers
  // ----------------------------------------------------------------
  function esc(v) {
    if (v == null) return '';
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function fmtMnok(kr) {
    if (kr == null) return '—';
    return (kr / 1000000).toFixed(2).replace('.', ',') + ' M';
  }
  function fmtPct(p) {
    if (p == null) return '—';
    return Number(p).toFixed(1).replace('.', ',') + ' %';
  }
  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    const mns = ['jan','feb','mar','apr','mai','jun','jul','aug','sep','okt','nov','des'];
    return `${d.getDate()}. ${mns[d.getMonth()]} ${d.getFullYear()}`;
  }
  function highlightSerif(text) {
    // For retning kort: italicize one word marked with *star*
    if (!text) return '';
    return esc(text).replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  // ----------------------------------------------------------------
  // PAGE HEADER
  // ----------------------------------------------------------------
  function renderPageHd({ crumb, title, status }) {
    const statusRows = (status || []).map(r => `
      <div class="row">
        <span class="lab">${esc(r.lab)}</span>
        <span class="val ${r.cls || ''}">${esc(r.val)}</span>
      </div>
    `).join('');
    return `
      <div class="page-hd">
        <div>
          <div class="crumb">
            <span class="pill">${esc(crumb.pill || 'Strategisk')}</span>
            <span>${esc(crumb.path)}</span>
          </div>
          <h1>${esc(title)}</h1>
        </div>
        <div class="doc-status">${statusRows}</div>
      </div>
    `;
  }

  // ----------------------------------------------------------------
  // RETNING HERO
  // ----------------------------------------------------------------
  function renderRetning(doc, selskap, scenario) {
    const kort = doc.retning?.kort || 'Retning ikke satt';
    const lang = doc.retning?.lang || '';
    const omsetningMal = scenario?.omsetning_2029_mnok || '—';
    const marginMal = scenario?.driftsmargin_2029_pct;
    const ansatte = scenario?.ansatte_2029 || selskap.ansatte;
    // Treat last word of kort as italic accent
    const kortHtml = kort.replace(/^(.+?)\s+(\S+)$/, '$1 <em>$2</em>');

    return `
      <div class="retning">
        <div>
          <div class="lbl">Retning</div>
          <h2 class="kort">${kortHtml}</h2>
          <p class="lang">${esc(lang)}</p>
        </div>
        <div class="ataglance">
          <div class="item">
            <div class="alab">Omsetningsmål 2029</div>
            <div class="av">${omsetningMal}<span class="unit">MNOK</span></div>
          </div>
          <div class="item">
            <div class="alab">Driftsmarginmål</div>
            <div class="av">${marginMal != null ? marginMal.toFixed(1).replace('.', ',') : '—'}<span class="unit">%</span></div>
          </div>
          <div class="item">
            <div class="alab">Lærlinger 2029</div>
            <div class="av">${(doc.maal || []).find(m => /lærling/i.test(m.navn))?.mal || '—'}<span class="unit">av ${ansatte} ansatte</span></div>
          </div>
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------------------
  // FOKUS list
  // ----------------------------------------------------------------
  function renderFokus(doc) {
    const list = (doc.fokus || []).filter(f => f.aktiv !== false).sort((a, b) => (a.rekkefolge || 0) - (b.rekkefolge || 0));
    if (!list.length) {
      return `
        <div>
          <div class="section-h">
            <h2>Mitt fokus nå</h2>
            <span class="src">Ingen fokuspunkter registrert</span>
          </div>
          <div style="padding:32px;text-align:center;color:var(--muted);background:#fbfaf5;border:1px dashed var(--hair);border-radius:4px">
            DL har ikke lagt inn fokuspunkter for denne perioden enda.
          </div>
        </div>
      `;
    }
    const rows = list.map((f, i) => {
      const meta = f.meta || f.kommentar || '';
      return `
        <div class="fokus-row">
          <div class="nr">${i + 1}</div>
          <div class="txt">${esc(f.tekst)}</div>
          <div class="meta">${esc(meta)}</div>
        </div>
      `;
    }).join('');
    return `
      <div>
        <div class="section-h">
          <h2>Mitt fokus nå</h2>
          <span class="src">${list.length} punkt${list.length === 1 ? '' : 'er'} — det vi snakker om i ledermøtene</span>
        </div>
        <div class="fokus-list">${rows}</div>
      </div>
    `;
  }

  // ----------------------------------------------------------------
  // ÅRSMÅL table
  // ----------------------------------------------------------------
  function renderMaal(doc) {
    const list = doc.maal || [];
    if (!list.length) {
      return `
        <div>
          <div class="section-h">
            <h2>Årsmål</h2>
            <span class="src">Ingen mål registrert</span>
          </div>
        </div>
      `;
    }
    const rows = list.map(m => {
      // Calculate progress: parse first numeric value of naa and mal
      const naaNum = parseFloat(String(m.naa).replace(',', '.').replace(/[^\d.-]/g, ''));
      const malNum = parseFloat(String(m.mal).replace(',', '.').replace(/[^\d.-]/g, ''));
      const pct = (isFinite(naaNum) && isFinite(malNum) && malNum > 0)
        ? Math.min(100, Math.max(0, (naaNum / malNum) * 100))
        : 50;
      return `
        <tr>
          <td class="nm">${esc(m.navn)}</td>
          <td><span class="from-to"><span class="from">${esc(m.naa)}</span><span class="arr">→</span><span class="to">${esc(m.mal)}</span></span></td>
          <td><div class="gbar"><i style="width:${pct.toFixed(0)}%"></i><div class="target" style="left:80%"></div></div></td>
          <td class="due">${fmtDate(m.frist)}</td>
        </tr>
      `;
    }).join('');
    return `
      <div>
        <div class="section-h">
          <h2>Årsmål</h2>
          <span class="src">${list.length} mål · holdes enkelt og målbart</span>
        </div>
        <table class="goals">
          <thead>
            <tr>
              <th>Mål</th>
              <th>Nå → Mål</th>
              <th class="bar-cell">Fremdrift</th>
              <th>Frist</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // ----------------------------------------------------------------
  // ØKONOMI table (Brreg + budsjett)
  // ----------------------------------------------------------------
  function renderOkonomi(doc, selskap) {
    const o = doc.okonomi || {};
    const kilde = o.kilde?.vises_som || 'Brønnøysundregistrene';
    const orgnr = o.kilde?.orgnr || selskap.orgnr;
    const hentet = o.kilde?.sist_hentet || '—';

    const regnRows = (o.regnskap || []).map(r => `
      <tr>
        <td class="first">${esc(r.ar)}${r.fra_brreg ? '<span class="tag brreg">Brreg</span>' : ''}</td>
        <td class="r">${fmtMnok(r.driftsinntekter_kr)}</td>
        <td class="r">${fmtMnok(r.driftsresultat_kr)}</td>
        <td class="r">${fmtPct(r.driftsmargin_pct)}</td>
        <td class="r">${fmtMnok(r.sum_egenkapital_kr)}</td>
      </tr>
    `).join('');

    const bud = o.budsjett || {};
    const budRows = Object.entries(bud).map(([ar, b]) => `
      <tr class="budgetrow">
        <td class="first">${esc(ar)}<span class="tag budsjett">Budsjett</span></td>
        <td class="r">${fmtMnok(b.driftsinntekter_kr)}</td>
        <td class="r">${fmtMnok(b.driftsresultat_kr)}</td>
        <td class="r">${fmtPct(b.driftsmargin_pct)}</td>
        <td class="r">—</td>
      </tr>
    `).join('');

    const note = bud[Object.keys(bud)[0]]?.kommentar || '';

    return `
      <div>
        <div class="section-h">
          <h2>Regnskap og budsjett</h2>
          <span class="src">Kilde: <b>${esc(kilde)}</b> · org.nr ${esc(orgnr)} · hentet ${esc(hentet)}</span>
        </div>
        <table class="financials">
          <thead>
            <tr>
              <th>År</th>
              <th class="r">Omsetning</th>
              <th class="r">Driftsresultat</th>
              <th class="r">Driftsmargin</th>
              <th class="r">Egenkapital</th>
            </tr>
          </thead>
          <tbody>
            ${regnRows}
            ${budRows}
          </tbody>
        </table>
        ${note ? `<p class="fn-note">${esc(note)}</p>` : ''}
      </div>
    `;
  }

  // ----------------------------------------------------------------
  // SWOT (4-column)
  // ----------------------------------------------------------------
  function renderSWOT(doc) {
    const s = doc.bakgrunn?.swot;
    if (!s) {
      return `
        <div>
          <div class="section-h">
            <h2>SWOT</h2>
            <span class="src">Ikke registrert</span>
          </div>
        </div>
      `;
    }
    const cols = [
      { type: 's', lab: 'Styrker',    h: 'Det vi har bygget.',     items: s.styrker || [] },
      { type: 'w', lab: 'Svakheter',  h: 'Det som holder oss tilbake.', items: s.svakheter || [] },
      { type: 'o', lab: 'Muligheter', h: 'Det vi kan ta.',         items: s.muligheter || [] },
      { type: 't', lab: 'Trusler',    h: 'Det vi må følge med på.', items: s.trusler || [] },
    ];
    const colsHtml = cols.map(c => `
      <div class="col" data-type="${c.type}">
        <div class="typ">${esc(c.lab)}</div>
        <h3>${esc(c.h)}</h3>
        <ul>${c.items.map(it => `<li>${esc(it)}</li>`).join('')}</ul>
      </div>
    `).join('');
    return `
      <div>
        <div class="section-h">
          <h2>SWOT — posisjon ${fmtDate(doc.meta?.sist_endret) || 'i dag'}</h2>
          <span class="src">Vurdering · ${esc(doc.meta?.sist_endret_av || 'DL + portal-eier')}</span>
        </div>
        <div class="swot">${colsHtml}</div>
      </div>
    `;
  }

  // ----------------------------------------------------------------
  // THREE HORIZONS timeline
  // ----------------------------------------------------------------
  function renderHorisonter(selskapId) {
    const h = window.SA_CONFIG.horisonter?.[selskapId];
    if (!h?.length) return '';
    const rows = h.map(item => `
      <div class="horizon">
        <div class="h-tag">${esc(item.tag)}</div>
        <h3 class="h-title">${esc(item.tittel)}</h3>
        <div class="h-period">${esc(item.periode)}</div>
        <div class="h-fokus">${esc(item.fokus)}</div>
        <div class="h-scenario">Scenario <b>${esc((item.scenario || '').split('·')[0].trim())}</b>${item.scenario?.includes('·') ? ' · ' + esc(item.scenario.split('·')[1].trim()) : ''}</div>
      </div>
    `).join('');
    return `
      <div>
        <div class="section-h">
          <h2>Tre horisonter — fra effektivisering til skalering</h2>
          <span class="src">Etter McKinsey (3-horizons-modell) · tilpasset selskapet</span>
        </div>
        <div class="horizons">
          <div class="axis">
            <div class="year" style="left:0%">2026</div>
            <div class="now" style="left:14%"></div>
            <div class="year" style="left:25%">2027</div>
            <div class="year" style="left:50%">2028</div>
            <div class="year" style="left:75%">2029</div>
            <div class="year" style="left:100%">2030+</div>
          </div>
          <div class="rows">${rows}</div>
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------------------
  // INITIATIVER table (from doc.tiltak)
  // ----------------------------------------------------------------
  function renderInitiativer(doc) {
    const list = doc.tiltak || [];
    if (!list.length) {
      return `
        <div>
          <div class="section-h">
            <h2>Initiativer</h2>
            <span class="src">Ingen tiltak registrert</span>
          </div>
        </div>
      `;
    }
    const rows = list.map((t, i) => {
      const cls = window.SA_CONFIG.tiltakStatusClass[t.status] || 'ikke';
      const label = window.SA_CONFIG.statusLabels.tiltak[t.status] || t.status;
      const pct = Math.max(0, Math.min(100, t.fremdrift_pct || 0));
      return `
        <tr>
          <td><div class="nrcell">${i + 1}</div></td>
          <td>
            <div class="name">${esc(t.navn)}</div>
            <div class="meta">${esc(t.ansoff || 'Ansoff')} · ${esc(t.horisont || '—')} · ${esc(t.scenario || '—')}</div>
          </td>
          <td><div class="mono">${esc(t.ansvarlig)}</div></td>
          <td><div class="mono">${esc(t.horisont || '—')}</div></td>
          <td><div class="mono">${esc(t.mal_2029 || t.neste_steg?.split('.')[0] || '—')}</div></td>
          <td><span class="status ${cls}">${esc(label)}</span></td>
          <td class="r">
            <div class="mono">${pct} %</div>
            <div class="ibar"><i style="width:${pct}%"></i></div>
          </td>
        </tr>
      `;
    }).join('');
    return `
      <div>
        <div class="section-h">
          <h2>Initiativer</h2>
          <span class="src">${list.length} stk · linket til ansvarlig, mål og status</span>
        </div>
        <table class="inits">
          <thead>
            <tr>
              <th style="width:42px">Nr</th>
              <th>Initiativ</th>
              <th>Ansvarlig</th>
              <th>Horisont</th>
              <th>Mål</th>
              <th>Status</th>
              <th class="r" style="width:140px">Fremdrift</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // ----------------------------------------------------------------
  // SCENARIER (3-way cards)
  // ----------------------------------------------------------------
  function renderScenarier(selskapId) {
    const scs = window.SA_CONFIG.scenarier?.[selskapId];
    if (!scs?.length) return '';
    const cards = scs.map(sc => {
      const idShort = sc.id === 'offensiv' ? 'off' : sc.id;
      const recBadge = sc.anbefalt
        ? `<span class="sc-rec-badge">Anbefalt</span>`
        : '';
      return `
        <div class="sc" data-sc="${idShort}">
          <div class="sc-tag">${esc(sc.tag)}${recBadge}</div>
          <h3>${esc(sc.navn)}</h3>
          <div class="desc">${esc(sc.desc)}</div>
          <div class="sc-stat headline">
            <span class="l">Omsetning 2029</span>
            <span class="v">${sc.omsetning_2029_mnok} <span style="font-size:14px;color:var(--muted)">M</span></span>
          </div>
          <div class="sc-stat"><span class="l">Driftsmargin</span><span class="v">${sc.driftsmargin_2029_pct.toString().replace('.',',')} %</span></div>
          <div class="sc-stat"><span class="l">Ansatte 2029</span><span class="v">${sc.ansatte_2029}</span></div>
          <div class="sc-stat"><span class="l">Forsikringsstrøm</span><span class="v">${sc.forsikring_2029_mnok} M</span></div>
          <div class="sc-stat"><span class="l">Kapitalbehov</span><span class="v" style="font-size:13px">${esc(sc.kapitalbehov)}</span></div>
        </div>
      `;
    }).join('');
    return `<div class="sc-grid">${cards}</div>`;
  }

  // ----------------------------------------------------------------
  // SCENARIO chart (SVG)
  // ----------------------------------------------------------------
  function renderScenarioChart(selskapId) {
    const scs = window.SA_CONFIG.scenarier?.[selskapId];
    if (!scs?.length) return '';
    const base = scs.find(s => s.id === 'base');
    const off = scs.find(s => s.id === 'offensiv');
    const bull = scs.find(s => s.id === 'bull');
    if (!base || !off || !bull) return '';

    // Scale ramps onto SVG coords. Y: 0M=210, 200M=20 => factor 0.95 px/M from 20
    const yMax = 200;
    const yPx = (m) => 210 - (m / yMax) * 190;
    const xs = [80, 280, 480, 680];

    const pathFor = (ramp) => 'M ' + ramp.map((v, i) => `${xs[i]} ${yPx(v).toFixed(1)}`).join(' L ');

    const offFill = `M ${xs[0]} ${yPx(off.ramp[0])} ` +
      off.ramp.slice(1).map((v, i) => `L ${xs[i + 1]} ${yPx(v)}`).join(' ') +
      ` L ${xs[3]} 210 L ${xs[0]} 210 Z`;

    const lastB = bull.ramp[3];
    const lastO = off.ramp[3];
    const lastBase = base.ramp[3];

    return `
      <div class="sc-chart">
        <div class="ch-head">
          <h3>Omsetningsramp 2026–2029</h3>
          <div class="legend">
            <span><i style="background:#98a1ad"></i> Base</span>
            <span><i style="background:#1f4d36"></i> Offensiv</span>
            <span><i style="background:#a87f2e"></i> Bull</span>
          </div>
        </div>
        <svg viewBox="0 0 720 240" preserveAspectRatio="none">
          <g stroke="#e1ddd2" stroke-width="1">
            <line x1="60" y1="20" x2="700" y2="20"/>
            <line x1="60" y1="75" x2="700" y2="75"/>
            <line x1="60" y1="130" x2="700" y2="130"/>
            <line x1="60" y1="185" x2="700" y2="185"/>
            <line x1="60" y1="210" x2="700" y2="210"/>
          </g>
          <g font-family="Geist Mono, monospace" font-size="10" fill="#98a1ad" text-anchor="end">
            <text x="52" y="24">200 M</text>
            <text x="52" y="79">150 M</text>
            <text x="52" y="134">100 M</text>
            <text x="52" y="189"> 50 M</text>
            <text x="52" y="214">  0 M</text>
          </g>
          <g font-family="Geist Mono, monospace" font-size="10" fill="#98a1ad" text-anchor="middle">
            <text x="80"  y="232">2026</text>
            <text x="280" y="232">2027</text>
            <text x="480" y="232">2028</text>
            <text x="680" y="232">2029</text>
          </g>
          <path d="${offFill}" fill="#e6eee9" opacity="0.7"/>
          <path d="${pathFor(bull.ramp)}" fill="none" stroke="#a87f2e" stroke-width="2.2" stroke-linecap="round"/>
          <path d="${pathFor(off.ramp)}" fill="none" stroke="#1f4d36" stroke-width="2.5" stroke-linecap="round"/>
          <path d="${pathFor(base.ramp)}" fill="none" stroke="#98a1ad" stroke-width="1.8" stroke-dasharray="5,4" stroke-linecap="round"/>
          <g fill="#fff" stroke-width="2">
            <circle cx="${xs[0]}" cy="${yPx(off.ramp[0])}" r="4" stroke="#1f4d36"/>
            <circle cx="${xs[1]}" cy="${yPx(off.ramp[1])}" r="4" stroke="#1f4d36"/>
            <circle cx="${xs[2]}" cy="${yPx(off.ramp[2])}" r="4" stroke="#1f4d36"/>
            <circle cx="${xs[3]}" cy="${yPx(off.ramp[3])}" r="4" stroke="#1f4d36"/>
            <circle cx="${xs[3]}" cy="${yPx(lastB)}" r="4" stroke="#a87f2e"/>
            <circle cx="${xs[3]}" cy="${yPx(lastBase)}" r="4" stroke="#98a1ad"/>
          </g>
          <g font-family="Geist Mono, monospace" font-size="11" font-weight="600">
            <text x="688" y="${(yPx(lastB) - 4).toFixed(0)}" fill="#a87f2e">${lastB} M</text>
            <text x="688" y="${(yPx(lastO) + 12).toFixed(0)}" fill="#1f4d36">${lastO} M</text>
            <text x="688" y="${(yPx(lastBase) + 6).toFixed(0)}" fill="#6b7280">${lastBase} M</text>
          </g>
        </svg>
        <div class="footnote">
          Base = ${base.ramp[0]}→${base.ramp[3]} M på eksisterende ROT ·
          Offensiv legger forsikring + Salten + energi-rehab på toppen ·
          Bull legger M&A + Helgeland/Lofoten på toppen igjen.
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------------------
  // TILTAK cards (status page)
  // ----------------------------------------------------------------
  function renderTiltakStatusStrip(doc) {
    const list = doc.tiltak || [];
    const counts = { 'pa-sporet': [], 'i-planlegging': [], 'risiko': [], 'ikke-startet': [] };
    list.forEach(t => {
      const key = ['pa-sporet', 'i-planlegging', 'risiko'].includes(t.status) ? t.status :
                  t.status === 'fullfort' ? 'pa-sporet' :
                  t.status === 'forsinket' ? 'risiko' : 'ikke-startet';
      counts[key].push(t.navn);
    });
    const cells = [
      { cls: 'pa', lab: 'På sporet',     items: counts['pa-sporet'] },
      { cls: 'i',  lab: 'I planlegging', items: counts['i-planlegging'] },
      { cls: 'r',  lab: 'Risiko',        items: counts['risiko'] },
      { cls: '',   lab: 'Ikke startet',  items: counts['ikke-startet'] },
    ];
    const cellsHtml = cells.map(c => `
      <div class="cell ${c.cls}">
        <div class="lab">${esc(c.lab)}</div>
        <div class="v">${c.items.length}</div>
        <div class="d">${c.items.length ? c.items.map(esc).join(' · ') : '— ingen'}</div>
      </div>
    `).join('');
    return `
      <div>
        <div class="section-h">
          <h2>Statusoversikt</h2>
          <span class="src">${list.length} initiativer fordelt på 4 statustilstander</span>
        </div>
        <div class="status-strip">${cellsHtml}</div>
      </div>
    `;
  }

  function renderTiltakCards(doc) {
    const list = doc.tiltak || [];
    if (!list.length) return '';
    const cards = list.map((t, i) => {
      const cls = window.SA_CONFIG.tiltakStatusClass[t.status] || 'ikke';
      const label = window.SA_CONFIG.statusLabels.tiltak[t.status] || t.status;
      const pct = Math.max(0, Math.min(100, t.fremdrift_pct || 0));
      return `
        <div class="tiltak" data-status="${cls}">
          <div class="head">
            <div>
              <div class="stat">${esc(label)}</div>
              <div class="nrcell">${i + 1}</div>
              <h3>${esc(t.navn)}</h3>
            </div>
          </div>
          <div class="pbar"><i style="width:${pct}%"></i></div>
          <div class="pbar-label">
            <span>Fremdrift</span>
            <span class="pct">${pct} %</span>
          </div>
          <div class="meta-row">
            <div class="m">
              <div class="lab">Ansvarlig</div>
              <div class="v">${esc(t.ansvarlig || '—')}</div>
            </div>
            <div class="m">
              <div class="lab">Frist</div>
              <div class="v">${fmtDate(t.frist) || '—'}</div>
            </div>
          </div>
          <div class="neste">
            <b>Neste steg</b>
            ${esc(t.neste_steg || '—')}
          </div>
        </div>
      `;
    }).join('');
    return `
      <div>
        <div class="section-h">
          <h2>Initiativer i detalj</h2>
          <span class="src">Ansvarlig, neste steg og frist per tiltak</span>
        </div>
        <div class="tiltak-grid">${cards}</div>
      </div>
    `;
  }

  // ----------------------------------------------------------------
  // STYRE — frontispice + sammendrag
  // ----------------------------------------------------------------
  function renderStyreFront(doc, selskap, scenarioOff) {
    const kort = doc.retning?.kort || '';
    // Last word italic
    const kortHtml = kort.replace(/^(.+?)\s+(\S+)$/, '$1<br><em>$2</em>');
    return `
      <div class="board-frame">
        <div class="crest">
          <div class="lhs"><span class="gly">SA</span> ServiceAlliansen Bygg-portefølje</div>
          <div class="rhs">SAK 2026-Q3-04 · 12 sider</div>
        </div>
        <div class="label-row">
          <span>Strategi 2026–2029</span>
          <span>${esc(selskap.label)}</span>
          <span>Til behandling</span>
        </div>
        <h1>${kortHtml}.</h1>
        <p class="sub">
          Anbefaling til styret: Vedta Offensiv-banen og frigjør ${esc(scenarioOff?.kapitalbehov || '25–40 MNOK')}
          SA-konserninnskudd for ${esc(selskap.by)}-utvidelse, med beslutningspunkter i Q3 2026 og Q1 2028.
        </p>
        <div class="meta">
          <div class="item">
            <div class="lab">Behandles</div>
            <div class="val">Styremøte 2026-Q3<br>Onsdag 28. august</div>
          </div>
          <div class="item">
            <div class="lab">Forfatter</div>
            <div class="val">DL ${esc(selskap.dl)}<br>${esc(doc.meta?.sist_endret_av || 'Portal-eier')}</div>
          </div>
          <div class="item">
            <div class="lab">Innstilling</div>
            <div class="val">Vedta Scenario B<br>(Offensiv)</div>
          </div>
          <div class="item">
            <div class="lab">Vedlegg</div>
            <div class="val">A. Brreg-regnskap 2024<br>B. M&amp;A-screening</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderStyreSammendrag(doc, scenarioOff) {
    return `
      <div class="board-sheet">
        <div class="sheet-head">
          <h2>Sammendrag &amp; anbefaling</h2>
          <span class="pg">side 02 / 14</span>
        </div>
        <div class="sum-grid">
          <div>
            <p class="lead">
              ${esc(doc.retning?.lang || '')}
              <br><br>
              Innstilling: <b>Vedta Offensiv</b> —
              ${scenarioOff?.omsetning_2029_mnok || '—'} MNOK i 2029,
              +${(scenarioOff?.driftsmargin_2029_pct - 7.7).toFixed(1).replace('.',',')} pp margin,
              krever ${esc(scenarioOff?.kapitalbehov || '—')}.
            </p>
            <ol class="recs">
              ${(doc.tiltak || []).filter(t => t.status !== 'fullfort' && t.status !== 'ikke-startet').slice(0, 4).map(t => `
                <li>
                  <b>${esc(t.navn)}</b>
                  ${esc(t.neste_steg || '—')}
                </li>
              `).join('')}
            </ol>
          </div>
          <div class="sidecol">
            <h3>Nøkkeltall — Offensiv 2029</h3>
            <div class="signals">
              <div class="signal">
                <div class="num">${scenarioOff?.omsetning_2029_mnok || '—'} <span class="unit">MNOK</span></div>
                <div class="nm">Omsetning 2029</div>
              </div>
              <div class="signal">
                <div class="num">${scenarioOff?.driftsmargin_2029_pct?.toString().replace('.',',') || '—'} <span class="unit">%</span></div>
                <div class="nm">Driftsmargin</div>
              </div>
              <div class="signal">
                <div class="num">${scenarioOff?.ansatte_2029 || '—'} <span class="unit">ansatte</span></div>
                <div class="nm">Bemanning ved utgang 2029</div>
              </div>
              <div class="signal">
                <div class="num">${esc(scenarioOff?.kapitalbehov || '—')}</div>
                <div class="nm">Kapitalbehov — SA-konserninnskudd</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // expose
  window.RENDER = {
    esc, fmtMnok, fmtPct, fmtDate,
    renderPageHd,
    renderRetning,
    renderFokus,
    renderMaal,
    renderOkonomi,
    renderSWOT,
    renderHorisonter,
    renderInitiativer,
    renderScenarier,
    renderScenarioChart,
    renderTiltakStatusStrip,
    renderTiltakCards,
    renderStyreFront,
    renderStyreSammendrag,
  };
})();

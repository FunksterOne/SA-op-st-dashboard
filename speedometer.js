// =====================================================================
// SPEEDOMETER.JS — gjenbrukbar SVG gauge for KPI-er
// =====================================================================
// Bruk:
//   <div class="gauge" data-gauge data-value="73" data-min="0" data-max="100"
//        data-target="70" data-unit="%" data-label="Hit-rate"
//        data-zones="60,80"></div>
//   ...
//   renderAllGauges();
//
// Eller programmatisk:
//   renderGauge(el, { value: 73, min: 0, max: 100, target: 70, unit: '%',
//                     label: 'Hit-rate', zones: [60, 80], detail: 'siste 90d' });
// =====================================================================

(function () {
  'use strict';

  const GAUGE_CSS = `
.gauge {
  display: flex; flex-direction: column;
  background: var(--panel-2, #1f2630); border: 1px solid var(--line, #2a313c);
  border-radius: 10px; padding: 14px 14px 12px; min-width: 0;
}
.gauge .g-spacer { flex: 1 }
.gauge .g-label {
  font-size: 10.5px; color: var(--muted, #8b95a3); text-transform: uppercase;
  letter-spacing: 0.1em; font-weight: 700; text-align: center; margin-bottom: 4px;
}
.gauge .g-svg-wrap { display: flex; justify-content: center }
.gauge .g-svg { width: 100%; max-width: 200px; height: auto; display: block }
.gauge .g-readout {
  margin-top: -6px; text-align: center; padding: 0 4px;
}
.gauge .g-value {
  font-size: 24px; font-weight: 700; color: var(--text, #e6edf3);
  letter-spacing: -0.02em; line-height: 1.05;
}
.gauge .g-value.small { font-size: 19px }
.gauge .g-target {
  font-size: 10.5px; color: var(--muted, #8b95a3); margin-top: 2px;
  font-variant-numeric: tabular-nums;
}
.gauge .g-detail {
  margin: 10px 0 0; padding-top: 8px; border-top: 1px solid var(--line, #2a313c);
  font-size: 11px; color: var(--muted, #8b95a3); text-align: center; line-height: 1.4;
  min-height: 32px; display: flex; align-items: center; justify-content: center;
}
.gauge .g-arc-bg { stroke: var(--panel-3, #262d38); fill: none }
.gauge .g-arc-zone { fill: none; opacity: 0.55 }
.gauge .g-needle { stroke: var(--text, #e6edf3); stroke-width: 2; stroke-linecap: round }
.gauge .g-target-tick { stroke: var(--text, #e6edf3); stroke-width: 1.5; stroke-dasharray: 2 2 }
.gauge .g-tick { stroke: var(--muted, #8b95a3); stroke-width: 1; opacity: 0.55 }
:root[data-theme="light"] .gauge .g-arc-bg { stroke: #e3e8f0 }
:root[data-theme="light"] .gauge .g-arc-zone { opacity: 0.45 }
`;

  function injectCss() {
    if (document.getElementById('speedometer-css')) return;
    const style = document.createElement('style');
    style.id = 'speedometer-css';
    style.textContent = GAUGE_CSS;
    document.head.appendChild(style);
  }

  // Polar koordinat på halvsirkel — 180° (venstre) til 0° (høyre), via 90° (topp)
  function polar(cx, cy, r, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }

  function arcPath(cx, cy, r, startAngle, endAngle) {
    // start og end i grader, fra venstre (180) til høyre (0)
    const s = polar(cx, cy, r, startAngle);
    const e = polar(cx, cy, r, endAngle);
    const largeArc = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
    const sweep = startAngle > endAngle ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} ${sweep} ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  }

  function valueToAngle(value, min, max) {
    const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return 180 - t * 180; // 180° (venstre, min) → 0° (høyre, max)
  }

  function colorForValue(value, min, max, zones, invertColors) {
    const t = (value - min) / (max - min);
    const [zRed, zGreen] = zones || [0.5, 0.8];
    // Hvis zones er 0–100-range, normaliser
    const rNorm = zRed > 1 ? (zRed - min) / (max - min) : zRed;
    const gNorm = zGreen > 1 ? (zGreen - min) / (max - min) : zGreen;
    const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || null;
    if (invertColors) {
      // Lavere er bedre (f.eks. frister)
      if (t <= rNorm) return cssVar('--good') || '#3fb950';
      if (t <= gNorm) return cssVar('--warn') || '#d29922';
      return cssVar('--bad') || '#f85149';
    }
    if (t < rNorm) return cssVar('--bad') || '#f85149';
    if (t < gNorm) return cssVar('--warn') || '#d29922';
    return cssVar('--good') || '#3fb950';
  }

  function renderGauge(el, opts) {
    const value = +opts.value || 0;
    const min = +opts.min || 0;
    const max = +opts.max || 100;
    const target = opts.target != null ? +opts.target : null;
    const unit = opts.unit || '';
    const label = opts.label || '';
    const detail = opts.detail || '';
    const valueLabel = opts.valueLabel || formatValue(value, unit, opts.formatLarge);
    const zones = opts.zones || [0.5, 0.8];
    const invertColors = !!opts.invertColors;

    const W = 200, H = 122;
    const cx = W / 2, cy = 100;
    const rOuter = 76;
    const rInner = 58;
    const arcWidth = rOuter - rInner;
    const rMid = (rOuter + rInner) / 2;

    // Soner — bakgrunn
    const [zRed, zGreen] = zones;
    const zRedAbs = zRed > 1 ? zRed : min + (max - min) * zRed;
    const zGreenAbs = zGreen > 1 ? zGreen : min + (max - min) * zGreen;

    const angleMin = 180, angleMax = 0;
    const angleRed = valueToAngle(zRedAbs, min, max);
    const angleGreen = valueToAngle(zGreenAbs, min, max);
    const angleValue = valueToAngle(value, min, max);

    const cssGood = getComputedStyle(document.documentElement).getPropertyValue('--good').trim() || '#3fb950';
    const cssWarn = getComputedStyle(document.documentElement).getPropertyValue('--warn').trim() || '#d29922';
    const cssBad = getComputedStyle(document.documentElement).getPropertyValue('--bad').trim() || '#f85149';

    const colRed = invertColors ? cssGood : cssBad;
    const colYellow = cssWarn;
    const colGreen = invertColors ? cssBad : cssGood;

    // Bakgrunnsbue (full)
    const bgArc = arcPath(cx, cy, rMid, angleMin, angleMax);

    // Sone-buer — tegnes i orden fra min mot max
    const zoneArcs = `
      <path class="g-arc-zone" d="${arcPath(cx, cy, rMid, angleMin, angleRed)}" stroke="${colRed}" stroke-width="${arcWidth}"/>
      <path class="g-arc-zone" d="${arcPath(cx, cy, rMid, angleRed, angleGreen)}" stroke="${colYellow}" stroke-width="${arcWidth}"/>
      <path class="g-arc-zone" d="${arcPath(cx, cy, rMid, angleGreen, angleMax)}" stroke="${colGreen}" stroke-width="${arcWidth}"/>
    `;

    // Tick-streker — min og max (ingen tekstetiketter, kun visuelle hint)
    const tickEnds = [0, 1].map(t => {
      const a = 180 - t * 180;
      const p1 = polar(cx, cy, rInner - 1, a);
      const p2 = polar(cx, cy, rInner - 6, a);
      return `<line class="g-tick" x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}"/>`;
    }).join('');

    // Mål-tick (target) — krysser hele bredden av arc
    let targetTick = '';
    if (target != null) {
      const a = valueToAngle(target, min, max);
      const t1 = polar(cx, cy, rOuter + 2, a);
      const t2 = polar(cx, cy, rInner - 4, a);
      targetTick = `<line class="g-target-tick" x1="${t1.x.toFixed(1)}" y1="${t1.y.toFixed(1)}" x2="${t2.x.toFixed(1)}" y2="${t2.y.toFixed(1)}"/>`;
    }

    // Verdi-pil
    const needleEnd = polar(cx, cy, rInner - 3, angleValue);
    const needle = `
      <circle cx="${cx}" cy="${cy}" r="3" fill="var(--text, #e6edf3)"/>
      <line class="g-needle" x1="${cx}" y1="${cy}" x2="${needleEnd.x.toFixed(1)}" y2="${needleEnd.y.toFixed(1)}"/>
    `;

    const targetLabel = target != null ? `mål ${formatValue(target, unit, opts.formatLarge)}` : '';
    const valueClass = valueLabel.length > 5 ? 'g-value small' : 'g-value';

    const svg = `
      <svg class="g-svg" viewBox="0 0 ${W} ${H}" aria-label="${label}: ${valueLabel}">
        <path class="g-arc-bg" d="${bgArc}" stroke-width="${arcWidth}"/>
        ${zoneArcs}
        ${tickEnds}
        ${targetTick}
        ${needle}
      </svg>
    `;

    el.classList.add('gauge');
    el.innerHTML = `
      <div class="g-label">${label}</div>
      <div class="g-svg-wrap">${svg}</div>
      <div class="g-readout">
        <div class="${valueClass}">${valueLabel}</div>
        <div class="g-target">${targetLabel || ' '}</div>
      </div>
      <div class="g-spacer"></div>
      ${detail ? `<div class="g-detail">${detail}</div>` : ''}
    `;
  }

  function formatValue(v, unit, formatLarge) {
    if (unit === 'kr' || formatLarge) {
      // Stort tall — vis i MNOK
      if (Math.abs(v) >= 1000000) return (v / 1000000).toFixed(1).replace('.', ',') + ' M';
      if (Math.abs(v) >= 1000) return (v / 1000).toFixed(0) + ' k';
      return v.toFixed(0);
    }
    if (unit === '%') {
      // Vis 1 desimal når verdien er under 20 (margin, hit-rate detaljer);
      // ellers heltall (større prosentverdier).
      if (Math.abs(v) < 20 && !Number.isInteger(v)) {
        return v.toFixed(1).replace('.', ',') + ' %';
      }
      return Math.round(v) + ' %';
    }
    if (unit === 'MNOK') {
      const formatted = v.toFixed(1).replace('.', ',');
      return (formatted.endsWith(',0') ? formatted.slice(0, -2) : formatted) + ' M';
    }
    return Math.round(v) + (unit ? ' ' + unit : '');
  }

  function formatTickLabel(v, unit) {
    if (unit === 'kr' || (unit === 'MNOK' && Math.abs(v) >= 1)) {
      if (Math.abs(v) >= 1000000) return (v / 1000000).toFixed(0) + 'M';
      if (Math.abs(v) >= 1000) return (v / 1000).toFixed(0) + 'k';
      return v.toFixed(0);
    }
    return Math.round(v);
  }

  function renderAllGauges(root = document) {
    injectCss();
    root.querySelectorAll('[data-gauge]').forEach(el => {
      const opts = {
        value: +el.dataset.value,
        min: +el.dataset.min || 0,
        max: +el.dataset.max || 100,
        target: el.dataset.target ? +el.dataset.target : null,
        unit: el.dataset.unit || '',
        label: el.dataset.label || '',
        detail: el.dataset.detail || '',
        zones: el.dataset.zones ? el.dataset.zones.split(',').map(Number) : [0.5, 0.8],
        invertColors: el.dataset.invert === 'true',
        formatLarge: el.dataset.formatLarge === 'true',
        valueLabel: el.dataset.valueLabel || null,
      };
      renderGauge(el, opts);
    });
  }

  // Eksponer global
  window.renderGauge = renderGauge;
  window.renderAllGauges = renderAllGauges;
  window.injectGaugeCss = injectCss;

  // Auto-init når DOM er klar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => renderAllGauges());
  } else {
    renderAllGauges();
  }
})();

// charts.js — hand-drawn SVG charts for NusaStat. No chart library.
// Each builder returns an SVG string; app.js inserts it into the page.

// Escape text that goes into an SVG label.
function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function fmt(n, decimals) {
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals || 0,
    maximumFractionDigits: decimals || 0,
  });
}

// Shared frame: axes, gridlines and a caption. Returns the inner SVG
// pieces for a plot area of width w and height h with the given y range.
function frame(w, h, yMin, yMax, yLabel, ticks) {
  const padL = 58;
  const padR = 14;
  const padT = 14;
  const padB = 34;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  let out = '';
  for (let i = 0; i <= ticks; i++) {
    const v = yMin + ((yMax - yMin) * i) / ticks;
    const y = padT + plotH - (plotH * i) / ticks;
    out += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (padL + plotW) + '" y2="' + y.toFixed(1) + '" stroke="#e3ddd0" stroke-width="1"/>';
    out += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#5c5648">' + esc(fmt(v, yMax < 20 ? 1 : 0)) + '</text>';
  }
  out += '<text x="' + padL + '" y="' + (h - 8) + '" font-size="11" fill="#5c5648">' + esc(yLabel) + '</text>';
  return { padL, padR, padT, padB, plotW, plotH, grid: out };
}

// Line chart over the 2015-2024 series. highlightYear marks one point.
export function lineChart(years, values, options) {
  const w = 760;
  const h = 320;
  const unit = options.unit || '';
  const color = options.color || '#0f5c5c';
  const highlight = options.highlightYear || null;
  const decimals = options.decimals || 0;
  let min = Math.min.apply(null, values);
  let max = Math.max.apply(null, values);
  const span = max - min || 1;
  min = Math.floor((min - span * 0.12) * 10) / 10;
  max = Math.ceil((max + span * 0.12) * 10) / 10;
  const f = frame(w, h, min, max, options.xLabel || '', 4);
  const x = (i) => f.padL + (f.plotW * i) / (years.length - 1);
  const y = (v) => f.padT + f.plotH - (f.plotH * (v - min)) / (max - min);
  let points = '';
  let labels = '';
  for (let i = 0; i < years.length; i++) {
    points += (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(values[i]).toFixed(1) + ' ';
    labels += '<text x="' + x(i).toFixed(1) + '" y="' + (h - 16) + '" text-anchor="middle" font-size="11" fill="#5c5648">' + years[i] + '</text>';
    const isHi = highlight !== null && years[i] === highlight;
    const isFirst = i === 0;
    labels += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(values[i]).toFixed(1) + '" r="' + (isHi ? 6 : 3.5) + '" fill="' + (isHi ? '#d98e1f' : color) + '" stroke="#fff" stroke-width="1.5"/>';
    if (isHi) {
      labels += '<text x="' + x(i).toFixed(1) + '" y="' + (y(values[i]) - 12).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#8a5a08">' + fmt(values[i], decimals) + unit + '</text>';
    } else if (isFirst) {
      // Label the first point too, so the chart reads at a glance.
      labels += '<text x="' + x(i).toFixed(1) + '" y="' + (y(values[i]) - 12).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#5c5648">' + fmt(values[i], decimals) + unit + '</text>';
    }
  }
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(options.ariaLabel || 'Line chart') + '" class="chart">'
    + f.grid + labels
    + '<path d="' + points + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'
    + '</svg>';
}

// Vertical bar chart. values is an array of {label, value}; highlight
// marks one bar in amber.
export function barChart(items, options) {
  const w = 760;
  const h = 320;
  const color = options.color || '#0f5c5c';
  const unit = options.unit || '';
  const decimals = options.decimals || 0;
  const max = Math.max.apply(null, items.map((d) => d.value)) * 1.08;
  const f = frame(w, h, 0, max, options.xLabel || '', 4);
  const slot = f.plotW / items.length;
  const barW = Math.min(56, slot * 0.62);
  let bars = '';
  let labels = '';
  items.forEach((d, i) => {
    const cx = f.padL + slot * i + slot / 2;
    const bh = (f.plotH * d.value) / max;
    const y0 = f.padT + f.plotH - bh;
    const isHi = options.highlightLabel === d.label;
    bars += '<rect x="' + (cx - barW / 2).toFixed(1) + '" y="' + y0.toFixed(1) + '" width="' + barW + '" height="' + bh.toFixed(1) + '" rx="3" fill="' + (isHi ? '#d98e1f' : color) + '"/>';
    labels += '<text x="' + cx.toFixed(1) + '" y="' + (y0 - 6).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#3d3830">' + fmt(d.value, decimals) + unit + '</text>';
    labels += '<text x="' + cx.toFixed(1) + '" y="' + (h - 16) + '" text-anchor="middle" font-size="11" fill="#5c5648">' + esc(d.label) + '</text>';
  });
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(options.ariaLabel || 'Bar chart') + '" class="chart">'
    + f.grid + bars + labels + '</svg>';
}

// Horizontal bar chart for ranked lists (province populations).
export function hbarChart(items, options) {
  const rowH = 34;
  const h = 40 + items.length * rowH;
  const w = 760;
  const color = options.color || '#0f5c5c';
  const unit = options.unit || '';
  const decimals = options.decimals || 0;
  const max = Math.max.apply(null, items.map((d) => d.value)) * 1.05;
  const labelW = 150;
  const valueW = 64;
  const plotW = w - labelW - valueW - 10;
  let rows = '';
  items.forEach((d, i) => {
    const y = 14 + i * rowH;
    const bw = (plotW * d.value) / max;
    rows += '<text x="' + (labelW - 10) + '" y="' + (y + 15) + '" text-anchor="end" font-size="12" fill="#2e2a24">' + esc(d.label) + '</text>';
    rows += '<rect x="' + labelW + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="20" rx="3" fill="' + color + '"/>';
    rows += '<text x="' + (labelW + bw + 8).toFixed(1) + '" y="' + (y + 15) + '" font-size="12" font-weight="700" fill="#3d3830">' + fmt(d.value, decimals) + unit + '</text>';
  });
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(options.ariaLabel || 'Horizontal bar chart') + '" class="chart">'
    + rows + '</svg>';
}

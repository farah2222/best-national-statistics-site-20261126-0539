// app.js — routing, page rendering and controls for NusaStat.
// Hash routes: #/ (overview), #/population, #/economy, #/employment,
// #/health, #/provinces, #/methodology. Every section is reached by a
// link in the header nav; every control on a page works.

import {
  SERIES_YEARS, POPULATION_SERIES, GDP_PER_CAPITA_SERIES,
  UNEMPLOYMENT_SERIES, INFLATION_SERIES, HEADLINES, SECTOR_SHARES,
  HEALTH_EDUCATION, PROVINCES, REGIONS, RELEASES,
} from './data.js';
import { lineChart, barChart, hbarChart } from './charts.js';
import { buildSortableTable } from './tables.js';

const view = document.getElementById('view');
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

let selectedYear = 2024;

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

function sourceTag(source) {
  return '<span class="source">Source: ' + esc(source) + '</span>';
}

function kpiCard(h) {
  return '<article class="kpi"><p class="kpi-label">' + esc(h.label) + '</p>'
    + '<p class="kpi-value">' + esc(fmt(h.value, h.value % 1 ? 2 : 0)) + ' <span class="kpi-unit">' + esc(h.unit) + '</span></p>'
    + sourceTag(h.source) + '</article>';
}

function yearOptions() {
  return SERIES_YEARS.map((y) => '<option value="' + y + '"' + (y === selectedYear ? ' selected' : '') + '>' + y + '</option>').join('');
}

function yearSelector(id) {
  return '<label class="year-picker">Year <select id="' + id + '" aria-label="Choose a year">' + yearOptions() + '</select></label>';
}

function bindYearSelector(id, onChange) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('change', () => {
      selectedYear = Number(el.value);
      onChange();
    });
  }
}

// ---------- Overview ----------
function renderOverview() {
  const i = SERIES_YEARS.indexOf(selectedYear);
  const hero = lineChart(SERIES_YEARS, POPULATION_SERIES, {
    unit: 'm', highlightYear: selectedYear, decimals: 1,
    ariaLabel: 'Population of Indonesia, 2015 to 2024, in millions',
  });
  view.innerHTML =
    '<section class="hero"><h1>Indonesia in numbers</h1>'
    + '<p class="lede">Population, economy, jobs, health and education — the figures that describe a nation of '
    + fmt(HEADLINES.population.value, 1) + ' million people, with every number traced to its source and year.</p></section>'
    + '<section class="kpi-grid" aria-label="Headline indicators">'
    + kpiCard(HEADLINES.population) + kpiCard(HEADLINES.gdp) + kpiCard(HEADLINES.gdpPerCapita)
    + kpiCard(HEADLINES.growth) + kpiCard(HEADLINES.unemployment) + kpiCard(HEADLINES.poverty)
    + '</section>'
    + '<section class="panel"><div class="panel-head"><h2>Population, 2015–2024</h2>' + yearSelector('year-overview') + '</div>'
    + '<div id="hero-chart">' + hero + '</div>'
    + '<p class="chart-note">In ' + selectedYear + ': population <strong>' + fmt(POPULATION_SERIES[i], 1) + ' million</strong>, '
    + 'GDP per capita <strong>US$' + fmt(GDP_PER_CAPITA_SERIES[i]) + '</strong>, unemployment <strong>' + fmt(UNEMPLOYMENT_SERIES[i], 2) + '%</strong>, '
    + 'inflation <strong>' + fmt(INFLATION_SERIES[i], 2) + '%</strong>. ' + sourceTag('BPS and World Bank, 2015–2024') + '</p>'
    + '<p><a class="button" href="#/population">Explore population in depth →</a></p></section>'
    + '<section class="panel"><h2>Latest releases</h2><ul class="releases">'
    + RELEASES.map((r) => '<li><span class="release-date">' + esc(r.date) + '</span> ' + esc(r.title) + ' — ' + esc(r.source) + '</li>').join('')
    + '</ul></section>'
    + '<section class="panel"><h2>Browse the statistics</h2><div class="link-cards">'
    + '<a href="#/economy">Economy — GDP, growth and sectors</a>'
    + '<a href="#/employment">Employment &amp; prices — jobs, inflation, poverty</a>'
    + '<a href="#/health">Health &amp; education — literacy, mortality, schooling</a>'
    + '<a href="#/provinces">Provinces — all 20 listed provinces compared</a>'
    + '<a href="#/methodology">Methodology &amp; sources — where every figure comes from</a>'
    + '</div></section>';
  bindYearSelector('year-overview', renderOverview);
}

// ---------- Population ----------
function renderPopulation() {
  const i = SERIES_YEARS.indexOf(selectedYear);
  view.innerHTML =
    '<section class="hero"><h1>Population</h1>'
    + '<p class="lede">Indonesia is the world’s fourth most populous country. The population grows by roughly 0.8% a year, '
    + 'and more than half of all Indonesians live on Java.</p></section>'
    + '<section class="kpi-grid">'
    + kpiCard(HEADLINES.population)
    + '<article class="kpi"><p class="kpi-label">Median age</p><p class="kpi-value">30.4 <span class="kpi-unit">years</span></p>' + sourceTag('BPS, 2024') + '</article>'
    + '<article class="kpi"><p class="kpi-label">Life expectancy</p><p class="kpi-value">74.2 <span class="kpi-unit">years</span></p>' + sourceTag('BPS, 2024') + '</article>'
    + '<article class="kpi"><p class="kpi-label">Fertility rate</p><p class="kpi-value">2.1 <span class="kpi-unit">children per woman</span></p>' + sourceTag('BPS, 2024') + '</article>'
    + '</section>'
    + '<section class="panel"><div class="panel-head"><h2 id="pop-chart-title">Population, 2015–2024</h2>' + yearSelector('year-population') + '</div>'
    + '<div class="tab-row" role="tablist" aria-label="Choose a series">'
    + '<button type="button" class="tab active" data-series="population" role="tab" aria-selected="true">Population</button>'
    + '<button type="button" class="tab" data-series="gdp" role="tab" aria-selected="false">GDP per capita</button>'
    + '</div>'
    + '<div id="pop-chart"></div>'
    + '<p class="chart-note" id="pop-note"></p></section>'
    + '<section class="panel"><h2>The ten-year series</h2><div id="pop-table"></div>'
    + sourceTag('BPS (population, mid-year estimates) and World Bank (GDP per capita), 2015–2024. Values rounded.') + '</section>';

  let series = 'population';
  function drawPopChart() {
    const title = document.getElementById('pop-chart-title');
    const box = document.getElementById('pop-chart');
    const note = document.getElementById('pop-note');
    if (series === 'population') {
      title.textContent = 'Population, 2015–2024';
      box.innerHTML = lineChart(SERIES_YEARS, POPULATION_SERIES, {
        unit: 'm', highlightYear: selectedYear, decimals: 1,
        ariaLabel: 'Population of Indonesia, 2015 to 2024, in millions',
      });
      note.innerHTML = 'In ' + selectedYear + ' the population was <strong>' + fmt(POPULATION_SERIES[i], 1) + ' million</strong>. ' + sourceTag('BPS, 2015–2024');
    } else {
      title.textContent = 'GDP per capita, 2015–2024';
      box.innerHTML = lineChart(SERIES_YEARS, GDP_PER_CAPITA_SERIES, {
        unit: '', highlightYear: selectedYear, decimals: 0, color: '#8a5a08',
        ariaLabel: 'GDP per capita of Indonesia, 2015 to 2024, in US dollars',
      });
      note.innerHTML = 'In ' + selectedYear + ' GDP per capita was <strong>US$' + fmt(GDP_PER_CAPITA_SERIES[i]) + '</strong>. ' + sourceTag('World Bank, 2015–2024');
    }
  }
  drawPopChart();
  view.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      series = btn.getAttribute('data-series');
      view.querySelectorAll('.tab').forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      drawPopChart();
    });
  });
  bindYearSelector('year-population', renderPopulation);

  const tableBox = document.getElementById('pop-table');
  let rows = '<table class="data-table"><thead><tr><th scope="col">Year</th><th scope="col" class="num">Population (million)</th><th scope="col" class="num">GDP per capita (US$)</th><th scope="col" class="num">Unemployment (%)</th></tr></thead><tbody>';
  SERIES_YEARS.forEach((y, k) => {
    rows += '<tr><td>' + y + '</td><td class="num">' + fmt(POPULATION_SERIES[k], 1) + '</td><td class="num">' + fmt(GDP_PER_CAPITA_SERIES[k]) + '</td><td class="num">' + fmt(UNEMPLOYMENT_SERIES[k], 2) + '</td></tr>';
  });
  tableBox.innerHTML = rows + '</tbody></table>';
}

// ---------- Economy ----------
function renderEconomy() {
  let chartType = 'bar';
  view.innerHTML =
    '<section class="hero"><h1>Economy</h1>'
    + '<p class="lede">The largest economy in Southeast Asia: GDP of about US$1.40 trillion in 2024, growing 5.03% that year, '
    + 'with services the biggest sector and manufacturing the engine of industry.</p></section>'
    + '<section class="kpi-grid">'
    + kpiCard(HEADLINES.gdp) + kpiCard(HEADLINES.gdpPerCapita) + kpiCard(HEADLINES.growth)
    + '<article class="kpi"><p class="kpi-label">GDP per capita (PPP)</p><p class="kpi-value">US$17,600 <span class="kpi-unit">approx.</span></p>' + sourceTag('World Bank, 2024') + '</article>'
    + '</section>'
    + '<section class="panel"><div class="panel-head"><h2>GDP by sector, 2024</h2></div>'
    + barChart(SECTOR_SHARES.map((s) => ({ label: s.sector.split(',')[0], value: s.share })), {
      unit: '%', ariaLabel: 'Share of GDP by sector in 2024',
    })
    + '<ul class="sector-notes">' + SECTOR_SHARES.map((s) => '<li><strong>' + esc(s.sector) + ' — ' + s.share + '%.</strong> ' + esc(s.note) + '</li>').join('') + '</ul>'
    + sourceTag('World Bank / BPS, 2024. Shares rounded; they sum to 100%.') + '</section>'
    + '<section class="panel"><div class="panel-head"><h2 id="gdp-chart-title">GDP per capita, 2015–2024</h2>'
    + '<div class="toggle-row"><button type="button" class="toggle active" data-type="bar">Bars</button>'
    + '<button type="button" class="toggle" data-type="line">Line</button></div></div>'
    + '<div id="gdp-chart"></div>'
    + '<p class="chart-note">GDP per capita rose from US$3,335 in 2015 to US$4,926 in 2024, dipping in 2020 with the pandemic. ' + sourceTag('World Bank, 2015–2024') + '</p></section>';
  function drawGdpChart() {
    const box = document.getElementById('gdp-chart');
    if (chartType === 'bar') {
      box.innerHTML = barChart(SERIES_YEARS.map((y, k) => ({ label: String(y), value: GDP_PER_CAPITA_SERIES[k] })), {
        unit: '', color: '#0f5c5c', ariaLabel: 'GDP per capita by year, 2015 to 2024, as bars',
      });
    } else {
      box.innerHTML = lineChart(SERIES_YEARS, GDP_PER_CAPITA_SERIES, {
        highlightYear: selectedYear, color: '#0f5c5c',
        ariaLabel: 'GDP per capita, 2015 to 2024, as a line',
      });
    }
  }
  drawGdpChart();
  view.querySelectorAll('.toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      chartType = btn.getAttribute('data-type');
      view.querySelectorAll('.toggle').forEach((b) => b.classList.toggle('active', b === btn));
      drawGdpChart();
    });
  });
}

// ---------- Employment & prices ----------
function renderEmployment() {
  view.innerHTML =
    '<section class="hero"><h1>Employment &amp; prices</h1>'
    + '<p class="lede">Unemployment fell to 4.91% in August 2024, the lowest in years, while inflation averaged 1.57% — '
    + 'inside Bank Indonesia’s 2.5% ± 1% target range. Poverty stood at 8.57% in September 2024.</p></section>'
    + '<section class="kpi-grid">'
    + kpiCard(HEADLINES.unemployment) + kpiCard(HEADLINES.inflation) + kpiCard(HEADLINES.poverty)
    + '<article class="kpi"><p class="kpi-label">Labour force</p><p class="kpi-value">152.1 <span class="kpi-unit">million</span></p>' + sourceTag('BPS, Aug 2024') + '</article>'
    + '</section>'
    + '<section class="panel"><div class="panel-head"><h2>Unemployment rate, 2015–2024</h2>' + yearSelector('year-employment') + '</div>'
    + lineChart(SERIES_YEARS, UNEMPLOYMENT_SERIES, {
      unit: '%', highlightYear: selectedYear, decimals: 2, color: '#8a5a08',
      ariaLabel: 'Unemployment rate, 2015 to 2024, in percent',
    })
    + '<p class="chart-note">The 2020 spike to 7.07% was the pandemic shock; the rate has fallen every year since. ' + sourceTag('BPS, August survey, 2015–2024') + '</p></section>'
    + '<section class="panel"><h2>Inflation, 2015–2024</h2>'
    + barChart(SERIES_YEARS.map((y, k) => ({ label: String(y), value: INFLATION_SERIES[k] })), {
      unit: '%', decimals: 2, color: '#0f5c5c', ariaLabel: 'Annual inflation by year, 2015 to 2024',
    })
    + '<p class="chart-note">Inflation peaked at 5.51% in 2022 after fuel-price adjustments, then eased to 1.57% in 2024. ' + sourceTag('BPS, 2015–2024') + '</p></section>'
    + '<section class="panel"><h2>What it means</h2><p>About 60% of workers are in informal work, so the unemployment rate alone understates slack in the labour market. '
    + 'The poverty line in September 2024 was about Rp 595,000 per person per month. ' + sourceTag('BPS, 2024') + '</p></section>';
  bindYearSelector('year-employment', renderEmployment);
}

// ---------- Health & education ----------
function renderHealth() {
  view.innerHTML =
    '<section class="hero"><h1>Health &amp; education</h1>'
    + '<p class="lede">Literacy is near-universal and almost every child is in primary school. Life expectancy reached 74.2 years in 2024, '
    + 'and infant mortality has fallen by a third since 2000.</p></section>'
    + '<section class="kpi-grid">'
    + HEALTH_EDUCATION.slice(0, 4).map((h) => '<article class="kpi"><p class="kpi-label">' + esc(h.indicator) + '</p><p class="kpi-value">' + esc(h.value) + '</p>' + sourceTag(h.source + ', ' + h.year) + '</article>').join('')
    + '</section>'
    + '<section class="panel"><h2>Health and education at a glance</h2>'
    + '<table class="data-table"><thead><tr><th scope="col">Indicator</th><th scope="col">Value</th><th scope="col">Year</th><th scope="col">Source</th></tr></thead><tbody>'
    + HEALTH_EDUCATION.map((h) => '<tr><td>' + esc(h.indicator) + '</td><td>' + esc(h.value) + '</td><td class="num">' + h.year + '</td><td>' + esc(h.source) + '</td></tr>').join('')
    + '</tbody></table></section>'
    + '<section class="panel"><h2>Schooling</h2><p>Net enrolment is about 97% at primary level, 95% at lower secondary and 82% at upper secondary. '
    + 'Indonesia spends roughly 3% of GDP on education and about 4% on health. ' + sourceTag('BPS / World Bank, 2023') + '</p></section>';
}

// ---------- Provinces ----------
function renderProvinces() {
  view.innerHTML =
    '<section class="hero"><h1>Provinces</h1>'
    + '<p class="lede">Java holds about 55% of the population on 7% of the land. Compare the 20 largest provinces below — '
    + 'search, filter by island group, or click any column header to sort.</p></section>'
    + '<section class="panel"><div class="panel-head"><h2>Provinces compared</h2></div>'
    + '<div class="controls"><label class="search-box">Search provinces <input type="search" id="province-search" placeholder="Type a province name…" aria-label="Search provinces"></label>'
    + '<label class="region-picker">Region <select id="region-filter" aria-label="Filter by region">' + REGIONS.map((r) => '<option value="' + esc(r) + '">' + esc(r) + '</option>').join('') + '</select></label></div>'
    + '<div id="province-table"></div>'
    + sourceTag('BPS, mid-2024 population estimates; land area from BPS provincial profiles. Density = population ÷ area.') + '</section>'
    + '<section class="panel"><h2>Largest provinces by population</h2><div id="province-chart"></div>'
    + sourceTag('BPS, mid-2024 estimates.') + '</section>';

  const table = buildSortableTable(document.getElementById('province-table'), [
    { key: 'name', label: 'Province' },
    { key: 'region', label: 'Region' },
    { key: 'population', label: 'Population (million)', numeric: true, format: (v) => fmt(v, 1) },
    { key: 'area', label: 'Area (km²)', numeric: true, format: (v) => fmt(v) },
    { key: 'density', label: 'Density (per km²)', numeric: true, format: (v) => fmt(v) },
  ], PROVINCES.map((p) => ({
    name: p.name,
    region: p.region,
    population: p.population,
    area: p.area,
    density: Math.round((p.population * 1000000) / p.area),
  })), { defaultSort: 'population', defaultDir: -1 });

  document.getElementById('province-search').addEventListener('input', (e) => table.setQuery(e.target.value));
  document.getElementById('region-filter').addEventListener('change', (e) => {
    const region = e.target.value;
    table.setFilter(region === 'All regions' ? null : (r) => r.region === region);
  });

  document.getElementById('province-chart').innerHTML = hbarChart(
    PROVINCES.slice(0, 10).map((p) => ({ label: p.name, value: p.population })),
    { unit: 'm', decimals: 1, ariaLabel: 'Ten largest provinces by population, 2024' },
  );
}

// ---------- Methodology ----------
function renderMethodology() {
  view.innerHTML =
    '<section class="hero"><h1>Methodology &amp; sources</h1>'
    + '<p class="lede">NusaStat is an independent demo portal. Every figure on this site comes from a published official source; '
    + 'nothing here is invented, and nothing is fetched from the network — the site works fully offline.</p></section>'
    + '<section class="panel"><h2>Sources</h2><ul class="source-list">'
    + '<li><strong>BPS — Statistics Indonesia.</strong> Population estimates, GDP growth, unemployment, inflation, poverty, life expectancy, provincial figures. Figures as published in BPS releases, 2015–2024.</li>'
    + '<li><strong>World Bank — World Development Indicators.</strong> GDP in current US dollars, GDP per capita, sector shares, infant mortality, education spending. Accessed 2025; series 2015–2024.</li>'
    + '<li><strong>UNESCO Institute for Statistics.</strong> Adult literacy rate, 2023.</li>'
    + '<li><strong>Ministry of Health, Indonesia.</strong> Hospital bed density, 2023.</li>'
    + '</ul></section>'
    + '<section class="panel"><h2>How the numbers are shown</h2><ul class="source-list">'
    + '<li>Population figures are mid-year estimates in millions, rounded to one decimal place.</li>'
    + '<li>GDP per capita is in current US dollars, rounded to the nearest dollar.</li>'
    + '<li>Unemployment is the August survey rate from BPS; inflation is the annual average.</li>'
    + '<li>Provincial density is computed as population divided by land area, rounded to whole people per km².</li>'
    + '<li>Sector shares are rounded to whole percent and sum to 100% including net taxes on products.</li>'
    + '<li>Where a figure is approximate, the page says so; the exact published value is given where it is known.</li>'
    + '</ul></section>'
    + '<section class="panel"><h2>About NusaStat</h2><p>NusaStat is an original, independent statistics portal built for this demonstration. '
    + 'It is not affiliated with BPS, the World Bank or any government body. Charts are drawn by hand in SVG from the figures above; '
    + 'the site has no trackers, no cookies and no network requests.</p></section>';
}

// ---------- Router ----------
const ROUTES = {
  '': renderOverview,
  population: renderPopulation,
  economy: renderEconomy,
  employment: renderEmployment,
  health: renderHealth,
  provinces: renderProvinces,
  methodology: renderMethodology,
};

function route() {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  const render = ROUTES[hash] || renderOverview;
  render();
  document.querySelectorAll('#site-nav a').forEach((a) => {
    const target = a.getAttribute('href').replace(/^#\/?/, '');
    a.classList.toggle('active', target === hash);
    if (target === hash) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  siteNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
}

navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

window.addEventListener('hashchange', route);
route();

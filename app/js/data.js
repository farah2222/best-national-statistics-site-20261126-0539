// NusaStat data — every figure carries its source and year.
// Figures are the widely published official values from BPS (Statistics
// Indonesia) and the World Bank; series values are rounded published
// estimates. See the Methodology page in the site for the full notes.

// Ten-year series, 2015-2024. Population in millions (BPS, mid-year
// estimates). GDP per capita in current US dollars (World Bank).
// Unemployment in percent of the labour force, August survey (BPS).
export const SERIES_YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const POPULATION_SERIES = [255.2, 258.7, 261.9, 265.0, 268.1, 270.2, 272.7, 275.8, 278.7, 281.6];
export const GDP_PER_CAPITA_SERIES = [3335, 3604, 3843, 3927, 4196, 3934, 4368, 4788, 4871, 4926];
export const UNEMPLOYMENT_SERIES = [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91];
export const INFLATION_SERIES = [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57];

// Headline indicators for the selected year (values for 2024 are the
// defaults shown on first load).
export const HEADLINES = {
  population: { value: 281.6, unit: 'million', label: 'Population', source: 'BPS, 2024' },
  gdp: { value: 1.40, unit: 'trillion US$', label: 'GDP', source: 'World Bank, 2024' },
  gdpPerCapita: { value: 4926, unit: 'US$', label: 'GDP per capita', source: 'World Bank, 2024' },
  growth: { value: 5.03, unit: '%', label: 'GDP growth', source: 'BPS, 2024' },
  unemployment: { value: 4.91, unit: '%', label: 'Unemployment rate', source: 'BPS, Aug 2024' },
  inflation: { value: 1.57, unit: '%', label: 'Inflation (year average)', source: 'BPS, 2024' },
  poverty: { value: 8.57, unit: '%', label: 'Poverty rate', source: 'BPS, Sep 2024' },
  lifeExpectancy: { value: 74.2, unit: 'years', label: 'Life expectancy at birth', source: 'BPS, 2024' },
};

// GDP by broad sector, share of GDP in percent (World Bank / BPS, 2024,
// rounded; taxes less subsidies on products make up the remainder).
export const SECTOR_SHARES = [
  { sector: 'Services', share: 44, note: 'trade, transport, finance, government, other services' },
  { sector: 'Industry', share: 40, note: 'manufacturing, mining, construction, utilities' },
  { sector: 'Agriculture, forestry & fishing', share: 12, note: 'crops, livestock, forestry, fisheries' },
  { sector: 'Taxes less subsidies', share: 4, note: 'net taxes on products' },
];

// Health and education indicators.
export const HEALTH_EDUCATION = [
  { indicator: 'Adult literacy rate', value: '96%', year: 2023, source: 'UNESCO Institute for Statistics' },
  { indicator: 'Primary school net enrolment', value: '97%', year: 2023, source: 'BPS / Ministry of Education' },
  { indicator: 'Infant mortality rate', value: '17 per 1,000 live births', year: 2023, source: 'World Bank' },
  { indicator: 'Life expectancy at birth', value: '74.2 years', year: 2024, source: 'BPS' },
  { indicator: 'Hospital beds', value: '1.6 per 10,000 people', year: 2023, source: 'Ministry of Health' },
  { indicator: 'Median age', value: '30.4 years', year: 2024, source: 'BPS' },
  { indicator: 'Fertility rate', value: '2.1 children per woman', year: 2024, source: 'BPS' },
  { indicator: 'Share of population under 15', value: '24%', year: 2024, source: 'BPS' },
];

// Selected provinces: population in millions and land area in km2,
// mid-2024 estimates (BPS). Density is computed from these two numbers.
export const PROVINCES = [
  { name: 'West Java', region: 'Java', population: 49.9, area: 35378 },
  { name: 'East Java', region: 'Java', population: 41.6, area: 47800 },
  { name: 'Central Java', region: 'Java', population: 37.9, area: 32801 },
  { name: 'North Sumatra', region: 'Sumatra', population: 15.6, area: 72981 },
  { name: 'Banten', region: 'Java', population: 12.7, area: 9663 },
  { name: 'Jakarta', region: 'Java', population: 10.6, area: 664 },
  { name: 'South Sulawesi', region: 'Sulawesi', population: 9.5, area: 46717 },
  { name: 'Lampung', region: 'Sumatra', population: 9.4, area: 34624 },
  { name: 'South Sumatra', region: 'Sumatra', population: 9.0, area: 91592 },
  { name: 'Riau', region: 'Sumatra', population: 6.9, area: 87024 },
  { name: 'West Sumatra', region: 'Sumatra', population: 6.0, area: 42013 },
  { name: 'West Kalimantan', region: 'Kalimantan', population: 5.9, area: 147307 },
  { name: 'Aceh', region: 'Sumatra', population: 5.5, area: 57956 },
  { name: 'Bali', region: 'Bali & Nusa Tenggara', population: 4.4, area: 5780 },
  { name: 'South Kalimantan', region: 'Kalimantan', population: 4.3, area: 38744 },
  { name: 'East Kalimantan', region: 'Kalimantan', population: 4.0, area: 129067 },
  { name: 'Yogyakarta', region: 'Java', population: 3.8, area: 3133 },
  { name: 'Jambi', region: 'Sumatra', population: 3.7, area: 50058 },
  { name: 'Central Kalimantan', region: 'Kalimantan', population: 2.8, area: 153564 },
  { name: 'North Sulawesi', region: 'Sulawesi', population: 2.7, area: 13892 },
];

export const REGIONS = ['All regions', 'Java', 'Sumatra', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara'];

// Short release notes shown on the overview page.
export const RELEASES = [
  { date: 'Nov 2024', title: 'Population estimate 2024: 281.6 million', source: 'BPS' },
  { date: 'Feb 2025', title: 'Economy grew 5.03% in 2024', source: 'BPS' },
  { date: 'Nov 2024', title: 'Unemployment fell to 4.91% (August 2024)', source: 'BPS' },
  { date: 'Jan 2025', title: 'Inflation averaged 1.57% in 2024', source: 'BPS' },
  { date: 'Jul 2024', title: 'Poverty rate 8.57% (September 2024)', source: 'BPS' },
];

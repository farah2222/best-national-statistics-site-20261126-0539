[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/farah2222/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/farah2222/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# NusaStat — Indonesia in Numbers

NusaStat is an original national statistics portal for Indonesia. It shows population, economy, employment and prices, health and education, and a sortable, filterable table of the 20 largest provinces — with every figure traced to its source and year (BPS Statistics Indonesia, the World Bank, UNESCO, Indonesia's Ministry of Health).

Everything is static files with no build step and no network requests: hand-drawn SVG charts, hash-routed sections, a year selector, chart-type toggles, tab switching, province search and region filtering, and a mobile layout. It works fully offline on desktop and on a phone.

## Run it

Serve `app/` with any static server, for example:

```sh
python3 -m http.server -d app
```

Then open http://localhost:8000/ in a browser.

## Layout

- `app/index.html` — page shell and navigation
- `app/css/main.css` — all styling (deep teal + warm amber on off-white)
- `app/js/data.js` — every figure, with source and year
- `app/js/charts.js` — hand-drawn SVG line/bar chart builders
- `app/js/tables.js` — sortable, filterable table builder
- `app/js/app.js` — hash routing, page rendering and controls
- `screenshots/` — real renders of the site in a browser
- `main.ts` — entry program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `buildDossier`

<sub>Entered on [make.fun](https://make.fun/?ref=03swhpzc&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>

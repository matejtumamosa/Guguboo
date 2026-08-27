# GuGuBoo

GuGuBoo is a Slovak-language static web application for pregnancy, early childcare, family coordination, travel information, and memories. This repository contains the Netlify-ready site with no build step or server-side component.

## Project structure

- `index.html` — public landing page
- `app.html` — browser-based application
- `v4-landing.css` — landing-page styles
- `v4-upgrade.css`, `v5-mobile.css` — application styles
- `v4-upgrade.js`, `v5-mobile.js` — application behavior
- `_headers` — Netlify security and cache headers
- PNG and MP4 files — site media

## Run locally

Serve the repository root with any static HTTP server. For example, with Python installed:

```sh
python -m http.server 8080
```

Then open <http://localhost:8080>.

## Deploy to Netlify

Connect the repository to Netlify and use these settings:

- Build command: none
- Publish directory: `.`

The app stores user-entered data in the browser's local storage. Geolocation is optional and reverse geocoding uses OpenStreetMap's Nominatim service. Google Fonts and links to public Slovak and EU resources are loaded from external sites.

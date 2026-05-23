# Strategi-portal v2

Produksjonsklar redesign av strategi-portalen. Plasseres som
**`strategi-v2/`** ved siden av eksisterende `strategi/`, deler data og
API med v1.

## Hva er nytt vs v1

- Lys business-estetikk (papirhvit + dyp skoggrønn + champagne) — ingen
  GitHub-dark-mode-arv
- Editorielle layouts: SWOT som 4 kolonner, Three Horizons på faktisk
  tidsakse, scenarier med linjegraf
- Egen burgundy-palett for styremateriell (frontispice + sammendrag)
- Editor med statussteg (utkast → validert → vedtatt), live autosave i
  localStorage, og publish-to-GitHub via samme API som v1

## Filer

```
strategi-v2/
├── index.html         · Oversikt (retning + fokus + mål + Brreg-økonomi)
├── dokument.html      · SWOT + horisonter + initiativer
├── scenarier.html     · Base / Offensiv / Bull + linjegraf
├── tiltak.html        · Status-strip + initiativ-kort
├── styre.html         · Burgundy frontispice + sammendrag (print-klar)
├── rediger.html       · Full editor med API-save
├── app.css            · Alle design tokens og komponenter
├── app.js             · Sidebar + topbar + scope-picker
├── config.js          · Selskap-meta, horisonter, scenarier (statisk)
├── data-loader.js     · Fetch JSON + draft-buffer + push API
├── render.js          · Felles render-helpers for alle sider
├── data/              · Lokal fallback-kopi av strategi-data (for testing)
│   └── byggmester-fritzoe.json
└── README.md
```

## Datakilder

| Type | Hvor | Hvem styrer |
|---|---|---|
| Strategi-dokument | `../strategi/data/{id}.json` | DL via editor → API |
| Selskap-meta | `config.js` (statisk) | utvikler |
| Horisonter | `config.js` (statisk) | utvikler / styre |
| Scenarier | `config.js` (statisk) | utvikler / styre |
| Lokalt utkast | `localStorage` (browser) | DL |

Editor-saves går til samme `strategi/data/{id}.json` som v1 leser — så
de to portalene deler data, og du kan kjøre dem parallelt.

## Deploy

### Forutsetninger (du har allerede dette)

- Vercel-prosjekt koblet til `FunksterOne/SA-op-st-dashboard`
- Env-vars satt: `GITHUB_TOKEN`, `DL_SECRET_BYGGMESTER_FRITZOE`,
  `ALLOWED_ORIGIN`, mfl.
- `api/push-strategi.js` finnes i repoet (uendret)

### Steg

1. **Kopier mappa inn i repoet**

   ```bash
   # I rot av SA-op-st-dashboard:
   cp -r path/to/strategi-v2 .
   ```

2. **Push**

   ```bash
   git add strategi-v2/
   git commit -m "Add strategi-portal v2 (redesign)"
   git push
   ```

3. **Vercel deployer automatisk.** Etter ~60 sek er v2 tilgjengelig på:
   - `https://sa-op-st-dashboard.vercel.app/strategi-v2/`
   - eller via GitHub Pages: `https://funksterone.github.io/SA-op-st-dashboard/strategi-v2/`

4. **CORS — viktig hvis du serverer fra GH Pages**

   Editor-en POST-er til Vercel API. Sjekk at `ALLOWED_ORIGIN` i Vercel
   er satt til `https://funksterone.github.io`. Hvis du vil bruke begge
   (GH Pages + Vercel direkte), endre i `api/push-strategi.js`:

   ```js
   const allowedOrigins = [
     'https://funksterone.github.io',
     'https://sa-op-st-dashboard.vercel.app',
   ];
   const origin = req.headers.origin;
   res.setHeader(
     'Access-Control-Allow-Origin',
     allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
   );
   ```

5. **Push-URL override** (kun nødvendig hvis du serverer fra GH Pages)

   I nettleser-konsoll på `strategi-v2/rediger.html`:

   ```js
   localStorage.setItem('STRATEGI_PUSH_URL',
     'https://sa-op-st-dashboard.vercel.app/api/push-strategi');
   ```

   Default fallback bygges automatisk når origin er `*.github.io`.

## Lokal testing

```bash
npx serve .
# åpne http://localhost:3000/strategi-v2/index.html
```

Uten Vercel-API tilgjengelig vil "Lagre + publiser" feile, men "Lagre
lokalt" virker (data ligger i localStorage).

For å teste full publish-flow lokalt, kjør Vercel CLI:

```bash
npx vercel dev
# Krever Vercel-konto og .env med GITHUB_TOKEN, DL_SECRET_*, ALLOWED_ORIGIN
```

## Faseskift fra v1 til v2

Anbefalt løype:

1. **Sameksistens** — deploy v2 ved siden av v1 (denne pakken).
   Begge leser samme JSON. DL kan teste v2 uten å miste v1.
2. **Hovedlenke** — endre lenker i operativ-portalen til å peke på
   `strategi-v2/` i stedet for `strategi/`.
3. **Arkiver v1** — etter et par uker uten regresjon, rename
   `strategi/` til `strategi-v1-archive/` og `strategi-v2/` til
   `strategi/`. Husk å oppdatere `dataUrls` i `config.js`.

## Selskap-utvidelse (Areal, Braa)

Når DL for Areal eller Braa skal kunne redigere:

1. Sett `aktiv: true` på selskap-entryen i `config.js`
2. Opprett `strategi/data/{selskap-id}.json` med tom struktur
3. Legg til horisonter + scenarier per selskap i `config.js`
4. Sett `DL_SECRET_*` i Vercel for det selskapet

## Vedlikehold

- **CSS-tokens** ligger øverst i `app.css` — bytt aksent-farger der
- **Statisk strategirammeverk** (horisonter, scenarier) i `config.js`
- **Render-helpers** i `render.js` — alle pure functions, lett å teste

## Kjente begrensninger

- Drag-sortering av fokus-punkter er foreløpig kun visuell handle
  (klikk-pil opp/ned kommer senere)
- Scenarier er statisk konfigurasjon, ikke redigerbare via editor
- SWOT er foreløpig read-only (bygges fra `bakgrunn.swot` i JSON);
  DL kan redigere via direkte JSON-push hvis nødvendig
- Print-stylesheet (`@media print`) er kun definert for `styre.html`

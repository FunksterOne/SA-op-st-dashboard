# Vercel-oppsett for strategi-push

Form-editoren (`strategi/strategi-rediger.html`) sender strategi-oppdateringer fra
DL til en Vercel-funksjon (`api/push-strategi.js`) som committer endringene
til `main` via GitHub API. Pages-deployen tar over etterpå.

Denne fila beskriver engangsoppsettet i Vercel.

## 1. Lag en GitHub Personal Access Token (PAT)

Funksjonen trenger en PAT med skrivetilgang til repoet for å committe.

1. Gå til <https://github.com/settings/personal-access-tokens/new> (fine-grained token, anbefalt)
2. Token name: `sa-strategi-push`
3. Resource owner: din konto eller FunksterOne (avhengig av eier)
4. Repository access: **Only select repositories** → velg `SA-op-st-dashboard`
5. Repository permissions:
   - **Contents: Read and write** (eneste som trengs)
6. Generate token → kopier den (den vises bare én gang)

## 2. Opprett Vercel-prosjekt

1. Logg inn på <https://vercel.com>
2. **Add New… → Project**
3. Importer GitHub-repoet `FunksterOne/SA-op-st-dashboard`
4. Framework Preset: **Other** (Vercel oppdager automatisk at `/api`-mappa er serverless functions)
5. Build settings: la dem være som default (ingen build-kommando, ingen output-dir)
6. Environment Variables (klikk «Add»):
   - `GITHUB_TOKEN` = PAT-en fra steg 1
   - `DL_SECRET_BYGGMESTER_FRITZOE` = et passord du velger for DL Brynjar Storvik
   - `DL_SECRET_AREAL_BYGGSERVICE` = passord for DL Brynjar Storvik (kan være samme som over hvis Brynjar håndterer begge)
   - `DL_SECRET_BRAA_SORVAAG_BYGG` = passord for DL Øyvind Berggren
   - `ALLOWED_ORIGIN` = `https://funksterone.github.io` (CORS — endres hvis du bytter Pages-host)
7. **Deploy**

Vercel deployer raskt — typisk 30–60 sek. Du får tildelt en URL som
`https://sa-op-st-dashboard.vercel.app` (eller variant av den).

## 3. Oppdater URL-en i form-editoren

Form-editoren `strategi/strategi-rediger.html` har en konstant øverst i scriptet:

```js
const DEFAULT_PUSH_URL = 'https://sa-op-st-dashboard.vercel.app/api/push-strategi';
```

Hvis Vercel ga deg et annet prosjektnavn, oppdater denne konstanten og push på nytt.

## 4. Test funksjonen

### Med curl

```bash
curl -X POST https://DIN-VERCEL-URL.vercel.app/api/push-strategi \
  -H "Content-Type: application/json" \
  -d '{
    "selskap_id": "byggmester-fritzoe",
    "passord": "DL_SECRET_BYGGMESTER_FRITZOE-verdien",
    "dl_navn": "Test",
    "strategi": { ... }
  }'
```

Forventet respons ved suksess:
```json
{
  "ok": true,
  "commit_sha": "...",
  "commit_url": "https://github.com/FunksterOne/SA-op-st-dashboard/commit/...",
  "message": "Strategi oppdatert: byggmester-fritzoe (DL Test)"
}
```

### Med form-editoren

1. Åpne `https://funksterone.github.io/SA-op-st-dashboard/strategi/strategi-rediger.html`
2. Velg et selskap fra sidebar-scope-velgeren (sørg for at scope er det riktige)
3. Endre f.eks. intensjon-feltet litt
4. Skriv inn passord
5. Klikk «Push til main →»
6. Sjekk at commit-en dukker opp på <https://github.com/FunksterOne/SA-op-st-dashboard/commits/main>

## 5. Sikkerhet

- **PAT-en er kun lagret i Vercel** som env-variabel, aldri eksponert i klient-koden.
- **Passordene** er sjekket på server-siden, så de kan ikke utledes fra HTML/JS-kilden.
- **CORS** er låst til `ALLOWED_ORIGIN` så form-editoren bare kan kalles fra GH Pages.
- **Innhold valideres** av funksjonen før commit (sjekker påkrevde felter, gyldig selskap-id, passord-match).

## 6. Hvis du vil rotere passord

- Endre env-variabelen i Vercel-prosjektet → **Settings → Environment Variables**
- Klikk **Redeploy** øverst i prosjektet for at endringen skal slå inn
- Gi det nye passordet til DL

## 7. Hvis PAT-en utløper

Fine-grained PAT-er har utløpsdato. Når den nærmer seg:

1. Generer en ny PAT på samme måte som i steg 1
2. Oppdater `GITHUB_TOKEN` i Vercel
3. Klikk Redeploy

## 8. Troubleshooting

| Symptom | Sannsynlig årsak | Løsning |
|---|---|---|
| `401 Feil passord` | DL skrev feil passord, eller env-var ikke satt | Sjekk Vercel-env-vars |
| `500 Mangler miljøvariabel ...` | Glemt å sette env-var for et selskap | Legg til i Vercel og redeploy |
| `502 Kunne ikke hente selskaper.js: 401` | PAT er ugyldig eller utløpt | Lag ny PAT |
| `502 Kunne ikke hente selskaper.js: 404` | Feil repo-navn i funksjonen | Sjekk `REPO_OWNER`/`REPO_NAME` i `api/push-strategi.js` |
| `500 Fant ikke markørene` | Noen har fjernet `// strategi-start:` eller `// strategi-end:` i `selskaper.js` | Legg tilbake markørene |
| CORS-feil i nettleser | `ALLOWED_ORIGIN` ikke satt eller feil | Sett til `https://funksterone.github.io` |

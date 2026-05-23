# Test: Regnskap (Brreg / Proff-kilde)

Dato: 2026-05-22 · Org.nr **984 343 442** (Byggmester Fritzøe AS)

## Konklusjon

| Kilde | Resultat |
|-------|----------|
| **Proff.no** (manuell sjekk) | 2024: omsetning 72 040 (tusen kr), EBIT 5 557, EK 1 480 |
| **Brreg Regnskapsregister API** | `GET https://data.brreg.no/regnskapsregisteret/regnskap/984343442` — **matcher Proff** |
| **Direkte fetch fra nettleser** | **Blokkeres** (ingen CORS-header) → løst med `api/hent-regnskap.js` på Vercel |

Proff viser regnskap fra Brønnøysundregistrene; vi bruker Brreg API (gratis, stabil) — ikke Proff API (betalt).

## Brreg rådata 2024 (kr)

| Felt | Verdi | Proff (tusen kr) |
|------|------:|-----------------:|
| Driftsinntekter | 72 040 277 | 72 040 ✓ |
| Driftsresultat | 5 557 410 | 5 557 ✓ |
| Resultat før skatt | 5 655 335 | 5 655 ✓ |
| Årsresultat | 4 408 450 | 4 408 ✓ |
| Sum egenkapital | 1 480 339 | 1 480 ✓ |
| Driftsmargin | 7,7 % | (beregnet) |

## Implementert

- `okonomi` i `data/byggmester-fritzoe.json`
- Visning på `index.html`, redigering på `rediger.html`
- Knapp «Hent siste regnskap fra Brreg»
- Redigerbart budsjett **2027**

## Deploy

Redeploy **Vercel** for `api/hent-regnskap.js` (ny) og oppdatert `api/push-strategi.js`.

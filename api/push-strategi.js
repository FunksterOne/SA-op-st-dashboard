// =====================================================================
// Vercel-funksjon — push av strategi-oppdatering til selskaper.js
// =====================================================================
// Tar imot POST med selskap-id, passord og strategi-objekt fra form-editoren,
// validerer, formaterer strategien som JS-objekt og commiter selskaper.js
// til main via GitHub API. Pages-deploy starter automatisk etter commit.
//
// Miljøvariabler (settes i Vercel):
//   GITHUB_TOKEN                    — PAT med repo:contents (write) på SA-op-st-dashboard
//   DL_SECRET_BYGGMESTER_FRITZOE    — passord for DL Fritzøe
//   DL_SECRET_AREAL_BYGGSERVICE     — passord for DL Areal
//   DL_SECRET_BRAA_SORVAAG_BYGG     — passord for DL Braa
//   ALLOWED_ORIGIN                  — f.eks. https://funksterone.github.io
// =====================================================================

const REPO_OWNER = 'FunksterOne';
const REPO_NAME = 'SA-op-st-dashboard';
const REPO_PATH = 'selskaper.js';
const REPO_BRANCH = 'main';
const VALID_SELSKAP = ['byggmester-fritzoe', 'areal-byggservice', 'braa-sorvaag-bygg'];

module.exports = async function handler(req, res) {
  // CORS — tillat GH Pages-origin
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://funksterone.github.io';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { selskap_id, passord, strategi, dl_navn } = req.body || {};

    // Validering av input
    if (!selskap_id || !passord || !strategi) {
      return res.status(400).json({ error: 'Mangler selskap_id, passord eller strategi' });
    }
    if (!VALID_SELSKAP.includes(selskap_id)) {
      return res.status(400).json({ error: 'Ugyldig selskap_id' });
    }

    // Autentisering — passord mot env-variabel pr selskap
    const envKey = 'DL_SECRET_' + selskap_id.toUpperCase().replace(/-/g, '_');
    const expected = process.env[envKey];
    if (!expected) {
      return res.status(500).json({ error: `Mangler miljøvariabel ${envKey} i Vercel` });
    }
    if (passord !== expected) {
      return res.status(401).json({ error: 'Feil passord' });
    }

    // Sjekk at strategi har påkrevde topp-felter
    const required = ['utkast_status', 'intensjon', 'swot', 'pestel', 'horisonter', 'initiativer', 'strategy_map'];
    for (const f of required) {
      if (!(f in strategi)) return res.status(400).json({ error: `Strategi mangler felt: ${f}` });
    }

    // Hent gjeldende selskaper.js
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) return res.status(500).json({ error: 'Mangler GITHUB_TOKEN i Vercel' });

    const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REPO_PATH}?ref=${REPO_BRANCH}`;
    const fileRes = await fetch(fileUrl, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'User-Agent': 'sa-strategi-push',
        'Accept': 'application/vnd.github+json',
      },
    });
    if (!fileRes.ok) {
      const text = await fileRes.text();
      return res.status(502).json({ error: `Kunne ikke hente selskaper.js: ${fileRes.status} ${text}` });
    }
    const fileData = await fileRes.json();
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');

    // Bygg ny strategi-blokk og erstatt mellom markørene
    const newBlock = formatStrategiBlock(strategi);
    const startMarker = `// strategi-start: ${selskap_id}`;
    const endMarker = `// strategi-end: ${selskap_id}`;
    const startIdx = currentContent.indexOf(startMarker);
    const endIdx = currentContent.indexOf(endMarker);
    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
      return res.status(500).json({ error: 'Fant ikke markørene i selskaper.js for ' + selskap_id });
    }
    // Behold linjen med start-markøren, erstatt alt mellom den og end-markøren
    const before = currentContent.substring(0, startIdx + startMarker.length);
    const after = currentContent.substring(endIdx);
    const newContent = before + '\n' + newBlock + '\n    ' + after;

    // Sjekk at vi faktisk endrer noe (no-op-deteksjon)
    if (newContent === currentContent) {
      return res.status(200).json({ ok: true, no_change: true });
    }

    // Commit til main
    const commitMsg = `Strategi oppdatert: ${selskap_id}${dl_navn ? ` (DL ${dl_navn})` : ''}`;
    const putUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REPO_PATH}`;
    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'User-Agent': 'sa-strategi-push',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitMsg,
        content: Buffer.from(newContent, 'utf-8').toString('base64'),
        sha: fileData.sha,
        branch: REPO_BRANCH,
      }),
    });
    if (!putRes.ok) {
      const text = await putRes.text();
      return res.status(502).json({ error: `GitHub commit feilet: ${putRes.status} ${text}` });
    }
    const putData = await putRes.json();
    return res.status(200).json({
      ok: true,
      commit_sha: putData.commit?.sha,
      commit_url: putData.commit?.html_url,
      message: commitMsg,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Uventet feil: ' + (err.message || String(err)) });
  }
}

// =====================================================================
// Formaterer strategi-objektet som JS-kildekode (object literal).
// Bruker single-quote-escapede strenger, ingen quote rundt nøkler.
// Indentert med 6 mellomrom (matcher resten av selskaper.js).
// =====================================================================
function formatStrategiBlock(strategi) {
  return '    strategi: ' + jsLiteral(strategi, 2) + ',';
}

function jsLiteral(value, indentLevel) {
  const indent = '  '.repeat(indentLevel);
  const innerIndent = '  '.repeat(indentLevel + 1);

  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return jsString(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map(v => innerIndent + jsLiteral(v, indentLevel + 1));
    return '[\n' + items.join(',\n') + ',\n' + indent + ']';
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    const props = keys.map(k => {
      const v = jsLiteral(value[k], indentLevel + 1);
      return innerIndent + jsKey(k) + ': ' + v;
    });
    return '{\n' + props.join(',\n') + ',\n' + indent + '}';
  }

  return 'null';
}

function jsKey(k) {
  // Bare bruk strenglitteral hvis nøkkelen inneholder spesialtegn
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)) return k;
  return jsString(k);
}

function jsString(s) {
  // Escape backslash og single quote — andre tegn (æøå, em-dash, %, soft hyphen) er trygge i UTF-8
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
}

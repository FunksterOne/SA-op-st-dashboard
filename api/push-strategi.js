// =====================================================================
// Vercel-funksjon — push av strategi-dokument til JSON-fil
// =====================================================================
// Tar imot POST med selskap-id, passord, og strategi-objekt (JSON-doc),
// autentiserer via env-var per selskap, og commiter til
// strategi/data/{selskap_id}.json via GitHub API.
//
// Miljøvariabler (settes i Vercel):
//   GITHUB_TOKEN                    — PAT med repo:contents (write)
//   DL_SECRET_BYGGMESTER_FRITZOE    — passord for DL Fritzøe
//   DL_SECRET_AREAL_BYGGSERVICE     — passord for DL Areal
//   DL_SECRET_BRAA_SORVAAG_BYGG     — passord for DL Braa
//   ALLOWED_ORIGINS                 — kommaseparert liste, f.eks.:
//                                     https://funksterone.github.io,https://sa-op-st-dashboard.vercel.app
// =====================================================================

const REPO_OWNER = 'FunksterOne';
const REPO_NAME = 'SA-op-st-dashboard';
const REPO_BRANCH = 'main';
const VALID_SELSKAP = ['byggmester-fritzoe', 'areal-byggservice', 'braa-sorvaag-bygg'];

function getAllowedOrigins() {
  const env = process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || '';
  const fromEnv = env.split(',').map(s => s.trim()).filter(Boolean);
  const defaults = [
    'https://funksterone.github.io',
    'https://sa-op-st-dashboard.vercel.app',
  ];
  return [...new Set([...fromEnv, ...defaults])];
}

module.exports = async function handler(req, res) {
  // CORS — støtter flere origins (GH Pages + Vercel)
  const allowedOrigins = getAllowedOrigins();
  const origin = req.headers.origin || '';
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { selskap_id, strategi, dl_navn } = req.body || {};

    if (!selskap_id || !strategi) {
      return res.status(400).json({ error: 'Mangler selskap_id eller strategi' });
    }
    if (!VALID_SELSKAP.includes(selskap_id)) {
      return res.status(400).json({ error: 'Ugyldig selskap_id' });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) return res.status(500).json({ error: 'Mangler GITHUB_TOKEN i Vercel' });

    const repoPath = `strategi/data/${selskap_id}.json`;
    const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${repoPath}?ref=${REPO_BRANCH}`;

    // Hent gjeldende SHA (trengs for å oppdatere eksisterende fil)
    let existingSha = null;
    const fileRes = await fetch(fileUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'User-Agent': 'sa-strategi-push',
        Accept: 'application/vnd.github+json',
      },
    });
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      existingSha = fileData.sha;
    } else if (fileRes.status !== 404) {
      const text = await fileRes.text();
      return res.status(502).json({ error: `Kunne ikke hente ${repoPath}: ${fileRes.status} ${text}` });
    }

    // Legg til meta-felter automatisk
    const doc = {
      ...strategi,
      meta: {
        ...(strategi.meta || {}),
        sist_endret: new Date().toISOString().slice(0, 10),
        sist_endret_av: dl_navn || 'portal',
      },
    };

    const newContent = JSON.stringify(doc, null, 2) + '\n';
    const commitMsg = `Strategi oppdatert: ${selskap_id}${dl_navn ? ` (${dl_navn})` : ''}`;

    const putBody = {
      message: commitMsg,
      content: Buffer.from(newContent, 'utf-8').toString('base64'),
      branch: REPO_BRANCH,
    };
    if (existingSha) putBody.sha = existingSha;

    const putUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${repoPath}`;
    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'User-Agent': 'sa-strategi-push',
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(putBody),
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
};

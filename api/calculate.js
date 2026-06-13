// api/calculate.js — Routeur vers les moteurs de calcul spécialisés
const fs = require("fs");
const path = require("path");

// Registre des calculateurs — ajouter ici pour chaque nouveau métier
const CALCULATORS = {
  roof_v1:    require("./calculators/roof_v1"),
  moving_v1:  require("./calculators/moving_v1"),
  windows_v1: require("./calculators/windows_v1"),
};

function getLicenses() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "licenses.json"), "utf-8"));
}

function extractDomain(origin) {
  if (!origin) return null;
  try { return new URL(origin).hostname.replace(/^www\./, ""); }
  catch { return origin.replace(/^www\./, "").split("/")[0]; }
}

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  };
}

module.exports = async (req, res) => {
  const origin = req.headers.origin || req.headers.referer || "";
  if (req.method === "OPTIONS") {
    Object.entries(cors(origin)).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(200).end();
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  Object.entries(cors(origin)).forEach(([k, v]) => res.setHeader(k, v));

  const { license, answers } = req.body || {};
  if (!license || !answers) return res.status(400).json({ error: "Missing license or answers" });

  const licenses = getLicenses();
  const config = licenses[license];
  if (!config || !config.active) return res.status(403).json({ error: "Invalid or inactive license" });

  const requestDomain = extractDomain(origin);
  const allowedDomain = config.company.domain.replace(/^www\./, "");
  const isLocal = !requestDomain || ["localhost", "127.0.0.1"].includes(requestDomain) || requestDomain.endsWith(".vercel.app");
  if (!isLocal && requestDomain !== allowedDomain) {
    return res.status(403).json({ error: "Domain not authorized" });
  }

  // Sélection du calculateur via le registre
  const calculatorFn = CALCULATORS[config.calculator];
  if (!calculatorFn) {
    return res.status(500).json({ error: `Unknown calculator: ${config.calculator}` });
  }

  // Validation basique des answers
  const surfaceOrQty = parseFloat(answers.surface || answers.quantity || answers.distance || 1);
  if (surfaceOrQty < 0 || surfaceOrQty > 100000) {
    return res.status(400).json({ error: "Invalid value" });
  }

  try {
    const result = calculatorFn(answers, config.pricing);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[calculate]", err);
    return res.status(500).json({ error: "Calculation failed" });
  }
};

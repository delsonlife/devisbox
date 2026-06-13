// api/calculate.js — Routeur vers les moteurs de calcul
const fs   = require("fs");
const path = require("path");

const CALCULATORS = {
  roof_v1:    require("./calculators/roof_v1"),
  moving_v1:  require("./calculators/moving_v1"),
  windows_v1: require("./calculators/windows_v1"),
};

function getLicenses() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "licenses.json"), "utf-8"));
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
}

function isOriginAllowed(origin, config) {
  if (!origin) return true;
  const allowed = config.allowedOrigins || [];
  allowed.push("https://devisbox.vercel.app");
  return (
    allowed.includes(origin) ||
    origin.startsWith("http://localhost") ||
    origin.startsWith("http://127.0.0.1")
  );
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { license, answers } = req.body || {};
  if (!license || !answers) return res.status(400).json({ error: "Missing license or answers" });

  const licenses = getLicenses();
  const config   = licenses[license];
  if (!config || !config.active) return res.status(403).json({ error: "Invalid or inactive license" });

  const origin = req.headers.origin || "";
  if (!isOriginAllowed(origin, config)) {
    return res.status(403).json({ error: "Origin not authorized" });
  }

  const calculatorFn = CALCULATORS[config.calculator];
  if (!calculatorFn) return res.status(500).json({ error: `Unknown calculator: ${config.calculator}` });

  try {
    const result = calculatorFn(answers, config.pricing);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[calculate]", err);
    return res.status(500).json({ error: "Calculation failed" });
  }
};

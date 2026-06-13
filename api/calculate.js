// api/calculate.js
const fs   = require("fs");
const path = require("path");

const CALCULATORS = {
  roof_v1:    require("./calculators/roof_v1"),
  moving_v1:  require("./calculators/moving_v1"),
  windows_v1: require("./calculators/windows_v1"),
};

module.exports = async (req, res) => {

  // ── CORS en PREMIER ────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let licenses;
  try {
    licenses = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "licenses.json"), "utf-8"));
  } catch (err) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const { license, answers } = req.body || {};
  if (!license || !answers) return res.status(400).json({ error: "Missing license or answers" });

  const config = licenses[license];
  if (!config || !config.active) return res.status(403).json({ error: "Invalid or inactive license" });

  const origin = req.headers.origin || "";
  if (origin) {
    const allowed = ["https://devisbox.vercel.app", ...(config.allowedOrigins || [])];
    const isAllowed = allowed.includes(origin) || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");
    if (!isAllowed) return res.status(403).json({ error: "Origin not authorized" });
  }

  const calculatorFn = CALCULATORS[config.calculator];
  if (!calculatorFn) return res.status(500).json({ error: `Unknown calculator: ${config.calculator}` });

  try {
    return res.status(200).json(calculatorFn(answers, config.pricing));
  } catch (err) {
    console.error("[calculate]", err);
    return res.status(500).json({ error: "Calculation failed" });
  }
};

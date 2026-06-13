// api/license.js — Vérification licence + retourne config publique (branding + questions)
const fs = require("fs");
const path = require("path");

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
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  Object.entries(cors(origin)).forEach(([k, v]) => res.setHeader(k, v));

  const { license } = req.query;
  if (!license) return res.status(400).json({ error: "Missing license key" });

  const licenses = getLicenses();
  const config = licenses[license];
  if (!config || !config.active) return res.status(403).json({ error: "Invalid or inactive license" });

  const requestDomain = extractDomain(origin);
  const allowedDomain = config.company.domain.replace(/^www\./, "");
  const isLocal = !requestDomain || ["localhost", "127.0.0.1"].includes(requestDomain) || requestDomain.endsWith(".vercel.app");

  if (!isLocal && requestDomain !== allowedDomain) {
    return res.status(403).json({ error: "Domain not authorized" });
  }

  // Retourner UNIQUEMENT les infos publiques — jamais les pricing
  return res.status(200).json({
    valid: true,
    company: { name: config.company.name, phone: config.company.phone || null },
    branding: config.branding,
    trade: config.trade,
    questions: config.questions, // questions dynamiques
  });
};

// api/lead.js
const fs   = require("fs");
const path = require("path");

function getLicenses() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "licenses.json"), "utf-8"));
}
function getLeads() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "leads.json"), "utf-8")); }
  catch { return []; }
}
function saveLead(lead) {
  const leads = getLeads();
  leads.push(lead);
  fs.writeFileSync(path.join(process.cwd(), "data", "leads.json"), JSON.stringify(leads, null, 2));
}

module.exports = async (req, res) => {

  // ── CORS en PREMIER ────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let licenses;
  try {
    licenses = getLicenses();
  } catch (err) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const { license, lead } = req.body || {};
  if (!license || !lead) return res.status(400).json({ error: "Missing data" });

  const config = licenses[license];
  if (!config || !config.active) return res.status(403).json({ error: "Invalid license" });

  const origin = req.headers.origin || "";
  if (origin) {
    const allowed = ["https://devisbox.vercel.app", ...(config.allowedOrigins || [])];
    const isAllowed = allowed.includes(origin) || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");
    if (!isAllowed) return res.status(403).json({ error: "Origin not authorized" });
  }

  if (!lead.name?.trim() || lead.name.trim().length < 2) return res.status(400).json({ error: "Invalid name" });
  if (!/^[\d\s\+\-\.]{8,20}$/.test(lead.phone))          return res.status(400).json({ error: "Invalid phone" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))    return res.status(400).json({ error: "Invalid email" });

  const saved = {
    id:        `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    license,
    trade:     config.trade,
    name:      lead.name.trim(),
    phone:     lead.phone.trim(),
    email:     lead.email.trim().toLowerCase(),
    answers:   lead.answers || {},
    estimate:  lead.estimate || null,
    createdAt: new Date().toISOString(),
  };

  try {
    saveLead(saved);
    return res.status(201).json({ success: true, leadId: saved.id });
  } catch (err) {
    console.error("[lead]", err);
    return res.status(500).json({ error: "Failed to save lead" });
  }
};

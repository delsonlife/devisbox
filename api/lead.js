// api/lead.js — Capture et stockage des leads
const fs   = require("fs");
const path = require("path");

function getLicenses() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "licenses.json"), "utf-8"));
}

function getLeads() {
  const p = path.join(process.cwd(), "data", "leads.json");
  try { return JSON.parse(fs.readFileSync(p, "utf-8")); } catch { return []; }
}

function saveLead(lead) {
  const p = path.join(process.cwd(), "data", "leads.json");
  const leads = getLeads();
  leads.push(lead);
  fs.writeFileSync(p, JSON.stringify(leads, null, 2), "utf-8");
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

async function sendEmail(config, lead) {
  const to = config.company.email;
  if (!to || !process.env.RESEND_API_KEY) return;

  const subject = `Nouveau devis — ${lead.name}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px">
      <h2 style="color:#1a1a2e">Nouvelle demande — ${config.company.name}</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Nom</b></td><td style="padding:8px;border-bottom:1px solid #eee">${lead.name}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Tel</b></td><td style="padding:8px;border-bottom:1px solid #eee">${lead.phone}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Email</b></td><td style="padding:8px;border-bottom:1px solid #eee">${lead.email}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Estimation</b></td><td style="padding:8px;border-bottom:1px solid #eee"><b>${lead.estimate ? `${lead.estimate.estimateLow.toLocaleString("fr-FR")}€ – ${lead.estimate.estimateHigh.toLocaleString("fr-FR")}€` : "N/A"}</b></td></tr>
        <tr><td style="padding:8px"><b>Date</b></td><td style="padding:8px">${new Date(lead.createdAt).toLocaleString("fr-FR")}</td></tr>
      </table>
    </div>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.RESEND_FROM || "noreply@devisbox.fr", to: [to], subject, html }),
  }).catch(console.error);
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { license, lead } = req.body || {};
  if (!license || !lead) return res.status(400).json({ error: "Missing data" });

  const licenses = getLicenses();
  const config   = licenses[license];
  if (!config || !config.active) return res.status(403).json({ error: "Invalid license" });

  const origin = req.headers.origin || "";
  if (!isOriginAllowed(origin, config)) {
    return res.status(403).json({ error: "Origin not authorized" });
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
    sendEmail(config, saved).catch(console.error);
    return res.status(201).json({ success: true, leadId: saved.id });
  } catch (err) {
    console.error("[lead]", err);
    return res.status(500).json({ error: "Failed to save lead" });
  }
};

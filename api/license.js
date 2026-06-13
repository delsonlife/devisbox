// api/license.js
const fs   = require("fs");
const path = require("path");

module.exports = async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  let licenses;
  try {
    const filePath = path.join(process.cwd(), "data", "licenses.json");
    licenses = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error("[license] Cannot read licenses.json:", err.message);
    return res.status(500).json({ error: "Server configuration error" });
  }

  const { license } = req.query;
  if (!license) return res.status(400).json({ error: "Missing license key" });

  const config = licenses[license];
  if (!config || !config.active) {
    return res.status(403).json({ error: "Invalid or inactive license" });
  }

  const origin = req.headers.origin || "";
  if (origin) {
    const allowed = [
      "https://devisbox.vercel.app",
      ...(config.allowedOrigins || []),
    ];
    const isAllowed =
      allowed.includes(origin) ||
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1");

    if (!isAllowed) {
      return res.status(403).json({ error: "Origin not authorized" });
    }
  }

  return res.status(200).json({
    valid:     true,
    company:   { name: config.company.name, phone: config.company.phone || null },
    branding:  config.branding,
    trade:     config.trade,
    questions: config.questions,
  });
};

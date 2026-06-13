// api/calculators/roof_v1.js — Moteur de calcul toiture
module.exports = function calculate(answers, pricing) {
  const { project, material, surface, pans, accessibility, options = [], postalCode } = answers;

  const basePrice = pricing.base[material] || 100;
  const projectMult = pricing.project_multiplier[project] || 1.0;
  const panMult = pricing.pan_multiplier[pans] || 1.0;
  const floorMult = pricing.floor_multiplier[accessibility] || 1.0;

  const prefix = (postalCode || "").substring(0, 2);
  const regional = pricing.regional_coefficients[prefix] || pricing.regional_coefficients["default"] || 1.0;

  const surfaceNum = parseFloat(surface) || 100;
  let total = basePrice * surfaceNum * projectMult * panMult * floorMult * regional;

  const optionDetails = [];
  if (options.includes("velux")) {
    const cost = pricing.options.velux;
    total += cost;
    optionDetails.push({ label: "Velux", price: cost });
  }
  if (options.includes("gouttieres")) {
    const cost = pricing.options.gouttieres * Math.round(Math.sqrt(surfaceNum) * 4);
    total += cost;
    optionDetails.push({ label: "Gouttières", price: cost });
  }
  if (options.includes("isolation")) {
    const cost = pricing.options.isolation * surfaceNum;
    total += cost;
    optionDetails.push({ label: "Isolation", price: cost });
  }
  if (options.includes("depose")) {
    const cost = pricing.options.depose * surfaceNum;
    total += cost;
    optionDetails.push({ label: "Dépose ancienne toiture", price: cost });
  }
  if (options.includes("charpente")) {
    const cost = pricing.options.charpente * surfaceNum;
    total += cost;
    optionDetails.push({ label: "Traitement charpente", price: cost });
  }

  const low = Math.round((total * pricing.margin_low) / 100) * 100;
  const high = Math.round((total * pricing.margin_high) / 100) * 100;
  const baseDays = Math.max(1, Math.round(surfaceNum / 40));

  return {
    estimateLow: low,
    estimateHigh: high,
    delayLow: baseDays,
    delayHigh: Math.round(baseDays * 1.5),
    details: { surface: surfaceNum, optionDetails }
  };
};

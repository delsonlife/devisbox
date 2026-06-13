// api/calculators/windows_v1.js — Moteur de calcul fenêtres / menuiseries
module.exports = function calculate(answers, pricing) {
  const { type, quantity, material, options = [], postalCode } = answers;

  const baseUnit = pricing.base_by_type[type] || 450;
  const matMult = pricing.material_multiplier[material] || 1.0;
  const qty = parseInt(quantity) || 1;

  const prefix = (postalCode || "").substring(0, 2);
  const regional = pricing.regional_coefficients[prefix] || pricing.regional_coefficients["default"] || 1.0;

  let total = baseUnit * qty * matMult * regional;

  const optionDetails = [];
  (options || []).forEach((opt) => {
    const cost = (pricing.options[opt] || 0) * qty;
    if (cost) {
      const labels = { vitrage: "Triple vitrage", volet: "Volets roulants", pose: "Dépose ancienne", store: "Store intégré" };
      total += cost;
      optionDetails.push({ label: labels[opt] || opt, price: cost });
    }
  });

  const low = Math.round((total * pricing.margin_low) / 100) * 100;
  const high = Math.round((total * pricing.margin_high) / 100) * 100;
  const days = Math.max(1, Math.ceil(qty / 4));

  return {
    estimateLow: low,
    estimateHigh: high,
    delayLow: days,
    delayHigh: days + 1,
    details: { quantity: qty, optionDetails }
  };
};

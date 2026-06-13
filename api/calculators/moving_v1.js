// api/calculators/moving_v1.js — Moteur de calcul déménagement
module.exports = function calculate(answers, pricing) {
  const { volume, distance, floor_from, options = [], postalCode } = answers;

  const base = pricing.base_by_volume[volume] || 700;
  const distanceCost = (parseFloat(distance) || 50) * pricing.distance_rate;
  const floorMult = pricing.floor_multiplier[floor_from] || 1.0;

  const prefix = (postalCode || "").substring(0, 2);
  const regional = pricing.regional_coefficients[prefix] || pricing.regional_coefficients["default"] || 1.0;

  let total = (base + distanceCost) * floorMult * regional;

  const optionDetails = [];
  (options || []).forEach((opt) => {
    const cost = pricing.options[opt];
    if (cost) {
      total += cost;
      const labels = { emballage: "Emballage complet", piano: "Piano / coffre-fort", garde: "Garde-meuble", montage: "Montage meubles" };
      optionDetails.push({ label: labels[opt] || opt, price: cost });
    }
  });

  const low = Math.round((total * pricing.margin_low) / 100) * 100;
  const high = Math.round((total * pricing.margin_high) / 100) * 100;

  return {
    estimateLow: low,
    estimateHigh: high,
    delayLow: 1,
    delayHigh: 2,
    details: { optionDetails }
  };
};

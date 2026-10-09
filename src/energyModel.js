
/** Ireland energy-transition comparison: transparent first-pass research model.
 * SOURCE: historical input series supplied by user; SEAI annual energy use and
 * renewables tables: https://www.seai.ie/data-and-insights/seai-statistics/energy-use-overview
 * https://www.seai.ie/data-and-insights/seai-statistics/renewables
 * Not a validated final scientific model. Null means insufficient data.
 */
export const ASSUMPTIONS = Object.freeze({
  boilerEfficiency: 0.9,
  residentialSpaceHeatFraction: 0.8,
  retrofitSpaceHeatReduction: 0.6,
  heatPumpCOP: 3,
  industrialElectricityPerFuelKWh: 1,
  commercialElectricityPerFuelKWh: 1 / 3, // heat-pump scenario; not in original app
  railDieselEfficiency: 0.4,
  railElectricEfficiency: 0.85,
  railGridEfficiency: 0.9,
  shippingDieselEfficiency: 0.38,
  shippingFuelKWhPerKg: 12.75,
  shippingDieselKgPerLitre: 0.84,
  shippingHydrogenUsefulKWhPerKg: 15,
  electrolyserKWhPerKgH2: 56,
  biofuelRoadElectricEquivalentFactor: 0.35, // provisional; technology-mix uncertain
  roadKWhPerKm: {
    cars: 0.19, goodsVehicles: 0.55, motorcycles: 0.08,
    tractorsAndMachinery: 1.2, smallPSVs: 0.22,
    largePSVs: 1.25, exemptVehicles: 0.35, other: 0.35,
  },
});

// Published SEAI mode final-energy series (Mtoe) and renewable shares (%).
// Renewable transport shares are UNWEIGHTED shares contributing to overall RES,
// not RED policy-multiplied RES-T figures.
const published = {
  2005:[5.08,5.41,3.4,0], 2006:[5.43,5.27,3.6,0.1],
  2007:[5.71,5.18,3.8,0.4], 2008:[5.44,5.44,3.4,1.0],
  2009:[4.86,4.93,4.2,1.7], 2010:[4.60,5.09,4.2,2.0],
  2011:[4.42,4.51,4.6,2.3], 2012:[4.17,4.41,4.8,2.1],
  2013:[4.34,4.42,5.2,2.4], 2014:[4.52,4.21,6.3,2.6],
  2015:[4.78,4.40,6.2,2.7], 2016:[4.96,4.55,6.2,2.4],
  2017:[5.10,4.48,6.6,3.2], 2018:[5.23,4.79,6.3,3.0],
  2019:[5.27,4.70,6.3,3.7], 2020:[3.91,4.86,6.3,4.6],
  2021:[4.18,4.73,5.4,4.5], 2022:[5.02,4.37,5.3,4.8],
  2023:[5.21,4.15,7.5,5.7], 2024:[5.19,4.35,7.9,6.7],
};
const MTOE_TO_TWH = 11.63;
const finite = (x) => typeof x === 'number' && Number.isFinite(x);
const sumRequired = (values) => values.every(finite) ? values.reduce((a,b)=>a+b,0) : null;

export function calculateEnergyYear(record, a = ASSUMPTIONS) {
  const e = record.electricity || {};
  const h = record.heat || {};
  const road = record.roadTransport || {};
  const missing = [];
  const components = {};
  components.existingElectricity = finite(e.totalElectricitySupply) ? e.totalElectricitySupply : null;
  components.residentialHeat = finite(h.residentialHeat)
    ? h.residentialHeat * a.boilerEfficiency *
      (a.residentialSpaceHeatFraction * (1-a.retrofitSpaceHeatReduction) + (1-a.residentialSpaceHeatFraction)) / a.heatPumpCOP
    : null;
  components.commercialHeat = finite(h.commercialPublicHeat)
    ? h.commercialPublicHeat * a.commercialElectricityPerFuelKWh : null;
  components.industrialHeat = finite(h.industryHeat)
    ? h.industryHeat * a.industrialElectricityPerFuelKWh : null;

  const vehicleKeys = Object.keys(a.roadKWhPerKm);
  const roadParts = vehicleKeys.map(key => {
    const vehicleKm = road[key]?.vehicleKm;
    return finite(vehicleKm) ? vehicleKm * a.roadKWhPerKm[key] / 1e9 : null;
  });
  components.roadTransport = sumRequired(roadParts);
  components.rail = finite(record.railDieselEnergyTWh)
    ? record.railDieselEnergyTWh * a.railDieselEfficiency / a.railElectricEfficiency / a.railGridEfficiency : null;
  components.domesticShipping = finite(record.shippingFuelEnergyTWh)
    ? record.shippingFuelEnergyTWh * a.shippingDieselEfficiency /
      a.shippingHydrogenUsefulKWhPerKg * a.electrolyserKWhPerKgH2 : null;

  Object.entries(components).forEach(([key,value]) => { if (!finite(value)) missing.push(key); });
  const cleanEnergyRequiredTWh = sumRequired(Object.values(components));

  const renewableElectricity = finite(e.existingCarbonFreeElectricity) ? e.existingCarbonFreeElectricity : null;
  const p = published[record.year];
  const renewableHeatFuelTWh = p ? p[1] * MTOE_TO_TWH * p[2] / 100 : null;
  const renewableTransportFuelTWh = p ? p[0] * MTOE_TO_TWH * p[3] / 100 : null;
  // IMPORTANT: This is a provisional proxy, not an audited energy balance.
  // It includes a small overlap: renewable electricity used in transport appears
  // in both renewableElectricity and renewableTransportFuelTWh. We therefore
  // publish the renewable electricity-only series as the defensible baseline,
  // and keep the all-sector proxy explicitly separate.
  const provisionalAllSectorRenewableEquivalentTWh = sumRequired([
    renewableElectricity,
    finite(renewableHeatFuelTWh) ? renewableHeatFuelTWh / a.heatPumpCOP : null,
    finite(renewableTransportFuelTWh) ? renewableTransportFuelTWh * a.biofuelRoadElectricEquivalentFactor : null,
  ]);

  return {
    ...record,
    cleanEnergyRequiredTWh,
    // Plot the defensible, source-observed lower bound until overlap is resolved.
    cleanEnergyAvailableTWh: renewableElectricity,
    renewableElectricityTWh: renewableElectricity,
    provisionalAllSectorRenewableEquivalentTWh,
    renewableHeatFuelTWh,
    renewableTransportFuelTWh,
    modelBreakdown: components,
    missingModelInputs: missing,
    status: missing.length ? `Incomplete model: ${missing.join(', ')}` :
      'Modelled demand; renewable electricity baseline (not all renewables)',
  };
}

export function calculateEnergySeries(irelandEnergy, assumptions = ASSUMPTIONS) {
  return Object.values(irelandEnergy.Ireland)
    .sort((a,b) => a.year-b.year)
    .map(year => calculateEnergyYear(year, assumptions));
}

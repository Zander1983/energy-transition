# Ireland historical calculator inputs, 2005–2025

Retrieved 4 October 2026. Republic of Ireland throughout.

This is a sourced input dataset, not a completed 21-year upper-line calculation. Missing observations are `null`, never zero or invented values. Your electrification methodology is retained as the intended calculation; official final consumption is included only as supporting data.

## Contents

- `ireland-energy-2005-2025.json`: annual inputs, units, definitions and source metadata.
- `ireland-energy-2005-2025.js`: the same dataset as an ES module for React.
- `annual-summary.csv`: compact review table.
- `source-observations.csv`: field-level observations, units, source links and status.
- `build_dataset.py`: reproducible extraction from the supplied source snapshots; requires openpyxl. Place it in `sources/` and run it there; output is the parent directory.
- `sources/`: official source snapshots.

## Coverage

| Input | Downloaded coverage | Limitation |
|---|---|---|
| Electricity output by fuel, renewable output, signed net imports | 2005–2025 | SEAI series distributed in EirGrid workbook, updated July 2026; net exported generation rather than gross thermal output |
| Wind installed capacity | 2005–2025 | EirGrid TSO + DSO installed capacity |
| Residential and commercial/public fossil-fuel consumption | 2005–2024 | Proxy for heating fuel input; excludes electricity and renewable fuels |
| Industrial fossil-fuel consumption | 2005–2024 | Includes non-renewable waste; proxy for heat, some fuels serve machinery or other uses |
| Rail diesel energy and domestic navigation petroleum energy | 2005–2024 | Diesel-equivalent litres are derived, not measured litres |
| International marine bunkers | 2005–2025 | Separate boundary; 2025 interim |
| Fleet size, average mileage and total vehicle-km by broad category | 2005–2023 | Latest downloaded CSO THA10 ends in 2023 |
| Goods vehicles by unladen weight | 2008–2023 | Not equivalent to gross-weight LGV/HGV classes |
| Solar capacity and day/night minimum demand | Not populated | Optional infrastructure/storage fields; unnecessary for the two annual energy lines |

The latest downloaded SEAI balance has a `2025 Interim` sheet with blank final-demand sector rows. Do not infer that the full 2025 balance was released merely because an earlier webpage said it was planned for Q3. The supplied CSO API snapshots were retrieved directly, not copied from old report tables.

## Changes needed before using the data in the calculator

1. Small PSVs are taxis, hackneys and limousines, not small buses. Do not feed this series into a small-bus coefficient. Large PSVs include buses with more than eight passenger seats.
2. Keep the observed goods weight bands. An unladen-weight threshold cannot silently be substituted for the usual gross-weight definition of LGV/HGV. Counts and kilometres for all goods vehicles are also retained. The 2005–2007 split remains unresolved.
3. CSO's tractors-and-machinery category includes machinery beyond agricultural tractors. CSO explicitly warns that its mileage estimates, and motorcycle mileage estimates, may be unreliable because odometer data are limited. Distance does not capture stationary or field-operation energy well.
4. Exempt vehicles are preserved separately so they are not silently omitted or counted twice in `other`.
5. Heat fuel input must exclude electricity when electricity demand is already counted. `residentialHeat` is residential only; `homeOfficeHeat` adds commercial/public fuel use. These replace rough starting figures, not your boiler/COP/retrofit conversion equations.
6. Include peat, oil and non-renewable waste electricity, not just gas and coal, when calculating the full fossil electricity replacement requirement. Imports are stored separately with their sign. They are not assumed to be clean generation.
7. Existing electricity already supplies EVs and electric rail. Applying conversion coefficients to *all* vehicle activity while also retaining all existing electricity demand can double count existing electric transport. A fuel-specific activity split would be required to remove this exactly. Do not treat total vehicle counts as fossil-only fleets.
8. `shippingDiesel` covers domestic navigation only. International marine bunkers are separate. Aviation remains outside the attached methodology. A resulting chart cannot be described as covering all fossil energy use without these exclusions.
9. Historical technology assumptions stay fixed. The attachment contains inconsistent hydrogen arithmetic: 0.0802 kg/km × 52.5 kWh/kg = 4.2105 kWh/km, whereas its displayed value is 5.19155. Its stated 1.1 loss multiplier also differs from division by 0.9. The actual calculator source code is needed to reproduce its reported 76.88 TWh exactly. These constants must not be inferred from the webpage result.

The dataset deliberately leaves `cleanEnergyRequiredTWh` null. Do not let JavaScript coerce these values to zero. A chart should show gaps for incomplete years, rather than connect fabricated points. `cleanEnergyAvailableTWh` is populated with domestic renewable electricity generation. Biomass generation is retained according to your existing definition, so “renewable electricity” is a more precise label than “carbon-free”. No claim about hourly reliability or storage is represented by these annual values.

## Conversions and validation

- 1 ktoe = 41,868 GJ = 0.01163 TWh.
- Diesel-equivalent volume = fuel energy in TWh × 1e9 ÷ (0.84 × 12.75 kWh/litre), using the attached calculator's convention. This does not turn a mixed petroleum series into measured diesel consumption.
- Published annual average fleet × published rounded average km can differ slightly from published total vehicle-km. Prefer total vehicle-km for energy calculations; retain counts and average km for display.
- Electricity subtotals were checked against total supply for every year, within 0.01 TWh.
- Null years, category boundaries and provenance remain visible in the exports.

## Official sources

- SEAI National Energy Balance: https://www.seai.ie/data-and-insights/seai-statistics/key-publications/national-energy-balance
- Source workbook: https://www.seai.ie/sites/default/files/2025-05/National-Energy-Balance.xlsx
- EirGrid reports: https://www.eirgrid.ie/grid/system-and-renewable-data-reports
- Source workbook: https://cms.eirgrid.ie/sites/default/files/publications/System-and-Renewable-Data-Summary-Report-V30.xlsx
- CSO THA10: https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/THA10/JSON-stat/2.0/en
- CSO THA14: https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/THA14/JSON-stat/2.0/en
- CSO THA19: https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/THA19/JSON-stat/2.0/en
- CSO traffic methodology: https://www.cso.ie/en/releasesandpublications/hubs/p-transo/transporthub/roadtrafficvolumes/vehiclekilometres/
- RSA PSV definitions: https://cmsprod.rsa.ie/services/business-operators/maintaining-your-vehicles/permits

import { useState } from "react";

import {

  Chart as ChartJS,

  CategoryScale,

  LinearScale,

  PointElement,

  LineElement,
  Filler,

  Tooltip,

  Legend,

} from "chart.js";

import { Line } from "react-chartjs-2";



import { irelandEnergy } from "../Ireland-energy-2005-2025/ireland-energy-2005-2025.js";

import "./App.css";
import { calculateEnergySeries } from "./energyModel.js";



ChartJS.register(

  CategoryScale,

  LinearScale,

  PointElement,

  LineElement,

  Filler,

  Tooltip,

  Legend

);



// SEAI "Primary energy by fuel" (Mtoe), 2005–2024, rounded to 0.01 Mtoe.
// https://www.seai.ie/data-and-insights/seai-statistics/energy-use-overview
// Order: oil, gas, renewables, coal, peat, non-renewable waste, net electricity imports.
// Conversion: 1 Mtoe = 11.63 TWh. Totals are approximate because SEAI's
// published component figures are rounded. 2025 is SEAI's interim reported TPER.
const seaiPrimaryByFuelMtoe = {
2005: [9.13,3.50,0.37,1.86,0.79,0,0.18],
2006: [8.96,3.97,0.43,1.62,0.76,0,0.15],
2007: [8.98,4.26,0.49,1.58,0.75,0,0.11],
2008: [8.93,4.52,0.59,1.39,0.87,0,0.04],
2009: [7.74,4.30,0.68,1.13,0.86,0.01,0.07],
2010: [7.29,4.71,0.68,1.22,0.76,0.01,0.04],
2011: [6.79,4.15,0.83,1.21,0.72,0.01,0.04],
2012: [6.23,4.04,0.82,1.47,0.79,0.05,0.04],
2013: [6.28,3.86,0.89,1.30,0.74,0.06,0.19],
2014: [6.24,3.73,1.01,1.24,0.78,0.07,0.18],
2015: [6.65,3.77,1.15,1.45,0.77,0.07,0.06],
2016: [6.95,4.25,1.14,1.44,0.73,0.07,0],
2017: [6.86,4.32,1.35,1.13,0.69,0.11,0],
2018: [7.15,4.48,1.49,0.77,0.69,0.15,0],
2019: [7.18,4.57,1.66,0.38,0.63,0.15,0.06],
2020: [6.00,4.58,1.81,0.44,0.42,0.15,0],
2021: [6.34,4.38,1.65,0.90,0.27,0.14,0.14],
2022: [6.91,4.47,1.85,0.72,0.22,0.15,0.02],
2023: [6.88,4.15,1.99,0.43,0.18,0.17,0.28],
2024: [7.07,4.27,2.11,0.28,0.13,0.16,0.44],
};
const primaryTWhByYear = Object.fromEntries(
  Object.entries(seaiPrimaryByFuelMtoe).map(([year, fuels]) => [
    Number(year), fuels.reduce((total, value) => total + value, 0) * 11.63,
  ])
);
primaryTWhByYear[2025] = 163.1; // SEAI interim 2025 TPER (TWh)

const irelandData = calculateEnergySeries(irelandEnergy);

function formatNumber(value, unit = "", maximumFractionDigits = 2) {

  if (value == null || !Number.isFinite(value)) {

    return "Unavailable";

  }



  const formatted = value.toLocaleString("en-IE", {

    maximumFractionDigits,

  });



  return unit ? `${formatted} ${unit}` : formatted;

}



function formatEnergy(value) {

  return value == null

    ? "Not yet calculated"

    : `${value.toFixed(1)} TWh`;

}



const vehicleLabels = {

  cars: "Private cars",

  goodsVehicles: "Goods vehicles",

  motorcycles: "Motorcycles",

  tractorsAndMachinery: "Tractors and machinery",

  smallPSVs: "Taxis, hackneys and limousines",

  largePSVs: "Large public service vehicles",

  exemptVehicles: "Exempt vehicles",

  other: "Other vehicles",

};



function App() {

  const [selectedYear, setSelectedYear] = useState(null);
  const [energyMode, setEnergyMode] = useState("primary");
  const getTopLine = (data) => energyMode === "primary"
    ? (primaryTWhByYear[data.year] ?? null)
    : data.cleanEnergyRequiredTWh;
  const topLabel = energyMode === "primary"
    ? "Total primary energy (SEAI)"
    : "Total Energy Required (Electricity Equivalent)";



  const chartData = {

    labels: irelandData.map((data) => data.year),



    datasets: [

      {

        label: topLabel,

        data: irelandData.map(

          (data) => getTopLine(data)

        ),

        borderColor: "#111827",

        backgroundColor: "rgba(148, 163, 184, 0.22)",

        fill: { target: 1, above: "rgba(148, 163, 184, 0.22)", below: "rgba(148, 163, 184, 0.22)" },

        borderWidth: 2,

        pointRadius: 0,

        pointHoverRadius: 4,

        pointHitRadius: 12,

        tension: 0,

        spanGaps: false,

      },

      {

        label: "Renewable Electricity (Verified Baseline)",

        data: irelandData.map(

          (data) => data.cleanEnergyAvailableTWh

        ),

        borderColor: "#16a34a",

        backgroundColor: "rgba(22, 163, 74, 0.23)",

        fill: "origin",

        borderWidth: 2,

        pointRadius: 0,

        pointHoverRadius: 4,

        pointHitRadius: 12,

        tension: 0,

        spanGaps: false,

      },

    ],

  };



  const chartOptions = {

    responsive: true,

    maintainAspectRatio: false,



    interaction: {

      mode: "index",

      intersect: false,

    },



    onClick: (_event, elements) => {

      if (elements.length > 0) {

        setSelectedYear(

          irelandData[elements[0].index]

        );

      }

    },



    plugins: {

      filler: { propagate: false },

      legend: {

        position: "top",

        labels: {

          usePointStyle: true,

          padding: 25,

          font: {

            size: 14,

          },

        },

      },



      tooltip: {

        callbacks: {

          label: (context) =>

            `${context.dataset.label}: ${formatNumber(

              context.parsed.y,

              "TWh"

            )}`,



          afterBody: () =>

            "Click to see underlying data",

        },

      },

    },



    scales: {

      x: {

        title: {

          display: true,

          text: "Year",

          font: {

            size: 14,

            weight: "bold",

          },

        },

        grid: {

          display: false,

        },

        ticks: {

          maxRotation: 0,

          autoSkip: true,

          maxTicksLimit: 11,

        },

      },



      y: {

        beginAtZero: true,

        title: {

          display: true,

          text: energyMode === "primary" ? "Primary energy (TWh/year)" : "Electricity equivalent (TWh/year)",

          font: {

            size: 14,

            weight: "bold",

          },

        },

      },

    },

  };



  const cleanShare =

    getTopLine(selectedYear || {}) > 0

      ? (

          (selectedYear.cleanEnergyAvailableTWh /

            getTopLine(selectedYear)) *

          100

        ).toFixed(1)

      : null;



  return (

    <div className="app">

      <header>

        <h1>Ireland's Energy Transition</h1>



        <p className="subtitle">

          Clean electricity available compared with

          electricity required under the electrification model

        </p>

      </header>



      <main>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "18px 0" }}>
          {["primary", "final"].map(mode => (
            <button key={mode} type="button"
              aria-pressed={energyMode === mode}
              onClick={() => setEnergyMode(mode)}
              style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer",
                background: energyMode === mode ? "#111827" : "#f3f4f6",
                color: energyMode === mode ? "white" : "#111827",
                border: "1px solid #cbd5e1", fontWeight: 600 }}>
              {mode === "primary" ? "Primary" : "Final"}
            </button>
          ))}
        </div>
        {energyMode === "primary" && irelandData.some(d => primaryTWhByYear[d.year] == null) && (
          <p role="status" className="instruction">
            Some primary energy years are missing from the SEAI series
            (TWh/year). No final-energy values have been substituted.
          </p>
        )}
        <div className="chart-container">

          <Line

            data={chartData}

            options={chartOptions}

          />

        </div>



        <p className="instruction">

          Click the chart or select a year to explore

          the underlying data.

        </p>



        <div

          style={{

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            gap: "12px",

            marginBottom: "24px",

          }}

        >

          <label htmlFor="year-select">

            Year

          </label>



          <select

            id="year-select"

            value={selectedYear?.year ?? ""}

            onChange={(event) => {

              const year = Number(event.target.value);



              setSelectedYear(

                irelandData.find(

                  (data) => data.year === year

                ) ?? null

              );

            }}

            style={{

              padding: "10px 14px",

              border: "1px solid #cbd5e1",

              borderRadius: "8px",

              background: "#ffffff",

              font: "inherit",

            }}

          >

            <option value="">

              Select a year

            </option>



            {irelandData.map((data) => (

              <option

                key={data.year}

                value={data.year}

              >

                {data.year}

              </option>

            ))}

          </select>

        </div>



        <p className="instruction">

          The available line shows domestic renewable

          electricity generation. The required line has

          not yet been calculated. Missing observations

          are shown as unavailable.

        </p>



        {selectedYear && (

          <div className="year-panel">

            <div className="panel-header">

              <div>

                <h2>{selectedYear.year}</h2>



                <span className="provisional">

                  {selectedYear.status}

                </span>

              </div>



              <button

                type="button"

                onClick={() => setSelectedYear(null)}

              >

                Close

              </button>

            </div>



            <div className="headline-numbers">

              <div>

                <span>

                  {topLabel}

                </span>



                <strong>

                  {formatEnergy(

                    getTopLine(selectedYear)

                  )}

                </strong>

              </div>



              <div>

                <span>

                  Renewable Electricity Generated

                </span>



                <strong>

                  {formatEnergy(

                    selectedYear.cleanEnergyAvailableTWh

                  )}

                </strong>

              </div>



              <div>

                <span>

                  Renewable Electricity / Top Line

                </span>



                <strong>

                  {cleanShare == null

                    ? "Unavailable"

                    : `${cleanShare}%`}

                </strong>

              </div>

            </div>



            <YearDetails data={selectedYear} />

          </div>

        )}

      </main>

    </div>

  );

}



function YearDetails({ data }) {

  const electricityRows = [

    [

      "Renewable electricity",

      "existingCarbonFreeElectricity",

    ],

    ["Gas generation", "existingGasElectricity"],

    ["Coal generation", "existingCoalElectricity"],

    ["Peat generation", "existingPeatElectricity"],

    ["Oil generation", "existingOilElectricity"],

    [

      "Non-renewable waste generation",

      "existingNonRenewableWasteElectricity",

    ],

    ["Net electricity imports", "netElectricityImports"],

    ["Total electricity supply", "totalElectricitySupply"],

    ["Wind generation", "windGenerationTWh"],

    ["Solar generation", "solarGenerationTWh"],

    ["Hydro generation", "hydroGenerationTWh"],

    [

      "Other renewable generation",

      "otherRenewableGenerationTWh",

    ],

  ];



  return (

    <div className="details-grid">

      <section>

        <h3>Electricity</h3>



        {electricityRows.map(([label, field]) => (

          <DataRow

            key={field}

            label={label}

            value={formatNumber(

              data.electricity[field],

              "TWh"

            )}

          />

        ))}



        <DataRow

          label="Installed wind capacity"

          value={formatNumber(

            data.electricity.currentWindCapacityGW,

            "GW"

          )}

        />



        <DataRow

          label="Installed solar capacity"

          value={formatNumber(

            data.electricity.currentSolarCapacityGW,

            "GW"

          )}

        />



        <p className="instruction">

          Renewable generation is broken down below

          the total; these figures should not be added

          to it again.

        </p>

      </section>



      <section>

        <h3>Fossil Heating Fuel Inputs</h3>



        <DataRow

          label="Residential"

          value={formatNumber(

            data.heat.residentialHeat,

            "TWh"

          )}

        />



        <DataRow

          label="Commercial and public services"

          value={formatNumber(

            data.heat.commercialPublicHeat,

            "TWh"

          )}

        />



        <DataRow

          label="Homes and commercial/public services combined"

          value={formatNumber(

            data.heat.homeOfficeHeat,

            "TWh"

          )}

        />



        <DataRow

          label="Industrial fuel-use proxy"

          value={formatNumber(

            data.heat.industryHeat,

            "TWh"

          )}

        />



        <p className="instruction">

          These are fuel inputs before applying

          retrofit, boiler-efficiency or heat-pump

          assumptions. Industrial fuel use includes

          some uses other than heating.

        </p>

      </section>



      <section>

        <h3>Road Transport</h3>



        {Object.entries(data.roadTransport).map(

          ([name, vehicle]) => (

            <div key={name}>

              <div className="transport-row">

                <strong>

                  {vehicleLabels[name] ?? name}

                </strong>



                <span>

                  {vehicle.numVehicles == null

                    ? "Vehicle count unavailable"

                    : `${formatNumber(

                        vehicle.numVehicles,

                        "",

                        0

                      )} vehicles`}

                </span>



                <span>

                  {vehicle.distance == null

                    ? "Mileage unavailable"

                    : `${formatNumber(

                        vehicle.distance,

                        "",

                        0

                      )} km/vehicle/year`}

                </span>

              </div>



              <DataRow

                label="Total annual vehicle-kilometres"

                value={formatNumber(

                  vehicle.vehicleKm,

                  "km",

                  0

                )}

              />

            </div>

          )

        )}



        <p className="instruction">

          Small PSVs are taxis, hackneys and

          limousines. Tractors and machinery is a

          broader category than agricultural tractors.

        </p>



        {data.goodsByUnladenWeight.length > 0 && (

          <>

            <h3>Goods Vehicles by Unladen Weight</h3>



            {data.goodsByUnladenWeight.map((band) => (

              <div

                key={band.unladenWeightBand}

                className="transport-row"

              >

                <strong>

                  {band.unladenWeightBand}

                </strong>



                <span>

                  {formatNumber(

                    band.numVehicles,

                    "vehicles",

                    0

                  )}

                </span>



                <span>

                  {formatNumber(

                    band.distance,

                    "km/vehicle/year",

                    0

                  )}

                </span>

              </div>

            ))}



            <p className="instruction">

              These are subdivisions of the goods

              vehicle total. Unladen-weight bands do

              not directly match gross-weight LGV/HGV

              classifications.

            </p>

          </>

        )}



        <h3>Rail and Shipping</h3>



        <DataRow

          label="Rail diesel energy"

          value={formatNumber(

            data.railDieselEnergyTWh,

            "TWh"

          )}

        />



        <DataRow

          label="Rail diesel equivalent"

          value={formatNumber(

            data.railDiesel == null

              ? null

              : data.railDiesel / 1e6,

            "million litres"

          )}

        />



        <DataRow

          label="Domestic navigation petroleum energy"

          value={formatNumber(

            data.shippingFuelEnergyTWh,

            "TWh"

          )}

        />



        <DataRow

          label="Domestic shipping diesel equivalent"

          value={formatNumber(

            data.shippingDiesel == null

              ? null

              : data.shippingDiesel / 1e6,

            "million litres"

          )}

        />



        <DataRow

          label="International marine bunkers — separate"

          value={formatNumber(

            data.internationalMarineBunkersTWh,

            "TWh"

          )}

        />



        <p className="instruction">

          Diesel-equivalent litres are calculated

          from fuel energy, rather than measured

          volumes.

        </p>

      </section>

    </div>

  );

}



function DataRow({ label, value }) {

  return (

    <div className="data-row">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>

  );

}



export default App;
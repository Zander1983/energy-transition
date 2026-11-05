
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
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/*
  SOURCE:
  Sustainable Energy Authority of Ireland (SEAI)
  Primary Energy by Fuel, 2005–2025

  https://www.seai.ie/data-and-insights/seai-statistics/energy-use-overview

  Values in Mtoe, converted to TWh.
  1 Mtoe = 11.63 TWh.

  Columns:
  Year, Oil, Gas, Renewables, Coal, Peat,
  Non-renewable waste, Net electricity imports

  Figures are rounded in SEAI's published table.
*/

const SEAI_DATA_URL =
  "https://www.seai.ie/data-and-insights/seai-statistics/energy-use-overview";

const ENERGY_BALANCE_URL =
  "https://www.seai.ie/data-and-insights/seai-statistics/key-publications/national-energy-balance";

const MTOE_TO_TWH = 11.63;

const seaiData = [
  [2005, 9.13, 3.50, 0.37, 1.86, 0.79, 0.00, 0.18],
  [2006, 8.96, 3.97, 0.43, 1.62, 0.76, 0.00, 0.15],
  [2007, 8.98, 4.26, 0.49, 1.58, 0.75, 0.00, 0.11],
  [2008, 8.93, 4.52, 0.59, 1.39, 0.87, 0.00, 0.04],
  [2009, 7.74, 4.30, 0.68, 1.13, 0.86, 0.01, 0.07],
  [2010, 7.29, 4.71, 0.68, 1.22, 0.76, 0.01, 0.04],
  [2011, 6.79, 4.15, 0.83, 1.21, 0.72, 0.01, 0.04],
  [2012, 6.23, 4.04, 0.82, 1.47, 0.79, 0.05, 0.04],
  [2013, 6.28, 3.86, 0.89, 1.30, 0.74, 0.06, 0.19],
  [2014, 6.24, 3.73, 1.01, 1.24, 0.78, 0.07, 0.18],
  [2015, 6.65, 3.77, 1.15, 1.45, 0.77, 0.07, 0.06],
  [2016, 6.95, 4.25, 1.14, 1.44, 0.73, 0.07, 0.00],
  [2017, 6.86, 4.32, 1.35, 1.13, 0.69, 0.11, 0.00],
  [2018, 7.15, 4.48, 1.49, 0.77, 0.69, 0.15, 0.00],
  [2019, 7.18, 4.57, 1.66, 0.38, 0.63, 0.15, 0.06],
  [2020, 6.00, 4.58, 1.81, 0.44, 0.42, 0.15, 0.00],
  [2021, 6.34, 4.38, 1.65, 0.90, 0.27, 0.14, 0.14],
  [2022, 6.91, 4.47, 1.85, 0.72, 0.22, 0.15, 0.02],
  [2023, 6.88, 4.15, 1.98, 0.43, 0.18, 0.17, 0.28],
  [2024, 6.97, 4.27, 2.09, 0.28, 0.13, 0.16, 0.44],
  [2025, 6.63, 4.19, 2.25, 0.16, 0.13, 0.16, 0.53],
];

// Official 2025 totals from SEAI Energy in Ireland 2026.
// Used instead of summing rounded Mtoe components.
const OFFICIAL_2025 = {
  total: 163.1,
  renewable: 26.1,
};

const energyData = seaiData.map((row) => {
  const [year, oil, gas, renewables, coal, peat, waste, imports] = row;

  const total =
    year === 2025
      ? OFFICIAL_2025.total
      : (oil + gas + renewables + coal + peat + waste + imports) *
        MTOE_TO_TWH;

  const renewable =
    year === 2025
      ? OFFICIAL_2025.renewable
      : renewables * MTOE_TO_TWH;

  return {
    year,
    total,
    renewable,
    share: (renewable / total) * 100,
  };
});

function formatNumber(value, decimals = 1) {
  return Number(value).toLocaleString("en-IE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function EnergyTransitionTracker() {
  const latest = energyData[energyData.length - 1];

  const chartData = {
    labels: energyData.map((d) => d.year),

    datasets: [
      {
        label: "Total Primary Energy",
        data: energyData.map((d) => d.total),

        borderColor: "#111827",
        backgroundColor: "rgba(148, 163, 184, 0.22)",

        fill: {
          target: 1,
          above: "rgba(148, 163, 184, 0.22)",
          below: "rgba(148, 163, 184, 0.22)",
        },

        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 12,
        tension: 0,
      },

      {
        label: "Renewable Primary Energy",
        data: energyData.map((d) => d.renewable),

        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.25)",

        fill: "origin",

        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 12,
        tension: 0,
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

    plugins: {
      filler: {
        propagate: false,
      },

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
        backgroundColor: "#111827",
        padding: 12,

        callbacks: {
          label: (context) => {
            const value = context.parsed.y;

            return (
              `${context.dataset.label}: ` +
              `${formatNumber(value)} TWh`
            );
          },

          afterBody: (items) => {
            if (!items.length) return "";

            const index = items[0].dataIndex;
            const d = energyData[index];

            return (
              `\nRenewable share: ${formatNumber(d.share)}%`
            );
          },
        },
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
          font: {
            size: 13,
            weight: "bold",
          },
        },

        grid: {
          display: false,
        },

        ticks: {
          autoSkip: true,
          maxTicksLimit: 11,
          maxRotation: 0,
        },
      },

      y: {
        beginAtZero: true,

        title: {
          display: true,
          text: "Primary energy (TWh/year)",
          font: {
            size: 13,
            weight: "bold",
          },
        },

        ticks: {
          callback: (value) => `${value}`,
        },
      },
    },
  };

  return (
    <div className="west-energy-page">
      <div className="west-energy-inner">

        <header className="west-energy-header">
          <h1>Ireland's Energy Transition</h1>

          <p>
            Total and renewable primary energy supply,
            2005–2025.
          </p>
        </header>

        <div className="west-energy-chart">
          <Line
            data={chartData}
            options={chartOptions}
          />
        </div>

        <div className="west-energy-summary">
          <strong>
            In {latest.year}, renewable energy supplied{" "}
            {formatNumber(latest.share)}% of Ireland's
            primary energy.
          </strong>

          <p>
            {formatNumber(latest.renewable)} TWh renewable
            out of {formatNumber(latest.total)} TWh total.
          </p>
        </div>

        <div className="west-energy-notes">
          <p>
            Renewable energy includes wind, solar,
            hydro, biomass, biofuels and renewable heat.
            All figures use SEAI's primary energy accounting.
          </p>

          <p className="west-energy-source">
            Source: Sustainable Energy Authority of Ireland
            (SEAI). Historical figures are calculated from
            published Mtoe data and may differ slightly
            from unrounded totals.
          </p>

          <div className="west-energy-links">
            <a
              href={SEAI_DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View SEAI source data ↗
            </a>

            <a
              href={ENERGY_BALANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              National Energy Balance ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * VARSHA-RA: Charts Module
 * Provides Chart.js powered scientific visualizations for:
 * - Regime probability donut
 * - Lead-time RMSE degradation curves
 * - Expert gating pie
 * - Verification bar comparisons
 * - Rainfall distribution histogram
 * - Regime-wise CSI performance curves
 */

import { VERIFICATION_DATA, CURRENT_FORECAST_STATE } from "./mockData.js";

export class ChartManager {
  constructor() {
    this.charts = {};
  }

  destroyChart(id) {
    if (this.charts[id]) {
      this.charts[id].destroy();
      delete this.charts[id];
    }
  }

  /**
   * Draws a donut chart showing current regime probabilities.
   * @param {string} canvasId
   */
  renderRegimeProbabilityDonut(canvasId, probabilities) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return;
    this.destroyChart(canvasId);

    const probs = probabilities || CURRENT_FORECAST_STATE.regimeProbabilities;
    this.charts[canvasId] = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: ["Depression/Low", "Active Monsoon", "Transition", "Break Monsoon"],
        datasets: [{
          data: [
            +(probs.DEPRESSION * 100).toFixed(1),
            +(probs.ACTIVE * 100).toFixed(1),
            +(probs.TRANSITION * 100).toFixed(1),
            +(probs.BREAK * 100).toFixed(1)
          ],
          backgroundColor: [
            "rgba(6, 182, 212, 0.85)",
            "rgba(16, 185, 129, 0.85)",
            "rgba(168, 85, 247, 0.85)",
            "rgba(245, 158, 11, 0.85)"
          ],
          borderColor: [
            "#06b6d4", "#10b981", "#a855f7", "#f59e0b"
          ],
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#52667a",
              font: { family: "Inter", size: 11 },
              boxWidth: 12,
              padding: 14
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      }
    });
  }

  /**
   * Renders a comparative bar chart for verification metrics (RMSE, MAE, Bias).
   * @param {string} canvasId
   */
  renderContinuousMetricsBar(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return;
    this.destroyChart(canvasId);

    const metrics = VERIFICATION_DATA.overall.continuous;
    this.charts[canvasId] = new Chart(canvas, {
      type: "bar",
      data: {
        labels: metrics.map(m => m.metric.split(" ")[0]),
        datasets: [
          {
            label: "Raw NWP",
            data: metrics.map(m => Math.abs(m.rawNwp)),
            backgroundColor: "rgba(239, 68, 68, 0.75)",
            borderColor: "#ef4444",
            borderWidth: 1
          },
          {
            label: "Global Correction",
            data: metrics.map(m => Math.abs(m.globalCorrection)),
            backgroundColor: "rgba(245, 158, 11, 0.75)",
            borderColor: "#f59e0b",
            borderWidth: 1
          },
          {
            label: "ATMOS",
            data: metrics.map(m => Math.abs(m.varshaRa)),
            backgroundColor: "rgba(56, 189, 248, 0.85)",
            borderColor: "#1769d1",
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#52667a",
              font: { family: "Inter", size: 11 },
              boxWidth: 10
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} mm/day`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: "#52667a", font: { family: "JetBrains Mono", size: 11 } },
            grid: { color: "rgba(16, 42, 67, 0.08)" }
          },
          y: {
            title: { display: true, text: "mm / day (abs)", color: "#52667a", font: { size: 10 } },
            ticks: { color: "#52667a", font: { family: "JetBrains Mono", size: 11 } },
            grid: { color: "rgba(16, 42, 67, 0.08)" }
          }
        }
      }
    });
  }

  /**
   * Renders CSI performance across thresholds for all 4 regimes.
   * @param {string} canvasId
   * @param {string} regime - "active" | "depression" | "break" | "transition"
   */
  renderRegimeCSICurve(canvasId, regime = "active") {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return;
    this.destroyChart(canvasId);

    const regimeData = VERIFICATION_DATA.regimeWiseCSI[regime];
    const labels = VERIFICATION_DATA.regimeWiseCSI.labels;
    if (!regimeData) return;

    this.charts[canvasId] = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Raw NWP",
            data: regimeData.rawNwp,
            borderColor: "#ef4444",
            backgroundColor: "rgba(239,68,68,0.08)",
            borderWidth: 2,
            pointRadius: 4,
            fill: true,
            tension: 0.3
          },
          {
            label: "Global Correction",
            data: regimeData.globalCorr,
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245,158,11,0.08)",
            borderWidth: 2,
            pointRadius: 4,
            fill: true,
            tension: 0.3
          },
          {
            label: "ATMOS",
            data: regimeData.varshaRa,
            borderColor: "#1769d1",
            backgroundColor: "rgba(56,189,248,0.12)",
            borderWidth: 2.5,
            pointRadius: 5,
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#52667a", font: { family: "Inter", size: 10 }, boxWidth: 10 }
          },
          title: {
            display: true,
            text: `CSI Skill by Threshold — ${regime.charAt(0).toUpperCase() + regime.slice(1)} Regime`,
            color: "#52667a",
            font: { size: 11, family: "JetBrains Mono" }
          }
        },
        scales: {
          x: {
            ticks: { color: "#52667a", font: { size: 10 } },
            grid: { color: "rgba(16, 42, 67, 0.08)" }
          },
          y: {
            min: 0, max: 1,
            title: { display: true, text: "CSI Score", color: "#52667a", font: { size: 10 } },
            ticks: { color: "#52667a", font: { family: "JetBrains Mono", size: 10 } },
            grid: { color: "rgba(16, 42, 67, 0.08)" }
          }
        }
      }
    });
  }

  /**
   * Renders RMSE degradation by lead time for all 3 models.
   * @param {string} canvasId
   */
  renderLeadTimeRMSE(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return;
    this.destroyChart(canvasId);

    const lt = VERIFICATION_DATA.leadTimeRMSE;
    this.charts[canvasId] = new Chart(canvas, {
      type: "line",
      data: {
        labels: lt.leadTimes,
        datasets: [
          {
            label: "Raw NWP",
            data: lt.rawNwp,
            borderColor: "#ef4444",
            borderWidth: 2,
            pointRadius: 4,
            fill: false,
            tension: 0.2
          },
          {
            label: "Global Correction",
            data: lt.globalCorrection,
            borderColor: "#f59e0b",
            borderWidth: 2,
            pointRadius: 4,
            fill: false,
            tension: 0.2
          },
          {
            label: "ATMOS",
            data: lt.varshaRa,
            borderColor: "#1769d1",
            borderWidth: 2.5,
            pointRadius: 5,
            pointBackgroundColor: "#1769d1",
            fill: false,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#52667a", font: { family: "Inter", size: 11 }, boxWidth: 10 }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} mm/day RMSE`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: "#52667a", font: { family: "JetBrains Mono", size: 10 } },
            grid: { color: "rgba(16, 42, 67, 0.08)" }
          },
          y: {
            title: { display: true, text: "RMSE (mm/day)", color: "#52667a", font: { size: 10 } },
            ticks: { color: "#52667a", font: { family: "JetBrains Mono", size: 10 } },
            grid: { color: "rgba(16, 42, 67, 0.08)" }
          }
        }
      }
    });
  }

  /**
   * Renders expert gating weights as a horizontal bar chart.
   * @param {string} canvasId
   * @param {Object} weights - e.g. {DEPRESSION_EXPERT: 0.58, ...}
   */
  renderExpertGatingChart(canvasId, weights) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return;
    this.destroyChart(canvasId);

    const labels = Object.keys(weights).map(k =>
      k.replace("_EXPERT", " Expert").replace("_", " ").replace("GLOBAL BASELINE", "Global Baseline")
    );
    const data = Object.values(weights).map(v => +(v * 100).toFixed(1));
    const colors = [
      "rgba(6,182,212,0.85)", "rgba(16,185,129,0.85)",
      "rgba(99,102,241,0.85)", "rgba(168,85,247,0.85)", "rgba(245,158,11,0.85)"
    ];

    this.charts[canvasId] = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Expert Weight (%)",
          data,
          backgroundColor: colors.slice(0, data.length),
          borderColor: colors.slice(0, data.length).map(c => c.replace("0.85", "1")),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Weight: ${ctx.parsed.x.toFixed(1)}%`
            }
          }
        },
        scales: {
          x: {
            max: 100,
            title: { display: true, text: "Expert Weight (%)", color: "#52667a", font: { size: 10 } },
            ticks: { color: "#52667a", font: { family: "JetBrains Mono", size: 10 } },
            grid: { color: "rgba(16, 42, 67, 0.08)" }
          },
          y: {
            ticks: { color: "#52667a", font: { family: "Inter", size: 10 } },
            grid: { color: "rgba(16, 42, 67, 0.08)" }
          }
        }
      }
    });
  }

  /**
   * Renders the reliability diagram (Predicted probability vs Observed frequency).
   * @param {string} canvasId
   */
  renderReliabilityDiagram(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return;
    this.destroyChart(canvasId);

    const curve = VERIFICATION_DATA.reliabilityCurve;
    this.charts[canvasId] = new Chart(canvas, {
      type: "line",
      data: {
        labels: curve.forecastBins.map(b => `${(b * 100).toFixed(0)}%`),
        datasets: [
          {
            label: "Perfect Calibration",
            data: curve.perfectReliability,
            borderColor: "rgba(16, 42, 67, 0.25)",
            borderDash: [6, 4],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
          },
          {
            label: "Raw NWP (Uncalibrated)",
            data: curve.rawNwp,
            borderColor: "#ef4444",
            borderWidth: 2,
            pointBackgroundColor: "#ef4444",
            pointRadius: 3,
            fill: false
          },
          {
            label: "ATMOS (Calibrated)",
            data: curve.varshaRaCalibrated,
            borderColor: "#1769d1",
            borderWidth: 2.5,
            pointBackgroundColor: "#1769d1",
            pointRadius: 4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#52667a", font: { family: "Inter", size: 10 }, boxWidth: 10 }
          }
        },
        scales: {
          x: {
            title: { display: true, text: "Forecast Probability", color: "#52667a", font: { size: 10 } },
            ticks: { color: "#52667a", font: { family: "JetBrains Mono", size: 10 } },
            grid: { color: "rgba(16, 42, 67, 0.08)" }
          },
          y: {
            min: 0, max: 1,
            title: { display: true, text: "Observed Frequency", color: "#52667a", font: { size: 10 } },
            ticks: { color: "#52667a", font: { family: "JetBrains Mono", size: 10 } },
            grid: { color: "rgba(16, 42, 67, 0.08)" }
          }
        }
      }
    });
  }
}

export const chartManager = new ChartManager();

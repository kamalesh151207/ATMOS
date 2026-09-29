/**
 * VARSHA-RA: Heavy-Rainfall Probability & Calibration Component
 * Handles interactive threshold exceedance P(Rainfall > tau),
 * reliability diagram plotting, and Brier Score / BSS calibration metrics.
 */

import { chartManager } from "../charts.js";

export class HeavyRainComponent {
  constructor(containerId = "heavy-rain-container") {
    this.containerId = containerId;
    this.currentThreshold = 50; // default 50 mm
  }

  init() {
    this.render();
    this.bindEvents();
    // Defer chart until canvas is in DOM
    setTimeout(() => chartManager.renderReliabilityDiagram("reliability-canvas"), 100);
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-xl); padding: 2.5rem; display: flex; flex-direction: column; gap: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="color: #ffffff; font-size: 1.25rem;">Exceedance Probability: P(Rainfall &gt; Threshold)</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.25rem;">
              Calibrated probabilistic decision-support for flash floods, landslides, and urban inundation risk.
            </p>
          </div>
          <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 6px; padding: 0.4rem 0.85rem; font-size: 0.72rem; color: #fca5a5; font-family: var(--font-mono);">
            ⚠️ Decision-Support Indicator • Not an Official Weather Warning
          </div>
        </div>

        <!-- Interactive Threshold Buttons -->
        <div class="threshold-selector-strip">
          <span style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; margin-right: 0.5rem;">
            Select Threshold:
          </span>
          <button class="threshold-btn ${this.currentThreshold === 25 ? 'active' : ''}" data-threshold="25">
            25 mm (Moderate Rain)
          </button>
          <button class="threshold-btn ${this.currentThreshold === 50 ? 'active' : ''}" data-threshold="50">
            50 mm (Heavy Rain)
          </button>
          <button class="threshold-btn ${this.currentThreshold === 100 ? 'active' : ''}" data-threshold="100">
            100 mm (Very Heavy)
          </button>
          <button class="threshold-btn ${this.currentThreshold === 150 ? 'active' : ''}" data-threshold="150">
            150 mm (Extremely Heavy)
          </button>
        </div>

        <!-- Main Grid: Reliability Diagram + Metrics -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">

          <!-- Left: Reliability Diagram -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--cyan-bright); text-transform: uppercase;">
                Reliability Diagram — P(&gt;${this.currentThreshold}mm)
              </span>
              <span class="badge badge-demo" style="font-size: 0.62rem;">ILLUSTRATIVE</span>
            </div>
            <div style="position: relative; height: 270px;">
              <canvas id="reliability-canvas"></canvas>
            </div>
            <p style="font-size: 0.68rem; color: var(--text-dim); text-align: center; margin-top: 0.5rem; font-family: var(--font-mono);">
              Diagonal line = Perfect Calibration • ATMOS is closer to ideal reliability.
            </p>
          </div>

          <!-- Right: Brier metrics + Calibration explanation -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 1.25rem;">
                <div style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">Brier Score (BS)</div>
                <div style="font-size: 1.6rem; font-weight: 700; font-family: var(--font-mono); color: #34d399; margin: 0.3rem 0;">0.11</div>
                <div style="font-size: 0.7rem; color: var(--text-dim);">Raw NWP: 0.24 (54% error reduction)</div>
              </div>
              <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 1.25rem;">
                <div style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">Brier Skill Score (BSS)</div>
                <div style="font-size: 1.6rem; font-weight: 700; font-family: var(--font-mono); color: var(--cyan-bright); margin: 0.3rem 0;">+0.64</div>
                <div style="font-size: 0.7rem; color: var(--text-dim);">vs Climatology: +191% skill gain</div>
              </div>
            </div>

            <!-- Calibration Method Explanation -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem; font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary);">
              <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--cyan-bright); text-transform: uppercase; margin-bottom: 0.5rem;">
                Calibration Methodology
              </div>
              <p>
                Raw models often predict 70% probability when observed frequency is only 40% (over-confidence) or 85% (under-confidence).
                ATMOS applies <strong>Isotonic Regression + Platt Scaling</strong> post-calibration to ensure a forecast 70% probability corresponds to observed rainfall in ~70 out of 100 comparable historical instances.
              </p>
            </div>

            <!-- Threshold Context Table -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1rem; overflow-x: auto;">
              <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
                Threshold Decision Context
              </div>
              <table style="width:100%; border-collapse: collapse; font-size: 0.78rem;">
                <thead>
                  <tr>
                    <th style="text-align:left; color: var(--text-muted); padding: 0.35rem 0; border-bottom: 1px solid var(--border-subtle);">Threshold</th>
                    <th style="text-align:right; color: var(--text-muted); padding: 0.35rem; border-bottom: 1px solid var(--border-subtle);">India Context</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding: 0.3rem 0; color: #94a3b8;">25 mm/day</td><td style="text-align:right; color: #cbd5e1;">Heavy Rain threshold (IMD definition)</td></tr>
                  <tr><td style="padding: 0.3rem 0; color: var(--regime-break);">50 mm/day</td><td style="text-align:right; color: #cbd5e1;">Flash flood & urban waterlogging risk</td></tr>
                  <tr><td style="padding: 0.3rem 0; color: var(--risk-high);">100 mm/day</td><td style="text-align:right; color: #cbd5e1;">Landslide susceptibility threshold</td></tr>
                  <tr><td style="padding: 0.3rem 0; color: var(--risk-critical);">150 mm/day</td><td style="text-align:right; color: #cbd5e1;">Extreme event — major flood risk</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Disclaimer -->
        <div style="background: rgba(245, 158, 11, 0.06); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 6px; padding: 0.75rem 1rem; font-size: 0.75rem; color: #fde68a; font-family: var(--font-mono);">
          DISCLAIMER: Probabilities are AI decision-support indicators derived from statistical post-processing of NWP output. They do NOT constitute official hydrometeorological warning advisories. Validation status: Illustrative demo benchmarks.
        </div>
      </div>
    `;
  }

  setThreshold(thresholdMm) {
    this.currentThreshold = thresholdMm;
    this.render();
    this.bindEvents();
    setTimeout(() => chartManager.renderReliabilityDiagram("reliability-canvas"), 100);
  }

  bindEvents() {
    const buttons = document.querySelectorAll(".threshold-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const t = parseInt(e.currentTarget.getAttribute("data-threshold"), 10);
        this.setThreshold(t);
      });
    });
  }
}

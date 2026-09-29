/**
 * VARSHA-RA: Scientific Verification Component
 * Benchmarks Raw NWP vs Global Conventional Correction vs VARSHA-RA across
 * continuous, categorical, spatial, and probabilistic metrics with multi-condition filters.
 */

import { VERIFICATION_DATA } from "../mockData.js";
import { chartManager } from "../charts.js";

export class VerificationComponent {
  constructor(containerId = "verification-container") {
    this.containerId = containerId;
    this.currentSeason = "JJAS";
    this.currentRegime = "all";
    this.currentLeadTime = "24";
    this.currentThreshold = "50";
  }

  init() {
    this.render();
    this.bindFilters();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const v = VERIFICATION_DATA.overall;

    container.innerHTML = `
      <!-- Filters Bar -->
      <div class="verification-filters-bar">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">
            Season:
          </span>
          <select class="filter-select" id="verif-season-select">
            <option value="JJAS" ${this.currentSeason === "JJAS" ? "selected" : ""}>Southwest Monsoon (JJAS 2009-2024)</option>
            <option value="PRE" ${this.currentSeason === "PRE" ? "selected" : ""}>Pre-Monsoon (MAM)</option>
            <option value="POST" ${this.currentSeason === "POST" ? "selected" : ""}>Post-Monsoon (OND)</option>
          </select>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">
            Monsoon Regime:
          </span>
          <select class="filter-select" id="verif-regime-select">
            <option value="all" ${this.currentRegime === "all" ? "selected" : ""}>All Regimes Combined</option>
            <option value="active" ${this.currentRegime === "active" ? "selected" : ""}>Active Monsoon Only</option>
            <option value="depression" ${this.currentRegime === "depression" ? "selected" : ""}>Depression / Lows Only</option>
            <option value="break" ${this.currentRegime === "break" ? "selected" : ""}>Break Monsoon Only</option>
            <option value="transition" ${this.currentRegime === "transition" ? "selected" : ""}>Transition Phase Only</option>
          </select>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">
            Lead Time:
          </span>
          <select class="filter-select" id="verif-lead-select">
            <option value="24" ${this.currentLeadTime === "24" ? "selected" : ""}>Day 1 (+24h Lead)</option>
            <option value="48" ${this.currentLeadTime === "48" ? "selected" : ""}>Day 2 (+48h Lead)</option>
            <option value="72" ${this.currentLeadTime === "72" ? "selected" : ""}>Day 3 (+72h Lead)</option>
            <option value="120" ${this.currentLeadTime === "120" ? "selected" : ""}>Day 5 (+120h Lead)</option>
          </select>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">
            Threshold:
          </span>
          <select class="filter-select" id="verif-thresh-select">
            <option value="10" ${this.currentThreshold === "10" ? "selected" : ""}>10 mm (Light-Moderate)</option>
            <option value="25" ${this.currentThreshold === "25" ? "selected" : ""}>25 mm (Moderate)</option>
            <option value="50" ${this.currentThreshold === "50" ? "selected" : ""}>50 mm (Heavy Rain)</option>
            <option value="100" ${this.currentThreshold === "100" ? "selected" : ""}>100 mm (Very Heavy)</option>
          </select>
        </div>

        <span class="badge badge-demo" style="margin-left: auto;">
          ILLUSTRATIVE VERIFICATION BENCHMARKS
        </span>
      </div>

      <!-- Chart.js Scientific Visualizations Strip -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Chart 1: Continuous Metrics Bar -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--cyan-bright); text-transform: uppercase;">Error Reduction</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #ffffff;">Continuous Metrics (RMSE, MAE, Bias)</div>
            </div>
            <span class="badge badge-demo" style="font-size: 0.6rem;">CHART.JS</span>
          </div>
          <div style="position: relative; height: 210px;">
            <canvas id="verif-continuous-canvas"></canvas>
          </div>
        </div>

        <!-- Chart 2: Lead-Time RMSE Degradation -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--cyan-bright); text-transform: uppercase;">Skill Horizon</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #ffffff;">RMSE Growth (+24h to +120h Lead)</div>
            </div>
            <span class="badge badge-demo" style="font-size: 0.6rem;">CHART.JS</span>
          </div>
          <div style="position: relative; height: 210px;">
            <canvas id="verif-leadtime-canvas"></canvas>
          </div>
        </div>

        <!-- Chart 3: Regime CSI Curve -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--cyan-bright); text-transform: uppercase;">Critical Success Index</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #ffffff;">CSI by Rain Intensity Threshold</div>
            </div>
            <span class="badge badge-demo" style="font-size: 0.6rem;">CHART.JS</span>
          </div>
          <div style="position: relative; height: 210px;">
            <canvas id="verif-csi-canvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Verification Tables Grid -->
      <div class="verification-tables-grid">
        <!-- Continuous Metrics Card -->
        <div class="verification-card">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
            <div>
              <h4 style="color: #ffffff; font-size: 1.05rem;">Continuous Error Metrics</h4>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Evaluated against IMD 0.25° Gridded Rainfall Observations</div>
            </div>
            <span class="badge" style="font-size: 0.65rem;">CONTINUOUS</span>
          </div>

          <table class="verif-table">
            <thead>
              <tr>
                <th>Verification Metric</th>
                <th>Raw NWP</th>
                <th>Global Correction</th>
                <th style="color: var(--cyan-bright);">ATMOS</th>
                <th>Improvement</th>
              </tr>
            </thead>
            <tbody>
              ${v.continuous.map(row => `
                <tr>
                  <td>${row.metric}</td>
                  <td style="color: var(--risk-high);">${row.rawNwp}</td>
                  <td>${row.globalCorrection}</td>
                  <td class="highlight-cell">${row.varshaRa}</td>
                  <td style="color: var(--regime-active); font-weight: 600;">${row.improvement}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-muted); line-height: 1.45;">
            ATMOS reduces Root Mean Square Error from 28.4 to 16.2 mm/day (-43.0%) and eliminates 95.6% of systematic negative dry bias.
          </div>
        </div>

        <!-- Categorical / Event-Based Metrics (50mm threshold) -->
        <div class="verification-card">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
            <div>
              <h4 style="color: #ffffff; font-size: 1.05rem;">Event-Based Metrics (Threshold > 50 mm)</h4>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Contingency table metrics for severe monsoon downpours</div>
            </div>
            <span class="badge" style="font-size: 0.65rem;">CATEGORICAL</span>
          </div>

          <table class="verif-table">
            <thead>
              <tr>
                <th>Metric Name</th>
                <th>Raw NWP</th>
                <th>Global Corr</th>
                <th style="color: var(--cyan-bright);">ATMOS</th>
                <th>Skill Gain</th>
              </tr>
            </thead>
            <tbody>
              ${v.categorical50mm.map(row => `
                <tr>
                  <td>${row.metric}</td>
                  <td>${row.rawNwp}</td>
                  <td>${row.globalCorrection}</td>
                  <td class="highlight-cell">${row.varshaRa}</td>
                  <td style="color: var(--regime-active); font-weight: 600;">${row.improvement}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-muted); line-height: 1.45;">
            Equitable Threat Score (ETS) increases by +107% while False Alarm Ratio (FAR) drops from 0.42 to 0.18.
          </div>
        </div>
      </div>

      <!-- Spatial & Probabilistic Verification Strip -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-xl); padding: 1.75rem; margin-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
          <h4 style="color: #ffffff; font-size: 1.05rem;">Spatial & Probabilistic Verification</h4>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--cyan-bright);">FSS • BRIER SCORE • BRIER SKILL SCORE</span>
        </div>

        <table class="verif-table">
          <thead>
            <tr>
              <th>Verification Metric</th>
              <th>Raw NWP</th>
              <th>Global Baseline</th>
              <th style="color: var(--cyan-bright);">ATMOS</th>
              <th>Scientific Note</th>
            </tr>
          </thead>
          <tbody>
            ${v.spatialProbabilistic.map(row => `
              <tr>
                <td>${row.metric}</td>
                <td>${row.rawNwp}</td>
                <td>${row.globalCorrection}</td>
                <td class="highlight-cell">${row.varshaRa}</td>
                <td style="color: var(--regime-active);">${row.improvement}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Scientific Hypothesis Disclaimer -->
        <div style="margin-top: 1.25rem; background: var(--blue-pale); border-left: 3px solid var(--cyan-bright); padding: 0.85rem 1.25rem; border-radius: 4px; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.55;">
          <strong>SCIENTIFIC PERSPECTIVE:</strong>
          AI improvement is treated as an empirical scientific hypothesis subjected to rigorous out-of-sample testing across regimes, seasons, and lead times. The numbers shown above represent synthetic illustrative benchmark targets.
        </div>
      </div>
    `;

    setTimeout(() => {
      this.renderCharts();
    }, 60);
  }

  renderCharts() {
    chartManager.renderContinuousMetricsBar("verif-continuous-canvas");
    chartManager.renderLeadTimeRMSE("verif-leadtime-canvas");
    const activeRegime = this.currentRegime === "all" ? "active" : this.currentRegime;
    chartManager.renderRegimeCSICurve("verif-csi-canvas", activeRegime);
  }

  bindFilters() {
    const sSelect = document.getElementById("verif-season-select");
    if (sSelect) {
      sSelect.addEventListener("change", (e) => {
        this.currentSeason = e.target.value;
        this.render();
        this.bindFilters();
      });
    }

    const rSelect = document.getElementById("verif-regime-select");
    if (rSelect) {
      rSelect.addEventListener("change", (e) => {
        this.currentRegime = e.target.value;
        const activeRegime = this.currentRegime === "all" ? "active" : this.currentRegime;
        chartManager.renderRegimeCSICurve("verif-csi-canvas", activeRegime);
      });
    }

    const lSelect = document.getElementById("verif-lead-select");
    if (lSelect) {
      lSelect.addEventListener("change", (e) => {
        this.currentLeadTime = e.target.value;
        this.render();
        this.bindFilters();
      });
    }

    const tSelect = document.getElementById("verif-thresh-select");
    if (tSelect) {
      tSelect.addEventListener("change", (e) => {
        this.currentThreshold = e.target.value;
        this.render();
        this.bindFilters();
      });
    }
  }
}

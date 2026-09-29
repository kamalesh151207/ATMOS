/**
 * VARSHA-RA: Regime Intelligence & Uncertainty Explorer Component
 * Manages 4-regime probability visualizers, Shannon entropy calculation,
 * confidence meters, and Low vs High Uncertainty interactive scenario comparisons.
 */

import { REGIMES, UNCERTAINTY_SCENARIOS, CURRENT_FORECAST_STATE } from "../mockData.js";
import { chartManager } from "../charts.js";

export class RegimeComponent {
  constructor(panelContainerId = "regime-panel-container", scenarioContainerId = "uncertainty-scenario-container") {
    this.panelContainerId = panelContainerId;
    this.scenarioContainerId = scenarioContainerId;
    this.activeScenario = "MODERATE_UNCERTAINTY";
    this.currentProbabilities = { ...CURRENT_FORECAST_STATE.regimeProbabilities };
  }

  init() {
    this.renderRegimeProbabilities(this.currentProbabilities);
    this.renderScenarioExplorer(this.activeScenario);
    this.bindScenarioTabs();
  }

  calculateEntropy(probs) {
    let entropy = 0;
    Object.values(probs).forEach(p => {
      if (p > 0.0001) {
        entropy -= p * Math.log2(p);
      }
    });
    return entropy;
  }

  renderRegimeProbabilities(probs) {
    const container = document.getElementById(this.panelContainerId);
    if (!container) return;

    const entropy = this.calculateEntropy(probs);
    const maxEntropy = 2.0; // log2(4) for 4 regimes
    const normalizedU = (entropy / maxEntropy) * 100;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; font-size: 1.15rem;">Current Regime Probabilities</h3>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
            CYCLE: 2024-08-14 00Z • VALID +24H
          </span>
        </div>
        <span class="badge badge-demo">ILLUSTRATIVE DEMO DATA</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.15rem;">
        <!-- DEPRESSION / LOW -->
        <div class="prob-bar-item">
          <div class="prob-bar-label-row">
            <span class="prob-name" style="color: var(--regime-depression); display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--regime-depression);"></span>
              DEPRESSION / LOW PRESSURE
            </span>
            <span class="prob-val">${(probs.DEPRESSION * 100).toFixed(0)}%</span>
          </div>
          <div class="prob-progress-track">
            <div class="prob-progress-fill" style="width: ${probs.DEPRESSION * 100}%; background: var(--regime-depression);"></div>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-dim);">Vorticity & low-pressure vortex rainbands dominant across Central India.</div>
        </div>

        <!-- ACTIVE -->
        <div class="prob-bar-item">
          <div class="prob-bar-label-row">
            <span class="prob-name" style="color: var(--regime-active); display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--regime-active);"></span>
              ACTIVE MONSOON
            </span>
            <span class="prob-val">${(probs.ACTIVE * 100).toFixed(0)}%</span>
          </div>
          <div class="prob-progress-track">
            <div class="prob-progress-fill" style="width: ${probs.ACTIVE * 100}%; background: var(--regime-active);"></div>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-dim);">Strong cross-equatorial southwesterly flow & Western Ghats orographic lift.</div>
        </div>

        <!-- TRANSITION -->
        <div class="prob-bar-item">
          <div class="prob-bar-label-row">
            <span class="prob-name" style="color: var(--regime-transition); display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--regime-transition);"></span>
              TRANSITION / AMBIGUOUS
            </span>
            <span class="prob-val">${(probs.TRANSITION * 100).toFixed(0)}%</span>
          </div>
          <div class="prob-progress-track">
            <div class="prob-progress-fill" style="width: ${probs.TRANSITION * 100}%; background: var(--regime-transition);"></div>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-dim);">Residual wave activity and multi-scale convective interactions.</div>
        </div>

        <!-- BREAK -->
        <div class="prob-bar-item">
          <div class="prob-bar-label-row">
            <span class="prob-name" style="color: var(--regime-break); display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--regime-break);"></span>
              BREAK MONSOON
            </span>
            <span class="prob-val">${(probs.BREAK * 100).toFixed(0)}%</span>
          </div>
          <div class="prob-progress-track">
            <div class="prob-progress-fill" style="width: ${probs.BREAK * 100}%; background: var(--regime-break);"></div>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-dim);">Rainfall hiatus over central plains; shift to Himalayan foothills.</div>
        </div>
      </div>

      <!-- Entropy & Uncertainty Gauge -->
      <div class="entropy-visualizer-card" style="margin-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.78rem; font-family: var(--font-mono); font-weight: 600; color: var(--text-muted); text-transform: uppercase;">
            Predictive Entropy Uncertainty: H(p)
          </span>
          <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--cyan-bright);">
            ${entropy.toFixed(2)} bits / 2.00 max (${normalizedU.toFixed(0)}%)
          </span>
        </div>
        <div class="prob-progress-track" style="height: 6px;">
          <div class="prob-progress-fill" style="width: ${normalizedU}%; background: ${normalizedU > 75 ? 'var(--risk-high)' : normalizedU > 45 ? 'var(--regime-break)' : 'var(--regime-active)'};"></div>
        </div>
        <div class="entropy-formula-box">
          H(p) = -∑ [ p_i · log₂(p_i) ] = ${entropy.toFixed(3)} bits
        </div>
      </div>

      <!-- Chart.js Donut Chart -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem; margin-top: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--cyan-bright); text-transform: uppercase;">
            Probabilistic Distribution Breakdown
          </span>
          <span class="badge badge-demo" style="font-size: 0.6rem;">CHART.JS</span>
        </div>
        <div style="position: relative; height: 190px;">
          <canvas id="regime-donut-canvas"></canvas>
        </div>
      </div>
    `;

    setTimeout(() => {
      chartManager.renderRegimeProbabilityDonut("regime-donut-canvas", probs);
    }, 60);
  }

  renderScenarioExplorer(scenarioKey) {
    const container = document.getElementById(this.scenarioContainerId);
    if (!container) return;

    const scenario = UNCERTAINTY_SCENARIOS[scenarioKey];
    if (!scenario) return;

    const p = scenario.probabilities;
    const w = scenario.gatingWeights;

    container.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 style="color: #ffffff; font-size: 1.1rem; margin-bottom: 0.25rem;">${scenario.name}</h4>
            <div style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--cyan-bright);">
              Entropy H = ${scenario.entropy.toFixed(2)} bits • Normalized Uncertainty U = ${(scenario.normalizedU * 100).toFixed(0)}%
            </div>
          </div>
          <span class="badge" style="background: rgba(56, 189, 248, 0.1);">${scenarioKey.replace('_', ' ')}</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem;">
          <div>
            <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
              Input Regime Probabilities (π)
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8rem; font-family: var(--font-mono);">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--regime-active);">Active:</span>
                <span style="color: #ffffff;">${(p.ACTIVE * 100).toFixed(0)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--regime-depression);">Depression:</span>
                <span style="color: #ffffff;">${(p.DEPRESSION * 100).toFixed(0)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--regime-transition);">Transition:</span>
                <span style="color: #ffffff;">${(p.TRANSITION * 100).toFixed(0)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--regime-break);">Break:</span>
                <span style="color: #ffffff;">${(p.BREAK * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <div>
            <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
              Gated Model Weight Allocation (w)
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8rem; font-family: var(--font-mono);">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--regime-global); font-weight: 700;">Global Baseline:</span>
                <span style="color: var(--regime-global); font-weight: 700;">${(w.GLOBAL_BASELINE * 100).toFixed(0)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--regime-active);">Active Specialist:</span>
                <span>${((w.ACTIVE_EXPERT || 0) * 100).toFixed(0)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--regime-depression);">Depression Specialist:</span>
                <span>${((w.DEPRESSION_EXPERT || 0) * 100).toFixed(0)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--regime-transition);">Transition Specialist:</span>
                <span>${((w.TRANSITION_EXPERT || 0) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; border-left: 3px solid var(--cyan-bright); padding-left: 1rem;">
          ${scenario.description}
        </div>
      </div>
    `;
  }

  bindScenarioTabs() {
    const tabs = document.querySelectorAll(".scenario-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        tabs.forEach(t => t.classList.remove("active"));
        const targetTab = e.currentTarget;
        targetTab.classList.add("active");
        const scenarioKey = targetTab.getAttribute("data-scenario");
        this.activeScenario = scenarioKey;
        this.renderScenarioExplorer(scenarioKey);
        
        // Also update the probabilities in the left panel to match the scenario
        const scenario = UNCERTAINTY_SCENARIOS[scenarioKey];
        if (scenario) {
          this.renderRegimeProbabilities(scenario.probabilities);
        }
      });
    });
  }
}

/**
 * VARSHA-RA: AI Explainability Component
 * Renders SHAP-style global feature importances, local waterfall contribution bars,
 * and clear disclaimers regarding statistical association vs causal physical proof.
 */

import { EXPLAINABILITY_DATA } from "../mockData.js";

export class ExplainabilityComponent {
  constructor(containerId = "explainability-container") {
    this.containerId = containerId;
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const data = EXPLAINABILITY_DATA;
    const waterfall = data.waterfallPointExample;

    container.innerHTML = `
      <div class="shap-grid">
        <!-- Left: Global Feature Importance (SHAP values) -->
        <div class="shap-card">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
            <div>
              <h3 style="color: #ffffff; font-size: 1.15rem;">Global SHAP Feature Importance</h3>
              <p style="font-size: 0.78rem; color: var(--text-muted);">
                Mean absolute SHAP value: E[|SHAP|] across 15 historical monsoon seasons
              </p>
            </div>
            <span class="badge" style="background: rgba(56, 189, 248, 0.1);">TREE SHAP</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 0.5rem;">
            ${data.globalImportance.map(item => `
              <div class="feature-bar-row">
                <div class="feature-meta">
                  <span class="feature-name">
                    ${item.feature}
                    <span style="font-size: 0.68rem; color: var(--text-dim); margin-left: 0.4rem;">(${item.category})</span>
                  </span>
                  <span class="feature-importance-val">${(item.importance * 100).toFixed(0)}%</span>
                </div>
                <div class="prob-progress-track">
                  <div class="prob-progress-fill" style="width: ${item.importance * 280}%; background: linear-gradient(90deg, #0284c7, #38bdf8);"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="background: var(--blue-pale); border-left: 3px solid var(--cyan-bright); padding: 0.75rem 1rem; border-radius: 4px; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; margin-top: 1rem;">
            <strong>Meteorological Interpretation:</strong> Coarse NWP rainfall remains the baseline foundation (32%), while Regime Probability (18%) and 850 hPa Wind Jet (14%) govern regime switching and moisture influx.
          </div>
        </div>

        <!-- Right: Local Waterfall Feature Attribution (Example Point) -->
        <div class="shap-card">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
            <div>
              <h3 style="color: #ffffff; font-size: 1.15rem;">Local Waterfall Attribution</h3>
              <p style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">
                Target: ${waterfall.location}
              </p>
            </div>
            <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #34d399;">POINT EXPLAIN</span>
          </div>

          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Raw NWP Input</div>
              <div style="font-size: 1.35rem; font-family: var(--font-mono); font-weight: 700; color: #ffffff;">${waterfall.baseValueMm} mm</div>
            </div>
            <div style="color: var(--cyan-bright); font-size: 1.25rem;">➔</div>
            <div>
              <div style="font-size: 0.7rem; color: var(--cyan-bright); text-transform: uppercase;">Corrected Forecast</div>
              <div style="font-size: 1.35rem; font-family: var(--font-mono); font-weight: 700; color: var(--cyan-bright);">${waterfall.finalCorrectedMm} mm</div>
            </div>
          </div>

          <!-- Waterfall Delta Stack -->
          <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem;">
            <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">
              Contribution Breakdown to +120.2 mm Delta:
            </div>
            ${waterfall.contributions.filter(c => c.type !== 'base').map(c => `
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; padding: 0.35rem 0.6rem; background: var(--blue-pale); border-radius: 4px;">
                <span style="color: var(--text-secondary);">${c.name}</span>
                <span style="font-family: var(--font-mono); font-weight: 700; color: ${c.deltaMm > 0 ? 'var(--regime-active)' : 'var(--risk-high)'};">
                  ${c.deltaMm > 0 ? "+" : ""}${c.deltaMm.toFixed(1)} mm
                </span>
              </div>
            `).join('')}
          </div>

          <!-- Crucial Scientific Disclaimer -->
          <div style="margin-top: auto; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 6px; padding: 0.85rem; font-size: 0.75rem; color: #fde68a; line-height: 1.5;">
            <strong>SCIENTIFIC INTEGRITY DISCLAIMER:</strong> ${waterfall.disclaimer}
          </div>
        </div>
      </div>
    `;
  }
}

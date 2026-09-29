/**
 * VARSHA-RA: Uncertainty-Aware AI Expert Gating Component
 * Visualizes dynamic soft gating between 4 specialized regime experts
 * and the robust Global Baseline Expert based on entropy uncertainty.
 */

import { CURRENT_FORECAST_STATE } from "../mockData.js";
import { chartManager } from "../charts.js";

export class ExpertGatingComponent {
  constructor(containerId = "expert-gating-container") {
    this.containerId = containerId;
    this.currentWeights = { ...CURRENT_FORECAST_STATE.expertWeights };
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="gating-flow-view">
        <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-bright); text-transform: uppercase; margin-bottom: 0.5rem;">
              Soft Gating Formulation
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; color: #ffffff; line-height: 1.6; background: var(--blue-pale); padding: 0.85rem; border-radius: 6px; border-left: 3px solid var(--cyan-bright);">
              w_k = (1 - α · U) · π_k + α · U · (1/K) + β(U) · w_global<br/>
              <span style="font-size: 0.72rem; color: var(--text-muted);">
                Where U = Normalized Entropy, π_k = Regime Probability, and β(U) increases with synoptic ambiguity.
              </span>
            </div>
          </div>

          <!-- Dynamic Allocation Chart -->
          <div style="background: var(--blue-pale); border-radius: 6px; padding: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">
                Operational Weight Distribution
              </span>
              <span class="badge badge-demo" style="font-size: 0.6rem;">CHART.JS</span>
            </div>
            <div style="position: relative; height: 160px;">
              <canvas id="expert-gating-canvas"></canvas>
            </div>
          </div>
        </div>

        <div class="expert-weights-breakdown">
          <!-- Depression Specialist -->
          <div class="expert-weight-row" style="border-left: 4px solid var(--regime-depression);">
            <div>
              <div class="expert-name">Depression / Low Specialist</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Vorticity-guided heavy rainband realignment & cyclonic shear</div>
            </div>
            <div class="expert-pct" style="color: var(--regime-depression);">58%</div>
          </div>

          <!-- Active Specialist -->
          <div class="expert-weight-row" style="border-left: 4px solid var(--regime-active);">
            <div>
              <div class="expert-name">Active Monsoon Specialist</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Orographic uplift scaling & coastal convergence enhancement</div>
            </div>
            <div class="expert-pct" style="color: var(--regime-active);">18%</div>
          </div>

          <!-- Global Baseline Model -->
          <div class="expert-weight-row" style="border-left: 4px solid var(--regime-global); background: rgba(99, 102, 241, 0.08);">
            <div>
              <div class="expert-name" style="color: #a5b4fc;">Global Baseline Model (Regularizer)</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Prevents over-specialization and provides synoptic baseline stability</div>
            </div>
            <div class="expert-pct" style="color: #a5b4fc;">16%</div>
          </div>

          <!-- Transition Specialist -->
          <div class="expert-weight-row" style="border-left: 4px solid var(--regime-transition);">
            <div>
              <div class="expert-name">Transition Specialist</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Interpolative damping across regime boundary zones</div>
            </div>
            <div class="expert-pct" style="color: var(--regime-transition);">5%</div>
          </div>

          <!-- Break Specialist -->
          <div class="expert-weight-row" style="border-left: 4px solid var(--regime-break);">
            <div>
              <div class="expert-name">Break Monsoon Specialist</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Zero-hurdle rain occurrence filter & drizzle bias suppression</div>
            </div>
            <div class="expert-pct" style="color: var(--regime-break);">3%</div>
          </div>
        </div>
      </div>

      <!-- Animated Graphic Scheme -->
      <div style="display: flex; flex-direction: column; justify-content: center; gap: 1.25rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 1.75rem;">
        <div style="text-align: center; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">
          Operational Dynamic Weight Flow
        </div>

        <div style="display: flex; align-items: center; justify-content: space-around; padding: 1rem; background: var(--blue-pale); border-radius: 8px;">
          <div style="text-align: center;">
            <div style="font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono);">INPUT</div>
            <div style="font-size: 0.85rem; font-weight: 600; color: #ffffff;">Regime Probs (π)<br/>+ Entropy (H)</div>
          </div>
          <div style="color: var(--cyan-bright); font-size: 1.25rem;">➔</div>
          <div style="text-align: center; border: 1px solid var(--cyan-bright); padding: 0.5rem 0.85rem; border-radius: 6px; background: rgba(56, 189, 248, 0.08);">
            <div style="font-size: 0.7rem; color: var(--cyan-bright); font-family: var(--font-mono);">DYNAMIC GATING</div>
            <div style="font-size: 0.82rem; font-weight: 700; color: #ffffff;">Soft Routing Matrix</div>
          </div>
          <div style="color: var(--cyan-bright); font-size: 1.25rem;">➔</div>
          <div style="text-align: center;">
            <div style="font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono);">OUTPUT</div>
            <div style="font-size: 0.85rem; font-weight: 600; color: #34d399;">Blended Correction<br/>R_corrected(x,y)</div>
          </div>
        </div>

        <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
          <p><strong>Core Scientific Principle:</strong></p>
          <ul style="padding-left: 1.2rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem;">
            <li><strong>Clear Regime (Low Uncertainty):</strong> The dominant specialist model receives highest weight to maximize targeted bias elimination.</li>
            <li><strong>Ambiguous Regime (High Uncertainty):</strong> Instead of hard-switching, ATMOS increases the Global Expert allocation and smoothly blends specialists to preserve numerical stability.</li>
          </ul>
        </div>
      </div>
    `;

    setTimeout(() => {
      chartManager.renderExpertGatingChart("expert-gating-canvas", this.currentWeights);
    }, 60);
  }
}

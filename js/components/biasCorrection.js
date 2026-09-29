/**
 * VARSHA-RA: AI Bias Correction & Distribution Handling Component
 * Compares Raw NWP vs Global Correction vs VARSHA-RA across intensity curves,
 * error distributions, and two-stage hurdle modeling.
 */

export class BiasCorrectionComponent {
  constructor(containerId = "bias-correction-container") {
    this.containerId = containerId;
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <!-- Model Tri-Comparison Cards -->
      <div class="model-comparison-grid">
        <!-- Raw NWP -->
        <div class="model-card">
          <div class="model-header">
            <span class="model-name">01. Raw NWP Baseline</span>
            <span class="model-tag" style="color: var(--text-dim);">NUMERICAL MODEL</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
            Direct ensemble mean forecast from operational global dynamical core (e.g. GFS / ECMWF / NCMRWF at 0.25°).
          </p>
          <div style="background: var(--blue-pale); padding: 0.75rem; border-radius: 6px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Root Mean Square Error:</span>
              <span style="font-family: var(--font-mono); color: var(--risk-high);">28.4 mm/day</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Mean Bias:</span>
              <span style="font-family: var(--font-mono); color: var(--risk-high);">-6.8 mm (Dry bias)</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Extreme POD (>50mm):</span>
              <span style="font-family: var(--font-mono); color: var(--text-muted);">0.54 (Under-detects)</span>
            </div>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-dim); border-top: 1px solid var(--border-subtle); padding-top: 0.5rem;">
            Severe orographic under-prediction along Ghats & widespread drizzle false alarms over dry zones.
          </div>
        </div>

        <!-- Global Conventional Correction -->
        <div class="model-card">
          <div class="model-header">
            <span class="model-name">02. Global AI Correction</span>
            <span class="model-tag" style="color: var(--regime-break);">MONOLITHIC BASELINE</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
            Conventional single post-processing model (e.g. monolithic quantile mapping or single global LightGBM).
          </p>
          <div style="background: var(--blue-pale); padding: 0.75rem; border-radius: 6px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Root Mean Square Error:</span>
              <span style="font-family: var(--font-mono); color: var(--regime-break);">23.1 mm/day</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Mean Bias:</span>
              <span style="font-family: var(--font-mono); color: var(--regime-break);">-2.4 mm</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Extreme POD (>50mm):</span>
              <span style="font-family: var(--font-mono); color: var(--regime-break);">0.63</span>
            </div>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-dim); border-top: 1px solid var(--border-subtle); padding-top: 0.5rem;">
            Applies one uniform correction regardless of whether an active depression or a break hiatus prevails. Over-smooths extremes.
          </div>
        </div>

        <!-- VARSHA-RA -->
        <div class="model-card featured">
          <div class="model-header">
            <span class="model-name" style="color: var(--cyan-bright);">03. ATMOS</span>
            <span class="model-tag" style="color: var(--regime-active);">REGIME-AWARE AI</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
            Regime-aware AI post-processing system using dynamic soft gating of specialized monsoon-regime models, global regularization, and high-resolution geographical refinement.
          </p>
          <div style="background: rgba(56, 189, 248, 0.08); padding: 0.75rem; border-radius: 6px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.35rem; border: 1px solid rgba(56, 189, 248, 0.2);">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-primary);">Root Mean Square Error:</span>
              <span style="font-family: var(--font-mono); color: var(--cyan-bright); font-weight: 700;">16.2 mm/day (-43%)</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-primary);">Mean Bias:</span>
              <span style="font-family: var(--font-mono); color: var(--regime-active); font-weight: 700;">-0.3 mm (Unbiased)</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-primary);">Extreme POD (>50mm):</span>
              <span style="font-family: var(--font-mono); color: #34d399; font-weight: 700;">0.84 (+30% capture)</span>
            </div>
          </div>
          <div style="font-size: 0.75rem; color: var(--cyan-bright); border-top: 1px solid rgba(56, 189, 248, 0.2); padding-top: 0.5rem; font-weight: 500;">
            Captures steep orographic gradients, realigns vortex rainbands, and suppresses break drizzle.
          </div>
        </div>
      </div>

      <!-- Hurdle / Two-Part Distribution Handling -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-xl); padding: 2rem; margin-top: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
          <div>
            <h3 style="color: #ffffff; font-size: 1.2rem;">Two-Part Hurdle Modeling for Skewed Rainfall</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
              Addressing extreme zero-inflation and heavy-tailed orographic rainfall distributions.
            </p>
          </div>
          <span class="badge" style="background: rgba(56, 189, 248, 0.1);">MATHEMATICAL ARCHITECTURE</span>
        </div>

        <div class="hurdle-model-grid">
          <!-- Branch 1: Rain Occurrence -->
          <div class="hurdle-branch-card">
            <div class="hurdle-branch-tag" style="color: var(--regime-active);">BRANCH 1 • RAIN OCCURRENCE</div>
            <h4 style="color: #ffffff; font-size: 1.05rem;">Will Meaningful Rainfall Occur?</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55;">
              A calibrated binary classifier calculates the probability of rain occurrence: 
              <span style="font-family: var(--font-mono); color: var(--cyan-bright);">P(R > 0.1 mm)</span>.
              During Break regimes or in rain shadow zones, this branch suppresses spurious low-level NWP drizzle that degrades threat scores.
            </p>
            <div style="background: var(--blue-pale); padding: 0.75rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">
              Loss Function: Calibrated Binary Cross-Entropy with focal penalty for dry spells.
            </div>
          </div>

          <!-- Branch 2: Conditional Amount -->
          <div class="hurdle-branch-card">
            <div class="hurdle-branch-tag" style="color: var(--cyan-bright);">BRANCH 2 • CONDITIONAL AMOUNT</div>
            <h4 style="color: #ffffff; font-size: 1.05rem;">If Rainfall Occurs, How Much?</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55;">
              Conditioned on occurrence, specialized quantile regressors estimate the expected accumulation:
              <span style="font-family: var(--font-mono); color: var(--cyan-bright);">f(R | R > 0.1 mm)</span>.
              Simultaneously estimates 50th, 90th, and 99th percentiles to preserve extreme downpours without over-smoothing.
            </p>
            <div style="background: var(--blue-pale); padding: 0.75rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">
              Loss Function: Multi-Quantile Pinball Loss + Extreme Value Tail Regularization.
            </div>
          </div>
        </div>

        <!-- Input Feature Inventory Strip -->
        <div style="margin-top: 1.75rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-bright); text-transform: uppercase; margin-bottom: 0.75rem;">
            Physically-Informed Dynamic & Geospatial Feature Inputs
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            <span class="tech-chip">NWP Rainfall (0.25°)</span>
            <span class="tech-chip">850 hPa Wind Jet & Anomaly</span>
            <span class="tech-chip">Moisture Flux Convergence (-∇·qV)</span>
            <span class="tech-chip">Mean Sea Level Pressure (MSLP)</span>
            <span class="tech-chip">700 hPa Relative Vorticity</span>
            <span class="tech-chip">Precipitable Water</span>
            <span class="tech-chip">Digital Elevation Model (DEM)</span>
            <span class="tech-chip">Terrain Slope Aspect</span>
            <span class="tech-chip">Distance to Coastline</span>
            <span class="tech-chip">Monsoon Regime Probabilities</span>
            <span class="tech-chip">Seasonal Pentad Timing</span>
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * VARSHA-RA: Architecture & Technology Stack Component
 * Renders interactive tabs for Training Architecture, Operational Architecture,
 * Layered Technology Stack, and End-to-End Technology Flow.
 */

export class ArchitectureComponent {
  constructor(containerId = "architecture-container") {
    this.containerId = containerId;
    this.activeTab = "operational"; // "operational" | "training" | "stack" | "flow"
  }

  init() {
    this.render();
    this.bindTabs();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    let contentHtml = "";

    if (this.activeTab === "operational") {
      contentHtml = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
            <div>
              <h3 style="color: #ffffff; font-size: 1.2rem;">Operational Real-Time Inference Architecture</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted);">
                Execution path executed upon receipt of new Numerical Weather Prediction ensemble run (00Z / 12Z cycle)
              </p>
            </div>
            <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #34d399;">REAL-TIME PIPELINE</span>
          </div>

          <!-- Flow steps vertical hierarchy -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div class="flow-step-row">
              <span class="flow-step-index">01</span>
              <div class="flow-step-info">
                <span class="flow-step-name">New NWP Forecast Ingestion & Grid QC</span>
                <span class="flow-step-desc">NCMRWF/ECMWF 0.25° NetCDF4 fields ingested, checked for corrupted grids, aligned to coordinate grid</span>
              </div>
              <span class="flow-step-indicator">[NetCDF4 + Xarray]</span>
            </div>

            <div class="flow-connector-arrow">↓</div>

            <div class="flow-step-row">
              <span class="flow-step-index">02</span>
              <div class="flow-step-info">
                <span class="flow-step-name">Dynamic Feature Extraction & Vorticity Computation</span>
                <span class="flow-step-desc">Extracts 850 hPa wind vector anomalies, moisture flux convergence (-∇·qV), MSLP gradients</span>
              </div>
              <span class="flow-step-indicator">[NumPy + GeoPandas]</span>
            </div>

            <div class="flow-connector-arrow">↓</div>

            <div class="flow-step-row" style="border-color: var(--cyan-bright); background: rgba(56, 189, 248, 0.08);">
              <span class="flow-step-index" style="background: var(--cyan-bright); color: #040810;">03</span>
              <div class="flow-step-info">
                <span class="flow-step-name" style="color: var(--cyan-bright);">Monsoon Regime Classification & Uncertainty Estimation</span>
                <span class="flow-step-desc">Computes 4-class probabilities π = [P_act, P_brk, P_dep, P_trn] and Shannon entropy H(p)</span>
              </div>
              <span class="flow-step-indicator">[LightGBM + PyTorch MLP]</span>
            </div>

            <div class="flow-connector-arrow">↓</div>

            <div class="flow-step-row">
              <span class="flow-step-index">04</span>
              <div class="flow-step-info">
                <span class="flow-step-name">Uncertainty-Aware Soft Expert Gating & Bias Correction</span>
                <span class="flow-step-desc">Dynamically blends specialist models with global fallback based on entropy uncertainty: R = ∑ w_k R_k</span>
              </div>
              <span class="flow-step-indicator">[Expert Panel Gating]</span>
            </div>

            <div class="flow-connector-arrow">↓</div>

            <div class="flow-step-row">
              <span class="flow-step-index">05</span>
              <div class="flow-step-info">
                <span class="flow-step-name">Geospatial Refinement (0.05°) & Heavy-Rain Exceedance Head</span>
                <span class="flow-step-desc">Downscales with SRTM DEM/slope and estimates P(R > 25, 50, 100mm) via calibrated quantile heads</span>
              </div>
              <span class="flow-step-indicator">[Rasterio + Topo-Correction]</span>
            </div>

            <div class="flow-connector-arrow">↓</div>

            <div class="flow-step-row">
              <span class="flow-step-index">06</span>
              <div class="flow-step-info">
                <span class="flow-step-name">Spatial Consistency Check & Area-Weighted District Aggregation</span>
                <span class="flow-step-desc">Enforces non-negative bounds (R ≥ 0), prevents artifacts, and aggregates to 700+ district boundaries</span>
              </div>
              <span class="flow-step-indicator">[PostGIS + Shapely]</span>
            </div>

            <div class="flow-connector-arrow">↓</div>

            <div class="flow-step-row" style="background: rgba(6, 182, 212, 0.12); border-color: var(--cyan-bright);">
              <span class="flow-step-index" style="background: var(--cyan-bright); color: #040810;">07</span>
              <div class="flow-step-info">
                <span class="flow-step-name" style="color: #ffffff;">FastAPI REST Serving & Decision-Support Dashboard</span>
                <span class="flow-step-desc">Streams JSON/GeoJSON layers to interactive map, district drawers, and emergency manager alerts</span>
              </div>
              <span class="flow-step-indicator">[FastAPI + Next/Leaflet]</span>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === "training") {
      contentHtml = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
            <div>
              <h3 style="color: #ffffff; font-size: 1.2rem;">Offline Model Training Architecture</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted);">
                Multi-decadal historical pipeline incorporating observations solely as training targets and verification truth.
              </p>
            </div>
            <span class="badge" style="background: rgba(99, 102, 241, 0.1); color: #a5b4fc;">OFFLINE PIPELINE</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-bright); text-transform: uppercase;">
                01. Historical Data Ingestion & Labeling
              </div>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55;">
                Ingests 15 historical monsoon seasons (2009-2024) of re-forecast NWP runs co-registered with high-resolution IMD gridded observation rainfall (0.25°).
                Constructs offline historical regime labels using IMD synoptic weather charts and circulation anomalies.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-bright); text-transform: uppercase;">
                02. Model Panel Partitioning & Training
              </div>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55;">
                1. <strong>Regime Classifier:</strong> LightGBM multi-class model trained on synoptic indices.<br/>
                2. <strong>Global Baseline Model:</strong> Trained across all historical conditions as regularizer.<br/>
                3. <strong>Regime Specialists:</strong> 4 independent models trained strictly on regime-stratified historical data subsets.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-bright); text-transform: uppercase;">
                03. Gating Optimization & Probability Calibration
              </div>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55;">
                Trains soft gating network to minimize convex combination MSE. Applies isotonic calibration to heavy-rainfall probability outputs to optimize Brier Skill Scores on validation folds.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-bright); text-transform: uppercase;">
                04. Out-of-Sample Cross Validation
              </div>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55;">
                Uses <strong>Leave-One-Season-Out (LOSO) Cross Validation</strong> to ensure zero temporal data leakage. No model parameters are trained on test season data.
              </p>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === "stack") {
      contentHtml = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
            <div>
              <h3 style="color: #ffffff; font-size: 1.2rem;">Complete Layered Technology Stack</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted);">
                Production-grade scientific AI and weather computing architecture
              </p>
            </div>
            <span class="badge" style="background: rgba(56, 189, 248, 0.1);">TECH STACK</span>
          </div>

          <div class="stack-layers-grid">
            <div class="stack-layer-row">
              <div class="stack-layer-name">Frontend UI</div>
              <div class="stack-tech-chips">
                <span class="tech-chip">React / Next.js</span>
                <span class="tech-chip">Vanilla CSS3</span>
                <span class="tech-chip">TypeScript</span>
                <span class="tech-chip">Leaflet.js</span>
                <span class="tech-chip">Chart.js</span>
              </div>
            </div>

            <div class="stack-layer-row">
              <div class="stack-layer-name">API & Serving</div>
              <div class="stack-tech-chips">
                <span class="tech-chip">Python 3.9+</span>
                <span class="tech-chip">FastAPI</span>
                <span class="tech-chip">Pydantic v2</span>
                <span class="tech-chip">Uvicorn ASGI</span>
              </div>
            </div>

            <div class="stack-layer-row">
              <div class="stack-layer-name">AI & Machine Learning</div>
              <div class="stack-tech-chips">
                <span class="tech-chip">LightGBM</span>
                <span class="tech-chip">XGBoost</span>
                <span class="tech-chip">PyTorch 2.x</span>
                <span class="tech-chip">Scikit-learn</span>
                <span class="tech-chip">SHAP TreeExplainer</span>
              </div>
            </div>

            <div class="stack-layer-row">
              <div class="stack-layer-name">Weather & Scientific</div>
              <div class="stack-tech-chips">
                <span class="tech-chip">Xarray</span>
                <span class="tech-chip">NetCDF4</span>
                <span class="tech-chip">NumPy</span>
                <span class="tech-chip">Pandas</span>
                <span class="tech-chip">GeoPandas</span>
                <span class="tech-chip">Rasterio</span>
              </div>
            </div>

            <div class="stack-layer-row">
              <div class="stack-layer-name">Spatial Database</div>
              <div class="stack-tech-chips">
                <span class="tech-chip">PostgreSQL 16</span>
                <span class="tech-chip">PostGIS Spatial Extension</span>
                <span class="tech-chip">GeoJSON / COG Tiles</span>
              </div>
            </div>

            <div class="stack-layer-row">
              <div class="stack-layer-name">Deployment & Ops</div>
              <div class="stack-tech-chips">
                <span class="tech-chip">Docker Containers</span>
                <span class="tech-chip">Linux Ubuntu LTS</span>
                <span class="tech-chip">Git / GitHub Actions</span>
                <span class="tech-chip">Automated QC Healthchecks</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = contentHtml;
  }

  setTab(tabName) {
    this.activeTab = tabName;
    const tabs = document.querySelectorAll(".arch-tab-btn");
    tabs.forEach(t => {
      if (t.getAttribute("data-arch-tab") === tabName) t.classList.add("active");
      else t.classList.remove("active");
    });
    this.render();
  }

  bindTabs() {
    const tabs = document.querySelectorAll(".arch-tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        const tabName = e.currentTarget.getAttribute("data-arch-tab");
        this.setTab(tabName);
      });
    });
  }
}

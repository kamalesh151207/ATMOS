/**
 * VARSHA-RA: Pipeline Interactive Component
 * Handles the 16-stage system pipeline selector, expanding each node to reveal
 * 1. What enters the stage, 2. What happens, 3. What comes out.
 */

import { PIPELINE_STAGES } from "../mockData.js";

export class PipelineComponent {
  constructor(chipsContainerId = "pipeline-chips-container", detailCardId = "pipeline-detail-card") {
    this.chipsContainerId = chipsContainerId;
    this.detailCardId = detailCardId;
    this.activeStageId = 1;
  }

  init() {
    this.renderChips();
    this.renderStageDetail(this.activeStageId);
  }

  renderChips() {
    const container = document.getElementById(this.chipsContainerId);
    if (!container) return;

    container.innerHTML = "";
    PIPELINE_STAGES.forEach(stage => {
      const chip = document.createElement("div");
      chip.className = `pipeline-chip ${stage.id === this.activeStageId ? 'active' : ''}`;
      chip.setAttribute("data-stage-id", stage.id);
      chip.innerHTML = `
        <div class="pipeline-chip-num">${String(stage.id).padStart(2, '0')}</div>
        <div style="display: flex; flex-direction: column;">
          <div class="pipeline-chip-title">${stage.title}</div>
          <div style="font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-dim);">${stage.tag}</div>
        </div>
      `;

      chip.addEventListener("click", () => {
        this.selectStage(stage.id);
      });

      container.appendChild(chip);
    });
  }

  selectStage(stageId) {
    this.activeStageId = stageId;
    const chips = document.querySelectorAll(".pipeline-chip");
    chips.forEach(c => {
      const id = parseInt(c.getAttribute("data-stage-id"), 10);
      if (id === stageId) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });

    this.renderStageDetail(stageId);
  }

  renderStageDetail(stageId) {
    const detailCard = document.getElementById(this.detailCardId);
    if (!detailCard) return;

    const stage = PIPELINE_STAGES.find(s => s.id === stageId) || PIPELINE_STAGES[0];

    detailCard.innerHTML = `
      <div class="pipeline-column">
        <div class="pipeline-column-header">
          <span>01. What Enters</span>
          <span style="margin-left: auto; font-size: 0.68rem; color: var(--text-dim);">INPUT ARTIFACTS</span>
        </div>
        <div class="pipeline-column-body">
          <p>${stage.enters}</p>
          <div style="margin-top: 1rem; padding: 0.6rem; background: var(--blue-pale); border-radius: 4px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--cyan-bright);">
            Input Protocol: Operational Forecast Ingestion Tensor (NetCDF4 / GeoTIFF)
          </div>
        </div>
      </div>

      <div class="pipeline-column" style="border-color: rgba(56, 189, 248, 0.35); background: var(--bg-card);">
        <div class="pipeline-column-header" style="color: #ffffff;">
          <span style="color: var(--cyan-bright);">02. What Happens</span>
          <span class="badge" style="margin-left: auto; font-size: 0.65rem;">STAGE ${stage.id}</span>
        </div>
        <div class="pipeline-column-body">
          <h4 style="color: #ffffff; margin-bottom: 0.5rem; font-size: 1rem;">${stage.title}</h4>
          <p>${stage.whatHappens}</p>
          <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-muted); line-height: 1.45; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
            <strong>Scientific Mechanism:</strong> ${stage.summary}
          </div>
        </div>
      </div>

      <div class="pipeline-column">
        <div class="pipeline-column-header">
          <span>03. What Comes Out</span>
          <span style="margin-left: auto; font-size: 0.68rem; color: var(--text-dim);">OUTPUT ARTIFACTS</span>
        </div>
        <div class="pipeline-column-body">
          <p>${stage.comesOut}</p>
          <div style="margin-top: 1rem; padding: 0.6rem; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 4px; font-family: var(--font-mono); font-size: 0.72rem; color: #34d399;">
            Integrity Check: Verified Physical Continuity & Range Constraints Passed
          </div>
        </div>
      </div>
    `;
  }
}

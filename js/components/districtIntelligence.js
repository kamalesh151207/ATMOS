/**
 * VARSHA-RA: District Intelligence Component
 * Converts grid-level forecasts into district-level administrative intelligence
 * via area-weighted aggregation. Provides searchable table, sorting, and detail drawer.
 */

import { DISTRICTS_DATA } from "../mockData.js";

export class DistrictIntelligenceComponent {
  constructor(tableContainerId = "district-table-body", drawerId = "district-detail-drawer", backdropId = "drawer-backdrop") {
    this.tableContainerId = tableContainerId;
    this.drawerId = drawerId;
    this.backdropId = backdropId;
    this.districts = [...DISTRICTS_DATA];
    this.sortField = "areaWeightedMeanMm";
    this.sortDirection = "desc";
    this.searchQuery = "";
    this.activeZone = "all";
  }

  init() {
    this.renderTable();
    this.bindSearchAndFilter();
    this.bindDrawerClose();
  }

  sort(field) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortField = field;
      this.sortDirection = "desc";
    }
    this.renderTable();
  }

  getFilteredDistricts() {
    return this.districts.filter(d => {
      const matchesSearch = 
        d.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        d.state.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        d.zone.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesZone = this.activeZone === "all" || d.zone.toLowerCase().includes(this.activeZone.toLowerCase());

      return matchesSearch && matchesZone;
    }).sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];
      if (typeof valA === "string" && typeof valB === "string") {
        const cmp = valA.localeCompare(valB);
        return this.sortDirection === "asc" ? cmp : -cmp;
      }
      if (valA === valB) return 0;
      if (this.sortDirection === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  }

  renderTable() {
    const tbody = document.getElementById(this.tableContainerId);
    if (!tbody) return;

    const filtered = this.getFilteredDistricts();
    tbody.innerHTML = "";

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-dim);">
            No districts match the selected filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(d => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="dist-name">
          <div>${d.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-dim);">${d.state}</div>
        </td>
        <td><span style="font-size: 0.75rem; color: var(--text-secondary);">${d.zone}</span></td>
        <td style="color: var(--cyan-bright); font-weight: 700;">${d.areaWeightedMeanMm.toFixed(1)} mm</td>
        <td>${d.nwpRawMeanMm.toFixed(1)} mm</td>
        <td style="color: ${d.biasCorrectionMm > 0 ? 'var(--regime-active)' : 'var(--risk-high)'};">
          ${d.biasCorrectionMm > 0 ? "+" : ""}${d.biasCorrectionMm.toFixed(1)} mm
        </td>
        <td>${d.p90RainMm.toFixed(1)} mm</td>
        <td style="color: ${d.fractionAreaOver50mm > 0.8 ? 'var(--risk-high)' : 'var(--text-secondary)'};">
          ${(d.fractionAreaOver50mm * 100).toFixed(0)}%
        </td>
        <td>
          <span style="color: ${d.dominantRegime === 'ACTIVE' ? 'var(--regime-active)' : d.dominantRegime === 'DEPRESSION' ? 'var(--regime-depression)' : 'var(--regime-break)'}; font-weight: 600;">
            ${d.dominantRegime}
          </span>
          <span style="font-size: 0.7rem; color: var(--text-dim);">(${d.regimeConfidence})</span>
        </td>
        <td>
          <button class="district-action-btn" data-dist-id="${d.id}">
            Inspect Area Weights
          </button>
        </td>
      `;

      const btn = tr.querySelector(".district-action-btn");
      btn.addEventListener("click", () => this.openDistrictDrawer(d));

      tbody.appendChild(tr);
    });
  }

  openDistrictDrawer(district) {
    const backdrop = document.getElementById(this.backdropId);
    const drawer = document.getElementById(this.drawerId);
    if (!backdrop || !drawer) return;

    drawer.innerHTML = `
      <div class="drawer-header">
        <div>
          <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--cyan-bright); text-transform: uppercase;">
            District Decision-Support Profile
          </div>
          <h2 style="font-size: 1.5rem; color: #ffffff;">${district.name}</h2>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${district.state} • ${district.zone}</div>
        </div>
        <button class="drawer-close-btn" id="drawer-close-x">✕</button>
      </div>

      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem;">
        <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
          Area-Weighted Mathematical Aggregation
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-bright); background: var(--blue-pale); padding: 0.6rem; border-radius: 4px; margin-bottom: 0.75rem;">
          R_district = ∑ [ w_g · R_g ] where w_g = Area(g ∩ District) / Area(District)
        </div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
          ${district.name} spans <strong>${district.areaKm2.toLocaleString()} km²</strong> intersected by <strong>${district.gridCellCount} high-resolution grid cells</strong>.
        </p>
      </div>

      <div class="grid-point-stats" style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.25rem;">
        <div class="stat-row">
          <span class="stat-label">Area-Weighted Mean:</span>
          <span class="stat-value" style="color: var(--cyan-bright); font-size: 1.15rem;">${district.areaWeightedMeanMm.toFixed(1)} mm</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Raw NWP Baseline:</span>
          <span class="stat-value">${district.nwpRawMeanMm.toFixed(1)} mm</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Total AI Correction (ΔR):</span>
          <span class="stat-value" style="color: ${district.biasCorrectionMm > 0 ? 'var(--regime-active)' : 'var(--risk-high)'};">
            ${district.biasCorrectionMm > 0 ? "+" : ""}${district.biasCorrectionMm.toFixed(1)} mm
          </span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Maximum Point Rain:</span>
          <span class="stat-value">${district.maxPointRainMm.toFixed(1)} mm</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">90th Percentile (P90):</span>
          <span class="stat-value">${district.p90RainMm.toFixed(1)} mm</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Area Exceeding 50 mm:</span>
          <span class="stat-value">${(district.fractionAreaOver50mm * 100).toFixed(0)}% of district</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Heavy Rain Probability:</span>
          <span class="stat-value">${(district.heavyRainProbability * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem;">
        <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
          Synoptic Meteorological Context
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55;">
          ${district.synopticFactors}
        </p>
      </div>

      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem;">
        <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--cyan-bright); text-transform: uppercase; margin-bottom: 0.5rem;">
          Decision-Support Guidance
        </div>
        <ul style="padding-left: 1.2rem; font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
          ${district.actionChecklist.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-subtle); font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono);">
        ⚠️ DISCLAIMER: Decision-support indicators are derived from AI post-processing of numerical models and do NOT constitute official weather warnings. Always consult national meteorological bulletins.
      </div>
    `;

    backdrop.classList.add("active");
    const closeX = document.getElementById("drawer-close-x");
    if (closeX) {
      closeX.addEventListener("click", () => this.closeDrawer());
    }
  }

  closeDrawer() {
    const backdrop = document.getElementById(this.backdropId);
    if (backdrop) backdrop.classList.remove("active");
  }

  bindDrawerClose() {
    const backdrop = document.getElementById(this.backdropId);
    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) this.closeDrawer();
      });
    }
  }

  bindSearchAndFilter() {
    const searchInput = document.getElementById("district-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.renderTable();
      });
    }

    const zoneFilter = document.getElementById("district-zone-filter");
    if (zoneFilter) {
      zoneFilter.addEventListener("change", (e) => {
        this.activeZone = e.target.value;
        this.renderTable();
      });
    }

    // Sort headers
    const sortHeaders = document.querySelectorAll("[data-sort-field]");
    sortHeaders.forEach(th => {
      th.addEventListener("click", (e) => {
        const field = e.currentTarget.getAttribute("data-sort-field");
        this.sort(field);
      });
    });
  }
}

/**
 * VARSHA-RA: Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts
 * API Client Module
 * 
 * Provides an API-ready interface designed to connect to FastAPI microservice endpoints:
 * - /api/v1/forecast
 * - /api/v1/regime
 * - /api/v1/uncertainty
 * - /api/v1/correction
 * - /api/v1/heavy-rainfall
 * - /api/v1/districts
 * - /api/v1/explainability
 * - /api/v1/verification
 * - /api/v1/metadata
 * 
 * Includes automatic mock fallback when live FastAPI backend is not running,
 * ensuring seamless demonstration without breaking UI components.
 */

import {
  METADATA,
  REGIMES,
  CURRENT_FORECAST_STATE,
  UNCERTAINTY_SCENARIOS,
  GRID_CELLS_DATA,
  DISTRICTS_DATA,
  VERIFICATION_DATA,
  EXPLAINABILITY_DATA,
  PIPELINE_STAGES,
  DEVELOPMENT_ROADMAP,
  CORE_INNOVATIONS
} from "./mockData.js";

class VarshaApiClient {
  constructor(baseUrl = "/api/v1") {
    this.baseUrl = baseUrl;
    this.isMockFallback = true;
  }

  /**
   * Helper method to attempt real API request or fallback to mock data
   */
  async _fetchOrFallback(endpoint, fallbackData) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      return { success: true, isDemo: false, data };
    } catch (err) {
      // Fallback seamlessly to mock data with demo flag
      return {
        success: true,
        isDemo: true,
        disclaimer: "DEMO DATA / ILLUSTRATIVE - Synthetic Meteorological State",
        data: fallbackData
      };
    }
  }

  /**
   * GET /api/v1/metadata
   * Returns system metadata, forecast cycle, and data provenance
   */
  async getMetadata() {
    return this._fetchOrFallback("/metadata", METADATA);
  }

  /**
   * GET /api/v1/forecast
   * Returns active forecast state, grid cells, and summary statistics
   */
  async getForecast(leadTimeHours = 24, region = "all") {
    let cells = [...GRID_CELLS_DATA];
    if (region !== "all") {
      cells = cells.filter(c => c.region.toLowerCase().includes(region.toLowerCase()));
    }
    // Dynamic adjustment based on lead time for demo responsiveness
    const leadFactor = 1.0 + (leadTimeHours - 24) * 0.05;
    const adjustedCells = cells.map(c => ({
      ...c,
      rawNwpRainMm: +(c.rawNwpRainMm * (1 - (leadTimeHours - 24) * 0.02)).toFixed(1),
      varshaRaRainMm: +(c.varshaRaRainMm * (1 + (leadTimeHours - 24) * 0.015)).toFixed(1),
      leadTimeHours
    }));

    return this._fetchOrFallback(`/forecast?lead_time=${leadTimeHours}&region=${region}`, {
      state: { ...CURRENT_FORECAST_STATE, leadTime: leadTimeHours },
      gridCells: adjustedCells
    });
  }

  /**
   * GET /api/v1/regime
   * Returns definition and current state of 4 monsoon regimes
   */
  async getRegimeData() {
    return this._fetchOrFallback("/regime", {
      regimes: REGIMES,
      current: CURRENT_FORECAST_STATE.dominantRegime,
      probabilities: CURRENT_FORECAST_STATE.regimeProbabilities,
      entropy: CURRENT_FORECAST_STATE.entropyBits,
      uncertainty: CURRENT_FORECAST_STATE.normalizedUncertainty,
      confidence: CURRENT_FORECAST_STATE.regimeConfidence
    });
  }

  /**
   * GET /api/v1/uncertainty
   * Returns uncertainty scenarios and gating formulas
   */
  async getUncertaintyScenarios() {
    return this._fetchOrFallback("/uncertainty", UNCERTAINTY_SCENARIOS);
  }

  /**
   * GET /api/v1/districts
   * Returns district-level area-weighted rainfall intelligence
   */
  async getDistricts(query = "", zone = "all") {
    let districts = [...DISTRICTS_DATA];
    if (zone !== "all") {
      districts = districts.filter(d => d.zone.toLowerCase().includes(zone.toLowerCase()));
    }
    if (query) {
      const q = query.toLowerCase();
      districts = districts.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.state.toLowerCase().includes(q) ||
        d.dominantRegime.toLowerCase().includes(q)
      );
    }
    return this._fetchOrFallback(`/districts?q=${encodeURIComponent(query)}&zone=${zone}`, districts);
  }

  /**
   * GET /api/v1/districts/:id
   * Returns deep-dive information for a single district
   */
  async getDistrictById(districtId) {
    const district = DISTRICTS_DATA.find(d => d.id === districtId);
    if (!district) {
      return { success: false, error: "District not found" };
    }
    // Associated grid cells
    const associatedCells = GRID_CELLS_DATA.filter(c => c.district.toLowerCase() === district.name.toLowerCase());
    return this._fetchOrFallback(`/districts/${districtId}`, {
      district,
      gridCells: associatedCells
    });
  }

  /**
   * GET /api/v1/heavy-rainfall
   * Returns exceedance probabilities for given threshold
   */
  async getHeavyRainfall(thresholdMm = 50) {
    const cellsWithProb = GRID_CELLS_DATA.map(cell => {
      let prob;
      if (thresholdMm <= 25) prob = cell.probExceed25;
      else if (thresholdMm <= 50) prob = cell.probExceed50;
      else if (thresholdMm <= 100) prob = cell.probExceed100;
      else prob = cell.probExceed150;

      return {
        id: cell.id,
        name: cell.name,
        lat: cell.lat,
        lon: cell.lon,
        rainfallMm: cell.varshaRaRainMm,
        thresholdMm,
        exceedanceProbability: prob,
        uncertaintyRange: [Math.max(0, prob - 0.08), Math.min(1.0, prob + 0.08)]
      };
    });

    return this._fetchOrFallback(`/heavy-rainfall?threshold=${thresholdMm}`, {
      thresholdMm,
      gridProbabilities: cellsWithProb,
      reliabilityCurve: VERIFICATION_DATA.reliabilityCurve
    });
  }

  /**
   * GET /api/v1/explainability
   * Returns SHAP feature importance and local point contributions
   */
  async getExplainability() {
    return this._fetchOrFallback("/explainability", EXPLAINABILITY_DATA);
  }

  /**
   * GET /api/v1/verification
   * Returns comprehensive verification metrics and comparison curves
   */
  async getVerification(options = {}) {
    return this._fetchOrFallback("/verification", VERIFICATION_DATA);
  }

  /**
   * GET /api/v1/pipeline
   * Returns technical details of all 16 pipeline stages
   */
  async getPipeline() {
    return this._fetchOrFallback("/pipeline", PIPELINE_STAGES);
  }

  /**
   * GET /api/v1/roadmap
   * Returns development milestones
   */
  async getRoadmap() {
    return this._fetchOrFallback("/roadmap", DEVELOPMENT_ROADMAP);
  }

  /**
   * GET /api/v1/innovations
   * Returns core innovations
   */
  async getInnovations() {
    return this._fetchOrFallback("/innovations", CORE_INNOVATIONS);
  }
}

export const api = new VarshaApiClient();
export default api;

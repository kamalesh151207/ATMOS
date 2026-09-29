/**
 * VARSHA-RA: Interactive Forecast Map Component
 * Handles Leaflet map rendering, layer switching, grid point markers,
 * rainfall intensity heatmaps/polygons, and interactive grid inspection.
 */

import { GRID_CELLS_DATA, CURRENT_FORECAST_STATE } from "../mockData.js";

export class ForecastMapComponent {
  constructor(containerId = "forecast-map", inspectorId = "grid-inspector-content") {
    this.containerId = containerId;
    this.inspectorId = inspectorId;
    this.map = null;
    this.activeLayer = "corrected"; // "corrected" | "raw" | "delta" | "heavyRain" | "regime" | "uncertainty" | "terrain"
    this.activeThreshold = 50; // 25 | 50 | 100 | 150 mm
    this.selectedCell = GRID_CELLS_DATA[0]; // Default Mahabaleshwar
    this.markers = [];
    this.contourLayers = [];
    this.gridPolygonLayers = [];
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (container) {
      if (typeof L !== "undefined") {
        this.initLeafletMap();
      } else {
        this.initCanvasFallback(container);
      }

      this.renderInspector(this.selectedCell);
      this.bindLayerControls();
      this.bindThresholdControls();
    }

    const heroContainer = document.getElementById("hero-map");
    if (heroContainer && typeof L !== "undefined") {
      this.initHeroLeafletMap();
    }
  }

  initLeafletMap() {
    // Center around India (approx 20.59°N, 78.96°E)
    this.map = L.map(this.containerId, {
      center: [20.5937, 78.9629],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: true
    });

    // Default to OpenStreetMap Standard basemap for maximum reliability & zero API keys
    this.tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abc',
      maxZoom: 19
    }).addTo(this.map);

    // Vector Overlays: India Boundary, Western Ghats, and Monsoon Trough
    this.renderIndiaVectorOverlays();

    this.renderGridLayers();
    this.bindResetViewButton();
    this.bindBasemapSelector();
  }

  renderIndiaVectorOverlays() {
    if (!this.map) return;

    const INDIA_BORDER = [
      [35.5, 77.0], [34.5, 76.0], [32.5, 78.5], [31.0, 79.5], [30.0, 81.0],
      [27.5, 88.5], [27.0, 92.0], [28.2, 96.0], [27.0, 97.0], [24.0, 94.5],
      [23.0, 91.5], [22.0, 89.0], [21.5, 87.0], [19.8, 86.0], [17.7, 83.3],
      [13.1, 80.3], [10.8, 79.8], [8.1, 77.5], [10.0, 76.2], [12.9, 74.8],
      [15.4, 73.8], [19.0, 72.8], [21.0, 72.5], [22.5, 69.0], [23.7, 68.2],
      [24.5, 71.0], [27.0, 70.0], [29.8, 73.0], [32.5, 74.8], [34.5, 74.5], [35.5, 77.0]
    ];

    const WESTERN_GHATS_LINE = [
      [20.5, 73.5], [19.2, 73.6], [18.0, 73.8], [16.5, 74.0], [15.2, 74.2], [13.5, 75.0], [11.5, 76.0], [8.5, 77.2]
    ];

    const MONSOON_TROUGH_LINE = [
      [28.5, 76.5], [26.0, 80.5], [24.0, 84.5], [22.5, 88.0]
    ];

    // India Outline Vector
    L.polyline(INDIA_BORDER, { color: "#1769d2", weight: 2.5, opacity: 0.85, dashArray: "6, 4" }).addTo(this.map)
      .bindTooltip("India Meteorological Boundary", { sticky: true });

    // Western Ghats Orographic Ridge Vector
    L.polyline(WESTERN_GHATS_LINE, { color: "#168a62", weight: 3, opacity: 0.9 }).addTo(this.map)
      .bindTooltip("Western Ghats Orographic Ridge Zone", { sticky: true });

    // Monsoon Trough Axis Vector
    L.polyline(MONSOON_TROUGH_LINE, { color: "#d99000", weight: 2.5, opacity: 0.9, dashArray: "4, 4" }).addTo(this.map)
      .bindTooltip("Monsoon Trough Axis", { sticky: true });
  }

  bindBasemapSelector() {
    const basemapTiles = {
      osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      carto: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      topo: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    };

    const basemapAttributions = {
      osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      carto: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      topo: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
      dark: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
    };

    const buttons = document.querySelectorAll("[data-basemap]");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-basemap");
        if (basemapTiles[key] && this.map) {
          if (this.tileLayer) {
            this.map.removeLayer(this.tileLayer);
          }
          this.tileLayer = L.tileLayer(basemapTiles[key], {
            attribution: basemapAttributions[key],
            subdomains: key === "osm" ? "abc" : "abcd",
            maxZoom: 19
          }).addTo(this.map);

          buttons.forEach(b => {
            b.style.background = "#ffffff";
            b.style.color = "#172b4d";
            b.classList.remove("active");
          });
          btn.style.background = "#1769d2";
          btn.style.color = "#ffffff";
          btn.classList.add("active");
        }
      });
    });
  }

  bindThresholdControls() {
    const thresholdBtns = document.querySelectorAll("[data-threshold]");
    thresholdBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const val = parseInt(btn.getAttribute("data-threshold"), 10);
        this.activeThreshold = val;

        thresholdBtns.forEach(b => {
          b.style.background = "#ffffff";
          b.style.color = "#172b4d";
          b.classList.remove("active");
        });
        btn.style.background = "#1769d2";
        btn.style.color = "#ffffff";
        btn.classList.add("active");

        this.renderGridLayers();
      });
    });
  }

  initHeroLeafletMap() {
    this.heroMap = L.map("hero-map", {
      center: [20.5937, 78.9629],
      zoom: 4.5,
      minZoom: 3,
      maxZoom: 8,
      zoomControl: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
      subdomains: 'abc',
      maxZoom: 19
    }).addTo(this.heroMap);

    const INDIA_BORDER = [
      [35.5, 77.0], [34.5, 76.0], [32.5, 78.5], [31.0, 79.5], [30.0, 81.0],
      [27.5, 88.5], [27.0, 92.0], [28.2, 96.0], [27.0, 97.0], [24.0, 94.5],
      [23.0, 91.5], [22.0, 89.0], [21.5, 87.0], [19.8, 86.0], [17.7, 83.3],
      [13.1, 80.3], [10.8, 79.8], [8.1, 77.5], [10.0, 76.2], [12.9, 74.8],
      [15.4, 73.8], [19.0, 72.8], [21.0, 72.5], [22.5, 69.0], [23.7, 68.2],
      [24.5, 71.0], [27.0, 70.0], [29.8, 73.0], [32.5, 74.8], [34.5, 74.5], [35.5, 77.0]
    ];
    L.polyline(INDIA_BORDER, { color: "#1769d2", weight: 2, opacity: 0.8 }).addTo(this.heroMap);

    GRID_CELLS_DATA.forEach(cell => {
      const color = this.getColorForCell(cell);
      const bounds = [
        [cell.lat - 0.20, cell.lon - 0.20],
        [cell.lat + 0.20, cell.lon + 0.20]
      ];
      L.rectangle(bounds, {
        color: color,
        weight: 1,
        fillColor: color,
        fillOpacity: 0.45
      }).addTo(this.heroMap);

      L.circleMarker([cell.lat, cell.lon], {
        radius: 6,
        fillColor: color,
        color: "#ffffff",
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.9
      }).addTo(this.heroMap).bindTooltip(`<b>${cell.name}</b><br/>ATMOS: ${cell.varshaRaRainMm} mm`, { direction: "top" });
    });
  }

  showBasemapConfigBanner() {
    const existing = document.getElementById("basemap-config-notice");
    if (existing) return;

    const banner = document.createElement("div");
    banner.id = "basemap-config-notice";
    banner.style.cssText = "position: absolute; top: 12px; left: 60px; right: 12px; z-index: 800; background: #ffffff; border: 1px solid #d7e3ee; border-radius: 8px; padding: 0.65rem 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; box-shadow: 0 2px 8px rgba(16,42,67,0.08); font-family: var(--font-sans);";
    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #1769d1;"></span>
        <div>
          <div style="font-size: 0.78rem; font-weight: 700; color: #12304a; text-transform: uppercase;">Basemap Configuration Optional</div>
          <div style="font-size: 0.75rem; color: #52667a;">The forecasting, AI correction, and grid telemetry layers remain active independently of the basemap configuration.</div>
        </div>
      </div>
      <button onclick="alert('Configuration Note: To set up a custom basemap provider API key, define VITE_MAP_API_KEY in your environment configuration.')" style="background: #eaf4ff; color: #1769d1; border: 1px solid #d7e3ee; border-radius: 6px; padding: 0.35rem 0.75rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; white-space: nowrap;">CONFIGURE MAP</button>
    `;

    const container = document.getElementById(this.containerId);
    if (container) {
      container.style.position = "relative";
      container.appendChild(banner);
    }
  }

  resetDashboard() {
    this.activeLayer = "corrected";
    this.activeThreshold = 50;
    this.selectedCell = GRID_CELLS_DATA[0];

    // Reset view bounds to India
    if (this.map) {
      this.map.setView([20.5937, 78.9629], 5, { animate: true });
    }

    // Reset basemap to OpenStreetMap Standard
    if (this.map && this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
      this.tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abc',
        maxZoom: 19
      }).addTo(this.map);
    }

    // Reset Layer Buttons UI
    const layerBtns = document.querySelectorAll(".layer-select-btn");
    layerBtns.forEach(btn => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-layer") === "corrected") {
        btn.classList.add("active");
      }
    });

    // Reset Threshold Buttons UI
    const thresholdBtns = document.querySelectorAll("[data-threshold]");
    thresholdBtns.forEach(btn => {
      btn.style.background = "#ffffff";
      btn.style.color = "#172b4d";
      btn.classList.remove("active");
      if (btn.getAttribute("data-threshold") === "50") {
        btn.style.background = "#1769d2";
        btn.style.color = "#ffffff";
        btn.classList.add("active");
      }
    });

    // Reset Basemap Buttons UI
    const basemapBtns = document.querySelectorAll("[data-basemap]");
    basemapBtns.forEach(btn => {
      btn.style.background = "#ffffff";
      btn.style.color = "#172b4d";
      btn.classList.remove("active");
      if (btn.getAttribute("data-basemap") === "osm") {
        btn.style.background = "#1769d2";
        btn.style.color = "#ffffff";
        btn.classList.add("active");
      }
    });

    this.renderGridLayers();
    this.renderInspector(this.selectedCell);
    this.updateLegend();
  }

  bindResetViewButton() {
    const resetBtn = document.getElementById("map-reset-view-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetDashboard();
      });
    }
  }

  updateTileTheme(theme) {
    if (!this.map || !this.tileLayer) return;
    const tileUrl = theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    this.tileLayer.setUrl(tileUrl);
  }

  initCanvasFallback(container) {
    container.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
        <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--cyan-bright); margin-bottom: 0.5rem;">[VECTOR SYNOPTIC CANVAS]</div>
        <p style="font-size: 0.85rem; max-width: 400px;">Rendering interactive high-resolution monsoon grid mesh across Western Ghats, Vidarbha, and Bay of Bengal core zone.</p>
        <div id="canvas-grid-root" style="margin-top: 1rem; width: 100%; height: 420px; background: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: 8px; position: relative; overflow: hidden;"></div>
      </div>
    `;
    this.renderFallbackGridPoints();
  }

  renderFallbackGridPoints() {
    const root = document.getElementById("canvas-grid-root");
    if (!root) return;

    root.innerHTML = "";
    GRID_CELLS_DATA.forEach(cell => {
      // Map lat/lon to percentage: lat [10 to 28], lon [72 to 92]
      const topPct = 100 - ((cell.lat - 10) / (28 - 10)) * 100;
      const leftPct = ((cell.lon - 72) / (92 - 72)) * 100;

      const point = document.createElement("div");
      point.style.position = "absolute";
      point.style.top = `${topPct}%`;
      point.style.left = `${leftPct}%`;
      point.style.transform = "translate(-50%, -50%)";
      point.style.width = "18px";
      point.style.height = "18px";
      point.style.borderRadius = "50%";
      point.style.cursor = "pointer";
      point.style.border = "2px solid #ffffff";
      point.style.backgroundColor = this.getColorForCell(cell);
      point.title = `${cell.name} (${cell.district}) - ${cell.varshaRaRainMm} mm`;

      point.addEventListener("click", () => {
        this.selectCell(cell);
      });

      root.appendChild(point);
    });
  }

  getColorForCell(cell) {
    if (this.activeLayer === "corrected") {
      const val = cell.varshaRaRainMm;
      if (val > 200) return "#ec4899"; // Extreme Pink
      if (val > 150) return "#ef4444"; // Red
      if (val > 100) return "#f97316"; // Orange
      if (val > 50)  return "#eab308"; // Yellow
      if (val > 25)  return "#38bdf8"; // Light Blue
      return "#0284c7"; // Blue
    } else if (this.activeLayer === "raw") {
      const val = cell.rawNwpRainMm;
      if (val > 150) return "#ef4444";
      if (val > 100) return "#f97316";
      if (val > 50)  return "#eab308";
      if (val > 25)  return "#38bdf8";
      return "#0284c7";
    } else if (this.activeLayer === "delta") {
      const delta = cell.correctionDeltaMm;
      if (delta > 60) return "#10b981"; // Strong positive enhancement
      if (delta > 20) return "#38bdf8";
      if (delta < -10) return "#ef4444"; // Dry bias suppression
      return "#94a3b8";
    } else if (this.activeLayer === "heavyRain") {
      let prob = cell.probExceed50;
      if (this.activeThreshold === 25) prob = cell.probExceed25;
      if (this.activeThreshold === 100) prob = cell.probExceed100;
      if (this.activeThreshold === 150) prob = cell.probExceed150;

      if (prob > 0.85) return "#d64545"; // High Risk Red
      if (prob > 0.65) return "#f97316"; // Moderate-High Orange
      if (prob > 0.40) return "#d99000"; // Moderate Gold
      return "#168a62"; // Low Risk Green
    } else if (this.activeLayer === "regime") {
      if (cell.dominantRegime === "ACTIVE") return "#10b981";
      if (cell.dominantRegime === "DEPRESSION") return "#06b6d4";
      if (cell.dominantRegime === "BREAK") return "#f59e0b";
      return "#a855f7";
    } else if (this.activeLayer === "uncertainty") {
      const u = cell.uncertaintyH;
      if (u > 0.55) return "#ef4444";
      if (u > 0.48) return "#f59e0b";
      return "#10b981";
    } else if (this.activeLayer === "terrain") {
      const elev = cell.elevationM;
      if (elev > 1000) return "#f59e0b";
      if (elev > 400)  return "#10b981";
      return "#06b6d4";
    }
    return "#38bdf8";
  }

  createSpotPopupHTML(cell) {
    const deltaColor = cell.correctionDeltaMm > 0 ? "#168a62" : (cell.correctionDeltaMm < 0 ? "#d64545" : "#60738a");
    const deltaSign = cell.correctionDeltaMm > 0 ? "+" : "";
    const riskColor = cell.probExceed50 > 0.75 ? "#d64545" : (cell.probExceed50 > 0.45 ? "#d99000" : "#168a62");

    return `
      <div class="spot-popup-container" style="font-family: var(--font-sans); padding: 4px; color: #12304a; min-width: 250px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #d7e3ee; padding-bottom: 6px; margin-bottom: 8px;">
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.65rem; color: #1769d1; font-weight: 700; text-transform: uppercase;">
              SPOT METEOROLOGICAL TELEMETRY
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #0f2747; margin: 2px 0 0 0; line-height: 1.25;">
              ${cell.name}
            </h4>
          </div>
          <span class="badge" style="background: #eaf4ff; color: #1769d1; font-size: 0.65rem; font-weight: 700; border-color: #bcd7f5;">
            ${cell.id}
          </span>
        </div>

        <div style="font-size: 0.76rem; color: #52667a; margin-bottom: 8px;">
          📍 <strong>${cell.district}, ${cell.state}</strong> (${cell.lat.toFixed(2)}°N, ${cell.lon.toFixed(2)}°E)
        </div>

        <!-- Rain Comparison Box -->
        <div style="background: #f0f7ff; border: 1px solid #cce3fd; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 0.74rem; color: #1769d1; font-weight: 700;">ATMOS AI FORECAST:</span>
            <span style="font-family: var(--font-mono); font-weight: 800; font-size: 1.2rem; color: #1769d1;">${cell.varshaRaRainMm} mm</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.74rem; margin-top: 5px; border-top: 1px dashed #cce3fd; padding-top: 4px;">
            <span style="color: #52667a;">Raw NWP Baseline: <strong>${cell.rawNwpRainMm} mm</strong></span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: ${deltaColor};">
              ΔR: ${deltaSign}${cell.correctionDeltaMm} mm
            </span>
          </div>
        </div>

        <!-- 4 Grid KPI Cards inside Popup -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.74rem; margin-bottom: 8px;">
          <div style="background: #ffffff; border: 1px solid #eaf3ff; padding: 6px 8px; border-radius: 6px;">
            <div style="color: #7a8a99; font-size: 0.64rem; font-weight: 700; text-transform: uppercase;">SYNOPTIC REGIME</div>
            <div style="font-weight: 700; color: #1769d1; font-size: 0.8rem; margin-top: 1px;">${cell.dominantRegime}</div>
          </div>
          <div style="background: #ffffff; border: 1px solid #eaf3ff; padding: 6px 8px; border-radius: 6px;">
            <div style="color: #7a8a99; font-size: 0.64rem; font-weight: 700; text-transform: uppercase;">P(RAIN > 50mm)</div>
            <div style="font-weight: 700; color: ${riskColor}; font-size: 0.8rem; margin-top: 1px;">${(cell.probExceed50 * 100).toFixed(0)}%</div>
          </div>
          <div style="background: #ffffff; border: 1px solid #eaf3ff; padding: 6px 8px; border-radius: 6px;">
            <div style="color: #7a8a99; font-size: 0.64rem; font-weight: 700; text-transform: uppercase;">ELEVATION</div>
            <div style="font-weight: 600; color: #12304a; font-size: 0.78rem; margin-top: 1px;">${cell.elevationM} m (${cell.slopeDeg}°)</div>
          </div>
          <div style="background: #ffffff; border: 1px solid #eaf3ff; padding: 6px 8px; border-radius: 6px;">
            <div style="color: #7a8a99; font-size: 0.64rem; font-weight: 700; text-transform: uppercase;">COAST DISTANCE</div>
            <div style="font-weight: 600; color: #12304a; font-size: 0.78rem; margin-top: 1px;">${cell.distanceCoastKm} km</div>
          </div>
        </div>

        <!-- Orographic / Terrain Factor -->
        <div style="font-size: 0.72rem; color: #52667a; background: #fffbf0; border: 1px solid #fde68a; border-radius: 6px; padding: 6px 8px; line-height: 1.35;">
          ⚡ <strong>Terrain Factor:</strong> ${cell.terrainFactor}
        </div>
      </div>
    `;
  }

  renderGridLayers() {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    // Clear existing polygon cells
    this.gridPolygonLayers.forEach(l => this.map.removeLayer(l));
    this.gridPolygonLayers = [];

    GRID_CELLS_DATA.forEach(cell => {
      const color = this.getColorForCell(cell);
      const isSelected = this.selectedCell && this.selectedCell.id === cell.id;

      // Render 0.25° representative bounding grid box
      const halfSize = 0.20;
      const bounds = [
        [cell.lat - halfSize, cell.lon - halfSize],
        [cell.lat + halfSize, cell.lon + halfSize]
      ];

      const rect = L.rectangle(bounds, {
        color: isSelected ? "#1769d2" : color,
        weight: isSelected ? 2 : 1,
        fillColor: color,
        fillOpacity: isSelected ? 0.45 : 0.3
      }).addTo(this.map);

      rect.on("click", (e) => {
        if (e && e.originalEvent) {
          L.DomEvent.stopPropagation(e);
        }
        this.selectCell(cell);
      });
      this.gridPolygonLayers.push(rect);

      // Create rich Leaflet popup for each spot marker
      const popupContent = this.createSpotPopupHTML(cell);

      // Center marker circle (colour dot)
      const marker = L.circleMarker([cell.lat, cell.lon], {
        radius: isSelected ? 11 : 8,
        fillColor: color,
        color: isSelected ? "#0f2747" : "#ffffff",
        weight: isSelected ? 3.5 : 2,
        opacity: 1.0,
        fillOpacity: 0.95
      }).addTo(this.map);

      marker.bindPopup(popupContent, {
        className: "custom-spot-popup",
        maxWidth: 320,
        offset: [0, -6]
      });

      const tooltipContent = `
        <div style="font-family: var(--font-sans); font-size: 0.78rem; color: #111;">
          <strong>${cell.name}</strong> (${cell.district})<br/>
          <span style="color: #0284c7; font-weight: 700;">ATMOS: ${cell.varshaRaRainMm} mm</span> (Click spot for details)
        </div>
      `;
      marker.bindTooltip(tooltipContent, { direction: "top", offset: [0, -6] });

      marker.on("click", () => {
        this.selectCell(cell);
      });

      marker.cellData = cell;
      this.markers.push(marker);

      if (isSelected) {
        setTimeout(() => marker.openPopup(), 100);
      }
    });
  }

  selectCell(cell) {
    this.selectedCell = cell;
    this.renderInspector(cell);

    // Update marker highlights and popups across all spot markers
    this.markers.forEach(m => {
      if (m.cellData) {
        const isMatch = m.cellData.id === cell.id;
        const color = this.getColorForCell(m.cellData);
        m.setRadius(isMatch ? 11 : 8);
        m.setStyle({
          color: isMatch ? "#0f2747" : "#ffffff",
          weight: isMatch ? 3.5 : 2,
          fillColor: color,
          fillOpacity: 0.95
        });

        if (isMatch) {
          m.openPopup();
        }
      }
    });

    // Pan smoothly if map exists
    if (this.map) {
      this.map.panTo([cell.lat, cell.lon], { animate: true, duration: 0.5 });
    }
  }

  renderInspector(cell) {
    const el = document.getElementById(this.inspectorId);
    if (!el || !cell) return;

    el.innerHTML = `
      <div class="inspector-header">
        <div class="inspector-title" style="display: flex; align-items: center; justify-content: space-between;">
          <span>${cell.name}</span>
          <span class="badge" style="background: rgba(56, 189, 248, 0.1); font-size: 0.7rem;">${cell.id}</span>
        </div>
        <div class="inspector-sub">${cell.district}, ${cell.state} • ${cell.region}</div>
      </div>

      <div class="grid-point-stats">
        <div class="stat-row">
          <span class="stat-label">Coordinates</span>
          <span class="stat-value">${cell.lat.toFixed(2)}°N, ${cell.lon.toFixed(2)}°E</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Elevation / Slope</span>
          <span class="stat-value">${cell.elevationM} m (${cell.slopeDeg}° slope)</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Distance to Coast</span>
          <span class="stat-value">${cell.distanceCoastKm} km</span>
        </div>
        <div class="stat-row" style="background: rgba(56, 189, 248, 0.08); padding: 0.5rem; border-radius: 4px;">
          <span class="stat-label" style="color: var(--cyan-bright); font-weight: 600;">ATMOS Corrected</span>
          <span class="stat-value" style="color: var(--cyan-bright); font-size: 1.15rem;">${cell.varshaRaRainMm} mm</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Raw NWP Baseline</span>
          <span class="stat-value">${cell.rawNwpRainMm} mm</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Correction Delta (ΔR)</span>
          <span class="stat-value" style="color: ${cell.correctionDeltaMm > 0 ? 'var(--regime-active)' : 'var(--risk-high)'};">
            ${cell.correctionDeltaMm > 0 ? "+" : ""}${cell.correctionDeltaMm} mm
          </span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Dominant Regime</span>
          <span class="stat-value" style="color: var(--cyan-bright);">${cell.dominantRegime}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Entropy Uncertainty (H)</span>
          <span class="stat-value">${cell.uncertaintyH} bits</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">P(Rain > 50 mm)</span>
          <span class="stat-value" style="color: ${cell.probExceed50 > 0.8 ? 'var(--risk-high)' : 'var(--cyan-bright)'};">
            ${(cell.probExceed50 * 100).toFixed(0)}%
          </span>
        </div>
        <div class="stat-row">
          <span class="stat-label">P(Rain > 100 mm)</span>
          <span class="stat-value">${(cell.probExceed100 * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div style="margin-top: 1rem; padding: 0.85rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
        <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem;">
          Geospatial & Orographic Refinement
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45;">
          ${cell.terrainFactor}
        </div>
      </div>

      <div style="margin-top: 0.75rem; font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono); line-height: 1.4;">
        ⚠️ DEMO DATA • AI decision-support indicator. Not an official warning.
      </div>
    `;
  }

  updateLegend() {
    const titleEl = document.getElementById("legend-title");
    const scaleEl = document.getElementById("legend-scale-grid");
    if (!titleEl || !scaleEl) return;

    if (this.activeLayer === "corrected" || this.activeLayer === "raw") {
      titleEl.innerText = this.activeLayer === "raw" ? "RAW NWP RAINFALL (mm):" : "ATMOS RAINFALL (mm):";
      scaleEl.innerHTML = `
        <div class="legend-step" style="background: #f0f9ff; color: #52667a; border: 1px solid #d7e3ee;">0 mm</div>
        <div class="legend-step" style="background: #bae6fd; color: #0369a1;">1–10 mm</div>
        <div class="legend-step" style="background: #38bdf8; color: #0284c7;">10–25 mm</div>
        <div class="legend-step" style="background: #0284c7; color: #ffffff;">25–50 mm</div>
        <div class="legend-step" style="background: #eab308; color: #102a43; font-weight: 700;">50–100 mm</div>
        <div class="legend-step" style="background: #f97316; color: #ffffff; font-weight: 700;">100–200 mm</div>
        <div class="legend-step" style="background: #d64545; color: #ffffff; font-weight: 700;">>200 mm</div>
      `;
    } else if (this.activeLayer === "delta") {
      titleEl.innerText = "BIAS CORRECTION ΔR (mm):";
      scaleEl.innerHTML = `
        <div class="legend-step" style="background: #ef4444; color: #ffffff; font-weight: 700;">< -10 mm</div>
        <div class="legend-step" style="background: #94a3b8; color: #ffffff;">-10 to +20 mm</div>
        <div class="legend-step" style="background: #38bdf8; color: #0284c7;">+20 to +60 mm</div>
        <div class="legend-step" style="background: #10b981; color: #ffffff; font-weight: 700;">> +60 mm</div>
      `;
    } else if (this.activeLayer === "heavyRain") {
      titleEl.innerText = `HEAVY RAIN PROBABILITY P(R > ${this.activeThreshold}mm):`;
      scaleEl.innerHTML = `
        <div class="legend-step" style="background: #168a62; color: #ffffff; font-weight: 700;">0–40% Low</div>
        <div class="legend-step" style="background: #d99000; color: #ffffff; font-weight: 700;">40–65% Moderate</div>
        <div class="legend-step" style="background: #f97316; color: #ffffff; font-weight: 700;">65–85% High</div>
        <div class="legend-step" style="background: #d64545; color: #ffffff; font-weight: 700;">> 85% Critical</div>
      `;
    } else if (this.activeLayer === "regime") {
      titleEl.innerText = "MONSOON SYNOPTIC REGIME:";
      scaleEl.innerHTML = `
        <div class="legend-step" style="background: #10b981; color: #ffffff; font-weight: 700;">ACTIVE</div>
        <div class="legend-step" style="background: #06b6d4; color: #ffffff; font-weight: 700;">DEPRESSION</div>
        <div class="legend-step" style="background: #f59e0b; color: #ffffff; font-weight: 700;">BREAK</div>
        <div class="legend-step" style="background: #a855f7; color: #ffffff; font-weight: 700;">TRANSITION</div>
      `;
    } else if (this.activeLayer === "uncertainty") {
      titleEl.innerText = "PREDICTIVE SHANNON ENTROPY H(p):";
      scaleEl.innerHTML = `
        <div class="legend-step" style="background: #10b981; color: #ffffff; font-weight: 700;">< 0.48 Low</div>
        <div class="legend-step" style="background: #f59e0b; color: #ffffff; font-weight: 700;">0.48–0.55 Moderate</div>
        <div class="legend-step" style="background: #ef4444; color: #ffffff; font-weight: 700;">> 0.55 High</div>
      `;
    }
  }

  setLayer(layerName) {
    this.activeLayer = layerName;

    // Show/hide threshold control bar based on layer
    const thresholdBar = document.getElementById("threshold-control-bar");
    if (thresholdBar) {
      thresholdBar.style.display = layerName === "heavyRain" || layerName === "uncertainty" ? "flex" : "none";
    }

    if (this.map) {
      this.renderGridLayers();
    } else {
      this.renderFallbackGridPoints();
    }
    this.updateLegend();
  }

  bindLayerControls() {
    const buttons = document.querySelectorAll(".layer-select-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        buttons.forEach(b => b.classList.remove("active"));
        const targetBtn = e.currentTarget;
        targetBtn.classList.add("active");
        const layer = targetBtn.getAttribute("data-layer");
        this.setLayer(layer);
      });
    });
  }
}

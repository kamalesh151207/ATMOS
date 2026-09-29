/**
 * VARSHA-RA: Live Weather & Forecast Status Component
 * Renders the top-level weather status cards, update timestamps,
 * manual refresh trigger, and forecast cycle selector.
 */

import { weatherService } from "../services/weatherService.js";
import { notificationService } from "../services/notificationService.js";

export class WeatherStatusComponent {
  constructor() {
    this.selectedCycle = "00 UTC";
  }

  init() {
    this.renderHeaderActions();
    this.renderStatusSection();
    this.bindEvents();
    this.startAutoRefresh();
  }

  renderHeaderActions() {
    const navActions = document.querySelector(".app-bar-right") || document.querySelector(".nav-actions");
    if (!navActions) return;

    // Check if weather actions already injected
    if (document.getElementById("weather-status-badge-header")) return;

    const statusObj = weatherService.getDataSourceStatus();
    const unreadCount = notificationService.getUnreadCount();

    const wrapper = document.createElement("div");
    wrapper.id = "weather-header-actions-wrapper";
    wrapper.style.cssText = "display: flex; align-items: center; gap: 0.5rem;";
    wrapper.innerHTML = `
      <div id="weather-status-badge-header" class="badge" style="${statusObj.style}; font-size: 0.72rem;">
        ${statusObj.label}
      </div>

      <button id="header-updates-btn" class="btn btn-secondary btn-sm" style="position: relative; padding: 0.35rem 0.75rem; font-size: 0.78rem;">
        <span>Updates</span>
        <span id="updates-count-badge" class="badge" style="background: #1769d1; color: #ffffff; padding: 0.15rem 0.45rem; font-size: 0.68rem; margin-left: 0.2rem;">
          ${unreadCount}
        </span>
      </button>

      <button id="header-refresh-btn" class="btn btn-secondary btn-sm" title="Refresh weather and forecast data" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;">
        <span id="refresh-spinner-icon">⟲</span> <span>Refresh</span>
      </button>
    `;

    navActions.appendChild(wrapper);
  }

  renderStatusSection() {
    const container = document.getElementById("live-weather-status-container");
    if (!container) return;

    const curr = weatherService.getCurrentConditions();
    const cycleInfo = weatherService.getForecastCycleInfo(this.selectedCycle);
    const statusObj = weatherService.getDataSourceStatus();

    container.innerHTML = `
      <div style="background: #ffffff; border: 1px solid #d7e3ee; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 4px 14px rgba(16,42,67,0.05);">
        <!-- Top Status Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid #eaf3ff; padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #1769d1; font-weight: 700; text-transform: uppercase;">
              SURFACE & ATMOSPHERIC OBSERVED / SIMULATED FIELD
            </div>
            <h2 style="font-size: 1.35rem; color: #12304a; margin-top: 0.2rem; display: flex; align-items: center; gap: 0.6rem;">
              <span>LIVE WEATHER & FORECAST STATUS</span>
              <span class="badge" style="${statusObj.style}; font-size: 0.75rem;">${statusObj.label}</span>
            </h2>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem; font-family: var(--font-mono); font-size: 0.78rem; color: #52667a;">
            <div>Last Updated: <strong style="color: #12304a;" id="status-last-updated">${cycleInfo.lastUpdatedTimeIST}</strong></div>
            <div>Next Update: <strong style="color: #1769d1;" id="status-next-update">${cycleInfo.nextUpdateTimeIST}</strong></div>
          </div>
        </div>

        <!-- 4 Grid KPI Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.25rem;">
          <!-- Card 1: Current Conditions -->
          <div style="background: #f6faff; border: 1px solid #d7e3ee; border-radius: 10px; padding: 1.15rem;">
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #1769d1; font-weight: 700; text-transform: uppercase; margin-bottom: 0.6rem;">
              CURRENT ATMOSPHERIC CONDITIONS
            </div>
            <div style="display: flex; align-items: baseline; gap: 0.4rem; margin-bottom: 0.75rem;">
              <span style="font-size: 2rem; font-weight: 800; color: #12304a; font-family: var(--font-mono);">${curr.tempC}</span>
              <span style="font-size: 1rem; color: #52667a;">°C</span>
              <span style="font-size: 0.82rem; color: #168a62; font-weight: 600; margin-left: auto;">${curr.rainRateMmHr} mm/h rain</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; font-size: 0.78rem; color: #52667a; border-top: 1px solid #d7e3ee; padding-top: 0.6rem;">
              <div>Humidity: <strong style="color: #12304a;">${curr.humidityPct}%</strong></div>
              <div>Wind: <strong style="color: #12304a;">${curr.windSpeedKmH} km/h</strong></div>
              <div>Pressure: <strong style="color: #12304a;">${curr.pressureHpa} hPa</strong></div>
              <div>Visibility: <strong style="color: #12304a;">${curr.visibilityKm} km</strong></div>
            </div>
          </div>

          <!-- Card 2: Forecast Run & Cycle -->
          <div style="background: #f6faff; border: 1px solid #d7e3ee; border-radius: 10px; padding: 1.15rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
              <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #1769d1; font-weight: 700; text-transform: uppercase;">
                FORECAST CYCLE RUN
              </div>
              <span class="badge" style="background: #ffffff; color: #1769d1; font-size: 0.68rem; padding: 0.15rem 0.5rem;">+24H LEAD</span>
            </div>

            <div style="margin-bottom: 0.75rem;">
              <div style="font-size: 0.78rem; color: #52667a; margin-bottom: 0.2rem;">Select Cycle:</div>
              <div style="display: flex; gap: 0.3rem;">
                ${["00 UTC", "06 UTC", "12 UTC", "18 UTC"].map(c => `
                  <button class="cycle-select-btn ${this.selectedCycle === c ? "active" : ""}" data-cycle="${c}" style="padding: 0.25rem 0.55rem; border-radius: 4px; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 700; cursor: pointer; border: 1px solid #d7e3ee; ${this.selectedCycle === c ? "background: #1769d1; color: #ffffff;" : "background: #ffffff; color: #12304a;"}">
                    ${c}
                  </button>
                `).join("")}
              </div>
            </div>

            <div style="font-size: 0.78rem; color: #52667a; border-top: 1px solid #d7e3ee; padding-top: 0.6rem;">
              <div>Init Time: <strong style="color: #12304a;">${cycleInfo.initTime}</strong></div>
              <div>Valid Time: <strong style="color: #12304a;">${cycleInfo.validTime}</strong></div>
            </div>
          </div>

          <!-- Card 3: Monsoon Regime Status -->
          <div style="background: #f6faff; border: 1px solid #d7e3ee; border-radius: 10px; padding: 1.15rem;">
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #1769d1; font-weight: 700; text-transform: uppercase; margin-bottom: 0.6rem;">
              SYNOPTIC MONSOON REGIME
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.6rem;">
              <span style="font-family: var(--font-mono); font-weight: 800; font-size: 1.1rem; color: #1769d1;">DEPRESSION / LOW</span>
              <span style="font-family: var(--font-mono); font-weight: 700; font-size: 0.85rem; color: #168a62;">68% CONF</span>
            </div>

            <!-- Mini Probability Bars -->
            <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.72rem; font-family: var(--font-mono); border-top: 1px solid #d7e3ee; padding-top: 0.6rem;">
              <div style="display: flex; justify-content: space-between;">
                <span>Active: 68%</span>
                <span>Break: 12%</span>
                <span>Depression: 15%</span>
                <span>Transition: 5%</span>
              </div>
              <div style="width: 100%; height: 6px; background: #d7e3ee; border-radius: 3px; overflow: hidden; display: flex;">
                <div style="width: 68%; background: #168a62;"></div>
                <div style="width: 12%; background: #f59e0b;"></div>
                <div style="width: 15%; background: #1769d1;"></div>
                <div style="width: 5%; background: #a855f7;"></div>
              </div>
            </div>
          </div>

          <!-- Card 4: Rainfall & Exceedance Status -->
          <div style="background: #f6faff; border: 1px solid #d7e3ee; border-radius: 10px; padding: 1.15rem;">
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #1769d1; font-weight: 700; text-transform: uppercase; margin-bottom: 0.6rem;">
              RAINFALL & EXCEEDANCE RISK
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.6rem;">
              <div>
                <span style="font-family: var(--font-mono); font-weight: 800; font-size: 1.25rem; color: #12304a;">218.6 mm</span>
                <span style="font-size: 0.75rem; color: #168a62; font-weight: 600;"> (+120mm ΔR)</span>
              </div>
              <span class="badge" style="background: #eaf8f2; color: #168a62; font-weight: 700; font-size: 0.7rem;">P(R>50mm): 84%</span>
            </div>

            <div style="font-size: 0.78rem; color: #52667a; border-top: 1px solid #d7e3ee; padding-top: 0.6rem;">
              <div>Selected Threshold: <strong style="color: #1769d1;">50 mm</strong></div>
              <div>High-Risk Zone: <strong style="color: #d64545;">Western Ghats & Vidarbha</strong></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Header refresh button
    const refreshBtn = document.getElementById("header-refresh-btn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => this.handleRefresh());
    }

    // Cycle selection buttons
    const cycleBtns = document.querySelectorAll(".cycle-select-btn");
    cycleBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const cycle = e.target.getAttribute("data-cycle");
        if (cycle) {
          this.selectedCycle = cycle;
          this.renderStatusSection();
          this.bindEvents();
          notificationService.addNotification("FORECAST", "Forecast Cycle Changed", `Forecast dataset updated to ${cycle} run.`);
        }
      });
    });
  }

  handleRefresh() {
    const icon = document.getElementById("refresh-spinner-icon");
    if (icon) {
      icon.style.display = "inline-block";
      icon.style.transform = "rotate(360deg)";
      icon.style.transition = "transform 0.6s ease";
    }

    setTimeout(() => {
      if (icon) {
        icon.style.transform = "rotate(0deg)";
        icon.style.transition = "none";
      }

      this.renderStatusSection();
      this.bindEvents();
      notificationService.addNotification("WEATHER", "Forecast Data Refreshed", "Surface observations and model fields updated.");
    }, 600);
  }

  startAutoRefresh() {
    // Automatically trigger data refresh every 10 minutes (600,000 ms)
    setInterval(() => {
      this.handleRefresh();
    }, 600000);
  }
}

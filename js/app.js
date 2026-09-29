/**
 * VARSHA-RA: Main Application Orchestrator
 * Coordinates component initialization, API client bindings,
 * UX Layer toggling (Executive vs Technical), and smooth navigation.
 */

import { ForecastMapComponent } from "./components/map.js";
import { PipelineComponent } from "./components/pipeline.js";
import { RegimeComponent } from "./components/regime.js";
import { ExpertGatingComponent } from "./components/expertGating.js";
import { BiasCorrectionComponent } from "./components/biasCorrection.js";
import { HeavyRainComponent } from "./components/heavyRain.js";
import { DistrictIntelligenceComponent } from "./components/districtIntelligence.js";
import { ExplainabilityComponent } from "./components/explainability.js";
import { VerificationComponent } from "./components/verification.js";
import { ArchitectureComponent } from "./components/architecture.js";
import { WeatherStatusComponent } from "./components/weatherStatus.js";
import { NotificationModalComponent } from "./components/notificationModal.js";
import { DEVELOPMENT_ROADMAP, CORE_INNOVATIONS } from "./mockData.js";

class VarshaApplication {
  constructor() {
    this.currentUxMode = "technical"; // "executive" | "technical"
    this.components = {};
  }

  init() {
    console.log("Initializing VARSHA-RA Weather Intelligence Platform...");

    // Initialize individual components
    this.components.weatherStatus = new WeatherStatusComponent();
    this.components.notificationModal = new NotificationModalComponent();
    this.components.map = new ForecastMapComponent();
    this.components.pipeline = new PipelineComponent();
    this.components.regime = new RegimeComponent();
    this.components.expertGating = new ExpertGatingComponent();
    this.components.biasCorrection = new BiasCorrectionComponent();
    this.components.heavyRain = new HeavyRainComponent();
    this.components.districts = new DistrictIntelligenceComponent();
    this.components.explainability = new ExplainabilityComponent();
    this.components.verification = new VerificationComponent();
    this.components.architecture = new ArchitectureComponent();

    // Boot all
    Object.values(this.components).forEach(comp => {
      if (comp && typeof comp.init === "function") {
        comp.init();
      }
    });

    this.renderInnovations();
    this.renderRoadmap();
    this.bindUxModeSwitch();
    this.initThemeManager();
    this.bindNavigationHighlighting();
    this.bindForecastLeadTimeButtons();

    console.log("VARSHA-RA initialized successfully in Operational Demo mode.");
  }

  initThemeManager() {
    const savedTheme = localStorage.getItem("varsha-theme") || "light";
    this.applyTheme(savedTheme);

    const toggleBtn = document.getElementById("theme-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const next = current === "light" ? "dark" : "light";
        this.applyTheme(next);
      });
    }
  }

  applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("varsha-theme", theme);

    const toggleBtn = document.getElementById("theme-toggle-btn");
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === "dark"
        ? '<span>🌙</span> <span>Dark Mode</span>'
        : '<span>☀️</span> <span>Light Mode</span>';
    }

    if (this.components && this.components.map && typeof this.components.map.updateTileTheme === "function") {
      this.components.map.updateTileTheme(theme);
    }
  }

  renderInnovations() {
    const container = document.getElementById("innovations-grid");
    if (!container) return;

    container.innerHTML = CORE_INNOVATIONS.map(item => `
      <div class="innovation-card">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="innovation-num">${item.number}</span>
          <span class="badge" style="font-size: 0.65rem;">INNOVATION</span>
        </div>
        <div>
          <h3 class="innovation-title">${item.title}</h3>
          <div class="innovation-tagline">${item.tagline}</div>
        </div>
        <p class="innovation-desc">${item.desc}</p>
      </div>
    `).join('');
  }

  renderRoadmap() {
    const container = document.getElementById("roadmap-grid");
    if (!container) return;

    container.innerHTML = DEVELOPMENT_ROADMAP.map(r => `
      <div class="roadmap-card status-${r.status.replace(/\s+/g, '')}">
        <div class="roadmap-header">
          <span class="roadmap-step">STAGE ${r.step}</span>
          <span class="roadmap-status" style="background: ${r.status === 'Completed' ? 'rgba(16, 185, 129, 0.15)' : r.status === 'Active Demo' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)'}; color: ${r.status === 'Completed' ? '#34d399' : r.status === 'Active Demo' ? '#fbbf24' : '#38bdf8'}; font-weight: 600;">
            ${r.status}
          </span>
        </div>
        <div class="roadmap-title">${r.title}</div>
        <div class="roadmap-desc">${r.desc}</div>
      </div>
    `).join('');
  }

  bindUxModeSwitch() {
    const execBtn = document.getElementById("mode-exec-btn");
    const techBtn = document.getElementById("mode-tech-btn");

    if (execBtn && techBtn) {
      execBtn.addEventListener("click", () => {
        execBtn.classList.add("active");
        techBtn.classList.remove("active");
        this.setUxMode("executive");
      });

      techBtn.addEventListener("click", () => {
        techBtn.classList.add("active");
        execBtn.classList.remove("active");
        this.setUxMode("technical");
      });
    }
  }

  setUxMode(mode) {
    this.currentUxMode = mode;
    const techElements = document.querySelectorAll(".tech-deep-dive");
    techElements.forEach(el => {
      if (mode === "executive") {
        el.style.display = "none";
      } else {
        el.style.display = "";
      }
    });
  }

  bindNavigationHighlighting() {
    const navLinks = document.querySelectorAll(".nav-link, .sidebar-nav-item");
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach(link => {
      const linkHref = link.getAttribute("href");
      if (linkHref === currentPath || (currentPath === "" && linkHref === "index.html")) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    this.bindMobileSidebarToggle();
  }

  bindMobileSidebarToggle() {
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const sidebar = id => document.getElementById(id);
    const nav = sidebar("sidebar-nav");
    let backdrop = document.getElementById("sidebar-backdrop");

    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "sidebar-backdrop";
      backdrop.className = "sidebar-backdrop";
      document.body.appendChild(backdrop);
    }

    if (mobileBtn && nav) {
      mobileBtn.addEventListener("click", () => {
        nav.classList.toggle("mobile-open");
        backdrop.classList.toggle("active");
      });

      backdrop.addEventListener("click", () => {
        nav.classList.remove("mobile-open");
        backdrop.classList.remove("active");
      });
    }
  }

  bindForecastLeadTimeButtons() {
    const leadBtns = document.querySelectorAll("[data-lead-time]");
    leadBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        leadBtns.forEach(b => b.classList.remove("active"));
        const target = e.currentTarget;
        target.classList.add("active");
        const hours = target.getAttribute("data-lead-time");
        console.log(`Switched forecast lead time to +${hours}h`);
        // Notify map component
        if (this.components.map) {
          this.components.map.renderGridLayers();
        }
      });
    });
  }
}

// Instantiate application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new VarshaApplication();
  app.init();
  window.varshaApp = app;
});

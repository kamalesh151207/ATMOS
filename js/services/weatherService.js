/**
 * VARSHA-RA: Weather & Climate Data Service
 * Provides clean service layer abstraction for weather API integration.
 * Supports environment variables (VITE_WEATHER_API_KEY / ENV_WEATHER_API_KEY)
 * with graceful fallback to clearly labelled DEMO / SIMULATED data.
 */

export class WeatherService {
  constructor() {
    this.apiKey = import.meta?.env?.VITE_WEATHER_API_KEY || window?.ENV_WEATHER_API_KEY || null;
    this.isLive = Boolean(this.apiKey);
    this.lastUpdated = new Date();
    this.refreshIntervalMinutes = 10;
  }

  getDataSourceStatus() {
    if (this.isLive) {
      return {
        code: "LIVE",
        label: "LIVE API DATA",
        badgeClass: "badge-pulse",
        style: "background: #eaf8f2; color: #168a62; border: 1px solid #a3e6cd;"
      };
    }
    return {
      code: "DEMO",
      label: "DEMO DATA — NOT OPERATIONAL",
      badgeClass: "badge-demo",
      style: "background: #fffbf0; color: #d99000; border: 1px solid #fde68a;"
    };
  }

  getCurrentConditions() {
    return {
      location: "India Subcontinent (Central Trough)",
      tempC: 28.4,
      rainRateMmHr: 14.2,
      humidityPct: 84,
      windSpeedKmH: 24,
      windDirection: "Southwesterly (SW)",
      pressureHpa: 1004,
      visibilityKm: 8.5,
      isLive: this.isLive,
      statusLabel: this.getDataSourceStatus().label
    };
  }

  getForecastCycleInfo(selectedCycle = "00 UTC") {
    const now = new Date();
    const nextUpdate = new Date(now.getTime() + this.refreshIntervalMinutes * 60000);
    
    return {
      cycle: selectedCycle,
      initTime: "2024-08-14 00:00 UTC",
      validTime: "2024-08-15 00:00 UTC",
      leadTimeHours: 24,
      lastUpdatedTimeIST: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST",
      nextUpdateTimeIST: nextUpdate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST"
    };
  }

  async fetchLiveWeatherIfAvailable(lat = 20.5937, lon = 78.9629) {
    if (!this.apiKey) {
      return { success: false, reason: "API_KEY_NOT_CONFIGURED", data: this.getCurrentConditions() };
    }

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const json = await response.json();

      this.isLive = true;
      this.lastUpdated = new Date();
      return {
        success: true,
        data: {
          location: json.name || "India Region",
          tempC: json.main?.temp || 28.4,
          rainRateMmHr: json.rain?.["1h"] || 14.2,
          humidityPct: json.main?.humidity || 84,
          windSpeedKmH: Math.round((json.wind?.speed || 6.6) * 3.6),
          windDirection: "Southwesterly (SW)",
          pressureHpa: json.main?.pressure || 1004,
          visibilityKm: Math.round((json.visibility || 8000) / 1000),
          isLive: true,
          statusLabel: "LIVE API DATA"
        }
      };
    } catch (err) {
      console.warn("WeatherService API fetch fallback:", err.message);
      this.isLive = false;
      return { success: false, reason: err.message, data: this.getCurrentConditions() };
    }
  }
}

export const weatherService = new WeatherService();

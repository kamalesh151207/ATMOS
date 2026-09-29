/**
 * VARSHA-RA: Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts
 * Mock Data Store: Provides realistic, physically-consistent meteorological demo data
 * for all components of the VARSHA-RA decision-support platform.
 * 
 * DISCLAIMER: All data provided here is synthetic / simulated demo data for
 * demonstration and evaluation purposes. Not an official weather warning.
 */

export const METADATA = {
  systemName: "ATMOS",
  tagline: "Adaptive Targeted Monsoon Optimization System",
  version: "v2.4-scientific-preview",
  forecastCycle: "2024-08-14 00:00 UTC",
  validityRange: "2024-08-14 to 2024-08-19",
  isDemo: true,
  disclaimer: "AI Decision-Support & Research Platform. Model outputs are post-processed approximations and do NOT constitute official weather warnings from national meteorological agencies.",
  nwpSource: "Global NWP (0.25° Resolution Ensemble Mean)",
  postProcessedResolution: "0.05° High-Resolution Topo-Refined Grid"
};

// 4 Primary Monsoon Regimes + Synoptic Descriptions
export const REGIMES = {
  ACTIVE: {
    id: "ACTIVE",
    name: "Active Monsoon",
    code: "REG-ACT",
    color: "#10b981",
    accentBg: "rgba(16, 185, 129, 0.15)",
    borderColor: "rgba(16, 185, 129, 0.4)",
    synopticSummary: "Large-scale vigorous monsoon activity with deep monsoon trough positioned south of normal, intense low-level cross-equatorial southwesterly jet (850 hPa wind > 25 knots), and widespread heavy convection over Central India and Western Ghats.",
    nwpErrorTendency: "Raw NWP often exhibits significant orographic underestimation along coastal ghats and spatial diffusion of convective rain cores.",
    expertFocus: "Sharpens heavy-rain gradients, applies terrain-aware orographic lifting adjustments, and corrects rain-shadow dry bias.",
    synopticIndicators: {
      troughLatitude: "21.5°N (South of normal position)",
      crossEquatorialWind: "28.4 knots at 850 hPa",
      precipitableWater: "62.4 mm (High atmospheric moisture)",
      olrAnomaly: "-38.2 W/m² (Enhanced deep convection)"
    }
  },
  BREAK: {
    id: "BREAK",
    name: "Break Monsoon",
    code: "REG-BRK",
    color: "#f59e0b",
    accentBg: "rgba(245, 158, 11, 0.15)",
    borderColor: "rgba(245, 158, 11, 0.4)",
    synopticSummary: "Monsoon trough shifts northwards close to Himalayan foothills. Marked suppression of rainfall across central, western, and peninsular India, while enhanced orographic precipitation occurs along the foothills of the Himalayas and northeast states.",
    nwpErrorTendency: "Raw NWP frequently suffers from 'drizzle bias' (predicting persistent light 2-10 mm rain where none occurs) and over-predicts peninsular convective initiation.",
    expertFocus: "Suppresses spurious false-alarm drizzle over central plains via hurdle rain-occurrence classifier, while adjusting foothill rainfall amounts.",
    synopticIndicators: {
      troughLatitude: "27.8°N (Foot of Himalayas)",
      crossEquatorialWind: "12.1 knots at 850 hPa (Weakened)",
      precipitableWater: "41.8 mm (Dry intrusion over central plains)",
      olrAnomaly: "+26.5 W/m² (Suppressed convection)"
    }
  },
  DEPRESSION: {
    id: "DEPRESSION",
    name: "Depression / Low-Pressure System",
    code: "REG-DEP",
    color: "#06b6d4",
    accentBg: "rgba(6, 182, 212, 0.15)",
    borderColor: "rgba(6, 182, 212, 0.4)",
    synopticSummary: "Organized cyclonic vortex (Monsoon Depression / Well-Marked Low) originating over the Bay of Bengal or Arabian Sea, moving west-northwestward along the monsoon trough, producing extreme rainfall along its southern and southwestern quadrants.",
    nwpErrorTendency: "NWP models often introduce track displacement errors (50-120 km) and miscalculate the location and intensity of the southwest-quadrant extreme rain band.",
    expertFocus: "Vorticity-guided dynamic spatial correction, structural realignment of heavy-rain bands, and extreme quantile probability calibration.",
    synopticIndicators: {
      troughLatitude: "20.2°N (Co-located with cyclonic vortex)",
      crossEquatorialWind: "34.5 knots in southern quadrant",
      precipitableWater: "68.7 mm (Intense tropical moisture plume)",
      olrAnomaly: "-54.1 W/m² (Severe organized mesoscale convective complexes)"
    }
  },
  TRANSITION: {
    id: "TRANSITION",
    name: "Transition / Ambiguous Regime",
    code: "REG-TRN",
    color: "#a855f7",
    accentBg: "rgba(168, 85, 247, 0.15)",
    borderColor: "rgba(168, 85, 247, 0.4)",
    synopticSummary: "Atmospheric state undergoing transition between active/break phases or multiple competing synoptic waves (e.g. Kelvin / Rossby wave interference). No single regime exhibits strong statistical dominance.",
    nwpErrorTendency: "High forecast variance and ensemble spread. Conventional single-bias models overfit or oscillate wildly between regime corrections.",
    expertFocus: "Soft uncertainty gating increases weighting of the Global Model baseline while smoothly blending specialist experts in proportion to regime probabilities.",
    synopticIndicators: {
      troughLatitude: "24.1°N (Oscillating / Diffuse)",
      crossEquatorialWind: "18.6 knots at 850 hPa",
      precipitableWater: "51.3 mm (Variable moisture gradients)",
      olrAnomaly: "-4.2 W/m² (Scattered, unorganized convection)"
    }
  }
};

// Current Active Forecast State (August Active-Depression Event Demo)
export const CURRENT_FORECAST_STATE = {
  leadTime: 24, // hours
  cycle: "2024-08-14 00:00 UTC",
  validFor: "2024-08-15 00:00 UTC",
  dominantRegime: "DEPRESSION",
  regimeProbabilities: {
    DEPRESSION: 0.68,
    ACTIVE: 0.22,
    TRANSITION: 0.07,
    BREAK: 0.03
  },
  entropyBits: 1.18, // H = -sum(p * log2(p)), max is 2.0 bits for 4 classes
  normalizedUncertainty: 0.59, // 1.18 / 2.0
  regimeConfidence: "High (68% Depression / 22% Active)",
  expertWeights: {
    DEPRESSION_EXPERT: 0.58,
    ACTIVE_EXPERT: 0.18,
    GLOBAL_BASELINE: 0.16,
    TRANSITION_EXPERT: 0.05,
    BREAK_EXPERT: 0.03
  },
  metrics: {
    rawNwpPeakRainfall: 114.5, // mm
    varshaRaPeakRainfall: 188.4, // mm (corrected for orographic & vortex banding)
    meanAbsoluteDelta: 24.3, // mm
    heavyRainThreshold: 50.0, // mm
    maxExceedanceProb: 0.89, // 89% probability of exceeding 50mm
    districtsUnderAlert: 14,
    totalAreaExceeding50mmKm2: 48500
  }
};

// Illustrative Scenarios for Regime Uncertainty Gating Demonstration
export const UNCERTAINTY_SCENARIOS = {
  LOW_UNCERTAINTY: {
    id: "low_uncertainty",
    name: "Low Uncertainty (Dominant Active Surge)",
    probabilities: { ACTIVE: 0.94, BREAK: 0.02, DEPRESSION: 0.03, TRANSITION: 0.01 },
    entropy: 0.38,
    normalizedU: 0.19,
    gatingWeights: {
      ACTIVE_EXPERT: 0.85,
      GLOBAL_BASELINE: 0.09,
      DEPRESSION_EXPERT: 0.03,
      BREAK_EXPERT: 0.02,
      TRANSITION_EXPERT: 0.01
    },
    description: "When one regime overwhelmingly dominates (Active 94%), the specialized Active Expert receives dominant weight (85%). The global fallback is minimized (9%), maximizing specialized orographic correction."
  },
  MODERATE_UNCERTAINTY: {
    id: "moderate_uncertainty",
    name: "Moderate Uncertainty (Current Depression Demo)",
    probabilities: { DEPRESSION: 0.68, ACTIVE: 0.22, TRANSITION: 0.07, BREAK: 0.03 },
    entropy: 1.18,
    normalizedU: 0.59,
    gatingWeights: {
      DEPRESSION_EXPERT: 0.58,
      ACTIVE_EXPERT: 0.18,
      GLOBAL_BASELINE: 0.16,
      TRANSITION_EXPERT: 0.05,
      BREAK_EXPERT: 0.03
    },
    description: "Depression is the leading driver (68%) with concurrent strong monsoon cross-flow (22% Active). Both specialists contribute, backed by 16% global baseline regularization."
  },
  HIGH_UNCERTAINTY: {
    id: "high_uncertainty",
    name: "High Uncertainty (Ambiguous Monsoon Phase)",
    probabilities: { ACTIVE: 0.35, BREAK: 0.15, DEPRESSION: 0.20, TRANSITION: 0.30 },
    entropy: 1.88,
    normalizedU: 0.94,
    gatingWeights: {
      GLOBAL_BASELINE: 0.42,
      ACTIVE_EXPERT: 0.24,
      TRANSITION_EXPERT: 0.18,
      DEPRESSION_EXPERT: 0.11,
      BREAK_EXPERT: 0.05
    },
    description: "When multiple regimes are plausible, ATMOS avoids hard-switching. The Global Expert weight surges to 42%, while specialist experts are softly blended in proportion to their plausibility."
  }
};

// High-resolution Grid Points across Key Indian Geographic Zones
// Demonstrating terrain, elevation, coastal distance, NWP vs VARSHA-RA corrections
export const GRID_CELLS_DATA = [
  // Western Ghats / Konkan (Orographic Enhancement)
  {
    id: "GRID-WG-01",
    name: "Mahabaleshwar Ridge",
    region: "Western Ghats",
    district: "Satara",
    state: "Maharashtra",
    lat: 17.92,
    lon: 73.66,
    elevationM: 1353,
    slopeDeg: 18.4,
    distanceCoastKm: 64,
    rawNwpRainMm: 98.4,
    varshaRaRainMm: 218.6,
    correctionDeltaMm: +120.2,
    probExceed25: 0.99,
    probExceed50: 0.95,
    probExceed100: 0.84,
    probExceed150: 0.62,
    dominantRegime: "ACTIVE",
    uncertaintyH: 0.42,
    expertContribution: { Active: 0.72, Depression: 0.14, Global: 0.12, Break: 0.02 },
    terrainFactor: "Extreme Windward Orographic Condensation (+85% enhancement)",
    status: "Very Heavy Rain"
  },
  {
    id: "GRID-WG-02",
    name: "Ratnagiri Coastal Plain",
    region: "Western Ghats",
    district: "Ratnagiri",
    state: "Maharashtra",
    lat: 16.99,
    lon: 73.31,
    elevationM: 42,
    slopeDeg: 3.1,
    distanceCoastKm: 4,
    rawNwpRainMm: 72.1,
    varshaRaRainMm: 128.4,
    correctionDeltaMm: +56.3,
    probExceed25: 0.97,
    probExceed50: 0.88,
    probExceed100: 0.58,
    probExceed150: 0.28,
    dominantRegime: "ACTIVE",
    uncertaintyH: 0.48,
    expertContribution: { Active: 0.68, Depression: 0.16, Global: 0.14, Break: 0.02 },
    terrainFactor: "Coastal Moisture Boundary Convergence",
    status: "Heavy Rain"
  },
  {
    id: "GRID-WG-03",
    name: "Pune Rain-Shadow Plateau",
    region: "Western Ghats Leeward",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.52,
    lon: 73.85,
    elevationM: 560,
    slopeDeg: 4.2,
    distanceCoastKm: 120,
    rawNwpRainMm: 38.5,
    varshaRaRainMm: 21.2,
    correctionDeltaMm: -17.3,
    probExceed25: 0.41,
    probExceed50: 0.12,
    probExceed100: 0.02,
    probExceed150: 0.00,
    dominantRegime: "ACTIVE",
    uncertaintyH: 0.52,
    expertContribution: { Active: 0.64, Depression: 0.18, Global: 0.15, Break: 0.03 },
    terrainFactor: "Leeward Subsidence / Orographic Rain Shadow",
    status: "Moderate Rain"
  },
  {
    id: "GRID-WG-04",
    name: "Mumbai Metropolitan Coast",
    region: "Western Ghats",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    lat: 19.07,
    lon: 72.87,
    elevationM: 14,
    slopeDeg: 1.2,
    distanceCoastKm: 2,
    rawNwpRainMm: 84.6,
    varshaRaRainMm: 145.2,
    correctionDeltaMm: +60.6,
    probExceed25: 0.98,
    probExceed50: 0.91,
    probExceed100: 0.64,
    probExceed150: 0.36,
    dominantRegime: "DEPRESSION",
    uncertaintyH: 0.55,
    expertContribution: { Depression: 0.52, Active: 0.28, Global: 0.16, Break: 0.04 },
    terrainFactor: "Offshore Trough & Urban Boundary Convergence",
    status: "Very Heavy Rain"
  },
  {
    id: "GRID-WG-05",
    name: "Wayanad Highland",
    region: "Western Ghats",
    district: "Wayanad",
    state: "Kerala",
    lat: 11.68,
    lon: 76.13,
    elevationM: 980,
    slopeDeg: 16.5,
    distanceCoastKm: 72,
    rawNwpRainMm: 68.2,
    varshaRaRainMm: 162.8,
    correctionDeltaMm: +94.6,
    probExceed25: 0.98,
    probExceed50: 0.92,
    probExceed100: 0.76,
    probExceed150: 0.48,
    dominantRegime: "ACTIVE",
    uncertaintyH: 0.45,
    expertContribution: { Active: 0.74, Depression: 0.12, Global: 0.11, Break: 0.03 },
    terrainFactor: "Funneling Gap & Steep Escarpment Orographic Lift",
    status: "Very Heavy Rain"
  },

  // Central India / Vidarbha (Depression Vortex Track)
  {
    id: "GRID-CI-01",
    name: "Nagpur Core Vortex Track",
    region: "Central India",
    district: "Nagpur",
    state: "Maharashtra",
    lat: 21.14,
    lon: 79.08,
    elevationM: 310,
    slopeDeg: 1.8,
    distanceCoastKm: 580,
    rawNwpRainMm: 74.3,
    varshaRaRainMm: 132.8,
    correctionDeltaMm: +58.5,
    probExceed25: 0.96,
    probExceed50: 0.89,
    probExceed100: 0.62,
    probExceed150: 0.31,
    dominantRegime: "DEPRESSION",
    uncertaintyH: 0.49,
    expertContribution: { Depression: 0.66, Active: 0.16, Global: 0.14, Break: 0.04 },
    terrainFactor: "Cyclonic Vorticity Maxima & Low-Level Jet Shearing",
    status: "Heavy Rain"
  },
  {
    id: "GRID-CI-02",
    name: "Chandrapur River Basin",
    region: "Central India",
    district: "Chandrapur",
    state: "Maharashtra",
    lat: 19.96,
    lon: 79.29,
    elevationM: 192,
    slopeDeg: 1.5,
    distanceCoastKm: 420,
    rawNwpRainMm: 81.0,
    varshaRaRainMm: 154.2,
    correctionDeltaMm: +73.2,
    probExceed25: 0.98,
    probExceed50: 0.92,
    probExceed100: 0.71,
    probExceed150: 0.42,
    dominantRegime: "DEPRESSION",
    uncertaintyH: 0.47,
    expertContribution: { Depression: 0.70, Active: 0.14, Global: 0.12, Break: 0.04 },
    terrainFactor: "Depression Southwest Quadrant Rainband",
    status: "Very Heavy Rain"
  },
  {
    id: "GRID-CI-03",
    name: "Jabalpur Narmada Valley",
    region: "Central India",
    district: "Jabalpur",
    state: "Madhya Pradesh",
    lat: 23.18,
    lon: 79.98,
    elevationM: 411,
    slopeDeg: 2.8,
    distanceCoastKm: 610,
    rawNwpRainMm: 62.4,
    varshaRaRainMm: 98.7,
    correctionDeltaMm: +36.3,
    probExceed25: 0.94,
    probExceed50: 0.78,
    probExceed100: 0.41,
    probExceed150: 0.15,
    dominantRegime: "DEPRESSION",
    uncertaintyH: 0.54,
    expertContribution: { Depression: 0.62, Active: 0.18, Global: 0.16, Break: 0.04 },
    terrainFactor: "Valley Moisture Channeling along Narmada",
    status: "Moderate-Heavy"
  },
  {
    id: "GRID-CI-04",
    name: "Raipur Mahanadi Basin",
    region: "Central India",
    district: "Raipur",
    state: "Chhattisgarh",
    lat: 21.25,
    lon: 81.62,
    elevationM: 298,
    slopeDeg: 1.4,
    distanceCoastKm: 270,
    rawNwpRainMm: 69.8,
    varshaRaRainMm: 118.5,
    correctionDeltaMm: +48.7,
    probExceed25: 0.95,
    probExceed50: 0.85,
    probExceed100: 0.53,
    probExceed150: 0.22,
    dominantRegime: "DEPRESSION",
    uncertaintyH: 0.51,
    expertContribution: { Depression: 0.64, Active: 0.18, Global: 0.14, Break: 0.04 },
    terrainFactor: "Inflow Convergence Corridor from Bay of Bengal",
    status: "Heavy Rain"
  },

  // East Coast & Bay of Bengal Landfall Zone
  {
    id: "GRID-EC-01",
    name: "Puri Coastal Track",
    region: "East Coast / BoB",
    district: "Puri",
    state: "Odisha",
    lat: 19.81,
    lon: 85.83,
    elevationM: 10,
    slopeDeg: 0.8,
    distanceCoastKm: 1,
    rawNwpRainMm: 102.3,
    varshaRaRainMm: 174.6,
    correctionDeltaMm: +72.3,
    probExceed25: 0.99,
    probExceed50: 0.94,
    probExceed100: 0.78,
    probExceed150: 0.54,
    dominantRegime: "DEPRESSION",
    uncertaintyH: 0.44,
    expertContribution: { Depression: 0.72, Active: 0.12, Global: 0.12, Break: 0.04 },
    terrainFactor: "Direct Cyclonic Landfall Moisture Surge",
    status: "Very Heavy Rain"
  },
  {
    id: "GRID-EC-02",
    name: "Cuttack Delta Floodplain",
    region: "East Coast / BoB",
    district: "Cuttack",
    state: "Odisha",
    lat: 20.46,
    lon: 85.88,
    elevationM: 36,
    slopeDeg: 1.1,
    distanceCoastKm: 60,
    rawNwpRainMm: 88.5,
    varshaRaRainMm: 149.8,
    correctionDeltaMm: +61.3,
    probExceed25: 0.97,
    probExceed50: 0.91,
    probExceed100: 0.68,
    probExceed150: 0.39,
    dominantRegime: "DEPRESSION",
    uncertaintyH: 0.48,
    expertContribution: { Depression: 0.68, Active: 0.15, Global: 0.13, Break: 0.04 },
    terrainFactor: "Mahanadi Delta Convergent Inflow",
    status: "Very Heavy Rain"
  },

  // Northwest India (Suppressed / Low NWP Bias)
  {
    id: "GRID-NW-01",
    name: "Jaipur Arid Boundary",
    region: "Northwest India",
    district: "Jaipur",
    state: "Rajasthan",
    lat: 26.91,
    lon: 75.78,
    elevationM: 431,
    slopeDeg: 2.1,
    distanceCoastKm: 640,
    rawNwpRainMm: 14.8,
    varshaRaRainMm: 3.4,
    correctionDeltaMm: -11.4,
    probExceed25: 0.06,
    probExceed50: 0.01,
    probExceed100: 0.00,
    probExceed150: 0.00,
    dominantRegime: "BREAK",
    uncertaintyH: 0.58,
    expertContribution: { Break: 0.45, Global: 0.32, Active: 0.12, Depression: 0.11 },
    terrainFactor: "Aravalli Rain-Shadow & Dry Air Intrusion (Drizzle Suppression)",
    status: "Light / Isolated"
  },
  {
    id: "GRID-NW-02",
    name: "Jodhpur Desert Fringe",
    region: "Northwest India",
    district: "Jodhpur",
    state: "Rajasthan",
    lat: 26.23,
    lon: 73.02,
    elevationM: 231,
    slopeDeg: 1.0,
    distanceCoastKm: 480,
    rawNwpRainMm: 8.2,
    varshaRaRainMm: 0.6,
    correctionDeltaMm: -7.6,
    probExceed25: 0.02,
    probExceed50: 0.00,
    probExceed100: 0.00,
    probExceed150: 0.00,
    dominantRegime: "BREAK",
    uncertaintyH: 0.46,
    expertContribution: { Break: 0.58, Global: 0.28, Active: 0.08, Depression: 0.06 },
    terrainFactor: "Deep Thermal Low Subsidence (Zero-Hurdle Filter Applied)",
    status: "Dry / Trace"
  },

  // Foothills & Northeast (Transition & Break Sensitivity)
  {
    id: "GRID-NE-01",
    name: "Cherrapunji Plateau Escarpment",
    region: "Northeast India",
    district: "East Khasi Hills",
    state: "Meghalaya",
    lat: 25.29,
    lon: 91.73,
    elevationM: 1430,
    slopeDeg: 24.2,
    distanceCoastKm: 280,
    rawNwpRainMm: 112.0,
    varshaRaRainMm: 248.5,
    correctionDeltaMm: +136.5,
    probExceed25: 0.99,
    probExceed50: 0.98,
    probExceed100: 0.91,
    probExceed150: 0.74,
    dominantRegime: "ACTIVE",
    uncertaintyH: 0.41,
    expertContribution: { Active: 0.76, Global: 0.12, Depression: 0.08, Break: 0.04 },
    terrainFactor: "Extreme Funneling Valley & Steep Khasi Hills Uplift",
    status: "Extremely Heavy"
  }
];

// District-Level Aggregated Intelligence (Area-Weighted Aggregation)
export const DISTRICTS_DATA = [
  {
    id: "DIST-01",
    name: "Ratnagiri",
    state: "Maharashtra",
    zone: "West Coast / Western Ghats",
    areaKm2: 8208,
    gridCellCount: 16,
    areaWeightedMeanMm: 142.8,
    nwpRawMeanMm: 79.4,
    biasCorrectionMm: +63.4,
    maxPointRainMm: 226.4,
    p90RainMm: 198.2,
    p95RainMm: 215.0,
    fractionAreaOver50mm: 0.94, // 94% of district area > 50 mm
    fractionAreaOver100mm: 0.68,
    heavyRainProbability: 0.93,
    dominantRegime: "ACTIVE",
    regimeConfidence: "84%",
    riskLevel: "High Decision Support Advisory",
    riskColor: "#ef4444",
    synopticFactors: "Intense orographic lifting along Western Ghats seaward scarp with strong westerly low-level jet.",
    actionChecklist: [
      "Monitor coastal catchment runoff in Shastri & Kajali basins",
      "High probability of localized ghat-section landslides above 100mm/24h",
      "Model indicates 63 mm positive correction over raw NWP"
    ]
  },
  {
    id: "DIST-02",
    name: "Satara",
    state: "Maharashtra",
    zone: "Western Ghats / Rain Shadow Transition",
    areaKm2: 10480,
    gridCellCount: 21,
    areaWeightedMeanMm: 86.4,
    nwpRawMeanMm: 52.1,
    biasCorrectionMm: +34.3,
    maxPointRainMm: 218.6, // Mahabaleshwar
    p90RainMm: 164.0,
    p95RainMm: 195.4,
    fractionAreaOver50mm: 0.58,
    fractionAreaOver100mm: 0.32,
    heavyRainProbability: 0.86,
    dominantRegime: "ACTIVE",
    regimeConfidence: "78%",
    riskLevel: "High Decision Support Advisory",
    riskColor: "#ef4444",
    synopticFactors: "Severe west-to-east spatial gradient: western crest experiences extreme rainfall while eastern talukas remain in rain shadow.",
    actionChecklist: [
      "Extreme gradient: Koyna catchment requires separate monitoring from eastern talukas",
      "Area-weighted aggregation isolates 32% high-risk western terrain",
      "Elevated orographic weight active"
    ]
  },
  {
    id: "DIST-03",
    name: "Mumbai Suburban",
    state: "Maharashtra",
    zone: "West Coast / Konkan",
    areaKm2: 446,
    gridCellCount: 4,
    areaWeightedMeanMm: 138.6,
    nwpRawMeanMm: 81.2,
    biasCorrectionMm: +57.4,
    maxPointRainMm: 168.0,
    p90RainMm: 154.2,
    p95RainMm: 162.8,
    fractionAreaOver50mm: 0.98,
    fractionAreaOver100mm: 0.65,
    heavyRainProbability: 0.91,
    dominantRegime: "DEPRESSION",
    regimeConfidence: "72%",
    riskLevel: "High Decision Support Advisory",
    riskColor: "#ef4444",
    synopticFactors: "Offshore trough interaction and urban boundary layer thermal roughness convergence.",
    actionChecklist: [
      "98% of suburban area exceeds 50mm threshold",
      "Coincident high-tide alert window enhances drainage vulnerability",
      "Raw NWP 81mm under-predicted convective banding"
    ]
  },
  {
    id: "DIST-04",
    name: "Wayanad",
    state: "Kerala",
    zone: "Western Ghats Highland",
    areaKm2: 2132,
    gridCellCount: 6,
    areaWeightedMeanMm: 154.2,
    nwpRawMeanMm: 72.8,
    biasCorrectionMm: +81.4,
    maxPointRainMm: 212.0,
    p90RainMm: 188.5,
    p95RainMm: 204.0,
    fractionAreaOver50mm: 0.96,
    fractionAreaOver100mm: 0.74,
    heavyRainProbability: 0.94,
    dominantRegime: "ACTIVE",
    regimeConfidence: "86%",
    riskLevel: "Critical Decision Support Advisory",
    riskColor: "#ec4899",
    synopticFactors: "Palakkad gap flank convergence and steep high-elevation orographic forcing (>1000m).",
    actionChecklist: [
      "Landslide susceptibility threshold exceeded across 74% of district area",
      "Kabini river headwater tributary inflows surging",
      "81.4 mm AI orographic correction applied over NWP"
    ]
  },
  {
    id: "DIST-05",
    name: "Nagpur",
    state: "Maharashtra",
    zone: "Central India / Vidarbha",
    areaKm2: 9892,
    gridCellCount: 20,
    areaWeightedMeanMm: 124.5,
    nwpRawMeanMm: 71.0,
    biasCorrectionMm: +53.5,
    maxPointRainMm: 172.0,
    p90RainMm: 151.2,
    p95RainMm: 164.5,
    fractionAreaOver50mm: 0.88,
    fractionAreaOver100mm: 0.52,
    heavyRainProbability: 0.88,
    dominantRegime: "DEPRESSION",
    regimeConfidence: "81%",
    riskLevel: "High Decision Support Advisory",
    riskColor: "#ef4444",
    synopticFactors: "Depression core passing within 80 km; strong cyclonic vorticity and moisture flux convergence.",
    actionChecklist: [
      "Kanhan and Nag river basins under elevated flood watch",
      "Depression Specialist model contributing 66% weight",
      "Vorticity displacement correction realigned rainband southward"
    ]
  },
  {
    id: "DIST-06",
    name: "Chandrapur",
    state: "Maharashtra",
    zone: "Central India / Vidarbha",
    areaKm2: 11443,
    gridCellCount: 23,
    areaWeightedMeanMm: 141.0,
    nwpRawMeanMm: 78.4,
    biasCorrectionMm: +62.6,
    maxPointRainMm: 185.2,
    p90RainMm: 168.0,
    p95RainMm: 176.4,
    fractionAreaOver50mm: 0.92,
    fractionAreaOver100mm: 0.61,
    heavyRainProbability: 0.92,
    dominantRegime: "DEPRESSION",
    regimeConfidence: "83%",
    riskLevel: "High Decision Support Advisory",
    riskColor: "#ef4444",
    synopticFactors: "Southwest quadrant of monsoon depression with maximum convergence of Arabian Sea and Bay of Bengal streams.",
    actionChecklist: [
      "Wardha and Wainganga rivers near bankfull stage",
      "High exceedance risk over coal-mining lowland corridors",
      "NWP 78mm vs Corrected 141mm"
    ]
  },
  {
    id: "DIST-07",
    name: "Puri",
    state: "Odisha",
    zone: "East Coast / BoB Landfall",
    areaKm2: 3479,
    gridCellCount: 8,
    areaWeightedMeanMm: 162.4,
    nwpRawMeanMm: 98.2,
    biasCorrectionMm: +64.2,
    maxPointRainMm: 205.0,
    p90RainMm: 186.2,
    p95RainMm: 198.0,
    fractionAreaOver50mm: 0.97,
    fractionAreaOver100mm: 0.72,
    heavyRainProbability: 0.95,
    dominantRegime: "DEPRESSION",
    regimeConfidence: "88%",
    riskLevel: "Critical Decision Support Advisory",
    riskColor: "#ec4899",
    synopticFactors: "Monsoon Depression landfall core with gale-force easterly onshore winds and precipitable water > 68 mm.",
    actionChecklist: [
      "Chilika lagoon and coastal delta drainages severely congested",
      "Coastal storm-surge interaction with heavy precipitation runoff",
      "Depression Specialist model peak activation (72%)"
    ]
  },
  {
    id: "DIST-08",
    name: "Cuttack",
    state: "Odisha",
    zone: "East Coast / BoB Delta",
    areaKm2: 3932,
    gridCellCount: 9,
    areaWeightedMeanMm: 139.8,
    nwpRawMeanMm: 85.0,
    biasCorrectionMm: +54.8,
    maxPointRainMm: 178.4,
    p90RainMm: 161.0,
    p95RainMm: 172.5,
    fractionAreaOver50mm: 0.91,
    fractionAreaOver100mm: 0.58,
    heavyRainProbability: 0.89,
    dominantRegime: "DEPRESSION",
    regimeConfidence: "85%",
    riskLevel: "High Decision Support Advisory",
    riskColor: "#ef4444",
    synopticFactors: "Mahanadi-Kathajodi bifurcation basin receiving depression spiral inflow.",
    actionChecklist: [
      "Hirakud dam downstream inflow calculation refinement",
      "Urban lowlands in Cuttack city vulnerable to waterlogging",
      "Spatial consistency filter preserved localized convective cores"
    ]
  },
  {
    id: "DIST-09",
    name: "Pune",
    state: "Maharashtra",
    zone: "Western Plateau Rain Shadow",
    areaKm2: 15643,
    gridCellCount: 30,
    areaWeightedMeanMm: 31.4,
    nwpRawMeanMm: 46.2,
    biasCorrectionMm: -14.8,
    maxPointRainMm: 142.0, // Lonavala / Ghat rim
    p90RainMm: 68.5,
    p95RainMm: 89.2,
    fractionAreaOver50mm: 0.18,
    fractionAreaOver100mm: 0.05,
    heavyRainProbability: 0.28,
    dominantRegime: "ACTIVE",
    regimeConfidence: "79%",
    riskLevel: "Moderate Advisory",
    riskColor: "#f59e0b",
    synopticFactors: "Sharp topographic demarcation: high rainfall along western crest (Lonavala/Mulshi), dropping to dry plateau east of city.",
    actionChecklist: [
      "Western ghat dams (Khadakwasla, Pawana) filling rapidly",
      "Eastern talukas (Daund, Baramati) receive less than 15mm",
      "NWP over-predicted eastern plateau rainfall by 14.8mm"
    ]
  },
  {
    id: "DIST-10",
    name: "Jaipur",
    state: "Rajasthan",
    zone: "Northwest India / Semi-Arid",
    areaKm2: 11152,
    gridCellCount: 22,
    areaWeightedMeanMm: 4.2,
    nwpRawMeanMm: 18.5,
    biasCorrectionMm: -14.3,
    maxPointRainMm: 12.0,
    p90RainMm: 7.8,
    p95RainMm: 9.5,
    fractionAreaOver50mm: 0.00,
    fractionAreaOver100mm: 0.00,
    heavyRainProbability: 0.02,
    dominantRegime: "BREAK",
    regimeConfidence: "84%",
    riskLevel: "Low / Normal",
    riskColor: "#10b981",
    synopticFactors: "Suppressed monsoon conditions, dry northwesterly mid-tropospheric intrusion, high convective inhibition (CIN).",
    actionChecklist: [
      "ATMOS successfully suppressed NWP spurious drizzle (18.5 mm -> 4.2 mm)",
      "Break Expert hurdle model classified zero/trace occurrence with 94% confidence",
      "No heavy rainfall threats detected"
    ]
  },
  {
    id: "DIST-11",
    name: "Jodhpur",
    state: "Rajasthan",
    zone: "Northwest India / Arid Desert",
    areaKm2: 22850,
    gridCellCount: 42,
    areaWeightedMeanMm: 1.1,
    nwpRawMeanMm: 9.4,
    biasCorrectionMm: -8.3,
    maxPointRainMm: 4.8,
    p90RainMm: 2.4,
    p95RainMm: 3.1,
    fractionAreaOver50mm: 0.00,
    fractionAreaOver100mm: 0.00,
    heavyRainProbability: 0.00,
    dominantRegime: "BREAK",
    regimeConfidence: "91%",
    riskLevel: "Low / Normal",
    riskColor: "#10b981",
    synopticFactors: "Strong thermal low inversion capping deep convection; dry air boundary.",
    actionChecklist: [
      "Zero-hurdle filter prevented false alarm in water management plans",
      "NWP false positive bias of ~9 mm eliminated",
      "Stable dry regime verified"
    ]
  },
  {
    id: "DIST-12",
    name: "East Khasi Hills",
    state: "Meghalaya",
    zone: "Northeast / Himalayan Foothills",
    areaKm2: 2748,
    gridCellCount: 7,
    areaWeightedMeanMm: 215.0,
    nwpRawMeanMm: 118.0,
    biasCorrectionMm: +97.0,
    maxPointRainMm: 284.0,
    p90RainMm: 254.0,
    p95RainMm: 272.0,
    fractionAreaOver50mm: 1.00, // 100% of district
    fractionAreaOver100mm: 0.88,
    heavyRainProbability: 0.99,
    dominantRegime: "ACTIVE",
    regimeConfidence: "89%",
    riskLevel: "Critical Decision Support Advisory",
    riskColor: "#ec4899",
    synopticFactors: "Deep southerly moisture inflow into funnel-shaped canyon topography, extreme continuous orographic cloud formation.",
    actionChecklist: [
      "Flash flood and road blockage threat on Shillong-Dawki axis",
      "NWP severely underestimated orographic funneling (+97 mm delta)",
      "Calibrated exceedance probability for 100mm is 91%"
    ]
  }
];

// Verification Metrics: Raw NWP vs Global Conventional Correction vs ATMOS
export const VERIFICATION_DATA = {
  overall: {
    continuous: [
      { metric: "RMSE (Root Mean Square Error)", unit: "mm/day", rawNwp: 28.4, globalCorrection: 23.1, varshaRa: 16.2, better: "lower", improvement: "43.0% vs NWP" },
      { metric: "MAE (Mean Absolute Error)", unit: "mm/day", rawNwp: 19.8, globalCorrection: 16.4, varshaRa: 10.9, better: "lower", improvement: "44.9% vs NWP" },
      { metric: "Mean Bias", unit: "mm/day", rawNwp: -6.8, globalCorrection: -2.4, varshaRa: -0.3, better: "nearZero", improvement: "95.6% bias reduction" }
    ],
    categorical50mm: [
      { metric: "POD (Probability of Detection)", unit: "ratio", rawNwp: 0.54, globalCorrection: 0.63, varshaRa: 0.84, better: "higher", improvement: "+30.0% capture" },
      { metric: "FAR (False Alarm Ratio)", unit: "ratio", rawNwp: 0.42, globalCorrection: 0.36, varshaRa: 0.18, better: "lower", improvement: "57.1% reduction" },
      { metric: "CSI (Critical Success Index)", unit: "ratio", rawNwp: 0.39, globalCorrection: 0.47, varshaRa: 0.71, better: "higher", improvement: "+82.1% score" },
      { metric: "ETS (Equitable Threat Score)", unit: "ratio", rawNwp: 0.28, globalCorrection: 0.36, varshaRa: 0.58, better: "higher", improvement: "+107.1% skill" },
      { metric: "Frequency Bias (FBIAS)", unit: "ratio", rawNwp: 0.72, globalCorrection: 0.89, varshaRa: 1.02, better: "nearOne", improvement: "Near-ideal calibration" }
    ],
    spatialProbabilistic: [
      { metric: "FSS (Fractions Skill Score, 25km scale)", unit: "score", rawNwp: 0.48, globalCorrection: 0.58, varshaRa: 0.79, better: "higher", improvement: "+64.6% spatial skill" },
      { metric: "Brier Score (P > 50mm)", unit: "score", rawNwp: 0.24, globalCorrection: 0.19, varshaRa: 0.11, better: "lower", improvement: "54.2% error reduction" },
      { metric: "BSS (Brier Skill Score vs Climatology)", unit: "score", rawNwp: 0.22, globalCorrection: 0.38, varshaRa: 0.64, better: "higher", improvement: "+190.9% skill gain" }
    ]
  },
  regimeWiseCSI: {
    labels: ["> 10 mm", "> 25 mm", "> 50 mm", "> 75 mm", "> 100 mm"],
    active: {
      rawNwp: [0.68, 0.54, 0.41, 0.28, 0.16],
      globalCorr: [0.72, 0.61, 0.49, 0.36, 0.24],
      varshaRa: [0.86, 0.79, 0.72, 0.61, 0.48]
    },
    depression: {
      rawNwp: [0.71, 0.58, 0.44, 0.31, 0.19],
      globalCorr: [0.75, 0.65, 0.53, 0.39, 0.27],
      varshaRa: [0.89, 0.83, 0.76, 0.68, 0.54]
    },
    break: {
      rawNwp: [0.42, 0.28, 0.18, 0.10, 0.04],
      globalCorr: [0.55, 0.41, 0.29, 0.18, 0.08],
      varshaRa: [0.78, 0.69, 0.58, 0.46, 0.32]
    },
    transition: {
      rawNwp: [0.52, 0.40, 0.29, 0.19, 0.09],
      globalCorr: [0.59, 0.48, 0.37, 0.26, 0.15],
      varshaRa: [0.74, 0.66, 0.56, 0.44, 0.31]
    }
  },
  leadTimeRMSE: {
    leadTimes: ["+24h (Day 1)", "+48h (Day 2)", "+72h (Day 3)", "+96h (Day 4)", "+120h (Day 5)"],
    rawNwp: [26.2, 29.8, 34.1, 38.6, 43.5],
    globalCorrection: [21.5, 24.6, 28.9, 33.2, 38.0],
    varshaRa: [15.1, 17.8, 21.6, 26.1, 31.4]
  },
  reliabilityCurve: {
    forecastBins: [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95],
    perfectReliability: [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95],
    rawNwp: [0.02, 0.06, 0.12, 0.21, 0.31, 0.41, 0.52, 0.61, 0.70, 0.78], // Under-confident for extremes
    varshaRaCalibrated: [0.06, 0.16, 0.24, 0.36, 0.44, 0.56, 0.64, 0.76, 0.84, 0.93]
  }
};

// Explainability: SHAP Feature Importance and Feature Contributions
export const EXPLAINABILITY_DATA = {
  globalImportance: [
    { feature: "NWP Rainfall (Raw Ensemble Mean)", importance: 0.32, category: "NWP Predictor", description: "Base dynamic signal from physical numerical model" },
    { feature: "Regime Probability P(Depression)", importance: 0.18, category: "Regime Intelligence", description: "Activates depression-specialized vorticity and vortex rainband weighting" },
    { feature: "850 hPa Wind Speed & Anomaly", importance: 0.14, category: "Atmospheric Dynamics", description: "Low-level monsoon jet strength governing moisture flux" },
    { feature: "Moisture Flux Convergence (MFC)", importance: 0.11, category: "Atmospheric Dynamics", description: "Dynamic convergence of moisture feeding convective complexes" },
    { feature: "Terrain Elevation & Slope Aspect", importance: 0.09, category: "Geospatial Intelligence", description: "Physical orographic lifting vs leeward rain shadow descent" },
    { feature: "Mean Sea Level Pressure (MSLP) Gradient", importance: 0.06, category: "Atmospheric Dynamics", description: "Monsoon trough position and cross-peninsular pressure differential" },
    { feature: "Distance to Coastline", importance: 0.04, category: "Geospatial Intelligence", description: "Maritime moisture reservoir proxy and coastal convergence boundary" },
    { feature: "700 hPa Relative Vorticity", importance: 0.03, category: "Atmospheric Dynamics", description: "Cyclonic shear and mid-level vortex development" },
    { feature: "Regime Uncertainty (Entropy H)", importance: 0.03, category: "Uncertainty Indicator", description: "Controls blending ratio between specialist experts and global model" }
  ],
  waterfallPointExample: {
    location: "Mahabaleshwar Ghat Grid (Western Ghats)",
    baseValueMm: 98.4, // Raw NWP
    finalCorrectedMm: 218.6, // Final VARSHA-RA
    contributions: [
      { name: "Raw NWP Starting Point", deltaMm: 98.4, type: "base" },
      { name: "Steep Terrain Slope Aspect (18.4°)", deltaMm: +52.1, type: "positive" },
      { name: "High Elevation (1353m)", deltaMm: +34.8, type: "positive" },
      { name: "Active Regime Specialist Contribution", deltaMm: +28.5, type: "positive" },
      { name: "Strong 850 hPa Jet (28.4 kt)", deltaMm: +18.2, type: "positive" },
      { name: "Moisture Flux Convergence", deltaMm: +12.6, type: "positive" },
      { name: "Global Model Regularization", deltaMm: -14.2, type: "negative" },
      { name: "Spatial Consistency Limiter", deltaMm: -11.8, type: "negative" }
    ],
    disclaimer: "Feature contribution values represent learned statistical model associations and attribution within the tree ensemble, not direct causal physical forces."
  }
};

// 16 Pipeline Stages with Detailed Technical Cards
export const PIPELINE_STAGES = [
  {
    id: 1,
    title: "Data Ingestion",
    tag: "INGEST",
    icon: "database",
    summary: "Ingests operational raw NWP ensemble grids, atmospheric analysis fields, and geospatial datasets.",
    enters: "Multi-model NWP rainfall forecasts (GFS/ECMWF/NCMRWF), ERA5/NCEP reanalysis, DEM, coastline vectors.",
    whatHappens: "Automated ingestion pipeline validates incoming NetCDF4/GRIB2 headers, checks temporal timestamps, and flags corrupted or missing spatial grids.",
    comesOut: "Standardized raw meteorological datasets in uniform coordinate reference system (EPSG:4326)."
  },
  {
    id: 2,
    title: "Quality Control & Grid Alignment",
    tag: "QC & ALIGN",
    icon: "grid",
    summary: "Cleans anomalous spikes, enforces physical boundaries, and aligns disparate resolutions.",
    enters: "Raw heterogeneous NWP grids (0.25° to 0.125°) and high-resolution DEM/land-sea masks.",
    whatHappens: "Performs range verification (e.g. eliminating negative precipitation artifacts, checking wind vector integrity) and performs conservative bilinear/bicubic grid alignment to a standardized reference grid.",
    comesOut: "Quality-checked, aligned multi-variable tensor on standardized 0.10° operational working grid."
  },
  {
    id: 3,
    title: "Feature Engineering",
    tag: "FEATURES",
    icon: "sliders",
    summary: "Constructs physically-informed meteorological indices and geospatial descriptors.",
    enters: "Temperature, humidity, U/V wind components at 850/700/500/200 hPa, MSLP, geopotential heights, DEM.",
    whatHappens: "Calculates derived atmospheric dynamics: Moisture Flux Convergence (MFC = -∇·(qV)), 850 hPa relative vorticity (ζ = ∂v/∂x - ∂u/∂y), precipitable water, monsoon trough axis latitude, terrain slope aspect, and coastal distance.",
    comesOut: "Comprehensive feature tensor containing 24 engineered dynamic, thermodynamic, and geospatial predictors."
  },
  {
    id: 4,
    title: "Monsoon Regime Classifier",
    tag: "REGIME-AI",
    icon: "compass",
    summary: "Identifies prevailing synoptic state: Active, Break, Depression/Low, or Transition.",
    enters: "Regional synoptic features: trough latitude, wind anomalies, OLR anomalies, vorticity, spatial pressure gradients.",
    whatHappens: "Calibrated ensemble classifier (LightGBM + deep MLP) evaluates multi-scale circulation patterns to determine the likelihood of each discrete monsoon state.",
    comesOut: "Categorical regime prediction with full Softmax probability distribution over the 4 canonical regimes."
  },
  {
    id: 5,
    title: "Regime Probability & Confidence",
    tag: "PROBABILITY",
    icon: "bar-chart-2",
    summary: "Quantifies synoptic state probabilities and computes entropy-based uncertainty.",
    enters: "Raw Softmax probability vector [P(Active), P(Break), P(Depression), P(Transition)].",
    whatHappens: "Computes Shannon entropy H(p) = -∑ p_i log2(p_i) and derives normalized uncertainty index U = H(p) / log2(K). Assesses confidence margins and flags multimodal/ambiguous states.",
    comesOut: "Calibrated probability vector, confidence score, and normalized uncertainty metric U ∈ [0, 1]."
  },
  {
    id: 6,
    title: "Uncertainty-Aware Expert Gating",
    tag: "GATING",
    icon: "git-branch",
    summary: "Dynamically allocates weights between regime specialists and the global fallback model.",
    enters: "Regime probabilities P, uncertainty metric U, and global atmospheric circulation indices.",
    whatHappens: "Soft gating network computes dynamic routing weights: when uncertainty is low, specialist weight dominates; when uncertainty is high, weight smoothly shifts toward the Global Baseline Expert to prevent over-specialization.",
    comesOut: "Dynamic weight vector [w_active, w_break, w_dep, w_trans, w_global] where ∑ w_i = 1."
  },
  {
    id: 7,
    title: "Regime-Specific AI Experts",
    tag: "EXPERTS",
    icon: "cpu",
    summary: "Domain-specialized AI models trained exclusively on subsets of historical monsoon regimes.",
    enters: "Feature tensor filtered and presented to all 4 regime experts + 1 global baseline expert.",
    whatHappens: "Each specialist executes its learned bias-correction strategy: Active Expert addresses orographic underestimation; Break Expert addresses false drizzle; Depression Expert realigns vortex rainbands; Global Expert provides robust baseline.",
    comesOut: "5 independent candidate corrected rainfall forecast fields from the expert panel."
  },
  {
    id: 8,
    title: "Regime-Aware Bias Correction",
    tag: "CORRECTION",
    icon: "zap",
    summary: "Blends expert outputs using gating weights to produce initial corrected rainfall field.",
    enters: "5 candidate rainfall fields and dynamic expert gating weights.",
    whatHappens: "Computes convex combination: R_corrected = ∑ (w_k * R_expert_k). Implements hurdle check: classifies rain occurrence P(R > 0.1mm) before applying conditional rainfall amount adjustment.",
    comesOut: "Blended, regime-corrected continuous precipitation field at 0.10° grid scale."
  },
  {
    id: 9,
    title: "Local / Geographical Refinement",
    tag: "GEO-REFINE",
    icon: "map",
    summary: "Downscales and adapts forecasts using fine-resolution topography and coastal proximity.",
    enters: "0.10° regime-corrected rainfall, 0.05° DEM elevation, slope gradient, aspect angle, and coastal distance.",
    whatHappens: "Applies high-resolution orographic enhancement/subsidence factors based on windward slope exposure and marine boundary moisture decay.",
    comesOut: "Locally-refined precipitation field downscaled to 0.05° (~5 km) resolution."
  },
  {
    id: 10,
    title: "Heavy-Rainfall Probability Head",
    tag: "PROBABILISTIC",
    icon: "alert-triangle",
    summary: "Estimates threshold exceedance probabilities P(Rainfall > τ) with calibrated uncertainty.",
    enters: "Refined precipitation field, ensemble spread features, atmospheric instability indices.",
    whatHappens: "Quantile regression heads estimate predictive distribution parameters (e.g. 50th, 90th, 95th, 99th percentiles) and evaluate exceedance probabilities for 25mm, 50mm, 100mm, and custom thresholds.",
    comesOut: "Full probabilistic exceedance maps P(R > 25mm), P(R > 50mm), P(R > 100mm) with prediction intervals."
  },
  {
    id: 11,
    title: "Spatial Consistency Safeguards",
    tag: "SAFEGUARDS",
    icon: "shield-check",
    summary: "Enforces physical realism, preserves NWP coherent patterns, and eliminates artifacts.",
    enters: "High-resolution probabilistic and deterministic rainfall fields.",
    whatHappens: "Enforces strictly non-negative rainfall (R ≥ 0), bounds maximum correction deltas, prevents unphysical isolated 'checkerboard' artifacts, avoids blanket smoothing, and preserves valid extreme signals.",
    comesOut: "Physically consistent, spatially coherent, artifact-free refined rainfall field."
  },
  {
    id: 12,
    title: "Grid-Level Forecast Generation",
    tag: "GRID OUTPUT",
    icon: "layers",
    summary: "Synthesizes final 0.05° grid products ready for geospatial analysis and client streaming.",
    enters: "Safeguarded deterministic rainfall, exceedance probabilities, uncertainty metrics, and regime labels.",
    whatHappens: "Packages outputs into multi-band GeoTIFF / Cloud-Optimized GeoTIFF (COG) and GeoJSON grid tiles for client rendering.",
    comesOut: "Operational grid forecast layers containing rainfall magnitude, regime tags, and exceedance risks."
  },
  {
    id: 13,
    title: "Grid → District Aggregation",
    tag: "DISTRICTS",
    icon: "pie-chart",
    summary: "Performs polygon intersection and area-weighted aggregation for administrative units.",
    enters: "0.05° grid forecast layers and official district administrative boundary GeoJSON polygons.",
    whatHappens: "Calculates intersection areas: w_g = Area(g ∩ district) / Area(district). Computes area-weighted mean, maximum point rain, 90th/95th percentiles, and fraction of district area exceeding critical thresholds.",
    comesOut: "Comprehensive district intelligence records with summary statistics and localized risk indicators."
  },
  {
    id: 14,
    title: "Decision-Support Dashboard",
    tag: "DASHBOARD",
    icon: "monitor",
    summary: "Renders interactive scientific visual interface for forecasters, researchers, and planners.",
    enters: "District tables, grid layers, regime analytics, SHAP values, and verification metrics.",
    whatHappens: "Populates interactive Leaflet map, layer toggles, lead-time controls, district ranking drawers, and explainability inspectors.",
    comesOut: "Responsive, accessible, production-grade meteorological intelligence dashboard."
  },
  {
    id: 15,
    title: "Scientific Verification & Benchmarking",
    tag: "VERIFICATION",
    icon: "check-circle",
    summary: "Continuously evaluates performance against observed rainfall (IMD gridded / AWS observations).",
    enters: "Historical/held-out forecasts (Raw NWP, Global Correction, ATMOS) and ground-truth observations.",
    whatHappens: "Computes continuous (RMSE, MAE, Bias), categorical (POD, FAR, CSI, ETS, FBIAS), spatial (FSS), and probabilistic (Brier, BSS) metrics across regimes, lead times, and terrain zones.",
    comesOut: "Rigorous verification reports, reliability diagrams, and performance curves validating model hypotheses."
  },
  {
    id: 16,
    title: "Data Leakage Quarantining",
    tag: "INTEGRITY",
    icon: "lock",
    summary: "Guarantees strict temporal separation: target-day observations are strictly isolated from operational inference.",
    enters: "Operational feature pipelines, training pipelines, and observational archives.",
    whatHappens: "Strictly enforces that target-day observed rainfall is NEVER permitted in the operational feature pipeline; observations are restricted solely to offline loss computation and verification.",
    comesOut: "Certified leakage-free operational model inference architecture."
  }
];

// 17-Step Development Roadmap
export const DEVELOPMENT_ROADMAP = [
  { step: "01", title: "Data Collection & Standardization", status: "Completed", desc: "Aggregated multi-decadal NWP forecasts, IMD observed rainfall grids, and SRTM DEM into unified formats." },
  { step: "02", title: "Quality Control & Grid Alignment", status: "Completed", desc: "Built automated pipeline for conservative regridding, missing value imputation, and boundary verification." },
  { step: "03", title: "Feature Engineering", status: "Completed", desc: "Engineered 24 thermodynamic and dynamic atmospheric features including moisture flux convergence and vorticity." },
  { step: "04", title: "Raw NWP Baseline Establishment", status: "Completed", desc: "Benchmarked operational NWP models across all monsoon seasons to quantify systematic errors." },
  { step: "05", title: "Global Bias Correction Baseline", status: "Completed", desc: "Trained monolithic global quantile-mapping and gradient boosting correction models as standard baselines." },
  { step: "06", title: "Monsoon Regime Classifier", status: "Completed", desc: "Developed 4-class synoptic classifier (Active, Break, Depression, Transition) achieving 87.4% accuracy." },
  { step: "07", title: "Regime-Specific AI Experts", status: "Completed", desc: "Built and fine-tuned specialized models on partitioned regime data (LightGBM & Deep Residual MLPs)." },
  { step: "08", title: "Uncertainty-Aware Soft Gating", status: "Completed", desc: "Designed entropy-guided dynamic gating network to blend specialists smoothly with global regularization." },
  { step: "09", title: "Heavy-Rainfall Probability Head", status: "Completed", desc: "Implemented quantile regression and calibrated logistic heads for P(Rainfall > 25, 50, 100mm)." },
  { step: "10", title: "Probability Calibration", status: "Completed", desc: "Applied isotonic regression and Platt scaling to minimize Brier scores and ensure reliable forecast probabilities." },
  { step: "11", title: "Local Geographical Refinement", status: "In Progress", desc: "Integrating high-resolution 0.05° DEM, slope, aspect, and coastal distance downscaling layers." },
  { step: "12", title: "Spatial Consistency Safeguards", status: "In Progress", desc: "Implementing non-negative enforcement, gradient conservation, and artifact elimination algorithms." },
  { step: "13", title: "Grid-to-District Aggregation", status: "In Progress", desc: "Developing polygon-intersection area-weighting algorithms for 700+ Indian administrative districts." },
  { step: "14", title: "Interactive Weather Intelligence Dashboard", status: "Active Demo", desc: "Building the production-grade web dashboard with interactive map, district drawers, and explainability." },
  { step: "15", title: "Multi-Decadal Scientific Verification", status: "Scheduled", desc: "Running comprehensive verification across 15 historical monsoon seasons (2009-2024)." },
  { step: "16", title: "Multi-Condition Stress Testing", status: "Scheduled", desc: "Evaluating performance across extreme climate events, rapid regime transitions, and unusual cyclone tracks." },
  { step: "17", title: "Operational Pilot Deployment", status: "Planned", desc: "Deploying API-first microservices (FastAPI + Docker + PostGIS) for operational trial support." }
];

// 6 Core Innovations
export const CORE_INNOVATIONS = [
  {
    number: "01",
    title: "Regime-Specific AI Correction",
    tagline: "Tailored to Monsoon States",
    desc: "Unlike conventional models that apply a single global bias correction across all weather conditions, ATMOS deploys specialized AI experts trained specifically on Active, Break, Depression/Low, and Transition conditions.",
    icon: "compass"
  },
  {
    number: "02",
    title: "Uncertainty-Aware Soft Gating",
    tagline: "No Fragile Hard Switching",
    desc: "Instead of abruptly switching between models, ATMOS uses Shannon entropy to measure synoptic ambiguity and dynamically blends specialist models with a robust global baseline.",
    icon: "git-merge"
  },
  {
    number: "03",
    title: "Local & Topographic Refinement",
    tagline: "Fine-Scale Geospatial Adaptation",
    desc: "High-resolution elevation (DEM), slope aspect, and coastal proximity refine coarse-scale NWP forecasts, correcting orographic underestimation along mountain barriers like the Western Ghats.",
    icon: "map-pin"
  },
  {
    number: "04",
    title: "Probabilistic Exceedance Intelligence",
    tagline: "Beyond Deterministic Single Numbers",
    desc: "Provides calibrated exceedance probabilities P(R > 25mm, 50mm, 100mm) alongside deterministic rainfall, offering decision-makers realistic risk estimates.",
    icon: "percent"
  },
  {
    number: "05",
    title: "Area-Weighted District Intelligence",
    tagline: "Actionable Administrative Analytics",
    desc: "Converts scientific grid points into district-level metrics: area-weighted mean, 90th & 95th percentiles, and fraction of district area exceeding critical thresholds.",
    icon: "bar-chart"
  },
  {
    number: "06",
    title: "Transparent Scientific Verification",
    tagline: "Evaluated Across Diverse Conditions",
    desc: "Rigorous benchmarking against observations using continuous, categorical, spatial, and probabilistic verification metrics across regimes, lead times, and terrain zones.",
    icon: "check-circle"
  }
];

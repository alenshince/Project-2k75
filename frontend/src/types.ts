// ============================================================================
// PROJECT 2K75: CORE TYPE DEFINITIONS
// ============================================================================

export type PlanetArchetype =
  | 'TERRESTRIAL'
  | 'OCEANIC'
  | 'GAS_GIANT'
  | 'ICE_GIANT'
  | 'VOLCANIC'
  | 'DESERT'
  | 'ANOMALOUS'
  | (string & {});

export interface PlanetAtmosphere {
  primaryGas: string;
  primaryPercentage: number;
  secondaryGas: string;
  secondaryPercentage: number;
  surfacePressureAtm: number;
  traceGases?: string;
}

export interface PlanetTopography {
  description: string;
  surfaceWaterCoverage: number;
  elevationVarianceMeters?: number | string;
  tectonicActivity?: string;
  primaryBiome?: string;
}

export interface PlanetCivilization {
  tier: string;
  status?: string; // Optional to accommodate planetGenerator.ts (fixes ts(2741))
  kardashevIndex: number;
  structureType?: string;
  infrastructureColor?: string;
  bioDensity?: number | string;
}

export interface PlanetVisuals {
  palette: {
    primaryColor: string;
    secondaryColor: string;
    atmosphereColor: string;
    glowColor?: string;
  };
  hasRings: boolean;
  starColor?: string;
  starRadius?: number;
  cloudOpacity?: number;
  bumpScale?: number;
  roughness?: number; // Added to accommodate planetGenerator.ts (fixes ts(2353))
}

export type AnomalyCoordinates = [number, number] | { theta: number; phi: number };

export interface PlanetDossier {
  catalogIndex: number;
  designation: string;
  archetype: PlanetArchetype;
  orbitalRadiusAU: number;
  surfaceTempKelvin: number;
  atmosphere: PlanetAtmosphere;
  topography: PlanetTopography;
  civilization: PlanetCivilization;
  anomalyCoordinates: AnomalyCoordinates;
  anomalyDescription: string;
  visuals: PlanetVisuals;
  isCaptured: boolean;
  isDiscovered?: boolean;
  isMalluvalyTarget?: boolean;
}

export type ViewportMode = 'FOCUS' | 'SYSTEM' | 'SURFACE';

export type ScriptPhase =
  | 'DISCOVERY_01'
  | 'DISCOVERY_02'
  | 'DISCOVERY_03'
  | 'CRITICAL_ENTITY_75'
  | 'ARCHIVE_COMPLETE'
  | (string & {});

export interface TelemetryReading {
  surfaceTempKelvin: number;
  atmosphericPressureBar: number;
  tachyonResonance: number;
  ozonePrime: number;
  [key: string]: any;
}

export interface ClassificationResult {
  classification: string;
  habitabilityPercentage: number;
  hazardLevel: 'MINIMAL' | 'MODERATE' | 'EXTREME' | string;
  description: string;
}
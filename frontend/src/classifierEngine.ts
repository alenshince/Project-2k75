import type { TelemetryReading, ClassificationResult } from './types';

// Deterministic classifier analyzing sensor inputs against astronomical thresholds
export function classifyTelemetry(reading: TelemetryReading): ClassificationResult {
  // Chrono-anomalous spatial rifts have high tachyon resonance
  if (reading.tachyonResonance > 0.6) {
    return {
      classification: 'CHRONO_ANOMALOUS_RIFT',
      habitabilityPercentage: 0,
      hazardLevel: 'EXTREME',
      description: 'Localized space-time distortion detected. Dangerous tachyon flux levels.',
    };
  }

  // Habitable terrestrial planets
  if (
    reading.surfaceTempKelvin >= 265 &&
    reading.surfaceTempKelvin <= 315 &&
    reading.atmosphericPressureBar >= 0.8 &&
    reading.atmosphericPressureBar <= 2.2 &&
    reading.ozonePrime > 0.35
  ) {
    return {
      classification: 'CLASS-M_HYPER_TERRESTRIAL',
      habitabilityPercentage: 94,
      hazardLevel: 'MINIMAL',
      description: 'Equilibrium climate stabilized with bio-supportive ozone layer.',
    };
  }

  // Massive gas planets
  if (reading.atmosphericPressureBar > 15.0) {
    return {
      classification: 'SUB_STELLAR_GAS_COLOSSUS',
      habitabilityPercentage: 6,
      hazardLevel: 'MODERATE',
      description: 'Super-dense atmospheric envelope with deep turbulent methane currents.',
    };
  }

  // Frozen / cryo volcanic worlds
  return {
    classification: 'CRYO_VOLCANIC_BARREN',
    habitabilityPercentage: 12,
    hazardLevel: 'MODERATE',
    description: 'Sub-zero volatile crust with active nitrogen-ice volcanism.',
  };
}

// Generates live sensor jitter and drift for the HUD stream
export function getOscillatingTelemetry(base: TelemetryReading): TelemetryReading {
  return {
    ...base,
    surfaceTempKelvin: Math.round(base.surfaceTempKelvin + (Math.random() * 4 - 2)),
    atmosphericPressureBar: +(base.atmosphericPressureBar + (Math.random() * 0.04 - 0.02)).toFixed(2),
    tachyonResonance: +(Math.min(1, Math.max(0, base.tachyonResonance + (Math.random() * 0.04 - 0.02)))).toFixed(2),
    ozonePrime: +(Math.min(1, Math.max(0, base.ozonePrime + (Math.random() * 0.02 - 0.01)))).toFixed(2),
  };
}
import type { PlanetDossier, PlanetArchetype } from './types';

// Deterministic pseudo-random helper to keep planet generation consistent
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const generateProceduralPlanet = (index: number): PlanetDossier => {
  const archetypes: PlanetArchetype[] = ['TERRESTRIAL', 'OCEANIC', 'GAS_GIANT', 'CRYO'];
  const archetype = archetypes[index % archetypes.length];
  const rand = seededRandom(index * 13.37);

  const designation = `K3-${(70 + index).toString().padStart(2, '0')}${String.fromCharCode(97 + (index % 4))}`;

  switch (archetype) {
    case 'GAS_GIANT':
      return {
        catalogIndex: index,
        designation,
        archetype: 'GAS_GIANT',
        orbitalRadiusAU: +(3.5 + rand * 5.0).toFixed(2),
        surfaceTempKelvin: Math.floor(110 + rand * 60),
        atmosphere: {
          primaryGas: 'Hydrogen',
          primaryPercentage: 75,
          secondaryGas: 'Helium',
          secondaryPercentage: 23,
          traceGases: 'Methane, Ammonia',
          surfacePressureAtm: +(45.0 + rand * 50.0).toFixed(1),
        },
        topography: {
          description: 'Dense supercritical gas mantle, persistent atmospheric cyclonic storms.',
          surfaceWaterCoverage: 0.0,
          tectonicActivity: 'STABLE',
          primaryBiome: 'Atmospheric Jet Streams',
        },
        civilization: {
          tier: 'TYPE_1',
          kardashevIndex: 1.1,
          structureType: 'AEROSTAT',
          infrastructureColor: '#f59e0b',
          bioDensity: 'MODERATE',
        },
        visuals: {
          palette: {
            primaryColor: '#d97706',
            secondaryColor: '#b45309',
            atmosphereColor: '#fbbf24',
            glowColor: '#f59e0b',
          },
          hasRings: rand > 0.4,
          cloudOpacity: 0.95,
          bumpScale: 0.05,
          roughness: 0.6,
          starColor: '#ffedd5',
          starRadius: 4.2,
        },
        anomalyCoordinates: {
          phi: +(0.8 + rand * 1.5).toFixed(2),
          theta: +(rand * Math.PI * 2).toFixed(2),
        },
        anomalyDescription: 'Buoyant siphon platforms suspended in high-pressure strata.',
        isCaptured: false,
      };

    case 'CRYO':
      return {
        catalogIndex: index,
        designation,
        archetype: 'CRYO',
        orbitalRadiusAU: +(2.2 + rand * 3.0).toFixed(2),
        surfaceTempKelvin: Math.floor(65 + rand * 40),
        atmosphere: {
          primaryGas: 'Nitrogen',
          primaryPercentage: 92,
          secondaryGas: 'Methane',
          secondaryPercentage: 6,
          traceGases: 'Trace Argon',
          surfacePressureAtm: +(0.4 + rand * 0.3).toFixed(2),
        },
        topography: {
          description: 'Shattered tectonic ice shelves over liquid ammonia mantle.',
          surfaceWaterCoverage: 0.0,
          tectonicActivity: 'MODERATE',
          primaryBiome: 'Glaciated Fracture Plains',
        },
        civilization: {
          tier: 'TYPE_0',
          kardashevIndex: 0.4,
          structureType: 'DOME',
          infrastructureColor: '#67e8f9',
          bioDensity: 'MICROBIAL',
        },
        visuals: {
          palette: {
            primaryColor: '#0ea5e9',
            secondaryColor: '#38bdf8',
            atmosphereColor: '#bae6fd',
            glowColor: '#7dd3fc',
          },
          hasRings: false,
          cloudOpacity: 0.35,
          bumpScale: 0.28,
          roughness: 0.2,
          starColor: '#e0f2fe',
          starRadius: 2.8,
        },
        anomalyCoordinates: {
          phi: +(1.0 + rand * 1.2).toFixed(2),
          theta: +(rand * Math.PI * 2).toFixed(2),
        },
        anomalyDescription: 'Sub-glacial geothermal heat venting and structural lattices.',
        isCaptured: false,
      };

    case 'OCEANIC':
      return {
        catalogIndex: index,
        designation,
        archetype: 'OCEANIC',
        orbitalRadiusAU: +(0.9 + rand * 0.5).toFixed(2),
        surfaceTempKelvin: Math.floor(270 + rand * 30),
        atmosphere: {
          primaryGas: 'Nitrogen',
          primaryPercentage: 78,
          secondaryGas: 'Oxygen',
          secondaryPercentage: 20,
          traceGases: 'Water Vapor',
          surfacePressureAtm: 1.05,
        },
        topography: {
          description: 'Vast oceanic basins with isolated volcanic volcanic spires.',
          surfaceWaterCoverage: +(0.75 + rand * 0.2).toFixed(2),
          tectonicActivity: 'MODERATE',
          primaryBiome: 'Pelagic Ocean & Atolls',
        },
        civilization: {
          tier: 'TYPE_1',
          kardashevIndex: 1.3,
          structureType: 'SPIRE',
          infrastructureColor: '#ec4899',
          bioDensity: 'HIGH',
        },
        visuals: {
          palette: {
            primaryColor: '#0369a1',
            secondaryColor: '#10b981',
            atmosphereColor: '#38bdf8',
            glowColor: '#0284c7',
          },
          hasRings: false,
          cloudOpacity: 0.7,
          bumpScale: 0.1,
          roughness: 0.15,
          starColor: '#fef08a',
          starRadius: 3.4,
        },
        anomalyCoordinates: {
          phi: +(1.2 + rand * 0.8).toFixed(2),
          theta: +(rand * Math.PI * 2).toFixed(2),
        },
        anomalyDescription: 'Bioluminescent deep-trench energetic arrays.',
        isCaptured: false,
      };

    case 'TERRESTRIAL':
    default:
      return {
        catalogIndex: index,
        designation,
        archetype: 'TERRESTRIAL',
        orbitalRadiusAU: +(1.1 + rand * 0.8).toFixed(2),
        surfaceTempKelvin: Math.floor(220 + rand * 80),
        atmosphere: {
          primaryGas: 'Carbon Dioxide',
          primaryPercentage: 85,
          secondaryGas: 'Nitrogen',
          secondaryPercentage: 12,
          traceGases: 'Sulfur Dioxide, Argon',
          surfacePressureAtm: +(0.7 + rand * 0.6).toFixed(2),
        },
        topography: {
          description: 'Wind-sheared basalt plateaus and high-density impact craters.',
          surfaceWaterCoverage: 0.05,
          tectonicActivity: 'STABLE',
          primaryBiome: 'Silicate Crags & Dunes',
        },
        civilization: {
          tier: 'TYPE_0',
          kardashevIndex: 0.0,
          structureType: 'NONE',
          infrastructureColor: '#000000',
          bioDensity: 'MICROBIAL',
        },
        visuals: {
          palette: {
            primaryColor: '#9a3412',
            secondaryColor: '#431407',
            atmosphereColor: '#fdba74',
            glowColor: '#ea580c',
          },
          hasRings: rand > 0.7,
          cloudOpacity: 0.4,
          bumpScale: 0.25,
          roughness: 0.9,
          starColor: '#ffedd5',
          starRadius: 3.1,
        },
        anomalyCoordinates: {
          phi: +(0.9 + rand * 1.3).toFixed(2),
          theta: +(rand * Math.PI * 2).toFixed(2),
        },
        anomalyDescription: 'Symmetrical crystalline monolith formation protruding from canyon floor.',
        isCaptured: false,
      };
  }
};
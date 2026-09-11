import * as THREE from 'three';
import type { PlanetArchetype } from './types';

const surfaceCache = new Map<string, THREE.CanvasTexture>();
const bumpCache = new Map<string, THREE.CanvasTexture>();
const roughnessCache = new Map<string, THREE.CanvasTexture>();
const cloudCache = new Map<string, THREE.CanvasTexture>();
const ringCache = new Map<string, THREE.CanvasTexture>();

/**
 * Helper: Generates multi-layered procedural terrain patches
 */
function drawProceduralLandmasses(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  landColor: string,
  coastColor: string,
  count: number
) {
  for (let i = 0; i < count; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const baseRadius = Math.random() * 160 + 60;

    // Outer shallow coastal waters / shelf
    ctx.fillStyle = coastColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy, baseRadius * 1.25, baseRadius * 0.9, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    // Continent core
    ctx.fillStyle = landColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy, baseRadius, baseRadius * 0.75, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    // Mountain ridges and biome color variations
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let j = 0; j < 5; j++) {
      ctx.beginPath();
      ctx.arc(
        cx + (Math.random() - 0.5) * baseRadius,
        cy + (Math.random() - 0.5) * baseRadius,
        baseRadius * 0.35,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}

/**
 * 1. 2K Surface Albedo Texture
 */
export const getCachedSurfaceTexture = (
  archetype: PlanetArchetype,
  primaryColor: string
): THREE.CanvasTexture => {
  const cacheKey = `${archetype}_${primaryColor}_2k`;
  if (surfaceCache.has(cacheKey)) return surfaceCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  if (archetype === 'OCEANIC' || archetype === 'TERRESTRIAL') {
    // Deep Google Earth-style ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#0a1d37');
    oceanGrad.addColorStop(0.5, '#0f386b');
    oceanGrad.addColorStop(1, '#0a1d37');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Landmasses with shallow coastlines
    const landColor = archetype === 'TERRESTRIAL' ? '#2f4f2f' : '#1b4d3e';
    const coastColor = 'rgba(20, 184, 166, 0.35)';
    drawProceduralLandmasses(ctx, canvas.width, canvas.height, landColor, coastColor, 35);

    // Polar ice caps
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, 60);
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
  } else if (archetype === 'CRYO') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawProceduralLandmasses(ctx, canvas.width, canvas.height, '#e2e8f0', 'rgba(148, 163, 184, 0.3)', 25);
  } else {
    // Gas Giant atmospheric bands
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += 8) {
      const alpha = (Math.sin(y * 0.03) + 1) * 0.2;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(0, y, canvas.width, 8);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  surfaceCache.set(cacheKey, texture);
  return texture;
};

/**
 * 2. 2K Elevation / Bump Relief Map
 */
export const getCachedBumpTexture = (archetype: PlanetArchetype): THREE.CanvasTexture => {
  const cacheKey = `bump_${archetype}_2k`;
  if (bumpCache.has(cacheKey)) return bumpCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Neutral gray = sea level
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // High elevation mountain chains (white = high altitude)
  for (let i = 0; i < 180; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 45 + 10;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    grad.addColorStop(1, 'rgba(128, 128, 128, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  bumpCache.set(cacheKey, texture);
  return texture;
};

/**
 * 3. 2K Specular Roughness Map (Glossy water vs matte continents)
 */
export const getCachedRoughnessTexture = (archetype: PlanetArchetype): THREE.CanvasTexture => {
  const cacheKey = `roughness_${archetype}_2k`;
  if (roughnessCache.has(cacheKey)) return roughnessCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Black = 100% specular ocean reflection
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // White = matte rough continents (no specular sun glint)
  ctx.fillStyle = '#dcdcdc';
  for (let i = 0; i < 35; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = Math.random() * 80 + 30;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  roughnessCache.set(cacheKey, texture);
  return texture;
};

/**
 * 4. Realistic Cloud Coverage Deck
 */
export const getCachedCloudTexture = (archetype: PlanetArchetype = 'TERRESTRIAL'): THREE.CanvasTexture => {
  const cacheKey = `clouds_${archetype}_2k`;
  if (cloudCache.has(cacheKey)) return cloudCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Realistic weather swirls and atmospheric storm fronts
  for (let i = 0; i < 90; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const w = Math.random() * 260 + 80;
    const h = Math.random() * 50 + 20;

    const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, w * 0.5);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  cloudCache.set(cacheKey, texture);
  return texture;
};

/**
 * 5. Rings Texture
 */
export const getCachedRingTexture = (ringColor: string): THREE.CanvasTexture => {
  const cacheKey = `ring_${ringColor}`;
  if (ringCache.has(cacheKey)) return ringCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < canvas.width; x += 3) {
    const alpha = Math.random() > 0.35 ? Math.random() * 0.7 + 0.15 : 0;
    ctx.fillStyle = ringColor;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x, 0, 3, canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  ringCache.set(cacheKey, texture);
  return texture;
};

// Aliases for backwards compatibility
export const generateSurfaceTexture = getCachedSurfaceTexture;
export const generateBumpTexture = getCachedBumpTexture;
export const generateRoughnessTexture = getCachedRoughnessTexture;
export const generateCloudTexture = getCachedCloudTexture;
export const generateRingTexture = getCachedRingTexture;
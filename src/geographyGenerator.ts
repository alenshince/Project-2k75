import * as THREE from 'three';

const displacementCache = new Map<string, THREE.CanvasTexture>();
const topoMapCache = new Map<string, THREE.CanvasTexture>();

/**
 * 1. Physical 3D Elevation Heightmap (Displacement Map)
 * Black (0) = Ocean Floor, Gray (128) = Sea Level, White (255) = Alpine Peaks
 */
export const getCachedDisplacementTexture = (): THREE.CanvasTexture => {
  const cacheKey = 'global_displacement_2k';
  if (displacementCache.has(cacheKey)) return displacementCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Baseline sea level
  ctx.fillStyle = '#404040';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Continental mass elevation lift
  ctx.fillStyle = '#757575';
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const rx = Math.random() * 180 + 70;
    const ry = Math.random() * 110 + 40;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Alpine Mountain Ranges (Sharply elevated peaks)
  for (let i = 0; i < 160; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = Math.random() * 35 + 8;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, '#ffffff'); // Highest peaks
    grad.addColorStop(0.5, '#b0b0b0');
    grad.addColorStop(1, 'rgba(117, 117, 117, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ocean Trenches
  for (let i = 0; i < 25; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = Math.random() * 50 + 15;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, '#000000'); // Deep trenches
    grad.addColorStop(1, 'rgba(64, 64, 64, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  displacementCache.set(cacheKey, texture);
  return texture;
};

/**
 * 2. Scientific Hypsometric Topography / Geography Texture
 * Color-banded by elevation with geographical grid lines
 */
export const getCachedTopographyTexture = (): THREE.CanvasTexture => {
  const cacheKey = 'global_topography_color_2k';
  if (topoMapCache.has(cacheKey)) return topoMapCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean tint
  ctx.fillStyle = '#0f2b48';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Hypsometric tint elevation contours
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const rx = Math.random() * 180 + 70;
    const ry = Math.random() * 110 + 40;

    // Coastal green shelf
    ctx.fillStyle = '#2d6a4f';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mid-elevation plateau (yellow-green)
    ctx.fillStyle = '#d4a373';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.65, ry * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    // High mountain ridge (sienna/brown)
    ctx.fillStyle = '#6b4226';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.35, ry * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Snow caps (white)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.15, ry * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Geographical Coordinate Grid (Latitude / Longitude lines)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
  ctx.lineWidth = 1;

  // Latitudes
  for (let y = 0; y <= canvas.height; y += canvas.height / 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  // Longitudes
  for (let x = 0; x <= canvas.width; x += canvas.width / 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  topoMapCache.set(cacheKey, texture);
  return texture;
};
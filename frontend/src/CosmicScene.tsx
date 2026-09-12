import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

export interface CosmicSceneProps {
  color: string;
  archetype: string;
  atmosphereColor: string;
  anomalyCoordinates?: [number, number];
  scale?: number;
  hasRings?: boolean;
  orbitalRadiusAU?: number;
  starColor?: string;
  starRadius?: number;
  viewMode?: 'FOCUS' | 'SYSTEM' | 'SURFACE';
  targetName?: string;
  isScanning?: boolean;
  scanProgress?: number;
}

export const CosmicScene: React.FC<CosmicSceneProps> = ({
  color,
  archetype,
  atmosphereColor,
  scale = 1.0,
  hasRings = false,
  isScanning = false,
  scanProgress = 0,
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);
  const scanMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Procedural continental & cloud textures
  const { surfaceTexture, cloudTexture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, color);
    oceanGrad.addColorStop(1, '#020b14');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const baseColor = new THREE.Color(color);
    const landColor = archetype.includes('Rogue')
      ? new THREE.Color('#7f1d1d')
      : new THREE.Color('#15803d');
    const sandColor = new THREE.Color('#ca8a04');

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const nx = Math.sin((x / canvas.width) * Math.PI * 2) * 2.0;
        const ny = (y / canvas.height) * 4.0;
        const val = Math.sin(nx * 3.0 + ny * 2.0) + Math.cos(nx * 5.0 - ny * 4.0) * 0.5;

        if (val > 0.35) {
          const blend = Math.min(1, (val - 0.35) * 2.5);
          const c = val < 0.45 ? sandColor : landColor;
          data[idx] = c.r * 255 * blend + baseColor.r * 255 * (1 - blend);
          data[idx + 1] = c.g * 255 * blend + baseColor.g * 255 * (1 - blend);
          data[idx + 2] = c.b * 255 * blend + baseColor.b * 255 * (1 - blend);
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const surfaceTex = new THREE.CanvasTexture(canvas);

    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cCtx = cloudCanvas.getContext('2d')!;
    cCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 90; i++) {
      const cx = Math.random() * cloudCanvas.width;
      const cy = Math.random() * cloudCanvas.height;
      const radius = 30 + Math.random() * 80;
      cCtx.beginPath();
      cCtx.ellipse(cx, cy, radius * 1.8, radius * 0.6, Math.PI / 8, 0, Math.PI * 2);
      cCtx.fill();
    }
    const cloudTex = new THREE.CanvasTexture(cloudCanvas);

    return { surfaceTexture: surfaceTex, cloudTexture: cloudTex };
  }, [color, archetype]);

  // Three.js animation frame loop
  useFrame((state, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.04;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.06;

    // Pulse laser scanner during active scan
    if (scanRingRef.current && isScanning) {
      const targetY = 1.1 - (scanProgress / 100) * 2.2;
      scanRingRef.current.position.y = targetY;
      scanRingRef.current.rotation.z += delta * 4.0;

      // Laser intensity pulsing effect (Blinking oscillating opacity between 0.3 and 0.8)
      if (scanMaterialRef.current) {
        const pulse = 0.55 + Math.sin(state.clock.elapsedTime * 12.0) * 0.25;
        scanMaterialRef.current.opacity = pulse;
      }
    }
  });

  return (
    <group position={[0, 0, 0]} scale={scale}>
      <Stars radius={150} depth={60} count={3500} factor={4} saturation={0.5} fade speed={1.2} />

      {/* Surface Globe */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial map={surfaceTexture} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.02, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric Rim */}
      <mesh>
        <sphereGeometry args={[1.06, 48, 48]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Planetary Rings */}
      {hasRings && (
        <mesh rotation={[-Math.PI / 2.8, 0.2, 0]}>
          <ringGeometry args={[1.35, 2.1, 64]} />
          <meshStandardMaterial
            color={atmosphereColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.65}
          />
        </mesh>
      )}

      {/* Pulsing Holographic Laser Scan Plane */}
      {isScanning && (
        <mesh ref={scanRingRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.0, 1.25, 64]} />
          <meshBasicMaterial
            ref={scanMaterialRef}
            color="#00e5ff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};

export default CosmicScene;
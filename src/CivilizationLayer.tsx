import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CivilizationLayerProps {
  planetRadius: number;
  targetName: string;
  cameraDistance: number;
}

interface StructureData {
  position: [number, number, number];
  quaternion: THREE.Quaternion;
  scale: [number, number, number];
  color: string;
  type: 'SPIRE' | 'DOME' | 'AEROSTAT' | 'MONOLITH';
}

export const CivilizationLayer: React.FC<CivilizationLayerProps> = ({
  planetRadius,
  targetName,
  cameraDistance,
}) => {
  const craftsRef = useRef<THREE.Group>(null);

  // Proximity visibility: 0 at high orbit, 1 during low-altitude zoom
  const visibilityFactor = useMemo(() => {
    return THREE.MathUtils.clamp((5.2 - cameraDistance) / 1.8, 0, 1);
  }, [cameraDistance]);

  // Compute procedural civilization hubs distributed across the terrain
  const structures = useMemo(() => {
    const list: StructureData[] = [];
    const seedOffset = targetName.length * 7;
    const count = targetName === 'GOLIATH-IV' ? 36 : 64;

    for (let i = 0; i < count; i++) {
      const phi = Math.PI * 0.35 + Math.sin(i + seedOffset) * 0.3;
      const theta = (i / count) * Math.PI * 2 + Math.cos(i) * 0.4;

      // Gas colossus aerostats hover higher in the atmosphere
      const elevation = targetName === 'GOLIATH-IV' ? planetRadius + 0.18 : planetRadius + 0.02;

      const x = elevation * Math.sin(phi) * Math.cos(theta);
      const y = elevation * Math.cos(phi);
      const z = elevation * Math.sin(phi) * Math.sin(theta);

      const surfaceNormal = new THREE.Vector3(x, y, z).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        surfaceNormal
      );

      let type: StructureData['type'] = 'SPIRE';
      let color = '#38bdf8';
      let scale: [number, number, number] = [0.03, 0.15, 0.03];

      if (targetName === 'ASTERION PRIME') {
        type = i % 3 === 0 ? 'DOME' : 'SPIRE';
        color = i % 2 === 0 ? '#38bdf8' : '#ec4899';
        scale = type === 'DOME' ? [0.08, 0.05, 0.08] : [0.025, 0.18, 0.025];
      } else if (targetName === 'GOLIATH-IV') {
        type = 'AEROSTAT';
        color = '#f59e0b';
        scale = [0.06, 0.04, 0.06];
      } else if (targetName === 'RIFT-2K75') {
        type = 'MONOLITH';
        color = '#a855f7';
        scale = [0.02, 0.24, 0.02];
      } else {
        // BOREAS ZERO
        type = 'DOME';
        color = '#67e8f9';
        scale = [0.05, 0.03, 0.05];
      }

      list.push({ position: [x, y, z], quaternion, scale, color, type });
    }

    return list;
  }, [planetRadius, targetName]);

  // Animate orbital patrol units circling the settlements
  useFrame((_, delta) => {
    if (craftsRef.current) {
      craftsRef.current.rotation.y += delta * 0.12;
      craftsRef.current.rotation.x += delta * 0.05;
    }
  });

  // Skip rendering altogether when the camera is too far away
  if (visibilityFactor <= 0.02) return null;

  return (
    <group>
      {/* Planetary Surface Architecture */}
      {structures.map((s, idx) => (
        <group key={idx} position={s.position} quaternion={s.quaternion} scale={s.scale}>
          {s.type === 'SPIRE' && (
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.2, 1, 1, 6]} />
              <meshStandardMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={1.8 * visibilityFactor}
                roughness={0.2}
                metalness={0.8}
                transparent
                opacity={visibilityFactor}
              />
            </mesh>
          )}

          {s.type === 'DOME' && (
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={2.0 * visibilityFactor}
                roughness={0.1}
                metalness={0.9}
                transparent
                opacity={0.85 * visibilityFactor}
              />
            </mesh>
          )}

          {s.type === 'AEROSTAT' && (
            <mesh position={[0, 0.5, 0]}>
              <torusGeometry args={[1, 0.35, 12, 24]} />
              <meshStandardMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={1.5 * visibilityFactor}
                roughness={0.3}
                metalness={0.7}
                transparent
                opacity={visibilityFactor}
              />
            </mesh>
          )}

          {s.type === 'MONOLITH' && (
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1, 2.5, 0.4]} />
              <meshStandardMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={2.5 * visibilityFactor}
                roughness={0.05}
                metalness={0.95}
                transparent
                opacity={visibilityFactor}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Atmospheric Shuttles & Patrol Fleets */}
      <group ref={craftsRef}>
        {[...Array(8)].map((_, i) => {
          const orbitR = planetRadius + 0.25 + (i % 3) * 0.08;
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * orbitR,
                Math.sin(angle * 2) * 0.2,
                Math.sin(angle) * orbitR,
              ]}
              scale={[0.015, 0.015, 0.03]}
            >
              <coneGeometry args={[1, 2, 4]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
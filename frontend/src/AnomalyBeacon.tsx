import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AnomalyBeaconProps {
  coordinates: [number, number]; // [x, y] normalized (-1.0 to 1.0)
  planetRadius?: number;
}

export const AnomalyBeacon: React.FC<AnomalyBeaconProps> = ({
  coordinates,
  planetRadius = 1.5,
}) => {
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  // Convert 2D anomaly offset coordinates to 3D spherical position
  const [targetPos, normalQuat] = useMemo(() => {
    const [normX, normY] = coordinates;
    
    const theta = normX * Math.PI;
    const phi = ((normY + 1) / 2) * Math.PI;

    const r = planetRadius + 0.02;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);

    const pos = new THREE.Vector3(x, y, z);
    const normal = pos.clone().normalize();
    const defaultNormal = new THREE.Vector3(0, 0, 1);
    const quat = new THREE.Quaternion().setFromUnitVectors(defaultNormal, normal);

    return [pos, quat];
  }, [coordinates, planetRadius]);

  // Pulse animation loop
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (innerRingRef.current) {
      const innerScale = 1 + Math.sin(time * 4) * 0.15;
      innerRingRef.current.scale.set(innerScale, innerScale, 1);
    }

    if (outerRingRef.current) {
      const cycle = (time * 1.5) % 1;
      const outerScale = 1 + cycle * 1.8;
      outerRingRef.current.scale.set(outerScale, outerScale, 1);

      const mat = outerRingRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 0.8 * (1 - cycle));
      }
    }
  });

  return (
    <group position={targetPos} quaternion={normalQuat}>
      {/* Central Beacon Core */}
      <mesh>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color="#f43f5e" side={THREE.DoubleSide} />
      </mesh>

      {/* Static Inner Reticle */}
      <mesh ref={innerRingRef}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>

      {/* Expanding Radar Wave */}
      <mesh ref={outerRingRef}>
        <ringGeometry args={[0.12, 0.15, 32]} />
        <meshBasicMaterial color="#f43f5e" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};
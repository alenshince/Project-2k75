import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Entity75Mesh: React.FC = () => {
  const needleRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // High-frequency jitter and vertical light pulse
    if (needleRef.current) {
      needleRef.current.scale.y = 12 + Math.sin(t * 30) * 2.5;
      needleRef.current.scale.x = 0.08 + Math.sin(t * 45) * 0.03;
      needleRef.current.scale.z = 0.08 + Math.cos(t * 45) * 0.03;
      needleRef.current.rotation.y += 0.15;
    }

    if (flareRef.current) {
      const pulse = 1.0 + Math.sin(t * 20) * 0.25;
      flareRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Singularity Needle */}
      <mesh ref={needleRef}>
        <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Radiant White Core Corona */}
      <mesh ref={flareRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Violet-Tinged Event Horizon Boundary */}
      <mesh scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color="#c084fc"
          wireframe
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight color="#ffffff" intensity={25.0} distance={400} decay={1.0} />
    </group>
  );
};
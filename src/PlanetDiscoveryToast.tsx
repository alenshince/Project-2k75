import React, { useEffect, useState } from 'react';
import type { PlanetDossier } from './types';

interface PlanetDiscoveryToastProps {
  latestPlanet: PlanetDossier | null;
  onNavigate: (index: number) => void;
}

export const PlanetDiscoveryToast: React.FC<PlanetDiscoveryToastProps> = ({
  latestPlanet,
  onNavigate,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!latestPlanet) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4200);
    return () => clearTimeout(timer);
  }, [latestPlanet]);

  if (!visible || !latestPlanet) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '120px',
        right: '24px',
        zIndex: 50,
        pointerEvents: 'auto',
        fontFamily: "'Courier New', Courier, monospace",
        background: 'linear-gradient(135deg, rgba(3, 20, 46, 0.95) 0%, rgba(2, 6, 23, 0.95) 100%)',
        border: '1px solid #00e5ff',
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.35)',
        padding: '10px 16px',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#00e5ff',
          boxShadow: '0 0 8px #00e5ff',
        }}
      />
      <div>
        <div style={{ fontSize: '9px', color: '#00e5ff', letterSpacing: '2px' }}>
          DEEP SCAN // NEW SIGNATURE DETECTED
        </div>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc' }}>
          #{String(latestPlanet.catalogIndex).padStart(2, '0')}: {latestPlanet.designation}
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          onNavigate(latestPlanet.catalogIndex - 1);
          setVisible(false);
        }}
        style={{
          background: 'rgba(0, 229, 255, 0.15)',
          border: '1px solid #00e5ff',
          color: '#00e5ff',
          padding: '4px 10px',
          fontSize: '10px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        TRACK TARGET
      </button>
    </div>
  );
};

export default PlanetDiscoveryToast;
import React, { useState } from 'react';
import type { PlanetDossier } from './types';
import { audioSynth } from './audioSynthesizer';

interface PlanetSelectorHUDProps {
  catalog: PlanetDossier[];
  selectedIndex: number;
  onSelectPlanet: (index: number) => void;
}

export const PlanetSelectorHUD: React.FC<PlanetSelectorHUDProps> = ({
  catalog,
  selectedIndex,
  onSelectPlanet,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activePlanet = catalog[selectedIndex] || catalog[0];

  const handleStep = (direction: -1 | 1) => {
    audioSynth.playTelemetryPing();
    let next = selectedIndex + direction;
    if (next < 0) next = catalog.length - 1;
    if (next >= catalog.length) next = 0;
    onSelectPlanet(next);
  };

  const discoveredCount = catalog.filter((p) => p.isDiscovered).length;
  const verifiedCount = catalog.filter((p) => p.isCaptured).length;
  const isFoundational = activePlanet?.catalogIndex <= 10;

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        left: '24px',
        zIndex: 35,
        fontFamily: "'Courier New', Courier, monospace",
        pointerEvents: 'none',
      }}
    >
      {/* 1. Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.95) 0%, rgba(3, 20, 46, 0.90) 100%)',
          border: '1px solid #00e5ff',
          padding: '8px 14px',
          borderRadius: '2px',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.25)',
          pointerEvents: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => handleStep(-1)}
          style={{
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            color: '#00e5ff',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ◄
        </button>

        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: 'pointer',
            padding: '2px 8px',
            minWidth: '240px',
          }}
        >
          <div style={{ fontSize: '9px', color: '#00e5ff', letterSpacing: '2px' }}>
            SECTOR TARGET [#{String(activePlanet?.catalogIndex).padStart(2, '0')}/75]
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', color: '#f8fafc' }}>
            {activePlanet?.isDiscovered ? activePlanet.designation : '??? [UNRESOLVED SIGNAL]'}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleStep(1)}
          style={{
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            color: '#00e5ff',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ►
        </button>
      </div>

      {/* 2. Sub-Header Stats */}
      <div
        style={{
          marginTop: '6px',
          fontSize: '9px',
          letterSpacing: '1px',
          display: 'flex',
          gap: '8px',
          pointerEvents: 'auto',
        }}
      >
        <span style={{ color: isFoundational ? '#38bdf8' : '#eab308' }}>
          {isFoundational ? '● FOUNDATIONAL' : '▲ EXPEDITION'}
        </span>
        <span style={{ color: '#64748b' }}>
          DISCOVERED: {discoveredCount}/75 | VERIFIED: {verifiedCount}/75
        </span>
      </div>

      {/* 3. Dropdown Directory Showing All 75 Bodies */}
      {isOpen && (
        <div
          style={{
            marginTop: '8px',
            background: 'rgba(2, 6, 23, 0.98)',
            border: '1px solid #00e5ff',
            boxShadow: '0 0 30px rgba(0, 229, 255, 0.4)',
            padding: '10px',
            width: '380px',
            maxHeight: '380px',
            overflowY: 'auto',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              color: '#00e5ff',
              letterSpacing: '2px',
              borderBottom: '1px solid rgba(0, 229, 255, 0.3)',
              paddingBottom: '6px',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>FULL SECTOR MATRIX</span>
            <span>{discoveredCount}/75 DETECTED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {catalog.map((planet, idx) => {
              const isSelected = idx === selectedIndex;
              const isFound = planet.isDiscovered;

              return (
                <button
                  key={planet.catalogIndex}
                  type="button"
                  onClick={() => {
                    audioSynth.playTelemetryPing();
                    onSelectPlanet(idx);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 10px',
                    background: isSelected
                      ? 'rgba(0, 229, 255, 0.2)'
                      : isFound
                      ? 'rgba(3, 20, 46, 0.5)'
                      : 'rgba(15, 23, 42, 0.3)',
                    border: `1px solid ${
                      isSelected
                        ? '#00e5ff'
                        : isFound
                        ? 'rgba(0, 229, 255, 0.15)'
                        : 'rgba(100, 116, 139, 0.2)'
                    }`,
                    color: isSelected ? '#00e5ff' : isFound ? '#cbd5e1' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '11px',
                    textAlign: 'left',
                  }}
                >
                  <span>
                    <strong style={{ color: isFound ? '#00e5ff' : '#475569' }}>
                      #{String(planet.catalogIndex).padStart(2, '0')}
                    </strong>{' '}
                    {isFound ? planet.designation : '??? [UNRESOLVED]'}
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      color: !isFound
                        ? '#64748b'
                        : planet.isCaptured
                        ? '#34d399'
                        : '#eab308',
                    }}
                  >
                    {!isFound ? 'LOCKED' : planet.isCaptured ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanetSelectorHUD;
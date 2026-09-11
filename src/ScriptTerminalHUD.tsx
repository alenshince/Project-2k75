import React, { useState } from 'react';
import type { PlanetDossier } from './types';
import type { ScriptPhase } from './narrativeScriptEngine';

interface ScriptTerminalHUDProps {
  phase: ScriptPhase;
  activeDossier: PlanetDossier;
  isLocked: boolean;
  isCapturing: boolean;
  captureProgress: number;
  onRunCommand: (command: string) => void;
  onStartCapture: () => void;
  onCancelCapture: () => void;
  isSedated: boolean;
  onWakeUp: () => void;
  onOpenCodex: () => void;
}

export const ScriptTerminalHUD: React.FC<ScriptTerminalHUDProps> = ({
  phase,
  activeDossier,
  isLocked,
  isCapturing,
  captureProgress,
  onRunCommand,
  onStartCapture,
  onCancelCapture,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const isCaptured = Boolean(activeDossier?.isCaptured);

  // Check if this is the climactic human-engineered final world
  const isDoomPlanet = activeDossier?.designation === 'DOOMSNEXUS';
  const isDoomActive = isDoomPlanet && (isCapturing || phase === 'CRITICAL_ENTITY_75');

  // Dynamic color transitions: Emergency Red vs. Cockpit Cyan
  const themeColor = isDoomActive ? '#ef4444' : '#00e5ff';
  const themeGlow = isDoomActive ? 'rgba(239, 68, 68, 0.55)' : 'rgba(0, 229, 255, 0.35)';

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!commandInput.trim()) return;
    onRunCommand(commandInput.trim());
    setCommandInput('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        fontFamily: "'Courier New', Courier, monospace",
        zIndex: 25,
      }}
    >
      {/* Dynamic Keyframes for HUD Telemetry & Emergency Flash */}
      <style>{`
        @keyframes telemetry-blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(0.85); }
        }
        @keyframes red-alert-flash {
          0%, 100% { border-color: #ef4444; box-shadow: 0 0 35px rgba(239, 68, 68, 0.85); }
          50% { border-color: #7f1d1d; box-shadow: 0 0 10px rgba(127, 29, 29, 0.3); }
        }
        .blink-beacon {
          animation: telemetry-blink 1.2s infinite ease-in-out;
        }
        .red-alert-panel {
          animation: red-alert-flash 0.5s infinite alternate ease-in-out;
        }
      `}</style>

      {/* 1. FULLSCREEN RED ALERT PERIMETER BORDER DURING DOOMSNEXUS SCAN */}
      {isDoomPlanet && isCapturing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            boxShadow: 'inset 0 0 120px rgba(239, 68, 68, 0.95)',
            border: '4px solid #ef4444',
            pointerEvents: 'none',
            zIndex: 30,
            animation: 'red-alert-flash 0.3s infinite alternate',
          }}
        />
      )}

      {/* 2. TOP-CENTER SCAN BUTTON WITH DYNAMIC STATUS BANNER */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'auto',
        }}
      >
        <div
          className={isDoomActive ? 'red-alert-panel' : ''}
          style={{
            background: 'rgba(2, 6, 23, 0.95)',
            border: `1px solid ${themeColor}`,
            boxShadow: `0 0 15px ${themeGlow}`,
            padding: '10px 24px',
            textAlign: 'center',
            borderRadius: '2px',
          }}
        >
          <div style={{ color: themeColor, fontSize: '10px', letterSpacing: '2px', marginBottom: '4px' }}>
            {isDoomPlanet ? 'ALERT // RECURSIVE ARCHIVAL BREACH' : 'ADA (V.O.) // SATELLITE TELEMETRY LINK'}
          </div>
          <div style={{ color: isDoomActive ? '#fca5a5' : '#e2e8f0', fontSize: '11px', letterSpacing: '1px' }}>
            {isDoomActive
              ? 'FATAL ERROR: HUMAN ARCHIVAL OVERLOAD. SYSTEM STABILITY COLLAPSING...'
              : isCaptured
              ? 'SECTOR TELEMETRY VERIFIED & ARCHIVED.'
              : isCapturing
              ? `ACQUIRING MULTI-SPECTRUM SCAN... ${Math.round(captureProgress)}%`
              : isDoomPlanet
              ? 'ANOMALOUS HUMAN ARTIFACT DETECTED. SCAN AT YOUR OWN RISK.'
              : 'ANOMALY IN CROSSHAIRS. HOLD CAPTURE BUTTON.'}
          </div>
        </div>

        <button
          type="button"
          disabled={isCaptured}
          onMouseDown={onStartCapture}
          onMouseUp={onCancelCapture}
          onMouseLeave={onCancelCapture}
          onTouchStart={onStartCapture}
          onTouchEnd={onCancelCapture}
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: isCaptured
              ? 'rgba(34, 197, 94, 0.15)'
              : isDoomActive
              ? 'rgba(127, 29, 29, 0.4)'
              : 'rgba(3, 20, 46, 0.85)',
            border: `1px solid ${isCaptured ? '#22c55e' : themeColor}`,
            boxShadow: `0 0 15px ${themeGlow}`,
            color: isCaptured ? '#22c55e' : themeColor,
            padding: '12px 28px',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            cursor: isCaptured ? 'default' : 'pointer',
            userSelect: 'none',
            outline: 'none',
            borderRadius: '2px',
            minWidth: '340px',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
        >
          {isCapturing && !isCaptured && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${captureProgress}%`,
                background: isDoomPlanet ? 'rgba(239, 68, 68, 0.5)' : 'rgba(0, 229, 255, 0.4)',
                transition: 'width 0.05s linear',
                pointerEvents: 'none',
              }}
            />
          )}
          <span style={{ position: 'relative', zIndex: 2 }}>
            {isCaptured
              ? 'DOSSIER ARCHIVED [VERIFIED]'
              : isCapturing && isDoomPlanet
              ? `SYSTEM OVERHEAT: ${Math.round(captureProgress)}% [CRITICAL]`
              : isCapturing
              ? `SCANNING... ${Math.round(captureProgress)}%`
              : isDoomPlanet
              ? 'BREACH ENCRYPTED CORE [DOOMSNEXUS]'
              : isLocked
              ? 'HOLD TO CAPTURE DOSSIER [LOCKED]'
              : 'HOLD TO CAPTURE DOSSIER'}
          </span>
        </button>
      </div>

      {/* 3. TOP-RIGHT TELEMETRY PANEL */}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '6px',
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(2, 6, 23, 0.85)',
            border: `1px solid ${themeColor}`,
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '9px',
            color: themeColor,
            letterSpacing: '1px',
          }}
        >
          <span
            className="blink-beacon"
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: themeColor,
              boxShadow: `0 0 8px ${themeColor}`,
              display: 'inline-block',
            }}
          />
          {isDoomActive ? 'EMERGENCY RECURSIVE OVERRIDE' : 'NEURAL AUDIO LINK ACTIVE'}
        </div>

        <div
          style={{
            background: 'rgba(2, 6, 23, 0.92)',
            border: `1px solid ${themeColor}`,
            boxShadow: `0 0 15px ${themeGlow}`,
            padding: '12px 18px',
            borderRadius: '2px',
            width: '320px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: themeColor, fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
              DESIGNATION: {activeDossier.designation}
            </span>
            <span style={{ color: '#64748b', fontSize: '10px' }}>
              [#{String(activeDossier.catalogIndex).padStart(2, '0')}/75]
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>ORBIT / TEMP:</span>
              <span style={{ color: '#f8fafc' }}>
                {activeDossier.orbitalRadiusAU} AU | {activeDossier.surfaceTempKelvin} K
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>ARCHETYPE:</span>
              <span style={{ color: themeColor }}>{activeDossier.archetype}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
              <span>ORIGIN:</span>
              <span style={{ color: isDoomPlanet ? '#ef4444' : '#38bdf8', fontWeight: 'bold' }}>
                {isDoomPlanet ? 'HUMAN-CONSTRUCTED' : 'PROCEDURAL'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', marginTop: '4px' }}>
              <span>STATUS:</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  className={!isCaptured ? 'blink-beacon' : ''}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isCaptured ? '#34d399' : isDoomActive ? '#ef4444' : '#f59e0b',
                    boxShadow: `0 0 6px ${isCaptured ? '#34d399' : isDoomActive ? '#ef4444' : '#f59e0b'}`,
                    display: 'inline-block',
                  }}
                />
                <strong style={{ color: isCaptured ? '#34d399' : isDoomActive ? '#ef4444' : '#f59e0b' }}>
                  {isCaptured ? 'ARCHIVED & VERIFIED' : isDoomActive ? 'RECURSIVE BREACH' : 'UNVERIFIED'}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM-LEFT BIOMETRIC & ENCRYPTED STREAM */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          background: 'rgba(2, 6, 23, 0.92)',
          border: `1px solid ${themeColor}`,
          boxShadow: `0 0 15px ${themeGlow}`,
          padding: '14px 18px',
          borderRadius: '2px',
          maxWidth: '480px',
          pointerEvents: 'auto',
        }}
      >
        <div style={{ color: themeColor, fontSize: '10px', letterSpacing: '1px', marginBottom: '8px', fontWeight: 'bold' }}>
          {isDoomPlanet ? 'CRITICAL ENCRYPTION INTERFACE // DOOMSNEXUS' : 'REAL-TIME BIOMETRIC & TOPOGRAPHY STREAM'}
        </div>

        {isDoomPlanet ? (
          <div style={{ color: '#ef4444', fontSize: '10px', lineHeight: '1.6' }}>
            <div style={{ fontWeight: 'bold', letterSpacing: '1px' }}>
              [!] ARCHIVE ENCRYPTION DETECTED: HUMAN ORIGIN CONFIRMED
            </div>
            <div style={{ color: '#94a3b8' }}>
              STRUCTURE: Megascale Artificial Super-Server Chassis
            </div>
            <div style={{ color: '#94a3b8' }}>
              DATA STATUS: 100% OF HISTORICAL FILES CRYPTOGRAPHICALLY SCRAMBLED
            </div>
            <div style={{ color: '#fca5a5', marginTop: '4px' }}>
              WARNING: SCANNING WILL TRIGGER HARDWARE CASCADE AND SYSTEM COLLAPSE
            </div>
          </div>
        ) : isCaptured ? (
          <div style={{ color: '#94a3b8', fontSize: '10px', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>SURFACE: </span>
              {activeDossier.topography.description}
            </div>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ color: '#64748b' }}>ATMOSPHERE: </span>
              {activeDossier.atmosphere.primaryGas} ({activeDossier.atmosphere.primaryPercentage}%),{' '}
              {activeDossier.atmosphere.secondaryGas} ({activeDossier.atmosphere.secondaryPercentage}%)
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginTop: '6px' }}>
              <span>PRESSURE: {activeDossier.atmosphere.surfacePressureAtm} atm</span>
              <span>CIVILIZATION: {activeDossier.civilization.tier}</span>
            </div>
          </div>
        ) : (
          <div style={{ color: '#eab308', fontSize: '10px', lineHeight: '1.6' }}>
            <div>[!] DATA STREAM ENCRYPTED: REQUIRES RECON SCAN TO DECRYPT</div>
            <div style={{ color: '#64748b' }}>SURFACE: ///////////////////// [LOCKED]</div>
            <div style={{ color: '#64748b' }}>ATMOSPHERE: ///////////////// [LOCKED]</div>
            <div style={{ color: '#64748b' }}>ANOMALY SIGNATURE: READY FOR CAPTURE</div>
          </div>
        )}
      </div>

      {/* 5. BOTTOM-RIGHT COMMAND CONSOLE */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(2, 6, 23, 0.92)',
          border: `1px solid ${themeColor}`,
          boxShadow: `0 0 15px ${themeGlow}`,
          padding: '12px 16px',
          borderRadius: '2px',
          width: '420px',
          pointerEvents: 'auto',
        }}
      >
        <div style={{ color: themeColor, fontSize: '10px', letterSpacing: '1px', marginBottom: '6px' }}>
          &gt;_ COMMAND CONSOLE // {isDoomActive ? 'SAFETY INTERLOCK OVERRIDE' : 'MALLUVALY AI ACTIVE'}
        </div>

        <form onSubmit={handleCommandSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Commands: malluvaly search ksrtc, target 75, discover all"
            style={{
              flex: 1,
              background: 'rgba(3, 20, 46, 0.7)',
              border: `1px solid ${themeColor}`,
              color: '#f8fafc',
              padding: '6px 10px',
              fontSize: '11px',
              fontFamily: "'Courier New', Courier, monospace",
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              background: isDoomActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 229, 255, 0.15)',
              border: `1px solid ${themeColor}`,
              color: themeColor,
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            EXEC
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScriptTerminalHUD;
import React, { useEffect, useState } from 'react';

interface ReconCrosshairProps {
  anomalyCoords: { theta: number; phi: number };
  isCapturing: boolean;
  captureProgress: number;
  onLockStatusChange?: (locked: boolean) => void;
}

export const ReconCrosshair: React.FC<ReconCrosshairProps> = ({
  anomalyCoords,
  isCapturing,
  captureProgress,
  onLockStatusChange,
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Track mouse coordinates for the interactive targeting optic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Determine proximity to screen center (where the globe anomaly aligns)
      const dx = e.clientX - window.innerWidth / 2;
      const dy = e.clientY - window.innerHeight / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Lock on when crosshair is centered over the survey target zone
      const locked = distance < 180;
      setIsLocked(locked);
      if (onLockStatusChange) {
        onLockStatusChange(locked);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [onLockStatusChange]);

  const primaryBlue = isLocked ? '#00e5ff' : '#0091ea';
  const glowBlue = isLocked ? 'rgba(0, 229, 255, 0.6)' : 'rgba(0, 145, 234, 0.3)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 15,
        overflow: 'hidden',
        fontFamily: 'monospace',
      }}
    >
      {/* 1. Global Holographic Scanline Grid across the Viewport */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(rgba(0, 162, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 162, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 2. Central Static Orbital Alignment Ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '320px',
          height: '320px',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: `1px dashed ${glowBlue}`,
          boxShadow: `0 0 30px ${glowBlue}, inset 0 0 30px ${glowBlue}`,
        }}
      >
        {/* Animated Radar Sweep Needle */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 229, 255, 0.25) 100%)',
            animation: 'radarSweep 3s linear infinite',
          }}
        />
      </div>

      {/* 3. Dynamic Mouse-Follow Scanning Reticle */}
      <div
        style={{
          position: 'absolute',
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.05s ease-out',
        }}
      >
        {/* Outer Rotating Segmented Brackets */}
        <div
          style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            margin: '-60px 0 0 -60px',
            borderRadius: '50%',
            border: `2px solid ${primaryBlue}`,
            borderStyle: isLocked ? 'solid' : 'dashed',
            boxShadow: `0 0 15px ${primaryBlue}`,
            animation: 'reticleSpin 8s linear infinite',
          }}
        />

        {/* Center Precision Dot & Crosshairs */}
        <div
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            backgroundColor: primaryBlue,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 10px ${primaryBlue}`,
          }}
        />

        {/* Horizontal & Vertical Crosshair Lines */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-25px',
            width: '20px',
            height: '2px',
            backgroundColor: primaryBlue,
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-25px',
            width: '20px',
            height: '2px',
            backgroundColor: primaryBlue,
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '-25px',
            width: '2px',
            height: '20px',
            backgroundColor: primaryBlue,
            transform: 'translateX(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-25px',
            width: '2px',
            height: '20px',
            backgroundColor: primaryBlue,
            transform: 'translateX(-50%)',
          }}
        />

        {/* Real-time Tracking Readout Floating Beside Cursor */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '50px',
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            border: `1px solid ${primaryBlue}`,
            padding: '4px 8px',
            borderRadius: '4px',
            color: primaryBlue,
            fontSize: '10px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          }}
        >
          <div>MODE: {isLocked ? 'TARGET_LOCK' : 'SEARCH_RECON'}</div>
          <div>AZM: {(mousePos.x / 100).toFixed(2)}° | ELEV: {(mousePos.y / 100).toFixed(2)}°</div>
          <div>ANOMALY_REF: [{anomalyCoords.theta.toFixed(2)}, {anomalyCoords.phi.toFixed(2)}]</div>
          {isCapturing && (
            <div style={{ color: '#38bdf8', marginTop: '2px' }}>
              ACQUIRING TELEMETRY: {Math.floor(captureProgress)}%
            </div>
          )}
        </div>
      </div>

      {/* Embedded CSS Keyframe Animations */}
      <style>{`
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes reticleSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ReconCrosshair;
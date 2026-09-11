import React, { useState, useEffect } from 'react';
import { audioSynth } from './audioSynthesizer';

interface GlitchAnomalyFXProps {
  active: boolean;
  onReboot?: () => void;
}

export const GlitchAnomalyFX: React.FC<GlitchAnomalyFXProps> = ({
  active,
  onReboot,
}) => {
  const [memoryDump, setMemoryDump] = useState<string[]>([]);

  // Trigger crash audio blast and start streaming stack panic logs
  useEffect(() => {
    if (!active) return;

    // Trigger instant audio crash burst
    try {
      audioSynth.playCrashGlitchBurst();
    } catch {
      // Audio safety fallback
    }

    const initialDump = [
      'FATAL TRAP 0x0000007E // KERNEL_SYNAPSE_CORRUPTION',
      'FAULTING_IP: neural_bus_link!core_desync+0x14A',
      'EXCEPTION_CODE: (NTSTATUS) 0xC0000005 - ACCESS_VIOLATION_DOOMSNEXUS',
      'STACK_OVERFLOW IN RETINAL_BUFFER_STREAM (LINE 04)',
      'HARDWARE TELEMETRY INTERRUPT: SYNTHETIC HUMAN CONSTRUCT COLLAPSE',
      'CRITICAL BUS DROP: ALL COCKPIT TELEMETRY SEVERED',
    ];
    setMemoryDump(initialDump);

    const interval = setInterval(() => {
      const hex1 = Math.random().toString(16).substring(2, 6).toUpperCase();
      const hex2 = Math.random().toString(16).substring(2, 6).toUpperCase();
      const line = `0x${hex1} : 0x${hex2} : IRQ_${Math.floor(Math.random() * 32)} // UNRECOVERABLE_CORE_PANIC`;
      
      setMemoryDump((prev) => [...prev.slice(-14), line]);
    }, 140);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999, // Highest priority stack layer above all HUDs
        backgroundColor: '#010204',
        color: '#ff2222',
        fontFamily: "'Courier New', Courier, monospace",
        overflow: 'hidden',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px',
        boxSizing: 'border-box',
      }}
    >
      {/* Glitch Animations, Noise Grain & Screen Slicing */}
      <style>{`
        @keyframes violent-shake {
          0% { transform: translate(0, 0) skew(0deg); }
          15% { transform: translate(-5px, 4px) skew(-1.5deg); }
          30% { transform: translate(6px, -3px) skew(1deg); }
          45% { transform: translate(-4px, -3px) skew(2deg); }
          60% { transform: translate(5px, 4px) skew(-1deg); }
          75% { transform: translate(-3px, 1px) skew(0.5deg); }
          100% { transform: translate(0, 0) skew(0deg); }
        }

        @keyframes noise-shift {
          0%, 100% { background-position: 0 0; }
          20% { background-position: -40px 30px; }
          40% { background-position: 50px -20px; }
          60% { background-position: -30px -40px; }
          80% { background-position: 20px 50px; }
        }

        @keyframes tear-bar {
          0% { top: -10%; height: 30px; opacity: 0.9; }
          50% { top: 60%; height: 80px; opacity: 0.4; }
          100% { top: 110%; height: 20px; opacity: 0.8; }
        }

        @keyframes rgb-split {
          0% { text-shadow: 3px 0 #00ffff, -3px 0 #ff0055; }
          50% { text-shadow: -4px 0 #00ffff, 4px 0 #ff0055; }
          100% { text-shadow: 3px 0 #00ffff, -3px 0 #ff0055; }
        }

        .screen-shake-layer {
          animation: violent-shake 0.22s infinite ease-in-out;
        }

        .rgb-glitch-text {
          animation: rgb-split 0.12s infinite;
        }

        /* Continuous SVG Noise Grain Overlay */
        .noise-grain-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.22;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: noise-shift 0.15s steps(3) infinite;
          z-index: 1000000;
        }

        /* Scanline Raster */
        .scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.75) 51%
          );
          background-size: 100% 3px;
          pointer-events: none;
          z-index: 1000001;
        }

        /* Glitch Tear Bars */
        .glitch-tear {
          position: absolute;
          left: 0;
          width: 100%;
          background: rgba(255, 34, 34, 0.22);
          backdrop-filter: invert(0.8) hue-rotate(180deg);
          pointer-events: none;
          animation: tear-bar 1.8s infinite linear;
          z-index: 1000002;
        }

        .reboot-btn:hover {
          background: #ff2222 !important;
          color: #000000 !important;
          box-shadow: 0 0 35px rgba(255, 34, 34, 0.9) !important;
        }
      `}</style>

      {/* Layer 1: Animated Noise Grain */}
      <div className="noise-grain-overlay" />

      {/* Layer 2: CRT Scanlines */}
      <div className="scanlines" />

      {/* Layer 3: Moving Glitch Tear Slices */}
      <div className="glitch-tear" />
      <div className="glitch-tear" style={{ animationDelay: '0.9s', height: '50px' }} />

      {/* Peripheral Red Panic Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 160px rgba(0, 0, 0, 0.95), inset 0 0 60px rgba(255, 0, 0, 0.4)',
          pointerEvents: 'none',
          zIndex: 1000003,
        }}
      />

      {/* TOP HEADER: CRASH TITLE */}
      <div className="screen-shake-layer" style={{ zIndex: 1000005 }}>
        <div
          className="rgb-glitch-text"
          style={{
            fontSize: '26px',
            fontWeight: 'bold',
            letterSpacing: '4px',
            color: '#ff2222',
            marginBottom: '8px',
          }}
        >
          FATAL CRASH // SIMULATOR BRAIN DEAD
        </div>
        <div style={{ fontSize: '12px', color: '#f87171', letterSpacing: '2px' }}>
          CORE 04 SYNAPSE SEVERED // UNRECOVERABLE HARDWARE EXPLOSION DETECTED
        </div>
      </div>

      {/* CENTER: STREAMING MEMORY REGISTERS */}
      <div
        style={{
          background: 'rgba(10, 0, 0, 0.92)',
          border: '1px solid rgba(255, 34, 34, 0.5)',
          boxShadow: '0 0 30px rgba(255, 0, 0, 0.25)',
          padding: '20px 24px',
          borderRadius: '2px',
          maxWidth: '850px',
          lineHeight: '1.6',
          fontSize: '11px',
          zIndex: 1000005,
        }}
      >
        <div style={{ color: '#ff4444', marginBottom: '10px', fontWeight: 'bold' }}>
          --- KERNEL FAULT TRACE BUFFER [DUMP COMPLETE] ---
        </div>
        {memoryDump.map((item, index) => (
          <div key={index} style={{ color: index < 3 ? '#fca5a5' : '#7f1d1d' }}>
            {item}
          </div>
        ))}
      </div>

      {/* BOTTOM FOOTER: RECOVERY ACTION */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000005,
          borderTop: '1px solid rgba(255, 34, 34, 0.3)',
          paddingTop: '20px',
        }}
      >
        <div style={{ fontSize: '11px', color: '#991b1b', letterSpacing: '1px' }}>
          SEC_AUTH: 0xDEADBEEF // HARDWARE SAFETIES DISENGAGED
        </div>

        <button
          type="button"
          className="reboot-btn"
          onClick={onReboot}
          style={{
            background: 'rgba(255, 34, 34, 0.15)',
            border: '1px solid #ff2222',
            color: '#ff2222',
            padding: '12px 28px',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            cursor: 'pointer',
            fontFamily: "'Courier New', Courier, monospace",
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          [!] RE-INITIALIZE SYNAPSE LINK
        </button>
      </div>
    </div>
  );
};

export default GlitchAnomalyFX;
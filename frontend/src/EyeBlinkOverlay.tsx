import React, { useState, useEffect } from 'react';

interface EyeBlinkOverlayProps {
  /** Trigger a manual blink cycle when this value changes */
  triggerKey?: number | string;
  /** Whether eyelids start closed and simulate waking up */
  wakeUpOnMount?: boolean;
}

export const EyeBlinkOverlay: React.FC<EyeBlinkOverlayProps> = ({
  triggerKey,
  wakeUpOnMount = true,
}) => {
  const [isAwake, setIsAwake] = useState(!wakeUpOnMount);

  useEffect(() => {
    if (wakeUpOnMount) {
      // Allow 2.5s for the wake-up animation to complete, then unmount eyelids
      const timer = setTimeout(() => {
        setIsAwake(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [wakeUpOnMount]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* Wake-Up Flutter Eyelid Animation */
        @keyframes wakeUpUpper {
          0% { transform: translateY(0%); }
          25% { transform: translateY(-30%); }
          40% { transform: translateY(-5%); }
          65% { transform: translateY(-70%); }
          80% { transform: translateY(-20%); }
          100% { transform: translateY(-100%); }
        }

        @keyframes wakeUpLower {
          0% { transform: translateY(0%); }
          25% { transform: translateY(30%); }
          40% { transform: translateY(5%); }
          65% { transform: translateY(70%); }
          80% { transform: translateY(20%); }
          100% { transform: translateY(100%); }
        }

        .eyelid-upper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 55%;
          background: radial-gradient(ellipse at 50% 0%, #000000 65%, rgba(0, 0, 0, 0.95) 100%);
          border-bottom: 2px solid rgba(15, 23, 42, 0.8);
          border-bottom-left-radius: 50% 25px;
          border-bottom-right-radius: 50% 25px;
          animation: wakeUpUpper 2.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .eyelid-lower {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 55%;
          background: radial-gradient(ellipse at 50% 100%, #000000 65%, rgba(0, 0, 0, 0.95) 100%);
          border-top: 2px solid rgba(15, 23, 42, 0.8);
          border-top-left-radius: 50% 25px;
          border-top-right-radius: 50% 25px;
          animation: wakeUpLower 2.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* Subtle dark peripheral vignette for eyesight immersion */
        .eye-vignette {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.85);
          pointer-events: none;
        }
      `}</style>

      {/* Peripheral vision shadow */}
      <div className="eye-vignette" />

      {/* Render eyelids during initial boot or when triggered */}
      {!isAwake && (
        <>
          <div key={`upper-${triggerKey || 'init'}`} className="eyelid-upper" />
          <div key={`lower-${triggerKey || 'init'}`} className="eyelid-lower" />
        </>
      )}
    </div>
  );
};

export default EyeBlinkOverlay;
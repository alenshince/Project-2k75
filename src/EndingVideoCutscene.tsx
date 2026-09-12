import React, { useRef, useEffect, useState } from 'react';

export interface EndingVideoCutsceneProps {
  /** Callback fired when the video completes or is skipped */
  onRestart: () => void;
  /** Video file path relative to public/ (defaults to '/ending.mp4') */
  videoSrc?: string;
}

export const EndingVideoCutscene: React.FC<EndingVideoCutsceneProps> = ({
  onRestart,
  videoSrc = `${import.meta.env.BASE_URL}ending.mp4`,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasAutoplayFailed, setHasAutoplayFailed] = useState<boolean>(false);

  // Handle Autoplay & Keyboard shortcuts
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser prevents unmuted autoplay, display user interaction fallback
          setHasAutoplayFailed(true);
        });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onRestart]);

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setHasAutoplayFailed(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        zIndex: 1000010,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* Fullscreen Video Player */}
      <video
        ref={videoRef}
        src={videoSrc}
        onEnded={onRestart}
        onError={() => {
          console.warn('Ending video failed to load, returning to survey hub');
          onRestart();
        }}
        playsInline
        autoPlay
        controls={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Manual Click-to-Play Overlay (Only shows if browser blocks unmuted audio) */}
      {hasAutoplayFailed && (
        <div
          onClick={handleManualPlay}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            cursor: 'pointer',
            zIndex: 1000015,
          }}
        >
          <div
            style={{
              padding: '16px 28px',
              border: '1px solid #00e5ff',
              background: 'rgba(2, 6, 23, 0.95)',
              color: '#00e5ff',
              fontSize: '12px',
              letterSpacing: '2px',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)',
            }}
          >
            CLICK TO INITIALIZE AUDIO & TRANSMISSION
          </div>
        </div>
      )}

      {/* Skip Button */}
      <button
        type="button"
        onClick={onRestart}
        style={{
          position: 'absolute',
          bottom: '32px',
          right: '32px',
          background: 'rgba(2, 6, 23, 0.85)',
          border: '1px solid #00e5ff',
          color: '#00e5ff',
          boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)',
          padding: '10px 22px',
          fontSize: '11px',
          letterSpacing: '2px',
          fontWeight: 'bold',
          cursor: 'pointer',
          outline: 'none',
          borderRadius: '2px',
          zIndex: 1000020,
          fontFamily: "'Courier New', Courier, monospace",
          transition: 'all 0.2s ease',
        }}
      >
        SKIP TRANSMISSION [ESC]
      </button>

      {/* Top Banner Archive Tag */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          color: '#00e5ff',
          fontSize: '11px',
          letterSpacing: '2px',
          background: 'rgba(2, 6, 23, 0.75)',
          padding: '6px 14px',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          borderRadius: '2px',
          pointerEvents: 'none',
          zIndex: 1000020,
        }}
      >
        TRANSMISSION ARCHIVE // POST-CRASH DEBRIEF
      </div>

      {/* Cinematic Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 120px rgba(0, 0, 0, 0.85)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default EndingVideoCutscene;
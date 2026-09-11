import React, { useRef, useState } from 'react';
import { audioSynth } from './audioSynthesizer';

export interface VideoPrologueProps {
  onComplete: () => void;
  videoSrc?: string;
}

export const VideoPrologue: React.FC<VideoPrologueProps> = ({
  onComplete,
  videoSrc = '/prologue.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Transition straight into the 3D globe cockpit
  const handleFinish = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    audioSynth.startAmbientDrone();
    audioSynth.playTelemetryPing();
    onComplete();
  };

  // Trigger video playback with explicit user gesture
  const handleStartPlayback = () => {
    setHasStarted(true);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error or browser autoplay policy restriction:', err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => setHasError(true));
          }
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none font-mono text-white">
      {/* 1. Launch Gate / Missing Video Fallback Card */}
      {(!hasStarted || hasError) && (
        <div className="relative z-20 flex flex-col items-center gap-5 p-8 bg-slate-950/95 border border-cyan-900/60 rounded-lg shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center max-w-lg mx-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Mission Transmission // Boot Phase</span>
          </div>

          {hasError ? (
            <div className="text-xs text-amber-300/90 leading-relaxed bg-amber-950/30 p-3 rounded border border-amber-800/40">
              Note: <code className="text-white font-mono">{videoSrc}</code> is not in your <code className="text-white font-mono">public/</code> directory yet. You can bypass this and explore the 3D globe immediately.
            </div>
          ) : (
            <p className="text-xs text-slate-400 leading-relaxed">
              PROJECT 2K75 neural stream prepared. Click below to begin video transmission or jump directly into the orbital simulator.
            </p>
          )}

          <div className="flex items-center gap-3 w-full justify-center pt-2">
            {!hasError && (
              <button
                type="button"
                onClick={handleStartPlayback}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                PLAY VIDEO &rarr;
              </button>
            )}

            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-cyan-800/70 text-cyan-300 font-bold text-xs rounded tracking-widest transition-all cursor-pointer"
            >
              LAUNCH SIMULATOR &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 2. Fullscreen Video Player Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        onEnded={handleFinish}
        onError={() => setHasError(true)}
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          hasStarted && isPlaying && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 3. CRT Scanline Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

      {/* 4. Skip Transmission Button */}
      {hasStarted && !hasError && (
        <div className="absolute bottom-8 right-8 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={handleFinish}
            className="flex items-center gap-2 px-4 py-2 bg-slate-950/80 hover:bg-slate-900 border border-cyan-900/60 hover:border-cyan-500/80 rounded text-xs text-cyan-400 tracking-wider transition-all cursor-pointer shadow-lg"
          >
            <span>[SKIP TRANSMISSION]</span>
            <span className="text-[10px] text-slate-500">&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPrologue;
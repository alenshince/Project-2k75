import React, { useState, useEffect } from 'react';
import { AlertOctagon, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { audioSynth } from './audioSynthesizer';

interface CitadelCutsceneProps {
  onRestart: () => void;
}

interface ScriptLine {
  id: number;
  speaker: string;
  text: string;
  delayMs: number;
  isWarning?: boolean;
}

const NARRATIVE_SEQUENCE: ScriptLine[] = [
  { id: 1, speaker: 'SYS_CORE', text: 'CRITICAL OVERLOAD: OPTICAL FEED SEVERED AT RETINAL LINK 04.', delayMs: 600, isWarning: true },
  { id: 2, speaker: 'ARCHIVE_DAEMON', text: 'Target ENTITY-75 classification: NON-EUCLIDEAN SINGULARITY.', delayMs: 1400 },
  { id: 3, speaker: 'CITADEL_CONTROL', text: 'All field observers stand down. Do not look directly into the focal aperture.', delayMs: 1600 },
  { id: 4, speaker: 'SYS_CORE', text: 'Dumping volatile survey telemetry into local permanent storage...', delayMs: 1200 },
  { id: 5, speaker: 'ARCHIVE_DAEMON', text: 'Survey indices 01 through 74 safely committed to the Archival Codex.', delayMs: 1400 },
  { id: 6, speaker: 'CITADEL_CONTROL', text: 'Neural cradle sedative purge in progress. Purging sensory dampeners.', delayMs: 1800 },
  { id: 7, speaker: 'SYS_CORE', text: 'STATUS: RECOVERY CYCLE COMPLETE. STANDING BY FOR SYNAPSE REBOOT.', delayMs: 1000 },
];

export const CitadelCutscene: React.FC<CitadelCutsceneProps> = ({ onRestart }) => {
  const [displayedLines, setDisplayedLines] = useState<ScriptLine[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [hexCorruptions, setHexCorruptions] = useState<string[]>([]);

  // Stream script logs line by line
  useEffect(() => {
    let currentStep = 0;
    // Using ReturnType<typeof setTimeout> ensures compatibility across browser and node environments
    let timer: ReturnType<typeof setTimeout>;

    const playNextLine = () => {
      if (currentStep < NARRATIVE_SEQUENCE.length) {
        const line = NARRATIVE_SEQUENCE[currentStep];
        setDisplayedLines((prev) => [...prev, line]);
        
        if (line.isWarning) {
          audioSynth.playHazardAlert();
        } else {
          audioSynth.playTelemetryPing();
        }

        currentStep += 1;
        timer = setTimeout(playNextLine, line.delayMs);
      } else {
        setIsComplete(true);
        audioSynth.playTargetChirp();
      }
    };

    timer = setTimeout(playNextLine, 500);
    return () => clearTimeout(timer);
  }, []);

  // Background stream of memory corruptions
  useEffect(() => {
    const interval = setInterval(() => {
      const randomHex = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0')
      ).join(' : ');
      setHexCorruptions((prev) => [randomHex, ...prev.slice(0, 14)]);
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 font-mono select-none overflow-hidden">
      {/* Background desync lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none text-[10px] text-cyan-500 overflow-hidden leading-relaxed px-4 py-2">
        {hexCorruptions.map((line, idx) => (
          <div key={idx}>0x{line} // MEM_SEGMENT_FAULT</div>
        ))}
      </div>

      {/* Main Terminal Shell */}
      <div className="relative w-full max-w-2xl bg-slate-950/90 border border-red-500/60 rounded shadow-[0_0_40px_rgba(239,68,68,0.25)] p-6 z-10 flex flex-col justify-between min-h-[440px]">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs tracking-wider">
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            <span>EMERGENCY PROTOCOL // DESYNC SEQUENCE ACTIVE</span>
          </div>
          <div className="text-[10px] text-slate-500 tracking-widest">
            FOCAL_CH_75 // TERMINAL DISCONNECT
          </div>
        </div>

        {/* Narrative Dialogue Body */}
        <div className="my-6 space-y-3 flex-1 overflow-y-auto pr-2 max-h-64">
          {displayedLines.map((line) => (
            <div
              key={line.id}
              className={`p-2.5 rounded border text-xs leading-relaxed transition-all ${
                line.isWarning
                  ? 'bg-red-950/60 border-red-500/50 text-red-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] font-bold tracking-wider text-cyan-400">
                  {line.speaker}
                </span>
              </div>
              <p>{line.text}</p>
            </div>
          ))}
        </div>

        {/* Action Prompt Footer */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            {isComplete ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SYSTEM READY FOR CYCLE REBOOT
              </span>
            ) : (
              <span className="text-amber-400 animate-pulse">
                &gt; PROCESSING DESYNCHRONIZATION BUFFER...
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!isComplete}
            onClick={onRestart}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all ${
              isComplete
                ? 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer'
                : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isComplete ? '' : 'animate-spin'}`} />
            <span>RE-INITIALIZE SYNAPSE LINK</span>
          </button>
        </div>

      </div>
    </div>
  );
};
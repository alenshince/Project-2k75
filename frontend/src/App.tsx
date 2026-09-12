import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CosmicScene } from './CosmicScene';
import { ReconCrosshair } from './ReconCrosshair';
import { ScriptTerminalHUD } from './ScriptTerminalHUD';
import { PlanetSelectorHUD } from './PlanetSelectorHUD';
import { EyeBlinkOverlay } from './EyeBlinkOverlay';
import { PlanetDiscoveryToast } from './PlanetDiscoveryToast';
import { ArchivalCodex } from './ArchivalCodex';
import { GlitchAnomalyFX } from './GlitchAnomalyFX';
import { VideoPrologue } from './VideoPrologue';
import { EndingVideoCutscene } from './EndingVideoCutscene';
import { audioSynth } from './audioSynthesizer';
import { planetCatalog as fullCatalog } from './planetCatalog';
import type { PlanetDossier, ViewportMode } from './types';
import type { ScriptPhase } from './narrativeScriptEngine';

export const App: React.FC = () => {
  // 0. Prologue overlay state (starts active on initial page load)
  const [isPrologueActive, setIsPrologueActive] = useState<boolean>(true);

  // 1. Core catalog state containing all 75 planetary dossiers
  const [catalog, setCatalog] = useState<PlanetDossier[]>(fullCatalog);
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState<number>(0);
  const [scriptPhase, setScriptPhase] = useState<ScriptPhase>('DISCOVERY_01');
  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewportMode>('FOCUS');
  const [isSedated, setIsSedated] = useState<boolean>(false);

  // 2. Scanner hold-to-capture states
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [captureProgress, setCaptureProgress] = useState<number>(0);
  const [isReticleLocked, setIsReticleLocked] = useState<boolean>(true);
  const captureTimerRef = useRef<number | null>(null);

  // 3. Telemetry discovery toast notification state
  const [recentlyFoundPlanet, setRecentlyFoundPlanet] = useState<PlanetDossier | null>(null);

  // Currently focused planet dossier
  const activeDossier: PlanetDossier = catalog[selectedPlanetIndex] || catalog[0];

  // =========================================================================
  // AUTOMATIC 5-SECOND EXPEDITION DISCOVERY LOOP (#11 through #75)
  // =========================================================================
  useEffect(() => {
    // Discovery ticker runs only after the prologue is dismissed
    if (isPrologueActive) return;

    const discoveryInterval = window.setInterval(() => {
      setCatalog((prevCatalog) => {
        // Locate the first unrevealed planet in sequence
        const nextIndex = prevCatalog.findIndex((planet) => !planet.isDiscovered);

        if (nextIndex === -1) {
          return prevCatalog;
        }

        const discoveredPlanet = {
          ...prevCatalog[nextIndex],
          isDiscovered: true,
        };

        setRecentlyFoundPlanet(discoveredPlanet);
        try {
          audioSynth.playTelemetryPing();
        } catch {
          // Autoplay protection fallback
        }

        return prevCatalog.map((planet, idx) =>
          idx === nextIndex ? discoveredPlanet : planet
        );
      });
    }, 5000);

    return () => window.clearInterval(discoveryInterval);
  }, [isPrologueActive]);

  // =========================================================================
  // MULTI-SPECTRUM SCANNING & DOOMSNEXUS CRASH SEQUENCE
  // =========================================================================
  const handleStartCapture = useCallback(() => {
    if (!activeDossier || activeDossier.isCaptured) return;
    setIsCapturing(true);

    if (captureTimerRef.current) clearInterval(captureTimerRef.current);

    captureTimerRef.current = window.setInterval(() => {
      setCaptureProgress((prev) => {
        const next = prev + 3.0;
        audioSynth.playScanSweep(next);

        // DOOMSNEXUS CRASH: Abrupt failure at 40% scan progress
        if (activeDossier.designation === 'DOOMSNEXUS' && next >= 40) {
          if (captureTimerRef.current) {
            clearInterval(captureTimerRef.current);
            captureTimerRef.current = null;
          }
          setIsCapturing(false);
          setCaptureProgress(0);

          audioSynth.startSingularityDissonance();
          setScriptPhase('CRITICAL_ENTITY_75');
          return 0;
        }

        // Standard planet verification at 100% completion
        if (next >= 100) {
          if (captureTimerRef.current) {
            clearInterval(captureTimerRef.current);
            captureTimerRef.current = null;
          }
          audioSynth.playShutterClack();

          // Mark only active world as verified
          setCatalog((prevList) =>
            prevList.map((planet, idx) =>
              idx === selectedPlanetIndex ? { ...planet, isCaptured: true } : planet
            )
          );

          if (selectedPlanetIndex < catalog.length - 1) {
            setSelectedPlanetIndex((prev) => prev + 1);
            setScriptPhase('DISCOVERY_02');
          }

          setIsCapturing(false);
          return 0;
        }
        return next;
      });
    }, 55);
  }, [activeDossier, selectedPlanetIndex, catalog.length]);

  const handleCancelCapture = useCallback(() => {
    if (captureTimerRef.current) {
      clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }
    setIsCapturing(false);
    if (!activeDossier?.isCaptured) {
      setCaptureProgress(0);
    }
  }, [activeDossier]);

  // Cancel active scan on planet change
  useEffect(() => {
    handleCancelCapture();
  }, [selectedPlanetIndex, handleCancelCapture]);

  // =========================================================================
  // COMMAND CONSOLE, MANUAL DISCOVERY OVERRIDE & MALLUVALY AI PARSER
  // =========================================================================
  const handleRunCommand = (command: string) => {
    const rawCmd = command.trim();
    const cmd = rawCmd.toLowerCase();

    try {
      audioSynth.playTelemetryPing();
    } catch {
      // Audio fallback
    }

    // 1. Instant Reveal All Override
    if (cmd === 'discover all' || cmd === 'reveal all' || cmd === 'unlock all') {
      setCatalog((prev) => prev.map((planet) => ({ ...planet, isDiscovered: true })));
      try {
        audioSynth.playShutterClack();
      } catch {
        // Audio fallback
      }
      return;
    }

    // 2. Anomaly Scan Command
    if (cmd === 'scan') {
      handleStartCapture();
      return;
    }

    // 3. Viewport Mode Switch
    if (cmd === 'focus' || cmd === 'system' || cmd === 'surface') {
      setViewMode(cmd.toUpperCase() as ViewportMode);
      return;
    }

    // 4. Malluvaly AI Search Engine
    if (cmd.startsWith('malluvaly search ') || cmd.startsWith('malluvaly ')) {
      const searchTerm = cmd
        .replace('malluvaly search ', '')
        .replace('malluvaly ', '')
        .trim();

      if (!searchTerm) return;

      const targetIndex = catalog.findIndex((p) => {
        const designationMatch = p.designation.toLowerCase().includes(searchTerm);
        const archetypeMatch = p.archetype.toLowerCase().includes(searchTerm);
        const anomalyMatch = p.anomalyDescription.toLowerCase().includes(searchTerm);
        return designationMatch || archetypeMatch || anomalyMatch;
      });

      if (targetIndex !== -1) {
        setCatalog((prev) =>
          prev.map((planet, idx) =>
            idx === targetIndex ? { ...planet, isDiscovered: true } : planet
          )
        );
        setSelectedPlanetIndex(targetIndex);
        try {
          audioSynth.playShutterClack();
        } catch {
          // Audio fallback
        }
      }
      return;
    }

    // 5. Malluvaly Directory List
    if (cmd === 'malluvaly list') {
      const firstTarget = catalog.findIndex((p) => p.isMalluvalyTarget);
      if (firstTarget !== -1) {
        setSelectedPlanetIndex(firstTarget);
      }
      return;
    }

    // 6. Direct Target Index Command
    if (cmd.startsWith('target ')) {
      const targetNum = parseInt(cmd.replace('target ', '').trim(), 10);
      const targetIdx = catalog.findIndex((p) => p.catalogIndex === targetNum);
      if (targetIdx !== -1) {
        setCatalog((prev) =>
          prev.map((planet, idx) =>
            idx === targetIdx ? { ...planet, isDiscovered: true } : planet
          )
        );
        setSelectedPlanetIndex(targetIdx);
      }
      return;
    }

    // 7. Archival Codex Command
    if (cmd === 'codex' || cmd === 'archive') {
      setIsCodexOpen(true);
      return;
    }

    // 8. Sedate Crew Command
    if (cmd === 'sedate') {
      setIsSedated(true);
      return;
    }
  };

  // Safe coordinates normalization
  const anomalyCoordsTuple: [number, number] = Array.isArray(activeDossier.anomalyCoordinates)
    ? [activeDossier.anomalyCoordinates[0] ?? 0.14, activeDossier.anomalyCoordinates[1] ?? 0.52]
    : [
        activeDossier.anomalyCoordinates?.theta ?? 0.14,
        activeDossier.anomalyCoordinates?.phi ?? 0.52,
      ];

  // Dynamic visual transformation for DOOMSNEXUS (#75)
  const isDoomsnexus = activeDossier.designation === 'DOOMSNEXUS';
  const isAwakened = isDoomsnexus && (isCapturing || scriptPhase === 'CRITICAL_ENTITY_75');

  const planetPrimaryColor = isAwakened
    ? '#7f1d1d' // Hostile red during scan/crash
    : activeDossier.visuals?.palette?.primaryColor || '#005F73';

  const planetAtmosphereColor = isAwakened
    ? '#ef4444' // Warning red atmosphere
    : activeDossier.visuals?.palette?.atmosphereColor || '#E9D8A6';

  const planetStarColor = isAwakened
    ? '#ff0000'
    : activeDossier.visuals?.starColor || '#FFF8DC';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        overflow: 'hidden',
        userSelect: 'none',
        margin: 0,
        padding: 0,
      }}
    >
      {/* 0. CINEMATIC VIDEO PROLOGUE */}
      {isPrologueActive && (
        <VideoPrologue
          videoSrc={`${import.meta.env.BASE_URL}prologue.mp4`}
          onComplete={() => setIsPrologueActive(false)}
        />
      )}

      {/* 1. FIRST-PERSON EYE BLINK / WAKE-UP OVERLAY */}
      {!isPrologueActive && <EyeBlinkOverlay wakeUpOnMount={true} />}

      {/* 2. 5-SECOND INCOMING TELEMETRY TOAST */}
      {!isPrologueActive && scriptPhase !== 'CRITICAL_ENTITY_75' && (
        <PlanetDiscoveryToast
          latestPlanet={recentlyFoundPlanet}
          onNavigate={(index: number) => setSelectedPlanetIndex(index)}
        />
      )}

      {/* 3. FULLSCREEN 3D WEBGL VIEWPORT */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'auto',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 4.0], fov: 45 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          style={{ width: '100vw', height: '100vh', display: 'block' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 3, 5]} intensity={2.2} />
          <OrbitControls
            makeDefault
            target={[0, 0, 0]}
            enablePan={false}
            enableZoom={true}
            minDistance={2.0}
            maxDistance={8.5}
            rotateSpeed={0.8}
            dampingFactor={0.05}
            enableDamping={true}
          />
          <CosmicScene
            color={planetPrimaryColor}
            archetype={activeDossier.archetype}
            atmosphereColor={planetAtmosphereColor}
            scale={1.0}
            hasRings={Boolean(activeDossier.visuals?.hasRings)}
            orbitalRadiusAU={activeDossier.orbitalRadiusAU || 1.0}
            starColor={planetStarColor}
            starRadius={activeDossier.visuals?.starRadius || 1.0}
            viewMode={viewMode}
            targetName={activeDossier.designation}
            anomalyCoordinates={anomalyCoordsTuple}
            isScanning={isCapturing}
            scanProgress={captureProgress}
          />
        </Canvas>
      </div>

      {/* 4. TOP-LEFT PLANET SELECTOR HUD (Hidden during prologue & crash) */}
      {!isPrologueActive && scriptPhase !== 'CRITICAL_ENTITY_75' && (
        <PlanetSelectorHUD
          catalog={catalog}
          selectedIndex={selectedPlanetIndex}
          onSelectPlanet={(idx: number) => setSelectedPlanetIndex(idx)}
        />
      )}

      {/* 5. HOLOGRAPHIC RECON SCANNER RETICLE (Hidden during prologue & crash) */}
      {!isPrologueActive && scriptPhase !== 'CRITICAL_ENTITY_75' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
          <ReconCrosshair
            anomalyCoords={{ theta: anomalyCoordsTuple[0], phi: anomalyCoordsTuple[1] }}
            isCapturing={isCapturing}
            captureProgress={captureProgress}
            onLockStatusChange={(locked: boolean) => setIsReticleLocked(locked)}
          />
        </div>
      )}

      {/* 6. TACTICAL HUD PANELS & TELEMETRY (Hidden during prologue & crash) */}
      {!isPrologueActive && scriptPhase !== 'CRITICAL_ENTITY_75' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 25, pointerEvents: 'none' }}>
          <ScriptTerminalHUD
            phase={scriptPhase}
            activeDossier={activeDossier}
            isLocked={isReticleLocked}
            isCapturing={isCapturing}
            captureProgress={captureProgress}
            onRunCommand={handleRunCommand}
            onStartCapture={handleStartCapture}
            onCancelCapture={handleCancelCapture}
            isSedated={isSedated}
            onWakeUp={() => setIsSedated(false)}
            onOpenCodex={() => setIsCodexOpen(true)}
          />
        </div>
      )}

      {/* 7. ARCHIVAL CODEX SLIDE-OUT DRAWER */}
      <ArchivalCodex
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        onSelectPlanet={(planetOrIndex: any) => {
          const nextIndex =
            typeof planetOrIndex === 'number'
              ? catalog.findIndex((p, idx) => p.catalogIndex === planetOrIndex || idx === planetOrIndex)
              : typeof planetOrIndex?.catalogIndex === 'number'
              ? catalog.findIndex((p) => p.catalogIndex === planetOrIndex.catalogIndex)
              : 0;

          if (nextIndex !== -1) {
            setSelectedPlanetIndex(nextIndex);
          }
          setIsCodexOpen(false);
          audioSynth.playTelemetryPing();
        }}
      />

      {/* 8. TOP-MOST CLIMAX CRASH SCREEN (Z-INDEX 999999 + AUDIO BURST) */}
      {scriptPhase === 'CRITICAL_ENTITY_75' && !isRecovering && (
        <GlitchAnomalyFX
          active={true}
          onReboot={() => {
            audioSynth.stopSingularityDissonance();
            setIsRecovering(true);
          }}
        />
      )}

      {/* 9. ENDING VIDEO CUTSCENE */}
      {isRecovering && (
        <EndingVideoCutscene
          videoSrc={`${import.meta.env.BASE_URL}ending.mp4`}
          onRestart={() => {
            setIsRecovering(false);
            setSelectedPlanetIndex(0);
            setScriptPhase('DISCOVERY_01');
          }}
        />
      )}
    </div>
  );
};

export default App;
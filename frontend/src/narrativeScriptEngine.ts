export type ScriptPhase =
  | 'COLD_INIT'
  | 'AWAITING_INPUT'
  | 'SCANNING_SYSTEM'
  | 'DISCOVERY_01'
  | 'DISCOVERY_02'
  | 'TIMELAPSE_SURGE'        // High-speed archival montage (03 -> 74)
  | 'CRITICAL_ENTITY_75'
  | 'DESYNC_CUTSCENE';

export interface ScriptDialogue {
  speaker: 'ADA' | 'THE ARCHITECT' | 'SYSTEM' | 'THE WATCHER';
  text: string;
  tone?: string;
}

export const SCRIPT_DIALOGUE: Record<ScriptPhase, Array<{ speaker: string; text: string }>> = {
  COLD_INIT: [],
  AWAITING_INPUT: [
    { speaker: 'ADA', text: 'Optic line stable. Enter target parameters into console.' },
  ],
  SCANNING_SYSTEM: [
    { speaker: 'SYSTEM', text: 'Executing broadband optical sweep...' },
  ],
  DISCOVERY_01: [
    { speaker: 'ADA', text: 'Target K3-70b locked. Hold reticle to commit telemetry.' },
  ],
  DISCOVERY_02: [
    { speaker: 'ADA', text: 'Target K3-71a committed. Structural markers confirmed.' },
  ],
  TIMELAPSE_SURGE: [
    { speaker: 'SYSTEM', text: 'BATCH HARVEST SEQUENCE ENGAGED // CATALOG CYCLING...' },
    { speaker: 'ADA', text: 'Bandwidth saturation at 94%. Retaining coordinate lock...' },
  ],
  CRITICAL_ENTITY_75: [
    { speaker: 'ADA', text: 'Warning: Optical uplink compromised. That is not a planet.' },
  ],
  DESYNC_CUTSCENE: [],
};
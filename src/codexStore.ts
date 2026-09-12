import type { PlanetDossier } from './types';
import { getPlanetDossier } from './planetCatalog';

// Storage key used to identify Project 2K75 archival records
const STORAGE_KEY = 'project_2k75_archived_indices';

// Helper: Safely load saved catalog indices from localStorage
const loadStoredIndices = (): Set<number> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: number[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return new Set(parsed);
      }
    }
  } catch (error) {
    console.warn('Storage unavailable or corrupted, defaulting to memory store:', error);
  }
  // Default: Index 1 is always unlocked for the initial observation
  return new Set<number>([1]);
};

// Helper: Safely persist current index set into localStorage
const persistIndices = (indices: Set<number>) => {
  try {
    const serialized = JSON.stringify(Array.from(indices));
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('Failed to persist codex records to localStorage:', error);
  }
};

// In-memory runtime cache loaded once at module initialization
const capturedIndices: Set<number> = loadStoredIndices();

// 1. Mark a planet as surveyed and immediately sync to persistent storage
export const markPlanetCaptured = (index: number) => {
  if (!capturedIndices.has(index)) {
    capturedIndices.add(index);
    persistIndices(capturedIndices);
  }
};

// 2. Check if an individual target has been surveyed
export const isPlanetCaptured = (index: number): boolean => {
  return capturedIndices.has(index);
};

// 3. Retrieve all 75 catalog dossiers with up-to-date capture status flags
export const getAllCapturedDossiers = (): PlanetDossier[] => {
  const list: PlanetDossier[] = [];
  for (let i = 1; i <= 75; i++) {
    const dossier = getPlanetDossier(i);
    if (dossier) {
      list.push({
        ...dossier,
        isCaptured: capturedIndices.has(i),
      });
    }
  }
  return list;
};

// 4. Optional utility: Clear saved survey history to start a fresh playthrough
export const resetCodexStorage = () => {
  capturedIndices.clear();
  capturedIndices.add(1);
  persistIndices(capturedIndices);
};
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StoryState, StoryChapter, TransmissionLog } from './storyTypes';

const INITIAL_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    codename: 'INITIATIVE_AWAKENING',
    title: 'Echoes in the Vacuum',
    briefing: 'Establish primary sensor lock with Asterion Prime to verify observational telemetry feeds.',
    targetRequired: 'ASTERION PRIME',
    unlockCondition: {},
    isCompleted: false,
  },
  {
    id: 2,
    codename: 'GAS_TITAN_RESONANCE',
    title: 'The Goliath Haze',
    briefing: 'Acquire high-pressure atmospheric data from Goliath-IV to calibrate the planetary ring harmonics.',
    targetRequired: 'GOLIATH-IV',
    unlockCondition: {},
    isCompleted: false,
  },
  {
    id: 3,
    codename: 'CHRONO_BREACH',
    title: 'Beyond the Event Boundary',
    briefing: 'Investigate localized space-time divergence at Rift-2K75. Detect tachyon fluctuations above 60%.',
    targetRequired: 'RIFT-2K75',
    unlockCondition: { minTachyon: 0.6 },
    isCompleted: false,
  },
];

const INITIAL_TRANSMISSIONS: TransmissionLog[] = [
  {
    id: 'TX-001',
    timestamp: '2075.245.0800',
    sender: 'HIGH COMMAND // SECTOR COMMAND',
    title: 'WATCHER PROTOCOL INITIATED',
    message: 'Welcome to active terminal duty. Calibrate your telemetry feed by running multi-target diagnostic scans.',
    isRead: false,
    priority: 'NORMAL',
  },
];

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      currentChapterId: 1,
      chapters: INITIAL_CHAPTERS,
      transmissions: INITIAL_TRANSMISSIONS,
      discoveredSectors: [],

      registerScan: (targetName: string, tachyonResonance: number) => {
        const { currentChapterId, chapters, discoveredSectors, transmissions } = get();
        const activeChapter = chapters.find((c) => c.id === currentChapterId);

        // Record discovered sector name if unique
        const updatedSectors = discoveredSectors.includes(targetName)
          ? discoveredSectors
          : [...discoveredSectors, targetName];

        if (!activeChapter || activeChapter.isCompleted) {
          set({ discoveredSectors: updatedSectors });
          return;
        }

        // Evaluate whether the current scan satisfies chapter criteria
        const targetMatched = activeChapter.targetRequired === targetName;
        const tachyonSatisfied = activeChapter.unlockCondition.minTachyon
          ? tachyonResonance >= activeChapter.unlockCondition.minTachyon
          : true;

        if (targetMatched && tachyonSatisfied) {
          const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

          // Mark active chapter completed
          const updatedChapters = chapters.map((chap) =>
            chap.id === currentChapterId ? { ...chap, isCompleted: true, unlockedAt: timestamp } : chap
          );

          // Generate an urgent incoming transmission for chapter progress
          const newTransmission: TransmissionLog = {
            id: `TX-00${currentChapterId + 1}`,
            timestamp,
            sender: 'ARCHIVE AUTOMATION CORE',
            title: `CHAPTER COMPLETE: ${activeChapter.title}`,
            message: `Telemetry validated for ${targetName}. Mission objective '${activeChapter.codename}' recorded into the historical archive.`,
            isRead: false,
            priority: currentChapterId === 2 ? 'RESTRICTED' : 'URGENT',
          };

          set({
            currentChapterId: currentChapterId + 1,
            chapters: updatedChapters,
            transmissions: [newTransmission, ...transmissions],
            discoveredSectors: updatedSectors,
          });
        } else {
          set({ discoveredSectors: updatedSectors });
        }
      },

      markTransmissionRead: (logId: string) => {
        set((state) => ({
          transmissions: state.transmissions.map((log) =>
            log.id === logId ? { ...log, isRead: true } : log
          ),
        }));
      },

      resetProgress: () => {
        set({
          currentChapterId: 1,
          chapters: INITIAL_CHAPTERS,
          transmissions: INITIAL_TRANSMISSIONS,
          discoveredSectors: [],
        });
      },
    }),
    {
      name: 'project-2k75-story-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
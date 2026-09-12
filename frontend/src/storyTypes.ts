export interface TransmissionLog {
  id: string;
  timestamp: string;
  sender: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: 'NORMAL' | 'URGENT' | 'RESTRICTED';
}

export interface StoryChapter {
  id: number;
  codename: string;
  title: string;
  briefing: string;
  targetRequired: string;
  unlockCondition: {
    minTachyon?: number;
    maxHazard?: string;
  };
  isCompleted: boolean;
  unlockedAt?: string;
}

export interface StoryState {
  currentChapterId: number;
  chapters: StoryChapter[];
  transmissions: TransmissionLog[];
  discoveredSectors: string[];
  // Store actions
  registerScan: (targetId: string, tachyonResonance: number) => void;
  markTransmissionRead: (logId: string) => void;
  resetProgress: () => void;
}
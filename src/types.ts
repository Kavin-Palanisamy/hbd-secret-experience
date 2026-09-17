export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
  quote?: string;
  category?: string;
}

export interface RoastStats {
  procrastination: number;
  randomDecisions: number;
  overthinking: number;
  actuallyListening: number;
  beingAwesome: number;
  sleeping?: number;
  chaos?: number;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface BirthdayData {
  name: string;
  age: number;
  relationship: string;
  memories: MemoryItem[];
  roastStats: RoastStats;
  personalityScan: {
    overthinking: number;
    chaos: number;
    sleep: number;
    productivity: string;
    happiness: number;
  };
  birthdayMessage: string;
  finalMessage: string;
  secretMessage: string;
  handwrittenSignoff: string;
  senderName: string;
  achievements: Achievement[];
  music: {
    enabled: boolean;
    title: string;
  };
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
  tag: string;
}

export interface DiagnosticStats {
  procrastination: number;
  randomDecisions: number;
  overthinking: number;
  actuallyListening: number;
  beingAwesome: number;
}

export interface GalaxyNode {
  id: string;
  title: string;
  date: string;
  type: 'core' | 'memory' | 'milestone' | 'inside-joke' | 'achievement';
  description: string;
  image?: string;
  x: number;
  y: number;
  z: number;
  connections: string[];
}

export type SceneId = 
  | number
  | 'mystery-intro'       // Phase 1
  | 'identity-scan'       // Phase 2
  | 'secret-light'        // Phase 3
  | 'memory-universe'     // Phase 4
  | 'roast-machine'       // Phase 5
  | 'birthday-detection'  // Phase 6
  | 'birthday-game'       // Phase 7
  | 'wish-orb'            // Phase 8
  | 'cake-boss'           // Phase 9
  | 'emotional-message'   // Phase 10
  | 'memory-wall'         // Phase 11
  | 'beast-mode'          // Phase 12
  | 'achievements'        // Phase 13
  | 'secret-ending';      // Phase 14


export interface GameNode {
  id: number;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  neighbors: number[];
  isEscapeTarget?: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  nodes: GameNode[];
  initialPolice: number[];
  initialBuggu: number;
}

// --------------------------------------------------------------------------
// Level 6: The Diamond Crest (Image 3)
// --------------------------------------------------------------------------
export const LEVEL_6: LevelConfig = {
  id: 6,
  name: 'The Diamond Crest',
  nodes: [
    { id: 0, x: 30, y: 28, neighbors: [2, 3], isEscapeTarget: true }, // Police 1
    { id: 1, x: 70, y: 28, neighbors: [3, 4], isEscapeTarget: true }, // Police 2
    { id: 2, x: 15, y: 38, neighbors: [0, 5] },
    { id: 3, x: 50, y: 35, neighbors: [0, 1, 6], isEscapeTarget: true }, // Police 3
    { id: 4, x: 85, y: 38, neighbors: [1, 7] },
    { id: 5, x: 15, y: 54, neighbors: [2, 6, 8] },
    { id: 6, x: 50, y: 54, neighbors: [3, 5, 7, 8] }, // Center hub
    { id: 7, x: 85, y: 54, neighbors: [4, 6, 8] },
    { id: 8, x: 50, y: 70, neighbors: [5, 6, 7] }, // Buggu start
  ],
  initialPolice: [0, 1, 3],
  initialBuggu: 8,
};

// --------------------------------------------------------------------------
// Level 7: The Asymmetric Flank (Image 1)
// --------------------------------------------------------------------------
export const LEVEL_7: LevelConfig = {
  id: 7,
  name: 'The Asymmetric Flank',
  nodes: [
    { id: 0, x: 15, y: 34, neighbors: [1, 3], isEscapeTarget: true }, // Police 1
    { id: 1, x: 15, y: 49, neighbors: [0, 2, 4], isEscapeTarget: true }, // Police 2
    { id: 2, x: 15, y: 65, neighbors: [1, 6], isEscapeTarget: true }, // Police 3
    { id: 3, x: 45, y: 34, neighbors: [0, 4, 5] },
    { id: 4, x: 45, y: 49, neighbors: [1, 3, 5, 6] },
    { id: 5, x: 65, y: 49, neighbors: [3, 4, 6, 7, 8] }, // Diamond focal node
    { id: 6, x: 45, y: 65, neighbors: [2, 4, 5] },
    { id: 7, x: 65, y: 65, neighbors: [5, 8] },
    { id: 8, x: 85, y: 65, neighbors: [5, 7] }, // Buggu start
  ],
  initialPolice: [0, 1, 2],
  initialBuggu: 8,
};

// --------------------------------------------------------------------------
// Level 8: The Winged Fortress (Image 2)
// --------------------------------------------------------------------------
export const LEVEL_8: LevelConfig = {
  id: 8,
  name: 'The Winged Fortress',
  nodes: [
    // Top Police Row (4 Officers)
    { id: 0, x: 20, y: 30, neighbors: [1, 4], isEscapeTarget: true },
    { id: 1, x: 40, y: 30, neighbors: [0, 5], isEscapeTarget: true },
    { id: 2, x: 60, y: 30, neighbors: [3, 6], isEscapeTarget: true },
    { id: 3, x: 80, y: 30, neighbors: [2, 7], isEscapeTarget: true },

    // Middle Web
    { id: 4, x: 20, y: 43, neighbors: [0, 5, 8] },
    { id: 5, x: 40, y: 43, neighbors: [1, 4, 6, 8, 10] },
    { id: 6, x: 60, y: 43, neighbors: [2, 5, 7, 9, 10] },
    { id: 7, x: 80, y: 43, neighbors: [3, 6, 9] },

    // Lower Bridges
    { id: 8, x: 20, y: 55, neighbors: [4, 5, 11] },
    { id: 9, x: 80, y: 55, neighbors: [6, 7, 11] },
    { id: 10, x: 50, y: 55, neighbors: [5, 6, 11] },

    // Bottom Base (Buggu)
    { id: 11, x: 50, y: 70, neighbors: [8, 9, 10] },
  ],
  initialPolice: [0, 1, 2, 3],
  initialBuggu: 11,
};

// --------------------------------------------------------------------------
// Level 10: The Triangular Spire (Image 4)
// --------------------------------------------------------------------------
export const LEVEL_10: LevelConfig = {
  id: 10,
  name: 'The Triangular Spire',
  nodes: [
    { id: 0, x: 50, y: 30, neighbors: [1, 2, 3] }, // Buggu apex spawn
    
    // Middle Tier
    { id: 1, x: 18, y: 45, neighbors: [0, 2, 4] },
    { id: 2, x: 50, y: 45, neighbors: [0, 1, 3, 5] },
    { id: 3, x: 82, y: 45, neighbors: [0, 2, 6] },

    // Lower Tier
    { id: 4, x: 18, y: 58, neighbors: [1, 5, 7] },
    { id: 5, x: 50, y: 58, neighbors: [2, 4, 6, 8] },
    { id: 6, x: 82, y: 58, neighbors: [3, 5, 9] },

    // Base Police Row (3 Officers)
    { id: 7, x: 18, y: 68, neighbors: [4], isEscapeTarget: true },
    { id: 8, x: 50, y: 68, neighbors: [5], isEscapeTarget: true },
    { id: 9, x: 82, y: 68, neighbors: [6], isEscapeTarget: true },
  ],
  initialPolice: [7, 8, 9],
  initialBuggu: 0,
};

// --------------------------------------------------------------------------
// Level 9: The Hex Lattice (Balanced 5th Arena)
// --------------------------------------------------------------------------
export const LEVEL_9: LevelConfig = {
  id: 9,
  name: 'The Hex Lattice',
  nodes: [
    { id: 0, x: 35, y: 25, neighbors: [1, 2, 3], isEscapeTarget: true },
    { id: 1, x: 65, y: 25, neighbors: [0, 3, 4], isEscapeTarget: true },
    { id: 2, x: 20, y: 45, neighbors: [0, 5] },
    { id: 3, x: 50, y: 45, neighbors: [0, 1, 5, 6] },
    { id: 4, x: 80, y: 45, neighbors: [1, 6] },
    { id: 5, x: 35, y: 65, neighbors: [2, 3, 7] },
    { id: 6, x: 65, y: 65, neighbors: [3, 4, 7] },
    { id: 7, x: 50, y: 80, neighbors: [5, 6] }, // Buggu spawn
  ],
  initialPolice: [0, 1],
  initialBuggu: 7,
};

export const ALL_LEVELS: LevelConfig[] = [
  LEVEL_6,
  LEVEL_7,
  LEVEL_8,
  LEVEL_9,
  LEVEL_10,
];

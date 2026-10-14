export interface GameNode {
  id: number;
  x: number; // Percentage coordinate (0 - 100)
  y: number; // Percentage coordinate (0 - 100)
  neighbors: number[];
  isEscapeTarget?: boolean;
}

export interface StarThresholds {
  three: number;
  two: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  initialPolice: number[];
  initialBuggu: number;
  starThresholds: StarThresholds;
  nodes: GameNode[];
}

export const ALL_LEVELS: LevelConfig[] = [
  // ----------------------------------------------------
  // LEVEL 1 (Level 6 Screenshot): Heart Wedge
  // 3 Officers at top, Buggu at the bottom node
  // ----------------------------------------------------
  {
    id: 1,
    name: 'Heart Wedge',
    initialPolice: [1, 2, 3], // 3 Cops
    initialBuggu: 8,          // Buggu at bottom
    starThresholds: { three: 6, two: 9 },
    nodes: [
      { id: 1, x: 30, y: 16, neighbors: [2, 4], isEscapeTarget: true },
      { id: 2, x: 50, y: 28, neighbors: [1, 3, 6] },
      { id: 3, x: 70, y: 16, neighbors: [2, 5], isEscapeTarget: true },
      { id: 4, x: 18, y: 26, neighbors: [1, 6, 7] },
      { id: 5, x: 82, y: 26, neighbors: [3, 6, 7] },
      { id: 6, x: 50, y: 52, neighbors: [2, 4, 5, 7, 8] }, // Center junction
      { id: 7, x: 18, y: 52, neighbors: [4, 6, 8] },
      { id: 8, x: 50, y: 84, neighbors: [6, 7, 5] },       // Bottom apex
    ],
  },

  // ----------------------------------------------------
  // LEVEL 2 (Level 7 Screenshot): Corner Sweep
  // 3 Officers on the left vertical track, Buggu at bottom-right
  // ----------------------------------------------------
  {
    id: 2,
    name: 'Corner Sweep',
    initialPolice: [1, 2, 3],
    initialBuggu: 8,
    starThresholds: { three: 7, two: 11 },
    nodes: [
      { id: 1, x: 18, y: 22, neighbors: [2, 4], isEscapeTarget: true },
      { id: 2, x: 18, y: 48, neighbors: [1, 3, 5] },
      { id: 3, x: 18, y: 74, neighbors: [2, 6] },
      { id: 4, x: 44, y: 22, neighbors: [1, 5, 7], isEscapeTarget: true },
      { id: 5, x: 44, y: 48, neighbors: [2, 4, 6, 7] },
      { id: 6, x: 44, y: 74, neighbors: [3, 5, 7, 8] },
      { id: 7, x: 64, y: 48, neighbors: [4, 5, 6, 8] },
      { id: 8, x: 84, y: 74, neighbors: [6, 7] }, // Bottom right
    ],
  },

  // ----------------------------------------------------
  // LEVEL 3 (Level 8 Screenshot): 4-Lane Funnel
  // 4 Officers across the top row, Buggu at the bottom funnel tip
  // ----------------------------------------------------
  {
    id: 3,
    name: '4-Lane Funnel',
    initialPolice: [1, 2, 3, 4], // 4 Cops
    initialBuggu: 11,            // Buggu at bottom apex
    starThresholds: { three: 8, two: 12 },
    nodes: [
      { id: 1, x: 20, y: 18, neighbors: [2, 5, 6], isEscapeTarget: true },
      { id: 2, x: 40, y: 18, neighbors: [1, 3, 6] },
      { id: 3, x: 60, y: 18, neighbors: [2, 4, 7] },
      { id: 4, x: 80, y: 18, neighbors: [3, 7, 8], isEscapeTarget: true },
      { id: 5, x: 20, y: 40, neighbors: [1, 9] },
      { id: 6, x: 40, y: 40, neighbors: [1, 2, 7, 9, 10] },
      { id: 7, x: 60, y: 40, neighbors: [3, 4, 6, 10, 11] },
      { id: 8, x: 80, y: 40, neighbors: [4, 11] },
      { id: 9, x: 20, y: 62, neighbors: [5, 6, 11] },
      { id: 10, x: 50, y: 62, neighbors: [6, 7, 11] }, // Central neck
      { id: 11, x: 50, y: 84, neighbors: [9, 10, 8] },  // Bottom tip
    ],
  },

  // ----------------------------------------------------
  // LEVEL 4 (Level 9 Screenshot): Horizontal Pincer
  // 3 Officers on the left column, Buggu at the right apex
  // ----------------------------------------------------
  {
    id: 4,
    name: 'Horizontal Pincer',
    initialPolice: [1, 2, 3],
    initialBuggu: 8,
    starThresholds: { three: 6, two: 10 },
    nodes: [
      { id: 1, x: 18, y: 22, neighbors: [4, 5], isEscapeTarget: true },
      { id: 2, x: 18, y: 48, neighbors: [5] },
      { id: 3, x: 18, y: 74, neighbors: [5, 6], isEscapeTarget: true },
      { id: 4, x: 38, y: 22, neighbors: [1, 5, 7] },
      { id: 5, x: 38, y: 48, neighbors: [1, 2, 3, 4, 6, 7] }, // Left core hub
      { id: 6, x: 38, y: 74, neighbors: [3, 5, 7] },
      { id: 7, x: 58, y: 48, neighbors: [4, 5, 6, 8] },      // Neck node
      { id: 8, x: 84, y: 48, neighbors: [7, 4, 6] },         // Right apex
    ],
  },

  // ----------------------------------------------------
  // LEVEL 5 (Level 10 Screenshot): House Fortress
  // 3 Officers at bottom row advancing up toward Buggu on rooftop
  // ----------------------------------------------------
  {
    id: 5,
    name: 'House Fortress',
    initialPolice: [1, 2, 3], // 3 Cops at bottom
    initialBuggu: 7,          // Buggu at roof peak
    starThresholds: { three: 7, two: 11 },
    nodes: [
      { id: 1, x: 20, y: 76, neighbors: [4], isEscapeTarget: true },
      { id: 2, x: 50, y: 76, neighbors: [5] },
      { id: 3, x: 80, y: 76, neighbors: [6], isEscapeTarget: true },
      { id: 4, x: 20, y: 52, neighbors: [1, 5, 7] },
      { id: 5, x: 50, y: 52, neighbors: [2, 4, 6, 7] }, // Middle center
      { id: 6, x: 80, y: 52, neighbors: [3, 5, 7] },
      { id: 7, x: 50, y: 22, neighbors: [4, 5, 6] },    // Rooftop apex
    ],
  },
];

export const calculateStars = (moves: number, thresholds: StarThresholds): number => {
  if (moves <= thresholds.three) return 3;
  if (moves <= thresholds.two) return 2;
  return 1;
};

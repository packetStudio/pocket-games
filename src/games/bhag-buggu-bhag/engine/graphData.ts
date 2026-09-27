export interface GameNode {
  id: number;
  x: number;
  y: number;
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
  {
    id: 1,
    name: 'Alleyway Cross',
    initialPolice: [1, 5],
    initialBuggu: 3,
    starThresholds: { three: 5, two: 8 },
    nodes: [
      { id: 1, x: 50, y: 15, neighbors: [2, 3] },
      { id: 2, x: 20, y: 50, neighbors: [1, 3, 4], isEscapeTarget: true },
      { id: 3, x: 50, y: 50, neighbors: [1, 2, 4, 5] },
      { id: 4, x: 80, y: 50, neighbors: [2, 3, 5], isEscapeTarget: true },
      { id: 5, x: 50, y: 85, neighbors: [3, 4] },
    ],
  },
  {
    id: 2,
    name: 'The Central Plaza',
    initialPolice: [1, 7],
    initialBuggu: 4,
    starThresholds: { three: 7, two: 11 },
    nodes: [
      { id: 1, x: 50, y: 15, neighbors: [2, 3] },
      { id: 2, x: 20, y: 35, neighbors: [1, 4, 5] },
      { id: 3, x: 80, y: 35, neighbors: [1, 4, 6] },
      { id: 4, x: 50, y: 50, neighbors: [2, 3, 5, 6] },
      { id: 5, x: 25, y: 75, neighbors: [2, 4, 7], isEscapeTarget: true },
      { id: 6, x: 75, y: 75, neighbors: [3, 4, 7], isEscapeTarget: true },
      { id: 7, x: 50, y: 88, neighbors: [5, 6] },
    ],
  },
];

export const calculateStars = (moves: number, thresholds: StarThresholds): number => {
  if (moves <= thresholds.three) return 3;
  if (moves <= thresholds.two) return 2;
  return 1;
};

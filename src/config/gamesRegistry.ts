export interface GameMeta {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  routeKey: string;
}

export const GAMES_REGISTRY: GameMeta[] = [
  {
    id: 'bhag-buggu-bhag',
    title: 'Bhag Buggu Bhag',
    subtitle: 'Catch the Thief (Node Chase)',
    badgeText: 'Classic',
    routeKey: 'BhagBugguBhagModes',
  },
];

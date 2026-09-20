import { GameNode } from './graphData';

export type Turn = 'POLICE' | 'BUGGU';
export type GameStatus = 'PLAYING' | 'POLICE_WON' | 'BUGGU_WON';

export interface GameState {
  policePositions: number[];
  bugguPosition: number;
  currentTurn: Turn;
  status: GameStatus;
  selectedPoliceIndex: number | null;
}

/**
 * Validates if moving from one node to another is permitted.
 */
export function isValidMove(
  fromNodeId: number,
  toNodeId: number,
  nodes: GameNode[],
  occupiedNodes: number[]
): boolean {
  const fromNode = nodes.find(n => n.id === fromNodeId);
  if (!fromNode) return false;

  const isNeighbor = fromNode.neighbors.includes(toNodeId);
  const isOccupied = occupiedNodes.includes(toNodeId);

  return isNeighbor && !isOccupied;
}

/**
 * Evaluates win/loss conditions:
 * 1. Buggu wins if he reaches any escape target node unblocked.
 * 2. Police win if Buggu has zero unoccupied neighboring nodes to move to.
 */
export function checkVictory(
  bugguPos: number,
  policePositions: number[],
  nodes: GameNode[]
): GameStatus {
  const bugguNode = nodes.find(n => n.id === bugguPos);
  if (!bugguNode) return 'PLAYING';

  // Buggu reaches a red escape node that is not blocked by police
  if (bugguNode.isEscapeTarget && !policePositions.includes(bugguPos)) {
    return 'BUGGU_WON';
  }

  // Check if Buggu is completely surrounded with no valid moves remaining
  const availableMoves = bugguNode.neighbors.filter(
    neighborId => !policePositions.includes(neighborId)
  );

  if (availableMoves.length === 0) {
    return 'POLICE_WON';
  }

  return 'PLAYING';
}

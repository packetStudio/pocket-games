import { GameNode } from './graphData';

/**
 * Calculates the best node for Buggu to move to.
 * 1. Checks if an escape target is an immediate valid neighbor.
 * 2. Uses Breadth-First Search (BFS) to find the shortest safe route to any unblocked escape target.
 * 3. Falls back to maximizing Euclidean distance from all cops if all paths are contested.
 */
export function getBestBugguMove(
  bugguPos: number,
  policePositions: number[],
  nodes: GameNode[]
): number | null {
  const bugguNode = nodes.find(n => n.id === bugguPos);
  if (!bugguNode) return null;

  // Filter moves that aren't blocked by police
  const availableMoves = bugguNode.neighbors.filter(
    id => !policePositions.includes(id)
  );

  if (availableMoves.length === 0) return null; // Trapped

  // 1. Immediate win check: step straight onto an escape target if reachable
  const directWin = availableMoves.find(id => {
    const node = nodes.find(n => n.id === id);
    return node?.isEscapeTarget;
  });
  if (directWin !== undefined) return directWin;

  // 2. BFS to locate the shortest path to any unoccupied escape target
  const queue: { current: number; firstStep: number }[] = [];
  const visited = new Set<number>([bugguPos, ...policePositions]);

  for (const moveId of availableMoves) {
    visited.add(moveId);
    queue.push({ current: moveId, firstStep: moveId });
  }

  while (queue.length > 0) {
    const { current, firstStep } = queue.shift()!;
    const currentNode = nodes.find(n => n.id === current);
    if (!currentNode) continue;

    if (currentNode.isEscapeTarget) {
      return firstStep; // Found shortest path to an escape point
    }

    for (const neighborId of currentNode.neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push({ current: neighborId, firstStep });
      }
    }
  }

  // 3. Fallback: pick the valid adjacent node that maximizes distance from all police officers
  let bestMove = availableMoves[0];
  let maxDistance = -1;

  for (const moveId of availableMoves) {
    const moveNode = nodes.find(n => n.id === moveId)!;
    const distSum = policePositions.reduce((sum, copId) => {
      const copNode = nodes.find(n => n.id === copId)!;
      return sum + Math.hypot(moveNode.x - copNode.x, moveNode.y - copNode.y);
    }, 0);

    if (distSum > maxDistance) {
      maxDistance = distSum;
      bestMove = moveId;
    }
  }

  return bestMove;
}

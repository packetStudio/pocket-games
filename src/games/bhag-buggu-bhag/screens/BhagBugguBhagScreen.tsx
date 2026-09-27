import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';
import Svg, { Line, Circle, G, Rect, Path, Ellipse, Polygon } from 'react-native-svg';
import { LevelConfig, ALL_LEVELS, GameNode, calculateStars } from '../engine/graphData';
import { soundFX } from '../../../utils/audio';

// --- Haptic Feedback Triggers ---
const triggerTapHaptic = () => {
  if (Platform.OS === 'ios') {
    Vibration.vibrate();
  } else {
    Vibration.vibrate(20);
  }
};

const triggerWinHaptic = () => {
  Vibration.vibrate([0, 80, 50, 120, 50, 200]);
};

const triggerLossHaptic = () => {
  Vibration.vibrate(400);
};

// --- Vector Sprites ---
const BugguSprite = ({ x, y, size = 44 }: { x: number; y: number; size?: number }) => {
  const scale = size / 50;
  return (
    <G transform={`translate(${x - size / 2}, ${y - size / 2}) scale(${scale})`}>
      <Ellipse cx="25" cy="46" rx="14" ry="4" fill="rgba(0, 0, 0, 0.25)" />
      <G>
        <Path d="M 33 26 C 42 24, 46 34, 42 42 C 38 46, 30 45, 28 41 Z" fill="#D4A373" stroke="#8C5832" strokeWidth="1.5" />
        <Circle cx="34" cy="26" r="2.5" fill="#E63946" />
        <Path d="M 35 32 L 39 32 M 35 35 L 38 35 M 35 32 L 35 40" stroke="#6B3E1F" strokeWidth="1.2" strokeLinecap="round" />
      </G>
      <G>
        <Rect x="15" y="28" width="20" height="16" rx="5" fill="#2B2D42" />
        <Rect x="15" y="32" width="20" height="2.5" fill="#EDF2F4" />
        <Rect x="15" y="37" width="20" height="2.5" fill="#EDF2F4" />
      </G>
      <Circle cx="25" cy="20" r="11" fill="#F8C8A0" />
      <Path d="M 14 19 C 14 10, 36 10, 36 19 C 36 21, 14 21, 14 19 Z" fill="#1D3557" />
      <Rect x="13.5" y="17" width="23" height="4" rx="2" fill="#457B9D" />
      <Path d="M 16 20 C 18 17, 32 17, 34 20 C 32 23, 18 23, 16 20 Z" fill="#111111" />
      <Ellipse cx="21" cy="20" rx="2" ry="2.2" fill="#FFFFFF" />
      <Circle cx="22" cy="20" r="1.1" fill="#000000" />
      <Ellipse cx="29" cy="20" rx="2" ry="2.2" fill="#FFFFFF" />
      <Circle cx="30" cy="20" r="1.1" fill="#000000" />
      <Path d="M 23 26 Q 26 29 29 26" stroke="#4A2810" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </G>
  );
};

const PoliceSprite = ({ x, y, size = 46, isSelected = false }: { x: number; y: number; size?: number; isSelected?: boolean }) => {
  const scale = size / 50;
  return (
    <G transform={`translate(${x - size / 2}, ${y - size / 2}) scale(${scale})`}>
      {isSelected && (
        <Circle cx="25" cy="25" r="24" fill="none" stroke="#FFD166" strokeWidth="3.5" strokeDasharray="4, 3" />
      )}
      <Ellipse cx="25" cy="46" rx="14" ry="4" fill="rgba(0, 0, 0, 0.25)" />
      <Rect x="13" y="27" width="24" height="17" rx="5" fill="#1D3557" />
      <Polygon points="21,27 29,27 25,33" fill="#A8DADC" />
      <Polygon points="24,31 26,31 27,38 25,41 23,38" fill="#111111" />
      <Rect x="12" y="28" width="4" height="2" rx="0.5" fill="#E9C46A" />
      <Rect x="34" y="28" width="4" height="2" rx="0.5" fill="#E9C46A" />
      <Circle cx="25" cy="20" r="10.5" fill="#F8C8A0" />
      <Circle cx="21" cy="20" r="1.3" fill="#1A1A1A" />
      <Circle cx="29" cy="20" r="1.3" fill="#1A1A1A" />
      <Path d="M 19 17 L 23 18.5" stroke="#4A2810" strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M 31 17 L 27 18.5" stroke="#4A2810" strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M 12 16 Q 25 18 38 16 C 36 13 14 13 12 16 Z" fill="#111111" />
      <Path d="M 13 15 C 13 7, 37 7, 37 15 Z" fill="#1D3557" />
      <Path d="M 14 15 Q 25 17 36 15" stroke="#E9C46A" strokeWidth="2" fill="none" />
      <Polygon points="25,9 26.5,12 29.5,12.5 27,14.5 28,17.5 25,16 22,17.5 23,14.5 20.5,12.5 23.5,12" fill="#FFD166" />
    </G>
  );
};

const ExitPortalSprite = ({ cx, cy, radius = 24 }: { cx: number; cy: number; radius?: number }) => (
  <G>
    <Circle cx={cx} cy={cy} r={radius} stroke="#E63946" strokeWidth="3" strokeDasharray="5, 3" fill="#E63946" fillOpacity="0.12" />
    <Path
      d={`M ${cx} ${cy - radius + 7} L ${cx - 5} ${cy - radius + 13} L ${cx - 2} ${cy - radius + 13} L ${cx - 2} ${cy - radius + 18} L ${cx + 2} ${cy - radius + 18} L ${cx + 2} ${cy - radius + 13} L ${cx + 5} ${cy - radius + 13} Z`}
      fill="#E63946"
    />
  </G>
);

// --- BFS Engine ---
const getBestBugguMove = (bugguPos: number, policePositions: number[], nodes: GameNode[]): number | null => {
  const current = nodes.find((n) => n.id === bugguPos);
  if (!current) return null;

  const validNeighbors = current.neighbors.filter((id) => !policePositions.includes(id));
  if (validNeighbors.length === 0) return null;

  for (const id of validNeighbors) {
    const node = nodes.find((n) => n.id === id);
    if (node?.isEscapeTarget) return id;
  }

  const queue: { id: number; firstStep: number | null; dist: number }[] = [
    { id: bugguPos, firstStep: null, dist: 0 },
  ];
  const visited = new Set<number>([bugguPos]);
  let bestNextStep: number | null = null;

  while (queue.length > 0) {
    const item = queue.shift()!;
    const currNode = nodes.find((n) => n.id === item.id);
    if (!currNode) continue;

    if (currNode.isEscapeTarget && item.firstStep !== null) {
      bestNextStep = item.firstStep;
      break;
    }

    for (const neighborId of currNode.neighbors) {
      if (!visited.has(neighborId) && !policePositions.includes(neighborId)) {
        visited.add(neighborId);
        queue.push({
          id: neighborId,
          firstStep: item.firstStep === null ? neighborId : item.firstStep,
          dist: item.dist + 1,
        });
      }
    }
  }

  return bestNextStep !== null
    ? bestNextStep
    : validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
};

interface Props {
  initialLevel: LevelConfig;
  onBackToHub: () => void;
  highScores: Record<number, { moves: number; stars: number }>;
  onSaveHighScore: (levelId: number, moves: number, stars: number) => void;
}

export const BhagBugguBhagScreen: React.FC<Props> = ({
  initialLevel,
  onBackToHub,
  highScores,
  onSaveHighScore,
}) => {
  const [levelIndex, setLevelIndex] = useState(
    ALL_LEVELS.findIndex((l) => l.id === initialLevel.id) !== -1
      ? ALL_LEVELS.findIndex((l) => l.id === initialLevel.id)
      : 0
  );
  const currentLevel = ALL_LEVELS[levelIndex];
  const [policePositions, setPolicePositions] = useState<number[]>(currentLevel.initialPolice);
  const [bugguPosition, setBugguPosition] = useState<number>(currentLevel.initialBuggu);
  const [selectedPoliceIndex, setSelectedPoliceIndex] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'POLICE' | 'BUGGU'>('POLICE');
  const [gameStatus, setGameStatus] = useState<'PLAYING' | 'POLICE_WON' | 'BUGGU_WON'>('PLAYING');
  const [moves, setMoves] = useState<number>(0);

  const bestScore = highScores[currentLevel.id];
  const boardSize = Math.min(Dimensions.get('window').width - 32, 380);
  const padding = 34;
  const usable = boardSize - padding * 2;

  const getCoords = (px: number, py: number) => ({
    cx: padding + (px / 100) * usable,
    cy: padding + (py / 100) * usable,
  });

  const resetLevel = (idx: number) => {
    const lvl = ALL_LEVELS[idx];
    setPolicePositions([...lvl.initialPolice]);
    setBugguPosition(lvl.initialBuggu);
    setSelectedPoliceIndex(null);
    setCurrentTurn('POLICE');
    setGameStatus('PLAYING');
    setMoves(0);
  };

  useEffect(() => {
    resetLevel(levelIndex);
  }, [levelIndex]);

  const handlePoliceWon = (finalMoves: number) => {
    triggerWinHaptic();
    soundFX.playVictory();
    setGameStatus('POLICE_WON');
    const starsEarned = calculateStars(finalMoves, currentLevel.starThresholds);
    onSaveHighScore(currentLevel.id, finalMoves, starsEarned);

    const starString = '★'.repeat(starsEarned) + '☆'.repeat(3 - starsEarned);
    Alert.alert(
      'Thief Caught!',
      `Buggu is surrounded!\n\nScore: ${starString}\nMoves: ${finalMoves}${
        bestScore ? ` (Best: ${Math.min(bestScore.moves, finalMoves)})` : ''
      }`,
      [
        { text: 'Next Level', onPress: () => setLevelIndex((prev) => (prev + 1) % ALL_LEVELS.length) },
        { text: 'Replay', onPress: () => resetLevel(levelIndex) },
      ]
    );
  };

  const handleBugguTurn = (activePolice: number[], updatedMoves: number) => {
    setTimeout(() => {
      const nextMove = getBestBugguMove(bugguPosition, activePolice, currentLevel.nodes);
      if (nextMove === null) {
        handlePoliceWon(updatedMoves);
        return;
      }

      setBugguPosition(nextMove);
      const targetNode = currentLevel.nodes.find((n) => n.id === nextMove);
      if (targetNode?.isEscapeTarget) {
        triggerLossHaptic();
        soundFX.playEscape();
        setGameStatus('BUGGU_WON');
        Alert.alert('Escaped!', `Buggu reached the exit in ${updatedMoves} turns!`, [
          { text: 'Try Again', onPress: () => resetLevel(levelIndex) },
        ]);
      } else {
        setCurrentTurn('POLICE');
      }
    }, 450);
  };

  const onNodePress = (nodeId: number) => {
    if (gameStatus !== 'PLAYING' || currentTurn !== 'POLICE') return;

    const copIdx = policePositions.indexOf(nodeId);
    if (copIdx !== -1) {
      triggerTapHaptic();
      soundFX.playMove();
      setSelectedPoliceIndex(copIdx);
      return;
    }

    if (selectedPoliceIndex !== null) {
      const fromId = policePositions[selectedPoliceIndex];
      const fromNode = currentLevel.nodes.find((n) => n.id === fromId);
      const isNeighbor = fromNode?.neighbors.includes(nodeId);
      const isOccupied = policePositions.includes(nodeId) || bugguPosition === nodeId;

      if (isNeighbor && !isOccupied) {
        triggerTapHaptic();
        soundFX.playMove();
        const nextMoves = moves + 1;
        setMoves(nextMoves);

        const updatedPolice = [...policePositions];
        updatedPolice[selectedPoliceIndex] = nodeId;
        setPolicePositions(updatedPolice);
        setSelectedPoliceIndex(null);

        const bugguNode = currentLevel.nodes.find((n) => n.id === bugguPosition);
        const bugguTrapped = bugguNode?.neighbors.every((id) => updatedPolice.includes(id));

        if (bugguTrapped) {
          handlePoliceWon(nextMoves);
          return;
        }

        setCurrentTurn('BUGGU');
        handleBugguTurn(updatedPolice, nextMoves);
      }
    }
  };

  const drawnEdges = new Set<string>();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToHub}>
          <Text style={styles.backButtonText}>← HUB</Text>
        </TouchableOpacity>
        <Text style={styles.levelBadge}>{currentLevel.name}</Text>
        <TouchableOpacity style={styles.restartIconBtn} onPress={() => resetLevel(levelIndex)}>
          <Text style={styles.restartIconText}>↺</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricBanner}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>MOVES</Text>
          <Text style={styles.metricVal}>{moves}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>BEST SCORE</Text>
          <Text style={styles.metricVal}>{bestScore ? `${bestScore.moves} moves` : '--'}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>TARGET</Text>
          <Text style={[styles.metricVal, { color: '#F59E0B' }]}>
            {'★'.repeat(calculateStars(moves, currentLevel.starThresholds))}
          </Text>
        </View>
      </View>

      <View style={styles.turnCard}>
        <View style={styles.turnRow}>
          {currentTurn === 'POLICE' ? (
            <>
              <View style={styles.badgeSvgWrapper}>
                <Svg width={30} height={30} viewBox="0 0 30 30">
                  <PoliceSprite x={15} y={15} size={28} />
                </Svg>
              </View>
              <Text style={styles.turnLabel}>POLICE TURN: Tap an officer, then move</Text>
            </>
          ) : (
            <>
              <View style={styles.badgeSvgWrapper}>
                <Svg width={30} height={30} viewBox="0 0 30 30">
                  <BugguSprite x={15} y={15} size={26} />
                </Svg>
              </View>
              <Text style={styles.turnLabel}>BUGGU ESCAPING: Computing evasion...</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.centerContainer}>
        <View style={[styles.boardBox, { width: boardSize, height: boardSize }]}>
          <Svg width={boardSize} height={boardSize}>
            {currentLevel.nodes.map((node) => {
              const from = getCoords(node.x, node.y);
              return node.neighbors.map((nId) => {
                const edgeKey = [Math.min(node.id, nId), Math.max(node.id, nId)].join('-');
                if (drawnEdges.has(edgeKey)) return null;
                drawnEdges.add(edgeKey);
                const neighbor = currentLevel.nodes.find((n) => n.id === nId);
                if (!neighbor) return null;
                const to = getCoords(neighbor.x, neighbor.y);
                return (
                  <Line key={edgeKey} x1={from.cx} y1={from.cy} x2={to.cx} y2={to.cy} stroke="#4A5568" strokeWidth={6} strokeLinecap="round" />
                );
              });
            })}

            {currentLevel.nodes.map((node) => {
              const { cx, cy } = getCoords(node.x, node.y);
              const isSelected = selectedPoliceIndex !== null && policePositions[selectedPoliceIndex] === node.id;
              return (
                <G key={`node-${node.id}`} onPress={() => onNodePress(node.id)}>
                  {node.isEscapeTarget && <ExitPortalSprite cx={cx} cy={cy} radius={24} />}
                  <Circle cx={cx} cy={cy} r={16} fill="#EDF2F7" stroke={isSelected ? '#E9C46A' : '#718096'} strokeWidth={isSelected ? 4 : 3} />
                  <Circle cx={cx} cy={cy} r={8} fill={isSelected ? '#F4A261' : '#CBD5E0'} />
                </G>
              );
            })}

            {policePositions.map((nodeId, idx) => {
              const node = currentLevel.nodes.find((n) => n.id === nodeId);
              if (!node) return null;
              const { cx, cy } = getCoords(node.x, node.y);
              return (
                <G key={`cop-${idx}`} onPress={() => onNodePress(nodeId)}>
                  <PoliceSprite x={cx} y={cy} size={48} isSelected={selectedPoliceIndex === idx} />
                </G>
              );
            })}

            {(() => {
              const node = currentLevel.nodes.find((n) => n.id === bugguPosition);
              if (!node) return null;
              const { cx, cy } = getCoords(node.x, node.y);
              return (
                <G key="buggu" onPress={() => onNodePress(bugguPosition)}>
                  <BugguSprite x={cx} y={cy} size={46} />
                </G>
              );
            })()}
          </Svg>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => resetLevel(levelIndex)}>
          <Text style={styles.actionBtnText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.nextBtn]}
          onPress={() => setLevelIndex((prev) => (prev + 1) % ALL_LEVELS.length)}
        >
          <Text style={styles.actionBtnText}>Next Level →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'space-between', padding: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { backgroundColor: '#1E293B', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  backButtonText: { color: '#38BDF8', fontWeight: '800', fontSize: 12 },
  levelBadge: { fontSize: 16, fontWeight: '800', color: '#F8FAFC' },
  restartIconBtn: { backgroundColor: '#1E293B', width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  restartIconText: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold' },
  metricBanner: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 16, marginVertical: 6, borderWidth: 1, borderColor: '#334155' },
  metricItem: { flex: 1, alignItems: 'center' },
  metricLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.5 },
  metricVal: { fontSize: 14, fontWeight: '800', color: '#38BDF8', marginTop: 2 },
  metricDivider: { width: 1, backgroundColor: '#334155' },
  turnCard: { backgroundColor: '#1E293B', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  turnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  badgeSvgWrapper: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  turnLabel: { fontSize: 12, fontWeight: '700', color: '#FCD34D', flexShrink: 1 },
  centerContainer: { alignItems: 'center', justifyContent: 'center' },
  boardBox: { backgroundColor: '#2D3748', borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  footer: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  actionBtn: { flex: 1, backgroundColor: '#334155', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  nextBtn: { backgroundColor: '#2563EB' },
  actionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});

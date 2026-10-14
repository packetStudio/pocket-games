import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';
import Svg, { Line, Circle, G, Rect, Path, Ellipse, Polygon } from 'react-native-svg';
import { LevelConfig, GameNode, calculateStars } from '../engine/graphData';
import { soundFX } from '../../../../utils/audio';

// --- Haptic Feedback Triggers ---
const triggerTapHaptic = () => {
  if (Platform.OS === 'ios') {
    Vibration.vibrate();
  } else {
    Vibration.vibrate(25);
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
      <Polygon points="19,10 14,3 23,8" fill="#E63946" stroke="#800E13" strokeWidth="1" />
      <Polygon points="31,10 36,3 27,8" fill="#E63946" stroke="#800E13" strokeWidth="1" />
      <Path d="M 33 26 C 42 24, 46 34, 42 42 C 38 46, 30 45, 28 41 Z" fill="#D4A373" stroke="#8C5832" strokeWidth="1.5" />
      <Circle cx="34" cy="26" r="2.5" fill="#E63946" />
      <Path d="M 35 32 L 39 32 M 35 35 L 38 35 M 35 32 L 35 40" stroke="#6B3E1F" strokeWidth="1.2" strokeLinecap="round" />
      <Rect x="15" y="24" width="20" height="20" rx="6" fill="#E63946" />
      <Circle cx="25" cy="18" r="10" fill="#E63946" />
      <Ellipse cx="21" cy="18" rx="2" ry="2.5" fill="#FFFFFF" />
      <Circle cx="21" cy="18" r="1.1" fill="#000000" />
      <Ellipse cx="29" cy="18" rx="2" ry="2.5" fill="#FFFFFF" />
      <Circle cx="29" cy="18" r="1.1" fill="#000000" />
      <Path d="M 22 23 Q 25 26 28 23" stroke="#590D22" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
      <Circle cx="25" cy="20" r="10.5" fill="#F8C8A0" />
      <Path d="M 16 19 L 24 19 L 23 23 L 17 23 Z" fill="#111111" />
      <Path d="M 26 19 L 34 19 L 33 23 L 27 23 Z" fill="#111111" />
      <Line x1="24" y1="20" x2="26" y2="20" stroke="#111" strokeWidth="1.5" />
      <Path d="M 12 16 Q 25 18 38 16 C 36 13 14 13 12 16 Z" fill="#111111" />
      <Path d="M 13 15 C 13 7, 37 7, 37 15 Z" fill="#1D3557" />
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

const VictoryArtwork = () => (
  <Svg width="220" height="220" viewBox="0 0 200 200">
    <Circle cx="100" cy="100" r="92" fill="#EAE4D3" stroke="#D1C7AC" strokeWidth="4" />
    <Circle cx="100" cy="100" r="84" fill="#FDFBF7" />
    <Ellipse cx="72" cy="154" rx="24" ry="5" fill="#C5BCA5" />
    <Ellipse cx="132" cy="154" rx="22" ry="5" fill="#C5BCA5" />
    <G>
      <Polygon points="54,80 50,68 60,76" fill="#FFF" stroke="#222" strokeWidth="1.5" />
      <Polygon points="74,80 78,68 68,76" fill="#FFF" stroke="#222" strokeWidth="1.5" />
      <Path d="M 58 100 Q 86 100 86 125 Q 86 142 66 145 Q 52 142 56 115 Z" fill="#E63946" stroke="#222" strokeWidth="2.5" />
      <Circle cx="64" cy="94" r="14" fill="#E63946" stroke="#222" strokeWidth="2.5" />
      <Path d="M 56 94 Q 60 90 64 94" fill="none" stroke="#222" strokeWidth="2" />
      <Path d="M 68 94 Q 72 90 76 94" fill="none" stroke="#222" strokeWidth="2" />
      <Path d="M 57 95 L 56 112 Q 60 112 60 95 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
      <Path d="M 73 95 L 72 112 Q 76 112 76 95 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
      <Path d="M 62 104 Q 66 101 70 104" fill="none" stroke="#222" strokeWidth="2" />
      <Circle cx="60" cy="128" r="8" fill="#F4A261" stroke="#222" strokeWidth="2" />
      <Rect x="56" y="124" width="10" height="7" rx="3" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
      <Rect x="56" y="146" width="12" height="7" rx="3" fill="#111" />
      <Rect x="68" y="146" width="12" height="7" rx="3" fill="#111" />
    </G>
    <Path d="M 66 128 Q 94 140 120 128" fill="none" stroke="#A16207" strokeWidth="3" strokeDasharray="3, 1" />
    <G>
      <Rect x="120" y="112" width="26" height="24" rx="4" fill="#3B82F6" stroke="#222" strokeWidth="2.5" />
      <Rect x="120" y="132" width="26" height="18" fill="#1E293B" stroke="#222" strokeWidth="2.5" />
      <Rect x="120" y="128" width="26" height="5" fill="#111" />
      <Rect x="130" y="127" width="6" height="7" fill="#E2E8F0" stroke="#111" strokeWidth="1" />
      <Polygon points="125,116 129,116 127,121" fill="#F59E0B" />
      <Path d="M 120 118 L 115 128" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round" />
      <Circle cx="114" cy="129" r="4" fill="#F8C8A0" stroke="#222" strokeWidth="1.5" />
      <Circle cx="134" cy="94" r="16" fill="#F8C8A0" stroke="#222" strokeWidth="2.5" />
      <Path d="M 122 92 L 132 92 L 130 98 L 123 98 Z" fill="#111" />
      <Path d="M 134 92 L 144 92 L 142 98 L 135 98 Z" fill="#111" />
      <Line x1="131" y1="94" x2="135" y2="94" stroke="#111" strokeWidth="2" />
      <Path d="M 130 102 Q 135 104 140 101" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" />
      <Path d="M 116 86 Q 134 88 152 86 C 148 76 122 76 116 86 Z" fill="#111" stroke="#222" strokeWidth="2" />
      <Path d="M 118 84 C 118 70 150 70 150 84 Z" fill="#1E293B" stroke="#222" strokeWidth="2" />
      <Polygon points="134,74 138,79 130,79" fill="#F59E0B" />
      <Rect x="120" y="148" width="12" height="6" rx="2" fill="#111" />
      <Rect x="134" y="148" width="12" height="6" rx="2" fill="#111" />
    </G>
  </Svg>
);

const DefeatArtwork = () => (
  <Svg width="220" height="220" viewBox="0 0 200 200">
    <Circle cx="100" cy="100" r="92" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="4" />
    <Circle cx="100" cy="100" r="84" fill="#FEF2F2" />
    <Ellipse cx="70" cy="154" rx="20" ry="5" fill="#E2E8F0" />
    <Ellipse cx="130" cy="154" rx="22" ry="5" fill="#E2E8F0" />
    <G transform="translate(110, 70) scale(1.1)">
      <Polygon points="19,10 14,3 23,8" fill="#E63946" stroke="#800E13" strokeWidth="1" />
      <Polygon points="31,10 36,3 27,8" fill="#E63946" stroke="#800E13" strokeWidth="1" />
      <Path d="M 33 26 C 42 24, 46 34, 42 42 C 38 46, 30 45, 28 41 Z" fill="#D4A373" stroke="#8C5832" strokeWidth="1.5" />
      <Rect x="15" y="24" width="20" height="20" rx="6" fill="#E63946" />
      <Circle cx="25" cy="18" r="10" fill="#E63946" />
      <Ellipse cx="21" cy="18" rx="2" ry="2.5" fill="#FFF" />
      <Circle cx="21" cy="18" r="1.1" fill="#000" />
      <Ellipse cx="29" cy="18" rx="2" ry="2.5" fill="#FFF" />
      <Circle cx="29" cy="18" r="1.1" fill="#000" />
      <Path d="M 21 23 Q 25 27 29 23" stroke="#000" strokeWidth="1.5" fill="none" />
    </G>
    <G transform="translate(30, 80)">
      <Circle cx="25" cy="20" r="14" fill="#F8C8A0" stroke="#222" strokeWidth="2" />
      <Path d="M 18 24 Q 25 20 32 24" fill="none" stroke="#222" strokeWidth="2" />
      <Path d="M 14 16 L 36 16 L 33 13 L 17 13 Z" fill="#111" />
      <Path d="M 15 13 C 15 4 35 4 35 13 Z" fill="#1E293B" stroke="#222" strokeWidth="2" />
    </G>
  </Svg>
);

// --- BFS Evasion Engine ---
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
    setGameStatus('POLICE_WON');
    triggerWinHaptic();
    soundFX.playVictory();
    const starsEarned = calculateStars(finalMoves, currentLevel.starThresholds);
    onSaveHighScore(currentLevel.id, finalMoves, starsEarned);
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
        setGameStatus('BUGGU_WON');
        triggerLossHaptic();
        soundFX.playEscape();
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
  const starsEarned = calculateStars(moves, currentLevel.starThresholds);

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
            {'★'.repeat(starsEarned)}
          </Text>
        </View>
      </View>

      <View style={styles.turnCard}>
        <View style={styles.turnRow}>
          {gameStatus === 'POLICE_WON' ? (
            <Text style={[styles.turnLabel, { color: '#10B981' }]}>THIEF CAUGHT! BUGGU SURROUNDED!</Text>
          ) : gameStatus === 'BUGGU_WON' ? (
            <Text style={[styles.turnLabel, { color: '#EF4444' }]}>BUGGU ESCAPED TO THE EXIT PORTAL!</Text>
          ) : currentTurn === 'POLICE' ? (
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

      <Modal visible={gameStatus !== 'PLAYING'} animationType="fade" transparent={true}>
        <View style={styles.endGameOverlay}>
          <View style={styles.endGameCard}>
            {gameStatus === 'POLICE_WON' ? (
              <View style={styles.ribbonWrapper}>
                <View style={styles.ribbonTailLeft} />
                <View style={styles.ribbonBody}>
                  <Text style={styles.ribbonText}>WIN</Text>
                </View>
                <View style={styles.ribbonTailRight} />
              </View>
            ) : (
              <View style={styles.ribbonWrapper}>
                <View style={[styles.ribbonTailLeft, { borderRightColor: '#DC2626' }]} />
                <View style={[styles.ribbonBody, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.ribbonText}>FAILED</Text>
                </View>
                <View style={[styles.ribbonTailRight, { borderLeftColor: '#DC2626' }]} />
              </View>
            )}

            <View style={styles.artworkContainer}>
              {gameStatus === 'POLICE_WON' ? <VictoryArtwork /> : <DefeatArtwork />}
            </View>

            <Text style={styles.endGameTitle}>
              {gameStatus === 'POLICE_WON' ? 'Thief Captured!' : 'Buggu Escaped!'}
            </Text>
            <Text style={styles.endGameSubtitle}>
              {gameStatus === 'POLICE_WON'
                ? `Cleared in ${moves} moves  ${'★'.repeat(starsEarned)}`
                : 'Buggu reached the exit node first'}
            </Text>

            {gameStatus === 'POLICE_WON' ? (
              <TouchableOpacity
                style={styles.greenNextBtn}
                activeOpacity={0.85}
                onPress={() => setLevelIndex((prev) => (prev + 1) % ALL_LEVELS.length)}
              >
                <Text style={styles.greenNextBtnText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.greenNextBtn, { backgroundColor: '#EF4444' }]}
                activeOpacity={0.85}
                onPress={() => resetLevel(levelIndex)}
              >
                <Text style={styles.greenNextBtnText}>Try Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
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
  endGameOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  endGameCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#EBE5D8',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: '#D4CBB6',
    elevation: 12,
  },
  ribbonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ribbonBody: {
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 36,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#78350F',
    zIndex: 2,
  },
  ribbonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#78350F',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 1,
  },
  ribbonTailLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#D97706',
    marginRight: -6,
  },
  ribbonTailRight: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#D97706',
    marginLeft: -6,
  },
  artworkContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  endGameTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#292524',
    marginTop: 10,
  },
  endGameSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78716C',
    marginTop: 4,
    marginBottom: 24,
  },
  greenNextBtn: {
    width: '75%',
    backgroundColor: '#74C72B',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4D8B18',
    elevation: 4,
  },
  greenNextBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: '#365E14',
    textShadowOffset: { width: 1, height: 1.5 },
    textShadowRadius: 1,
  },
});

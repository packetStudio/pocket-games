import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Svg from 'react-native-svg';
import { GameBoard } from '../components/GameBoard';
import { PoliceSprite } from '../components/PoliceSprite';
import { BugguSprite } from '../components/BugguSprite';
import { ALL_LEVELS, LevelConfig } from '../engine/graphData';
import { isValidMove, checkVictory, GameStatus } from '../engine/gameRules';
import { getBestBugguMove } from '../engine/pathfinding';

interface BhagBugguBhagScreenProps {
  initialLevel?: LevelConfig;
  onBackToHub?: () => void;
}

export const BhagBugguBhagScreen: React.FC<BhagBugguBhagScreenProps> = ({
  initialLevel = ALL_LEVELS[0],
  onBackToHub,
}) => {
  const [levelIndex, setLevelIndex] = useState(
    ALL_LEVELS.findIndex((lvl) => lvl.id === initialLevel.id) !== -1
      ? ALL_LEVELS.findIndex((lvl) => lvl.id === initialLevel.id)
      : 0
  );
  const currentLevel = ALL_LEVELS[levelIndex];

  const [policePositions, setPolicePositions] = useState<number[]>(currentLevel.initialPolice);
  const [bugguPosition, setBugguPosition] = useState<number>(currentLevel.initialBuggu);
  const [selectedPoliceIndex, setSelectedPoliceIndex] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'POLICE' | 'BUGGU'>('POLICE');
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');

  useEffect(() => {
    resetLevel(levelIndex);
  }, [levelIndex]);

  const resetLevel = (idx: number) => {
    const lvl = ALL_LEVELS[idx];
    setPolicePositions([...lvl.initialPolice]);
    setBugguPosition(lvl.initialBuggu);
    setSelectedPoliceIndex(null);
    setCurrentTurn('POLICE');
    setGameStatus('PLAYING');
  };

  const handleBugguTurn = (activePolice: number[]) => {
    setTimeout(() => {
      const nextMove = getBestBugguMove(bugguPosition, activePolice, currentLevel.nodes);

      if (nextMove === null) {
        setGameStatus('POLICE_WON');
        Alert.alert('Thief Caught!', 'Buggu is surrounded! Police won!', [
          { text: 'Next Level', onPress: () => nextLevel() },
          { text: 'Replay', onPress: () => resetLevel(levelIndex) },
        ]);
        return;
      }

      setBugguPosition(nextMove);
      const status = checkVictory(nextMove, activePolice, currentLevel.nodes);

      if (status === 'BUGGU_WON') {
        setGameStatus('BUGGU_WON');
        Alert.alert('Escaped!', 'Buggu reached an escape exit! Thief won!', [
          { text: 'Try Again', onPress: () => resetLevel(levelIndex) },
        ]);
      } else {
        setCurrentTurn('POLICE');
      }
    }, 450);
  };

  const nextLevel = () => {
    setLevelIndex((prev) => (prev + 1) % ALL_LEVELS.length);
  };

  const onNodePress = (nodeId: number) => {
    if (gameStatus !== 'PLAYING' || currentTurn !== 'POLICE') return;

    const copIdx = policePositions.indexOf(nodeId);
    if (copIdx !== -1) {
      setSelectedPoliceIndex(copIdx);
      return;
    }

    if (selectedPoliceIndex !== null) {
      const fromNodeId = policePositions[selectedPoliceIndex];
      const occupiedNodes = [...policePositions, bugguPosition];

      if (isValidMove(fromNodeId, nodeId, currentLevel.nodes, occupiedNodes)) {
        const updatedPolice = [...policePositions];
        updatedPolice[selectedPoliceIndex] = nodeId;
        setPolicePositions(updatedPolice);
        setSelectedPoliceIndex(null);

        const status = checkVictory(bugguPosition, updatedPolice, currentLevel.nodes);
        if (status === 'POLICE_WON') {
          setGameStatus('POLICE_WON');
          Alert.alert('Thief Caught!', 'Buggu is surrounded! Police won!', [
            { text: 'Next Level', onPress: () => nextLevel() },
            { text: 'Replay', onPress: () => resetLevel(levelIndex) },
          ]);
          return;
        }

        setCurrentTurn('BUGGU');
        handleBugguTurn(updatedPolice);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* NAVIGATION & HEADER BAR */}
      <View style={styles.topBar}>
        {onBackToHub ? (
          <TouchableOpacity style={styles.backButton} onPress={onBackToHub}>
            <Text style={styles.backButtonText}>← HUB</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
        <Text style={styles.levelBadge}>{currentLevel.name}</Text>
        <TouchableOpacity style={styles.restartIconBtn} onPress={() => resetLevel(levelIndex)}>
          <Text style={styles.restartIconText}>↺</Text>
        </TouchableOpacity>
      </View>

      {/* TURN STATUS BANNER (USING VECTOR SPRITES) */}
      <View style={styles.turnCard}>
        <View style={styles.turnRow}>
          {currentTurn === 'POLICE' ? (
            <>
              <View style={styles.badgeSvgWrapper}>
                <Svg width={32} height={32} viewBox="0 0 32 32">
                  <PoliceSprite x={16} y={16} size={28} />
                </Svg>
              </View>
              <Text style={styles.turnLabel}>
                POLICE TURN: Select an officer, then tap an adjacent ring
              </Text>
            </>
          ) : (
            <>
              <View style={styles.badgeSvgWrapper}>
                <Svg width={32} height={32} viewBox="0 0 32 32">
                  <BugguSprite x={16} y={16} size={26} />
                </Svg>
              </View>
              <Text style={styles.turnLabel}>
                BUGGU MOVING: Plotting escape route...
              </Text>
            </>
          )}
        </View>
      </View>

      {/* GAME BOARD CANVAS */}
      <View style={styles.boardWrapper}>
        <GameBoard
          nodes={currentLevel.nodes}
          policePositions={policePositions}
          bugguPosition={bugguPosition}
          selectedPoliceIndex={selectedPoliceIndex}
          onNodePress={onNodePress}
        />
      </View>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => resetLevel(levelIndex)}>
          <Text style={styles.actionBtnText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.nextBtn]} onPress={nextLevel}>
          <Text style={styles.actionBtnText}>Next Level →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  backButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  backButtonText: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 12,
  },
  levelBadge: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  restartIconBtn: {
    backgroundColor: '#1E293B',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  restartIconText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  turnCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  turnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  badgeSvgWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FCD34D',
    flexShrink: 1,
  },
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextBtn: {
    backgroundColor: '#2563EB',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});

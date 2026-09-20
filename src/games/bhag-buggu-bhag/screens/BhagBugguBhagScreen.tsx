import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { GameBoard } from '../components/GameBoard';
import { ALL_LEVELS, LevelConfig } from '../engine/graphData';
import { isValidMove, checkVictory, Turn, GameStatus } from '../engine/gameRules';
import { getBestBugguMove } from '../engine/pathfinding';

export const BhagBugguBhagScreen: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const currentLevel: LevelConfig = ALL_LEVELS[levelIndex];

  const [policePositions, setPolicePositions] = useState<number[]>(currentLevel.initialPolice);
  const [bugguPosition, setBugguPosition] = useState<number>(currentLevel.initialBuggu);
  const [selectedPoliceIndex, setSelectedPoliceIndex] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<Turn>('POLICE');
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');

  const resetGame = (newLevelIdx = levelIndex) => {
    const lvl = ALL_LEVELS[newLevelIdx];
    setLevelIndex(newLevelIdx);
    setPolicePositions(lvl.initialPolice);
    setBugguPosition(lvl.initialBuggu);
    setSelectedPoliceIndex(null);
    setCurrentTurn('POLICE');
    setGameStatus('PLAYING');
  };

  const handleBugguTurn = (activePolice: number[]) => {
    setTimeout(() => {
      const nextBugguMove = getBestBugguMove(bugguPosition, activePolice, currentLevel.nodes);

      if (nextBugguMove === null) {
        setGameStatus('POLICE_WON');
        Alert.alert('Thief Caught!', 'Buggu is surrounded! Police won!', [
          { text: 'Next Level', onPress: () => nextLevel() },
          { text: 'Replay', onPress: () => resetGame() },
        ]);
        return;
      }

      setBugguPosition(nextBugguMove);

      const statusAfterMove = checkVictory(nextBugguMove, activePolice, currentLevel.nodes);
      if (statusAfterMove === 'BUGGU_WON') {
        setGameStatus('BUGGU_WON');
        Alert.alert('Escaped!', 'Buggu reached an exit target! Buggu won!', [
          { text: 'Try Again', onPress: () => resetGame() },
        ]);
      } else {
        setCurrentTurn('POLICE');
      }
    }, 450);
  };

  const nextLevel = () => {
    const nextIdx = (levelIndex + 1) % ALL_LEVELS.length;
    resetGame(nextIdx);
  };

  const onNodePress = (nodeId: number) => {
    if (gameStatus !== 'PLAYING' || currentTurn !== 'POLICE') return;

    // Check if clicked on one of the police officers
    const clickedPoliceIndex = policePositions.indexOf(nodeId);
    if (clickedPoliceIndex !== -1) {
      setSelectedPoliceIndex(clickedPoliceIndex);
      return;
    }

    // Attempt to move selected officer to empty node
    if (selectedPoliceIndex !== null) {
      const fromNodeId = policePositions[selectedPoliceIndex];
      const occupied = [...policePositions, bugguPosition];

      if (isValidMove(fromNodeId, nodeId, currentLevel.nodes, occupied)) {
        const updatedPolice = [...policePositions];
        updatedPolice[selectedPoliceIndex] = nodeId;
        setPolicePositions(updatedPolice);
        setSelectedPoliceIndex(null);

        const status = checkVictory(bugguPosition, updatedPolice, currentLevel.nodes);
        if (status === 'POLICE_WON') {
          setGameStatus('POLICE_WON');
          Alert.alert('Thief Caught!', 'Buggu is surrounded! Police won!', [
            { text: 'Next Level', onPress: () => nextLevel() },
            { text: 'Replay', onPress: () => resetGame() },
          ]);
          return;
        }

        setCurrentTurn('BUGGU');
        handleBugguTurn(updatedPolice);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentLevel.name}</Text>
        <Text style={styles.turnIndicator}>
          Turn: {currentTurn === 'POLICE' ? '👮 Police (Your Turn)' : '🦹 Buggu is thinking...'}
        </Text>
      </View>

      <View style={styles.boardWrapper}>
        <GameBoard
          nodes={currentLevel.nodes}
          policePositions={policePositions}
          bugguPosition={bugguPosition}
          selectedPoliceIndex={selectedPoliceIndex}
          onNodePress={onNodePress}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => resetGame()}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={nextLevel}>
          <Text style={styles.buttonText}>Switch Level</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E424B',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  turnIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD54F',
    marginTop: 6,
  },
  boardWrapper: {
    marginVertical: 10,
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: '#546E7A',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

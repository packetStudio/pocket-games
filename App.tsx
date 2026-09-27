import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { ArcadeHubScreen } from './src/screens/ArcadeHubScreen';
import { BhagBugguBhagScreen } from './src/games/bhag-buggu-bhag/screens/BhagBugguBhagScreen';
import { LevelConfig } from './src/games/bhag-buggu-bhag/engine/graphData';

export default function App() {
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);
  const [highScores, setHighScores] = useState<Record<number, { moves: number; stars: number }>>({});

  const handleSaveHighScore = (levelId: number, moves: number, stars: number) => {
    setHighScores((prev) => {
      const existing = prev[levelId];
      if (!existing || moves < existing.moves) {
        return {
          ...prev,
          [levelId]: { moves, stars: Math.max(stars, existing?.stars || 1) },
        };
      }
      return prev;
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      {activeLevel ? (
        <BhagBugguBhagScreen
          initialLevel={activeLevel}
          onBackToHub={() => setActiveLevel(null)}
          highScores={highScores}
          onSaveHighScore={handleSaveHighScore}
        />
      ) : (
        <ArcadeHubScreen
          onSelectLevel={(lvl) => setActiveLevel(lvl)}
          highScores={highScores}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});

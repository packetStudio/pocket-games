import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArcadeHubScreen } from './src/screens/ArcadeHubScreen';
import { BhagBugguBhagScreen } from './src/games/bhag-buggu-bhag/screens/BhagBugguBhagScreen';
import { LevelConfig } from './src/games/bhag-buggu-bhag/engine/graphData';

const STORAGE_KEY = '@pocket_games_high_scores';

export default function App() {
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);
  const [highScores, setHighScores] = useState<Record<number, { moves: number; stars: number }>>({});

  // Load saved high scores from local disk on startup
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setHighScores(JSON.parse(saved));
        }
      } catch (err) {
        console.warn('Failed to load high scores:', err);
      }
    })();
  }, []);

  const handleSaveHighScore = (levelId: number, moves: number, stars: number) => {
    setHighScores((prev) => {
      const existing = prev[levelId];
      if (!existing || moves < existing.moves) {
        const updated = {
          ...prev,
          [levelId]: { moves, stars: Math.max(stars, existing?.stars || 1) },
        };
        // Persist updated records to local storage
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
          console.warn('Failed to persist score:', err)
        );
        return updated;
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
    paddingTop: StatusBar.currentHeight ?? 0,
  },
});

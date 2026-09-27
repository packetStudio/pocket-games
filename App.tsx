import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { ArcadeHubScreen } from './src/screens/ArcadeHubScreen';
import { BhagBugguBhagScreen } from './src/games/bhag-buggu-bhag/BhagBugguBhagScreen';
import { LevelConfig } from './src/games/bhag-buggu-bhag/engine/graphData';

export default function App() {
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      {activeLevel ? (
        <BhagBugguBhagScreen
          initialLevel={activeLevel}
          onBackToHub={() => setActiveLevel(null)}
        />
      ) : (
        <ArcadeHubScreen onSelectLevel={(lvl) => setActiveLevel(lvl)} />
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

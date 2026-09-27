import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { ALL_LEVELS, LevelConfig } from '../games/bhag-buggu-bhag/engine/graphData';

interface GameItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  isAvailable: boolean;
  accentColor: string;
}

const GAMES_CATALOG: GameItem[] = [
  {
    id: 'bhag-buggu-bhag',
    title: 'Bhag Buggu Bhag',
    subtitle: 'Outsmart the thief on dynamic node networks',
    badge: 'PLAY NOW',
    badgeColor: '#10B981',
    isAvailable: true,
    accentColor: '#3B82F6',
  },
  {
    id: 'laser-maze',
    title: 'Laser Grid',
    subtitle: 'Reflect light beams to crack the high-security vault',
    badge: 'COMING SOON',
    badgeColor: '#F59E0B',
    isAvailable: false,
    accentColor: '#8B5CF6',
  },
  {
    id: 'pipe-heist',
    title: 'Sewage Escape',
    subtitle: 'Rotate pressure valves before water levels rise',
    badge: 'LOCKED',
    badgeColor: '#6B7280',
    isAvailable: false,
    accentColor: '#EC4899',
  },
];

interface ArcadeHubProps {
  onSelectLevel: (level: LevelConfig) => void;
}

export const ArcadeHubScreen: React.FC<ArcadeHubProps> = ({ onSelectLevel }) => {
  const [levelModalVisible, setLevelModalVisible] = useState(false);

  const handleGamePress = (game: GameItem) => {
    if (!game.isAvailable) return;
    setLevelModalVisible(true);
  };

  const handleLevelSelect = (level: LevelConfig) => {
    setLevelModalVisible(false);
    onSelectLevel(level);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* TOP BRAND HEADER */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoPill}>
              <Text style={styles.logoText}>⚡ POCKET GAMES</Text>
            </View>
            <Text style={styles.versionTag}>v1.0</Text>
          </View>
          <Text style={styles.heroTitle}>Arcade Arena</Text>
          <Text style={styles.heroSubtitle}>
            Select an operation and test your tactical instincts
          </Text>
        </View>

        {/* STATS BAR */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>5</Text>
            <Text style={styles.statLabel}>Arenas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>AI</Text>
            <Text style={styles.statLabel}>BFS Pathing</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>PRO</Text>
            <Text style={styles.statLabel}>Difficulty</Text>
          </View>
        </View>

        {/* GAMES LIST */}
        <Text style={styles.sectionHeader}>FEATURED OPS</Text>

        {GAMES_CATALOG.map((game) => (
          <TouchableOpacity
            key={game.id}
            activeOpacity={game.isAvailable ? 0.8 : 1}
            onPress={() => handleGamePress(game)}
            style={[
              styles.gameCard,
              { borderLeftColor: game.accentColor },
              !game.isAvailable && styles.gameCardDisabled,
            ]}
          >
            <View style={styles.gameCardTop}>
              <Text style={styles.gameTitle}>{game.title}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: game.badgeColor },
                ]}
              >
                <Text style={styles.badgeText}>{game.badge}</Text>
              </View>
            </View>

            <Text style={styles.gameSubtitle}>{game.subtitle}</Text>

            <View style={styles.gameFooter}>
              <Text
                style={[
                  styles.ctaLabel,
                  { color: game.isAvailable ? game.accentColor : '#64748B' },
                ]}
              >
                {game.isAvailable ? 'SELECT LEVEL →' : 'LOCKED'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LEVEL SELECTION MODAL */}
      <Modal
        visible={levelModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLevelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Choose Level</Text>
                <Text style={styles.modalSubtitle}>Bhag Buggu Bhag Arenas</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setLevelModalVisible(false)}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={ALL_LEVELS}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.levelList}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.levelCard}
                  onPress={() => handleLevelSelect(item)}
                >
                  <View style={styles.levelNumBadge}>
                    <Text style={styles.levelNumText}>{item.id}</Text>
                  </View>
                  <View style={styles.levelInfo}>
                    <Text style={styles.levelName}>{item.name}</Text>
                    <Text style={styles.levelMeta}>
                      {item.nodes.length} Nodes • {item.initialPolice.length} Police Officers
                    </Text>
                  </View>
                  <Text style={styles.startArrow}>▶</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoText: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  versionTag: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#38BDF8',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#334155',
  },
  sectionHeader: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  gameCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  gameCardDisabled: {
    opacity: 0.55,
  },
  gameCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  gameSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  gameFooter: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  ctaLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  levelList: {
    gap: 10,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  levelNumBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  levelNumText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  levelMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  startArrow: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

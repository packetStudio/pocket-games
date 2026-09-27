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
import { ALL_LEVELS, LevelConfig } from '../games/bhag-buggu-bhag/engine/graphData';

interface Props {
  onSelectLevel: (lvl: LevelConfig) => void;
  highScores: Record<number, { moves: number; stars: number }>;
}

export const ArcadeHubScreen: React.FC<Props> = ({ onSelectLevel, highScores }) => {
  const [levelModalVisible, setLevelModalVisible] = useState<boolean>(false);
  const totalArenasCleared = Object.keys(highScores).length;

  return (
    <SafeAreaView style={styles.hubScreen}>
      <ScrollView contentContainerStyle={styles.hubContent}>
        <View style={styles.brandRow}>
          <View style={styles.logoPill}>
            <Text style={styles.logoText}>⚡ POCKET GAMES</Text>
          </View>
          <Text style={styles.versionTag}>v1.1</Text>
        </View>
        <Text style={styles.heroTitle}>Arcade Arena</Text>
        <Text style={styles.heroSubtitle}>Select an operation and test your tactical instincts</Text>

        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{totalArenasCleared} / {ALL_LEVELS.length}</Text>
            <Text style={styles.statLabel}>Cleared</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>BFS</Text>
            <Text style={styles.statLabel}>AI Engine</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>PRO</Text>
            <Text style={styles.statLabel}>Tactical</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>FEATURED OPS</Text>

        <TouchableOpacity
          style={styles.gameCard}
          activeOpacity={0.8}
          onPress={() => setLevelModalVisible(true)}
        >
          <View style={styles.gameCardTop}>
            <Text style={styles.gameTitle}>Bhag Buggu Bhag</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#10B981' }]}>
              <Text style={styles.badgeText}>READY</Text>
            </View>
          </View>
          <Text style={styles.gameSubtitle}>Outsmart Buggu the thief in the fewest moves possible</Text>
          <View style={styles.gameFooter}>
            <Text style={[styles.ctaLabel, { color: '#3B82F6' }]}>SELECT LEVEL →</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.gameCard, { opacity: 0.55 }]}>
          <View style={styles.gameCardTop}>
            <Text style={styles.gameTitle}>Laser Grid</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#F59E0B' }]}>
              <Text style={styles.badgeText}>LOCKED</Text>
            </View>
          </View>
          <Text style={styles.gameSubtitle}>Reflect light beams to crack the high-security vault</Text>
          <View style={styles.gameFooter}>
            <Text style={[styles.ctaLabel, { color: '#64748B' }]}>COMING SOON</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={levelModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Choose Arena</Text>
                <Text style={styles.modalSubtitle}>Bhag Buggu Bhag Levels</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setLevelModalVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={ALL_LEVELS}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const score = highScores[item.id];
                return (
                  <TouchableOpacity
                    style={styles.levelRow}
                    onPress={() => {
                      setLevelModalVisible(false);
                      onSelectLevel(item);
                    }}
                  >
                    <View style={styles.levelNum}>
                      <Text style={styles.levelNumText}>{item.id}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.levelName}>{item.name}</Text>
                      <Text style={styles.levelMeta}>
                        {score ? `Best: ${score.moves} moves (${'★'.repeat(score.stars)})` : 'Not yet completed'}
                      </Text>
                    </View>
                    <Text style={styles.startArrow}>▶</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hubScreen: { flex: 1, backgroundColor: '#0F172A' },
  hubContent: { padding: 20 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  logoPill: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  logoText: { color: '#38BDF8', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  versionTag: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#F8FAFC' },
  heroSubtitle: { fontSize: 14, color: '#94A3B8', marginTop: 4, marginBottom: 20 },
  statsCard: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 16, padding: 14, marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', color: '#38BDF8' },
  statLabel: { fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: '600' },
  statDivider: { width: 1, backgroundColor: '#334155' },
  sectionHeader: { color: '#64748B', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  gameCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 18, marginBottom: 14, borderLeftWidth: 5, borderLeftColor: '#3B82F6', borderWidth: 1, borderColor: '#334155' },
  gameCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  gameTitle: { fontSize: 18, fontWeight: '800', color: '#F8FAFC' },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  gameSubtitle: { color: '#94A3B8', fontSize: 13, marginBottom: 14 },
  gameFooter: { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 10 },
  ctaLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1E293B', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '75%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#F8FAFC' },
  modalSubtitle: { fontSize: 13, color: '#94A3B8' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { color: '#F8FAFC', fontSize: 14, fontWeight: 'bold' },
  levelRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  levelNum: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  levelNumText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  levelName: { fontSize: 15, fontWeight: '700', color: '#F8FAFC' },
  levelMeta: { fontSize: 12, color: '#64748B', marginTop: 2 },
  startArrow: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold', marginLeft: 10 },
});

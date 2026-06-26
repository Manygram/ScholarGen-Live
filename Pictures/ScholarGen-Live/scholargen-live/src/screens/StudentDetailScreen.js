import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenHeader from '../components/ScreenHeader';
import { colors, paletteFor } from '../theme';

const FALLBACK_STUDENT = {
  name: 'Chidinma Kalu',
  subject: 'Mathematics',
  package: 'Premium',
  status: 'Active',
  sessions: 24,
};

// Mock learning profile + report history for the selected student.
const PROFILE = {
  goal: 'JAMB 2026 — target 300',
  level: 'SS3',
  strengths: ['Algebra', 'Trigonometry'],
  focus: ['Calculus', 'Word problems'],
  attendance: 96,
  avgScore: 78,
};

const HISTORY = [
  { id: '1', date: 'Jun 24', topic: 'Differentiation — chain rule', participation: 'Excellent', hw: 'Done' },
  { id: '2', date: 'Jun 21', topic: 'Limits & continuity', participation: 'Good', hw: 'Done' },
  { id: '3', date: 'Jun 18', topic: 'Quadratic inequalities', participation: 'Fair', hw: 'Partial' },
  { id: '4', date: 'Jun 15', topic: 'Surds and indices', participation: 'Excellent', hw: 'Done' },
];

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function StudentDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const student = route.params?.student || FALLBACK_STUDENT;
  const palette = paletteFor(student.name);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Student Profile" rightIcon="more-vertical" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Identity */}
        <View style={styles.identity}>
          <View style={[styles.avatar, { backgroundColor: palette.bg }]}>
            <Text style={[styles.avatarText, { color: palette.fg }]}>
              {initials(student.name)}
            </Text>
          </View>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.subline}>
            {student.subject} · {student.package} plan
          </Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Ionicons name="school-outline" size={12} color={colors.brand} />
              <Text style={styles.tagText}>{PROFILE.level}</Text>
            </View>
            <View style={styles.tag}>
              <Ionicons name="flag-outline" size={12} color={colors.brand} />
              <Text style={styles.tagText}>{PROFILE.goal}</Text>
            </View>
          </View>
        </View>

        {/* Quick metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{student.sessions ?? 24}</Text>
            <Text style={styles.metricLabel}>Sessions</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{PROFILE.attendance}%</Text>
            <Text style={styles.metricLabel}>Attendance</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{PROFILE.avgScore}%</Text>
            <Text style={styles.metricLabel}>Avg. Score</Text>
          </View>
        </View>

        {/* Learning profile */}
        <Text style={styles.sectionTitle}>Learning Profile</Text>
        <View style={styles.card}>
          <View style={styles.profileBlock}>
            <Text style={styles.profileLabel}>Strengths</Text>
            <View style={styles.chipRow}>
              {PROFILE.strengths.map((s) => (
                <View key={s} style={[styles.chip, styles.chipGreen]}>
                  <Text style={[styles.chipText, styles.chipTextGreen]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.profileBlock, { marginBottom: 0 }]}>
            <Text style={styles.profileLabel}>Needs Focus</Text>
            <View style={styles.chipRow}>
              {PROFILE.focus.map((s) => (
                <View key={s} style={[styles.chip, styles.chipAmber]}>
                  <Text style={[styles.chipText, styles.chipTextAmber]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* History */}
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>Session History</Text>
          <Text style={styles.historyCount}>{HISTORY.length} reports</Text>
        </View>
        <View style={styles.card}>
          {HISTORY.map((h, idx) => (
            <View
              key={h.id}
              style={[styles.historyRow, idx !== HISTORY.length - 1 && styles.historyDivider]}
            >
              <View style={styles.historyDateCol}>
                <Text style={styles.historyDate}>{h.date}</Text>
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTopic} numberOfLines={1}>{h.topic}</Text>
                <View style={styles.historyMetaRow}>
                  <Text style={styles.historyMeta}>Participation: {h.participation}</Text>
                  <Text style={styles.historyMeta}>· HW: {h.hw}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={16} color={colors.inkSoft} />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SessionReport', { student })}
        >
          <Feather name="edit-3" size={18} color={colors.inkOnDark} />
          <Text style={styles.primaryBtnText}>New Session Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },

  identity: { alignItems: 'center', paddingTop: 8, paddingBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: { fontSize: 26, fontWeight: '800' },
  name: { color: colors.ink, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  subline: { color: colors.inkSoft, fontSize: 13, fontWeight: '500', marginTop: 4 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 14, gap: 8 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandSoftAlt,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  tagText: { color: colors.brand, fontSize: 12, fontWeight: '700', marginLeft: 5 },

  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  metricValue: { color: colors.ink, fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  metricLabel: { color: colors.inkSoft, fontSize: 11, fontWeight: '600', marginTop: 4 },

  sectionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  profileBlock: { marginBottom: 18 },
  profileLabel: { color: colors.inkSoft, fontSize: 12, fontWeight: '700', marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 10 },
  chipGreen: { backgroundColor: '#F1F9ED' },
  chipAmber: { backgroundColor: colors.warningSoft },
  chipText: { fontSize: 12, fontWeight: '700' },
  chipTextGreen: { color: colors.success },
  chipTextAmber: { color: colors.warning },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyCount: { color: colors.brand, fontSize: 13, fontWeight: '600' },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  historyDivider: { borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  historyDateCol: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDate: { color: colors.ink, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  historyInfo: { flex: 1, marginLeft: 12 },
  historyTopic: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  historyMetaRow: { flexDirection: 'row', marginTop: 3, gap: 4 },
  historyMeta: { color: colors.inkSoft, fontSize: 11, fontWeight: '500' },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 16,
  },
  primaryBtnText: { color: colors.inkOnDark, fontSize: 15, fontWeight: '800', marginLeft: 8 },
});
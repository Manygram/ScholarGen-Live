import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../components/ScreenHeader';
import TutorBottomNav from '../components/TutorBottomNav';
import { colors, paletteFor } from '../theme';

export const STUDENTS = [
  { id: '1', name: 'Chidinma Kalu', subject: 'Mathematics', package: 'Premium', tier: 'Premium', status: 'Active', sessions: 24, next: 'Today · 4:00 PM' },
  { id: '2', name: 'Emeka Madu', subject: 'Physics', package: 'Standard', tier: 'Standard', status: 'Active', sessions: 12, next: 'Today · 6:00 PM' },
  { id: '3', name: 'Adaobi Diala', subject: 'Further Maths', package: 'Premium', tier: 'Premium', status: 'Active', sessions: 31, next: 'Today · 8:00 PM' },
  { id: '4', name: 'Samuel Okon', subject: 'Mathematics', package: 'Standard', tier: 'Standard', status: 'Active', sessions: 8, next: 'Tomorrow · 5:00 PM' },
  { id: '5', name: 'Binta Jibril', subject: 'Chemistry', package: 'Basic', tier: 'Basic', status: 'Paused', sessions: 5, next: '—' },
  { id: '6', name: 'David Ojo', subject: 'Physics', package: 'Premium', tier: 'Premium', status: 'Active', sessions: 19, next: 'Thu · 4:00 PM' },
  { id: '7', name: 'Aisha Olu', subject: 'Chemistry', package: 'Standard', tier: 'Standard', status: 'Trial', sessions: 1, next: 'Fri · 2:00 PM' },
];

const FILTERS = ['All', 'Active', 'Premium', 'Trial', 'Paused'];

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function StatusBadge({ status }) {
  const map = {
    Active: { bg: '#F1F9ED', fg: colors.success },
    Trial: { bg: '#E3F2FD', fg: colors.info },
    Paused: { bg: '#F4F6F4', fg: colors.inkSoft },
  };
  const s = map[status] || map.Active;
  return (
    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
      <Text style={[styles.statusBadgeText, { color: s.fg }]}>{status}</Text>
    </View>
  );
}

export default function StudentsScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDENTS.filter((s) => {
      const matchesQuery = !q || s.name.toLowerCase().includes(q);
      const matchesFilter =
        filter === 'All' ||
        s.status === filter ||
        s.tier === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="My Students"
        subtitle={`${STUDENTS.length} enrolled`}
        rightIcon="user-plus"
      />

      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color={colors.inkSoft} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name…"
          placeholderTextColor={colors.inkSoft}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
            <Feather name="x" size={18} color={colors.inkSoft} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, active && styles.filterChipActive]}
              activeOpacity={0.8}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {results.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="users" size={28} color={colors.inkSoft} />
            <Text style={styles.emptyText}>No students match your search</Text>
          </View>
        ) : (
          results.map((student) => {
            const palette = paletteFor(student.name);
            return (
              <TouchableOpacity
                key={student.id}
                style={styles.studentCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('StudentDetail', { student })}
              >
                <View style={[styles.avatar, { backgroundColor: palette.bg }]}>
                  <Text style={[styles.avatarText, { color: palette.fg }]}>
                    {initials(student.name)}
                  </Text>
                </View>
                <View style={styles.studentInfo}>
                  <View style={styles.studentTopRow}>
                    <Text style={styles.studentName} numberOfLines={1}>
                      {student.name}
                    </Text>
                    <StatusBadge status={student.status} />
                  </View>
                  <Text style={styles.studentMeta} numberOfLines={1}>
                    {student.subject} · {student.package}
                  </Text>
                  <View style={styles.studentBottomRow}>
                    <View style={styles.metaItem}>
                      <Feather name="book-open" size={12} color={colors.inkSoft} />
                      <Text style={styles.metaItemText}>{student.sessions} sessions</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Feather name="clock" size={12} color={colors.inkSoft} />
                      <Text style={styles.metaItemText}>{student.next}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.reportBtn}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('SessionReport', { student })
                  }
                >
                  <Feather name="edit-3" size={16} color={colors.brand} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TutorBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 4,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    color: colors.ink,
    padding: 0,
  },

  filterScroll: { flexGrow: 0, marginTop: 14 },
  filterContent: { paddingHorizontal: 24, gap: 8 },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterChipActive: { backgroundColor: colors.brandDeep, borderColor: colors.brandDeep },
  filterChipText: { color: colors.inkSoft, fontSize: 13, fontWeight: '600' },
  filterChipTextActive: { color: colors.inkOnDark, fontWeight: '700' },

  listContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 130 },

  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800' },
  studentInfo: { flex: 1, marginLeft: 12 },
  studentTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  studentName: { color: colors.ink, fontSize: 15, fontWeight: '800', flex: 1, marginRight: 8 },
  studentMeta: { color: colors.inkSoft, fontSize: 13, fontWeight: '500', marginTop: 2 },
  studentBottomRow: { flexDirection: 'row', marginTop: 8, gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaItemText: { color: colors.inkSoft, fontSize: 11, fontWeight: '600', marginLeft: 4 },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },

  reportBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: colors.inkSoft, fontSize: 14, fontWeight: '600', marginTop: 12 },
});
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenHeader from '../components/ScreenHeader';
import { colors, paletteFor } from '../theme';

const PARTICIPATION = [
  { key: 'Excellent', emoji: '🔥' },
  { key: 'Good', emoji: '👍' },
  { key: 'Fair', emoji: '😐' },
  { key: 'Low', emoji: '😴' },
];

const HOMEWORK = ['Completed', 'Partial', 'Not done', 'None set'];

// Common topic suggestions speed up logging — tap to add instead of typing.
const TOPIC_SUGGESTIONS = ['Differentiation', 'Integration', 'Algebra', 'Probability', 'Vectors'];

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function todayLabel() {
  return new Date().toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function SessionReportScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const student = route.params?.student || {
    name: 'Chidinma Kalu',
    subject: 'Mathematics',
  };
  const palette = paletteFor(student.name);

  const [topics, setTopics] = useState('');
  const [participation, setParticipation] = useState('Good');
  const [homework, setHomework] = useState('Completed');
  const [notes, setNotes] = useState('');

  const addTopic = (t) => {
    setTopics((prev) => (prev ? `${prev}, ${t}` : t));
  };

  const canSubmit = topics.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Session Report" subtitle="Takes under a minute" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Auto-filled context */}
        <View style={styles.contextCard}>
          <View style={[styles.avatar, { backgroundColor: palette.bg }]}>
            <Text style={[styles.avatarText, { color: palette.fg }]}>
              {initials(student.name)}
            </Text>
          </View>
          <View style={styles.contextInfo}>
            <Text style={styles.contextName}>{student.name}</Text>
            <Text style={styles.contextMeta}>
              {student.subject || 'Mathematics'} · {todayLabel()}
            </Text>
          </View>
          <View style={styles.autoBadge}>
            <Feather name="zap" size={11} color={colors.brand} />
            <Text style={styles.autoBadgeText}>Auto</Text>
          </View>
        </View>

        {/* Topics */}
        <Text style={styles.label}>Topics Covered *</Text>
        <TextInput
          style={styles.topicInput}
          placeholder="What did you teach today?"
          placeholderTextColor={colors.inkSoft}
          value={topics}
          onChangeText={setTopics}
          multiline
        />
        <View style={styles.suggestionRow}>
          {TOPIC_SUGGESTIONS.map((t) => (
            <TouchableOpacity
              key={t}
              style={styles.suggestionChip}
              activeOpacity={0.8}
              onPress={() => addTopic(t)}
            >
              <Feather name="plus" size={11} color={colors.brand} />
              <Text style={styles.suggestionText}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Participation */}
        <Text style={styles.label}>Participation</Text>
        <View style={styles.optionRow}>
          {PARTICIPATION.map((p) => {
            const active = participation === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                style={[styles.optionCard, active && styles.optionCardActive]}
                activeOpacity={0.8}
                onPress={() => setParticipation(p.key)}
              >
                <Text style={styles.optionEmoji}>{p.emoji}</Text>
                <Text style={[styles.optionText, active && styles.optionTextActive]}>
                  {p.key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Homework */}
        <Text style={styles.label}>Homework</Text>
        <View style={styles.pillRow}>
          {HOMEWORK.map((h) => {
            const active = homework === h;
            return (
              <TouchableOpacity
                key={h}
                style={[styles.pill, active && styles.pillActive]}
                activeOpacity={0.8}
                onPress={() => setHomework(h)}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{h}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes for Parent / Student (optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Any highlights or things to work on…"
          placeholderTextColor={colors.inkSoft}
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </ScrollView>

      {/* Single submit */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          activeOpacity={0.85}
          disabled={!canSubmit}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="checkmark-circle" size={18} color={colors.inkOnDark} />
          <Text style={styles.submitBtnText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },

  contextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '800' },
  contextInfo: { flex: 1, marginLeft: 12 },
  contextName: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  contextMeta: { color: colors.inkSoft, fontSize: 12, fontWeight: '500', marginTop: 2 },
  autoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 8,
  },
  autoBadgeText: { color: colors.brand, fontSize: 11, fontWeight: '700', marginLeft: 3 },

  label: { color: colors.ink, fontSize: 14, fontWeight: '800', marginBottom: 10, letterSpacing: -0.3 },

  topicInput: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    fontSize: 14,
    fontWeight: '500',
    color: colors.ink,
    minHeight: 60,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  suggestionRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginBottom: 24, gap: 8 },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandSoftAlt,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  suggestionText: { color: colors.brand, fontSize: 12, fontWeight: '600', marginLeft: 4 },

  optionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 10 },
  optionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  optionCardActive: { backgroundColor: colors.brandSoft, borderColor: colors.brand },
  optionEmoji: { fontSize: 20, marginBottom: 6 },
  optionText: { color: colors.inkSoft, fontSize: 11, fontWeight: '600' },
  optionTextActive: { color: colors.success, fontWeight: '800' },

  pillRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24, gap: 8 },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillActive: { backgroundColor: colors.brandDeep, borderColor: colors.brandDeep },
  pillText: { color: colors.inkSoft, fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: colors.inkOnDark, fontWeight: '700' },

  notesInput: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    fontSize: 14,
    fontWeight: '500',
    color: colors.ink,
    minHeight: 90,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },

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
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 16,
  },
  submitBtnDisabled: { backgroundColor: '#C5D6BD' },
  submitBtnText: { color: colors.inkOnDark, fontSize: 15, fontWeight: '800', marginLeft: 8 },
});
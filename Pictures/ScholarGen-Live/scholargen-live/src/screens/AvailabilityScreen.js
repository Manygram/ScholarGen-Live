import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import TutorBottomNav from '../components/TutorBottomNav';
import { colors } from '../theme';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// A pool of selectable time slots for the chosen day.
const SLOT_POOL = [
  '8:00 AM',
  '10:00 AM',
  '12:00 PM',
  '2:00 PM',
  '4:00 PM',
  '6:00 PM',
  '8:00 PM',
];

const INITIAL_DAYS = {
  Mon: { enabled: true, start: '4:00 PM', end: '8:00 PM', maxStudents: 3, slots: ['4:00 PM', '6:00 PM'] },
  Tue: { enabled: true, start: '4:00 PM', end: '8:00 PM', maxStudents: 3, slots: ['4:00 PM'] },
  Wed: { enabled: false, start: '4:00 PM', end: '8:00 PM', maxStudents: 2, slots: [] },
  Thu: { enabled: true, start: '2:00 PM', end: '6:00 PM', maxStudents: 4, slots: ['2:00 PM', '4:00 PM'] },
  Fri: { enabled: true, start: '4:00 PM', end: '8:00 PM', maxStudents: 3, slots: ['6:00 PM'] },
  Sat: { enabled: true, start: '10:00 AM', end: '4:00 PM', maxStudents: 5, slots: ['10:00 AM', '12:00 PM', '2:00 PM'] },
  Sun: { enabled: false, start: '10:00 AM', end: '2:00 PM', maxStudents: 2, slots: [] },
};

export default function AvailabilityScreen() {
  const [days, setDays] = useState(INITIAL_DAYS);
  const [selectedDay, setSelectedDay] = useState('Mon');
  const day = days[selectedDay];

  const update = (patch) =>
    setDays((prev) => ({ ...prev, [selectedDay]: { ...prev[selectedDay], ...patch } }));

  const toggleSlot = (slot) => {
    const has = day.slots.includes(slot);
    update({ slots: has ? day.slots.filter((s) => s !== slot) : [...day.slots, slot] });
  };

  // Live status — booked slots reaching max students means fully booked.
  const isFullyBooked = day.enabled && day.slots.length >= day.maxStudents && day.slots.length > 0;
  const status = !day.enabled ? 'OFF' : isFullyBooked ? 'FULLY BOOKED' : 'AVAILABLE';

  const enabledCount = useMemo(
    () => Object.values(days).filter((d) => d.enabled).length,
    [days],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Availability"
        subtitle={`${enabledCount} active days this week`}
        rightIcon="help-circle"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Live status banner */}
        <View
          style={[
            styles.statusBanner,
            status === 'AVAILABLE' && styles.statusAvailable,
            status === 'FULLY BOOKED' && styles.statusBooked,
            status === 'OFF' && styles.statusOff,
          ]}
        >
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    status === 'AVAILABLE'
                      ? colors.brandBright
                      : status === 'FULLY BOOKED'
                      ? colors.warning
                      : colors.inkSoft,
                },
              ]}
            />
            <Text style={styles.statusLabel}>{selectedDay} · {status}</Text>
          </View>
          <Text style={styles.statusMeta}>
            {day.slots.length}/{day.maxStudents} slots booked
          </Text>
        </View>

        {/* Week grid */}
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weekGrid}>
          {DAYS.map((d) => {
            const isActive = d === selectedDay;
            const isEnabled = days[d].enabled;
            return (
              <TouchableOpacity
                key={d}
                style={[
                  styles.dayCell,
                  isActive && styles.dayCellActive,
                  !isEnabled && styles.dayCellDisabled,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedDay(d)}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    isActive && styles.dayLabelActive,
                    !isEnabled && styles.dayLabelDisabled,
                  ]}
                >
                  {d}
                </Text>
                <View
                  style={[
                    styles.daySlotCount,
                    isActive && styles.daySlotCountActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.daySlotCountText,
                      isActive && styles.daySlotCountTextActive,
                    ]}
                  >
                    {isEnabled ? days[d].slots.length : '–'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Day toggle */}
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.cardTitle}>Available on {selectedDay}</Text>
              <Text style={styles.cardSub}>Students can book sessions on this day</Text>
            </View>
            <Switch
              value={day.enabled}
              onValueChange={(v) => update({ enabled: v })}
              trackColor={{ false: '#E2E8E0', true: colors.brandBright }}
              thumbColor={colors.card}
            />
          </View>
        </View>

        {/* Time picker */}
        <View style={[styles.card, !day.enabled && styles.cardDimmed]}>
          <Text style={styles.cardTitle}>Working Hours</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Text style={styles.timeFieldLabel}>Start</Text>
              <TouchableOpacity style={styles.timeInput} activeOpacity={0.7} disabled={!day.enabled}>
                <Feather name="clock" size={14} color={colors.brand} />
                <Text style={styles.timeInputText}>{day.start}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeArrow}>
              <Feather name="arrow-right" size={16} color={colors.inkSoft} />
            </View>
            <View style={styles.timeField}>
              <Text style={styles.timeFieldLabel}>End</Text>
              <TouchableOpacity style={styles.timeInput} activeOpacity={0.7} disabled={!day.enabled}>
                <Feather name="clock" size={14} color={colors.brand} />
                <Text style={styles.timeInputText}>{day.end}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Slots */}
        <View style={[styles.card, !day.enabled && styles.cardDimmed]}>
          <Text style={styles.cardTitle}>Bookable Slots</Text>
          <Text style={styles.cardSub}>Tap to open or close a time slot</Text>
          <View style={styles.slotWrap}>
            {SLOT_POOL.map((slot) => {
              const active = day.slots.includes(slot);
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotChip, active && styles.slotChipActive]}
                  activeOpacity={0.8}
                  disabled={!day.enabled}
                  onPress={() => toggleSlot(slot)}
                >
                  <Text style={[styles.slotChipText, active && styles.slotChipTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Max students */}
        <View style={[styles.card, !day.enabled && styles.cardDimmed]}>
          <View style={styles.stepperRow}>
            <View style={styles.stepperInfo}>
              <Text style={styles.cardTitle}>Max Students / Slot</Text>
              <Text style={styles.cardSub}>Group session capacity</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperBtn}
                activeOpacity={0.7}
                disabled={!day.enabled || day.maxStudents <= 1}
                onPress={() => update({ maxStudents: Math.max(1, day.maxStudents - 1) })}
              >
                <Feather name="minus" size={16} color={colors.ink} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{day.maxStudents}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                activeOpacity={0.7}
                disabled={!day.enabled}
                onPress={() => update({ maxStudents: day.maxStudents + 1 })}
              >
                <Feather name="plus" size={16} color={colors.ink} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85}>
          <Ionicons name="checkmark-circle" size={18} color={colors.inkOnDark} />
          <Text style={styles.saveBtnText}>Save Availability</Text>
        </TouchableOpacity>
      </ScrollView>

      <TutorBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 24, paddingBottom: 130 },

  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  statusAvailable: { backgroundColor: '#F1F9ED', borderColor: '#D8EECB' },
  statusBooked: { backgroundColor: colors.warningSoft, borderColor: '#FBE3C4' },
  statusOff: { backgroundColor: '#F4F6F4', borderColor: colors.cardBorder },
  statusLeft: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  statusLabel: { color: colors.ink, fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },
  statusMeta: { color: colors.inkSoft, fontSize: 12, fontWeight: '600' },

  sectionTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  weekGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dayCell: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  dayCellActive: { backgroundColor: colors.brandDeep, borderColor: colors.brandDeep },
  dayCellDisabled: { backgroundColor: '#F4F6F4' },
  dayLabel: { color: colors.ink, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  dayLabelActive: { color: colors.inkOnDark },
  dayLabelDisabled: { color: colors.inkSoft },
  daySlotCount: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.brandSoftAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySlotCountActive: { backgroundColor: colors.glassBtn },
  daySlotCountText: { color: colors.brand, fontSize: 11, fontWeight: '800' },
  daySlotCountTextActive: { color: colors.inkOnDark },

  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardDimmed: { opacity: 0.5 },
  cardTitle: { color: colors.ink, fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  cardSub: { color: colors.inkSoft, fontSize: 12, fontWeight: '500', marginTop: 3 },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  timeRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 14 },
  timeField: { flex: 1 },
  timeFieldLabel: { color: colors.inkSoft, fontSize: 11, fontWeight: '600', marginBottom: 6 },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandSoftAlt,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  timeInputText: { color: colors.ink, fontSize: 14, fontWeight: '700', marginLeft: 8 },
  timeArrow: { paddingHorizontal: 12, paddingBottom: 12 },

  slotWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, marginHorizontal: -4 },
  slotChip: {
    margin: 4,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  slotChipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  slotChipText: { color: colors.inkSoft, fontSize: 13, fontWeight: '600' },
  slotChipTextActive: { color: colors.inkOnDark, fontWeight: '700' },

  stepperRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepperInfo: { flex: 1 },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.brandSoftAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    width: 44,
    textAlign: 'center',
  },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  saveBtnText: { color: colors.inkOnDark, fontSize: 15, fontWeight: '800', marginLeft: 8 },
});
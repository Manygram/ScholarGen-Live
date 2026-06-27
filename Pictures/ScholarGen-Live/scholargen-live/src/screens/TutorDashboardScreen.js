import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import TutorBottomNav from '../components/TutorBottomNav';
import Avatar from '../components/Avatar';
import { useApp } from '../context/AppContext';
import { colors, paletteFor, formatNaira } from '../theme';

// Mock data — wire to API later.
const TODAY_CLASSES = [
  { id: '1', name: 'Chidinma K.', subject: 'Mathematics', time: '4:00 PM', status: 'now' },
  { id: '2', name: 'Emeka M.', subject: 'Physics', time: '6:00 PM', status: 'In 2h 15m' },
  { id: '3', name: 'Adaobi D.', subject: 'Further Maths', time: '8:00 PM', status: 'later' },
];

const EARNINGS_TREND = [
  { month: 'Jan', value: 0.42 },
  { month: 'Feb', value: 0.5 },
  { month: 'Mar', value: 0.62 },
  { month: 'Apr', value: 0.68 },
  { month: 'May', value: 0.85 },
  { month: 'Jun', value: 1 },
];

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function TutorDashboardScreen() {
  const navigation = useNavigation();
  const { tutorProfile } = useApp();
  const tutorFirstName = (tutorProfile.name || 'Tutor').split(' ').slice(0, 2).join(' ');

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ===== Gradient hero ===== */}
          <LinearGradient
            colors={[colors.brandDeep, colors.brandDeep2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.headerRow}>
              <View style={styles.headerProfile}>
                <Avatar
                  uri={tutorProfile.avatar}
                  name={tutorProfile.name}
                  size={46}
                  borderColor="rgba(255,255,255,0.15)"
                  borderWidth={2}
                />
                <View style={styles.headerGreeting}>
                  <Text style={styles.greetingText}>Good morning,</Text>
                  <Text style={styles.nameText}>{tutorFirstName} 👋</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
                  <View style={styles.notificationDot} />
                  <Feather name="bell" size={18} color={colors.inkOnDark} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Earnings / payout glass card */}
            <View style={styles.payoutCard}>
              <View style={styles.payoutHeaderRow}>
                <Text style={styles.payoutLabel}>AVAILABLE TO WITHDRAW</Text>
                <View style={styles.commissionPill}>
                  <Ionicons name="star" size={10} color={colors.brandBright} />
                  <Text style={styles.commissionText}>15% commission</Text>
                </View>
              </View>
              <Text style={styles.payoutAmount}>{formatNaira(489600)}</Text>
              <View style={styles.payoutFooterRow}>
                <Text style={styles.payoutSub}>
                  {formatNaira(576000, { compact: true })} earned this month
                </Text>
                <TouchableOpacity
                  style={styles.withdrawBtn}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('Earnings')}
                >
                  <Text style={styles.withdrawText}>Withdraw</Text>
                  <Feather name="arrow-up-right" size={14} color={colors.brandDeep} />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* ===== Body ===== */}
          <View style={styles.body}>
            {/* Stat tiles */}
            <View style={styles.statsGrid}>
              <StatTile
                icon={<Ionicons name="people" size={18} color="#6A1B9A" />}
                iconBg="#F3E5F5"
                value="12"
                label="Active Students"
                delta="+2 this month"
              />
              <StatTile
                icon={<Ionicons name="calendar" size={18} color={colors.info} />}
                iconBg="#E3F2FD"
                value="48"
                label="Sessions / Month"
                delta="98% completed"
              />
              <StatTile
                icon={<MaterialCommunityIcons name="cash-multiple" size={18} color="#00695C" />}
                iconBg="#E0F2F1"
                value={formatNaira(576000, { compact: true })}
                label="Earnings / Month"
                delta="+₦96k vs last"
              />
              <StatTile
                icon={<Ionicons name="star" size={18} color="#E68A00" />}
                iconBg="#FFF4E5"
                value="4.9"
                label="Avg. Rating"
                delta="87 reviews"
              />
            </View>

            {/* Today's classes */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Today's Classes</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Availability')}>
                <Text style={styles.seeAllText}>View all →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.classList}>
              {TODAY_CLASSES.map((cls, idx) => {
                const palette = paletteFor(cls.name);
                const isLast = idx === TODAY_CLASSES.length - 1;
                return (
                  <View key={cls.id} style={[styles.classRow, !isLast && styles.classRowDivider]}>
                    <View style={[styles.classAvatar, { backgroundColor: palette.bg }]}>
                      <Text style={[styles.classInitials, { color: palette.fg }]}>
                        {initials(cls.name)}
                      </Text>
                    </View>
                    <View style={styles.classInfo}>
                      <Text style={styles.className}>{cls.name}</Text>
                      <Text style={styles.classMeta}>
                        {cls.subject} · {cls.time}
                      </Text>
                    </View>
                    {cls.status === 'now' ? (
                      <TouchableOpacity style={styles.joinButton} activeOpacity={0.85}>
                        <Text style={styles.joinButtonText}>Join Meet</Text>
                      </TouchableOpacity>
                    ) : cls.status === 'later' ? (
                      <View style={styles.laterPill}>
                        <Text style={styles.laterText}>Later</Text>
                      </View>
                    ) : (
                      <View style={styles.countdownPill}>
                        <Text style={styles.countdownText}>{cls.status}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Earnings trend */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Earnings Trend</Text>
              <Text style={styles.trendPeak}>{formatNaira(576000, { compact: true })}</Text>
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chartRow}>
                {EARNINGS_TREND.map((bar, idx) => {
                  const isPeak = idx === EARNINGS_TREND.length - 1;
                  return (
                    <View key={bar.month} style={styles.chartCol}>
                      <View style={styles.barTrack}>
                        <LinearGradient
                          colors={
                            isPeak
                              ? [colors.brandBright, colors.brand]
                              : ['#C8E6BD', '#A5D78F']
                          }
                          style={[styles.barFill, { height: `${bar.value * 100}%` }]}
                        />
                      </View>
                      <Text style={[styles.barLabel, isPeak && styles.barLabelActive]}>
                        {bar.month}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Quick actions */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Quick Actions</Text>
            </View>
            <View style={styles.quickGrid}>
              <QuickAction
                icon={<Feather name="edit-3" size={18} color={colors.brand} />}
                label="Log Session"
                onPress={() => navigation.navigate('SessionReport')}
              />
              <QuickAction
                icon={<Feather name="calendar" size={18} color={colors.brand} />}
                label="Set Availability"
                onPress={() => navigation.navigate('Availability')}
              />
              <QuickAction
                icon={<Feather name="users" size={18} color={colors.brand} />}
                label="My Students"
                onPress={() => navigation.navigate('Students')}
              />
              <QuickAction
                icon={<Feather name="gift" size={18} color={colors.brand} />}
                label="Refer & Earn"
                onPress={() => {}}
              />
            </View>
          </View>
        </ScrollView>

        <TutorBottomNav />
      </View>
    </>
  );
}

function StatTile({ icon, iconBg, value, label, delta }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.deltaPill}>
        <Text style={styles.deltaText}>{delta}</Text>
      </View>
    </View>
  );
}

function QuickAction({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.quickCard} activeOpacity={0.75} onPress={onPress}>
      <View style={styles.quickIcon}>{icon}</View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollArea: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  hero: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerProfile: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerGreeting: { marginLeft: 12 },
  greetingText: {
    color: colors.inkOnDarkSoft,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  nameText: {
    color: colors.inkOnDark,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  bellButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.glassBtn,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    backgroundColor: colors.danger,
    borderRadius: 3,
    zIndex: 1,
  },

  payoutCard: {
    backgroundColor: colors.glass,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  payoutHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  payoutLabel: {
    color: colors.inkOnDarkSoft2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  commissionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassBtn,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  commissionText: {
    color: colors.inkOnDarkSoft2,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  payoutAmount: {
    color: colors.inkOnDark,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 14,
  },
  payoutFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutSub: {
    color: colors.inkOnDarkSoft,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inkOnDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  withdrawText: {
    color: colors.brandDeep,
    fontSize: 13,
    fontWeight: '800',
    marginRight: 4,
  },

  body: { paddingHorizontal: 24, paddingTop: 24 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  statValue: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  statLabel: { color: colors.inkSoft, fontSize: 12, fontWeight: '500', marginBottom: 10 },
  deltaPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brandSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  deltaText: { color: colors.success, fontSize: 11, fontWeight: '700' },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 14,
  },
  sectionHeader: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  seeAllText: { color: colors.brand, fontSize: 13, fontWeight: '600' },
  trendPeak: { color: colors.brand, fontSize: 14, fontWeight: '800' },

  classList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  classRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  classRowDivider: { borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  classAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classInitials: { fontSize: 14, fontWeight: '800' },
  classInfo: { flex: 1, marginLeft: 14 },
  className: { color: colors.ink, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  classMeta: { color: colors.inkSoft, fontSize: 13, fontWeight: '500' },
  joinButton: {
    backgroundColor: colors.brand,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  joinButtonText: { color: colors.inkOnDark, fontSize: 12, fontWeight: '700' },
  countdownPill: {
    backgroundColor: colors.warningSoft,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  countdownText: { color: colors.warning, fontSize: 12, fontWeight: '700' },
  laterPill: {
    backgroundColor: '#F2F4F2',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  laterText: { color: colors.inkSoft, fontSize: 12, fontWeight: '600' },

  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  chartCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barTrack: {
    width: 22,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: { width: 22, borderRadius: 8 },
  barLabel: { color: colors.inkSoft, fontSize: 11, fontWeight: '600', marginTop: 8 },
  barLabelActive: { color: colors.brand, fontWeight: '800' },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.brandSoftAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quickLabel: { color: colors.ink, fontSize: 13, fontWeight: '700', flex: 1 },
});
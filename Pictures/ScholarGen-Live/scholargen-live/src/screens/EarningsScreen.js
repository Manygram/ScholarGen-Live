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
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import TutorBottomNav from '../components/TutorBottomNav';
import { colors, formatNaira } from '../theme';

const TRANSACTIONS = [
  { id: '1', type: 'session', title: 'Session · Chidinma K.', date: 'Jun 24', amount: 12000, status: 'cleared' },
  { id: '2', type: 'session', title: 'Session · Emeka M.', date: 'Jun 24', amount: 10000, status: 'cleared' },
  { id: '3', type: 'payout', title: 'Withdrawal to GTBank', date: 'Jun 20', amount: -150000, status: 'paid' },
  { id: '4', type: 'bonus', title: 'Referral bonus · Aisha O.', date: 'Jun 18', amount: 5000, status: 'cleared' },
  { id: '5', type: 'session', title: 'Session · Adaobi D.', date: 'Jun 17', amount: 12000, status: 'cleared' },
];

function iconFor(type) {
  if (type === 'payout') return { name: 'arrow-up-right', bg: '#FFEBEE', fg: '#C62828', lib: 'feather' };
  if (type === 'bonus') return { name: 'gift', bg: '#F3E5F5', fg: '#6A1B9A', lib: 'feather' };
  return { name: 'arrow-down-left', bg: '#F1F9ED', fg: colors.success, lib: 'feather' };
}

export default function EarningsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Earnings" rightIcon="download" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Balance card */}
        <LinearGradient
          colors={[colors.brandDeep, colors.brandDeep2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
          <Text style={styles.balanceAmount}>{formatNaira(489600)}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>This month</Text>
              <Text style={styles.balanceStatValue}>{formatNaira(576000, { compact: true })}</Text>
            </View>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>Pending</Text>
              <Text style={styles.balanceStatValue}>{formatNaira(34000, { compact: true })}</Text>
            </View>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>Lifetime</Text>
              <Text style={styles.balanceStatValue}>{formatNaira(3200000, { compact: true })}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.85}>
            <MaterialCommunityIcons name="bank-transfer-out" size={18} color={colors.brandDeep} />
            <Text style={styles.withdrawText}>Withdraw to Bank</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Payout method */}
        <View style={styles.methodCard}>
          <View style={styles.methodIcon}>
            <MaterialCommunityIcons name="bank" size={20} color={colors.brand} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>GTBank · ****4821</Text>
            <Text style={styles.methodSub}>Default payout account</Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.inkSoft} />
        </View>

        {/* Transactions */}
        <View style={styles.txnHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.txnList}>
          {TRANSACTIONS.map((t, idx) => {
            const ic = iconFor(t.type);
            const isLast = idx === TRANSACTIONS.length - 1;
            const negative = t.amount < 0;
            return (
              <View key={t.id} style={[styles.txnRow, !isLast && styles.txnDivider]}>
                <View style={[styles.txnIcon, { backgroundColor: ic.bg }]}>
                  <Feather name={ic.name} size={16} color={ic.fg} />
                </View>
                <View style={styles.txnInfo}>
                  <Text style={styles.txnTitle}>{t.title}</Text>
                  <Text style={styles.txnDate}>{t.date}</Text>
                </View>
                <Text style={[styles.txnAmount, negative ? styles.txnNeg : styles.txnPos]}>
                  {negative ? '-' : '+'}
                  {formatNaira(Math.abs(t.amount))}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TutorBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 24, paddingBottom: 130 },

  balanceCard: { borderRadius: 24, padding: 24, marginBottom: 16 },
  balanceLabel: { color: colors.inkOnDarkSoft2, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  balanceAmount: {
    color: colors.inkOnDark,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginTop: 8,
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    marginBottom: 20,
  },
  balanceStat: { flex: 1 },
  balanceStatLabel: { color: colors.inkOnDarkSoft, fontSize: 11, fontWeight: '500', marginBottom: 4 },
  balanceStatValue: { color: colors.inkOnDark, fontSize: 15, fontWeight: '800' },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.inkOnDark,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  withdrawText: { color: colors.brandDeep, fontSize: 15, fontWeight: '800' },

  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.brandSoftAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: { flex: 1, marginLeft: 12 },
  methodTitle: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  methodSub: { color: colors.inkSoft, fontSize: 12, fontWeight: '500', marginTop: 2 },

  txnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  seeAll: { color: colors.brand, fontSize: 13, fontWeight: '600' },

  txnList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  txnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  txnDivider: { borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  txnIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnInfo: { flex: 1, marginLeft: 12 },
  txnTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  txnDate: { color: colors.inkSoft, fontSize: 12, fontWeight: '500', marginTop: 2 },
  txnAmount: { fontSize: 14, fontWeight: '800' },
  txnPos: { color: colors.success },
  txnNeg: { color: colors.ink },
});
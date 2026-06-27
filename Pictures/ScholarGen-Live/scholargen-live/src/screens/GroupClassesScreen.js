import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors, formatNaira } from '../theme';

// ScholarGen-owned live group classes (JAMB Masterclass, IELTS Bootcamp, …).
// Students can view a class, pay and join. ScholarGen creates & manages these
// from the Admin Dashboard.
export default function GroupClassesScreen() {
  const navigation = useNavigation();
  const { groupClasses, groupClassesApi } = useApp();
  const [joined, setJoined] = useState({});

  const liveClasses = groupClasses.filter((c) => c.enabled);

  const handleJoin = (cls) => {
    if (joined[cls.id]) return;
    Alert.alert(
      `Join ${cls.title}`,
      `Confirm payment of ${formatNaira(cls.price)} to join this class?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay & Join',
          onPress: () => {
            setJoined((prev) => ({ ...prev, [cls.id]: true }));
            groupClassesApi.update(cls.id, { enrolled: (cls.enrolled || 0) + 1 });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={[colors.brandDeep, colors.brandDeep2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="#DDF0D6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Classes</Text>
        <Text style={styles.headerSubtitle}>
          Live, ScholarGen-led masterclasses, bootcamps & workshops.
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {liveClasses.length === 0 && (
          <Text style={styles.emptyText}>No group classes are open right now. Check back soon.</Text>
        )}

        {liveClasses.map((cls) => {
          const seatsLeft = Math.max(0, (cls.seats || 0) - (cls.enrolled || 0));
          const fill = cls.seats ? Math.min(100, ((cls.enrolled || 0) / cls.seats) * 100) : 0;
          const isJoined = joined[cls.id];
          return (
            <View key={cls.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.cardIcon}>
                  <Ionicons name="people" size={20} color={colors.brand} />
                </View>
                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>{formatNaira(cls.price)}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{cls.title}</Text>
              <Text style={styles.cardDesc}>{cls.description}</Text>

              <View style={styles.metaRow}>
                <Feather name="calendar" size={14} color={colors.inkSoft} />
                <Text style={styles.metaText}>{cls.schedule}</Text>
              </View>

              {/* Seat capacity */}
              <View style={styles.seatTrack}>
                <View style={[styles.seatFill, { width: `${fill}%` }]} />
              </View>
              <Text style={styles.seatText}>
                {cls.enrolled} enrolled · {seatsLeft} seats left
              </Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.viewBtn}
                  activeOpacity={0.8}
                  onPress={() =>
                    Alert.alert(cls.title, `${cls.description}\n\nSchedule: ${cls.schedule}`)
                  }
                >
                  <Text style={styles.viewBtnText}>View Class</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.joinBtn, isJoined && styles.joinedBtn]}
                  activeOpacity={0.85}
                  onPress={() => handleJoin(cls)}
                  disabled={isJoined}
                >
                  <Feather name={isJoined ? 'check' : 'arrow-right'} size={15} color="#FFFFFF" />
                  <Text style={styles.joinBtnText}>{isJoined ? 'Joined' : 'Pay & Join'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.glassBtn,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: { color: colors.inkOnDark, fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  headerSubtitle: { color: colors.inkOnDarkSoft, fontSize: 13, fontWeight: '500', marginTop: 6, lineHeight: 18 },

  scrollArea: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 48 },
  emptyText: { color: colors.inkSoft, fontSize: 14, fontWeight: '500', textAlign: 'center', marginTop: 40 },

  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.brandSoftAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTag: {
    backgroundColor: colors.brandSoft,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  priceText: { color: colors.success, fontSize: 14, fontWeight: '800' },
  cardTitle: { color: colors.ink, fontSize: 18, fontWeight: '900', letterSpacing: -0.4, marginBottom: 6 },
  cardDesc: { color: colors.inkSoft, fontSize: 13, fontWeight: '500', lineHeight: 19, marginBottom: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  metaText: { color: colors.inkSoft, fontSize: 13, fontWeight: '600' },

  seatTrack: {
    height: 6,
    backgroundColor: '#EEF3EC',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  seatFill: { height: '100%', backgroundColor: colors.brandBright, borderRadius: 3 },
  seatText: { color: colors.inkSoft, fontSize: 12, fontWeight: '500', marginBottom: 18 },

  actionRow: { flexDirection: 'row', gap: 12 },
  viewBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 14,
    paddingVertical: 14,
  },
  viewBtnText: { color: colors.brand, fontSize: 14, fontWeight: '800' },
  joinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
  },
  joinedBtn: { backgroundColor: colors.success },
  joinBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});

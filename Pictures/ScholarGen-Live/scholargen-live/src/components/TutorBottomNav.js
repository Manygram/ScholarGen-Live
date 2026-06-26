import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { colors } from '../theme';

// Reusable tutor bottom navigation. Mirrors the student BottomNav contract but
// surfaces the tutor's core tabs. The center "Report" action is raised as a
// quick-action FAB because logging a session is the highest-frequency task.
const TABS = [
  { route: 'TutorDashboard', label: 'Home', icon: 'grid-outline', activeIcon: 'grid' },
  { route: 'Availability', label: 'Schedule', icon: 'calendar-outline', activeIcon: 'calendar' },
  { route: 'SessionReport', label: 'Report', icon: 'add', center: true },
  { route: 'Students', label: 'Students', icon: 'people-outline', activeIcon: 'people' },
  { route: 'Earnings', label: 'Earnings', icon: 'wallet-outline', activeIcon: 'wallet' },
];

export default function TutorBottomNav() {
  const navigation = useNavigation();
  const currentRoute = useNavigationState((state) => {
    if (!state) return null;
    return state.routes[state.index]?.name;
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          if (tab.center) {
            return (
              <TouchableOpacity
                key={tab.route}
                style={styles.centerItem}
                activeOpacity={0.85}
                onPress={() => navigation.navigate(tab.route)}
              >
                <View style={styles.fab}>
                  <Ionicons name={tab.icon} size={26} color={colors.inkOnDark} />
                </View>
                <Text style={styles.centerLabel}>{tab.label}</Text>
              </TouchableOpacity>
            );
          }

          const active = currentRoute === tab.route;
          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(tab.route)}
            >
              <Ionicons
                name={active ? tab.activeIcon : tab.icon}
                size={22}
                color={active ? colors.brand : colors.inkSoft}
              />
              <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    // Soft elevation
    shadowColor: '#10240C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.inkSoft,
    marginTop: 4,
  },
  labelActive: {
    color: colors.brand,
    fontWeight: '700',
  },
  centerItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  centerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.brand,
    marginTop: 4,
  },
});
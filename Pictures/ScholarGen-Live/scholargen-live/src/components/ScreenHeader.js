import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

// Lightweight header used on the tutor's secondary screens. Keeps a consistent
// title / back-button / optional right action across the flow.
export default function ScreenHeader({ title, subtitle, onBack, rightIcon, onRightPress }) {
  const navigation = useNavigation();
  const handleBack = onBack || (() => navigation.goBack());

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={handleBack}>
          <Feather name="chevron-left" size={22} color={colors.ink} />
        </TouchableOpacity>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {rightIcon ? (
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={onRightPress}>
            <Feather name={rightIcon} size={20} color={colors.ink} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 12,
    backgroundColor: colors.bg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: colors.inkSoft,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
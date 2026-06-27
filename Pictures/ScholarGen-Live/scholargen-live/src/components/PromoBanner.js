// Auto-rotating promotional banner carousel for the homepage.
//
// Banners are admin-controlled (see AppContext): each has a title, description,
// button text and a destination that is either an external URL (Play/App Store,
// website) or an internal route name. Disabled or out-of-schedule banners are
// filtered out automatically.
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

function isLive(banner, now) {
  if (!banner.enabled) return false;
  if (banner.startsAt && now < new Date(banner.startsAt).getTime()) return false;
  if (banner.endsAt && now > new Date(banner.endsAt).getTime()) return false;
  return true;
}

export default function PromoBanner() {
  const { banners } = useApp();
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  const now = Date.now();
  const liveBanners = banners.filter((b) => isLive(b, now));

  // Auto-rotate every 4 seconds with a soft cross-fade.
  useEffect(() => {
    if (liveBanners.length <= 1) return undefined;
    const timer = setInterval(() => {
      Animated.timing(fade, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
        setIndex((i) => (i + 1) % liveBanners.length);
        Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [liveBanners.length, fade]);

  if (liveBanners.length === 0) return null;

  const safeIndex = index % liveBanners.length;
  const banner = liveBanners[safeIndex];

  const handlePress = () => {
    if (!banner.link) return;
    if (banner.linkType === 'internal') {
      navigation.navigate(banner.link);
    } else {
      Linking.openURL(banner.link).catch(() => {});
    }
  };

  return (
    <View style={styles.wrap}>
      <Animated.View style={{ opacity: fade }}>
        <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
          <LinearGradient
            colors={banner.colors || ['#10240C', '#1A3312']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <View style={styles.bannerBody}>
              <Text style={styles.title} numberOfLines={2}>{banner.title}</Text>
              {!!banner.description && (
                <Text style={styles.description} numberOfLines={2}>{banner.description}</Text>
              )}
              {!!banner.buttonText && (
                <View style={styles.ctaBtn}>
                  <Text style={styles.ctaText}>{banner.buttonText}</Text>
                  <Feather name="arrow-right" size={14} color="#10240C" />
                </View>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Pagination dots */}
      {liveBanners.length > 1 && (
        <View style={styles.dotsRow}>
          {liveBanners.map((b, i) => (
            <View
              key={b.id}
              style={[styles.dot, i === safeIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 24 },
  banner: {
    borderRadius: 20,
    padding: 20,
    minHeight: 130,
    justifyContent: 'center',
  },
  bannerBody: { gap: 6 },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  description: {
    color: '#DDF0D6',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6,
    marginTop: 8,
  },
  ctaText: { color: '#10240C', fontSize: 13, fontWeight: '800' },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 18, backgroundColor: '#34931A' },
  dotInactive: { width: 6, backgroundColor: '#D4E5D4' },
});

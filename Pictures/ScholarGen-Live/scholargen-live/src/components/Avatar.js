// Reusable avatar used everywhere a person is shown.
//
// Renders a profile picture when `uri` is provided, otherwise falls back to
// deterministic colour-coded initials (the existing ScholarGen look). The
// `editable` variant adds a camera badge and runs the image picker on press.
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { paletteFor } from '../theme';
import { pickProfileImage } from '../utils/imagePicker';

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  uri,
  name = '',
  initials,
  size = 48,
  bg,
  fg,
  fontSize,
  borderColor,
  borderWidth = 0,
  style,
}) {
  const radius = size / 2;
  const frame = {
    width: size,
    height: size,
    borderRadius: radius,
    borderColor,
    borderWidth,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[frame, style]}
        contentFit="cover"
        transition={150}
      />
    );
  }

  const palette = paletteFor(name || initials || '');
  const text = initials || getInitials(name);
  return (
    <View
      style={[
        frame,
        styles.fallback,
        { backgroundColor: bg || palette.bg },
        style,
      ]}
    >
      <Text style={{ color: fg || palette.fg, fontSize: fontSize || size * 0.36, fontWeight: '800' }}>
        {text}
      </Text>
    </View>
  );
}

// Editable avatar with a camera badge. `onChange(uri)` is called with the
// chosen local image URI.
export function AvatarPicker({ uri, name, size = 96, onChange, badgeColor = '#34931A' }) {
  const handlePress = async () => {
    const picked = await pickProfileImage();
    if (picked) onChange?.(picked);
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={styles.pickerWrap}>
      <Avatar uri={uri} name={name} size={size} />
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Feather name="camera" size={14} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerWrap: {
    alignSelf: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

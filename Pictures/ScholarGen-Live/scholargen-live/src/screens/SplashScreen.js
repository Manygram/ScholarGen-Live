import React from 'react';
import { StyleSheet, View, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        // Exact dark green gradient mapping from top to bottom
        colors={['#2A4220', '#1C2E15', '#121E0C']}
        style={styles.container}
      >
        <View style={styles.centerContent}>
          {/* Centered Splash Image */}
          <Image
            source={require('../../assets/images/splash-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 320, // Increased the size slightly since it now acts as the sole center element
    height: 350,
  },
});
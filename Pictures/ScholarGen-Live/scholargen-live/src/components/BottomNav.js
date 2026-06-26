// src/components/BottomNav.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute(); // This tells us what screen we are currently on

  // Helper function to check if a tab is active
  const isActive = (screenName) => route.name === screenName;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Dashboard')}>
        <Feather name="home" size={22} color={isActive('Dashboard') ? '#34931A' : '#8B9A8B'} />
        {isActive('Dashboard') && <View style={styles.activeDot} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Search')}>
        <Feather name="search" size={22} color={isActive('Search') ? '#34931A' : '#8B9A8B'} />
        {isActive('Search') && <View style={styles.activeDot} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Schedule')}>
        <Feather name="book-open" size={22} color={isActive('Schedule') ? '#34931A' : '#8B9A8B'} />
        {isActive('Schedule') && <View style={styles.activeDot} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Progress')}>
        <Feather name="layout" size={22} color={isActive('Progress') ? '#34931A' : '#8B9A8B'} />
        {isActive('Progress') && <View style={styles.activeDot} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
        <Feather name="user" size={22} color={isActive('Profile') ? '#34931A' : '#8B9A8B'} />
        {isActive('Profile') && <View style={styles.activeDot} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 85 : 70,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F0',
    elevation: 0, // Flat design
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#34931A',
    marginTop: 6,
  }
});
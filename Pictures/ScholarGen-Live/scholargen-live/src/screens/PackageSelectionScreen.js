import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav'; // <-- Using your reusable component

export default function PackageSelectionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('Intensive');
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#FCFDFC" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color="#8B9A8B" />
              <Text style={styles.backText}>Tutor Profile</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Choose a Plan</Text>
            <Text style={styles.pageSubtitle}>Tier 3 — Dr. Funke Adeyemi</Text>
          </View>

          {/* Scrollable Plans */}
          <ScrollView 
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 1. Standard Plan Card */}
            <TouchableOpacity 
              style={[
                styles.card, 
                styles.standardCard, 
                selectedPlan === 'Standard' && styles.activeCardOutline
              ]}
              activeOpacity={0.9}
              onPress={() => setSelectedPlan('Standard')}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.planTitle, styles.darkText]}>Standard{'\n'}Plan</Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.planPrice, styles.darkText]}>₦95k</Text>
                  <Text style={[styles.pricePeriod, styles.grayText]}>/month</Text>
                </View>
              </View>
              
              <Text style={[styles.planDetails, styles.grayText]}>
                3 classes/week · 2hrs each
              </Text>

              <View style={styles.featuresList}>
                <FeatureItem text="Live Classes" color="#34931A" textColor="#4A5D44" />
                <FeatureItem text="Progress Reports" color="#34931A" textColor="#4A5D44" />
                <FeatureItem text="Study Plans" color="#34931A" textColor="#4A5D44" />
              </View>
            </TouchableOpacity>

            {/* 2. Intensive Plan Card */}
            <TouchableOpacity 
              style={[
                styles.card, 
                styles.intensiveCard, 
                selectedPlan === 'Intensive' && styles.activeCardOutline
              ]}
              activeOpacity={0.9}
              onPress={() => setSelectedPlan('Intensive')}
            >
              {/* Sleeker Popular Ribbon */}
              <View style={styles.popularRibbon}>
                <Text style={styles.popularText}>POPULAR</Text>
              </View>

              <View style={styles.cardHeaderRow}>
                <Text style={[styles.planTitle, styles.lightText]}>Intensive{'\n'}Plan</Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.planPrice, styles.lightText]}>₦140k</Text>
                  <Text style={[styles.pricePeriod, styles.lightGrayText]}>/month</Text>
                </View>
              </View>
              
              <Text style={[styles.planDetails, styles.lightGreenText]}>
                4 classes/week · 2hrs each
              </Text>

              <View style={styles.featuresList}>
                <FeatureItem text="Full Assessments" color="#85D161" textColor="#DDF0D6" />
                <FeatureItem text="Mentorship" color="#85D161" textColor="#DDF0D6" />
              </View>
            </TouchableOpacity>

            {/* 3. Elite Mentorship Card */}
            <TouchableOpacity 
              style={[
                styles.card, 
                styles.eliteCard, 
                selectedPlan === 'Elite' && styles.activeCardOutline
              ]}
              activeOpacity={0.9}
              onPress={() => setSelectedPlan('Elite')}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.planTitle, styles.lightText]}>Elite{'\n'}Mentorship</Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.planPrice, styles.lightText]}>₦180k</Text>
                  <Text style={[styles.pricePeriod, styles.lightGrayText]}>/month</Text>
                </View>
              </View>
              
              <Text style={[styles.planDetails, styles.goldText]}>
                Premium · Scholarship-focused
              </Text>

              <View style={styles.featuresList}>
                <FeatureItem text="1-on-1 Strategy Mapping" color="#85D161" textColor="#DDF0D6" />
                <FeatureItem text="Global Opportunities" color="#85D161" textColor="#DDF0D6" />
              </View>
            </TouchableOpacity>

            {/* Clean Continue Button */}
            <TouchableOpacity style={styles.continueButton} activeOpacity={0.8}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Reusable Bottom Nav Hooked Up Here! */}
          <BottomNav />
        </View>
      </SafeAreaView>
    </>
  );
}

// Reusable Feature Row Component - Swapped to Feather icons for a crisper look
const FeatureItem = ({ text, color, textColor }) => (
  <View style={styles.featureRow}>
    <Feather name="check-circle" size={16} color={color} style={styles.checkIcon} />
    <Text style={[styles.featureText, { color: textColor }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFDFC', // Ultra-clean background
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F0', // Replaces the old thick divider with a crisp line
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backText: {
    color: '#8B9A8B',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  pageTitle: {
    color: '#1A1A1A',
    fontSize: 28, // Moderated from 36
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pageSubtitle: {
    color: '#8B9A8B',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 110, // Clears the absolute bottom nav
  },
  card: {
    borderRadius: 20, // Sleeker radius
    padding: 24,
    marginBottom: 16,
    overflow: 'hidden', 
    borderWidth: 2, // Base border width so layout doesn't shift on selection
    borderColor: 'transparent', 
  },
  activeCardOutline: {
    borderColor: '#34931A', // Clean, sharp active state
  },
  standardCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F0F4F0', // Very subtle idle border
  },
  intensiveCard: {
    backgroundColor: '#1E4D14', // Rich dashboard green
  },
  eliteCard: {
    backgroundColor: '#0D1A09', // Deepest premium black-green
  },
  popularRibbon: {
    position: 'absolute',
    top: 20,
    right: -30,
    backgroundColor: '#34931A',
    paddingVertical: 4,
    paddingHorizontal: 32,
    transform: [{ rotate: '45deg' }],
    zIndex: 10,
    alignItems: 'center',
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  planTitle: {
    fontSize: 24, // Moderated from 32
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.5,
    width: '60%',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24, // Moderated from 32
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  pricePeriod: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  planDetails: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  featuresList: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
  darkText: { color: '#1A1A1A' },
  lightText: { color: '#FFFFFF' },
  grayText: { color: '#6B7A63' },
  lightGrayText: { color: '#AABBA0' },
  lightGreenText: { color: '#DDF0D6' },
  goldText: { color: '#F3C353' }, 
  continueButton: {
    backgroundColor: '#34931A', // Matches the updated flat aesthetic
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
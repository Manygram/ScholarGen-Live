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
import { useApp } from '../context/AppContext';
import { formatNaira } from '../theme';

export default function PackageSelectionScreen() {
  const navigation = useNavigation();
  const { packages, familyPackages } = useApp();

  // Pricing is fully admin-controlled — tutors never set prices.
  const plans = packages.filter((p) => p.enabled);
  const familyPlans = familyPackages.filter((p) => p.enabled);
  const [selectedPlan, setSelectedPlan] = useState(
    plans.find((p) => p.popular)?.id || plans[0]?.id,
  );

  // First plan reads as the light "entry" card, the popular plan as the rich
  // green card, and any others as the deep premium card.
  const variantFor = (plan, index) => {
    if (plan.popular) return 'intensive';
    if (index === 0) return 'standard';
    return 'elite';
  };

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
            {plans.map((plan, index) => {
              const variant = variantFor(plan, index);
              const isLight = variant === 'standard';
              const isSelected = selectedPlan === plan.id;
              const cardStyle =
                variant === 'standard'
                  ? styles.standardCard
                  : variant === 'intensive'
                  ? styles.intensiveCard
                  : styles.eliteCard;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[styles.card, cardStyle, isSelected && styles.activeCardOutline]}
                  activeOpacity={0.9}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <View style={styles.popularRibbon}>
                      <Text style={styles.popularText}>POPULAR</Text>
                    </View>
                  )}

                  <View style={styles.cardHeaderRow}>
                    <Text style={[styles.planTitle, isLight ? styles.darkText : styles.lightText]}>
                      {plan.name}
                    </Text>
                    <View style={styles.priceContainer}>
                      <Text style={[styles.planPrice, isLight ? styles.darkText : styles.lightText]}>
                        {formatNaira(plan.price, { compact: true })}
                      </Text>
                      <Text style={[styles.pricePeriod, isLight ? styles.grayText : styles.lightGrayText]}>
                        /{plan.period}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.planDetails, isLight ? styles.grayText : styles.lightGreenText]}>
                    {plan.details}
                  </Text>

                  <View style={styles.featuresList}>
                    {plan.features.map((feat) => (
                      <FeatureItem
                        key={feat}
                        text={feat}
                        color={isLight ? '#34931A' : '#85D161'}
                        textColor={isLight ? '#4A5D44' : '#DDF0D6'}
                      />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Family Learning Packages (admin-controlled) */}
            {familyPlans.length > 0 && (
              <>
                <Text style={styles.familyHeader}>FAMILY LEARNING PACKAGES</Text>
                <Text style={styles.familySub}>One tutor teaching multiple children — at a discount.</Text>
                {familyPlans.map((fam) => (
                  <View key={fam.id} style={styles.familyCard}>
                    <View style={styles.familyIcon}>
                      <Feather name="users" size={20} color="#34931A" />
                    </View>
                    <View style={styles.familyInfo}>
                      <Text style={styles.familyName}>{fam.name}</Text>
                      <Text style={styles.familyMeta}>
                        {fam.children} children · {fam.discountPercent}% family discount
                      </Text>
                    </View>
                    <View style={styles.familyPriceWrap}>
                      <Text style={styles.familyPrice}>{formatNaira(fam.price, { compact: true })}</Text>
                      <Text style={styles.familyPriceSub}>/month</Text>
                    </View>
                  </View>
                ))}
              </>
            )}

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
  familyHeader: {
    color: '#8B9A8B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 4,
  },
  familySub: {
    color: '#8B9A8B',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16,
  },
  familyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F4F0',
  },
  familyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F9F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  familyInfo: { flex: 1 },
  familyName: { color: '#1A1A1A', fontSize: 15, fontWeight: '800' },
  familyMeta: { color: '#8B9A8B', fontSize: 12, fontWeight: '500', marginTop: 2 },
  familyPriceWrap: { alignItems: 'flex-end' },
  familyPrice: { color: '#34931A', fontSize: 16, fontWeight: '900' },
  familyPriceSub: { color: '#8B9A8B', fontSize: 11, fontWeight: '500' },
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
import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Animated,
  Image // <-- 1. Imported Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; 

// Custom Component for Fade-Up and Number Counting Animation
const AnimatedStat = ({ targetValue, suffix, label, isFloat = false, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ]).start(() => {
      let start = 0;
      const step = targetValue / 30; 
      
      const interval = setInterval(() => {
        start += step;
        if (start >= targetValue) {
          setCurrentCount(targetValue);
          clearInterval(interval);
        } else {
          setCurrentCount(start);
        }
      }, 30);
    });
  }, [targetValue, delay, fadeAnim, slideAnim]);

  const displayValue = isFloat ? currentCount.toFixed(1) : Math.floor(currentCount);

  return (
    <Animated.View style={[styles.statItem, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.statValue}>{displayValue}{suffix}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

export default function OnboardingScreen() {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#2A4220', '#1C2E15', '#121E0C']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          
          {/* TOP SECTION: Logo, Title, Subtitle */}
          <View style={styles.topSection}>
            
            {/* 2. Replaced Text Block with Logo Image */}
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />

            {/* 3. Moderated Font Weight and Size */}
            <Text style={styles.heading}>
              Find the right{'\n'}tutor, coach, or{'\n'}mentor for your{'\n'}goals.
            </Text>

            <Text style={styles.subheading}>
              Academics, exams, skills & professional growth — all in one place.
            </Text>
          </View>

          {/* CENTER SECTION: CTAs */}
          <View style={styles.centerSection}>
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.primaryButton} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Registration')}
              >
                <Text style={styles.primaryButtonText}>Get Started →</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('TutorOnboarding')}
              >
                <Text style={styles.secondaryButtonText}>I am a Tutor</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BOTTOM SECTION: Social Proof */}
          <View style={styles.bottomSection}>
            <View style={styles.socialProofContainer}>
              <Text style={styles.trustedText}>Trusted by students across Africa</Text>
              
              <View style={styles.statsRow}>
                <AnimatedStat targetValue={500} suffix="+" label="Tutors" delay={0} />
                <AnimatedStat targetValue={2} suffix="K+" label="Students" delay={150} />
                <AnimatedStat targetValue={4.9} suffix="★" label="Rating" isFloat={true} delay={300} />
              </View>
            </View>
          </View>
          
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60, 
    paddingBottom: 40,
  },
  
  // -- LAYOUT SECTIONS --
  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 1.2,
    justifyContent: 'flex-end', // Sit the CTAs lower so they clear the headline
    paddingBottom: 24,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  // -- TOP ELEMENTS --
  logoImage: {
    width: 80, // Appropriately sized logo
    height: 80,
    marginBottom: 24,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 34, // Sized to fit the broader four-line headline
    fontWeight: '600', // Reduced from 700/900 for a cleaner aesthetic
    lineHeight: 40,
    letterSpacing: -1,
  },
  subheading: {
    color: '#AABBA0', 
    fontSize: 15, 
    fontWeight: '500',
    marginTop: 12, 
  },

  // -- CENTER ELEMENTS --
  actionContainer: {
    width: '100%',
    alignItems: 'center', // This centers the buttons perfectly in the middle of the screen
  },
  primaryButton: {
    backgroundColor: '#52BE23',
    borderRadius: 14,
    paddingVertical: 18,
    width: '90%', // Pulls the edges in slightly to emphasize the centered look
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16, 
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)', 
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 18,
    width: '90%', // Matches primary button width
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16, 
    fontWeight: '700',
  },

  // -- BOTTOM ELEMENTS --
  socialProofContainer: {
    alignItems: 'center',
  },
  trustedText: {
    color: '#6B7A63', 
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 70, 
  },
  statValue: {
    color: '#52BE23',
    fontSize: 24, 
    fontWeight: '900',
    letterSpacing: -1,
  },
  statLabel: {
    color: '#6B7A63',
    fontSize: 12, 
    fontWeight: '600',
    marginTop: 6,
  },
});
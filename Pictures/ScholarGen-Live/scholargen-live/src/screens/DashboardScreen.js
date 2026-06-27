import React from 'react';
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
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav'; // <-- Import the reusable component
import PromoBanner from '../components/PromoBanner';
import Avatar from '../components/Avatar';
import { useApp } from '../context/AppContext';
import { useApiData } from '../hooks/useApiData';
import api from '../services/api';
import { mapApiTutor } from '../services/transform';

// Fallback tutors shown until the API has approved tutors to return.
const FALLBACK_TUTORS = [
  { id: '1', name: 'Dr. Funke Adeyemi', subject: 'Physics' },
  { id: '2', name: 'Kelechi E.', subject: 'Mathematics' },
  { id: '3', name: 'Aisha O.', subject: 'Chemistry' },
  { id: '4', name: 'David O.', subject: 'English' },
  { id: '5', name: 'Binta J.', subject: 'Biology' },
  { id: '6', name: 'Samuel O.', subject: 'Economics' },
];

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { studentProfile, categories } = useApp();
  const firstName = (studentProfile.name || 'there').split(' ')[0];

  // Surface a handful of enabled learning categories so students can see the
  // platform spans academics AND skills/professional development.
  const exploreCategories = categories.filter((c) => c.enabled).slice(0, 8);

  // Live recommended tutors from the public discovery endpoint, with fallback.
  const { data: apiTutors } = useApiData(() => api.tutors.list(), []);
  const recommendedTutors =
    Array.isArray(apiTutors) && apiTutors.length > 0
      ? apiTutors.slice(0, 6).map(mapApiTutor)
      : FALLBACK_TUTORS;

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Premium Gradient Section */}
          <LinearGradient
            colors={['#10240C', '#1A3312']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.topHeaderSection}
          >
            {/* Header Info */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.headerProfile}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Profile')}
              >
                <Avatar
                  uri={studentProfile.avatar}
                  name={studentProfile.name}
                  size={46}
                  borderColor="rgba(255,255,255,0.15)"
                  borderWidth={2}
                />
                <View style={styles.headerGreeting}>
                  <Text style={styles.greetingText}>Good morning,</Text>
                  <Text style={styles.nameText}>{firstName} 👋</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
                <View style={styles.notificationDot} />
                <Feather name="bell" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Flat Glassmorphism Progress Card */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>JAMB Target Progress</Text>
                <Text style={styles.progressScores}>180 → <Text style={styles.targetScore}>300</Text></Text>
              </View>
              
              <View style={styles.progressBarTrack}>
                <View style={styles.progressBarFill} />
              </View>
              
              <Text style={styles.progressSubtext}>
                60% of target achieved · 8 sessions left
              </Text>
            </View>
          </LinearGradient>

          {/* Bottom Content Section */}
          <View style={styles.bottomContentSection}>

            {/* Rotating promotional banners (admin-controlled) */}
            <PromoBanner />

            {/* Explore Learning Categories */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Explore Learning</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Search')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryStrip}
            >
              {exploreCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryChip}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Search')}
                >
                  <View style={styles.categoryChipIcon}>
                    <Ionicons name={cat.icon || 'school'} size={18} color="#34931A" />
                  </View>
                  <Text style={styles.categoryChipText} numberOfLines={1}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Next Class Card */}
            <View style={styles.primaryCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.badgeRow}>
                  <View style={styles.iconCircleSmall}>
                    <Ionicons name="calendar" size={12} color="#34931A" />
                  </View>
                  <Text style={styles.badgeText}>NEXT CLASS — TODAY</Text>
                </View>
                <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.classTitle}>Mathematics</Text>
              <Text style={styles.classSubtitle}>Dr. Funke Adeyemi · 4:00 PM</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, styles.halfWidth]}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFF5F6' }]}>
                  <MaterialCommunityIcons name="bookshelf" size={20} color="#E85D75" />
                </View>
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Sessions{'\n'}Completed</Text>
              </View>

              <View style={[styles.statCard, styles.halfWidth]}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFFBF0' }]}>
                  <Ionicons name="star" size={20} color="#F3C353" />
                </View>
                <Text style={styles.statValue}>98%</Text>
                <Text style={styles.statLabel}>Attendance{'\n'}Rate</Text>
              </View>
            </View>

            {/* Recommended Tutors Section */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Recommended Tutors</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tutorGrid}>
              {recommendedTutors.map((tutor) => (
                <TouchableOpacity 
                  key={tutor.id} 
                  style={styles.tutorCard} 
                  activeOpacity={0.7}
                  onPress={() => {
                    // Navigate and pass the tutor data as route params!
                    navigation.navigate('TutorProfile', {
                      tutorId: tutor.id,
                      tutorName: tutor.name,
                      tutorInitials: tutor.initials,
                      tutorSubject: tutor.subject,
                      tutorAvatar: tutor.avatar,
                    });
                  }}
                >
                  <Avatar
                    uri={tutor.avatar}
                    name={tutor.name}
                    initials={tutor.initials}
                    size={48}
                    style={styles.tutorAvatar}
                  />
                  <Text style={styles.tutorName} numberOfLines={1}>{tutor.name}</Text>
                  <Text style={styles.tutorSubject} numberOfLines={1}>{tutor.subject}</Text>
                </TouchableOpacity>
              ))}
            </View>

          </View>
        </ScrollView>

        {/* Clean, Reusable Bottom Nav */}
        <BottomNav />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFDFC', 
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110, // Clears the absolute nav
  },
  topHeaderSection: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerGreeting: {
    marginLeft: 12,
  },
  greetingText: {
    color: '#AABBA0',
    fontSize: 13, 
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 24, 
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  bellButton: {
    width: 40, 
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    backgroundColor: '#FF4D4D',
    borderRadius: 3,
    zIndex: 1,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)', 
    borderRadius: 16, 
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    color: '#DDF0D6',
    fontSize: 13, 
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  progressScores: {
    color: '#AABBA0',
    fontSize: 13,
    fontWeight: '600',
  },
  targetScore: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 4, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    width: '60%',
    backgroundColor: '#52BE23',
    borderRadius: 2,
  },
  progressSubtext: {
    color: '#AABBA0',
    fontSize: 12, 
    fontWeight: '500',
  },
  bottomContentSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  primaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F4F0', 
    elevation: 0, 
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F9F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#34931A',
    fontSize: 10, 
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 8,
  },
  joinButton: {
    backgroundColor: '#Edf4E9',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12, 
  },
  joinButtonText: {
    color: '#2D8C1A',
    fontSize: 12,
    fontWeight: '700',
  },
  classTitle: {
    color: '#1A1A1A',
    fontSize: 18, 
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  classSubtitle: {
    color: '#8B9A8B',
    fontSize: 13,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F4F0',
    elevation: 0,
  },
  halfWidth: {
    width: '48%', 
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statValue: {
    color: '#1A1A1A',
    fontSize: 24, 
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  statLabel: {
    color: '#8B9A8B',
    fontSize: 12, 
    fontWeight: '500',
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    color: '#1A1A1A',
    fontSize: 16, 
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  seeAllText: {
    color: '#34931A',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryStrip: {
    gap: 12,
    paddingRight: 24,
    paddingBottom: 24,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F0F4F0',
    gap: 10,
  },
  categoryChipIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F5F9F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipText: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 150,
  },
  tutorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tutorCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F4F0',
    elevation: 0,
  },
  tutorAvatar: {
    width: 48, 
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tutorInitials: {
    fontSize: 16,
    fontWeight: '800',
  },
  tutorName: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  tutorSubject: {
    color: '#8B9A8B',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
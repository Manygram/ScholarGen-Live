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
import { useRoute, useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav'; // Reusable component

export default function TutorProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  // Extract the passed data, or fallback to defaults
  const tutorName = route.params?.tutorName || 'Dr. Funke Adeyemi';
  const tutorInitials = route.params?.tutorInitials || 'FA';
  const tutorSubject = route.params?.tutorSubject || 'Mathematics & Physics';

  // Mock Reviews Data
  const reviews = [
    {
      id: '1',
      name: 'Chidinma K.',
      initials: 'CK',
      rating: 5,
      text: '"She explained calculus in a way I finally understand. Scored 289 in JAMB!"',
      bgColor: '#Edf4E9',
      textColor: '#34931A'
    },
    {
      id: '2',
      name: 'Emmanuel B.',
      initials: 'EB',
      rating: 5,
      text: '"Very patient and thorough. The exam strategies were a game changer for my physics paper."',
      bgColor: '#F4E8FA',
      textColor: '#8E44AD'
    }
  ];

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* TOP SECTION: Deep Premium Gradient Header */}
          <LinearGradient
            colors={['#10240C', '#1A3312']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.topSection}
          >
            {/* Navbar */}
            <View style={styles.navBar}>
              <TouchableOpacity style={styles.navButton} activeOpacity={0.7} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={20} color="#DDF0D6" />
                <Text style={styles.navText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
                <Text style={styles.navText}>Share</Text>
                <Feather name="share" size={18} color="#DDF0D6" />
              </TouchableOpacity>
            </View>

            {/* Profile Info Row */}
            <View style={styles.profileInfoContainer}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{tutorInitials}</Text>
              </View>

              <View style={styles.profileDetails}>
                <Text style={styles.nameText}>{tutorName}</Text>
                <Text style={styles.specialtyText}>
                  {tutorSubject}{'\n'}Specialist
                </Text>

                <View style={styles.badgesContainer}>
                  <View style={[styles.badge, styles.tierBadge]}>
                    <Ionicons name="sparkles" size={12} color="#85D161" />
                    <Text style={styles.tierBadgeText}>Tier 3</Text>
                  </View>

                  <View style={[styles.badge, styles.verifiedBadge]}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    <Text style={styles.verifiedBadgeText}>Verified</Text>
                  </View>

                  <View style={[styles.badge, styles.specialistBadge]}>
                    <MaterialCommunityIcons name="bullseye-arrow" size={14} color="#FF6B6B" />
                    <Text style={styles.specialistBadgeText}>JAMB Specialist</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* MIDDLE SECTION: Floating Stats Card */}
          <View style={styles.statsCardContainer}>
            <View style={styles.statsCard}>
              <View style={styles.statColumn}>
                <Text style={styles.statValue}>4.9</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={10} color="#F3C353" />
                  ))}
                </View>
                <Text style={styles.statLabel}>Rating</Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.statColumn}>
                <Text style={styles.statValue}>87</Text>
                <Text style={[styles.statLabel, { marginTop: 14 }]}>Students</Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.statColumn}>
                <Text style={styles.statValue}>98%</Text>
                <Text style={[styles.statLabel, { marginTop: 14 }]}>Completion</Text>
              </View>
            </View>
          </View>

          {/* BOTTOM SECTION: Clean White Details Area */}
          <View style={styles.bottomSection}>
            
            {/* About Segment */}
            <View style={styles.contentBlock}>
              <Text style={styles.sectionHeader}>ABOUT</Text>
              <Text style={styles.paragraphText}>
                PhD in Applied Mathematics, UNILAG. 8 years of tutoring experience. 250+ JAMB success stories. Exam strategy specialist.
              </Text>
            </View>

            {/* Subjects Segment */}
            <View style={styles.contentBlock}>
              <Text style={styles.sectionHeader}>SUBJECTS</Text>
              <View style={styles.chipsContainer}>
                {tutorSubject.split(' & ').map((sub, index) => (
                  <View key={index} style={styles.subjectChip}>
                    <Text style={styles.subjectChipText}>{sub}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Reviews Segment */}
            <View style={styles.contentBlock}>
              <Text style={styles.sectionHeader}>STUDENT REVIEWS</Text>
              
              <View style={styles.reviewsContainer}>
                {reviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={[styles.reviewAvatar, { backgroundColor: review.bgColor }]}>
                        <Text style={[styles.reviewInitials, { color: review.textColor }]}>
                          {review.initials}
                        </Text>
                      </View>
                      
                      <View style={styles.reviewerInfo}>
                        <Text style={styles.reviewerName}>{review.name}</Text>
                        <View style={styles.reviewStars}>
                          {[...Array(review.rating)].map((_, i) => (
                            <Ionicons key={i} name="star" size={12} color="#F3C353" />
                          ))}
                        </View>
                      </View>
                    </View>
                    
                    <Text style={styles.reviewText}>{review.text}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Book This Tutor Button */}
            <TouchableOpacity 
              style={styles.bookButton} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('PackageSelection')}
            >
              <Text style={styles.bookButtonText}>Book This Tutor →</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
        
        {/* Reusable Bottom Nav Added */}
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
  topSection: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingBottom: 60, 
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  navText: {
    color: '#DDF0D6',
    fontSize: 13,
    fontWeight: '600',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 80, 
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DDF0D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.1)', 
  },
  avatarText: {
    color: '#1A3312',
    fontSize: 26,
    fontWeight: '800',
  },
  profileDetails: {
    flex: 1,
    paddingTop: 4,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 24, 
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  specialtyText: {
    color: '#AABBA0',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
  },
  tierBadge: {
    backgroundColor: 'rgba(133, 209, 97, 0.15)', 
  },
  tierBadgeText: {
    color: '#85D161',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    backgroundColor: '#34931A',
  },
  verifiedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  specialistBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)', 
  },
  specialistBadgeText: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // -- FLOATING STATS CARD --
  statsCardContainer: {
    paddingHorizontal: 24,
    marginTop: -40, 
    zIndex: 10,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F4F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#1A1A1A',
    fontSize: 24, 
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
    marginBottom: 4,
  },
  statLabel: {
    color: '#8B9A8B',
    fontSize: 12,
    fontWeight: '500',
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F0F4F0', 
  },

  // -- BOTTOM SECTION --
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 110, // Gives plenty of space above the BottomNav
  },
  contentBlock: {
    marginBottom: 32,
  },
  sectionHeader: {
    color: '#8B9A8B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  paragraphText: {
    color: '#4A5D44',
    fontSize: 14, 
    lineHeight: 24,
    fontWeight: '500',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subjectChip: {
    backgroundColor: '#F5F9F5', 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  subjectChipText: {
    color: '#34931A',
    fontSize: 13,
    fontWeight: '700',
  },

  // -- REVIEWS --
  reviewsContainer: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F4F0',
    borderRadius: 16,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewInitials: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewerInfo: {
    justifyContent: 'center',
  },
  reviewerName: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    color: '#4A5D44',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },

  // -- BOOK BUTTON --
  bookButton: {
    backgroundColor: '#34931A',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8, // Little extra spacing from the reviews
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
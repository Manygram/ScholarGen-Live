import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../components/BottomNav'; // <-- Reusable nav

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Tutors', 'JAMB', 'WAEC', 'Mathematics', 'Physics', 'English'];

  const recentSearches = [
    'Calculus 101',
    'JAMB Past Questions',
    'Dr. Funke Adeyemi',
    'Organic Chemistry'
  ];

  const trendingTutors = [
    { id: '1', initials: 'AO', name: 'Aisha O.', subject: 'Chemistry', bgColor: '#FFEBEE', textColor: '#C62828', rating: '4.9' },
    { id: '2', initials: 'DO', name: 'David O.', subject: 'English', bgColor: '#E3F2FD', textColor: '#1565C0', rating: '4.8' },
    { id: '3', initials: 'SO', name: 'Samuel O.', subject: 'Economics', bgColor: '#E0F2F1', textColor: '#00695C', rating: '5.0' },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.container}>
        {/* TOP SECTION: Deep Premium Gradient Header */}
        <LinearGradient
          colors={['#10240C', '#1A3312']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topSection}
        >
          <Text style={styles.pageHeaderTitle}>Discover</Text>

          {/* Hero Search Bar */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#8B9A8B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tutors, subjects, or exams..."
              placeholderTextColor="#AABBA0"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Feather name="x" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Horizontal Filter Pills */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterStrip}
          >
            {filters.map((filter) => {
              const isSelected = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterPill, isSelected && styles.activeFilterPill]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterText, isSelected && styles.activeFilterText]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Recent Searches Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>RECENT SEARCHES</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.clearAllText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.recentList}>
              {recentSearches.map((item, index) => (
                <TouchableOpacity key={index} style={styles.recentItemRow} activeOpacity={0.7}>
                  <View style={styles.recentItemLeft}>
                    <View style={styles.recentIconBox}>
                      <Feather name="clock" size={16} color="#8B9A8B" />
                    </View>
                    <Text style={styles.recentItemText}>{item}</Text>
                  </View>
                  <Feather name="arrow-up-left" size={18} color="#DDF0D6" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Trending Tutors Horizontal Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { marginBottom: 16 }]}>TRENDING TUTORS</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingStrip}
              snapToInterval={200} // Smooth snapping for cards
              decelerationRate="fast"
            >
              {trendingTutors.map((tutor) => (
                <TouchableOpacity key={tutor.id} style={styles.trendingCard} activeOpacity={0.8}>
                  <View style={styles.trendingCardTop}>
                    <View style={[styles.tutorAvatar, { backgroundColor: tutor.bgColor }]}>
                      <Text style={[styles.tutorInitials, { color: tutor.textColor }]}>
                        {tutor.initials}
                      </Text>
                    </View>
                    <View style={styles.ratingPill}>
                      <Ionicons name="star" size={12} color="#F3C353" />
                      <Text style={styles.ratingText}>{tutor.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.tutorName} numberOfLines={1}>{tutor.name}</Text>
                  <Text style={styles.tutorSubject} numberOfLines={1}>{tutor.subject}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Browse Categories (Vertical Flat List) */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { marginBottom: 16 }]}>BROWSE CATEGORIES</Text>
            
            <View style={styles.categoryGrid}>
              <TouchableOpacity style={styles.categoryCard} activeOpacity={0.7}>
                <View style={[styles.categoryIcon, { backgroundColor: '#F4E8FA' }]}>
                  <Feather name="book" size={20} color="#8E44AD" />
                </View>
                <View>
                  <Text style={styles.categoryTitle}>Past Questions</Text>
                  <Text style={styles.categorySub}>Over 10,000+ questions</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.categoryCard} activeOpacity={0.7}>
                <View style={[styles.categoryIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Feather name="users" size={20} color="#2E7D32" />
                </View>
                <View>
                  <Text style={styles.categoryTitle}>Live Group Classes</Text>
                  <Text style={styles.categorySub}>Join peer study sessions</Text>
                </View>
              </TouchableOpacity>
            </View>
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
  
  // -- HEADER & HERO SEARCH --
  topSection: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  pageHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Pure white pops beautifully inside the dark gradient
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    // Add a very subtle soft shadow to lift it off the green
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B0BCB0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  // -- SCROLL AREA --
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110, // Clears the absolute nav
  },

  // -- FILTER STRIP --
  filterStrip: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 10,
  },
  filterPill: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F4F0',
  },
  activeFilterPill: {
    backgroundColor: '#34931A',
    borderColor: '#34931A',
  },
  filterText: {
    color: '#8B9A8B',
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },

  // -- GENERAL SECTION STYLES --
  sectionContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    color: '#8B9A8B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  clearAllText: {
    color: '#34931A',
    fontSize: 12,
    fontWeight: '700',
  },

  // -- RECENT SEARCHES --
  recentList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F4F0',
    overflow: 'hidden',
  },
  recentItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F9F5',
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F5F9F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentItemText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '600',
  },

  // -- TRENDING HORIZONTAL CARDS --
  trendingStrip: {
    gap: 16,
    paddingRight: 48, // Allows the last card to scroll slightly past the screen edge
  },
  trendingCard: {
    width: 180, // Fixed width for horizontal scrolling
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F4F0',
  },
  trendingCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tutorAvatar: {
    width: 48, 
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorInitials: {
    fontSize: 16,
    fontWeight: '800',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: '700',
  },
  tutorName: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  tutorSubject: {
    color: '#8B9A8B',
    fontSize: 13,
    fontWeight: '500',
  },

  // -- BROWSE CATEGORIES --
  categoryGrid: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F4F0',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryTitle: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  categorySub: {
    color: '#8B9A8B',
    fontSize: 13,
    fontWeight: '500',
  }
});
import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav'; // <-- Reusable nav
import Avatar from '../components/Avatar';
import { useApp } from '../context/AppContext';
import { useApiData } from '../hooks/useApiData';
import api from '../services/api';
import { mapApiTutor } from '../services/transform';

// Shown until the API returns approved tutors.
const FALLBACK_TRENDING = [
  { id: '1', name: 'Aisha O.', subject: 'Chemistry', rating: '4.9' },
  { id: '2', name: 'David O.', subject: 'English', rating: '4.8' },
  { id: '3', name: 'Samuel O.', subject: 'Economics', rating: '5.0' },
];

// Students & parents can find tutors across five admin-controlled dimensions.
const DIMENSIONS = [
  { key: 'Level', label: 'Education Level' },
  { key: 'Stream', label: 'Stream' },
  { key: 'Subject', label: 'Subject' },
  { key: 'Exam', label: 'Examination' },
  { key: 'Category', label: 'Category' },
];

export default function SearchScreen() {
  const navigation = useNavigation();
  const { educationLevels, streams, subjects, examinations, categories } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [dimension, setDimension] = useState('Level');
  const [selected, setSelected] = useState(null);

  const recentSearches = [
    'Calculus 101',
    'JAMB Past Questions',
    'Dr. Funke Adeyemi',
    'Public Speaking',
  ];

  const { data: apiTutors } = useApiData(() => api.tutors.list(), []);
  const trendingTutors =
    Array.isArray(apiTutors) && apiTutors.length > 0
      ? apiTutors.slice(0, 8).map(mapApiTutor)
      : FALLBACK_TRENDING;

  // Build the list of options for the active dimension. Education levels are
  // grouped (Primary School, Senior Secondary, …); the rest are flat.
  const { grouped, flat } = useMemo(() => {
    const enabled = (arr) => arr.filter((it) => it.enabled);
    switch (dimension) {
      case 'Level': {
        const items = enabled(educationLevels);
        const groups = {};
        items.forEach((it) => {
          groups[it.group] = groups[it.group] || [];
          groups[it.group].push(it);
        });
        return { grouped: groups, flat: null };
      }
      case 'Stream':
        return { grouped: null, flat: enabled(streams) };
      case 'Subject':
        return { grouped: null, flat: enabled(subjects) };
      case 'Exam':
        return { grouped: null, flat: enabled(examinations) };
      case 'Category':
      default: {
        const items = enabled(categories);
        const groups = {};
        items.forEach((it) => {
          groups[it.group] = groups[it.group] || [];
          groups[it.group].push(it);
        });
        return { grouped: groups, flat: null };
      }
    }
  }, [dimension, educationLevels, streams, subjects, examinations, categories]);

  const renderChip = (item) => {
    const active = selected === item.id;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.optionChip, active && styles.optionChipActive]}
        activeOpacity={0.8}
        onPress={() => setSelected(active ? null : item.id)}
      >
        <Text style={[styles.optionText, active && styles.optionTextActive]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.pageHeaderTitle}>Find a Tutor</Text>

          {/* Hero Search Bar */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#8B9A8B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tutors, subjects, skills or exams..."
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
          {/* Browse-by dimension selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterStrip}
          >
            {DIMENSIONS.map((d) => {
              const isSelected = dimension === d.key;
              return (
                <TouchableOpacity
                  key={d.key}
                  style={[styles.filterPill, isSelected && styles.activeFilterPill]}
                  onPress={() => {
                    setDimension(d.key);
                    setSelected(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterText, isSelected && styles.activeFilterText]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Options for the active dimension */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { marginBottom: 16 }]}>
              FIND TUTORS BY {DIMENSIONS.find((d) => d.key === dimension)?.label.toUpperCase()}
            </Text>

            {grouped
              ? Object.keys(grouped).map((groupName) => (
                  <View key={groupName} style={styles.groupBlock}>
                    <Text style={styles.groupLabel}>{groupName}</Text>
                    <View style={styles.optionWrap}>
                      {grouped[groupName].map(renderChip)}
                    </View>
                  </View>
                ))
              : (
                <View style={styles.optionWrap}>{flat.map(renderChip)}</View>
              )}

            {selected && (
              <TouchableOpacity
                style={styles.applyButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('TutorProfile')}
              >
                <Feather name="users" size={16} color="#FFFFFF" />
                <Text style={styles.applyButtonText}>View matching tutors</Text>
              </TouchableOpacity>
            )}
          </View>

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
              snapToInterval={200}
              decelerationRate="fast"
            >
              {trendingTutors.map((tutor) => (
                <TouchableOpacity
                  key={tutor.id}
                  style={styles.trendingCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('TutorProfile', {
                      tutorId: tutor.id,
                      tutorName: tutor.name,
                      tutorInitials: tutor.initials,
                      tutorSubject: tutor.subject,
                      tutorAvatar: tutor.avatar,
                    })
                  }
                >
                  <View style={styles.trendingCardTop}>
                    <Avatar
                      uri={tutor.avatar}
                      name={tutor.name}
                      initials={tutor.initials}
                      size={48}
                    />
                    {tutor.rating ? (
                      <View style={styles.ratingPill}>
                        <Ionicons name="star" size={12} color="#F3C353" />
                        <Text style={styles.ratingText}>{tutor.rating}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.tutorName} numberOfLines={1}>{tutor.name}</Text>
                  <Text style={styles.tutorSubject} numberOfLines={1}>{tutor.subject}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quick links */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { marginBottom: 16 }]}>MORE WAYS TO LEARN</Text>

            <View style={styles.categoryGrid}>
              <TouchableOpacity
                style={styles.categoryCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('GroupClasses')}
              >
                <View style={[styles.categoryIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Feather name="users" size={20} color="#2E7D32" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.categoryTitle}>Live Group Classes</Text>
                  <Text style={styles.categorySub}>JAMB, WAEC, IELTS & skills bootcamps</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#B0BCB0" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.categoryCard} activeOpacity={0.7}>
                <View style={[styles.categoryIcon, { backgroundColor: '#F4E8FA' }]}>
                  <Feather name="book" size={20} color="#8E44AD" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.categoryTitle}>Past Questions</Text>
                  <Text style={styles.categorySub}>Over 10,000+ questions</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#B0BCB0" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
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
    paddingBottom: 110,
  },

  // -- DIMENSION SELECTOR --
  filterStrip: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
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

  // -- OPTION CHIPS --
  groupBlock: {
    marginBottom: 18,
  },
  groupLabel: {
    color: '#4A5D44',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0F4F0',
  },
  optionChipActive: {
    backgroundColor: '#Edf4E9',
    borderColor: '#34931A',
  },
  optionText: {
    color: '#4A5D44',
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#2D8C1A',
    fontWeight: '800',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34931A',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 20,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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
    paddingRight: 48,
  },
  trendingCard: {
    width: 180,
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

  // -- QUICK LINKS --
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
  flex1: { flex: 1 },
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
  },
});

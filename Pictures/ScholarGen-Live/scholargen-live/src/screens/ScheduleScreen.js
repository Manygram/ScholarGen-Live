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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../components/BottomNav'; // <-- Our sleek reusable nav
import { useApiData } from '../hooks/useApiData';
import api from '../services/api';
import { mapApiSession } from '../services/transform';

// Shown until the API has sessions for this student.
const FALLBACK_SCHEDULE = [
  { id: '1', subject: 'Physics', tutor: 'Dr. Funke Adeyemi', time: '10:00 AM - 12:00 PM', type: 'Group Class', status: 'Completed' },
  { id: '2', subject: 'Mathematics', tutor: 'Kelechi E.', time: '2:00 PM - 4:00 PM', type: '1-on-1 Mentorship', status: 'Live' },
  { id: '3', subject: 'English', tutor: 'David O.', time: '5:30 PM - 7:00 PM', type: 'Group Class', status: 'Upcoming' },
];

export default function ScheduleScreen() {
  const [activeDate, setActiveDate] = useState('17');
  const [activeFilter, setActiveFilter] = useState('All');

  // Live sessions for the signed-in student, with a graceful fallback.
  const { data: apiSessions } = useApiData(() => api.students.sessions(), []);
  const scheduleData =
    Array.isArray(apiSessions) && apiSessions.length > 0
      ? apiSessions.map(mapApiSession)
      : FALLBACK_SCHEDULE;

  // Creative element: Horizontal date strip for quick week navigation
  const weekDates = [
    { day: 'Mon', date: '15' },
    { day: 'Tue', date: '16' },
    { day: 'Wed', date: '17' }, // Today
    { day: 'Thu', date: '18' },
    { day: 'Fri', date: '19' },
    { day: 'Sat', date: '20' },
  ];

  const filters = ['All', 'Physics', 'Mathematics', 'English'];

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.container}>
        {/* TOP SECTION: Calendar & Header */}
        <LinearGradient
          colors={['#10240C', '#1A3312']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topHeaderSection}
        >
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>Schedule</Text>
            <TouchableOpacity style={styles.calendarButton} activeOpacity={0.7}>
              <Feather name="calendar" size={18} color="#FFFFFF" />
              <Text style={styles.monthText}>June</Text>
            </TouchableOpacity>
          </View>

          {/* Sleek Horizontal Date Strip */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateStrip}
          >
            {weekDates.map((item) => {
              const isActive = activeDate === item.date;
              return (
                <TouchableOpacity
                  key={item.date}
                  style={[styles.dateCard, isActive && styles.activeDateCard]}
                  onPress={() => setActiveDate(item.date)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayText, isActive && styles.activeDateText]}>
                    {item.day}
                  </Text>
                  <Text style={[styles.dateText, isActive && styles.activeDateText]}>
                    {item.date}
                  </Text>
                  {/* Small dot to indicate "Today" */}
                  {item.date === '17' && !isActive && <View style={styles.todayDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </LinearGradient>

        {/* BOTTOM SECTION: Timeline & Filters */}
        <ScrollView 
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Flat Filter Pills */}
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

          {/* Timeline List */}
          <View style={styles.timelineContainer}>
            {scheduleData.map((session, index) => {
              const isLive = session.status === 'Live';
              const isCompleted = session.status === 'Completed';

              return (
                <View key={session.id} style={styles.timelineRow}>
                  {/* Left Side: Time Marker */}
                  <View style={styles.timeMarker}>
                    <Text style={[styles.markerText, isLive && styles.markerTextLive]}>
                      {session.time.split(' ')[0]} {/* Extracts just the hour e.g., 10:00 */}
                    </Text>
                    <Text style={styles.markerPeriod}>
                      {session.time.split(' ')[1]} {/* Extracts AM/PM */}
                    </Text>
                  </View>

                  {/* Right Side: Event Card */}
                  <View style={[styles.sessionCard, isLive && styles.liveSessionCard]}>
                    {/* Header Row of Card */}
                    <View style={styles.cardHeader}>
                      <View style={styles.typeBadgeRow}>
                        <MaterialCommunityIcons 
                          name={session.type === 'Group Class' ? 'account-group' : 'account'} 
                          size={14} 
                          color={isCompleted ? '#8B9A8B' : '#34931A'} 
                        />
                        <Text style={[styles.typeText, isCompleted && styles.completedText]}>
                          {session.type}
                        </Text>
                      </View>
                      
                      {/* Dynamic Status Pill */}
                      <View style={[
                        styles.statusPill, 
                        isLive ? styles.statusLive : (isCompleted ? styles.statusCompleted : styles.statusUpcoming)
                      ]}>
                        {isLive && <View style={styles.liveDot} />}
                        <Text style={[
                          styles.statusText,
                          isLive ? styles.statusTextLive : (isCompleted ? styles.statusTextCompleted : styles.statusTextUpcoming)
                        ]}>
                          {session.status}
                        </Text>
                      </View>
                    </View>

                    {/* Body of Card */}
                    <Text style={[styles.subjectTitle, isCompleted && styles.completedText]}>
                      {session.subject}
                    </Text>
                    <Text style={styles.tutorName}>{session.tutor}</Text>

                    {/* Action Area (Only shows for Live classes) */}
                    {isLive && (
                      <View style={styles.liveActionRow}>
                        <Text style={styles.durationText}>
                          <Feather name="clock" size={12} /> 2h
                        </Text>
                        <TouchableOpacity style={styles.joinBtn} activeOpacity={0.8}>
                          <Text style={styles.joinBtnText}>Join Class</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
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
  
  // -- SLEEK HEADER & CALENDAR STRIP --
  topHeaderSection: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 28, 
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  monthText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dateStrip: {
    paddingHorizontal: 24,
    gap: 12,
  },
  dateCard: {
    width: 60,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeDateCard: {
    backgroundColor: '#34931A',
    borderColor: '#34931A',
  },
  dayText: {
    color: '#AABBA0',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  activeDateText: {
    color: '#FFFFFF',
  },
  todayDot: {
    width: 4,
    height: 4,
    backgroundColor: '#85D161',
    borderRadius: 2,
    position: 'absolute',
    bottom: 10,
  },

  // -- SCROLL AREA & FILTERS --
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Clear bottom nav
  },
  filterStrip: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 10,
  },
  filterPill: {
    backgroundColor: '#F5F9F5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F4F0',
  },
  activeFilterPill: {
    backgroundColor: '#Edf4E9',
    borderColor: '#34931A',
  },
  filterText: {
    color: '#8B9A8B',
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#2D8C1A',
  },

  // -- TIMELINE DESIGN --
  timelineContainer: {
    paddingHorizontal: 24,
    gap: 20,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeMarker: {
    width: 65,
    paddingTop: 4,
  },
  markerText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  markerTextLive: {
    color: '#34931A', // Green text for current time
  },
  markerPeriod: {
    color: '#8B9A8B',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // -- EVENT CARDS --
  sessionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F4F0',
    elevation: 0,
  },
  liveSessionCard: {
    borderColor: '#34931A',
    borderWidth: 1.5, // Slightly thicker border to emphasize active status without relying on shadow
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeText: {
    color: '#4A5D44',
    fontSize: 12,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
  },
  statusUpcoming: {
    backgroundColor: '#F5F9F5',
  },
  statusCompleted: {
    backgroundColor: '#F7F7F7',
  },
  statusLive: {
    backgroundColor: 'rgba(255, 77, 77, 0.1)', // Soft red wash
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusTextUpcoming: { color: '#8B9A8B' },
  statusTextCompleted: { color: '#B0BCB0' },
  statusTextLive: { color: '#FF4D4D' }, // Crisp red text
  liveDot: {
    width: 6,
    height: 6,
    backgroundColor: '#FF4D4D',
    borderRadius: 3,
  },
  subjectTitle: {
    color: '#1A1A1A',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  tutorName: {
    color: '#8B9A8B',
    fontSize: 13,
    fontWeight: '500',
  },
  completedText: {
    color: '#AABBA0', // Grays out title/type if class is over
  },
  
  // -- LIVE ACTION ROW --
  liveActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F0',
  },
  durationText: {
    color: '#4A5D44',
    fontSize: 13,
    fontWeight: '600',
  },
  joinBtn: {
    backgroundColor: '#34931A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  }
});
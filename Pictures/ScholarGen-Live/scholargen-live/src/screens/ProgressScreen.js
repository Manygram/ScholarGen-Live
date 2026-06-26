// src/screens/ProgressScreen.js
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../components/BottomNav'; // <-- Import your new reusable component!

export default function ProgressScreen() {
  const trajectoryData = [
    { id: '1', month: 'Sep', height: 40, color: '#DDF0D6' },
    { id: '2', month: 'Oct', height: 50, color: '#CDE4C6' },
    { id: '3', month: 'Nov', height: 65, color: '#A2D396' },
    { id: '4', month: 'Dec', height: 80, color: '#65D036' },
    { id: '5', month: 'Jan', height: 95, color: '#34931A' },
    { id: '6', month: 'Now', height: 110, color: '#1A3312', score: 258 },
  ];

  const subjectData = [
    { id: '1', name: 'Mathematics', score: '72%', progress: 72, color: '#34931A' },
    { id: '2', name: 'Physics', score: '54%', progress: 54, color: '#E67E22' },
    { id: '3', name: 'English', score: '88%', progress: 88, color: '#34931A' },
    { id: '4', name: 'Chemistry', score: '41%', progress: 41, color: '#E74C3C' },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Sleek Deep Green Header */}
          <LinearGradient
            colors={['#10240C', '#1A3312']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerSection}
          >
            <Text style={styles.headerTitle}>My Progress</Text>
            <Text style={styles.headerSubtitle}>JAMB Preparation · Month 2</Text>
          </LinearGradient>

          <View style={styles.bottomContentSection}>
            {/* Flat CARD 1: Score Trajectory */}
            <View style={styles.primaryCard}>
              <Text style={styles.cardTitle}>SCORE TRAJECTORY</Text>
              
              <View style={styles.chartContainer}>
                {trajectoryData.map((item) => (
                  <View key={item.id} style={styles.barColumn}>
                    <View style={styles.scoreLabelContainer}>
                      {item.score && (
                        <Text style={styles.scoreLabelText}>{item.score}</Text>
                      )}
                    </View>
                    
                    {/* Sleek Bar - Only top corners rounded */}
                    <View 
                      style={[
                        styles.bar, 
                        { height: item.height, backgroundColor: item.color }
                      ]} 
                    />
                    
                    <Text style={styles.monthLabel}>{item.month}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Flat CARD 2: Subject Performance */}
            <View style={styles.primaryCard}>
              <Text style={styles.cardTitle}>SUBJECT PERFORMANCE</Text>

              <View style={styles.subjectsContainer}>
                {subjectData.map((subject) => (
                  <View key={subject.id} style={styles.subjectRow}>
                    <View style={styles.subjectHeader}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={[styles.subjectScore, { color: subject.color }]}>
                        {subject.score}
                      </Text>
                    </View>
                    
                    {/* Ultra-slim Progress Bar */}
                    <View style={styles.progressBarTrack}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { width: `${subject.progress}%`, backgroundColor: subject.color }
                        ]} 
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Reusable Bottom Nav Hooked Up Here! */}
        <BottomNav />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFDFC', // Ultra-clean background
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28, // Moderated from 36
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#AABBA0',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110, // Clears the absolute bottom nav
  },
  bottomContentSection: {
    paddingHorizontal: 24,
    marginTop: -15, // Smooth overlap
  },
  primaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F4F0', // Flat design borders
    elevation: 0,
  },
  cardTitle: {
    color: '#8B9A8B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 24,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140, 
  },
  barColumn: {
    alignItems: 'center',
    width: '14%', 
  },
  scoreLabelContainer: {
    height: 20,
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  scoreLabelText: {
    color: '#1A3312',
    fontSize: 12,
    fontWeight: '800',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6, // Flat bottom, rounded top
    marginBottom: 8,
  },
  monthLabel: {
    color: '#8B9A8B',
    fontSize: 11,
    fontWeight: '600',
  },
  subjectsContainer: {
    gap: 24, // Consistent spacing
  },
  subjectRow: {
    width: '100%',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectName: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '700',
  },
  subjectScore: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 4, // Slim modern track
    backgroundColor: '#F5F9F5',
    borderRadius: 2,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function LearningProfileScreen() {
  const navigation = useNavigation();
  const [activeGoal, setActiveGoal] = useState('JAMB');

  const goals = ['JAMB', 'WAEC', 'NECO', 'IELTS', 'ICAN', 'General'];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Status Bar hidden to match the clean UI */}
      <StatusBar hidden />
      
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header & Progress Section */}
          <View style={styles.headerSection}>
            <Text style={styles.stepText}>STEP 2 OF 2</Text>
            
            {/* Separated Progress Bar - Both active for Step 2 */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressSegment, styles.progressActive]} />
              <View style={[styles.progressSegment, styles.progressActive]} />
            </View>

            <Text style={styles.titleText}>Your Goal</Text>
            <Text style={styles.subtitleText}>Help us match the right tutor</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            
            {/* Primary Goal Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>What's your primary goal?</Text>
              <View style={styles.pillContainer}>
                {goals.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.pill,
                      activeGoal === goal ? styles.activePill : styles.inactivePill
                    ]}
                    onPress={() => setActiveGoal(goal)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        activeGoal === goal ? styles.activePillText : styles.inactivePillText
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Scores Row */}
            <View style={styles.rowGroup}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Current Score</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 180"
                    placeholderTextColor="#8B9A8B"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Target Score</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 300"
                    placeholderTextColor="#8B9A8B"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Weak Subjects Tags */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weak Subjects</Text>
              <View style={styles.tagsContainer}>
                
                {/* Mathematics Tag */}
                <View style={styles.subjectTag}>
                  <Text style={styles.subjectTagText}>Mathematics</Text>
                  <TouchableOpacity style={styles.tagCloseIcon}>
                    <Ionicons name="close" size={14} color="#D34B4B" />
                  </TouchableOpacity>
                </View>

                {/* Physics Tag */}
                <View style={styles.subjectTag}>
                  <Text style={styles.subjectTagText}>Physics</Text>
                  <TouchableOpacity style={styles.tagCloseIcon}>
                    <Ionicons name="close" size={14} color="#D34B4B" />
                  </TouchableOpacity>
                </View>

                {/* Add Button */}
                <TouchableOpacity style={styles.addTagButton} activeOpacity={0.7}>
                  <Text style={styles.addTagText}>+ Add</Text>
                </TouchableOpacity>

              </View>
            </View>

          </View>
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.completeButton} activeOpacity={0.8} onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.completeButtonText}>Complete Setup</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pure white
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 30, // Increased to match hidden status bar
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 30,
  },
  stepText: {
    color: '#34931A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 30,
    width: '100%',
  },
  progressSegment: {
    height: 6,
    borderRadius: 3,
    flex: 1,
  },
  progressActive: {
    backgroundColor: '#34931A',
  },
  progressInactive: {
    backgroundColor: '#Edf4E9',
  },
  titleText: {
    color: '#1A1A1A',
    fontSize: 32, // Reduced from 42
    fontWeight: '900',
    lineHeight: 38,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitleText: {
    color: '#6B7A63',
    fontSize: 14, // Reduced from 16
    fontWeight: '500',
  },
  formSection: {
    gap: 16, // Matched gap from the clean registration UI
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    color: '#4A5D44',
    fontSize: 13, // Matched moderate typography
    fontWeight: '700',
    marginBottom: 8,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  activePill: {
    backgroundColor: '#3A8D28',
    borderColor: '#3A8D28',
  },
  inactivePill: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D4E5D4',
  },
  activePillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14, // Adjusted for cleaner look
  },
  inactivePillText: {
    color: '#4A5D44',
    fontWeight: '600',
    fontSize: 14,
  },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '47%', 
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D4E5D4',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15, // Matched moderate typography
    color: '#1A1A1A',
    fontWeight: '500',
    height: '100%',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subjectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCEAE8', 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subjectTagText: {
    color: '#D34B4B', 
    fontWeight: '600',
    fontSize: 14,
    marginRight: 6,
  },
  tagCloseIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTagButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D4E5D4',
    backgroundColor: '#FFFFFF',
  },
  addTagText: {
    color: '#6B7A63',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    backgroundColor: '#FFFFFF', // Pure white
  },
  completeButton: {
    backgroundColor: '#52BE23', 
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
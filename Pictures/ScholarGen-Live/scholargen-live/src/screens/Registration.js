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
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AvatarPicker } from '../components/Avatar';
import Dropdown from '../components/Dropdown';
import { NIGERIAN_STATES } from '../data/nigeria';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const { studentProfile, updateStudentProfile } = useApp();
  const { register, login } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [city, setCity] = useState('');
  const [avatar, setAvatar] = useState(studentProfile.avatar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!name.trim() || !email.trim() || password.length < 8) {
      setError('Enter your name, email and a password of at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        full_name: name.trim(),
        role: 'student',
        ...(phone.trim() ? { phone_number: phone.trim() } : {}),
      });
      // Registration does not start a session, so log in to set the cookie.
      await login(email.trim(), password);
      // Best-effort: persist the rest of the profile to the API.
      try {
        await api.users.updateProfile({
          full_name: name.trim(),
          ...(phone.trim() ? { phone_number: phone.trim() } : {}),
          ...(stateValue ? { state: stateValue } : {}),
          ...(city.trim() ? { city: city.trim() } : {}),
        });
      } catch {
        // non-fatal — continue onboarding
      }
      updateStudentProfile({ name: name.trim(), email: email.trim(), avatar });
      navigation.navigate('Learning');
    } catch (e) {
      setError(e?.message || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Status Bar completely hidden as requested */}
      <StatusBar hidden />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Header & Progress Section */}
          <View style={styles.headerSection}>
            <Text style={styles.stepText}>STEP 1 OF 2</Text>
            
            {/* Separated Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressSegment, styles.progressActive]} />
              <View style={[styles.progressSegment, styles.progressInactive]} />
            </View>

            <Text style={styles.titleText}>Create{'\n'}Account</Text>
            <Text style={styles.subtitleText}>Let&apos;s get you started</Text>
          </View>

          {/* Profile Picture */}
          <View style={styles.avatarSection}>
            <AvatarPicker uri={avatar} name={name || 'New Student'} size={88} onChange={setAvatar} />
            <Text style={styles.avatarHint}>Add a profile picture</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="#34931A" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Chidinma Okafor"
                  placeholderTextColor="#8B9A8B"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Feather name="phone" size={20} color="#34931A" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="+234 800 000 0000"
                  placeholderTextColor="#8B9A8B"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            {/* Email Address Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Feather name="mail" size={20} color="#34931A" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@email.com"
                  placeholderTextColor="#8B9A8B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#34931A" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#8B9A8B"
                  secureTextEntry
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* State & City Row */}
            <View style={styles.rowGroup}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>State</Text>
                <Dropdown
                  value={stateValue}
                  options={NIGERIAN_STATES}
                  onChange={setStateValue}
                  placeholder="Select state"
                  leftIcon="map"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>City</Text>
                <View style={styles.inputContainer}>
                  <Feather name="map-pin" size={18} color="#34931A" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ikeja"
                    placeholderTextColor="#8B9A8B"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
              </View>
            </View>

            {/* Already have an account */}
            <View style={styles.signinRedirect}>
              <Text style={styles.redirectText}>Already have an account? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.redirectLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View style={styles.bottomSection}>
          {error ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={16} color="#D34B4B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Changed to pure white
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 30, // Slightly increased top padding since status bar is hidden
    paddingBottom: 80, // Extra room so the keyboard never covers the lower fields
  },
  headerSection: {
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarHint: {
    color: '#6B7A63',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
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
    flex: 1, // Ensures both segments take up equal width automatically
  },
  progressActive: {
    backgroundColor: '#34931A',
  },
  progressInactive: {
    backgroundColor: '#Edf4E9', // Very light green for inactive step
  },
  titleText: {
    color: '#1A1A1A',
    fontSize: 32, // Reduced from 42 for a more moderate look
    fontWeight: '900',
    lineHeight: 38, // Adjusted to match new font size
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitleText: {
    color: '#6B7A63',
    fontSize: 14, // Reduced from 16
    fontWeight: '500',
  },
  formSection: {
    gap: 16, // Slightly reduced gap between inputs to match moderate styling
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    color: '#4A5D44',
    fontSize: 13, // Slightly reduced to match moderate typography
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D4E5D4',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    height: '100%',
    fontWeight: '500',
  },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '47%', 
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    backgroundColor: '#FFFFFF', // Changed to pure white
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FCEAE8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#D34B4B',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signinRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  redirectText: {
    color: '#6B7A63',
    fontSize: 14,
    fontWeight: '500',
  },
  redirectLink: {
    color: '#34931A',
    fontSize: 14,
    fontWeight: '700',
  },
  continueButton: {
    backgroundColor: '#52BE23',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
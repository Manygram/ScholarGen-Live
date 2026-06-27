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
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      const dest = user?.role === 'tutor' ? 'TutorDashboard' : 'Dashboard';
      navigation.reset({ index: 0, routes: [{ name: dest }] });
    } catch (e) {
      setError(e?.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Status Bar completely hidden to match Registration UI */}
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
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.titleText}>Welcome{'\n'}Back</Text>
            <Text style={styles.subtitleText}>Log in to continue learning</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            
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
                  placeholder="••••••••"
                  placeholderTextColor="#8B9A8B"
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.eyeIcon}
                >
                  <Feather 
                    name={isPasswordVisible ? "eye-off" : "eye"} 
                    size={20} 
                    color="#8B9A8B" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPasswordButton} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color="#D34B4B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

          </View>
        </ScrollView>

        {/* Fixed Bottom Button & Redirect */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          {/* Sign Up Redirect */}
          <View style={styles.signupRedirect}>
            <Text style={styles.redirectText}>Don&apos;t have an account? </Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Registration')}
            >
              <Text style={styles.redirectLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 30, // Matches Registration screen
    paddingBottom: 80,
  },
  headerSection: {
    marginBottom: 40,
    marginTop: 20, // Adds a bit of space since there is no progress bar here
  },
  titleText: {
    color: '#1A1A1A',
    fontSize: 32, // Moderated size
    fontWeight: '900',
    lineHeight: 38,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitleText: {
    color: '#6B7A63',
    fontSize: 14, // Moderated size
    fontWeight: '500',
  },
  formSection: {
    gap: 16, // Moderated gap
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    color: '#4A5D44',
    fontSize: 13, // Moderated size
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
    fontSize: 15, // Moderated size
    color: '#1A1A1A',
    height: '100%',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotPasswordText: {
    color: '#34931A',
    fontSize: 13, // Moderated size
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FCEAE8',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
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
  bottomSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24, 
    backgroundColor: '#FFFFFF', // Pure white
  },
  continueButton: {
    backgroundColor: '#52BE23', 
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  signupRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
});
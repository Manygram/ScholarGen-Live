// src/navigation/AppNavigator.js
// 1. We must import useState and useEffect from React
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// -- STUDENT SCREENS --
import SplashScreen from '../screens/SplashScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LearningScreen from '../screens/LearningScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PackageSelectionScreen from '../screens/PackageSelectionScreen';
import ProgressScreen from '../screens/ProgressScreen';
import Registration from '../screens/Registration'; 
import TutorProfileScreen from '../screens/TutorProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen'; 

// -- TUTOR SCREENS (NEW) --
import AvailabilityScreen from '../screens/AvailabilityScreen';
import EarningsScreen from '../screens/EarningsScreen';
import SessionReportScreen from '../screens/SessionReportScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';
import StudentsScreen from '../screens/StudentsScreen';
import TutorDashboardScreen from '../screens/TutorDashboardScreen';
import TutorOnboardingScreen from '../screens/TutorOnboardingScreen';

// -- SHARED / MARKETPLACE SCREENS --
import GroupClassesScreen from '../screens/GroupClassesScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // 2. THE MEMORY: keep the splash up for a minimum, branded moment…
  const [minSplashDone, setMinSplashDone] = useState(false);
  // …and wait for the session to be restored from the httpOnly cookie.
  const { bootstrapping, isAuthenticated, role } = useAuth();

  // 3. THE TIMER: short branded splash window.
  useEffect(() => {
    const timer = setTimeout(() => setMinSplashDone(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 4. THE GATEKEEPER: stay on the splash until both the timer and the session
  // bootstrap have completed.
  if (!minSplashDone || bootstrapping) {
    return <SplashScreen />;
  }

  // 5. THE MAIN APP: send signed-in users straight to their dashboard (by role);
  // everyone else starts at Onboarding.
  const initialRouteName = isAuthenticated
    ? role === 'tutor'
      ? 'TutorDashboard'
      : 'Dashboard'
    : 'Onboarding';

  return (
    <NavigationContainer>
      {/* Added headerShown: false to prevent default top bars from ruining your custom UI */}
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
        
        {/* === STUDENT FLOW === */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Learning" component={LearningScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="TutorProfile" component={TutorProfileScreen} />
        <Stack.Screen name="PackageSelection" component={PackageSelectionScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />

        {/* === TUTOR FLOW === */}
        <Stack.Screen name="TutorOnboarding" component={TutorOnboardingScreen} />
        <Stack.Screen name="TutorDashboard" component={TutorDashboardScreen} />
        <Stack.Screen name="Students" component={StudentsScreen} />
        <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
        <Stack.Screen name="SessionReport" component={SessionReportScreen} />
        <Stack.Screen name="Earnings" component={EarningsScreen} />
        <Stack.Screen name="Availability" component={AvailabilityScreen} />

        {/* === SHARED / MARKETPLACE === */}
        <Stack.Screen name="GroupClasses" component={GroupClassesScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
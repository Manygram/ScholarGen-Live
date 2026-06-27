// src/navigation/AppNavigator.js
// 1. We must import useState and useEffect from React
import React, { useState, useEffect } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
  // 2. THE MEMORY: Create a state to track if the splash is showing
  const [showSplash, setShowSplash] = useState(true);

  // 3. THE TIMER: Run this exact code the second the app opens
  useEffect(() => {
    // Start a 5000 millisecond (5 second) countdown
    const timer = setTimeout(() => {
      setShowSplash(false); // Turn the splash screen off!
    }, 5000);

    // This is a safety cleanup to stop the timer if the app closes early
    return () => clearTimeout(timer);
  }, []);

  // 4. THE GATEKEEPER: If the timer is still running, ONLY show the Splash screen.
  // Notice this completely ignores the NavigationContainer!
  if (showSplash) {
    return <SplashScreen />;
  }

  // 5. THE MAIN APP: Once showSplash becomes false, the app moves past the if-statement
  // and renders your actual navigation stack.
  return (
    <NavigationContainer>
      {/* Added headerShown: false to prevent default top bars from ruining your custom UI */}
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        
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
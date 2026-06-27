import React from 'react';
import {StatusBar} from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import {AppProvider} from './src/context/AppContext';
import {AuthProvider} from './src/context/AuthContext';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </AppProvider>
  );
}

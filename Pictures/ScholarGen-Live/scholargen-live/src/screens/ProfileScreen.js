import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Switch
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav'; // <-- Reusable nav

export default function StudentProfileScreen() {
  const navigation = useNavigation();
  // Example toggle state for a setting
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  // Reusable Settings Row Component
  const SettingsRow = ({ icon, title, showToggle, toggleValue, onToggle, isDestructive, onPress }) => (
    <TouchableOpacity 
      style={styles.settingsRow} 
      activeOpacity={showToggle ? 1 : 0.7} // Don't show touch feedback if it's just a toggle row
      onPress={onPress}
    >
      <View style={styles.settingsRowLeft}>
        <View style={[styles.iconBox, isDestructive && styles.iconBoxDestructive]}>
          <Feather 
            name={icon} 
            size={18} 
            color={isDestructive ? '#FF4D4D' : '#4A5D44'} 
          />
        </View>
        <Text style={[styles.settingsTitle, isDestructive && styles.destructiveText]}>
          {title}
        </Text>
      </View>

      {showToggle ? (
        <Switch
          trackColor={{ false: '#Edf4E9', true: '#34931A' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#Edf4E9"
          onValueChange={onToggle}
          value={toggleValue}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      ) : (
        <Feather name="chevron-right" size={20} color="#B0BCB0" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* TOP SECTION: Deep Premium Gradient Header */}
          <LinearGradient
            colors={['#10240C', '#1A3312']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.topSection}
          >
            <Text style={styles.pageHeaderTitle}>My Profile</Text>

            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>CO</Text>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.nameText}>Chidinma Okafor</Text>
                <Text style={styles.emailText}>chidinma.o@example.com</Text>
                
                {/* Clean inline badge for student goal */}
                <View style={styles.goalBadge}>
                  <MaterialCommunityIcons name="target" size={12} color="#85D161" />
                  <Text style={styles.goalText}>JAMB Target: 300</Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* MIDDLE SECTION: Settings List */}
          <View style={styles.bottomContentSection}>
            
            <Text style={styles.sectionHeader}>ACCOUNT</Text>
            <View style={styles.settingsGroup}>
              <SettingsRow 
                icon="user" 
                title="Personal Information" 
                onPress={() => {}} 
              />
              <SettingsRow 
                icon="book" 
                title="Learning Preferences" 
                onPress={() => navigation.navigate('Learning')} 
              />
              <SettingsRow 
                icon="credit-card" 
                title="Billing & Plans" 
                onPress={() => {}} 
              />
            </View>

            <Text style={styles.sectionHeader}>PREFERENCES</Text>
            <View style={styles.settingsGroup}>
              <SettingsRow 
                icon="bell" 
                title="Push Notifications" 
                showToggle={true}
                toggleValue={notificationsEnabled}
                onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              <SettingsRow 
                icon="shield" 
                title="Privacy & Security" 
                onPress={() => {}} 
              />
            </View>

            <Text style={styles.sectionHeader}>SUPPORT</Text>
            <View style={styles.settingsGroup}>
              <SettingsRow 
                icon="help-circle" 
                title="Help Center" 
                onPress={() => {}} 
              />
              <SettingsRow 
                icon="message-square" 
                title="Contact Tutors" 
                onPress={() => {}} 
              />
            </View>

            {/* Logout Button */}
            <View style={styles.logoutContainer}>
              <SettingsRow 
                icon="log-out" 
                title="Log Out" 
                isDestructive={true}
                onPress={() => navigation.navigate('Login')} // Redirects to login
              />
            </View>

            <Text style={styles.versionText}>ScholarGen v1.0.0</Text>
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
    backgroundColor: '#FCFDFC', // Ultra-clean background
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110, // Clears the absolute nav
  },

  // -- SLEEK HEADER --
  topSection: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingBottom: 35,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  pageHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#DDF0D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  avatarText: {
    color: '#1A3312',
    fontSize: 22,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  emailText: {
    color: '#AABBA0',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(133, 209, 97, 0.15)',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
  },
  goalText: {
    color: '#85D161',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // -- MAIN CONTENT --
  bottomContentSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionHeader: {
    color: '#8B9A8B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F4F0',
    marginBottom: 28,
    overflow: 'hidden', // Keeps the internal rows clipped nicely
  },

  // -- SETTINGS ROWS --
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F9F5', // Very light divider between items
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F9F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxDestructive: {
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
  },
  settingsTitle: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '600',
  },
  destructiveText: {
    color: '#FF4D4D',
  },

  // -- LOGOUT & FOOTER --
  logoutContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.2)', // Slight red tint to the border
    marginBottom: 24,
    overflow: 'hidden',
  },
  versionText: {
    textAlign: 'center',
    color: '#B0BCB0',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 20,
  }
});
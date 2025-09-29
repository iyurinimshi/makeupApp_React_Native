import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  // ⚠️ Platform import එක baseButtonStyles.ts file එකට ගෙන ගොස් ඇත, මෙහි අනවශ්‍යයි.
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack'; 

// ✅ baseButtonStyles.ts file එක import කිරීම
import { baseButtonStyles } from './baseButtonStyles'; 

// RootStackParamList එක App.tsx එකේ තියෙන විදියටම copy කරගන්න
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
};
type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

// 🚨 IMAGE PATH: ඔබගේ image එක තියෙන path එකට අනුව වෙනස් කරන්න.
const SilkBackground = require('./image/img1.jpg'); 

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={SilkBackground}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          
          <View style={styles.contentContainer}>
            <Text style={styles.headerText}>WELCOME, GORGEOUS.</Text>

            <Text style={styles.subText}>
              Keep track of your beauty products, get reminders before they
              expire, and manage your stash like a pro.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')} 
            >
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, 
  background: { flex: 1, width: '100%', height: '100%' }, 
  overlay: { flex: 1, padding: 20, justifyContent: 'space-between' },
  contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, marginTop: 100 },
  headerText: { fontSize: 34, fontWeight: '700', color: '#2d2d2d', marginBottom: 15, textAlign: 'center' },
  subText: { fontSize: 16, color: '#4a4a4a', lineHeight: 24, textAlign: 'center', paddingHorizontal: 20 },
  buttonContainer: { marginBottom: 50 },
  
  // baseButtonStyles import කළ නිසා, මේවායේදී එය භාවිතා කරයි.
  loginButton: {
    ...baseButtonStyles, 
    backgroundColor: '#fff', 
    borderColor: '#C79F9C', 
    borderWidth: 2,
  },
  loginButtonText: { color: '#C79F9C', fontSize: 18, fontWeight: '700' },
  registerButton: {
    ...baseButtonStyles, 
    backgroundColor: '#C79F9C', 
  },
  registerButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});

export default WelcomeScreen;

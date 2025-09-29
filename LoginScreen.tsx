import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// RootStackParamList එක App.tsx එකේ තියෙන විදියටම copy කරගන්න
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
};
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

// ✅ FIX: Image Path එක ../ නැතුව ./image/img1.jpg ලෙස වෙනස් කරන්න.
// LoginScreen.tsx file එක Root එකේම තියෙන නිසා, ../ අනවශ්‍යයි.
const LoginBackground = require('./image/loging.jpg'); 

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for button

  // NetBeans/Java EE Backend Login Logic
  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Missing Details', 'Please enter both email and password.');
        return;
    }

    setLoading(true);

    // Add your login logic here, then setLoading(false) when done.
    // Example:
    // await loginApi(email, password);
    // setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={LoginBackground}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Keyboard එක උඩට එද්දි content එක adjust කරන්න */}
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.overlay}>
            
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>SIGN IN</Text>
              <Text style={styles.subText}>Access your personalized beauty dashboard.</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#A88E8B"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A88E8B"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                    navigation.replace('Main'); // Login success නම් Main screen එකට යන්න
                }
              }
                disabled={loading} // Loading වෙද්දී button එක disable කරනවා
              >
                <Text style={styles.loginButtonText}>
                    {loading ? 'LOADING...' : 'SIGN IN'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
              >
                <Text style={styles.registerLink}>
                  Don't have an account? <Text style={{fontWeight: '700'}}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, justifyContent: 'center' },
  overlay: {
    flex: 1,
    padding: 30,
    justifyContent: 'space-around', // Content vertically centered
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Slightly transparent overlay for readability
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  headerText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#3A3042', // Darker color for high contrast
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subText: {
    fontSize: 16,
    color: '#6F5C7C',
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#4A4A4A',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#C79F9C', // Elegant Rose/Pink color
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#A88E8B',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  registerLink: {
    color: '#6F5C7C',
    fontSize: 14,
  },
});

export default LoginScreen;

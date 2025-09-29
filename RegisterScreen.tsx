import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView, // SafeAreaView added for consistency with LoginScreen
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// RootStackParamList එක define කරන්න (ඔබේ Navigation Setup එකට අනුව වෙනස් විය හැක)
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type RegisterScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Register'>;
};

// ⚠️ Image Path එක නිවැරදිව යොදන්න. Login එකේ වගේම Background එක යොදන්න ඕන නම්
// මේක loging.jpg ලෙස වෙනස් කරන්න පුඩුවන්. දැනට img2.jpg තියන්නම්.
const RegisterBackground = require('./image/loging.jpg');

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 📞 NetBeans Backend API Call එක
  const handleRegister = async () => {
    setErrorMessage('');
    
    // 1. Validation Check
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // 2. Data Object සකස් කිරීම
    const userData = {
      fullName: fullName,
      email: email,
      password: password,
    };

    const apiUrl = 'http://localhost:8080/MakeupApp_Backend/Register'; // ⚠️ ඔබේ Java EE Endpoint එක

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // 3. Response හැසිරවීම
      if (response.ok) {
        setErrorMessage('Registration Successful! Redirecting...');
        // තත්පර 2කට පසු Login Screen එකට යන්න
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(`Registration Failed: ${errorData.message || 'Server error occurred.'}`);
      }
    } catch (error) {
      setErrorMessage('Network Error: Could not connect to the backend server.');
      console.error('Registration Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={RegisterBackground} style={styles.background} resizeMode="cover">
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Login Screen එකේ වගේම Full Screen Overlay එකක් */}
          <View style={styles.overlay}>
            
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>SIGN UP</Text>
              <Text style={styles.subText}>Create your account to start customizing.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.formContainer}>
              
                {/* Full Name Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#A88E8B" // Login Style
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />

                {/* Email Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#A88E8B" // Login Style
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {/* Password Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Password (Min 6 characters)"
                  placeholderTextColor="#A88E8B" // Login Style
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />

                {/* Confirm Password Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#A88E8B" // Login Style
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />

                {/* Error Message */}
                {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

                {/* Sign Up Button (Login Style) */}
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleRegister}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>

                {/* Navigate to Login (Login Style) */}
                <TouchableOpacity
                  style={styles.navigateButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.navigateText}>
                    Already have an account? <Text style={styles.loginLink}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  // Full Screen Overlay (Matching Login Screen)
  overlay: {
    flex: 1,
    padding: 30,
    justifyContent: 'space-around', // Content vertically centered
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Light Transparent White Overlay
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 50, // Top margin to push down content slightly
    marginBottom: 20,
  },
  headerText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#3A3042', // Darker color for high contrast (Login Style)
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subText: {
    fontSize: 16,
    color: '#6F5C7C', // Login Style
    marginTop: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Add some space at the bottom for scrolling
  },
  formContainer: {
    width: '100%',
    maxWidth: 400, // Max width for centering on tablets/desktops
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.64)', // Lower opacity for more translucency (Blurred effect)
    borderRadius: 20, // Slightly more rounded
    // Glass effect border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', 
    // Increased Shadow for Depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15, // Slightly stronger shadow
    shadowRadius: 20,
    elevation: 15, // Increased elevation
  },
  input: {
    width: '100%',
    height: 55, // Fixed height for uniformity
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Input background (Matching Login Style)
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#4A4A4A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  errorMessage: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  // Register Button (Matching Login Button Style)
  registerButton: {
    width: '100%',
    backgroundColor: '#C79F9C', // Elegant Rose/Pink color (Login Style)
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    height: 55, // Fixed height for uniformity
    justifyContent: 'center',
    shadowColor: '#A88E8B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  navigateButton: {
    marginTop: 10,
  },
  navigateText: {
    color: '#6F5C7C', // Login Style
    fontSize: 14,
  },
  loginLink: {
    color: '#C79F9C', // Matching the button color for the link
    fontWeight: '700',
  },
});

export default RegisterScreen;

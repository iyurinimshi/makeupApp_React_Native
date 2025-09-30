import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';

// ----------------------------------------------------
// 1. SCREENS
// ----------------------------------------------------
// සියලුම Screens නිවැරදිව import කරන්න
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import Homescreen from './Homescreen'; 
import ProductsScreen from './ProductsScreen'; 
import NotesScreen from './NotesScreen'; 
import CalendarScreen from './CalendarScreen'; // 🌟 Calendar Screen එක import කර ඇත

// ----------------------------------------------------
// 2. NAVIGATORS
// ----------------------------------------------------
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Root Stack Navigator එකේ Types
type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined; // MainTabs වෙත යොමු කරයි
};

// Tab Navigator එකේ Types
type TabParamList = {
    HomeTab: undefined;
    ProductsTab: undefined;
    NotesTab: undefined;
    CalendarTab: undefined; // 🌟 Calendar Tab එක Types වලට එකතු කර ඇත
};

/**
 * Main Tabs (Bottom Navigation Bar)
 */
const MainTabs: React.FC = () => {
    return (
        <Tab.Navigator
            initialRouteName="HomeTab"
            screenOptions={{
                tabBarActiveTintColor: '#D78593', // Theme Pink/Red
                tabBarInactiveTintColor: '#999',
                headerShown: false, 
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                }
            }}
        >
            <Tab.Screen 
                name="HomeTab" 
                component={Homescreen} 
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="ProductsTab" 
                component={ProductsScreen} 
                options={{
                    title: 'Products',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cube-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="NotesTab" 
                component={NotesScreen} 
                options={{
                    title: 'Notes',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="notebook-outline" color={color} size={size} />
                    ),
                }}
            />
             {/* 🌟 නව Calendar Tab එක මෙතනට එකතු කර ඇත */}
            <Tab.Screen 
                name="CalendarTab" // 🔑 නිවැරදි නම CalendarTab
                component={CalendarScreen} 
                options={{
                    title: 'Calendar',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar-month-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

/**
 * ප්‍රධාන Application Component එක
 */
const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    // ආරම්භක තිරය Welcome (Token නැතිනම්) හෝ Main (Token තිබේ නම්) වේ
    const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Welcome');

    useEffect(() => {
        // User Token එක පරීක්ෂා කර Initial Route එක තීරණය කිරීම
        const checkLoginStatus = async () => {
            try {
                 // 💡 මෙතනදී userToken එකක් තිබේදැයි පරීක්ෂා කර initialRoute එක 'Main' ලෙස වෙනස් කළ හැකිය.
                 const userToken = await AsyncStorage.getItem('@user_token');
                 if (userToken) {
                    setInitialRoute('Main');
                 }
            } catch (e) {
                console.error('Failed to read userToken from AsyncStorage', e);
            } finally {
                setIsLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D78593" />
                <Text style={styles.loadingText}>Loading App...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{
                    headerShown: false, 
                    cardStyle: { backgroundColor: '#F5F5F5' }
                }}
            >
                {/* 🔑 User Authentication Screens */}
                <Stack.Screen name="Welcome" component={WelcomeScreen as React.ComponentType<any>} />
                <Stack.Screen name="Login" component={LoginScreen as React.ComponentType<any>} />
                <Stack.Screen name="Register" component={RegisterScreen as React.ComponentType<any>} />
                {/* 🔑 Main App Flow (Tabs) */}
                <Stack.Screen name="Main" component={MainTabs as React.ComponentType<any>} />
                <Stack.Screen name="Homescreen" component={Homescreen as React.ComponentType<any>} />
                 {/* CalendarTab වෙනම Stack Screen එකක් ලෙස අවශ්‍ය නැත. එය Main Tabs තුළ ඇත */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#D78593',
    }
});

export default App;
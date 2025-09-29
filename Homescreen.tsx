import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Platform,
    Image,
    FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // 🔑 ඔබගේ රූප මාර්ගය අනුව නිවැරදි කරන්න




// ----------------------------------------------------
// 1. TYPES සහ CONSTANTS
// ----------------------------------------------------

// Root Stack Navigator එකේ Types.
type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined; // MainTabs වෙත යොමු කරයි
};

// Tab Navigator එකේ Types (App.tsx වෙතින්)
type TabParamList = {
    HomeTab: undefined;
    ProductsTab: undefined;
    NotesTab: undefined;
};

// Homescreen navigation සඳහා Composite Type එක
type HomescreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<RootStackParamList, 'Main'>,
    NavigationProp<TabParamList, 'HomeTab'>
>;


/**
 * Quick Action Buttons සඳහා Data
 */
const QUICK_ACTIONS = [
    { id: '1', name: 'View Products', icon: 'cube-outline', targetScreen: 'ProductsTab' },
    { id: '2', name: 'Add New', icon: 'plus-circle-outline', targetScreen: 'ProductsTab' },
    { id: '3', name: 'Write Note', icon: 'notebook-outline', targetScreen: 'NotesTab' },
];

/**
 * Home Screen එකේ ප්‍රධාන Dashboard Components හසුරුවයි.
 */
const Homescreen = () => {
    const navigation = useNavigation<HomescreenNavigationProp>();

    // Image paths are relative to the current file
    const backgroundImage = require('./image/img1.jpg');
    const userProfileImage = require('./image/img2.jpg'); // User Profile Image (Placeholder)

    // Quick Action button එකක් එබූ විට ක්‍රියාත්මක වන function එක
    const handleQuickAction = (targetScreen: string) => {
        navigation.navigate(targetScreen as keyof TabParamList);
    };

    // 🔑 Placeholder Expiration Data
    const daysUntilExpire = 7;
    const expiredCount = 2;

    // Logout function
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            // Root Stack (Stack.Navigator) හි Welcome Screen වෙත යොමු කිරීම
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' as any }],
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground source={backgroundImage} style={styles.background}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* ----------------- Header Section (User & Logout) ----------------- */}
                    <View style={styles.header}>
                        <View style={styles.profileContainer}>
                            {/* 🔑 Image Source එක නිවැරදි කර ඇත */}
                            <Image source={userProfileImage} style={styles.profileImage} />
                            <View>
                                <Text style={styles.greetingText}>Hi,</Text>
                                <Text style={styles.userName}>Makeup Lover!</Text>
                            </View>
                        </View>

                        {/* Logout Button */}
                        <TouchableOpacity
                            onPress={handleLogout}
                            style={styles.logoutButton}
                        >
                            <MaterialCommunityIcons name="logout" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* ----------------- Expiration Tracker Card ----------------- */}
                    <View style={[styles.card, styles.expirationCard]}>
                        <MaterialCommunityIcons name="calendar-alert" size={30} color="#E04E4E" />
                        <Text style={styles.cardTitle}>Product Expiration Watch</Text>

                        <View style={styles.alertRow}>
                            <Text style={styles.alertValue}>{daysUntilExpire}</Text>
                            <Text style={styles.alertLabel}>Days left until the next product expires.</Text>
                        </View>

                        <View style={styles.alertRow}>
                            <Text style={[styles.alertValue, { color: '#E04E4E' }]}>{expiredCount}</Text>
                            <Text style={styles.alertLabel}>Total products expired!</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() => handleQuickAction('ProductsTab')}
                        >
                            <Text style={styles.viewButtonText}>View Expiration Details</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ----------------- Quick Actions ----------------- */}
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <FlatList
                        data={QUICK_ACTIONS}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.quickActionButton}
                                onPress={() => handleQuickAction(item.targetScreen as keyof TabParamList)}
                            >
                                <MaterialCommunityIcons name={item.icon as any} size={30} color="#D78593" />
                                <Text style={styles.quickActionText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.quickActionsContainer}
                    />

                    {/* ----------------- Notes Summary Card ----------------- */}
                    <View style={[styles.card, styles.notesCard]}>
                        <Text style={styles.cardTitle}>Your Latest Notes</Text>
                        <MaterialCommunityIcons name="clipboard-text-outline" size={24} color="#5C6BC0" style={{ marginBottom: 10 }} />
                        <Text style={styles.cardText}>
                            මෙහිදී ඔබගේ මෑතම සටහන් (Notes) කිහිපයක් පෙන්වනු ඇත. ඔබගේ අත්දැකීම් ලියා තබන්න.
                        </Text>
                        <TouchableOpacity
                            style={[styles.viewButton, { backgroundColor: '#5C6BC0' }]}
                            onPress={() => handleQuickAction('NotesTab')}
                        >
                            <Text style={styles.viewButtonText}>Go to Notes</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

// ----------------------------------------------------
// 2. STYLES
// ----------------------------------------------------
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        marginTop: Platform.OS === 'android' ? 20 : 0,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    greetingText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '400',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    logoutButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 50,
        borderColor: '#FFF',
        borderWidth: 1,
    },
    // Card Styles
    card: {
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    cardText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    // Expiration Card Specific Styles
    expirationCard: {
        backgroundColor: '#FFF',
        borderLeftWidth: 6,
        borderLeftColor: '#E04E4E', // Red for alert
    },
    alertRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    alertValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#E04E4E',
        marginRight: 10,
        width: 50,
        textAlign: 'right',
    },
    alertLabel: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    // Notes Card Specific Styles
    notesCard: {
        backgroundColor: '#FFF',
        borderLeftWidth: 6,
        borderLeftColor: '#5C6BC0', // Blue for Notes
        flexDirection: 'column',
    },
    // Quick Actions Styles
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 30,
        marginBottom: 15,
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    quickActionsContainer: {
        paddingVertical: 10,
    },
    quickActionButton: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        marginRight: 15,
        height: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    quickActionText: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
        textAlign: 'center',
    },
    // Button Styles
    viewButton: {
        backgroundColor: '#D78593', // Pinkish-brown theme color
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
    },
    viewButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default Homescreen;

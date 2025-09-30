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
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// ----------------------------------------------------
// 1. TYPES සහ CONSTANTS
// ----------------------------------------------------

type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined;
};

type TabParamList = {
    HomeTab: undefined;
    ProductsTab: undefined;
    NotesTab: undefined;
    CalendarTab: undefined;
    WishlistTab: undefined; 
};

type HomescreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<RootStackParamList, 'Main'>,
    NavigationProp<TabParamList, 'HomeTab'>
>;

// 🎨 වර්ණ Palette එක
const COLORS = {
    PrimaryPink: '#D78593', // Theme Pink
    LightPink: '#EADDD7',   // Theme Light Pink
    DarkText: '#4A4947',    // තද පැහැති අකුරු
    White: '#FFFFFF',       // සුදු පැහැය
    Shadow: 'rgba(0, 0, 0, 0.1)', 
    AccentBorder: '#D78593', 
    LogoutButtonBg: 'rgba(255, 255, 255, 0.2)', 
};

/**
 * Quick Action Buttons සඳහා Data
 */
const QUICK_ACTIONS = [
    { id: '1', name: 'View Products', icon: 'cube-outline', targetScreen: 'ProductsTab' },
    { id: '2', name: 'View Calendar', icon: 'calendar-month-outline', targetScreen: 'CalendarTab' }, 
];

const Homescreen = () => {
    const navigation = useNavigation<HomescreenNavigationProp>();

    // 🔑 ඔබගේ රූප මාර්ග නිවැරදි කරන්න
    const backgroundImage = require('./image/img6.jpg'); 
    const userProfileImage = require('./image/img6.jpg'); 

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
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' as any }],
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // ➕ Floating Action Button (FAB) logic
    const handleAddNewItem = () => {
        Alert.alert(
            "නව අයිතමයක් එක් කරන්න",
            "ඔබට කුමක් එක් කිරීමට අවශ්‍යද?",
            [
                { text: "නව නිෂ්පාදනයක් (Product)", onPress: () => navigation.navigate('ProductsTab') },
                { text: "නව සටහනක් (Note)", onPress: () => navigation.navigate('NotesTab') },
                { text: "Wishlist Item එකක්", onPress: () => Alert.alert("Wishlist", "Wishlist Tab එකට navigate කරන්න") }, 
                { text: "අවලංගු කරන්න", style: "cancel" }
            ],
            { cancelable: true }
        );
    };

    // Quick Action Item එක render කිරීමේදී, තිරයේ පළල අනුව විහිදෙන ලෙස සකස් කර ඇත.
    const renderQuickActionItem = ({ item }: { item: typeof QUICK_ACTIONS[0] }) => (
        <TouchableOpacity
            // quickActionTwoColumns style එක භාවිතයෙන් දෙපැත්තට සමබර කරයි
            style={styles.quickActionTwoColumns}
            onPress={() => handleQuickAction(item.targetScreen as keyof TabParamList)}
        >
            <MaterialCommunityIcons name={item.icon as any} size={30} color={COLORS.PrimaryPink} />
            <Text style={styles.quickActionText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground source={backgroundImage} style={styles.background}>
                <View style={styles.darkOverlay} />
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* ----------------- Header Section (Glory & User & Logout) ----------------- */}
                    <View style={styles.header}>
                        <View style={styles.profileContainer}>
                            <Image source={userProfileImage} style={styles.profileImage} />
                            <View>
                                {/* App Name - Glory */}
                                <Text style={styles.appName}>GLORY</Text>
                                {/* User Greeting */}
                                <Text style={styles.greetingText}>Hi, <Text style={styles.userName}>Makeup Lover!</Text></Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                            <MaterialCommunityIcons name="logout" size={24} color={COLORS.White} />
                        </TouchableOpacity>
                    </View>
                    
                    {/* ----------------- 1. Quick Actions (Buttons Two Columns) ----------------- */}
                    <FlatList
                        data={QUICK_ACTIONS}
                        // numColumns: 2 මඟින් දෙපැත්තට සමබර කරයි
                        numColumns={2} 
                        scrollEnabled={false} // තිරය තුළම සවි කිරීමට
                        keyExtractor={(item) => item.id}
                        renderItem={renderQuickActionItem}
                        contentContainerStyle={styles.quickActionsContainerTwoColumns}
                    />


                    {/* ----------------- 2. Expiration Tracker Card ----------------- */}
                    <View style={[styles.card, styles.expirationCard]}>
                        <MaterialCommunityIcons name="calendar-alert" size={30} color={COLORS.PrimaryPink} />
                        <Text style={styles.cardTitle}>Product Expiration Watch</Text>

                        <View style={styles.alertRow}>
                            <Text style={[styles.alertValue, { color: COLORS.PrimaryPink }]}>{daysUntilExpire}</Text>
                            <Text style={styles.alertLabel}>Days left until the next product expires.</Text>
                        </View>

                        <View style={styles.alertRow}>
                            <Text style={[styles.alertValue, { color: COLORS.PrimaryPink }]}>{expiredCount}</Text>
                            <Text style={styles.alertLabel}>Total products expired!</Text>
                        </View>
                    </View>

                    {/* ----------------- 3. Notes Summary Card ----------------- */}
                    <View style={[styles.card, styles.notesCard]}>
                        <Text style={styles.cardTitle}>Notes & Tips</Text>
                        <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={COLORS.PrimaryPink} style={{ marginBottom: 10 }} />
                        <Text style={styles.cardText}>
                            ඔබේ අත්දැකීම් සහ Make-up Hacks සටහන් කර තබන්න.
                        </Text>
                        <TouchableOpacity
                            style={styles.viewButton} 
                            onPress={() => handleQuickAction('NotesTab')}
                        >
                            <Text style={styles.viewButtonText}>Write a New Note</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </ImageBackground>

            {/* ➕ FLOATING ACTION BUTTON (FAB) - Add New Item */}
            <TouchableOpacity
                style={styles.fabButton}
                onPress={handleAddNewItem}
            >
                <MaterialCommunityIcons name="plus" size={30} color={COLORS.White} />
            </TouchableOpacity>

        </SafeAreaView>
    );
};

// ----------------------------------------------------
// 2. STYLES
// ----------------------------------------------------
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.LightPink, 
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)', 
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 80, 
    },
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
        borderColor: COLORS.White,
    },
    // 👑 App Name Style (Glory) - Font size වැඩි කර, විශේෂිත කර ඇත.
    appName: {
        fontSize: 18, 
        fontWeight: '900', // Boldest
        color: COLORS.White,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        letterSpacing: 2, // අකුරු අතර පරතරය
        // 🔑 Custom Font එකක් නැති නිසා, Bold සහ Letter Spacing යොදා ඇත.
    },
    // User Greeting Style
    greetingText: {
        fontSize: 14,
        color: COLORS.White,
        fontWeight: '400',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginTop: 2, // Glory යටින් පෙනීමට
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    logoutButton: {
        padding: 8,
        backgroundColor: COLORS.LogoutButtonBg,
        borderRadius: 50,
        borderColor: COLORS.White,
        borderWidth: 1,
    },
    // Card Styles (Common)
    card: {
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        backgroundColor: COLORS.White, 
        shadowColor: COLORS.Shadow,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.DarkText,
        marginBottom: 5,
    },
    cardText: {
        fontSize: 14,
        color: COLORS.DarkText,
        marginBottom: 15,
    },
    expirationCard: {
        borderLeftWidth: 6,
        borderLeftColor: COLORS.PrimaryPink, 
    },
    alertRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    alertValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.PrimaryPink, 
        marginRight: 10,
        width: 50,
        textAlign: 'right',
    },
    alertLabel: {
        fontSize: 16,
        color: COLORS.DarkText,
        flex: 1,
    },
    notesCard: {
        borderLeftWidth: 6,
        borderLeftColor: COLORS.PrimaryPink, 
        flexDirection: 'column',
    },
    // Quick Actions Styles (Two Columns)
    quickActionsContainerTwoColumns: {
        paddingVertical: 10,
        marginTop: 15, 
        justifyContent: 'space-between', // බොත්තම් අතර ඉඩ පාලනය කරයි
    },
    quickActionTwoColumns: {
        backgroundColor: COLORS.White,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        // තිරයේ පළලෙන් 50% ට වඩා ටිකක් අඩු කර, margin එකෙන් ඉතිරි ඉඩ පුරවයි.
        width: '48%', 
        marginVertical: 5, // ඉහළ සහ පහළ margin
        marginRight: '4%', // දකුණු margin (දෙවෙනි බොත්තම සඳහා මෙය override වේ)
        // පළමු column එකේ margin-right: 4% ක් ද, දෙවෙනි column එකේ 0 ක් ද තැබීමට අමතර logic එකක් අවශ්‍ය වේ.
        // සරලව තැබීමට, marginHorizontal යොදා, container එකේ justify space between කරයි.
        marginHorizontal: '1%', 
        height: 100,
        shadowColor: COLORS.Shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    quickActionText: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.DarkText,
        textAlign: 'center',
    },
    // Common Button Styles
    viewButton: {
        backgroundColor: COLORS.PrimaryPink, 
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
    },
    viewButtonText: {
        color: COLORS.White,
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Floating Action Button (FAB) Styles
    fabButton: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 30 : 20, 
        right: 20,
        backgroundColor: COLORS.PrimaryPink, 
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.PrimaryPink, 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
});

export default Homescreen;
import React, { useState, useEffect, useCallback } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    Alert,
    Platform,
    ImageBackground,
} from 'react-native';
import { Agenda, DateData, AgendaEntry as RNCAgendaEntry, AgendaSchedule } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// 🎨 වර්ණ Palette එක (Glory App Theme)
const COLORS = {
    PrimaryPink: '#D78593', 
    LightPink: '#EADDD7',   
    DarkText: '#4A4947',    
    White: '#FFFFFF',       
    Shadow: 'rgba(0, 0, 0, 0.15)', 
    DarkOverlay: 'rgba(0, 0, 0, 0.25)', 
    CalendarHeader: 'rgba(255, 255, 255, 0.95)', // Calendar Header/Strip Background
    ItemBg: 'rgba(255, 255, 255, 0.85)', // Task Item Background (Semi-transparent White)
    PastDate: '#A9A9A9', // Grey for past dates
};

// 🖼️ පසුබිම් රූපය (අවශ්‍ය නම්, පෙර Notes Screen එකේ රූපයම භාවිත කළ හැක)
const BACKGROUND_IMAGE = require('./image/img7.jpg'); 

// 📅 Custom AgendaEntry type to include dotColor
type MyAgendaEntry = RNCAgendaEntry & { dotColor?: string };
type MyAgendaSchedule = { [key: string]: MyAgendaEntry[] };

const DUMMY_ITEMS: MyAgendaSchedule = {
    '2025-10-01': [
        { name: 'Buy Pink Lipstick & Mascara', height: 60, day: '2025-10-01', dotColor: COLORS.PrimaryPink },
        { name: 'Makeup Tutorial: Smokey Eye', height: 80, day: '2025-10-01', dotColor: COLORS.PrimaryPink },
    ],
    '2025-10-07': [
        { name: 'Check Product Expiration (Toner)', height: 60, day: '2025-10-07', dotColor: 'red' },
    ],
    '2025-10-15': [
        { name: 'Plan Skincare Routine for Autumn 🍂', height: 60, day: '2025-10-15', dotColor: COLORS.DarkText },
    ],
};

const CalendarScreen = () => {
    const [items, setItems] = useState<MyAgendaSchedule>(DUMMY_ITEMS);
    
    // ➕ Add New Event Logic
    const handleAddEvent = () => {
        Alert.alert(
            "නව සිදුවීමක්",
            "මෙතනින් ඔබට Calendar එකට නව event එකක්/task එකක් එකතු කළ හැකියි.",
            [{ text: "හරි" }]
        );
    };

    // 🗓️ Item Render Function
    const renderItem = (item: MyAgendaEntry, firstItemInDay: boolean) => {
        return (
            <TouchableOpacity 
                style={styles.item}
                onPress={() => Alert.alert('Event Details', item.name)}
            >
                <View style={[styles.dot, { backgroundColor: item.dotColor || COLORS.PrimaryPink }]} />
                <Text style={styles.itemText}>{item.name}</Text>
                <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={24} 
                    color={COLORS.DarkText} 
                    style={{ opacity: 0.5 }}
                />
            </TouchableOpacity>
        );
    };

    // ⛔ Empty Date Slot Render
    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text style={styles.emptyDateText}>🎉 You're free today! 🎉</Text>
                <Text style={styles.emptyDateSubText}>Enjoy your day or add a new task.</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground 
                source={BACKGROUND_IMAGE}
                style={styles.background}
                blurRadius={10} 
            >
                <View style={styles.darkOverlay} />
                
                {/* TOP TOOLBAR - Cute Title and FAB */}
                <View style={styles.topToolbar}>
                    <Text style={styles.toolbarTitle}>🎀 Glory Calendar</Text>
                </View>

                <Agenda
                    items={items}
                    loadItemsForMonth={(month) => {
                        console.log('Load items for month:', month);
                        // 🔑 මෙතනදී API එකකින් එම මාසයට අදාළ දත්ත Load කළ යුතුය
                        // දැනට DUMMY_ITEMS ම භාවිතා කරයි
                    }}
                    selected={new Date().toISOString().split('T')[0]} // වර්තමාන දිනය
                    renderItem={renderItem}
                    renderEmptyDate={renderEmptyDate}
                    
                    // 💅 Design Customizations
                    theme={{
                        agendaDayTextColor: COLORS.PrimaryPink,
                        agendaDayNumColor: COLORS.PrimaryPink,
                        agendaTodayColor: COLORS.PrimaryPink,
                        agendaKnobColor: COLORS.PrimaryPink, // Pull-down knob color
                        selectedDayBackgroundColor: COLORS.PrimaryPink, // Selected Date Background
                        dotColor: COLORS.PrimaryPink,
                        selectedDotColor: COLORS.White,
                        // Calendar Day Text/Background
                        dayTextColor: COLORS.DarkText, 
                        textDisabledColor: COLORS.PastDate, 
                        
                        // Agenda List Background
                        backgroundColor: 'transparent', // Make Agenda background transparent to see the image

                    }}
                    
                    // Calendar Strip (List) Custom Style
                    calendarStyle={{ 
                        backgroundColor: COLORS.CalendarHeader, 
                        borderBottomLeftRadius: 20, 
                        borderBottomRightRadius: 20,
                        overflow: 'hidden',
                        paddingBottom: 5,
                    }}
                    
                    // Reservation list style (Scroll view එකේ background)
                    // මෙම style එක Agenda component එක තුළින් override කිරීම අපහසු බැවින්,
                    // item.backgroundColor: 'transparent' යොදා ඇත.
                />

            </ImageBackground>
            
            {/* ➕ FLOATING ACTION BUTTON (FAB) - Add New Task */}
            <TouchableOpacity 
                style={styles.fabButton} 
                onPress={handleAddEvent}
            >
                <Feather name="plus" size={30} color={COLORS.White} />
            </TouchableOpacity>

        </SafeAreaView>
    );
};

// 💅 Styling (CSS)
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.LightPink,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.DarkOverlay, 
    },
    // ------------------------------------
    // TOP TOOLBAR
    // ------------------------------------
    topToolbar: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    toolbarTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.White,
        textShadowColor: 'rgba(0, 0, 0, 0.7)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        paddingVertical: 10,
        letterSpacing: 1.5,
    },
    // ------------------------------------
    // AGENDA ITEM STYLES
    // ------------------------------------
    item: {
        backgroundColor: COLORS.ItemBg, // Semi-transparent white
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15, // වටකුරු දාර
        padding: 15,
        marginRight: 15,
        marginTop: 17,
        shadowColor: COLORS.Shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.PrimaryPink, // Pink Accent
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.DarkText,
        fontWeight: '600',
    },
    emptyDate: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
    },
    emptyDateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.White,
        marginBottom: 5,
    },
    emptyDateSubText: {
        fontSize: 14,
        color: COLORS.LightPink,
    },
    // ------------------------------------
    // FLOATING ACTION BUTTON (FAB)
    // ------------------------------------
    fabButton: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 30, 
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

export default CalendarScreen;
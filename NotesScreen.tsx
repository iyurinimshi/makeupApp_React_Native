import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    TextInput, 
    Text, 
    TouchableOpacity, 
    ImageBackground, 
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ImageSourcePropType,
    Alert, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// 🌟 Icon Library එක
import { Feather } from '@expo/vector-icons';

// 🎨 වර්ණ Palette එක
const COLORS = {
    SoftCream: '#FFF8F3', // ප්‍රධාන පසුබිම
    PaperWhite: '#FFFFFF', // අලුතින් එක් කළ White Font Color
    SoftCharcoal: '#4A4947', // තද පැහැය (Accent Background)
    DustyRose: '#EADDD7', // Subtle Accent Color
    MutedSand: '#D1C0B5', // Placeholder Text (White Background එකේදී)
    DarkOverlay: 'rgba(0, 0, 0, 0.25)', // Blur Image එක උඩින් දාන Darker Overlay එක
};

// 🖼️ ඔබේ පින්තූරය මෙතනට දමන්න
const USER_BACKGROUND_IMAGE: ImageSourcePropType = require('./image/img7.jpg'); 

const NotesScreen = () => {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');

    // 💾 Save Button Logic
    const handleSave = () => {
        if (!noteTitle.trim() && !noteContent.trim()) {
            Alert.alert('හිස් සටහනක්', 'කරුණාකර මාතෘකාවක් හෝ අන්තර්ගතයක් එක් කරන්න.');
            return;
        }
        
        // සටහන සාර්ථකව සුරැකූ බවට දැනුම් දීම
        Alert.alert('සාර්ථකයි! 🎉', 'ඔබගේ සටහන සාර්ථකව සුරැකිණි.', [
            { text: 'හරි', onPress: () => {
                setNoteTitle('');
                setNoteContent('');
            }},
        ]);
    };

    // 📅 Calendar Button Logic (උදාහරණයක්)
    const handleCalendar = () => {
        Alert.alert('දින දර්ශනය', 'දින දර්ශන view එක මෙතනින් විවෘත වේ.');
    };

    // 📚 View All Notes Logic (උදාහරණයක්)
    const handleViewAllNotes = () => {
        Alert.alert('සියලුම සටහන්', 'පැරණි සටහන් ලැයිස්තුව මෙතනින් විවෘත වේ.');
    };

    // ➕ New Note Button Logic (උදාහරණයක්)
    const handleNewNote = () => {
         Alert.alert('අලුත් සටහනක්', 'වර්තමාන සටහන ඉවත දමා අලුත් සටහනක් පටන් ගනී.');
         setNoteTitle('');
         setNoteContent('');
    };


    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            
            {/* 1. BLURRED BACKGROUND LAYER */}
            <ImageBackground 
                source={USER_BACKGROUND_IMAGE}
                style={styles.backgroundImage}
                blurRadius={10} 
                resizeMode="cover"
            >
                {/* Image එකේ අඳුරු ස්වභාවය වැඩි කිරීමට Overlay එකක් */}
                <View style={styles.darkOverlay} />
                
                {/* 2. TOOLBAR ICONS - තිරයේ උඩ කොටස */}
                <View style={styles.topToolbar}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleNewNote}>
                        <Feather name="file-plus" size={26} color={COLORS.PaperWhite} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handleCalendar}>
                        <Feather name="calendar" size={26} color={COLORS.PaperWhite} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handleViewAllNotes}>
                        <Feather name="menu" size={26} color={COLORS.PaperWhite} />
                    </TouchableOpacity>
                </View>

                {/* 3. INPUT AREA - අකුරු ඇතුළු කරන තැන */}
                <View style={styles.inputAreaWrapper}>
                    <KeyboardAvoidingView
                        style={styles.contentWrapper}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                    >
                        <ScrollView 
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            
                            {/* ✒️ Note Title Input */}
                            <TextInput
                                style={styles.titleInput}
                                placeholder="සටහනේ මාතෘකාව..."
                                placeholderTextColor={COLORS.PaperWhite} // සුදු අකුරු
                                value={noteTitle}
                                onChangeText={setNoteTitle}
                            />
                            
                            <View style={styles.separator} />

                            <TextInput
                                style={styles.contentInput}
                                placeholder="ඔබේ අදහස් මෙතන සටහන් කරන්න..."
                                placeholderTextColor={COLORS.PaperWhite} // සුදු අකුරු
                                multiline
                                textAlignVertical="top" 
                                value={noteContent}
                                onChangeText={setNoteContent}
                            />
                        </ScrollView>
                        
                    </KeyboardAvoidingView>
                </View>

            </ImageBackground>
             {/* 📌 SAVE BUTTON (Floating Action Button - FAB) - තිරයේ පහළ කෙළවර */}
            <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
            >
                <Text style={styles.saveButtonText}>SAVE</Text>
                <Feather name="save" size={20} color={COLORS.PaperWhite} style={{marginLeft: 5}}/>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

// 💅 Styling (CSS)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.SoftCream,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingHorizontal: 20, // Input Area සහ Toolbar එක සඳහා
    },
    // Darker Overlay එක. White Font කැපී පෙනීමට
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // 30% කළු පැහැති Overlay එකක්
    },
    // ------------------------------------
    // TOP TOOLBAR
    // ------------------------------------
    topToolbar: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Icons දකුණු පැත්තට
        alignItems: 'center',
        paddingTop: 10,
        marginBottom: 20,
    },
    iconButton: {
        marginLeft: 25, // Icons අතර දුර
        padding: 5,
    },
    // ------------------------------------
    // INPUT AREA
    // ------------------------------------
    inputAreaWrapper: {
        flex: 1,
        // Blurred Background එක උඩින් තිබුණත් input area එකට සුළු blur effect එකක් දෙන්න පුළුවන්
        // ඒත් White text නිසා එය Black Overlay එක මත හොඳට පෙනේ
    },
    contentWrapper: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100, // FAB එකට ඉහළින් ඉඩ තැබීමට
    },
    titleInput: {
        fontSize: 28, 
        fontWeight: '700', 
        color: COLORS.PaperWhite, // සුදු අකුරු
        paddingBottom: 10,
    },
    separator: {
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // සුදු පැහැති විනිවිද පෙනෙන රේඛාවක්
        width: '40%', 
        marginBottom: 30,
        borderRadius: 1.5,
    },
    contentInput: {
        flex: 1,
        fontSize: 17,
        color: COLORS.PaperWhite, // සුදු අකුරු
        lineHeight: 26,
        paddingTop: 0,
    },
    // ------------------------------------
    // FLOATING ACTION BUTTON (FAB)
    // ------------------------------------
    saveButton: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 30, 
        right: 20, 
        backgroundColor: COLORS.SoftCharcoal, 
        flexDirection: 'row', // Text සහ Icon එක ළඟ තැබීමට
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8, 
        shadowColor: COLORS.SoftCharcoal, 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    saveButtonText: {
        color: COLORS.PaperWhite,
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default NotesScreen;
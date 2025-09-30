import React, { useState, useEffect } from 'react';
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
import { Feather } from '@expo/vector-icons'; // Calendar icon
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Delete icon, Save icon
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🎨 වර්ණ Palette එක
const COLORS = {
    PrimaryPink: '#D78593', 
    LightPink: '#EADDD7',   
    DarkText: '#4A4947',    
    White: '#FFFFFF',       
    Shadow: 'rgba(0, 0, 0, 0.1)', 
    DarkOverlay: 'rgba(0, 0, 0, 0.4)', 
    CardBg: 'rgba(255, 255, 255, 0.95)', 
};

// 🖼️ ඔබේ පින්තූරය මෙතනට දමන්න
const USER_BACKGROUND_IMAGE: ImageSourcePropType = require('./image/img7.jpg'); 

// 📝 Note Type එක
interface Note {
    id: number;
    title: string;
    content: string;
    date: string;
    emoji: string; 
}

// 💾 AsyncStorage Key
const NOTES_STORAGE_KEY = '@glory_user_notes';
const MAX_NOTES = 3; 

// 🌟 Random Emojis
const EMOJIS = ['🌸', '✨', '💖', '💫', '💄', '💅', '🎀', '💎', '🍓', '🥂'];

const NotesScreen = () => {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [savedNotes, setSavedNotes] = useState<Note[]>([]);

    // Load Notes from Storage
    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
            if (jsonValue !== null) {
                setSavedNotes(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error("Error loading notes:", e);
        }
    };

    // Save Notes to Storage (and handle limit)
    const saveNotesToStorage = async (notes: Note[]) => {
        try {
            const jsonValue = JSON.stringify(notes);
            await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue);
            setSavedNotes(notes);
        } catch (e) {
            console.error("Error saving notes to storage:", e);
        }
    };

    // 💾 Save Button Logic (FAB)
    const handleSave = async () => {
        if (!noteTitle.trim() && !noteContent.trim()) {
            Alert.alert('හිස් සටහනක්', 'කරුණාකර මාතෘකාවක් හෝ අන්තර්ගතයක් එක් කරන්න.');
            return;
        }
        
        const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

        const newNote: Note = {
            id: Date.now(),
            title: noteTitle.trim() || "මාතෘකාවක් නැත",
            content: noteContent.trim(),
            date: new Date().toLocaleDateString('si-LK', { year: 'numeric', month: 'short', day: 'numeric' }),
            emoji: randomEmoji,
        };

        let updatedNotes = [newNote, ...savedNotes];

        if (updatedNotes.length > MAX_NOTES) {
            updatedNotes = updatedNotes.slice(0, MAX_NOTES); 
        }

        await saveNotesToStorage(updatedNotes);

        setNoteTitle('');
        setNoteContent('');

        Alert.alert('සාර්ථකයි! 🎉', 'ඔබගේ සටහන සාර්ථකව සුරැකිණි.', [{ text: 'හරි' }]);
    };

    // Note Delete Logic
    const handleDeleteNote = async (id: number) => {
        Alert.alert(
            "සටහන මකන්නද?",
            "මෙම සටහන ස්ථිරවම ඉවත් කිරීමට ඔබට අවශ්‍යද?",
            [
                { text: "අවලංගු කරන්න", style: "cancel" },
                { text: "මකන්න", style: "destructive", onPress: async () => {
                    const filteredNotes = savedNotes.filter(note => note.id !== id);
                    await saveNotesToStorage(filteredNotes);
                }}
            ]
        );
    };

    // Calendar Button Logic
    const handleCalendar = () => {
        Alert.alert('දින දර්ශනය', 'Calendar Tab එකට navigate කරන්න');
    };

    // ----------------------------------------------------
    // RENDER FUNCTIONS
    // ----------------------------------------------------

    const renderSavedNote = (note: Note) => (
        <View key={note.id} style={styles.noteCard}>
            <View style={styles.noteCardHeader}>
                <Text style={styles.noteEmoji}>{note.emoji}</Text>
                <Text style={styles.noteCardTitle} numberOfLines={1}>{note.title}</Text>
                <TouchableOpacity onPress={() => handleDeleteNote(note.id)} style={styles.deleteIconContainer}>
                    <MaterialCommunityIcons name="close-circle-outline" size={20} color={COLORS.DarkText} />
                </TouchableOpacity>
            </View>
            <Text style={styles.noteCardContent} numberOfLines={2}>{note.content}</Text>
            <Text style={styles.noteCardDate}>{note.date}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            
            <ImageBackground 
                source={USER_BACKGROUND_IMAGE}
                style={styles.backgroundImage}
                blurRadius={10} 
                resizeMode="cover" 
            >
                <View style={styles.darkOverlay} />
                
                {/* 2. TOOLBAR - (Glory Notes Title & Calendar Icon) */}
                <View style={styles.topToolbar}>
                    {/* Left Icon (Calendar) */}
                    <TouchableOpacity style={styles.iconButton} onPress={handleCalendar}>
                        <Feather name="calendar" size={26} color={COLORS.White} />
                    </TouchableOpacity>

                    {/* Toolbar Title */}
                    <Text style={styles.toolbarTitle}>Glory Notes</Text>

                    {/* Right side is now empty to balance the title */}
                    <View style={styles.emptySpace} /> 
                </View>

                {/* 3. INPUT AREA & SAVED NOTES */}
                <KeyboardAvoidingView
                    style={styles.contentWrapper}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                >
                    <ScrollView 
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        
                        {/* CURRENT NOTE INPUTS */}
                        <View style={styles.currentNoteSection}>
                            <Text style={styles.sectionHeading}>✍️ New Note</Text>
                            <TextInput
                                style={styles.titleInput}
                                placeholder="සටහනේ මාතෘකාව..."
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                value={noteTitle}
                                onChangeText={setNoteTitle}
                            />
                            
                            <View style={styles.separator} />

                            <TextInput
                                style={styles.contentInput}
                                placeholder="ඔබේ අදහස් මෙතන සටහන් කරන්න..."
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                multiline
                                textAlignVertical="top" 
                                value={noteContent}
                                onChangeText={setNoteContent}
                            />
                        </View>

                        {/* SAVED NOTES PREVIEW (Maximum 3) */}
                        <View style={styles.savedNotesSection}>
                            <Text style={styles.sectionHeading}>📝 Your Recent Notes ({savedNotes.length}/{MAX_NOTES})</Text>
                            {savedNotes.length > 0 ? (
                                savedNotes.map(renderSavedNote)
                            ) : (
                                <Text style={styles.noNotesText}>තවම කිසිම සටහනක් නැත.</Text>
                            )}
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>

            </ImageBackground>
            
            {/* 💾 FLOATING ACTION BUTTON (FAB) - SAVE NEW NOTE */}
            <TouchableOpacity 
                style={styles.fabButton} 
                onPress={handleSave}
            >
                {/* Save Icon එක භාවිතයට ගෙන ඇත */}
                <MaterialCommunityIcons name="content-save-outline" size={30} color={COLORS.White} />
            </TouchableOpacity>

        </SafeAreaView>
    );
};

// 💅 Styling (CSS)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.LightPink,
    },
    backgroundImage: {
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
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20, 
        marginBottom: 10,
    },
    toolbarTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.White,
        textShadowColor: 'rgba(0, 0, 0, 0.7)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    iconButton: {
        padding: 5,
    },
    emptySpace: {
        width: 36, // Calendar icon එකට සමාන ඉඩක්
        height: 26, 
    },
    // ------------------------------------
    // INPUT AREA & SCROLL CONTENT
    // ------------------------------------
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 20, 
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40, 
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.White,
        marginBottom: 15,
        marginTop: 15,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    currentNoteSection: {
        flex: 1,
        minHeight: 200, 
        marginBottom: 20,
    },
    titleInput: {
        fontSize: 26, 
        fontWeight: '700', 
        color: COLORS.White, 
        paddingBottom: 5,
    },
    separator: {
        height: 3,
        backgroundColor: COLORS.PrimaryPink, 
        width: '30%', 
        marginBottom: 20,
        borderRadius: 1.5,
    },
    contentInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.White, 
        lineHeight: 24,
        paddingTop: 0,
    },
    // ------------------------------------
    // SAVED NOTES PREVIEW
    // ------------------------------------
    savedNotesSection: {
        marginTop: 10,
    },
    noteCard: {
        backgroundColor: COLORS.CardBg, 
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.PrimaryPink, 
        shadowColor: COLORS.Shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    noteCardHeader: {
        flexDirection: 'row',
        alignItems: 'center', 
        marginBottom: 5,
    },
    noteEmoji: {
        fontSize: 18,
        marginRight: 10,
    },
    noteCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.DarkText,
        flex: 1, 
    },
    deleteIconContainer: {
        marginLeft: 10, 
        padding: 5, 
    },
    noteCardContent: {
        fontSize: 14,
        color: COLORS.DarkText,
        marginBottom: 5,
    },
    noteCardDate: {
        fontSize: 12,
        color: COLORS.DarkText,
        opacity: 0.7,
        textAlign: 'right',
    },
    noNotesText: {
        color: COLORS.White,
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        opacity: 0.8,
    },
    // ------------------------------------
    // FLOATING ACTION BUTTON (FAB) - SAVE ICON
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

export default NotesScreen;
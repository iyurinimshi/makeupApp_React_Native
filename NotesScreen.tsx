import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';

const NotesScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.header}>Beauty Notes</Text>
                <Text style={styles.text}>
                    මෙහිදී ඔබට නව සටහන් (New Notes) එක් කිරීමට සහ දැනට පවතින සමාලෝචන (Reviews) කළමනාකරණය කිරීමට පුළුවනි.
                </Text>
            </View>
      
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        // Homescreen හි ඇති Notes Card එකේ තේමා වර්ණයට ගැලපේ
        color: '#5C6BC0', 
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 10,
    }
});

export default NotesScreen;

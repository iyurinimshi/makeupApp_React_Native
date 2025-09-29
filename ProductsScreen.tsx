import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';

const ProductsScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.header}>Product Inventory</Text>
                <Text style={styles.text}>
                    මෙහිදී ඔබගේ සියලුම රූපලාවණ්‍ය නිෂ්පාදන ලැයිස්තුගත කර, ඒවායේ කල් ඉකුත් වන දින (Expiration Dates) නිරීක්ෂණය කළ හැකියි.
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
        // Homescreen හි ඇති Expiration Card එකේ තේමා වර්ණය
        color: '#E04E4E', 
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 10,
    }
});

export default ProductsScreen;

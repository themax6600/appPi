import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, } from 'react-native'

import sesc from '../../assets/img/sescsenac.png'
import { supabase } from '../../utils/supabase'
import { useState } from 'react'

export default function Produtos({ navigation }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Misto quente</Text>
            <Text style={styles.price}>R$5,00</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Comprar</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFC400',
        borderRadius: 20,
        padding: 10,
        width: 160,
        alignItems: 'center',
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: 130,
        height: 130,
        borderRadius: 20,
        marginBottom: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 2,
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 40,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
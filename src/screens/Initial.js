import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

import sesc from '../../assets/img/sesc-senac-01 1.png'
import pao from '../../assets/img/pao.png'

export default function Initial({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.imgCampo}>
                <Image style={styles.img} source={sesc} />
                <Text style={styles.titulo}>Lanchonete Sesc Senac</Text>
            </View>
            <View style={styles.btns}>
                <TouchableOpacity
                    style={styles.btn1}
                    onPress={() => navigation.navigate("CriarConta")}
                >
                    <Text style={styles.text}>Criar conta</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn1}
                    onPress={() => navigation.navigate("Logar")}
                >
                    <Text style={styles.text}>Já tenho conta</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Image style={styles.img2} source={pao} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#002D85',
        flex: 1,
        justifyContent: 'space-between',
    },
    img: {
        backgroundColor: 'white',
        borderRadius: 20,
    },
    imgCampo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    titulo:{
        color: 'white',
        fontSize: 30,
        marginTop: 10,
    },
    btns:{
        display: 'flex',
        alignItems: 'center',
    },
    btn1: {
        backgroundColor: '#FFC400',
        width: 300,
        borderRadius: 20,
        padding: 10,
        marginTop: 25,
    },
    text: {
        textAlign: 'center',
        fontSize: 22,
        color: "#111",
        fontWeight: 'bold',
    },
});
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native'

import sesc from '../../assets/img/sescsenac.png'

export default function CriarConta({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.imgCampo}>
                <Image style={styles.img} source={sesc} />
                <Text style={styles.titulo}>Lanchonete Sesc Senac</Text>
            </View>
            <View style={styles.inputs}>
                <Text style={styles.text1}>Nome</Text>
                <TextInput placeholder='Nome' style={styles.input}/>
                <Text style={styles.text1}>E-mail</Text>
                <TextInput placeholder='Ex.: aluno@email.com' style={styles.input}/>
                <Text style={styles.text1}>Senha</Text>
                <TextInput placeholder='******' style={styles.input}/>
            </View>
            <View style={styles.btns}>
                <TouchableOpacity
                    style={styles.btn1}
                    onPress={() => navigation.navigate("TabNavigator")}
                >
                    <Text style={styles.text}>Criar Conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#002D85',
        flex: 1,
        justifyContent: 'space-around',
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
    inputs:{
        marginLeft: 30,
        marginRight: 30,
    },
    input:{
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        height: 50,
        marginBottom: 15,
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
        marginBottom: 150,
    },
    text: {
        textAlign: 'center',
        fontSize: 22,
        color: "#111",
        fontWeight: 'bold',
    },
    text1:{
        color: 'white',
        fontSize: 30,
    }
});
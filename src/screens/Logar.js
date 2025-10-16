import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, } from 'react-native'

import sesc from '../../assets/img/sescsenac.png'
import { supabase } from '../../utils/supabase'
import { useState } from 'react'

export default function Logar({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function signInWithEmail() {
        setLoading(true)

        if (!email || !password) {
            Alert.alert('Preencha todos os campos.')
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
        })

        if (error) {
            if (error.message.toLowerCase().includes('invalid login credentials')) {
                Alert.alert('E-mail ou senha incorretos.')
            } else {
                Alert.alert(error.message)
            }
        } else {
            navigation.replace('TabNavigator')
        }

        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.imgCampo}>
                <Image style={styles.img} source={sesc} />
                <Text style={styles.titulo}>Lanchonete Sesc Senac</Text>
            </View>

            <View style={styles.inputs}>
                <Text style={styles.text1}>E-mail</Text>
                <TextInput
                    placeholder='Ex.: aluno@email.com'
                    onChangeText={setEmail}
                    value={email}
                    style={styles.input}
                    keyboardType='email-address'
                    autoCapitalize='none'
                />
                <Text style={styles.text1}>Senha</Text>
                <TextInput
                    placeholder='******'
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                    style={styles.input}
                />
            </View>

            <View style={styles.btns}>
                <TouchableOpacity
                    style={styles.btn1}
                    disabled={loading || !email || !password}
                    onPress={signInWithEmail}
                >
                    {
                        loading
                            ? <ActivityIndicator color="#111" />
                            : <Text style={styles.text}>Logar</Text>
                    }
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
    titulo: {
        color: 'white',
        fontSize: 30,
        marginTop: 10,
    },
    btns: {
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
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 22,
        color: "#111",
        fontWeight: 'bold',
    },
    text1: {
        color: 'white',
        fontSize: 30,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        height: 50,
        marginBottom: 15,
    },
    inputs: {
        marginLeft: 30,
        marginRight: 30,
    },
})

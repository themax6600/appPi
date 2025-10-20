import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native'

import { supabase } from '../../utils/supabase'
import { useState, useEffect } from 'react'

export default function Produtos({ navigation }) {
    const [produtos, setProdutos] = useState([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        buscarProdutos()
    }, [])

    async function buscarProdutos() {
        const { data, error } = await supabase
            .from('produto')
            .select('nome_produto, preco')

        if (error) {
            console.error('Erro ao buscar produtos:', error)
        } else {
            setProdutos(data)
        }

        setCarregando(false)
    }

    async function fazerPedido(produto) {
    const { data, error } = await supabase
        .from('itens_pedido')
        .insert([
            {
                nome_produto: produto.nome_produto,
                preco: produto.preco,
            }
        ])

    if (error) {
        console.error('Erro ao fazer pedido:', error)
        alert('Erro ao fazer pedido!')
    } else {
        alert(`Pedido de "${produto.nome_produto}" feito com sucesso!`)
    }
}


    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.nome_produto}</Text>
            <Text style={styles.price}>R${item.preco.toFixed(2)}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => fazerPedido(item)}
            >
                <Text style={styles.buttonText}>Comprar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Descrição</Text>
            </TouchableOpacity>
        </View>
    )

    if (carregando) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FFC400" />
                <Text>Carregando produtos...</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={produtos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 20 }}
        />
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFC400',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        width: '100%',
        alignSelf: 'center',
        marginVertical: 10,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -50 },
        shadowOpacity: 0.35,
        shadowRadius: 36,
        elevation: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
})

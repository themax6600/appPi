import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native'

import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'

import seta from "../../assets/img/seta.png"

export default function Notificacoes({ navigation }) {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarPedidos()
  }, [])

  async function buscarPedidos() {
    const { data, error } = await supabase
      .from('pedido')
      .select('nome_produto, preco')

    if (error) {
      console.error('Erro ao buscar pedidos:', error)
    } else {
      setPedidos(data)
    }

    setCarregando(false)
  }

  const renderItem = ({ item }) => (
    <View style={styles.pedidoItem}>
      <Text style={styles.pedidoNome}>{item.nome_produto}</Text>
      <Text style={styles.pedidoPreco}>R$ {item.preco.toFixed(2)}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={seta}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.title}>Meus Pedidos</Text>

        {carregando ? (
          <ActivityIndicator size="large" color="#004799" style={{ marginTop: 40 }} />
        ) : pedidos.length === 0 ? (
          <>
            <Text style={styles.subText}>Sem pedidos pendentes</Text>
            <Text style={styles.sadFace}>:(</Text>
          </>
        ) : (
          <FlatList
            data={pedidos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ marginTop: 20 }}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: 50,
    height: 50,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subText: {
    fontSize: 16,
    color: '#004799',
    marginTop: 30,
  },
  sadFace: {
    fontSize: 24,
    color: '#004799',
    marginTop: 5,
  },
  pedidoItem: {
    backgroundColor: '#FFC400',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '90%',
    alignSelf: 'center',
  },
  pedidoNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pedidoPreco: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
})

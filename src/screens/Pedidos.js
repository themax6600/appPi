import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../../utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function PedidosScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useFocusEffect(
  useCallback(() => {
    buscarPedidos();
  }, [])
);


  const buscarPedidos = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: pedidosData, error } = await supabase
      .from('pedido')
      .select('*')
      .eq('id_user_cliente', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pedidos:', error);
      setLoading(false);
      return;
    }

    const pedidosComItens = await Promise.all(
      pedidosData.map(async (pedido) => {
        const { data: itens, error: erroItens } = await supabase
          .from('itens_pedido')
          .select(`
            id_produto,
            quantidade,
            produto!fk_itens_pedido_id_produto(
              nome_produto,
              image,
              preco
            )
          `)
          .eq('id_pedido', pedido.id_pedido);

        if (erroItens) {
          console.error('Erro ao buscar itens do pedido', pedido.id_pedido, ':', erroItens);
          return { ...pedido, itens: [] };
        }

        return { ...pedido, itens };
      })
    );

    setPedidos(pedidosComItens);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFCC00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos Recentes</Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id_pedido.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.status}>
                Seu pedido está {item.status_pedido?.toLowerCase()} - R${item.preco_total}
              </Text>
              <TouchableOpacity onPress={() => setExpanded(expanded === item.id_pedido ? null : item.id_pedido)}>
                <Ionicons
                  name={expanded === item.id_pedido ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={26}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            {expanded === item.id_pedido && (
              <View style={styles.itemsContainer}>
                {item.itens?.length > 0 ? (
                  item.itens.map((i, index) => (
                    <View key={index} style={styles.itemCard}>
                      <Image
                        source={{ uri: i.produto?.image }}
                        style={styles.itemImage}
                      />
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{i.produto?.nome_produto}</Text>
                        <Text style={styles.itemQuantity}>Qtd: {i.quantidade}</Text>
                        <Text style={styles.itemPrice}>R$ {i.produto?.preco}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Produtos")}>
                          <Text style={styles.buttonText}>Ver produto</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={{ textAlign: 'center', color: '#555' }}>Nenhum item encontrado.</Text>
                )}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#3b3b3b',
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    color: '#fff',
    fontSize: 16,
  },
  itemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginTop: 12,
    padding: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 13,
    color: '#222',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#FFCC00',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

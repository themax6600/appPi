import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

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

  // Função para definir a cor do card de acordo com o status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'cancelado':
        return '#FF4D4D'; // vermelho
      case 'em preparo':
        return '#FFCC00'; // amarelo
      case 'entregue':
        return '#00C851'; // verde
      case 'pendente':
      default:
        return '#1f1f1f'; // preto
    }
  };

  // Função para definir a mensagem do pedido
  const getStatusMessage = (status) => {
    switch (status.toLowerCase()) {
      case 'cancelado':
        return 'Esse pedido foi cancelado';
      case 'em preparo':
        return 'Pedido em preparo';
      case 'entregue':
        return 'Pedido entregue';
      case 'pendente':
      default:
        return 'Pedido pendente';
    }
  };

  // Função para definir o nome da lanchonete
  const getLanchoneteName = (id) => {
    switch (id) {
      case 2:
        return 'Sesc';
      case 3:
        return 'Senac';
      default:
        return `Lanchonete ${id}`;
    }
  };

  // Função para definir a cor do texto baseado na cor do fundo
  const getTextColor = (status) => {
    const bg = getStatusColor(status).toLowerCase();
    // Se a cor do fundo for muito clara (amarelo), texto preto, senão branco
    if (bg === '#ffcc00') return '#000';
    return '#fff';
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
      <Text style={styles.title}>Meus Pedidos</Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id_pedido.toString()}
        renderItem={({ item }) => {
          const textColor = getTextColor(item.status_pedido);
          const statusMessage = getStatusMessage(item.status_pedido);

          return (
            <View style={[styles.card, { backgroundColor: getStatusColor(item.status_pedido) }]}>
              
              {/* Cabeçalho */}
              <View style={styles.header}>
                <View>
                  {/* Status principal agora mostra a mensagem completa */}
                  <Text style={[styles.status, { color: textColor }]}>
                    {statusMessage}
                  </Text>

                  <Text style={[styles.orderInfo, { color: textColor }]}>
                    Pedido #{item.id_pedido} • {getLanchoneteName(item.id_lanchonete)}
                  </Text>

                  <Text style={[styles.price, { color: textColor }]}>
                    Total: R$ {item.preco_total}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    setExpanded(expanded === item.id_pedido ? null : item.id_pedido)
                  }
                >
                  <Ionicons
                    name={expanded === item.id_pedido ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={28}
                    color={textColor}
                  />
                </TouchableOpacity>
              </View>

              {/* Itens */}
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
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("Produtos")}
                          >
                            <Text style={styles.buttonText}>Ver produto</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={{ textAlign: 'center', color: '#777' }}>Nenhum item encontrado.</Text>
                  )}
                </View>
              )}

            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },

  /* ----- CARD DO PEDIDO ----- */
  card: {
    borderRadius: 14,
    marginBottom: 22,
    padding: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 17,
    fontWeight: '600',
  },
  orderInfo: {
    fontSize: 13,
    marginTop: 3,
  },
  price: {
    fontSize: 15,
    marginTop: 8,
    fontWeight: 'bold',
  },

  /* ----- ITENS ----- */
  itemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginTop: 15,
    padding: 12,
  },
  itemCard: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 14,
    padding: 10,
  },
  itemImage: {
    width: 75,
    height: 75,
    borderRadius: 10,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#666',
  },
  itemPrice: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FFCC00',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

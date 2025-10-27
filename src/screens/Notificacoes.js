import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import seta from "../../assets/img/seta.png";
import { supabase } from "../../utils/supabase";

const STORAGE_KEY = "produtos_local";

export default function Notificacoes({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarPedidosLocais();
  }, []);

  async function buscarPedidosLocais() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const data = json ? JSON.parse(json) : [];

      const pedidosConvertidos = data.map((item) => ({
        nome_produto: item[0],
        id_produto: item[1],
        preco: Number(item[2]),
      }));

      setPedidos(pedidosConvertidos);
    } catch (e) {
      console.error("Erro ao buscar pedidos locais:", e);
    }

    setCarregando(false);
  }

  async function deletarPedido(id_produto) {
    Alert.alert("Confirmar exclusão", "Deseja excluir este pedido?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const novaLista = pedidos.filter((p) => p.id_produto !== id_produto);
            setPedidos(novaLista);

            const dataParaSalvar = novaLista.map((item) => [
              item.nome_produto,
              item.id_produto,
              item.preco,
            ]);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataParaSalvar));
          } catch (e) {
            console.error("Erro ao deletar pedido:", e);
          }
        },
      },
    ]);
  }

  const total = pedidos.reduce((soma, item) => soma + item.preco, 0);

  const renderPedidoItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Image source={item.imagem} style={styles.itemImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.nome_produto}</Text>
        <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
      </View>

      <TouchableOpacity onPress={() => deletarPedido(item.id_produto)}>
        <Text style={styles.deleteX}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  // 🔹 Função para finalizar compra e salvar no Supabase
  async function finalizarCompra() {
    if (pedidos.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione produtos antes de finalizar.");
      return;
    }

    try {
      const preco_total = pedidos.reduce((soma, item) => soma + item.preco, 0);
      const id_lanchonete = 1; // ajuste conforme necessário

      // Inserir pedido
      const { data: pedidoData, error: pedidoError } = await supabase
        .from("pedido")
        .insert([{ id_lanchonete, preco_total }])
        .select("id_pedido")
        .single();

      if (pedidoError) throw pedidoError;

      const id_pedido = pedidoData.id_pedido;

      // Inserir itens do pedido
      const itensParaInserir = pedidos.map((item) => ({
        id_pedido,
        id_produto: item.id_produto,
        total_item: item.preco,
      }));

      const { error: itensError } = await supabase
        .from("itens_pedido")
        .insert(itensParaInserir);

      if (itensError) throw itensError;

      // Limpar carrinho
      setPedidos([]);
      await AsyncStorage.removeItem(STORAGE_KEY);

      Alert.alert("Sucesso", "Pedido finalizado!");
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      Alert.alert("Erro", "Não foi possível finalizar o pedido.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image source={seta} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>

        <Text style={styles.title}>Meus Pedidos</Text>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#004799"
            style={{ marginTop: 40 }}
          />
        ) : pedidos.length === 0 ? (
          <>
            <Text style={styles.subText}>Sem pedidos salvos</Text>
            <Text style={styles.sadFace}>:(</Text>
          </>
        ) : (
          <View style={styles.cardPedido}>
            <Text style={styles.valorTotal}>R${total.toFixed(2)}</Text>
            <FlatList
              data={pedidos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderPedidoItem}
              contentContainerStyle={{ marginTop: 10 }}
            />
          </View>
        )}
      </View>
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.buttonYellow} onPress={finalizarCompra}>
          <Text style={styles.buttonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  subText: {
    fontSize: 16,
    color: "#004799",
    marginTop: 30,
  },
  sadFace: {
    fontSize: 24,
    color: "#004799",
    marginTop: 5,
  },

  cardPedido: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "90%",
    marginTop: 50,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  valorTotal: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  buttonYellow: {
    backgroundColor: "#FFC400",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF6D5",
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  itemImage: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 14,
    color: "#444",
  },
  deleteX: {
    fontSize: 20,
    color: "#FF4444",
    fontWeight: "bold",
    paddingHorizontal: 8,
  },
});

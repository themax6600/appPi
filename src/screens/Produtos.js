import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../utils/supabase";
import { useState, useEffect } from "react";

const STORAGE_KEY = "produtos_local";

export default function Produtos({ navigation }) {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        buscarProdutos();
    }, []);

    async function buscarProdutos() {
        const { data, error } = await supabase
            .from("produto")
            .select("nome_produto, preco, id_produto, image");

        if (error) {
            console.error("Erro ao buscar produtos:", error);
            Alert.alert("Erro", "Falha ao buscar produtos.");
        } else {
            setProdutos(data);
        }

        setCarregando(false);
    }

    async function salvarProdutoLocal(produto) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert("Erro", "Você precisa estar logado para comprar produtos.");
                return;
            }

            const chaveUsuario = `produtos_local_${user.id}`;

            const produtoArray = [
                produto.nome_produto,
                produto.id_produto,
                produto.preco,
                1,
                produto.image,
            ];

            const json = await AsyncStorage.getItem(chaveUsuario);
            const listaAtual = json ? JSON.parse(json) : [];
            const novaLista = [...listaAtual, produtoArray];

            await AsyncStorage.setItem(chaveUsuario, JSON.stringify(novaLista));

            console.log("Produto salvo localmente para o usuário:", user.id, produtoArray);
        } catch (e) {
            console.error("Erro ao salvar localmente:", e);
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.image }}
                style={{ width: 120, height: 120, borderRadius: 10, marginBottom: 10 }}
            />
            <Text style={styles.title}>
                {item.id_produto} - {item.nome_produto}
            </Text>
            <Text style={styles.price}>R${item.preco.toFixed(2)}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => salvarProdutoLocal(item)}
            >
                <Text style={styles.buttonText}>Comprar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => Alert.alert("Descrição", `Produto: ${item.nome_produto}`)}
            >
                <Text style={styles.buttonText}>Descrição</Text>
            </TouchableOpacity>
        </View>
    );

    if (carregando) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#FFC400" />
                <Text>Carregando produtos...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={produtos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 20 }}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFC400",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        margin: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        width: "100%",
        alignSelf: "center",
        marginVertical: 10,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 2,
    },
    price: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#fff",
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 40,
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 36,
        elevation: 5,
        marginTop: 10,
    },
    buttonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
    },
});

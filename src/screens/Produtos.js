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
import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "filtro_categoria";

export default function Produtos({ navigation }) {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState("todos");
    const flatListRef = useRef(null);

    useEffect(() => {
        (async () => {
            const filtroSalvo = await AsyncStorage.getItem(STORAGE_KEY);
            if (filtroSalvo) {
                setFiltro(filtroSalvo);
                buscarProdutos(filtroSalvo);
            } else {
                buscarProdutos("todos");
            }
        })();
    }, []);

    useEffect(() => {
        if (filtro) {
            AsyncStorage.setItem(STORAGE_KEY, filtro);
        }
    }, [filtro]);

    const buscarProdutos = useCallback(async (tipoSelecionado = "todos") => {
        try {
            setCarregando(true);
            let query = supabase
                .from("produto")
                .select("nome_produto, preco, id_produto, image, tipo");

            if (tipoSelecionado !== "todos") {
                query = query.eq("tipo", tipoSelecionado);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Erro ao buscar produtos:", error);
                Alert.alert("Erro", "Falha ao buscar produtos.");
                setProdutos([]);
            } else {
                setProdutos(data || []);
            }
        } catch (e) {
            console.error("Erro ao buscar produtos:", e);
            Alert.alert("Erro", "Falha ao carregar os produtos.");
        } finally {
            setCarregando(false);
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }
    }, []);

    async function salvarProdutoLocal(produto) {
        try {
            const { data } = await supabase.auth.getUser();
            const user = data?.user ?? null;

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

            Alert.alert("Sucesso", "Produto adicionado ao carrinho local!");
        } catch (e) {
            console.error("Erro ao salvar localmente:", e);
            Alert.alert("Erro", "Não foi possível salvar o produto localmente.");
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.image }}
                style={styles.image}
            />
            <Text style={styles.title}>
                {item.nome_produto}
            </Text>
            <Text style={styles.price}>R${Number(item.preco).toFixed(2)}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => salvarProdutoLocal(item)}
            >
                <Text style={styles.buttonText}>Comprar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => Alert.alert("Descrição", `Produto: ${item.nome_produto}\nTipo: ${item.tipo}`)}
            >
                <Text style={styles.buttonText}>Descrição</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.filterContainer}>
                {["todos", "doce", "salgado", "bebida"].map((tipo) => (
                    <TouchableOpacity
                        key={tipo}
                        style={[
                            styles.filterButton,
                            filtro === tipo && styles.filterButtonActive,
                        ]}
                        onPress={() => {
                            setFiltro(tipo);
                            buscarProdutos(tipo);
                        }}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                filtro === tipo && styles.filterButtonTextActive,
                            ]}
                        >
                            {filtro === tipo && carregando
                                ? "Atualizando..."
                                : tipo.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {carregando ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFC400" />
                    <Text>Carregando produtos...</Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={produtos}
                    keyExtractor={(item) => String(item.id_produto ?? Math.random())}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
                    ListEmptyComponent={
                        <View style={{ padding: 20, alignItems: "center" }}>
                            <Text>Nenhum produto encontrado para essa categoria.</Text>
                        </View>
                    }
                />
            )}
        </View>
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
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 2,
        textAlign: "center",
        color: '#fff',
    },
    price: {
        fontWeight: "bold",
        fontSize: 25,
        marginBottom: 10,
        color: '#002D85',
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
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
        flexWrap: "wrap",
    },
    filterButton: {
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 15,
        margin: 4,
        borderWidth: 1,
        borderColor: "#FFC400",
    },
    filterButtonActive: {
        backgroundColor: "#FFC400",
    },
    filterButtonText: {
        color: "#000",
        fontWeight: "bold",
    },
    filterButtonTextActive: {
        color: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

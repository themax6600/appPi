import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {Image} from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <TouchableOpacity onPress={() => navigation.navigate("Contato")}>
          <LinearGradient
            colors={["#80BBFF", "#004C99"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnContato}
          >
            <Text style={styles.textContato}>Fale Conosco</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.welcome}>
        <LinearGradient
          colors={["#80BBFF", "#004C99"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bg_text}
        >
          <Text style={styles.text3}>
            Seja bem-vindo à lanchonete do Sesc e Senac
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Produtos")}>
          <View style={styles.bgMenu}>
            <Image source="https://ofnioamjxvvxfcdnvlev.supabase.co/storage/v1/object/public/imagem/menu.png" style={styles.imgMenu} />
          </View>
          <LinearGradient
            colors={["#80BBFF", "#004C99"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.divider}
          />
          <View style={styles.col}>
            <Text style={styles.text1}>
              Veja nosso menu de lanches e bebidas!
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Pedidos")}>
          <View style={styles.bgMenu}>
            <Image source="https://ofnioamjxvvxfcdnvlev.supabase.co/storage/v1/object/public/imagem/agenda.png" style={styles.imgMenu} />
          </View>
          <LinearGradient
            colors={["#80BBFF", "#004C99"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.divider}
          />

          <View style={styles.col}>
            <Text style={styles.text1}>
              Veja aqui seus pedidos pendentes e pedidos passados.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
  },
  section: {
    flex: 0.75,
    justifyContent: "center",
  },
  welcome: {
    flex: 1,
    marginBottom: 10,
  },
  cards: {
    flex: 4,
    justifyContent: "space-around",
  },
  card: {
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bgMenu: {
    width: 110,
    height: 110,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  imgMenu: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  divider: {
    width: 3,
    height: "80%",
    marginHorizontal: 10,
    borderRadius: 1,
  },
  col: {
    flex: 1,
    justifyContent: "center",
  },
  text1: {
    fontSize: 18,
    color: "#000",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  text3: {
    fontSize: 25,
    textAlign: "center",
    color: "#fff",
    padding: 4,
    fontWeight: "bold",
  },
  bg_text: {
    borderRadius: 20,
    padding: 10,
  },
  btnContato: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignSelf: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  textContato: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

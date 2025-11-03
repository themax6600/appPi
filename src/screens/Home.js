import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import agenda from "../../assets/img/agenda.png";
import menu from "../../assets/img/menu.png";

import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

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
            <Text style={styles.textContato}>Fale conosco</Text>
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
        <View style={styles.card}>
          <View style={styles.bgMenu}>
            <Image source={menu} style={styles.imgMenu} />
          </View>
          <View style={styles.col}>
            <Text style={styles.text1}>
              Veja nosso menu de lanches e bebidas!
            </Text>
            <View>
              <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate("Produtos")}>
                <Text style={styles.text}>SESC</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate("Produtos")}>
                <Text style={styles.text}>SENAC</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <TouchableOpacity style={styles.bgMenu} onPress={() => navigation.navigate("Pedidos")}>
            <Image source={agenda} style={styles.imgMenu} />
          </TouchableOpacity>
          <View style={styles.col}>
            <Text style={styles.text1}>Veja aqui seus pedidos pendentes e pedidos passados.</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    margin: 5,
  },
  section: {
    flex: 0.75,
    display: 'flex',
    justifyContent: 'center',
  },
  welcome: {
    flex: 1,
  },
  cards: {
    display: 'flex',
    justifyContent: 'space-around',
    flex: 4,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    width: '70%',
    marginBottom: 15,
  },
  col: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn1: {
    backgroundColor: "#FFC400",
    borderRadius: 15,
    padding: 5
  },
  btn2: {
    backgroundColor: "#FFC400",
    borderRadius: 15,
    padding: 2,
    width: 150,
    marginTop: 5,
  },
  text: {
    textAlign: "center",
    fontSize: 25
  },
  text1: {
    color: "#000000ff",
    fontSize: 20,
    marginStart: 10,
  },
  text3: {
    fontSize: 25,
    textAlign: "center",
    color: "#ffffffff",
    padding: 4,
    fontWeight: "bold",
  },
  bg_text: {
    borderRadius: 20,
  },
  imgMenu: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 20,
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

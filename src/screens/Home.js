import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import agenda from "../../assets/img/agenda.png";
import menu from "../../assets/img/menu.png";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text1}>
          Seu saldo <Text style={styles.text2}>R$0,00</Text>
        </Text>
        <TouchableOpacity style={styles.btn1}>
          <Text style={styles.text3}>Inserir saldo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
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
            <TouchableOpacity style={styles.btn2}>
              <Text style={styles.text}>SENAC</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.bgMenu}>
            <Image source={agenda} style={styles.imgMenu} />
          </View>
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
    backgroundColor: "#ffffffff"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 7,
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
    width: 200,
    marginTop: 5,
  },
  text: {
    textAlign: "center",
    fontSize: 25
  },
  text1: {
    color: "#000000ff",
    fontSize: 25
  },
  text2: {
    color: "#FFC400"
  },
  text3: {
    fontSize: 25,
    textAlign: "center",
    color: "#ffffffff",
    padding: 4,
  },
  bg_text: {
    borderRadius: 20,
    marginTop: 50,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    width: 10,
    marginTop: 50,
  },
  col: {
    width: 200,
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  bgMenu:{
    backgroundColor: "#004C99",
    borderRadius: 20,
    padding: 5,
  },
  section:{
    margin: 10,
  },
});

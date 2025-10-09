import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'

import agenda from '../../assets/img/agenda.png'
import menu from '../../assets/img/menu.png'

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text1}>Seu saldo <Text style={styles.text2}>R$0,00</Text></Text>
        <TouchableOpacity
          style={styles.btn1}
        >
          <Text style={styles.text3}>Inserir saldo</Text>
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.bg_text}>
          <Text style={styles.text3}>Seja bem vindo a lanchonete do Sesc e Senac</Text>
        </View>
        <View style={styles.card}>
          <Image source={menu} style={styles.imgMenu} />
          <View style={styles.col}>
            <Text style={styles.text1}>Veja nosso menu de lanches e bebidas!</Text>
            <TouchableOpacity
              style={styles.btn2}
            >
              <Text style={styles.text}>SESC</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn2}
            >
              <Text style={styles.text}>SENAC</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002D85',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 7,
  },
  btn1: {
    backgroundColor: '#FFC400',
    borderRadius: 15,
    padding: 5,
  },
  btn2: {
    backgroundColor: '#FFC400',
    borderRadius: 15,
    padding: 2,
    width: 200,
    margin: 5,
  },
  text:{
    textAlign: 'center',
    fontSize: 25, 
  },
  text1: {
    color: 'white',
    fontSize: 25,
  },
  text2: {
    color: '#FFC400',
  },
  text3: {
    fontSize: 25,
    textAlign: 'center',
  },
  bg_text: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 50,
    margin: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
  },
  col:{
    width: 200,
  },
  imgMenu:{
    backgroundColor: '#111',
  },
})
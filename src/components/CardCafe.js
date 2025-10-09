import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'

export default function CardCafe({ tipo }) {
  return (
    <TouchableOpacity style={estilo.btnCafe} onPress={() => navigation.navigate('Detalhes')}>
      <View style={estilo.caixa}>
        <Text style={estilo.txtCafe}>{tipo.titulo}</Text>
      </View>
      <View>
      </View>
    </TouchableOpacity>
  )
}

const estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  caixaTexto: {
    paddingTop: 20,
    paddingStart: 15,
  },
  titulo: {
    color: '#B98875',
    fontSize: 28,
    fontWeight: '700',
  },
  btnCafe: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
  },
  caixa: {
    fontSize: 19,
    flexDirection: 'row',
    alignItems: 'center',

  },
  img: {
    height: 46,
    width: 46,
    resizeMode: 'contain',
  },
  flecha: {
    height: 26,
    width: 26,
  },
  txtCafe: {
    fontSize: 19,
    marginLeft: 20,
    marginTop: 15,
  },

})
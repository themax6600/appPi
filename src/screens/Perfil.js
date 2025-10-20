import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { supabase } from '../../utils/supabase';

export default function Perfil() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailAluno, setEmailAluno] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');

  useEffect(() => {
    const buscarUsuario = async () => {
      const { data: { Users }, error } = await supabase.auth.getUser()

      if (error) {
        console.error('Erro ao obter usuário:', error.message)
      } else if (Users) {
        setEmailAluno(Users.emailAluno)
      }
    }

    buscarUsuario()
  }, [])

  async function salvarPerfil() {
    try {
      const user = supabase.auth.Users();

      if (!user) {
        Alert.alert('Erro', 'Usuário não está logado');
        return;
      }

      const { error } = await supabase.from('perfil').upsert({
        id_user: user.id,
        nome: nomeUsuario,
        email: emailAluno,
        data_nascimento: dataNascimento,
        telefone: telefone,
        cpf: cpf,
        cep: cep,
        estado: estado,
        cidade: cidade,
        rua: rua,
        bairro: bairro,
      }, { onConflict: 'id_user' });

      if (error) {
        Alert.alert('Erro ao salvar perfil', error.message);
      } else {
        Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro inesperado', error.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>Foto</Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{nomeUsuario || 'Nome do usuário'}</Text>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18 }}>
              {emailAluno ? `Usuário logado: ${emailAluno}` : 'Nenhum usuário logado'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Input label="Nome Usuário" value={nomeUsuario} onChangeText={setNomeUsuario} />
        <Input label="email@ do aluno" value={emailAluno} onChangeText={setEmailAluno} />
        <Input label="Data de Nascimento" value={dataNascimento} onChangeText={setDataNascimento} />
        <Input label="Número de telefone" value={telefone} onChangeText={setTelefone} />
        <Input label="CPF" value={cpf} onChangeText={setCpf} />
      </View>

      <Text style={styles.sectionTitle}>Complementos</Text>
      <View style={styles.section}>
        <Input label="cep" value={cep} onChangeText={setCep} />
        <Input label="estado" value={estado} onChangeText={setEstado} />
        <Input label="cidade" value={cidade} onChangeText={setCidade} />
        <Input label="rua" value={rua} onChangeText={setRua} />
        <Input label="bairro" value={bairro} onChangeText={setBairro} />
      </View>

      <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const Input = ({ label, value, onChangeText }) => (
  <TextInput
    style={styles.input}
    placeholder={label}
    value={value}
    onChangeText={onChangeText}
    placeholderTextColor="#000"
  />
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#333',
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ccc',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#aaa',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFD966',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#111',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

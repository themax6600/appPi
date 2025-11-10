import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../utils/supabase';

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [emailAluno, setEmailAluno] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [userId, setUserId] = useState(null);
  const [carregado, setCarregado] = useState(false);
  const [fotoUri, setFotoUri] = useState(null); // URI local da foto
  const [fotoUrl, setFotoUrl] = useState(null); // URL pública no Supabase

  useEffect(() => {
    const buscarUsuario = async () => {
      if (carregado) return;
      setCarregado(true);

      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erro ao obter usuário:', error.message);
        return;
      }

      const user = data?.user;
      if (!user) return;

      setEmailAluno(user.email);
      setUserId(user.id);

      const { data: perfilData, error: perfilError } = await supabase
        .from('perfil')
        .select('*')
        .eq('id_user', user.id)
        .single();

      if (perfilError) {
        console.log('Nenhum perfil existente, criando novo.');
      } else if (perfilData) {
        setNome(perfilData.nome || '');
        setDataNascimento(perfilData.data_nascimento || '');
        setTelefone(perfilData.telefone || '');
        setCpf(perfilData.cpf || '');
        setCep(perfilData.cep || '');
        setEstado(perfilData.estado || '');
        setCidade(perfilData.cidade || '');
        setRua(perfilData.rua || '');
        setBairro(perfilData.bairro || '');
        setComplemento(perfilData.complemento || '');
        setFotoUrl(perfilData.foto || null);
      }
    };

    buscarUsuario();
  }, [carregado]);

  const validarCampos = () => {
    const limparNumero = (v) => v?.replace(/\D/g, '');
    if (cpf && limparNumero(cpf)?.length !== 11) return 'CPF inválido.';
    if (telefone && limparNumero(telefone)?.length < 10) return 'Telefone inválido.';
    return null;
  };

  const escolherFoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'Precisamos acessar suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setFotoUri(uri);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const uploadFoto = async (uri) => {
    try {
      if (!uri || !userId) return null;

      const fileExt = uri.split('.').pop();
      const fileName = `${userId}.${fileExt}`;

      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      const file = new Uint8Array(arrayBuffer);

      const { error } = await supabase.storage
        .from('perfil_fotos')
        .upload(fileName, file, { upsert: true });

      if (error) {
        console.log('Erro ao enviar foto:', error.message);
        return null;
      }

      const { data: publicData } = supabase.storage
        .from('perfil_fotos')
        .getPublicUrl(fileName);

      return publicData.publicUrl;
    } catch (err) {
      console.log('Erro uploadFoto:', err.message);
      return null;
    }
  };

  const salvarPerfil = async () => {
  try {
    if (!userId) {
      Alert.alert('Erro', 'Usuário não está logado');
      return;
    }

    const erro = validarCampos();
    if (erro) {
      Alert.alert('Erro', erro);
      return;
    }

    let fotoPublica = fotoUrl;
    if (fotoUri) {
      const url = await uploadFoto(fotoUri);
      if (url) fotoPublica = url;
    }

    const limparNumero = (valor) => (valor ? valor.replace(/\D/g, '') : null);

    const perfilData = {
      id_user: userId,
      nome: nome || null,
      email: emailAluno || null,
      data_nascimento: dataNascimento || null,
      telefone: limparNumero(telefone) || null,
      cpf: limparNumero(cpf) || null,
      cep: limparNumero(cep) || null,
      estado: estado || null,
      cidade: cidade || null,
      rua: rua || null,
      bairro: bairro || null,
      complemento: complemento || null,
      foto: fotoPublica || null,
    };

    const { error } = await supabase.from('perfil').upsert(perfilData, {
      onConflict: 'id_user',
    });

    if (error) {
      Alert.alert('Erro ao salvar perfil', error.message);
    } else {
      setFotoUrl(fotoPublica);
      setFotoUri(null);
      Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
    }
  } catch (error) {
    Alert.alert('Erro inesperado', error.message);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={escolherFoto}>
          {fotoUri || fotoUrl ? (
            <Image
              source={{ uri: fotoUri || fotoUrl }}
              style={styles.avatarPlaceholder}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>Foto</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{nome || 'Nome do usuário'}</Text>
          <Text style={{ fontSize: 18 }}>
            {emailAluno ? ` ${emailAluno}` : 'Nenhum usuário logado'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Informações Adicionais</Text>
      <View style={styles.section}>
        <Input label="Nome Usuário" value={nome} onChangeText={setNome} maxLength={50} />
        <Input label="Email do aluno" value={emailAluno} onChangeText={setEmailAluno} maxLength={60} />
        <Input
          label="Data de Nascimento (DD/MM/AAAA)"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          maxLength={10}
          keyboardType="numeric"
        />
        <Input label="Telefone" value={telefone} onChangeText={setTelefone} maxLength={11} keyboardType="numeric" />
        <Input label="CPF" value={cpf} onChangeText={setCpf} maxLength={11} keyboardType="numeric" />
      </View>

      <Text style={styles.sectionTitle}>Endereço</Text>
      <View style={styles.section}>
        <Input label="CEP" value={cep} onChangeText={setCep} maxLength={9} keyboardType="numeric" />
        <TextInput
          style={styles.input}
          placeholder="Estado"
          value={estado}
          onChangeText={(text) =>
            setEstado(text.replace(/[^A-Za-z]/g, '').toUpperCase())
          }
          maxLength={2}
          autoCapitalize="characters"
          placeholderTextColor="#000"
        />
        <Input label="Cidade" value={cidade} onChangeText={setCidade} maxLength={40} />
        <Input label="Rua" value={rua} onChangeText={setRua} maxLength={60} />
        <Input label="Bairro" value={bairro} onChangeText={setBairro} maxLength={40} />
        <Input label="Complemento" value={complemento} onChangeText={setComplemento} maxLength={60} />
      </View>

      <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const Input = ({ label, value, onChangeText, maxLength, keyboardType }) => (
  <TextInput
    style={styles.input}
    placeholder={label}
    value={value}
    onChangeText={onChangeText}
    placeholderTextColor="#000"
    maxLength={maxLength}
    keyboardType={keyboardType}
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    width: '100%',
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

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
import { MaskedTextInput } from 'react-native-mask-text';
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

  const brDateToISO = (brDate) => {
    if (!brDate) return null;
    const parts = brDate.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map((p) => parseInt(p, 10));
    if (!day || !month || !year) return null;
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

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
      }
    };

    buscarUsuario();
  }, [carregado]);

  const validarCampos = () => {
    const limparNumero = (v) => v?.replace(/\D/g, '');

    if (!nome.trim()) return 'O nome é obrigatório.';
    if (limparNumero(cpf)?.length !== 11) return 'CPF inválido.';
    if (limparNumero(telefone)?.length < 10) return 'Telefone inválido.';
    if (dataNascimento && !brDateToISO(dataNascimento))
      return 'Data de nascimento inválida. Use o formato DD/MM/AAAA.';
    return null;
  };

  async function salvarPerfil() {
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

      const limparNumero = (valor) => (valor ? valor.replace(/\D/g, '') : null);
      const dataISO = brDateToISO(dataNascimento);

      const perfilData = {
        id_user: userId,
        nome,
        email: emailAluno,
        data_nascimento: dataISO,
        telefone: limparNumero(telefone),
        cpf: limparNumero(cpf),
        cep: limparNumero(cep),
        estado,
        cidade,
        rua,
        bairro,
        complemento,
      };

      const { error } = await supabase.from('perfil').upsert(perfilData, {
        onConflict: 'id_user',
      });

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
          <Text style={styles.name}>{nome || 'Nome do usuário'}</Text>
          <Text style={{ fontSize: 18 }}>
            {emailAluno ? ` ${emailAluno}` : 'Nenhum usuário logado'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Informações Adicionais</Text>
      <View style={styles.section}>
        <Input
          label="Nome Usuário"
          value={nome}
          onChangeText={(text) => setNome(text.replace(/[0-9]/g, ''))}
          maxLength={50}
        />
        <Input
          label="Email do aluno"
          value={emailAluno}
          onChangeText={setEmailAluno}
          maxLength={60}
        />
        <InputMask
          label="Data de Nascimento"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          mask="99/99/9999"
          maxLength={10}
        />
        <InputMask
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          mask="(99) 99999-9999"
          maxLength={15}
        />
        <InputMask
          label="CPF"
          value={cpf}
          onChangeText={setCpf}
          mask="999.999.999-99"
          maxLength={14}
        />
      </View>

      <Text style={styles.sectionTitle}>Endereço</Text>
      <View style={styles.section}>
        <InputMask
          label="CEP"
          value={cep}
          onChangeText={setCep}
          mask="99999-999"
          maxLength={9}
        />
        <TextInput
          style={styles.input}
          placeholder="Estado"
          value={estado}
          onChangeText={(text) => setEstado(text.replace(/[^A-Za-z]/g, '').toUpperCase())}
          maxLength={2}
          autoCapitalize="characters"
          placeholderTextColor="#000"
        />
        <Input label="Cidade" value={cidade} onChangeText={setCidade} maxLength={40} />
        <Input label="Rua" value={rua} onChangeText={setRua} maxLength={60} />
        <Input label="Bairro" value={bairro} onChangeText={setBairro} maxLength={40} />
        <Input
          label="Complemento"
          value={complemento}
          onChangeText={setComplemento}
          maxLength={60}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 🔹 Componentes reutilizáveis
const Input = ({ label, value, onChangeText, maxLength }) => (
  <TextInput
    style={styles.input}
    placeholder={label}
    value={value}
    onChangeText={onChangeText}
    placeholderTextColor="#000"
    maxLength={maxLength}
  />
);

const InputMask = ({ label, value, onChangeText, mask, maxLength }) => (
  <MaskedTextInput
    style={styles.input}
    placeholder={label}
    value={value}
    onChangeText={onChangeText}
    mask={mask}
    keyboardType="numeric"
    placeholderTextColor="#000"
    maxLength={maxLength}
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

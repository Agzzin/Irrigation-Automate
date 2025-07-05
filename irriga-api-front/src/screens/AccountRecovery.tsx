import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ResetPasswordScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendInstructions = async () => {
    if (email.trim().length === 0) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3000/redefinir-senha',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message || 'Verifique seu e-mail.');
        navigation.navigate('CheckEmail');
      } else {
        Alert.alert('Erro', data.message || 'Ocorreu um erro ao enviar o e-mail.');
      }
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      Alert.alert(
        'Erro',
        'Não foi possível se conectar ao servidor. Tente novamente mais tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Redefinir senha</Text>
      <Text style={styles.description}>
        Digite o e-mail associado à sua conta e enviaremos um e-mail com
        instruções para redefinir sua senha.
      </Text>

      <Text style={styles.label}>Endereço de email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor="#fff"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSendInstructions}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Enviando...' : 'Enviar instruções'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
    color: '#fff',
  },
  button: {
    backgroundColor: '#00CB21',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

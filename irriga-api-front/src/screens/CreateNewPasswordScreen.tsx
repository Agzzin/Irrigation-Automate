import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/RootStackParamList';

const CreateNewPasswordScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetPassword = () => {
    if (password.length < 8) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    console.log('Senha redefinida com sucesso:', password);
    Alert.alert('Sucesso', 'Sua senha foi redefinida com sucesso!');
    navigation.navigate('InitialPage');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Criar nova senha</Text>
      <Text style={styles.description}>
        Digite e confirme sua nova senha para redefinir o acesso.
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nova senha"
          placeholderTextColor="#fff"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(prev => !prev)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>Deve ter pelo menos 8 caracteres.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#fff"
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowConfirm(prev => !prev)}>
          <Ionicons
            name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>As senhas devem ser iguais.</Text>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Redefinir senha</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 44,
    color: '#fff',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#00CB21',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

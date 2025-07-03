import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  Animated,
  KeyboardTypeOptions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/RootStackParamList';
import {useAuth} from '../contexts/AuthContext';
import FloatingLabelInput from '../components/FloatingLabelInput';

type SignUpNav = NativeStackNavigationProp<RootStackParamList, 'InitialPage'>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpNav>();
  const {login} = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://8b4e-200-106-218-64.ngrok-free.app/usuarios/signup',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({nome, email, senha}),
        },
      );

      if (!response.ok) {
        const {message} = await response.json();
        throw new Error(message || 'Erro ao cadastrar');
      }

      const loginResponse = await fetch(
        'https://c715-200-106-218-64.ngrok-free.app/usuarios/login',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email, senha}),
        },
      );

      if (!loginResponse.ok) {
        const {message} = await loginResponse.json();
        throw new Error(message || 'Erro no login após cadastro');
      }

      const loginData = await loginResponse.json();

      await login(loginData.token, loginData.usuario);

      Alert.alert('Sucesso!', 'Conta criada e login realizado com sucesso.');
      navigation.navigate('InitialPage');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/icons/bola-verde.png')}
          style={styles.logo}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Hello,</Text>
          <Text style={styles.subtitle}>SignUp!</Text>
        </View>
      </View>

      <View style={{alignItems: 'center', width: '100%'}}>
        <FloatingLabelInput
          label="NOME"
          value={nome}
          onChangeText={setNome}
          keyboardType="default"
          autoCapitalize="words"
          placeholderTextColor="#fff"
          style={[styles.input, {width: '90%'}]}
        />
        <FloatingLabelInput
          label="EMAIL"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#fff"
          style={[styles.input, {width: '90%'}]}
        />
        <FloatingLabelInput
          label="SENHA"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor="#fff"
          style={[styles.input, {width: '90%'}]}
        />
      </View>

      <View style={styles.optionsRow}>
        <View style={styles.rememberMe}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{false: '#767577', true: '#00CB21'}}
            thumbColor={rememberMe ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            style={{transform: [{scaleX: 1.0}, {scaleY: 0.8}]}}
          />
          <Text style={styles.rememberMeText}>
            Eu aceito os termos {'\n'}e condições do app
          </Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.buttonEntrar, loading && {opacity: 0.6}]}
        onPress={handleSignUp}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    width: 410,
    height: 400,
    top: 40,
    left: -70,
  },
  logo: {
    width: 400,
    height: 380,
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    marginRight: 150,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 18,
    borderRadius: 8,
    marginBottom: 16,
  },

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  forgotText: {
    color: '#00CB21',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  buttonEntrar: {
    backgroundColor: '#00CB21',
    borderRadius: 50,
    padding: 12,
    marginTop: 30,
    marginHorizontal: 70,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

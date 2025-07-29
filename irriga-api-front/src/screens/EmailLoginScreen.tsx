import React, {useState, useRef, useEffect} from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../types/RootStackParamList';
import {useAuth} from '../contexts/AuthContext';
import FloatingLabelInput from '../components/FloatingLabelInput';
import {loginSchema} from '../controllers/zodSchema';
import {z, ZodError} from 'zod';

type EmailLoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InitialPage'
>;

const API_BASE_URL = 'https://2788511b7480.ngrok-free.app';

const LOGIN_URL = `${API_BASE_URL}/usuarios/login`;

const EmailLoginScreen: React.FC = () => {
  const navigation = useNavigation<EmailLoginScreenNavigationProp>();

  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {login} = useAuth();

  const handleLogin = async () => {
    try {
      const data = loginSchema.parse({
        email: email.trim(),
        senha: password.trim(),
      });

      setLoading(true);
      setErrorMsg(null);

      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: data.email, senha: data.senha}),
      });

      const raw = await response.text();
      console.log('LOGIN →', response.status, raw);

      if (!response.ok) {
        let mensagem = `Erro ${response.status}`;
        try {
          mensagem = JSON.parse(raw).message || mensagem;
        } catch (_) {}
        setErrorMsg(mensagem);
        return;
      }

      const {token, usuario} = JSON.parse(raw);

      await login(token, usuario);

      console.log('Usuário autenticado:', usuario);
      navigation.navigate('InitialPage');
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        setErrorMsg(err.issues[0].message);
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Erro desconhecido');
      }
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
        <Text style={styles.title}>
          Welcome Back,{'\n'}
          <Text style={styles.subtitle}>Log in!</Text>
        </Text>
      </View>

      <FloatingLabelInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#fff"
      />
      <FloatingLabelInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor="#fff"
      />

      <View style={styles.optionsRow}>
        <View style={styles.rememberMe}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{false: '#767577', true: '#00CB21'}}
            thumbColor={rememberMe ? '#fff' : '#f4f3f4'}
            style={{transform: [{scaleX: 1.0}, {scaleY: 1.0}]}}
          />
          <Text style={styles.rememberMeText}>Lembrar-me</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('AccountRecovery')}>
          <Text style={styles.forgotText}>Esqueci a senha?</Text>
        </TouchableOpacity>
      </View>

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#00CB21" />
      ) : (
        <TouchableOpacity
          style={styles.buttonEntrar}
          onPress={handleLogin}
          disabled={loading}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmailLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 410,
    height: 400,
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: 'bold',
    position: 'absolute',
    textAlign: 'center',
    width: 410,
    height: 400,
    paddingTop: 40,
    paddingRight: 140,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 80,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#000',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 18,
    borderWidth: 0,
    borderRadius: 8,
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
  errorText: {
    color: '#ff4d4d',
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 10,
    fontSize: 16,
  },
});

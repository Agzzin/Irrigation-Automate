// src/screens/SignUpScreen.tsx
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

type SignUpNav = NativeStackNavigationProp<RootStackParamList, 'InitialPage'>;

type FloatingLabelInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  placeholderTextColor?: string;
  [key: string]: any;
};

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  placeholderTextColor = '#aaa',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 30,
    top: animated.interpolate({inputRange: [0, 1], outputRange: [18, -10]}),
    fontSize: animated.interpolate({inputRange: [0, 1], outputRange: [14, 12]}),
    color: isFocused ? '#00CB21' : placeholderTextColor,
    backgroundColor: '#000',
    paddingHorizontal: 4,
    zIndex: 2,
  };

  return (
    <View style={{marginBottom: 24, marginHorizontal: 24, paddingTop: 8}}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
    </View>
  );
};

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpNav>();

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
      const response = await fetch('http://192.168.1.10:3000/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nome, email, senha}),
      });

      if (!response.ok) {
        const {message} = await response.json();
        throw new Error(message || 'Erro ao cadastrar');
      }

      Alert.alert('Sucesso!', 'Conta criada com sucesso.');
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

      <FloatingLabelInput
        label="NOME"
        value={nome}
        onChangeText={setNome}
        keyboardType="default"
        autoCapitalize="words"
        placeholderTextColor="#fff"
      />
      <FloatingLabelInput
        label="EMAIL"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#fff"
      />
      <FloatingLabelInput
        label="SENHA"
        value={senha}
        onChangeText={setSenha}
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
          <Text style={styles.buttonText}>Entrar</Text>
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
    width: 410,
    height: 400,
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    marginRight: 150,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
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
});

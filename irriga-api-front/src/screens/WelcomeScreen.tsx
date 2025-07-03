import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator, 
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  Settings,
  LoginManager,
} from 'react-native-fbsdk-next';
import PhoneIcon from '../../assets/icons/phone.svg';
import EnvelopeIcon from '../../assets/icons/envelope.svg';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';
import { AuthToken } from '../services/auth';

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

interface FacebookLoginProps {
  onLoginSuccess?: (userInfo: UserProfile) => void;
  onLogoutSuccess?: () => void;
}

const WEB_CLIENT_ID =
  '363423156217-fablvceko5uld16gjqn0605kloag1vsr.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId:
    '363423156217-fablvceko5uld16gjqn0605kloag1vsr.apps.googleusercontent.com',
  offlineAccess: true,
  iosClientId:
    '363423156217-26chv84thgpuif38uh7i12fb9mpmkvot.apps.googleusercontent.com',
});

const WelcomeScreen = () => {
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userInfoFacebook, setUserInfoFacebook] = useState<UserProfile | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [loading1, setLoading1] = useState<boolean>(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    Settings.initializeSDK();
    configureGoogleSignIn();
    checkCurrentFacebookAccessToken();

    AuthToken.get().then(token => {
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabs' }],
        });
      }
    });
  }, []);

  const handleBotao = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };
  const handleBotao1 = async () => {
    setLoading1(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading1(false);
  };

  // --- GOOGLE SIGN-IN ---
  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
      iosClientId:
        '363423156217-26chv84thgpuif38uh7i12fb9mpmkvot.apps.googleusercontent.com',
    });
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      setUserInfo(user);
      setError(null);
      console.log('User Info:', user);
      if (
        typeof user === 'object' &&
        user !== null &&
        'idToken' in user &&
        typeof user.idToken === 'string' &&
        'user' in user &&
        typeof user.user === 'object' &&
        user.user !== null &&
        'email' in user.user &&
        typeof user.user.email === 'string'
      ) {
        Alert.alert('Sucesso', `Logado como: ${user.user.email}`);
      }
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        setError('Login cancelado pelo usuário.');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        setError('Login em andamento.');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Google Play Services não disponível ou desatualizado.');
      } else {
        setError(`Erro de login: ${err.message}`);
        console.error('Google Sign-In Error:', err);
      }
      setUserInfo(null);
    }
    setLoading(false);
  };

  // --- FACEBOOK SIGN-IN ---
  const handleFacebookLogin = async () => {
    setLoading1(true);
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        setError('Login do Facebook cancelado pelo usuário.');
        setLoading1(false);
        return;
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        setError('Erro ao obter token de acesso do Facebook.');
        setLoading1(false);
        return;
      }
      fetchFacebookProfile(data.accessToken);
    } catch (error) {
      setError('Erro ao fazer login com o Facebook.');
      setLoading1(false);
      console.error('Facebook Login Error:', error);
    }
  };

  const checkCurrentFacebookAccessToken = async () => {
    try {
      const currentAccessToken = await AccessToken.getCurrentAccessToken();
      if (currentAccessToken) {
        console.log(
          'Token de acesso existente:',
          currentAccessToken.accessToken,
        );
        fetchFacebookProfile(currentAccessToken.accessToken);
      }
    } catch (error) {
      console.error('Erro ao verificar token de acesso existente:', error);
    }
  };

  const fetchFacebookProfile = (token: string) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: token,
        parameters: {
          fields: {
            string: 'id,name,email',
          },
        },
      },
      (error, result: any) => {
        setLoading1(false);
        if (error) {
          Alert.alert('Erro ao buscar perfil:', error.toString());
          console.error('Erro ao buscar perfil do Facebook:', error);
          setUserInfoFacebook(null); 
        } else {
          const profile: UserProfile = result;
          setUserInfo(profile);
          console.log('Perfil do Facebook obtido:', profile);
          setUserInfoFacebook(profile);
        }
      },
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.view1}>
        <Image
          source={require('../../assets/icons/logo-text.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Conecte, irrigue, colha.</Text>
      </View>

      <View style={styles.view2}>
        <TouchableOpacity
          style={styles.subscribe}
          onPress={() => navigation.navigate('SignUpScreen')}>
          <EnvelopeIcon width={24} height={24} color="#ffffff" />
          <Text style={styles.subscribeText}>Continuar com e-mail</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonAPIs}
          onPress={handleGoogleSignIn}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Image
                source={require('../../assets/icons/google.png')}
                style={{width: 24, height: 24}}
              />
              <Text style={styles.subscribeText}>
                Continuar com o {'\n'}Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonAPIs}
          onPress={handleFacebookLogin}
          disabled={loading1}>
          {loading1 ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Image
                source={require('../../assets/icons/facebook.png')}
                style={{width: 24, height: 24}}
              />
              <Text style={styles.subscribeText}>
                Continuar com o {'\n'}Facebook
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonAPIs}
          onPress={() => navigation.navigate('SmsPage')}>
          <PhoneIcon width={24} height={24} color="#ffffff" />
          <Text style={styles.subscribeText}>
            Continuar com um{'\n'}número de telefone
          </Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.description}>
            Already have an account?
            <Text style={{color: '#00CB21'}} onPress={() => navigation.navigate('EmailLoginScreen')}>
              {' '}
              Login
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  view1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  view2: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    color: 'gray',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
  },

  logo: {
    marginTop: 40,
    width: 200,
    height: 200,
  },

  subscribe: {
    backgroundColor: '#00CB21',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    flexDirection: 'row',
    gap: 10,
  },

  subscribeText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },

  buttonAPIs: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 50,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    flexDirection: 'row',
    gap: 15,
  },
});

export default WelcomeScreen;
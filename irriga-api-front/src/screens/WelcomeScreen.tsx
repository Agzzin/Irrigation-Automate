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
import {RootStackParamList} from '../types/RootStackParamList';
import {AuthToken} from '../services/auth';

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

// Configuração do Google Sign-In
const GOOGLE_CONFIG = {
  webClientId:
    '363423156217-fablvceko5uld16gjqn0605kloag1vsr.apps.googleusercontent.com',
  iosClientId:
    '363423156217-26chv84thgpuif38uh7i12fb9mpmkvot.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  scopes: ['profile', 'email'],
};

const WelcomeScreen = () => {
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userInfoFacebook, setUserInfoFacebook] = useState<UserProfile | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [loading1, setLoading1] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    Settings.initializeSDK();
    configureGoogleSignIn();
    checkCurrentFacebookAccessToken();
    checkSignedInUser();

    AuthToken.get().then(token => {
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{name: 'BottomTabs'}],
        });
      }
    });
  }, []);

  const checkSignedInUser = async () => {
    try {
      const isSignedIn = (await GoogleSignin.getCurrentUser()) !== null;
      if (isSignedIn) {
        const currentUser = await GoogleSignin.getCurrentUser();
        console.log('Usuário já logado:', currentUser);
        if (currentUser) {
          setUserInfo(currentUser);
        }
      }
    } catch (error) {
      console.log('Nenhum usuário logado ou erro ao verificar:', error);
    }
  };

  const configureGoogleSignIn = async () => {
    try {
      await GoogleSignin.configure(GOOGLE_CONFIG);
      console.log('Google Sign-In configurado com sucesso');
    } catch (error) {
      console.error('Erro na configuração do Google Sign-In:', error);
      setError('Erro na configuração do Google Sign-In');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      if (!tokens.idToken) {
        throw new Error('Token não encontrado na resposta do Google');
      }

      console.log('Login bem-sucedido:', {
        userInfo,
        idToken: tokens.idToken,
        accessToken: tokens.accessToken,
      });

      await AuthToken.set(tokens.idToken);
      navigation.reset({
        index: 0,
        routes: [{name: 'BottomTabs'}],
      });
    } catch (error: any) {
      let errorMessage = 'Erro durante o login';

      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            errorMessage = 'Login cancelado pelo usuário';
            break;
          case statusCodes.IN_PROGRESS:
            errorMessage = 'Operação já em progresso';
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            errorMessage = 'Google Play Services não disponível';
            break;
          case '12501': 
            errorMessage = 'Login cancelado';
            break;
          default:
            errorMessage = `Erro: ${error.code} - ${error.message}`;
        }
      }

      console.error('Erro detalhado:', error);
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      await AuthToken.remove();
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
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
          style={[styles.buttonAPIs, loading && styles.disabledButton]}
          onPress={handleGoogleSignIn}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Image
                source={require('../../assets/icons/google.png')}
                style={styles.icon}
              />
              <Text style={styles.subscribeText}>Continuar com o Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonAPIs, loading1 && styles.disabledButton]}
          onPress={handleFacebookLogin}
          disabled={loading1}>
          {loading1 ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Image
                source={require('../../assets/icons/facebook.png')}
                style={styles.icon}
              />
              <Text style={styles.subscribeText}>Continuar com o Facebook</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonAPIs}
          onPress={() => navigation.navigate('SmsPage')}>
          <PhoneIcon width={24} height={24} color="#ffffff" />
          <Text style={styles.subscribeText}>
            Continuar com {'\n'} número de telefone
          </Text>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View>
          <Text style={styles.description}>
            Já tem uma conta?
            <Text
              style={{color: '#00CB21'}}
              onPress={() => navigation.navigate('EmailLoginScreen')}>
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

  disabledButton: {
    opacity: 0.6,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default WelcomeScreen;

import React, { useState, useEffect } from 'react';
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
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  Settings,
  LoginManager,
} from 'react-native-fbsdk-next';
import PhoneIcon from '../../assets/icons/phone.svg';
import EnvelopeIcon from '../../assets/icons/envelope.svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';
import { AuthToken } from '../services/auth';
import {
  configureGoogleSignIn,
  signInWithGoogle,
} from '../services/GoogleAuth';

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

const WelcomeScreen = () => {
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [userInfoFacebook, setUserInfoFacebook] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [facebookLoading, setFacebookLoading] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    Settings.initializeSDK();
    configureGoogleSignIn().catch(error => {
      console.error('Erro na configuração do Google:', error);
    });
    
    checkCurrentFacebookAccessToken();
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const token = await AuthToken.get();
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabs' }],
        });
      }
    } catch (error) {
      console.error('Erro ao verificar usuário existente:', error);
    }
  };

  // --- GOOGLE SIGN-IN ---
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const userInfo = await signInWithGoogle();
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabs' }],
      });
    } catch (error: any) {
      setError(error.message);
      Alert.alert('Erro', error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  // --- FACEBOOK SIGN-IN ---
  const handleFacebookLogin = async () => {
    setFacebookLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      
      if (result.isCancelled) {
        setError('Login do Facebook cancelado pelo usuário.');
        setFacebookLoading(false);
        return;
      }
      
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        setError('Erro ao obter token de acesso do Facebook.');
        setFacebookLoading(false);
        return;
      }
      
      fetchFacebookProfile(data.accessToken);
    } catch (error) {
      setError('Erro ao fazer login com o Facebook.');
      setFacebookLoading(false);
      console.error('Facebook Login Error:', error);
    }
  };

  const checkCurrentFacebookAccessToken = async () => {
    try {
      const currentAccessToken = await AccessToken.getCurrentAccessToken();
      if (currentAccessToken) {
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
        setFacebookLoading(false);
        if (error) {
          Alert.alert('Erro ao buscar perfil:', error.toString());
          console.error('Erro ao buscar perfil do Facebook:', error);
          setUserInfoFacebook(null);
        } else {
          const profile: UserProfile = result;
          setUserInfoFacebook(profile);
          console.log('Perfil do Facebook obtido:', profile);
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
          style={[styles.buttonAPIs, googleLoading && styles.disabledButton]}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}>
          {googleLoading ? (
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
          style={[styles.buttonAPIs, facebookLoading && styles.disabledButton]}
          onPress={handleFacebookLogin}
          disabled={facebookLoading}>
          {facebookLoading ? (
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
              style={{ color: '#00CB21' }}
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

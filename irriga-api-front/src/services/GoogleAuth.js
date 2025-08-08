import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AuthToken } from './auth';

const GOOGLE_CONFIG = {
  webClientId: '363423156217-fablvceko5uld16gjqn0605kloag1vsr.apps.googleusercontent.com',
  iosClientId: '363423156217-26chv84thgpuif38uh7i12fb9mpmkvot.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  scopes: ['profile', 'email'],
};

export const configureGoogleSignIn = async () => {
  try {
    await GoogleSignin.configure(GOOGLE_CONFIG);
    console.log('Google Sign-In configurado com sucesso');
  } catch (error) {
    console.error('Erro na configuração do Google Sign-In:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();

    if (!tokens.idToken) {
      throw new Error('Token não encontrado na resposta do Google');
    }

    await AuthToken.set(tokens.idToken);
    return userInfo;
  } catch (error) {
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
    throw new Error(errorMessage);
  }
};

export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    await AuthToken.remove();
    console.log('Logout realizado com sucesso');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

export const checkSignedInUser = async () => {
  try {
    return await GoogleSignin.getCurrentUser();
  } catch (error) {
    console.log('Nenhum usuário logado ou erro ao verificar:', error);
    return null;
  }
};
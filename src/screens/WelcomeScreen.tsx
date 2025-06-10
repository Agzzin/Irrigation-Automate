import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { GoogleSignin, GoogleSigninButton, statusCodes  } from '@react-native-google-signin/google-signin';
import { GoogleUser } from '../types/GoogleUser';

const WEB_CLIENT_ID = '363423156217-fablvceko5uld16gjqn0605kloag1vsr.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: '363423156217-fablvceko5uld16gjqn0605kloag1vsr.apps.googleusercontent.com',
  offlineAccess: true, 
  iosClientId: '363423156217-26chv84thgpuif38uh7i12fb9mpmkvot.apps.googleusercontent.com', 
});

const WelcomeScreen = () => {
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
      iosClientId: WEB_CLIENT_ID,
    });
  }, []);

  const HandleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      setUserInfo(user);
      setError(null);
      console.log('User Info:', user);
      if (
        typeof user === 'object' && user !== null &&
        'idToken' in user && typeof user.idToken === 'string' &&
        'user' in user && typeof user.user === 'object' && user.user !== null &&
        'email' in user.user && typeof user.user.email === 'string'
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
  };

  return (
    <View style={styles.container}>
    <View style={styles.view1}>
      <Image source={require('../../assets/icons/logo-text.png')} style={styles.logo} />
      <Text style={styles.title}>Conecte, irrigue, colha.</Text>
    </View>

    <View style={styles.view2}>
      <TouchableOpacity style={styles.subscribe}>
        <Image source={require('../../assets/icons/envelope.png')} style={{ width: 24, height: 24}} />
        <Text style={styles.subscribeText}>Continuar com e-mail</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAPIs} onPress={HandleGoogleSignIn}>
        <Image source={require('../../assets/icons/google.png')} style={{ width: 24, height: 24 }} />
        <Text style={styles.subscribeText}>Continuar com o {'\n'}Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAPIs}>
        <Image source={require('../../assets/icons/facebook.png')} style={{ width: 24, height: 24 }} />
        <Text style={styles.subscribeText}>Continuar com o {'\n'}Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAPIs}>
        <Image source={require('../../assets/icons/apple.png')} style={{ width: 24, height: 24 }} />
        <Text style={styles.subscribeText}>Continuar com a {'\n'}Apple</Text>
      </TouchableOpacity>

      <View>
        <Text style={styles.description}>
          Already have an account? 
          <Text style={{ color: "#00CB21" }} onPress={() => {}}> Login</Text>
        </Text>
      </View>
    </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flex:1,
   backgroundColor: "#000000",

  }, 
  view1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  view2: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    color: "gray",
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
    textAlign: "center",
  },

  logo: {
    marginTop: 60,
    width: 200,
    height: 200,
  },

  subscribe:{
    backgroundColor: "#00CB21",
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    flexDirection: "row",
    gap: 10,
  },

  subscribeText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
  },

  buttonAPIs: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 50,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    flexDirection: "row",
    gap: 15,

  },
});

export default WelcomeScreen;

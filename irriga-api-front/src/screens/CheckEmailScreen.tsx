import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const CheckMailScreen = () => {
  const navigation = useNavigation();

  const openEmailApp = async () => {
    let url = '';

    if (Platform.OS === 'android') {
      url = 'googlegmail://inbox';
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        url = 'mailto:';
        const mailSupported = await Linking.canOpenURL(url);
        if (mailSupported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            'Nenhum aplicativo de e-mail encontrado',
            'Abrindo Gmail na web.',
            [
              {
                text: 'Abrir Gmail Web',
                onPress: () =>
                  Linking.openURL('https://mail.google.com/mail/u/0/#inbox'),
              },
            ],
          );
        }
      }
    } else if (Platform.OS === 'ios') {
      url = 'googlegmail://inbox';
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        url = 'message://';
        const mailSupported = await Linking.canOpenURL(url);
        if (mailSupported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            'Nenhum aplicativo de e-mail encontrado',
            'Abrindo Gmail na web.',
            [
              {
                text: 'Abrir Gmail Web',
                onPress: () =>
                  Linking.openURL('https://mail.google.com/mail/u/0/#inbox'),
              },
            ],
          );
        }
      }
    } else {
      Linking.openURL('https://mail.google.com/mail/u/0/#inbox');
    }
  };

  const handleTryAnotherEmail = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../../assets/icons/envelopeCheck.png')}
          style={styles.icon}
        />
      </View>

      <Text style={styles.title}>Verifique seu e-mail</Text>
      <Text style={styles.subtitle}>
        Enviamos instruções de recuperação de senha para seu e-mail.
      </Text>

      <TouchableOpacity style={styles.button} onPress={openEmailApp}>
        <Text style={styles.buttonText}>Abra o aplicativo de e-mail</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.skipText}>Pular, confirmo mais tarde</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Não recebeu o e-mail? Verifique seu filtro de spam, {'\n'} ou{' '}
        <Text style={styles.footerLink} onPress={handleTryAnotherEmail}>
          tente outro endereço de e-mail
        </Text>
      </Text>
    </View>
  );
};


export default CheckMailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  iconContainer: {
    backgroundColor: '#f2f2ff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#00CB21',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  skipText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 32,
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  footerLink: {
    color: '#00CB21',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

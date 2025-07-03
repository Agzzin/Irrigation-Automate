import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import FloatingLabelInput from '../components/FloatingLabelInput';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    console.log('Solicitação de redefinição enviada para:', email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/icons/mulherIcon.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Redefina sua senha</Text>
        <Text style={styles.description}>
          Insira o e-mail associado à sua conta e {'\n'}
          enviaremos um e-mail com instruções para redefinir {'\n'}
          sua senha.
        </Text>

        <View style={styles.animatedInputContainer}>
          <FloatingLabelInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#fff"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  contentContainer: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#fff',
  },
  description: {
    color: '#fff',
    textAlign: 'justify',
    marginTop: 20,
    lineHeight: 22,
  },
  animatedInputContainer: {
    marginTop: 30,
  },
  button: {
    backgroundColor: '#00CB21',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
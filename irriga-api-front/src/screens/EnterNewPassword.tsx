import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import FloatingLabelInput from '../components/FloatingLabelInput';

const EnterNewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não correspondem.');
      setLoading(false);
      return;
    }
    setError('');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    Alert.alert('Sucesso', 'Senha redefinida com sucesso!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/icons/homemIcon.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Envie sua nova senha</Text>
        <Text style={styles.description}>
          Sua nova senha deve ser diferente da senha usada anteriormente
        </Text>

        <View style={styles.animatedInputContainer}>
          <FloatingLabelInput
            label="Nova senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#fff"
          />
        </View>

        <Text style={{color:'#fff'}}>A senha deve ter no mínimo 8 caracteres</Text>

        <View style={styles.animatedInputContainer}>
          <FloatingLabelInput
            label="Confirme sua senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#fff"
          />
        </View>

        <Text style={{color:'#fff'}}>Ambas as senhas devem corresponder</Text>
        {error ? <Text style={{color: 'red', marginTop: 10}}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Resetar senha</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EnterNewPassword;

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
    marginTop: 20,
    lineHeight: 20,
  },
  animatedInputContainer: {
    marginTop: 30,
  },
  button: {
    backgroundColor: '#00CB21',
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
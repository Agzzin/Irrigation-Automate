import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const SmsScreen = () =>  {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');

  const handleSendCode = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error: any) {
      Alert.alert('Erro ao enviar SMS', error.message);
    }
  };

  const handleConfirmCode = async () => {
    try {
      if (confirm) {
        await confirm.confirm(code);
        Alert.alert('Sucesso', 'Telefone verificado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Código inválido.');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      {!confirm ? (
        <>
          <TextInput
            placeholder="+55 11 91234-5678"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={{ borderBottomWidth: 1, marginBottom: 12 }}
          />
          <Button title="Enviar código SMS" onPress={handleSendCode} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Código recebido"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            style={{ borderBottomWidth: 1, marginBottom: 12 }}
          />
          <Button title="Confirmar código" onPress={handleConfirmCode} />
        </>
      )}
    </View>
  );
}

export default SmsScreen;
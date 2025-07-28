import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { z } from 'zod';
import { codeSchema, phoneSchema } from '../controllers/zodSchema';





const SmsScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');
  const [errorPhone, setErrorPhone] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const handleSendCode = async () => {
    const validation = phoneSchema.safeParse({ phoneNumber });
    if (!validation.success) {
      setErrorPhone(validation.error.issues[0].message);
      return;
    }

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert('Código enviado', 'Verifique suas mensagens.');
    } catch (err) {
      Alert.alert('Erro', 'Falha ao enviar o SMS.');
    }
  };

  const handleConfirmCode = async () => {
    const validation = codeSchema.safeParse({ code });
    if (!validation.success) {
      setErrorCode(validation.error.issues[0].message);
      return;
    }

    try {
      if (confirm) {
        await confirm.confirm(code);
        Alert.alert('Sucesso', 'Telefone verificado com sucesso!');
      } else {
        Alert.alert('Erro', 'Nenhuma confirmação pendente.');
      }
    } catch (err) {
      Alert.alert('Erro', 'Código inválido.');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#000' }}>
      <View style={{ marginTop: 50, alignItems: 'center' }}>
        <Image
          source={require('../../assets/icons/verifynumber.png')}
          style={{ width: 430, height: 280 }}
        />
        
        <Text style={{ color: '#fff', fontSize: 16, marginTop: 20 }}>Número de telefone</Text>
        <TextInput
          style={{
            borderBottomWidth: 1,
            borderColor: '#296C32',
            color: '#fff',
            width: 250,
            fontSize: 18,
            textAlign: 'center',
            marginTop: 8,
          }}
          placeholder="+5511999999999"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            setErrorPhone(null);
          }}
        />
        {errorPhone && <Text style={{ color: 'red', marginTop: 5 }}>{errorPhone}</Text>}

        <TouchableOpacity
          style={{
            padding: 12,
            marginTop: 20,
            backgroundColor: '#296C32',
            paddingHorizontal: 40,
            borderRadius: 10,
          }}
          onPress={handleSendCode}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Enviar código</Text>
        </TouchableOpacity>

        <Text style={{ color: '#fff', fontSize: 16, marginTop: 30 }}>Código de verificação</Text>
        <TextInput
          style={{
            borderBottomWidth: 1,
            borderColor: '#296C32',
            color: '#fff',
            width: 150,
            fontSize: 18,
            textAlign: 'center',
            marginTop: 8,
          }}
          placeholder="Ex: 123456"
          placeholderTextColor="#888"
          keyboardType="numeric"
          maxLength={6}
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setErrorCode(null);
          }}
        />
        {errorCode && <Text style={{ color: 'red', marginTop: 5 }}>{errorCode}</Text>}

        <TouchableOpacity
          style={{
            padding: 12,
            marginTop: 20,
            backgroundColor: '#296C32',
            paddingHorizontal: 40,
            borderRadius: 10,
          }}
          onPress={handleConfirmCode}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Confirmar</Text>
        </TouchableOpacity>

        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 14, marginTop: 60 }}>
          Seus dados estão protegidos.
        </Text>
        <Text style={{ color: '#296C32', textAlign: 'center', fontSize: 14 }}>
          Nunca compartilharemos seu número.
        </Text>
      </View>
    </View>
  );
};

export default SmsScreen;

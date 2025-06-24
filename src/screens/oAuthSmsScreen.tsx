import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const SmsScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');

  const hasText = text.length > 0;

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
    <View style={{flex: 1, alignItems: 'center', backgroundColor: '#000000'}}>
      <View style={{marginTop: 80, alignItems: 'center'}}>
        <Image
          source={require('../../assets/icons/verifyNumberSemVer.png')}
          style={{width: 430, height: 280}}
        />
        <Text
          style={{
            fontSize: 17,
            fontWeight: 'bold',
            color: '#ffffff',
            marginTop: 20,
          }}>
          Login com número de telefone
        </Text>
        <Text
          style={{
            color: 'gray',
            textAlign: 'center',
            marginTop: 5,
            marginBottom: 25,
          }}>
          Informe seu celular para enviarmos um {'\n'} código de verificação.
        </Text>
        <TextInput
          style={{
            borderBottomWidth: 1,
            borderColor: '#296C32',
            color: hasText ? '#ffffff' : '#ffffff', 
          }}
          placeholder="Ex: 99 999999999"
          placeholderTextColor="#ffffff"
          keyboardType="numeric"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity
          style={{
            padding: 15,
            marginTop: 20,
            backgroundColor: '#296C32',
            paddingHorizontal: 40,
            borderRadius: 10,
          }} onPress={handleSendCode}>
          <Text style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold'}}>
            Enviar verificação
          </Text>
        </TouchableOpacity>

        <Text style={{color:'#ffffff', textAlign:'center', fontSize:14, marginTop:60,}}>Usamos seu número apenas para verificação de segurança.</Text>
        <Text style={{color:'#296C32', textAlign:'center', fontSize:14}}>verificação de segurança.</Text>
      </View>
    </View>
  );
};

export default SmsScreen;

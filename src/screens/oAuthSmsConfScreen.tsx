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
          source={require('../../assets/icons/verifynumber.png')}
          style={{width: 430, height: 280}}
        />
        <Text
          style={{
            fontSize: 17,
            fontWeight: 'bold',
            color: '#ffffff',
            marginTop: 20,
          }}>
          Insira o codigo de validação
        </Text>
        <Text
          style={{
            color: 'gray',
            textAlign: 'center',
            marginTop: 5,
            marginBottom: 25,
          }}>
          Confirme o codigo de vericação{'\n'} enviado em sua caixa de mensagens
        </Text>
        <TextInput
          style={{
            borderBottomWidth: 1,
            borderColor: '#296C32',
            color: hasText ? '#ffffff' : '#ffffff',
          }}
          placeholder="Ex: 555555"
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
          }}
          onPress={handleConfirmCode}>
          <Text style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold'}}>
            Confirmar verificação
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: '#ffffff',
            textAlign: 'center',
            fontSize: 14,
            marginTop: 60,
          }}>
          Seus dados estão protegidos. 
        </Text>
        <Text style={{color: '#296C32', textAlign: 'center', fontSize: 14}}>
          Nunca compartilharemos seu número.
        </Text>
      </View>
    </View>
  );
};

export default SmsScreen;

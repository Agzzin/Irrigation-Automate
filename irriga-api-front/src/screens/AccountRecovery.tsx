import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons  from 'react-native-vector-icons/Ionicons';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState('');

  const handleSendInstructions = () => {
    console.log('Send instructions to:', email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Reset password</Text>
      <Text style={styles.description}>
        Enter the email associated with your account and we’ll send an email with instructions to reset your password.
      </Text>

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor="#fff"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSendInstructions}>
        <Text style={styles.buttonText}>Send Instructions</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color:'#fff'
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color:'#fff'
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#00CB21', 
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

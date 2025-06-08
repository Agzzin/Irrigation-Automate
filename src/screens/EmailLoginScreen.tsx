import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";

const EmailLoginScreen = () => {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/icons/bola-verde.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>
          Welcome Back,{"\n"}
          <Text style={styles.subtitle}>Log in!</Text>
        </Text>
      </View>

      <View>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        <View style={styles.optionsRow}>
          <View style={styles.rememberMe}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: "#767577", true: "#00CB21" }}
              thumbColor={rememberMe ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              style={{ transform: [{ scaleX: 1.0 }, { scaleY: 0.8 }] }} 
            />
            <Text style={styles.rememberMeText}>Lembrar-me</Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.buttonEntrar}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmailLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 410,
    height: 400,
    marginBottom: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "bold",
    position: "absolute",
    textAlign: "center",
    width: 410,
    height: 400,
    paddingTop: 40,
    paddingRight: 140,
  },
  subtitle: {
    color: "#ffffff",
    fontSize: 80,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#000",
    color: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 18,
    marginBottom: 16,
    marginHorizontal: 24,
    borderWidth: 1,
    borderRadius: 8,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 16,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  forgotText: {
    color: "#00CB21",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  buttonEntrar: {
    backgroundColor: "#00CB21",
    borderRadius: 50,
    padding: 12,
    marginTop: 30,
    marginHorizontal: 70,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

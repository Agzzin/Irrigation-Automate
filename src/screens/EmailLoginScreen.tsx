import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  Animated,
  KeyboardTypeOptions,
} from "react-native";

type FloatingLabelInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  placeholderTextColor?: string;
  [key: string]: any;
};

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  placeholderTextColor = "#aaa", 
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: 30,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 14],
    }),
    color: isFocused ? "#00CB21" : placeholderTextColor,
    backgroundColor: "#000",
    paddingHorizontal: 4,
    zIndex: 2,
  };

  return (
    <View style={{ marginBottom: 24, marginHorizontal: 24, paddingTop: 8 }}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
    </View>
  );
};

const EmailLoginScreen = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <FloatingLabelInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#fff"
        />
        <FloatingLabelInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          keyboardType="default"
          autoCapitalize="none"
          placeholderTextColor="#fff"
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
    borderWidth: 0,
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

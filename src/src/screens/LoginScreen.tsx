import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { login } from "../services/firebaseService";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async () => {
    if (!email || !pass) {
      Alert.alert("Please fill in all fields");
      return;
    }

    try {
      const res = await login(email, pass);

      navigation.replace("Home", {
        user: res.user,
        isNew: false
      });

    } catch (e: any) {
      Alert.alert("Login Failed", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        placeholderTextColor="#7f7f9a"
      />

      <TextInput
        placeholder="Password"
        value={pass}
        secureTextEntry
        onChangeText={setPass}
        style={styles.input}
        placeholderTextColor="#7f7f9a"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6ff", // soft white-lavender
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5b3e96", // deep purple
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: "#8c7aa9", // lighter lavender
    marginBottom: 24
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#d3c4f1",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  button: {
    width: "100%",
    backgroundColor: "#6a4bdc",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
    shadowColor: "#6a4bdc",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  link: {
    color: "#5b3e96",
    fontSize: 14,
    marginTop: 8
  }
});

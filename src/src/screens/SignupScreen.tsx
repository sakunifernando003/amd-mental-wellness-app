import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { signup } from "../services/firebaseService";

export default function SignupScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSignup = async () => {
    if (!username || !email || !pass) {
      Alert.alert("Fill all fields");
      return;
    }

    try {
      const res = await signup(email, pass, username);

      navigation.replace("Home", {
        user: res.user,
        isNew: true
      });

    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join us and start your journey 🌱</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#7f7f9a"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
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

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#5b3e96", // deep purple
    marginBottom: 4
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

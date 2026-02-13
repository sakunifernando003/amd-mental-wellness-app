import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
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
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={pass}
        secureTextEntry
        onChangeText={setPass}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <Button title="Login" onPress={handleLogin} />
      <Button title="Signup" onPress={() => navigation.navigate("Signup")} />
    </View>
  );
}

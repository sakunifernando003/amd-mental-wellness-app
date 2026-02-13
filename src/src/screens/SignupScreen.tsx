import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
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
      // ✅ Signup handles everything now
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
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Create Account
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}

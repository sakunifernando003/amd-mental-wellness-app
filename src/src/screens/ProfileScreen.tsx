import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { getUserProfile, updateUsername } from "../services/firebaseService";

export default function ProfileScreen({ route, navigation }: any) {
  const { user } = route.params;
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.username) setUsername(profile.username);
      } catch (e: any) {
        Alert.alert("Error", e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.uid]);

  const handleUpdate = async () => {
    if (!username.trim()) {
      Alert.alert("Username cannot be empty");
      return;
    }

    try {
      await updateUsername(user.uid, username.trim());
      Alert.alert("Success", "Username updated!");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Your Profile</Text>

      <Text style={{ fontSize: 16, fontWeight: "600" }}>Email:</Text>
      <Text style={{ marginBottom: 12 }}>{user.email}</Text>

      <Text style={{ fontSize: 16, fontWeight: "600" }}>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, borderRadius: 6, marginBottom: 12 }}
      />

      <Button title="Update Username" onPress={handleUpdate} />
    </View>
  );
}

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import { addMood, getMoods, getUserProfile } from "../services/firebaseService";
import { useIsFocused } from "@react-navigation/native";

export default function HomeScreen({ route, navigation }: any) {
  const { user, isNew } = route.params;
  const isFocused = useIsFocused(); // Detect screen focus

  const [username, setUsername] = useState(user.displayName || "Friend");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [list, setList] = useState<any[]>([]);

  // Load moods
  const load = async () => {
    const data = await getMoods(user.uid);
    setList(data);
  };

  // Save a new mood
  const save = async () => {
    if (!mood.trim()) {
      Alert.alert("Please enter a mood");
      return;
    }
    await addMood(user.uid, mood.trim(), note.trim());
    setMood("");
    setNote("");
    load();
  };

  // Fetch latest username when screen focuses
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.username) setUsername(profile.username);
      } catch (e: any) {
        Alert.alert("Error", e.message);
      }
    };

    fetchUsername();
    load();
  }, [user.uid, isFocused]);

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        {isNew
          ? `Welcome ${username} 🌱`
          : `Hey, welcome back ${username} 👋`}
      </Text>

      <TextInput
        placeholder="Mood"
        value={mood}
        onChangeText={setMood}
        style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
      />

      <TextInput
        placeholder="Note"
        value={note}
        onChangeText={setNote}
        style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
      />

      <Button title="Save Mood" onPress={save} />
      <View style={{ marginTop: 8 }}>
        <Button title="Load My Moods" onPress={load} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button
          title="My Profile"
          onPress={() => navigation.navigate("Profile", { user })}
        />
      </View>

      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        style={{ marginTop: 12 }}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              padding: 10,
              marginTop: 10,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Mood: {item.mood}</Text>
            <Text>Note: {item.note}</Text>
          </View>
        )}
      />
    </View>
  );
}

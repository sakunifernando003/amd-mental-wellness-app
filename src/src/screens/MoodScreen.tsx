import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { addMood, getMoods } from "../services/firebaseService";

export default function MoodScreen({ route }: any) {
  const { user } = route.params;

  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [list, setList] = useState<any[]>([]);

  // Load existing moods
  const loadMoods = async () => {
    try {
      const data = await getMoods(user.uid);
      setList(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // Save new mood
  const saveMood = async () => {
    if (!mood.trim()) {
      Alert.alert("Please enter a mood");
      return;
    }
    try {
      await addMood(user.uid, mood.trim(), note.trim());
      setMood("");
      setNote("");
      loadMoods();
      Alert.alert("Saved!", "Your mood has been saved successfully.");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  useEffect(() => {
    loadMoods();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Mood</Text>

      <TextInput
        placeholder="Mood"
        value={mood}
        onChangeText={setMood}
        style={styles.input}
      />

      <TextInput
        placeholder="Note (optional)"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveMood}>
        <Text style={styles.saveButtonText}>Save Mood</Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>Mood History</Text>

      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.moodItem}>
            <Text style={{ fontWeight: "600" }}>Mood: {item.mood}</Text>
            {item.note ? <Text>Note: {item.note}</Text> : null}
            <Text style={{ fontSize: 12, color: "#6a4bdc", marginTop: 4 }}>
              {new Date(item.date.seconds ? item.date.seconds * 1000 : item.date).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6a4bdc",
    marginBottom: 20
  },
  input: {
    width: "100%",
    backgroundColor: "#f8f6ff",
    borderColor: "#d3c4f1",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  saveButton: {
    backgroundColor: "#6a4bdc",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5b3e96",
    marginBottom: 12
  },
  moodItem: {
    borderWidth: 1,
    borderColor: "#d3c4f1",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f3edff"
  }
});

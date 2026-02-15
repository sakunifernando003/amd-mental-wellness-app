// src/screens/MoodScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { addMood, getMoods } from "../services/firebaseService";

const MOODS = ["😄", "😢", "😌", "😡", "🤯", "🥱", "😍", "😭", "😎"];

export default function MoodScreen({ route }: any) {
  const { uid } = route.params;
  const [mood, setMood] = useState<string>("");
  const [list, setList] = useState<{ id: string; mood: string; date: string }[]>([]);

  const loadMoods = async () => {
    const data = await getMoods(uid);
    setList(data);
  };

  useEffect(() => {
    loadMoods();
  }, []);

  const saveMood = async () => {
    if (!mood) return Alert.alert("Pick a mood first 🙂");
    await addMood(uid, mood);
    setMood("");
    loadMoods();
  };

  // Calendar markings
  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    list.forEach(item => {
      if (item.date) {
        marked[item.date] = { marked: true, dotColor: "#6a4bdc" };
      }
    });
    return marked;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Mood 🌞</Text>

      <Calendar
        markedDates={getMarkedDates()}
        style={{ borderRadius: 12, marginBottom: 16 }}
      />

      <Text style={styles.label}>How do you feel?</Text>
      <View style={styles.emojiRow}>
        {MOODS.map(e => (
          <TouchableOpacity
            key={e}
            onPress={() => setMood(e)}
            style={[styles.emojiBtn, mood === e && styles.emojiSelected]}
          >
            <Text style={{ fontSize: 26 }}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={saveMood}>
        <Text style={styles.buttonText}>Save Mood</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, color: "#6a4bdc" },
  label: { fontWeight: "600", marginBottom: 6 },
  emojiRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  emojiBtn: { padding: 10, margin: 6, borderRadius: 12, backgroundColor: "#eee" },
  emojiSelected: { backgroundColor: "#6a4bdc55" },
  button: { backgroundColor: "#6a4bdc", padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
});

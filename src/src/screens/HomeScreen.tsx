import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { addMood, getMoods, getUserProfile } from "../services/firebaseService";
import { useIsFocused } from "@react-navigation/native";

export default function HomeScreen({ route, navigation }: any) {
  const { user, isNew } = route.params;
  const isFocused = useIsFocused();

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

  // Fetch latest username and moods when screen focuses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.username) setUsername(profile.username);
      } catch (e: any) {
        Alert.alert("Error", e.message);
      }
      load();
    };
    fetchData();
  }, [user.uid, isFocused]);

  // Card data for dashboard
  const cards = [
    { id: '1', title: "Journal", subtitle: "Write your thoughts", color: "#8c7aa9", navigate: () => navigation.navigate("Journal", { user }) },
    { id: '2', title: "Mood", subtitle: "Track your feelings", color: "#6a4bdc", navigate: () => {} },
    { id: '3', title: "Meditation", subtitle: "Relax & focus", color: "#b49be1", navigate: () => navigation.navigate("Meditation") },
    { id: '4', title: "Goals", subtitle: "Set & achieve", color: "#9c78d8", navigate: () => navigation.navigate("Goals", { user }) },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Greeting Card */}
      <View style={styles.greetingCard}>
        <Text style={styles.greetingText}>
          {isNew ? `Welcome ${username} 🌱` : `Hey, welcome back ${username} 👋`}
        </Text>
      </View>

      {/* Dashboard Cards */}
      <View style={styles.cardContainer}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, { backgroundColor: card.color }]}
            onPress={card.navigate}
          >
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mood Tracker */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Track Mood</Text>
        <TextInput
          placeholder="Mood"
          value={mood}
          onChangeText={setMood}
          style={styles.input}
        />
        <TextInput
          placeholder="Note"
          value={note}
          onChangeText={setNote}
          style={styles.input}
        />
        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Text style={styles.saveButtonText}>Save Mood</Text>
        </TouchableOpacity>
      </View>

      {/* Mood History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Moods</Text>
        <FlatList
          data={list}
          keyExtractor={(i) => i.id}
          style={{ marginTop: 8 }}
          renderItem={({ item }) => (
            <View style={styles.moodItem}>
              <Text style={{ fontWeight: "600" }}>Mood: {item.mood}</Text>
              <Text>Note: {item.note}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20
  },
  greetingCard: {
    backgroundColor: "#f3edff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#6a4bdc",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6a4bdc"
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20
  },
  card: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#fff"
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#5b3e96"
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
    alignItems: "center"
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  moodItem: {
    borderWidth: 1,
    borderColor: "#d3c4f1",
    borderRadius: 10,
    padding: 12,
    marginTop: 10
  }
});

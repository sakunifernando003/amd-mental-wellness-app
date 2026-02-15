import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";

const MEDITATIONS = [
  { id: "1", title: "Morning Calm", duration: "5 min", image: "https://img.freepik.com/free-vector/flat-illustration-international-yoga-day-celebration_23-2150344113.jpg?semt=ais_hybrid&w=740&q=80" },
  { id: "2", title: "Focus & Clarity", duration: "10 min", image: "https://png.pngtree.com/png-vector/20230808/ourmid/pngtree-woman-meditating-clipart-girl-sitting-in-lotus-pose-cartoon-vector-png-image_6868453.png" },
  { id: "3", title: "Stress Relief", duration: "7 min", image: "https://www.shutterstock.com/image-vector/woman-meditates-nature-leaves-conceptual-260nw-2575338191.jpg" },
  { id: "4", title: "Sleep Meditation", duration: "15 min", image: "https://img.freepik.com/free-vector/meditating-concept-with-hand-drawn-woman_23-2147857478.jpg?semt=ais_hybrid&w=740&q=80" },
];

export default function MeditationScreen() {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meditate 🧘‍♀️</Text>
      <FlatList
        data={MEDITATIONS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", color: "#6a4bdc", marginBottom: 16 },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f3edff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
  },
  image: { width: 80, height: 80 },
  textContainer: { flex: 1, padding: 12, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#6a4bdc" },
  duration: { fontSize: 14, color: "#6a4bdc99", marginTop: 4 },
});

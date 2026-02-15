import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { getUserProfile } from "../services/firebaseService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation, route }: Props) {
  const { user, isNew } = route.params;
  const [username, setUsername] = useState(user.displayName || "Friend");

  // Fetch latest username on mount
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
  }, [user.uid]);

  const cards = [
    {
      id: "1",
      title: "Journal",
      subtitle: "your thoughts",
      color: "#8c7aa9",
      navigate: () => navigation.navigate("Journal", { user }),
    },
    {
      id: "2",
      title: "Mood",
      subtitle: "how you feel",
      color: "#6a4bdc",
      navigate: () => navigation.navigate("Mood", { user }),
    },
    {
      id: "3",
      title: "Meditation",
      subtitle: "relax & focus",
      color: "#b49be1",
      navigate: () => navigation.navigate("Meditation"),
    },
    {
      id: "4",
      title: "Goals",
      subtitle: "set & achieve",
      color: "#9c78d8",
      navigate: () => navigation.navigate("Goals", { user }),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <View style={styles.greetingCard}>
        <Text style={styles.greetingText}>
          {isNew ? `Welcome ${username} 🌱` : `Welcome back ${username} 👋`}
        </Text>
      </View>

      {/* App Logo */}
      <Image
        source={{ uri: "https://static.vecteezy.com/system/resources/previews/034/601/630/non_2x/ai-generated-meditation-free-png.png" }} // Replace with your logo URL or local asset
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Cards */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "flex-start",
  },
  greetingCard: {
    backgroundColor: "#f3edff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#6a4bdc",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6a4bdc",
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#fff",
  },
});

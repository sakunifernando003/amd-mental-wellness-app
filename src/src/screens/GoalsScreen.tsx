import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, Modal } from "react-native";
import { addGoal, getGoals, updateGoal, deleteGoal } from "../services/firebaseService";

type Goal = {
  id: string;
  uid: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
};

export default function GoalsScreen({ route }: any) {
  const { user } = route.params;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<Goal | null>(null);

  const loadGoals = async () => {
    const data = await getGoals(user.uid);
    setGoals(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const saveGoal = async () => {
    if (!title.trim()) return Alert.alert("Title cannot be empty");

    if (editing) {
      await updateGoal(editing.id, { title, description });
      setEditing(null);
    } else {
      await addGoal(user.uid, title, description);
    }

    setTitle("");
    setDescription("");
    setModalVisible(false);
    loadGoals();
  };

  const editGoal = (goal: Goal) => {
    setEditing(goal);
    setTitle(goal.title);
    setDescription(goal.description || "");
    setModalVisible(true);
  };

  const removeGoal = (id: string) => {
    Alert.alert("Delete Goal?", "Are you sure you want to delete this goal?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        await deleteGoal(id);
        loadGoals();
      } }
    ]);
  };

  const toggleComplete = async (goal: Goal) => {
    await updateGoal(goal.id, { completed: !goal.completed });
    loadGoals();
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Goals 🎯</Text>

      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addText}>+ Add Goal</Text>
      </TouchableOpacity>

      <FlatList
        data={goals}
        keyExtractor={i => i.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.goalItem, item.completed && { backgroundColor: "#d4f8d4" }]}>
            <TouchableOpacity onPress={() => toggleComplete(item)}>
              <Text style={styles.goalTitle}>{item.title}</Text>
            </TouchableOpacity>
            {item.description ? <Text style={styles.goalDesc}>{item.description}</Text> : null}
            <View style={styles.row}>
              <TouchableOpacity onPress={() => editGoal(item)}><Text style={styles.editBtn}>Edit</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => removeGoal(item.id)}><Text style={styles.deleteBtn}>Delete</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{editing ? "Edit Goal" : "New Goal"}</Text>
          <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput placeholder="Description (optional)" value={description} onChangeText={setDescription} style={styles.input} multiline />

          <TouchableOpacity style={styles.saveBtn} onPress={saveGoal}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: "#ccc", marginTop: 10 }]} onPress={() => { setModalVisible(false); setTitle(""); setDescription(""); setEditing(null); }}>
            <Text style={[styles.saveText, { color: "#333" }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", color: "#6a4bdc" },
  addBtn: { backgroundColor: "#6a4bdc", padding: 14, borderRadius: 12, marginTop: 12, alignItems: "center" },
  addText: { color: "#fff", fontWeight: "600" },
  goalItem: { backgroundColor: "#f6f2ff", padding: 14, borderRadius: 12, marginBottom: 12 },
  goalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  goalDesc: { fontSize: 14, color: "#555", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  editBtn: { color: "#6a4bdc", fontWeight: "600" },
  deleteBtn: { color: "#ff4d4f", fontWeight: "600" },
  modal: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#6a4bdc", marginBottom: 12 },
  input: { backgroundColor: "#f6f2ff", borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: "#d8ccff" },
  saveBtn: { backgroundColor: "#6a4bdc", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 12 },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

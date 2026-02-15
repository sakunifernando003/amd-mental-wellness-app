// src/screens/JournalScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  addJournalEntry,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
  uploadImage,
  JournalEntry,
} from "../services/firebaseService";

type Props = {
  route: {
    params: {
      user: { uid: string; displayName?: string };
    };
  };
};

export default function JournalScreen({ route }: Props) {
  const { user } = route.params;

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [note, setNote] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Load entries
  const loadEntries = async () => {
    const data = await getJournalEntries(user.uid);
    setEntries(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    loadEntries();
  }, []);

  // Pick Image
  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed for gallery");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  // Open Camera
  const openCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Camera permission needed");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  // Save Entry (Create or Update)
  const saveEntry = async () => {
    if (!note.trim()) return Alert.alert("Write something first!");

    let imgUrl: string | undefined = undefined;
    if (image) {
      imgUrl = await uploadImage(image, `journals/${user.uid}/${Date.now()}`);
    }

    if (editing) {
      await updateJournalEntry(editing.id, note, imgUrl);
      setEditing(null);
    } else {
      await addJournalEntry(user.uid, note, imgUrl);
    }

    setNote("");
    setImage(null);
    setModalVisible(false);
    loadEntries();
  };

  // Delete Entry
  const deleteEntry = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteJournalEntry(id);
          loadEntries();
        },
      },
    ]);
  };

  // Edit Entry
  const editEntry = (entry: JournalEntry) => {
    setEditing(entry);
    setNote(entry.text);
    setImage(entry.image ?? null);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal 🪶</Text>

      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addText}>+ Add Entry</Text>
      </TouchableOpacity>

      <FlatList
        data={entries}
        keyExtractor={(i) => i.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
            <Text style={styles.entryText}>{item.text}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.entryImg} />}
            <View style={styles.row}>
              <TouchableOpacity onPress={() => editEntry(item)}>
                <Text style={styles.editBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteEntry(item.id)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal for Create/Edit */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{editing ? "Edit Entry" : "New Entry"}</Text>
          <TextInput
            placeholder="Write your thoughts..."
            value={note}
            onChangeText={setNote}
            multiline
            style={styles.input}
          />
          {image && <Image source={{ uri: image }} style={styles.preview} />}

          <View style={styles.row}>
            <TouchableOpacity style={styles.buttonLight} onPress={pickImage}>
              <Text style={styles.buttonTextDark}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonLight} onPress={openCamera}>
              <Text style={styles.buttonTextDark}>Camera</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={saveEntry}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: "#ccc", marginTop: 10 }]}
            onPress={() => {
              setModalVisible(false);
              setNote("");
              setImage(null);
              setEditing(null);
            }}
          >
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
  entry: { backgroundColor: "#f6f2ff", padding: 14, borderRadius: 12, marginBottom: 12 },
  date: { fontSize: 12, color: "gray", marginBottom: 4 },
  entryText: { fontSize: 15, marginBottom: 8 },
  entryImg: { width: "100%", height: 140, borderRadius: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  editBtn: { color: "#6a4bdc", fontWeight: "600" },
  deleteBtn: { color: "#ff4d4f", fontWeight: "600" },
  modal: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#6a4bdc", marginBottom: 12 },
  input: { backgroundColor: "#f6f2ff", borderRadius: 14, padding: 15, height: 120, textAlignVertical: "top", borderColor: "#d8ccff", borderWidth: 1 },
  preview: { width: "100%", height: 160, borderRadius: 12, marginTop: 12 },
  buttonLight: { backgroundColor: "#efe7ff", padding: 14, borderRadius: 12, width: "48%", alignItems: "center", marginTop: 12 },
  buttonTextDark: { color: "#5b3e96", fontWeight: "600" },
  saveBtn: { backgroundColor: "#6a4bdc", padding: 16, borderRadius: 14, alignItems: "center", marginTop: 12 },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

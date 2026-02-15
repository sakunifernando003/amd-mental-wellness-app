// src/services/firebaseService.ts
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc 
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../config/firebaseConfig";

// ---------- INIT SERVICES ----------
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ---------- TYPES ----------
export type JournalEntry = {
  id: string;
  text: string;
  image?: string | null;
  date: string;
};

export type MoodEntry = {
  id: string;
  mood: string;
  note: string;
  date: string;
};

// ------------------- AUTH -------------------

// SIGNUP WITH USERNAME
export const signup = async (email: string, password: string, username: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  // update display name in auth
  await updateProfile(res.user, { displayName: username });

  // store user profile in firestore
  await setDoc(doc(db, "users", res.user.uid), {
    email,
    username,
    createdAt: new Date().toISOString(),
  });

  return res;
};

// LOGIN
export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// GET USER PROFILE
export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// UPDATE USERNAME
export const updateUsername = async (uid: string, username: string) => {
  await updateDoc(doc(db, "users", uid), { username });
  if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: username });
};

// ------------------- MOODS -------------------

// src/services/firebaseService.ts

// ✅ ADD MOOD
export const addMood = async (uid: string, mood: string) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  await addDoc(collection(db, "moods"), {
    uid,
    mood,
    date: today,
  });
};

// ✅ GET MOODS
export const getMoods = async (uid: string) => {
  const q = query(collection(db, "moods"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      mood: data.mood,
      date: data.date, // already YYYY-MM-DD from addMood
    };
  });
};

// ------------------- JOURNAL -------------------

// UPLOAD IMAGE
export const uploadImage = async (uri: string, path: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};

// ADD JOURNAL ENTRY
export const addJournalEntry = async (uid: string, text: string, image?: string) => {
  await addDoc(collection(db, "journals"), {
    uid,
    text,
    image: image ?? null,
    date: new Date().toISOString(),
  });
};

// GET JOURNAL ENTRIES
export const getJournalEntries = async (uid: string): Promise<JournalEntry[]> => {
  const q = query(collection(db, "journals"), where("uid", "==", uid));
  const snap = await getDocs(q);

  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      text: data.text ?? "",
      image: data.image ?? null,
      date: data.date ?? new Date().toISOString(),
    };
  });
};

// UPDATE JOURNAL ENTRY
export const updateJournalEntry = async (id: string, text: string, image?: string) => {
  await updateDoc(doc(db, "journals", id), {
    text,
    image: image ?? null,
    date: new Date().toISOString(),
  });
};

// DELETE JOURNAL ENTRY
export const deleteJournalEntry = async (id: string) => {
  await deleteDoc(doc(db, "journals", id));
};


//=======GOALS=========
// src/services/firebaseService.ts

// ---------- TYPES ----------
export type GoalEntry = {
  id: string;
  title: string;
  description?: string;
  date: string;
};

// ---------- GOALS CRUD ----------

// ------------------- GOALS -------------------

// Add a new goal
export const addGoal = async (uid: string, title: string, description?: string) => {
  await addDoc(collection(db, "goals"), {
    uid,
    title,
    description: description || "",
    completed: false,
    date: new Date().toISOString(),
  });
};

// Get all goals for a user
export const getGoals = async (uid: string) => {
  const q = query(collection(db, "goals"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    uid,
    title: d.data().title,
    description: d.data().description,
    completed: d.data().completed,
    date: d.data().date,
  }));
};

// Update a goal
export const updateGoal = async (id: string, data: { title?: string; description?: string; completed?: boolean }) => {
  await updateDoc(doc(db, "goals", id), data);
};

// Delete a goal
export const deleteGoal = async (id: string) => {
  await deleteDoc(doc(db, "goals", id));
};


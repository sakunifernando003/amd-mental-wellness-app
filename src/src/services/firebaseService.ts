import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
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
  where
} from "firebase/firestore";

import { app } from "../config/firebaseConfig";

export const auth = getAuth(app);
export const db = getFirestore(app);



// ✅ SIGNUP WITH USERNAME
export const signup = async (
  email: string,
  password: string,
  username: string
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  // Save displayName in Auth
  await updateProfile(res.user, {
    displayName: username
  });

  // Save profile in Firestore
  await setDoc(doc(db, "users", res.user.uid), {
    email,
    username,
    createdAt: new Date()
  });

  return res;
};



// ✅ LOGIN
export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);



// ✅ GET USER PROFILE
export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};



// ✅ UPDATE USERNAME
export const updateUsername = async (uid: string, username: string) => {
  await updateDoc(doc(db, "users", uid), { username });

  // also update Auth displayName
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: username
    });
  }
};



// ✅ ADD MOOD
export const addMood = async (
  uid: string,
  mood: string,
  note: string
) => {
  await addDoc(collection(db, "moods"), {
    uid,
    mood,
    note,
    date: new Date()
  });
};



// ✅ GET MOODS
export const getMoods = async (uid: string) => {
  const q = query(collection(db, "moods"), where("uid", "==", uid));
  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
};

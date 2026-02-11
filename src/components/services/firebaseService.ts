import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { app } from "../../../firebaseConfig";

export const auth = getAuth(app);
export const db = getFirestore(app);

export const signup = (email:string,password:string)=>
  createUserWithEmailAndPassword(auth,email,password);

export const login = (email:string,password:string)=>
  signInWithEmailAndPassword(auth,email,password);

export const addMood = async (uid:string,mood:string,note:string)=>{
  await addDoc(collection(db,"moods"),{
    uid,mood,note,date:new Date()
  });
};

export const getMoods = async (uid:string)=>{
  const q = query(collection(db,"moods"),where("uid","==",uid));
  const snap = await getDocs(q);
  return snap.docs.map(d=>({id:d.id,...d.data()}));
};

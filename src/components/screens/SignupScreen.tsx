import React,{useState} from "react";
import {View,Text,TextInput,Button,Alert} from "react-native";
import {signup} from "../services/firebaseService";

export default function SignupScreen({navigation}:any){
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");

  const handleSignup=async()=>{
    try{
      const res=await signup(email,pass);
      navigation.replace("Home",{user:res.user});
    }catch(e:any){
      Alert.alert("Error",e.message);
    }
  };

  return(
    <View style={{padding:20,gap:10}}>
      <Text>Signup</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} style={{borderWidth:1,padding:8}}/>
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPass} style={{borderWidth:1,padding:8}}/>
      <Button title="Create Account" onPress={handleSignup}/>
    </View>
  );
}

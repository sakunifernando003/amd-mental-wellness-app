import React,{useState} from "react";
import {View,Text,TextInput,Button,FlatList} from "react-native";
import {addMood,getMoods} from "../services/firebaseService";

export default function HomeScreen({route}:any){
  const user=route.params.user;
  const [mood,setMood]=useState("");
  const [note,setNote]=useState("");
  const [list,setList]=useState<any[]>([]);

  const save=async()=>{
    await addMood(user.uid,mood,note);
    setMood("");setNote("");
    load();
  };

  const load=async()=>{
    const data=await getMoods(user.uid);
    setList(data);
  };

  return(
    <View style={{padding:20,gap:10}}>
      <Text>Welcome {user.email}</Text>

      <TextInput placeholder="Mood" value={mood} onChangeText={setMood} style={{borderWidth:1,padding:8}}/>
      <TextInput placeholder="Note" value={note} onChangeText={setNote} style={{borderWidth:1,padding:8}}/>

      <Button title="Save Mood" onPress={save}/>
      <Button title="Load My Moods" onPress={load}/>

      <FlatList
        data={list}
        keyExtractor={(i)=>i.id}
        renderItem={({item})=>(
          <View style={{borderWidth:1,padding:10,marginTop:10}}>
            <Text>Mood: {item.mood}</Text>
            <Text>Note: {item.note}</Text>
          </View>
        )}
      />
    </View>
  );
}

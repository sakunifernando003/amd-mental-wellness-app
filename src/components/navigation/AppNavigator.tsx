import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Login from "../screens/LoginScreen";
import Signup from "../screens/SignupScreen";
import Home from "../screens/HomeScreen";

const Stack=createStackNavigator();

export default function AppNavigator(){
  return(
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Signup" component={Signup}/>
      <Stack.Screen name="Home" component={Home}/>
    </Stack.Navigator>
  );
}

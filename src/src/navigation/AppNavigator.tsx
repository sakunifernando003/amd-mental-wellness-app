// AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignupScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MoodScreen from "../screens/MoodScreen";
import JournalScreen from "../screens/JournalScreen";
import MeditationScreen from "../screens/MeditationScreen";
import GoalsScreen from "../screens/GoalsScreen";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: { user: any; isNew: boolean };
  Profile: { user: any };
  Mood: { user: any };
  Journal: { user: any };
  Meditation: undefined;
  Goals: { user: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Dashboard", headerBackVisible: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "My Profile" }}
      />
      <Stack.Screen
        name="Mood"
        component={MoodScreen}
        options={{ title: "Mood Tracker" }}
      />
      <Stack.Screen
        name="Journal"
        component={JournalScreen}
        options={{ title: "Journal" }}
      />
      <Stack.Screen
        name="Meditation"
        component={MeditationScreen}
        options={{ title: "Meditation" }}
      />
      <Stack.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ title: "Goals" }}
      />
    </Stack.Navigator>
  );
}

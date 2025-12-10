import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NavigationString from "./NavigationStrings";
import * as Screen from "../screen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={NavigationString.Login} component={Screen.Login} />
      <Stack.Screen name={NavigationString.Signup} component={Screen.Signup} />
      <Stack.Screen name={NavigationString.OTP} component={Screen.OTP} />
      <Stack.Screen name={NavigationString.SetPassword} component={Screen.SetPassword} />
    </Stack.Navigator>
  );
}

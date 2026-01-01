import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NavigationString from "./NavigationStrings";
import * as Screen from "../screen";
import BottomTabs from "../Navigations/BottomTabs"
const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={NavigationString.DNT_LOGIN} component={Screen.DNT_LOGIN} />
      <Stack.Screen name={NavigationString.Signup} component={Screen.Signup} />
      <Stack.Screen name={NavigationString.OTP} component={Screen.OTP} />
      <Stack.Screen name={NavigationString.DNT_PASSWORD} component={Screen.DNT_PASSWORD} />
      <Stack.Screen name={NavigationString.DNT_VENDORREGISTER} component={Screen.DNT_VendorRegister} />
      <Stack.Screen name={NavigationString.DNT_VerifyingDetails} component={Screen.DNT_VerifyingDetails} />
      <Stack.Screen name={NavigationString.BottomTab} component={BottomTabs}  screenOptions={{ headerShown: false }} />
      <Stack.Screen name={NavigationString.DNT_VENDORREGISTER} component={Screen.VendorRegister} />
    </Stack.Navigator>
  );
}

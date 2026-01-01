import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NavigationString from "./NavigationStrings";
import * as Screen from "../screen";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={NavigationString.FIRST_PAGE}
    >
      <Stack.Screen name={NavigationString.DNT_Forgot_Password} component={Screen.DNT_Forgot_Password} />
      <Stack.Screen name={NavigationString.DNT_LOGIN} component={Screen.DNT_LOGIN} />
      <Stack.Screen name={NavigationString.FIRST_PAGE} component={Screen.FIRST_PAGE} />
      <Stack.Screen name={NavigationString.DNT_SIGNUP} component={Screen.DNT_SIGNUP} />
      <Stack.Screen name={NavigationString.DNT_OTP} component={Screen.DNT_OTP} />
      <Stack.Screen name={NavigationString.DNT_PASSWORD} component={Screen.DNT_PASSWORD} />
      <Stack.Screen name={NavigationString.DNT_ResetPassword} component={Screen.DNT_ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;

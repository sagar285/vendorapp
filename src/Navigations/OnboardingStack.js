import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NavigationString from "./NavigationStrings";
import * as Screen from "../screen";

const Stack = createNativeStackNavigator();

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={NavigationString.DNT_VENDORREGISTER}
    >
      <Stack.Screen name={NavigationString.DNT_AddShop} component={Screen.DNT_AddShop} />
      <Stack.Screen name={NavigationString.DNT_VENDORREGISTER} component={Screen.VendorRegister} />
      <Stack.Screen name={NavigationString.DNT_VerifyingDetails} component={Screen.DNT_VerifyingDetails} />
      <Stack.Screen name={NavigationString.DNT_AddYourShop} component={Screen.DNT_AddYourShop} />
      <Stack.Screen name={NavigationString.DNT_AddYourShopDetails} component={Screen.DNT_AddYourShopDetails} />
      <Stack.Screen name={NavigationString.DNT_SuccesFull} component={Screen.DNT_SuccesFull} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;

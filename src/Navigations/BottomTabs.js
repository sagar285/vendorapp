import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NavigationString from "./NavigationStrings";
import * as Screen from "../screen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={NavigationString.Shops}
        component={Screen.Shops}
      />
      <Tab.Screen
        name={NavigationString.ViewItems}
        component={Screen.ViewItems}
      />
      <Tab.Screen
        name={NavigationString.addYourshop}
        component={Screen.AddShop}
      />
      <Tab.Screen
        name={NavigationString.addMenu}
        component={Screen.AddMenu}
      />
    </Tab.Navigator>
  );
}

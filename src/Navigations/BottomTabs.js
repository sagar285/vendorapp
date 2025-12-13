import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, View, Text, Platform } from "react-native";
import NavigationString from "./NavigationStrings";
import * as Screen from "../screen";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import HomeStack from "./HomeStack"
import UserProfile from "../DNT_DESIGN/UserProfile"
import ProfileStack from "../Navigations/ProfileStack"
import Order from "../DNT_DESIGN/Order"
const Tab = createBottomTabNavigator();

const TabItem = ({ focused, label, icon, isProfile = false }) => {
  return (
    <View style={[
      styles.tabItemContainer, 
      focused && styles.activeTabContainer
    ]}>
      <Image
        source={icon}
        style={[
          isProfile ? styles.iconProfile : styles.icon,
          !isProfile && { tintColor: focused ? COLORS.orange : COLORS.grayText } 
        ]}
      />
      <Text 
        numberOfLines={1} 
        style={[
          styles.tabLabel, 
          { color: focused ? COLORS.orange : COLORS.grayText },
          focused && styles.activeLabel 
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="Home"
              icon={require("../assets/images/HomeIcon.png")}
            />
          ),
        }}
      />
      <Tab.Screen
        name={NavigationString.DNT_Order}
        component={Screen.DNT_Order}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="Orders" // Changed from "Your Orders" to fit space or use "Orders"
              icon={require("../assets/images/OrderIcon.png")}
            />
          ),
        }}
      />
      <Tab.Screen
        name={NavigationString.addYourshop}
        component={Screen.AddShop}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="Support"
              icon={require("../assets/images/SupportIcon.png")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="Profile"
              icon={require("../assets/images/ProfileIcon.png")}
              isProfile={true}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
   height:
  Platform.OS === "ios"
    ? hp(10)
    : Platform.OS === "android"
    ? hp(9) 
    : hp(8),
    backgroundColor: "#FFFFFF",
    paddingHorizontal: wp(2),
    paddingTop: hp(1),
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  tabItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5),
    borderRadius: wp(10), 
    paddingHorizontal: wp(2),
    minWidth: wp(20), 
    marginTop:hp(1)
  },
  activeTabContainer: {
    backgroundColor:COLORS.orange10,
    paddingHorizontal: wp(3.5), 
  },
  icon: {
    width: wp(5),
    height: wp(5),
    resizeMode: "contain",
  },
  iconProfile: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    resizeMode: "cover",
  },
  tabLabel: {
    fontSize: wp(3),
    marginLeft: wp(1.5),
    fontWeight: "500",
  },
  activeLabel: {
    fontWeight: "700",
  }
});
import React,{useEffect, useRef} from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import AuthStack from "./NewAuthStack";
import OnboardingStack from "./OnboardingStack";
import AppTabs from "./BottomTabs";
import { useAppContext } from "../Context/AppContext";
import { apiGet } from "../Api/Api";
import { Alert } from "react-native";
import { AppState } from "react-native";

const RootNavigator = () => {
  const { user , onLogout} = useAppContext();
   const navigationRef = useNavigationContainerRef();
  const navigateRef= useRef()
  const isLoggedIn = !!user;
  const hasShop = user?.role == "vendor" ?  true :false; // adapt to your backend
   
    const getuserProfile = async () => {
    try {
       const result = await apiGet('/user/profile');
    } catch (error) {
        if (
      error?.message === "Session expired. Logged in from another device."
    ) {
      Alert.alert(
        "Session Expired",
        "Your account was logged in from another device. Please login again.",
        [
          {
            text: "OK",
            onPress:()=>onLogout() 
          },
        ],
        { cancelable: false } 
      ); 
    }

    }
    };

    
useEffect(() => {
  getuserProfile();
});


  return (
    <NavigationContainer ref={navigateRef}>
      {!isLoggedIn ? (
        <AuthStack />
      ) : !hasShop ? (
        <OnboardingStack />
      ) : (
        <AppTabs />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;

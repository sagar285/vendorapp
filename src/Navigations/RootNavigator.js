import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./NewAuthStack";
import OnboardingStack from "./OnboardingStack";
import AppTabs from "./BottomTabs";
import { useAppContext } from "../Context/AppContext";

const RootNavigator = () => {
  const { user } = useAppContext();

  const isLoggedIn = !!user;
  const hasShop = user?.role == "vendor" ?  true :false; // adapt to your backend

  return (
    <NavigationContainer>
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

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigationString from './NavigationStrings';
import * as Screen from "../screen";

const Stack = createNativeStackNavigator()

const HomeStack = () => {
    // console.log(route,"wertyuidgfhgfhdhfjgfdgsfhcvbn")
    return (
        <Stack.Navigator>
                  <Stack.Screen
        name={NavigationString.DNT_AddShop}
        component={Screen.DNT_AddShop}
        options={{ headerShown: false }}
      /> 
        <Stack.Screen
        name={NavigationString.DNT_AddYourShop}
        component={Screen.DNT_AddYourShop}
        options={{ headerShown: false }}
      /> 
        <Stack.Screen
        name={NavigationString.DNT_AddYourShopDetails}
        component={Screen.DNT_AddYourShopDetails}
        options={{ headerShown: false }}
      /> 
        <Stack.Screen
        name={NavigationString.DNT_SuccesFull}
        component={Screen.DNT_SuccesFull}
        options={{ headerShown: false }}
      /> 
        <Stack.Screen
        name={NavigationString.DNT_Home}
        component={Screen.DNT_Home}
        options={{ headerShown: false }}
      /> 
        </Stack.Navigator>
    );
};

export default HomeStack;
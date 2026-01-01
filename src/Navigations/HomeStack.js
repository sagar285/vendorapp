import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigationString from './NavigationStrings';
import * as Screen from "../screen";

const Stack = createNativeStackNavigator()

const HomeStack = () => {
   
    return (
        <Stack.Navigator
        initialRouteName={NavigationString.DNT_Home}
        >
                  {/* <Stack.Screen
        name={NavigationString.DNT_AddShop}
        component={Screen.DNT_AddShop}
        options={{ headerShown: false }}
      />  */}

<Stack.Screen
        name={NavigationString.DNT_Home}
        component={Screen.DNT_Home}
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
        name={NavigationString.DNT_ViewShop}
        component={Screen.DNT_ViewShop}
        options={{ headerShown: false }}
      /> 
      <Stack.Screen
         name={NavigationString.DNT_AddNewCategory}
         component={Screen.DNT_AddNewCategory}
         options={{ headerShown: false }}
      />
      <Stack.Screen
         name={NavigationString.DNT_CategoryMenu}
         component={Screen.DNT_CategoryMenu}
         options={{ headerShown: false }}
      />
      <Stack.Screen
         name={NavigationString.DNT_Categoris}
         component={Screen.DNT_Categoris}
         options={{ headerShown: false }}
      />
        </Stack.Navigator>
    );
};

export default HomeStack;
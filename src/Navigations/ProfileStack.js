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
         name={NavigationString.DNT_UserProfile}
         component={Screen.DNT_UserProfile}
         options={{ headerShown: false }}
      />
      <Stack.Screen
         name={NavigationString.DNT_ResetPassword}
         component={Screen.DNT_ResetPassword}
         options={{ headerShown: false }}
      />
        </Stack.Navigator>
    );
};

export default HomeStack;
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
         name={NavigationString.DNT_Order}
         component={Screen.DNT_Order}
         options={{ headerShown: false }}
      />
      <Stack.Screen
         name={NavigationString.DNT_Order_Details}
         component={Screen.DNT_Order_Details}
         options={{ headerShown: false }}
      />
        </Stack.Navigator>
    );
};

export default HomeStack;
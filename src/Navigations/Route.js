import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import MainScreen from "./MainScreen"
import NavigationString from './NavigationStrings'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
const Route = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator 
          initialRouteName={NavigationString.Signup}

            screenOptions={{
                gestureEnabled:true,
                gestureDirection:"horizontal",
                // cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS
            }}
            >
                {MainScreen(Stack)}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Route

const styles = StyleSheet.create({})
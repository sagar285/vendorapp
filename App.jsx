import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Route from "./src/Navigations/Route"
import {AppProvider} from "./src/Context/AppContext"
const App = () => {
  return (
    <AppProvider>
    <Route/>
    </AppProvider>
  )
}

export default App

const styles = StyleSheet.create({

})
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from "../Theme/Colors"
import { wp,hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';
const FirstPage = () => {
  const navigation = useNavigation();


  const goToLogin = () =>{
    navigation.navigate(NavigationStrings.DNT_LOGIN)
  }
  const goToRegister = () =>{
    navigation.navigate(NavigationStrings.DNT_SIGNUP)
  }




  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.ContainerScreen}>

        {/* -------- TOP TITLE -------- */}
        <Text style={styles.topTitle}>Vendor's App</Text>

        {/* -------- CENTER LOGO + TEXT -------- */}
        <View style={styles.centerContent}>
          <Image
            source={require("../assets/images/GharTakLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet consectetur {"\n"}
            adipisicing elit. Ad quaerat pariatur
          </Text>
        </View>

        {/* -------- BOTTOM BUTTONS -------- */}
        <View style={styles.BottomRowButton}>

          <TouchableOpacity style={styles.LoginButton} onPress={goToLogin}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.RegisterButton} onPress={goToRegister}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  )
}

export default FirstPage
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  ContainerScreen: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  topTitle: {
    fontSize: wp(5),
    marginTop: hp(1.5),
    textAlign:"center",
    fontFamily:FONTS.InterSemiBold
  }
,  

  centerContent: {
    alignItems: "center",
    marginTop: 40,
    flex: 1,
    justifyContent: "center",
  },

  logo: {
    width: wp(50),     // 50% screen width
    height: wp(50),    // square logo
    marginBottom: hp(1),
  },
  descriptionText: {
    fontSize: wp(4),
    lineHeight: hp(2.5),
    fontFamily:FONTS.InterMedium
  },
  BottomRowButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(3),
    gap:wp(1),
   margin:"auto"
  },
  LoginButton: {
    width: wp(45),
    paddingVertical: hp(1.8),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.orange,
    alignItems: "center",
  },
  RegisterButton: {
    width: wp(45),
    paddingVertical: hp(1.8),
    borderRadius: 10,
    backgroundColor: COLORS.orange,
    alignItems: "center",
  },
  loginText: {
    color: COLORS.orange,
    fontWeight: "600",
  },

  registerText: {
    color: COLORS.white,
    fontWeight: "600",
  },
})

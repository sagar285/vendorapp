import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  BackHandler,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import Header from "../Components/Header/Header";
import Input from "../Components/Input";
import FullWidthButton from "../Components/FullwidthButton";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import NavigationStrings from "../Navigations/NavigationStrings";
import { useAppContext } from "../Context/AppContext";
import { apiPost } from "../Api/Api";

const Signup = () => {
  const navigation = useNavigation();
  const { setActiveLoader } = useAppContext();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useFocusEffect(
    useCallback(() => {
      setActiveLoader(0);

      const backAction = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "YES", onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        name: fullName,
        email: email,
      };
      const result = await apiPost("/auth/register", payload);
       console.log(result,"dekh aaya kua respnce eska")
      if (result?.message === "OTP sent to your email") {
        console.log(result,"dek ye msg arha hai esme bhaiiiiiiiiiiiiiiii")
        navigation.navigate(NavigationStrings.DNT_OTP, { email });
      }
    } catch (error) {
      if (error?.user?.isVerified == true ) {
         navigation.navigate(NavigationStrings.DNT_PASSWORD)
      }else{
          // navigation.navigate(NavigationStrings.DNT_LOGIN)
      }
      console.log(error,"error")
      setErrorMsg(error?.message || "Something went wrong");
      console.log("eror hia bhia esme ppppppp")
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !fullName || !email || loading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.headerSpacing}>
        <Header  onBackPress={()=>navigation.goBack()}/>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Join GharTak</Text>
        <Text style={styles.description}>
          Please provide your details to create your account
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Input
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <View style={styles.buttonSpacing}>
          <FullWidthButton
            title={
              loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                "Continue"
              )
            }
            disabled={isDisabled}
            onPress={handleSignup}
          />
        </View>
      </View>

      <Text style={styles.footerText}>
        Already have an account?
        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate(NavigationStrings.DNT_LOGIN)}
        >
          
          Login
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(5),
  },

  headerSpacing: {
    marginTop: hp(2),
  },

  titleContainer: {
    marginTop: hp(3),
    marginBottom: hp(4),
  },

  title: {
    fontFamily: FONTS.InterBold,
    fontSize: wp(6),
    color: COLORS.BlackText,
    marginBottom: hp(1),
  },

  description: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.6),
    color: COLORS.grayText,
    lineHeight: hp(2.3),
  },

  formContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: hp(3),
  },

  errorText: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.2),
    color: "red",
    textAlign: "center",
    marginTop: hp(1),
  },

  buttonSpacing: {
    marginTop: hp(2.5),
  },

  footerText: {
    textAlign: "center",
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.6),
    color: COLORS.grayText,
    marginBottom: hp(2),
  },

  loginText: {
    color: COLORS.orange,
    fontFamily: FONTS.InterSemiBold,
  },
});

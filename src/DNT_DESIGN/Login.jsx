import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import React, { useState, useCallback } from "react";
import Input from "../Components/Input";
import FullWidthButton from "../Components/FullwidthButton";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import NavigationStrings from "../Navigations/NavigationStrings";
import { useAppContext } from "../Context/AppContext";
import { apiPost } from "../Api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const navigation = useNavigation();
  const { setActiveLoader,setUser } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useFocusEffect(
    useCallback(() => {
      setActiveLoader(0);

      // const checkToken = async () => {
      //   const token = await AsyncStorage.getItem("token");
      //   if (token) {
      //     navigation.replace(NavigationStrings.DNT_VENDORREGISTER);
      //   }
      // };

      // checkToken();

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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Email and password are required");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Enter a valid email");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = { email, password };
      const result = await apiPost("/auth/login", payload);
       console.log(result,"respone ka data hia y bhai")
      if (result?.message === "Login successful") {
        await AsyncStorage.setItem("token", result.token);
        await AsyncStorage.setItem(
          "userdata",
          JSON.stringify(result.user)
        );
        setUser(result.user)
        navigation.replace(NavigationStrings.DNT_VENDORREGISTER);
      } else {
        setErrorMsg(result?.message || "Login failed");
      }
    } catch (error) {
      setErrorMsg(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !email || !password || loading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={require("../assets/images/LeftArrow.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.description}>
          Enter your login details to continue
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="Email Address"
          placeholder="vendoremail@test.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <View style={styles.buttonSpacing}>
          <FullWidthButton
            title={
              loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                "Login"
              )
            }
            disabled={isDisabled}
            onPress={handleLogin}
          />
         
          <Text onPress={() => navigation.navigate(NavigationStrings.DNT_Forgot_Password)} style={styles.ForgetPasswordtext}>Forgot password?</Text>
        </View>
      </View>

      <Text style={styles.footerText}>
        Don’t have an account?
        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate(NavigationStrings.Signup)}
        >
          {" "}
          Sign Up
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(5),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(2.5),
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  backIcon: {
    width: wp(6),
    height: wp(6),
    marginRight: wp(2),
  },

  headerTitle: {
    fontSize: wp(4.2),
    fontFamily: FONTS.InterSemiBold,
    color: COLORS.BlackText,
  },

  titleContainer: {
    marginTop: hp(4),
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
  ForgetPasswordtext:{
    fontFamily:FONTS.InterMedium,
    fontSize:wp(3.2),
    textAlign:"right",
    color:COLORS.grayText
  }
});

import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import Header from "../Components/Header/Header";
import Input from "../Components/Input";
import FullWidthButton from "../Components/FullwidthButton";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";
import { useNavigation } from "@react-navigation/native";
import NavigationStrings from "../Navigations/NavigationStrings";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const navigation =useNavigation()

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
  });

  // ✅ Validation Function
  const validateAndSubmit = () => {
    navigation.navigate(NavigationStrings.DNT_OTP)
    return;
    let valid = true;
    let newErrors = { fullName: "", email: "" };

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      console.log("Signup Data:", { fullName, email });
      // 👇 API call / next step here
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* ✅ HEADER WITH TOP SPACE */}
      <View style={styles.headerSpacing}>
        <Header />
      </View>

      {/* ✅ TITLE & DESCRIPTION */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Join GharTak</Text>
        <Text style={styles.description}>
          Please provide your details to create your account
        </Text>
      </View>

      {/* ✅ INPUT SECTION */}
      <View style={styles.formContainer}>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />
        {errors.fullName ? (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        ) : null}

        <Input
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        {/* ✅ FULL WIDTH BUTTON AT BOTTOM */}
        <View style={styles.buttonSpacing}>
          <FullWidthButton title="Continue" onPress={validateAndSubmit} />
        </View>
      </View>

      {/* ✅ FOOTER LOGIN TEXT */}
      <Text style={styles.footerText}>
        Already have an account?
        <Text style={styles.loginText}> Login</Text>
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
    marginTop: hp(2), // ✅ Header a little bit down
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
    justifyContent: "flex-end", // ✅ Inputs & button stay near bottom
    paddingBottom: hp(3),
  },

  errorText: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.2),
    color: "red",
    marginTop: hp(0.5),
    marginBottom: hp(1),
    marginLeft: wp(1),
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


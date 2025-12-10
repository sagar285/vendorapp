import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
  } from "react-native";
  import React, { useState } from "react";
  import Header from "../Components/Header/Header";
  import Input from "../Components/Input";
  import FullwidthButton from "../Components/FullwidthButton";
  import { COLORS } from "../Theme/Colors";
  import { wp, hp } from "../Theme/Dimensions";
  import { FONTS } from "../Theme/FontFamily";
  
  const Password = () => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
  
    // Validation Rules
    const rule1 = password.length >= 8;
    const rule2 = /[!@#$%^&*0-9]/.test(password); // contains symbol or number
    const rule3 = /[A-Z]/.test(password); // contains uppercase
  
    const allValid = rule1 && rule2 && rule3 && password === confirm;
  
    const rules = [
      { label: "Minimum 8 Characters", valid: rule1 },
      { label: "At least one symbol & number", valid: rule2 },
      { label: "Minimum one uppercase letter", valid: rule3 },
    ];
  
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          
          <ScrollView
            contentContainerStyle={{ paddingBottom: hp(20) }}
            keyboardShouldPersistTaps="handled"
          >
            {/* HEADER */}
            <View style={styles.headerSpacing}>
              <Header />
            </View>
  
            {/* TITLE */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Set Your Password</Text>
              <Text style={styles.description}>
                Create a strong password that you can remember
              </Text>
            </View>
  
            {/* PASSWORD RULES */}
            <View style={styles.rulesContainer}>
              {rules.map((item, index) => (
                <View key={index} style={styles.ruleRow}>
                  
                  <View
                    style={[
                      styles.ruleIcon,
                      {
                        backgroundColor: item.valid
                          ? COLORS.green
                          : COLORS.lightGray,
                      },
                    ]}
                  >
                    {item.valid && (
                      <Image
                        source={require("../assets/images/rightCheck.png")}
                        style={styles.tickIcon}
                      />
                    )}
                  </View>
  
                  <Text
                    style={[
                      styles.ruleText,
                      { color: item.valid ? COLORS.green : COLORS.BlackText },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
  
            {/* PASSWORD INPUTS */}
            <Input
              label="New Password"
              placeholder="Enter new password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
  
            <Input
              label="Confirm Password"
              placeholder="Re-enter password"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
            />
  
            {/* PASSWORD MISMATCH ERROR */}
            {confirm.length > 0 && password !== confirm && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </ScrollView>
  
          {/* FIXED BOTTOM BUTTON */}
          <View style={styles.bottomButton}>
            <FullwidthButton
              title="Continue"
              disabled={!allValid}
              onPress={() => console.log("Password Saved")}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  export default Password;
  
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
      marginBottom: hp(2),
    },
  
    title: {
      fontFamily: FONTS.InterBold,
      fontSize: wp(6),
      color: COLORS.BlackText,
    },
  
    description: {
      fontFamily: FONTS.InterRegular,
      fontSize: wp(3.6),
      color: COLORS.grayText,
      marginTop: hp(1),
    },
  
    rulesContainer: {
      marginVertical: hp(2),
    },
  
    ruleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp(1.5),
    },
  
    ruleIcon: {
      width: wp(5.5),
      height: wp(5.5),
      borderRadius: wp(5),
      justifyContent: "center",
      alignItems: "center",
    },
  
    tickIcon: {
      width: wp(3.5),
      height: wp(3.5),
      resizeMode: "contain",
    },
  
    ruleText: {
      marginLeft: wp(3),
      fontSize: wp(3.8),
      fontFamily: FONTS.InterRegular,
    },
  
    errorText: {
      color: "red",
      fontSize: wp(3.4),
      fontFamily: FONTS.InterRegular,
      marginVertical: hp(1),
    },
  
    bottomButton: {
      position: "absolute",
      bottom: hp(3),
      width: wp(90),
      alignSelf: "center",
    },
  });
  
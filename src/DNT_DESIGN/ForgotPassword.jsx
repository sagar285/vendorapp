import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import Header from "../Components/Header/Header";
import Input from "../Components/Input";
import FullwidthButton from "../Components/FullwidthButton";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { apiPost } from "../Api/Api";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import NavigationStrings from "../Navigations/NavigationStrings";

const ForgotPassword = () => {
  const navigation =useNavigation()
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useFocusEffect(
    useCallback(() => {
      setErrorMsg("");
    }, [])
  );

  /* ---------- PASSWORD RULES ---------- */
  const rule1 = password.length >= 8;
  const rule2 = /[!@#$%^&*0-9]/.test(password);
  const rule3 = /[A-Z]/.test(password);
  const rule4 = password.length > 0 && password === confirm;

  const allValid = rule1 && rule2 && rule3 && rule4;

  const rules = [
    { label: "Minimum 8 Characters", valid: rule1 },
    { label: "At least one symbol & number", valid: rule2 },
    { label: "Minimum one uppercase letter", valid: rule3 },
    { label: "Passwords match", valid: rule4 },
  ];

  /* ---------- SEND OTP ---------- */
  const handleSendOtp = async () => {
    if (!email) return;

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await apiPost("/user/send-reset-otp", { email });
       console.log(res,"what is response");
      if (res?.message == "OTP sent to email") {
        setStep(2);
      } else {
        setErrorMsg("Failed to send OTP");
      }
    } catch (err) {
      setErrorMsg(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- VERIFY OTP + RESET PASSWORD ---------- */
  const handleResetPassword = async () => {
    if (!allValid || !otp) return;

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        email,
        otp,
        newPassword:password,
      };

      const res = await apiPost("/user/reset-password", payload);
     console.log(res,"new password update result");
      if (res?.message == "Password reset successful") {
        navigation.navigate(NavigationStrings.DNT_LOGIN)
        // navigate to login or success screen
      } else {
        setErrorMsg("Invalid OTP or password");
      }
    } catch (err) {
      setErrorMsg(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.container}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hp(25) }}
            >
              <Header />

              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {step === 1 ? "Forgot Password" : "Reset Password"}
                </Text>
                <Text style={styles.description}>
                  {step === 1
                    ? "Enter your registered email to receive OTP"
                    : "Enter OTP and set a new password"}
                </Text>
              </View>

              {/* ---------- STEP 1 ---------- */}
              {step === 1 && (
                <Input
                  label="Email Address"
                  placeholder="Enter email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              )}

              {/* ---------- STEP 2 ---------- */}
              {step === 2 && (
                <>
                  <Input
                    label="OTP"
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                  />

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
                            {
                              color: item.valid
                                ? COLORS.green
                                : COLORS.BlackText,
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
                    ))}
                  </View>

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
                </>
              )}

              {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
              ) : null}
            </ScrollView>

            {/* ---------- BUTTON ---------- */}
            <View style={styles.bottomButton}>
              <FullwidthButton
                title={
                  loading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : step === 1 ? (
                    "Send OTP"
                  ) : (
                    "Reset Password"
                  )
                }
                disabled={
                  loading ||
                  (step === 1 && !email) ||
                  (step === 2 && (!otp || !allValid))
                }
                onPress={step === 1 ? handleSendOtp : handleResetPassword}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(5),
  },

  titleContainer: {
    marginTop: hp(4),
    marginBottom: hp(3),
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
    marginTop: hp(2),
    marginBottom: hp(1),
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
    width: wp(4),
    height: wp(4),
    resizeMode: "contain",
  },

  ruleText: {
    marginLeft: wp(2),
    fontSize: wp(3.8),
    fontFamily: FONTS.InterRegular,
  },

  errorText: {
    color: "red",
    fontSize: wp(3.4),
    fontFamily: FONTS.InterRegular,
    marginTop: hp(1.5),
  },

  bottomButton: {
    position: "absolute",
    bottom: hp(3),
    width: wp(90),
    alignSelf: "center",
  },
});


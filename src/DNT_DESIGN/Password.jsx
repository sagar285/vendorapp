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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import NavigationStrings from "../Navigations/NavigationStrings";
import { useAppContext } from "../Context/AppContext";
import { apiPost } from "../Api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

const Password = () => {
  const navigation = useNavigation();
  const { setActiveLoader,setUser } = useAppContext();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useFocusEffect(
    useCallback(() => {
      setActiveLoader(2);
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

  /* ---------- API ---------- */
  const handleSetPassword = async () => {
    if (!allValid) return;

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = { password };
      const result = await apiPost("/auth/set", payload);

      if (result?.token) {
        await AsyncStorage.setItem("token", result.token);
        setUser(result.user)
        // navigation.replace(NavigationStrings.DNT_VENDORREGISTER);
      } else {
        setErrorMsg("Failed to set password");
      }
    } catch (error) {
      setErrorMsg(error?.message || "Something went wrong");
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
          keyboardVerticalOffset={Platform.OS === "ios" ? hp(8) : 0}
        >
          <View style={styles.container}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hp(10) }}
            >
              {/* ---------- HEADER ---------- */}
              <View style={styles.headerSpacing}>
                <Header />
              </View>

              {/* ---------- TITLE ---------- */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Set Your Password</Text>
                <Text style={styles.description}>
                  Create a strong password that you can remember
                </Text>
              </View>

              {/* ---------- RULES ---------- */}
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

              {/* ---------- INPUTS ---------- */}
              <View style={styles.inputContainer}>
                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                <Input
                  label="Confirm Password"
                  placeholder="password"
                  secureTextEntry
                  value={confirm}
                  onChangeText={setConfirm}
                />
              </View>

              {/* ---------- ERRORS ---------- */}
              {confirm.length > 0 && !rule4 && (
                <Text style={styles.errorText}>Passwords do not match</Text>
              )}

              {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
              ) : null}
            </ScrollView>

            {/* ---------- BOTTOM BUTTON ---------- */}
            <View style={styles.bottomButton}>
              <FullwidthButton
                title={
                  loading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    "Continue"
                  )
                }
                disabled={!allValid || loading}
                onPress={handleSetPassword}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
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
    width: wp(4),
    height: wp(4),
    resizeMode: "contain",
  },

  ruleText: {
    marginLeft: wp(2),
    fontSize: wp(3.8),
    fontFamily: FONTS.InterRegular,
  },

  inputContainer: {
    marginTop: hp(3),
  },

  errorText: {
    color: "red",
    fontSize: wp(3.4),
    fontFamily: FONTS.InterRegular,
    marginTop: hp(1),
  },

  bottomButton: {
    position: "absolute",
    bottom: hp(3),
    width: wp(90),
    alignSelf: "center",
  },
});


import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useCallback } from "react";
import Header from "../Components/Header/Header";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";
import FullWidthButton from "../Components/FullwidthButton";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import NavigationStrings from "../Navigations/NavigationStrings";
import { useAppContext } from "../Context/AppContext";
import { apiPost } from "../Api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OTP = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};

  const { setActiveLoader } = useAppContext();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const inputs = useRef([]);

  useFocusEffect(
    useCallback(() => {
      setActiveLoader(1);
    }, [])
  );

  const handleChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setErrorMsg("Please enter valid 6 digit OTP");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        email,
        otp: finalOtp,
      };

      const res = await apiPost("/auth/verify-otp", payload);
    console.log(res,"otp ke bad k data hau ye dekhhhhhhhhhhhhhhhhh")
      if (res?.tempToken) {
        await AsyncStorage.setItem("token", res.tempToken);
        navigation.navigate(NavigationStrings.DNT_PASSWORD);
      }
    } catch (error) {
      console.log(error,"dekh error aayi hai")
      if (error?.message == "User already verified") {
          navigation.navigate(NavigationStrings.DNT_PASSWORD)
      }
      setErrorMsg(error?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

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
          <View style={styles.headerSpacing}>
            <Header />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.description}>
              A 6-digit code was sent to{" "}
              <Text style={{ fontFamily: FONTS.InterSemiBold }}>
                {email}
              </Text>
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((val, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpBox}
                keyboardType="number-pad"
                maxLength={1}
                value={val}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}
        </ScrollView>

        <View style={styles.bottomButtons}>
          <FullWidthButton
            title="Resend Code"
            borderOnly
            onPress={() => {}}
          />

          <FullWidthButton
            title={
              loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                "Verify OTP"
              )
            }
            onPress={handleVerify}
            disabled={loading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OTP;

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

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(4),
  },

  otpBox: {
    width: wp(12),
    height: wp(14),
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
    borderRadius: wp(2),
    fontSize: wp(6),
    textAlign: "center",
    fontFamily: FONTS.InterSemiBold,
    color: COLORS.BlackText,
  },

  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: hp(2),
    fontFamily: FONTS.InterRegular,
  },

  bottomButtons: {
    position: "absolute",
    bottom: hp(3),
    width: wp(90),
    alignSelf: "center",
  },
});

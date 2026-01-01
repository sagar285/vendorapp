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
import React, { useRef, useState, useCallback, useEffect } from "react";
import Header from "../Components/Header/Header";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";
import FullWidthButton from "../Components/FullwidthButton";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import NavigationStrings from "../Navigations/NavigationStrings";
import { useAppContext } from "../Context/AppContext";
import { apiPost } from "../Api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RESEND_TIME = 100; // 5 minutes

const OTP = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};
  const { setActiveLoader } = useAppContext();

  const inputs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [timer, setTimer] = useState(RESEND_TIME);

  useFocusEffect(
    useCallback(() => {
      setActiveLoader(1);
    }, [])
  );

  /* ================= Timer ================= */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };
   
  /* ================= OTP Input ================= */
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

  const isOtpComplete = otp.every((digit) => digit !== "");

  /* ================= Verify OTP ================= */
  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = { email, otp: finalOtp };
      const res = await apiPost("/auth/verify-otp", payload);

      if (res?.tempToken) {
        await AsyncStorage.setItem("token", res.tempToken);
        navigation.navigate(NavigationStrings.DNT_PASSWORD);
      }
    } catch (error) {
      if (error?.message === "User already verified") {
        navigation.navigate(NavigationStrings.DNT_PASSWORD);
        return;
      }
      setErrorMsg(error?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= Resend OTP ================= */
  const sendResetOtp = async () => {
    try {
      setResendLoading(true);
      setErrorMsg("");

      const payload = { email };
      await apiPost("/user/send-reset-otp", payload);

      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      setTimer(RESEND_TIME);
    } catch (error) {
      setErrorMsg("Failed to resend OTP. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: hp(18) }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSpacing}>
            <Header />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Verify OTP</Text>

            <Text style={styles.description}>
              We’ve sent a 6-digit verification code to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
              {"\n"}Please check your inbox or spam folder.
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((val, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={[
                  styles.otpBox,
                  val && styles.otpBoxFilled,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={val}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        </ScrollView>

        <View style={styles.bottomButtons}>
          <FullWidthButton
            // title={
            //   timer > 0
            //     ? `Resend in ${formatTime()}`
            //     : resendLoading
            //     ? "Resend In"
            //     : "Resend Code"
            // }
            title={
    <Text style={{ 
      color: timer > 0 ? COLORS.white : COLORS.white, // Logic for color
      fontFamily: FONTS.InterRegular 
    }}>
      {timer > 0 ? `Resend in ${formatTime()}` : "Resend Code"}
    </Text>
  }
            borderOnly
            disabled={timer > 0 || resendLoading}
            onPress={sendResetOtp}
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
            disabled={!isOtpComplete || loading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OTP;

/* ================= Styles ================= */

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
    fontSize: wp(3.8),
    color: COLORS.grayText,
    marginTop: hp(1),
    lineHeight: hp(2.6),
  },

  emailText: {
    fontFamily: FONTS.InterSemiBold,
    color: COLORS.BlackText,
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

  otpBoxFilled: {
    borderColor: COLORS.primary,
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

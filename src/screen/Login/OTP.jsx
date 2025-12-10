import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { apiPost } from "../../Api/Api";
import NavigationStrings from "../../Navigations/NavigationStrings";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpVerification = ({ route }) => {
  const { email } = route.params || {}; // get email from Signup
  const navigation = useNavigation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const verifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      console.log("Invalid OTP");
      return;
    }

    try {
      const url = "/auth/verify-otp";
      const payload = { email, otp: finalOtp };

      const res = await apiPost(url, payload);
      console.log(res, "OTP Verified");

      if (res.tempToken) {
        await AsyncStorage.setItem("token",res.tempToken)
        navigation.navigate(NavigationStrings.SetPassword);
      }
    } catch (error) {
      console.log("OTP Error", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to
          {" "}
          <Text style={{ fontWeight: "700" }}>{email}</Text>
        </Text>

        {/* OTP INPUT BOXES */}
        <View style={styles.otpContainer}>
          {otp.map((val, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={val}
              onChangeText={(text) => handleOtpChange(text, index)}
            />
          ))}
        </View>

        {/* VERIFY BTN */}
        <TouchableOpacity style={styles.verifyButton} onPress={verifyOtp}>
          <Text style={styles.verifyText}>VERIFY OTP</Text>
        </TouchableOpacity>

        {/* RESEND */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.resendText}>Resend OTP in {timer}s</Text>
          ) : (
            <TouchableOpacity>
              <Text style={styles.resendActive}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    padding: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 40,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  otpBox: {
    width: 50,
    height: 60,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },

  verifyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  resendContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  resendText: {
    color: "#777",
    fontSize: 14,
  },
  resendActive: {
    color: "#007AFF",
    fontWeight: "700",
    fontSize: 14,
  },
});

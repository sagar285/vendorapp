import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    ScrollView,
  } from "react-native";
  import React, { useRef, useState } from "react";
  import Header from "../Components/Header/Header";
  import { COLORS } from "../Theme/Colors";
  import { wp, hp } from "../Theme/Dimensions";
  import { FONTS } from "../Theme/FontFamily";
  import FullWidthButton from "../Components/FullwidthButton";
import { useNavigation } from "@react-navigation/native";
import NavigationStrings from "../Navigations/NavigationStrings";
  
  const OTP = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputs = useRef([]);
    const navigation =useNavigation()
  
    const handleChange = (text, index) => {
      if (/^\d*$/.test(text)) {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
  
        // move next
        if (text && index < 5) {
          inputs.current[index + 1].focus();
        }
      }
    };


    const handleVerify = () =>{
      navigation.navigate(NavigationStrings.DNT_PASSWORD)
    }
  
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          
          {/* Scrollable content, but buttons stay fixed */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: hp(20) }}
            keyboardShouldPersistTaps="handled"
          >
            {/* HEADER */}
            <View style={styles.headerSpacing}>
              <Header />
            </View>
  
            {/* TITLE & DESCRIPTION */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Verify OTP</Text>
              <Text style={styles.description}>
                A 6-digit code was sent to vendoremail@test.com
              </Text>
            </View>
  
            {/* OTP BOXES */}
            <View style={styles.otpContainer}>
              {otp.map((val, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.otpBox}
                  keyboardType="numeric"
                  maxLength={1}
                  value={val}
                  onChangeText={(text) => handleChange(text, index)}
                />
              ))}
            </View>
  
          </ScrollView>
  
          {/* FIXED BOTTOM BUTTONS */}
          <View style={styles.bottomButtons}>
            
            <FullWidthButton
              title="Resend Code"
              borderOnly
              onPress={() => console.log("Resend")}
            />
  
            <FullWidthButton
              title="Verify OTP"
              onPress={() => handleVerify("Verify")}
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
  
    bottomButtons: {
      position: "absolute",
      bottom: hp(3),
      width: wp(90),
      alignSelf: "center",
    },
  });
  
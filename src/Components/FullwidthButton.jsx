import { StyleSheet, Text, TouchableOpacity, View,ActivityIndicator } from "react-native";
import React from "react";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";

const FullwidthButton = ({ title, onPress, borderOnly = false,isloading,formupdate }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={formupdate ? true :false}
        activeOpacity={ formupdate ? 0.1 :0.7}
        style={[
          styles.button,
          borderOnly && styles.borderButton, // border only style
          {backgroundColor: formupdate ? COLORS.orange10 : COLORS.orange },
        ]}
      >
        <Text
          style={[
            styles.text,
            borderOnly && styles.borderText,
          ]}
        >
          
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  

const styles = StyleSheet.create({
  button: {
    width: wp(90), // full width
    backgroundColor: COLORS.orange,
    paddingVertical: hp(2),
    borderRadius: wp(3),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: hp(1.2),
  },

  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },

  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.InterSemiBold,
    fontSize: wp(4.2),
  },
  borderButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.orange,
  },
  
  borderText: {
    color: COLORS.orange,
  },
  text:{
    color: COLORS.white,
    fontFamily:FONTS.InterMedium,
    fontSize:wp(4)
  }
  
});

export default FullwidthButton

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";

const SHOW_PASSWORD_ICON = require("../assets/images/OpenEyeIcon.png");
const HIDE_PASSWORD_ICON = require("../assets/images/CloseEyeIcon.png");

const Input = ({
  label = "Label",
  placeholder = "Enter text",
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      {/* LABEL */}
      <Text style={styles.label}>{label}</Text>

      {/* INPUT BOX */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeHolderGray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidePassword}
        />

        {/* 👁 EYE ICON ONLY IF PASSWORD */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            <Image
              source={hidePassword ? HIDE_PASSWORD_ICON : SHOW_PASSWORD_ICON}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    alignSelf: "center",
    marginBottom: hp(2),
  },

  label: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.6),
    color: COLORS.BlackText,
    marginBottom: hp(1.2),
  },

  inputWrapper: {
    height: hp(7),
    borderWidth: 1,
    borderColor: "#4E4E4E99",
    borderRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: wp(3),
    paddingRight: wp(3),
  },

  input: {
    flex: 1,
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.8),
    color: COLORS.BlackText,
  },

  eyeButton: {
    padding: wp(1),
  },

  eyeIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: "contain",
  },
});

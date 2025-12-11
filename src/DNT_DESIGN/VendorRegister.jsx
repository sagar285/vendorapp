import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Header from "../Components/Header/Header";
import Input from "../Components/Input";
import FullwidthButton from "../Components/FullwidthButton";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";
import { useNavigation } from "@react-navigation/native";
import NavigationStrings from "../Navigations/NavigationStrings";
import { Image } from "react-native";

const VendorRegister = () => {
  const navigation = useNavigation();
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [numberOfShops, setNumberOfShops] = useState("");

  const HandleSubmit = () => {
    navigation.navigate(NavigationStrings.DNT_VerifyingDetails);
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSpacing}>
            <Header />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Register to become a vendor.</Text>
            <Text style={styles.description}>
              Enter your details, so we can verify & approve
            </Text>
          </View>

            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={require("../assets/images/Location.png")}
                style={styles.locationIcon}
              />
              <Text style={styles.fetchText}>Fetch Location</Text>
            </TouchableOpacity>
          <View style={styles.InputGap} >

          <View style={styles.inputWithIcon}>
            <Input
              label="Address Line 1 *"
              placeholder="123, XYZ Residency, Somewhere, City, ..."
              value={addressLine1}
              onChangeText={setAddressLine1}
            />
          </View>
            <Input
            label="Address Line 2"
            placeholder="123, XYZ Residency, Somewhere, City, ..."
            value={addressLine2}
            onChangeText={setAddressLine2}
          />

          <Input
            label="Phone Number"
            placeholder="+91 - 9876543210"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <Input
            label="Whatsapp Number"
            placeholder="+91 - 9876543210"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType="phone-pad"
          />

          <Input
            label="How many shops do you want to register with?"
            placeholder="Enter Number"
            value={numberOfShops}
            onChangeText={setNumberOfShops}
            keyboardType="numeric"
          />
          </View>
         
        </ScrollView>

        <View style={styles.bottomButton}>
          <FullwidthButton title="Submit" onPress={HandleSubmit} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VendorRegister;

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
    fontSize: wp(5),
    color: COLORS.BlackText,
  },

  description: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.8),
    color: COLORS.grayText,
    marginTop: hp(1),
  },

  inputWithIcon: {
    position: "relative",
  },

  iconButton: {
    position: "absolute",
    right: wp(3),
    top: hp(20),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.LocationBuleColor10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: wp(1000),
  },

  locationIcon: {
    width: wp(4),
    height: wp(4),
    resizeMode: "contain",
    tintColor: COLORS.primary || "#007AFF",
    marginRight: wp(1),
  },

  fetchText: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.2),
    color: COLORS.LocationBuleColor,
  },

  bottomButton: {
    // position: "absolute",
    bottom: hp(3),
    width: wp(90),
    alignSelf: "center",
  },
  InputGap:{
    gap:hp(1)
  }
});
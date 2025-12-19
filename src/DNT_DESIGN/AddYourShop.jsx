import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import FullwidthButton from '../Components/FullwidthButton';
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import Input from '../Components/Input';
import BigInput from "../Components/BigInput";
import { FONTS } from '../Theme/FontFamily';
import NavigationStrings from '../Navigations/NavigationStrings';

const AddYourShop = ({ navigation }) => {
    const [shopName, setShopName] = useState("")
     const [phone, setPhone] = useState("")
     const [shopAddress, setShopAddress] = useState("")
     const [shopLogo, setShopLogo] = useState(null)
     const [shopImages, setShopImages] = useState([])
  return (
    <View style={styles.container}>
        
        {/* Custom Header Section */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                <Image
                     source={require("../assets/images/LeftArrow.png")}
                     style={styles.backIcon}
                     resizeMode="contain"
                />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Setup your shop</Text>
            {/* Empty View to balance the header for perfect center text */}
            <View style={styles.emptyView} />
        </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Shop Name Input */}
        <View style={styles.inputGroup}>
            <Input
              label="Shop Name*"
              placeholder="Enter details here..."
              value={shopName}
              onChangeText={setShopName}
            />
        </View>

        {/* Shop Address Input (Large) */}
        <View style={styles.inputGroup}>
            <BigInput
              label="Shop’s Full Address*"
              placeholder="Enter details here..."
              value={shopAddress}
              onChangeText={setShopAddress}
            />
        </View>

        {/* Contact Number Input */}
        <View style={styles.inputGroup}>
          <Input
              label="Contact Number*"
              placeholder="+91 - 9999999999"
              keyboardType="phone-pad"
              value={phone}
              maxLength={10}
              onChangeText={setPhone}
            />
        </View>

      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <FullwidthButton 
            title="Next" 
            onPress={() => {navigation.navigate(NavigationStrings.DNT_AddYourShopDetails,{
              shopName:shopName,
              shopAddress:shopAddress,
              phone:phone
            })}}
        />
      </View>

    </View>
  )
}

export default AddYourShop

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2.5),
    paddingBottom: hp(2),
  },
  backButtonContainer: {
    padding: wp(1),
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
  },
  headerTitle: {
    fontSize: wp(4), // Matches standard header size
    color: COLORS.BlackText,
    textAlign: 'center',
    fontFamily:FONTS.InterSemiBold
  },
  emptyView: {
    width: wp(6), // Same width as back icon to ensure title stays perfectly centered
  },
  scrollContainer: {
    paddingTop: hp(2),
  },
  inputGroup: {
    marginBottom: hp(2.5),
  },
  footer: {
    paddingBottom: hp(10),
    marginTop: 'auto',
  }
})
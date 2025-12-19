import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import Header from '../Components/Header/Header'; 
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily"; 
import FullwidthButton from '../Components/FullwidthButton';
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';

const VerifyingDetails = () => {
    const Navigation = useNavigation()
  return (
    <View style={styles.container}>
      <Header title="Register" /> 

      <View style={styles.contentContainer}>
        <Image
          source={require("../assets/images/verify.png")}
          style={styles.verifyIcon}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Verifying Details</Text>
        
        <Text style={styles.subText}>
        We’ll notify you once your vendor application for GharTak is approved
        </Text>
      </View>

      <View style={styles.footer}>
        <FullwidthButton 
            title="Back to login" 
            onPress={()=>Navigation.navigate(NavigationStrings.DNT_LOGIN)}
        />
      </View>
    </View>
  );
};

export default VerifyingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(5),
  },
  contentContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',   
    marginBottom: hp(5),  
  },
  verifyIcon: {
    width: wp(45),
    height: wp(45),
    marginBottom: hp(3),
  },
  title: {
    fontSize: wp(5),
   
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: hp(1.5),
  },
  subText: {
    fontSize: wp(3.8),
    color: COLORS.grayText,
    textAlign: 'center',
    paddingHorizontal: wp(4), 
  },
  footer: {
    paddingBottom: hp(3), 
  }
});
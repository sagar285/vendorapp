 
 import {
   StyleSheet,
   TextInput,
   View,
   TouchableOpacity,
   Image,
   Text,
   KeyboardAvoidingView,
   Platform,
   ScrollView,
   ActivityIndicator,
   PermissionsAndroid,
   BackHandler,
   Alert
 } from "react-native";
 import React, { useState } from "react";
 import { COLORS } from "../Theme/Colors";
 import { wp, hp } from "../Theme/Dimensions";
 import { FONTS } from "../Theme/FontFamily";
 import Geolocation from 'react-native-geolocation-service';
import { useAppContext } from "../Context/AppContext";
//  LeftArrow.png
 const SHOW_PASSWORD_ICON = require("../assets/images/OpenEyeIcon.png");
 const HIDE_PASSWORD_ICON = require("../assets/images/CloseEyeIcon.png");
 
 const BigInput = ({
   label = "Label",
   placeholder = "Enter text",
   value,
   onChangeText,
   secureTextEntry = false,
   getCurrentLocation
 }) => {
   const [hidePassword, setHidePassword] = useState(secureTextEntry);
   const [inputHeight,setinputheight] =useState()

  const {addressLine1, setAddressLine1} =useAppContext()
  console.log(value,"value")
 
   return (
     <View style={styles.container}>
       {/* LABEL */}
       <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
       <Text style={styles.label}>{label}</Text>
 
 

           </View>
       {/* INPUT BOX */}
       <View style={styles.inputWrapper}>
       <TextInput
  style={styles.input}
  placeholder={placeholder}
  placeholderTextColor={COLORS.placeHolderGray}
  value={value}
  onChangeText={onChangeText}
  secureTextEntry={hidePassword}
  multiline
  textAlignVertical="top" // 👈 VERY IMPORTANT (Android)
  onContentSizeChange={(e) =>
    setinputheight(e.nativeEvent.contentSize.height)
  }
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
 
 export default BigInput;
 
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

  iconButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LocationBuleColor10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: wp(100),
    marginBottom: hp(2),
  },
 
   inputWrapper: {
    //  height: hp(12),
     borderWidth: 1,
     borderColor: "#4E4E4E99",
     borderRadius: wp(3),
     paddingLeft: wp(3),
     paddingRight: wp(3),
   
   },
   locationIcon: {
    width: wp(4),
    height: wp(4),
    resizeMode: 'contain',
    tintColor: COLORS.LocationBuleColor,
    marginRight: wp(1),
  },
 
   input: {
    minHeight: 75,
     fontFamily: FONTS.InterRegular,
     fontSize: wp(3.8),
     color: COLORS.BlackText,
    //  height: inputHeight,
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
 
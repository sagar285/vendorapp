import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { wp, hp } from "../Theme/Dimensions"; 
import { COLORS } from "../Theme/Colors"; 
import { FONTS } from '../Theme/FontFamily';

const UploadCard = ({ onPress }) => {
  return (
    <TouchableOpacity 
        style={styles.container} 
        activeOpacity={0.7} 
        onPress={onPress}
    >
      <Image
        source={require("../assets/images/Upload.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Tap to upload</Text>
      <Text style={styles.subText}>(.png, .jpg, .svg, .ico)</Text>
    </TouchableOpacity>
  )
}

export default UploadCard

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#F5F7FA',
        borderWidth: 1.5,
        borderColor: '#D4D6DD', 
        borderStyle: 'dashed', 
        borderRadius: wp(4), 
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(3.5),
        marginTop: hp(2),
    },
    image: {
        width: wp(9),
        height: wp(9),
        marginBottom: hp(1.5),
    },
    title: {
        fontSize: wp(4),
        color: COLORS.Blue || '#4778FF',
        marginBottom: hp(0.5),
        fontFamily:FONTS.InterSemiBold
    },
    subText: {
        fontSize: wp(3.2),
        color: COLORS.Blue, 
       fontFamily:FONTS.InterRegular
    }
})
import { StyleSheet, Text, View } from 'react-native'
import React, { useRef, useEffect } from 'react'
import LottieView from 'lottie-react-native'; // Library for GPay like animation
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';

const SuccessFull = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    // Component load hote hi animation play karega
    animationRef.current?.play();
  }, []);

  return (
    <View style={styles.container}>
      {/* Lottie Animation for Checkmark & Blinking Stars */}
      <View style={styles.lottieContainer}>
        <LottieView
          ref={animationRef}
          source={require("../assets/animations/Success.json")} // Apni downloaded .json file yahan lagayein
          style={styles.lottie}
          autoPlay={true}
          loop={false} // GPay ki tarah ek baar play hoke ruk jayega
          resizeMode="cover"
        />
      </View>

      <Text style={styles.successText}>Shop Created Successfully</Text>
    </View>
  )
}

export default SuccessFull

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  lottieContainer: {
    width: wp(50), 
    height: wp(50), 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  successText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: COLORS.BlackText || "#000",
    textAlign: 'center',
    fontFamily: FONTS.InterSemiBold,
    marginTop: hp(2),
  }
})
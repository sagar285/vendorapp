import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useRef, useEffect } from 'react'
import LottieView from 'lottie-react-native';
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';

const SuccessFull = () => {
  const animationRef = useRef(null);
  const navigation = useNavigation()
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    animationRef.current?.play();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);

    const timer = setTimeout(() => {
      navigation.navigate(NavigationStrings.DNT_Home)
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.lottieContainer}>
        <LottieView
          ref={animationRef}
          source={require('../assets/gt_lottie animation (1).json')}
          style={styles.lottie}
          loop={false}
        />
      </View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: translateY },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <Text style={styles.successText}>Shop Created Successfully</Text>
        {/* <Text style={styles.subText}>Your shop is now live and ready!</Text> */}
      </Animated.View>
    </View>
  );
};

export default SuccessFull;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  lottieContainer: {
    width: wp(60),
    height: wp(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp(2),
  },
  successText: {
    fontSize: wp(4.5),
    color: COLORS.BlackText || "#000",
    textAlign: 'center',
    fontFamily: FONTS.InterSemiBold,
    marginBottom: hp(1),
  },
  subText: {
    fontSize: wp(3.5),
    fontWeight: '400',
    color: COLORS.gray || "#666",
    textAlign: 'center',
    fontFamily: FONTS.InterRegular,
  },
});
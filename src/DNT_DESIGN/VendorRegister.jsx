import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  BackHandler,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import Input from '../Components/Input';
import FullwidthButton from '../Components/FullwidthButton';
import { COLORS } from '../Theme/Colors';
import { wp, hp } from '../Theme/Dimensions';
import { FONTS } from '../Theme/FontFamily';
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';
import { useAppContext } from '../Context/AppContext';
import { apiGet, apiPost } from '../Api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';

const VendorRegister = () => {
  const navigation = useNavigation();
  const { user, setUser } = useAppContext();
  const hasNavigated = useRef(false);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [numberOfShops, setNumberOfShops] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [gettingLocation, setGettingLocation] = useState(false);
  const [lat,setlat] =useState(null)
  const [long,setlong]=useState(null)
  /* ---------------- getuserProfile ---------------- */
  const getuserProfile = async () => {
    try {
      const result = await apiGet('/user/profile');
      console.log(result, 'any response');
      if (result?.user) {
        console.log('kya andar aa rhi ahi');

        // await AsyncStorage.setItem('userdata', JSON.stringify(result.user));
        //
        if (result?.user.role == 'vendor') {
          await AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [
              {
                name: NavigationStrings.DNT_LOGIN,
              },
            ],
          });
          setUser(null);
        }
      }
    } catch (error) {
      console.log('Profile error:', error);
    }
  };

  /* ---------------- getUserRequest ---------------- */
  const getUserRequest = async () => {
    try {
      const result = await apiGet('/admin/vendor_request');

      if (result?.result?.status === 'PENDING') {
        hasNavigated.current = true;
        navigation.replace(NavigationStrings.DNT_VerifyingDetails);
      }
    } catch (error) {
      console.log('Request error:', error);
    }
  };

  /* ---------------- BACK HANDLER ---------------- */
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Kya aap app band karna chahte ho?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  console.log(user, 'user');

  /* ---------------- USE EFFECT HANDLING NAVIGATION ---------------- */

  useEffect(() => {
    // 🔒 Already navigated → stop
    if (hasNavigated.current) return;

    // 🔹 User not loaded yet → fetch once
    if (user) {
      getuserProfile();
      // return;
    }

    // 🔹 USER → check vendor request
    if (user.role === 'user') {
      getUserRequest();
    }

    // 🔹 VENDOR → go dashboard
    if (user.role === 'vendor') {
      hasNavigated.current = true;
      navigation.replace(NavigationStrings.BottomTab);
    }
  }, [user]);

  /* ---------------- LOCATION ---------------- */
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    setGettingLocation(true);

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setGettingLocation(false);
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setlat(latitude)
        setlong(longitude)
        reverseGeocodeOSM(latitude, longitude);
      },
      error => {
        console.log('Location Error:', error);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const reverseGeocodeOSM = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'VendorApp/1.0',
          },
        },
      );

      const data = await res.json();

      const fullAddress = data.display_name || '';
      const parts = fullAddress.split(',').map(i => i.trim());

      setAddressLine1(parts.slice(0, 2).join(', '));
      setAddressLine2(parts.slice(2).join(', '));
    } catch (e) {
      console.log('Reverse Geocode Error:', e);
    } finally {
      setGettingLocation(false);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!addressLine1)
      return setErrors({ addressLine1: 'Address Line 1 is required' });

    if (!addressLine2)
      return setErrors({ addressLine2: 'Address Line 2 is required' });

    if (!phoneNumber)
      return setErrors({ phoneNumber: 'Phone number is required' });

    if (!whatsappNumber)
      return setErrors({ whatsappNumber: 'WhatsApp number is required' });

    if (!numberOfShops)
      return setErrors({ numberOfShops: 'Number of shops is required' });

    try {
      setLoading(true);
      setErrors({});

      const payload = {
        fullName: user?.name,
        gmail: user?.email,
        address:{
          addressLine:addressLine1 + addressLine2,
          lat:lat,
          lon:long
        },
        phoneNo: phoneNumber,
        whatsappNo: whatsappNumber,
        numberOfShops,
      };

      console.log(payload, 'payload');

      const res = await apiPost('/admin/vendor_request', payload);
      console.log(res, 'uususuus');
      if (res?.success) {
        navigation.replace(NavigationStrings.DNT_VerifyingDetails);
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getuserProfile();
      return;
    }

    // 🔹 Normal user → check vendor request
    if (user.role === 'user') {
      getUserRequest();
    }

    // 🔹 Already vendor → go to dashboard
    if (user.role === 'vendor') {
      navigation.replace(NavigationStrings.BottomTab);
    }
  }, []);

  const onLogout = async () => {
    await AsyncStorage.clear();
    setUser(null)
  };

  /* ---------------- UI ---------------- */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: hp(18) }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            {/* Left: Title + Description */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Register to become a vendor</Text>
              <Text style={styles.description}>
                Enter your details, so we can verify & approve
              </Text>
            </View>

            {/* Right: Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={getCurrentLocation}
            style={styles.iconButton}
          >
            {gettingLocation ? (
              <ActivityIndicator />
            ) : (
              <>
                <Image
                  source={require('../assets/images/Location.png')}
                  style={styles.locationIcon}
                />
                <Text style={styles.fetchText}>Fetch Location</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.InputGap}>
            <Input
              label="Address Line 1 *"
              value={addressLine1}
              onChangeText={t => {
                setAddressLine1(t);
                setErrors(prev => ({ ...prev, addressLine1: null }));
              }}
            />
            {errors.addressLine1 && (
              <Text style={styles.errorText}>{errors.addressLine1}</Text>
            )}

            <Input
              label="Address Line 2"
              value={addressLine2}
              onChangeText={t => {
                setAddressLine2(t);
                setErrors(prev => ({ ...prev, addressLine2: null }));
              }}
            />
            {errors.addressLine2 && (
              <Text style={styles.errorText}>{errors.addressLine2}</Text>
            )}

            <Input
              label="Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={t => {
                setPhoneNumber(t);
                setErrors(prev => ({ ...prev, phoneNumber: null }));
              }}
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

            <Input
              label="Whatsapp Number"
              keyboardType="phone-pad"
              value={whatsappNumber}
              onChangeText={t => {
                setWhatsappNumber(t);
                setErrors(prev => ({ ...prev, whatsappNumber: null }));
              }}
            />
            {errors.whatsappNumber && (
              <Text style={styles.errorText}>{errors.whatsappNumber}</Text>
            )}

            <Input
              label="Number of shops"
              keyboardType="numeric"
              value={numberOfShops}
              onChangeText={t => {
                setNumberOfShops(t);
                setErrors(prev => ({ ...prev, numberOfShops: null }));
              }}
            />
            {errors.numberOfShops && (
              <Text style={styles.errorText}>{errors.numberOfShops}</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomButton}>
          <FullwidthButton
            title={loading ? <ActivityIndicator color="#fff" /> : 'Submit'}
            onPress={handleSubmit}
            disabled={loading}
          />
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

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(3),
    marginBottom: hp(2),
  },

  titleContainer: {
    flex: 1, // important so text wraps properly
  },

  title: {
    fontFamily: FONTS.InterBold,
    fontSize: wp(4.4),
    color: COLORS.BlackText,
  },

  description: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.8),
    color: COLORS.grayText,
    marginTop: hp(1),
  },
  logoutButton:{
   backgroundColor:COLORS.orange,
   paddingVertical:wp(2),
   paddingHorizontal:wp(1.5),
   borderRadius:wp(2)
  },
  logoutText: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.8),
    color: COLORS.white, // ya red if logout destructive
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

  locationIcon: {
    width: wp(4),
    height: wp(4),
    resizeMode: 'contain',
    tintColor: COLORS.LocationBuleColor,
    marginRight: wp(1),
  },

  fetchText: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.2),
    color: COLORS.LocationBuleColor,
  },

  InputGap: {
    gap: hp(1),
  },

  errorText: {
    color: 'red',
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.4),
    marginTop: hp(1),
  },

  bottomButton: {
    bottom: hp(3),
    width: wp(90),
    alignSelf: 'center',
  },
});

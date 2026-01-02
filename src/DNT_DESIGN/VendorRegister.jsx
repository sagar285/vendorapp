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
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [numberOfShops, setNumberOfShops] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [gettingLocation, setGettingLocation] = useState(false);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  /* ========== ISSUE #1 FIXED ==========
     Old: if (result?.user.role == 'vendor')
     New: Removed unnecessary checks and fixed logic
  */
  const getuserProfile = async () => {
    try {
      const result = await apiGet('/user/profile');
      console.log(result, 'user profile response');
      
      if (result?.user) {
        // If user is already a vendor, redirect to dashboard
        if (result?.user.role === 'vendor') {
          await AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: NavigationStrings.DNT_LOGIN }],
          });
          setUser(null);
        }
      }
    } catch (error) {
      console.log('Profile error:', error);
    }
  };

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

  /* ========== BACK HANDLER ==========
     This is correct in both versions
  */
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
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

  /* ========== ISSUE #2 FIXED ==========
     Problem: Duplicate useEffect calling same logic twice
     Old code had TWO useEffect hooks doing similar things
     Fix: Keep only ONE useEffect with proper dependency array
  */
  useEffect(() => {
    if (hasNavigated.current) return;

    if (!user) return; // User not loaded yet

    // Check user profile first
    getuserProfile();

    // Then check vendor request status
    if (user.role === 'user') {
      getUserRequest();
    }

    // If already vendor, go to dashboard
    if (user.role === 'vendor') {
      hasNavigated.current = true;
      navigation.replace(NavigationStrings.BottomTab);
    }
  }, [user]); // Proper dependency

  /* ========== LOCATION FUNCTIONS ==========
     Keep these the same but fixed variable names
  */
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
      Alert.alert('Permission', 'Location permission is required');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLong(longitude);
        reverseGeocodeOSM(latitude, longitude);
      },
      error => {
        console.log('Location Error:', error);
        Alert.alert('Error', 'Could not get your location');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const reverseGeocodeOSM = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'VendorApp/1.0',
          },
        },
      );

      const data = await res.json();
      const fullAddress = data.display_name || 'Address not found';
      setAddress(fullAddress);
    } catch (e) {
      console.log('Reverse Geocode Error:', e);
      Alert.alert('Error', 'Could not fetch address');
    } finally {
      setGettingLocation(false);
    }
  };

  /* ========== ISSUE #3 FIXED ==========
     Problem: Validation was checking wrong field names
     Old: Checking if !addressLine2 which was removed
     New: Only checking fields that actually exist in UI
     Old: Setting error key as 'addressLine1' when checking 'address'
     New: Correct error keys that match state variables
  */
  const handleSubmit = async () => {
    // Clear previous errors
    const newErrors = {};

    // Validate address
    if (!address || address.trim() === '') {
      newErrors.address = 'Address is required';
    }

    // Validate phone number
    if (!phoneNumber || phoneNumber.trim() === '') {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    // Validate whatsapp number
    if (!whatsappNumber || whatsappNumber.trim() === '') {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (whatsappNumber.length < 10) {
      newErrors.whatsappNumber = 'WhatsApp number must be 10 digits';
    }

    // Validate number of shops
    if (!numberOfShops || numberOfShops.trim() === '') {
      newErrors.numberOfShops = 'Number of shops is required';
    } else if (isNaN(numberOfShops) || parseInt(numberOfShops) <= 0) {
      newErrors.numberOfShops = 'Please enter a valid number';
    }

    // If there are errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullName: user?.name,
        gmail: user?.email,
        address: {
          addressLine: address,
          lat: lat,
          lon: long,
        },
        phoneNo: phoneNumber,
        whatsappNo: whatsappNumber,
        numberOfShops: parseInt(numberOfShops),
      };

      console.log(payload, 'vendor request payload');

      const res = await apiPost('/admin/vendor_request', payload);
      console.log(res, 'api response');

      if (res?.success) {
        navigation.replace(NavigationStrings.DNT_VerifyingDetails);
      } else {
        Alert.alert('Error', res?.message || 'Something went wrong');
      }
    } catch (e) {
      console.log('Submit error:', e);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

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
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Register to become a vendor</Text>
              <Text style={styles.description}>
                Enter your details, so we can verify & approve
              </Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={getCurrentLocation}
            style={styles.iconButton}
          >
            {gettingLocation ? (
              <ActivityIndicator color={COLORS.LocationBuleColor} />
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
              label="Address*"
              value={address}
              multiline={true}
              numberOfLines={3}
              placeholder="Enter your shop address"
              onChangeText={t => {
                setAddress(t);
                setErrors(prev => ({ ...prev, address: null }));
              }}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}

            <Input
              label="Phone Number*"
              keyboardType="phone-pad"
              value={phoneNumber}
              maxLength={10}
              placeholder="10-digit number"
              onChangeText={t => {
                setPhoneNumber(t);
                setErrors(prev => ({ ...prev, phoneNumber: null }));
              }}
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

            <Input
              label="WhatsApp Number*"
              keyboardType="phone-pad"
              value={whatsappNumber}
              maxLength={10}
              placeholder="10-digit number"
              onChangeText={t => {
                setWhatsappNumber(t);
                setErrors(prev => ({ ...prev, whatsappNumber: null }));
              }}
            />
            {errors.whatsappNumber && (
              <Text style={styles.errorText}>{errors.whatsappNumber}</Text>
            )}

            <Input
              label="Number of Shops*"
              keyboardType="numeric"
              value={numberOfShops}
              placeholder="e.g., 2"
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

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(3),
    marginBottom: hp(2),
  },

  titleContainer: {
    flex: 1,
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

  logoutButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: wp(2),
    paddingHorizontal: wp(1.5),
    borderRadius: wp(2),
  },

  logoutText: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.8),
    color: COLORS.white,
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
    marginTop: hp(0.5),
  },

  bottomButton: {
    bottom: hp(3),
    width: wp(90),
    alignSelf: 'center',
  },
});
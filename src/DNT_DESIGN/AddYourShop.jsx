import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';
import NavigationStrings from '../Navigations/NavigationStrings';

import FullwidthButton from '../Components/FullwidthButton';
import Input from '../Components/Input';

import Geolocation from 'react-native-geolocation-service';
import { useAppContext } from '../Context/AppContext';

/* ===================================================== */
/* ================= BIG INPUT ========================== */
/* ===================================================== */

const BigInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  onFetchLocation,
  loading,
}) => {
  const [inputHeight, setInputHeight] = useState(75);

  return (
    <View style={styles.bigContainer}>
      {/* Label + Fetch */}
      <View style={styles.bigHeader}>
        <Text style={styles.label}>{label}</Text>

        <TouchableOpacity
          onPress={onFetchLocation}
          disabled={loading}
          style={[
            styles.fetchBtn,
            loading && { opacity: 0.6 },
          ]}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color={COLORS.LocationBuleColor} />
              <Text style={styles.fetchText}>Fetching…</Text>
            </>
          ) : (
            <>
              <Image
                source={require('../assets/images/Location.png')}
                style={styles.locationIcon}
              />
              <Text style={styles.fetchText}>Fetch Live Location</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Input */}
      <View style={styles.bigInputWrapper}>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeHolderGray}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
          style={[styles.bigInput, { height: inputHeight }]}
          onContentSizeChange={(e) =>
            setInputHeight(Math.max(75, e.nativeEvent.contentSize.height))
          }
        />
      </View>
    </View>
  );
};

/* ===================================================== */
/* ================= MAIN SCREEN ======================== */
/* ===================================================== */

const AddYourShop = ({ navigation }) => {

  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { addressLine1, setAddressLine1 } = useAppContext();
  const [lat,setlat] =useState(null)
  const [long,setlong]=useState(null)
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* ================= VALIDATION ================= */
  const goToNextPage = () => {
    if (!shopName.trim()) {
      Alert.alert("Validation Error", "Shop name is required.");
      return;
    }

    if (!addressLine1.trim()) {
      Alert.alert("Validation Error", "Shop address is required.");
      return;
    }

    if (!phone.trim() || phone.length !== 10) {
      Alert.alert("Validation Error", "Enter valid 10-digit number.");
      return;
    }

    navigation.navigate(NavigationStrings.DNT_AddYourShopDetails, {
      shopName,
      shopAddress: JSON.stringify({
        addressLine:addressLine1,
        lat:lat,
        lon:long
      }),
      phone,
      setShopName:setShopName,
      setPhone:setPhone,
    });
  };

  /* ================= LOCATION ================= */
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Permission Required", "Location permission denied");
      return;
    }

    setLoadingLocation(true);

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setlat(latitude)
        setlong(longitude)
        reverseGeocodeOSM(latitude, longitude);
      },
      error => {
        setLoadingLocation(false);
        Alert.alert("Error", "Unable to fetch location");
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const reverseGeocodeOSM = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 VendorApp',
        },
      });

      const data = await res.json();

      const fullAddress = data.display_name || '';

      if (isMounted.current) {
        setAddressLine1(fullAddress);
      }
    } catch (error) {
      console.log("Reverse Geocode Error:", error);
    } finally {
      if (isMounted.current) {
        setLoadingLocation(false);
      }
    }
  };

  /* ================= UI ================= */
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/images/LeftArrow.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Setup your shop</Text>
        <View style={{ width: wp(6) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          label="Shop Name*"
          placeholder="Enter shop name"
          value={shopName}
          onChangeText={setShopName}
        />

        <BigInput
          label="Shop’s Full Address*"
          placeholder="Fetching or enter address manually"
          value={addressLine1}
          onChangeText={setAddressLine1}
          onFetchLocation={getCurrentLocation}
          loading={loadingLocation}
        />

        <Input
          label="Contact Number*"
          placeholder="9999999999"
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
        />
      </ScrollView>

      <View style={styles.footer}>
        <FullwidthButton title="Next" onPress={goToNextPage} />
      </View>
    </View>
  );
};

export default AddYourShop;


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
  },

  backIcon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
  },

  headerTitle: {
    fontSize: wp(4),
    fontFamily: FONTS.InterSemiBold,
    color: COLORS.BlackText,
  },

  footer: {
    paddingBottom: hp(8),
    marginTop: 'auto',
  },

  /* ===== BIG INPUT ===== */
  bigContainer: {
    width: wp(90),
    alignSelf: 'center',
    marginBottom: hp(2.5),
  },

  bigHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },

  label: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.6),
    color: COLORS.BlackText,
  },

  fetchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LocationBuleColor10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(100),
  },

  fetchText: {
    fontSize: wp(3.2),
    marginLeft: wp(1),
    color: COLORS.LocationBuleColor,
    fontFamily: FONTS.InterMedium,
  },

  locationIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: COLORS.LocationBuleColor,
  },

  bigInputWrapper: {
    borderWidth: 1,
    borderColor: "#4E4E4E99",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
  },

  bigInput: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.8),
    color: COLORS.BlackText,
    minHeight: 75,
  },
});

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
} from "react-native";
import React, { useState,useEffect } from "react";
import Header from "../Components/Header/Header";
import Input from "../Components/Input";
import FullwidthButton from "../Components/FullwidthButton";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";
import { useNavigation } from "@react-navigation/native";
import NavigationStrings from "../Navigations/NavigationStrings";
import { useAppContext } from "../Context/AppContext";
import { apiGet, apiPost } from "../Api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "react-native-geolocation-service";
const VendorRegister = () => {
  const navigation = useNavigation();
  const { user } = useAppContext();
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [numberOfShops, setNumberOfShops] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingRequest, setPendingRequest] = useState(false);
   const [userShops, setUserShops] = useState([]);

  const requestLocationPermission = async () => {
  if (Platform.OS === "android") {
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
    console.log("Location permission denied");
    return;
  }

  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      console.log("LAT:", latitude);
      console.log("LNG:", longitude);

      reverseGeocodeOSM(latitude, longitude);
    },
    (error) => {
      console.log("Location Error:", error);
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
        "Accept": "application/json",
        "User-Agent": "VendorApp/1.0 (contact@yourapp.com)",
      },
    });

    const text = await res.text();

    if (!text.startsWith("{")) {
      console.log("Non-JSON response:", text);
      return;
    }

    const data = JSON.parse(text);

    const fullAddress = data.display_name || "";
    const parts = fullAddress.split(",").map(item => item.trim());

    const line1 = parts.slice(0, 2).join(", ");
    const line2 = parts.slice(2).join(", ");

    console.log("ADDRESS LINE 1:", line1);
    console.log("ADDRESS LINE 2:", line2);

    setAddressLine1(line1);
    setAddressLine2(line2);

  } catch (error) {
    console.log("Reverse Geocode Error:", error);
  }
};


   const getdatauserid = async () => {
    let userId;
    const userInfo = await AsyncStorage.getItem("userdata");
    if (userInfo) {
      userId = JSON.parse(userInfo)?._id;
    }
    console.log(userId,"userid dekh ayiii hai kya eske passsssssssssss")
   }



   
  const handleSubmit = async () => {
    if (
      !addressLine1 ||
      !addressLine2 ||
      !phoneNumber ||
      !whatsappNumber ||
      !numberOfShops
    ) {
      setErrorMsg("All fields are required");
      return;
    }

    
    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        fullName: user?.name,
        gmail: user?.email,
        address: `${addressLine1} ${addressLine2}`,
        phoneNo: phoneNumber,
        whatsappNo: whatsappNumber,
        numberOfShops: numberOfShops,
        // userId: userId,
      };

      const res = await apiPost("/admin/vendor_request", payload);
       console.log(res,"ye register hua hai user")
      if (res?.success) {
        navigation.replace(NavigationStrings.DNT_VerifyingDetails);
      } else {
        setErrorMsg("Failed to submit request");
      }
    } catch (error) {
      setErrorMsg(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

    
  
     const getUserRequest = async () => {
        const result = await apiGet("/admin/vendor_request");
        console.log(result,"usussususususu")
        if (result.message == "user vedor request succesfully") {
          const request = result.result;
          console.log(request == 'null',"request",request == null)
          if (request?.status == "PENDING" && request !='null') {
          return navigation.navigate( NavigationStrings.DNT_VerifyingDetails)
          }
          if (request == null) {
          return navigation.navigate( NavigationStrings.BottomTab)
          } 
        }
      };
  
  
        const getShops = async () => {
          try {
            const result = await apiGet('/vendor/shop/get');
            if (result.message === 'user shop get succed') {
              setUserShops(result.data);
              if(result.data.length > 0){
                navigation.navigate( NavigationStrings.DNT_Home)
              }
            }
          } catch (error) {
            if (error.message === 'Not have valid role') {
              setopenform(true);
            }
          }
        };
  
   useEffect(() => {
      getUserRequest();
      // getShops();
    }, []);

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

          <TouchableOpacity onPress={getCurrentLocation} style={styles.iconButton}>
            <Image
              source={require("../assets/images/Location.png")}
              style={styles.locationIcon}
            />
            <Text style={styles.fetchText}>Fetch Location</Text>
          </TouchableOpacity>

          <View style={styles.InputGap}>
            <Input
              label="Address Line 1 *"
              placeholder="123, XYZ Residency, Somewhere, City"
              value={addressLine1}
              onChangeText={setAddressLine1}
            />

            <Input
              label="Address Line 2"
              placeholder="Apartment, landmark, etc"
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

            {errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.bottomButton}>
          <FullwidthButton
            title={
              loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                "Submit"
              )
            }
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

  iconButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.LocationBuleColor10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: wp(100),
    marginBottom: hp(2),
  },

  locationIcon: {
    width: wp(4),
    height: wp(4),
    resizeMode: "contain",
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
    color: "red",
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.4),
    marginTop: hp(1),
  },

  bottomButton: {
    bottom: hp(3),
    width: wp(90),
    alignSelf: "center",
  },
});

import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState,useEffect } from 'react';
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';
import ShopCard from '../Components/Cards/ShopCard';
import { apiGet } from '../Api/Api';
import RNFS from "react-native-fs";
import Share from "react-native-share";
import RNBlob from "react-native-blob-util";
const Home = () => {


   const [userShops, setUserShops] = useState([]);
     const [loadingQR, setLoadingQR] = useState(false);
     const [qrImageBase64, setQrImageBase64] = useState(null);

  const getShops = async () => {
    try {
      const result = await apiGet('/vendor/shop/get');
      console.log(result,"user shop reust")
      if (result.message === 'user shop get succed') {
        setUserShops(result.data);  
      }
    } catch (error) {
      if (error.message === 'Not have valid role') {
        setopenform(true);
      }
    }
  };

  console.log(userShops,"kkkkk")

   useEffect(() => {
      getShops();
    }, []);

  const handleViewShop = (shop) => {
    console.log("View Shop:", shop);
    // Add your navigation logic here
  };



   const handleShareQR = async (shop) => {
      try {
        setLoadingQR(true);
    
        const result = await apiGet(`/vendor/shop/qr/${shop._id}`);
        const base64 = result?.qrImage;
    
        if (!base64) {
          setLoadingQR(false);
          Alert.alert("Error", "Failed to generate QR code.");
          return;
        }
    
        // DO NOT manipulate base64 string from backend  
        setQrImageBase64(base64);
    
        setLoadingQR(false);

        const base64Data = base64.split("base64,")[1];
              const filePath = RNBlob.fs.dirs.CacheDir + `/qr_${Date.now()}.png`;
               await RNBlob.fs.writeFile(filePath, base64Data, "base64");
               console.log("BLOB FILE PATH:", filePath);


          const contentUri = await RNBlob.fs.stat(filePath).then((info) => info.path);
          
              console.log("CONTENT URI:", contentUri);
              await Share.open({
                url: "file://" + contentUri,
                type: "image/png",
                failOnCancel: false,
              });

    
      } catch (error) {
        setLoadingQR(false);
        Alert.alert("Error", "Something went wrong.");
      }
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Image
            source={require("../assets/images/Search.png")}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <Text style={styles.searchPlaceholder}>Search for your shops within...</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Image
            source={require("../assets/images/Add.png")}
            style={styles.iconADD}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {userShops?.map((shop) => (
          <ShopCard 
            key={shop.id} 
            shop={shop}
            onViewShop={handleViewShop}
            onShareQR={handleShareQR}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    gap: wp(3),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: wp(2.5),
    paddingHorizontal: wp(3),
    height: hp(6),
    gap: wp(2),
  },
  searchIcon: {
    width: wp(5),
    height: wp(5),
  },
  searchPlaceholder: {
    fontSize: wp(3.5),
    color: COLORS.grayText,
    fontFamily: FONTS.InterRegular,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconADD: {
    width: wp(10),
    height: wp(10),
  },
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(8),
  },
});
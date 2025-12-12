import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';
import ShopCard from '../Components/Cards/ShopCard';

const Home = () => {
  const [shops, setShops] = useState([
    {
      id: 1,
      name: "Balaji Boot House",
      images: [
        require("../assets/images/img.png"),
        require("../assets/images/img.png"),
        require("../assets/images/img.png"),
      ],
      location: "Indore",
      phone: "9999999999",
    },
    {
      id: 2,
      name: "Shree Vinayak Optical",
      images: [
        require("../assets/images/img.png"),
        require("../assets/images/img.png"),
        require("../assets/images/img.png"),
      ],
      location: "Indore",
      phone: "9999999999",
    },
    {
      id: 3,
      name: "Dhruv Earth Moverse",
      images: [
        require("../assets/images/img.png"),
        require("../assets/images/img.png"),
        require("../assets/images/img.png"),
      ],
      location: "Indore",
      phone: "9999999999",
    },
  ]);

  const handleViewShop = (shop) => {
    console.log("View Shop:", shop);
    // Add your navigation logic here
  };

  const handleShareQR = (shop) => {
    console.log("Share QR Code:", shop);
    // Add your share logic here
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
        {shops.map((shop) => (
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
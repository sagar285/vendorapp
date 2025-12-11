import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';

const Home = () => {
  const [shops, setShops] = useState([
    {
      id: 1,
      name: "Shop Name #1",
      image: require("../assets/images/img.png"),
      location: "Indore",
      phone: "9999999999",
    },
    {
      id: 2,
      name: "Shop Name #1",
      image: require("../assets/images/img.png"),
      location: "Indore",
      phone: "9999999999",
    },
    {
      id: 3,
      name: "Shop Name #1",
      image: require("../assets/images/img.png"),
      location: "Indore",
      phone: "9999999999",
    },
  ]);

  const [currentSlide, setCurrentSlide] = useState({});

  const ShopCard = ({ shop }) => {
    return (
      <View style={styles.cardContainer}>
        {/* Image Slider */}
        <View style={styles.imageContainer}>
          <Image
            source={shop.image}
            style={styles.shopImage}
            resizeMode="cover"
          />
          {/* Carousel Dots */}
          {/* <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View> */}
        </View>

        {/* Shop Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.shopName}>{shop.name}</Text>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Image
                source={require("../assets/images/LocationPin.png")}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.detailText}>{shop.location}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Image
                source={require("../assets/images/Call.png")}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.detailText}>{shop.phone}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Shop</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share QR Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Image
            source={require("../assets/images/Search.png")}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <Text style={styles.searchPlaceholder}>Search for your shops within...</Text>
        </View>
        <Image
                source={require("../assets/images/Upload.png")}
                style={styles.iconADD}
                resizeMode="contain"
              />
      </View>

      {/* Shops List */}
      <FlatList
        data={shops}
        renderItem={({ item }) => <ShopCard shop={item} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
      />
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
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    height: hp(5.5),
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
    width: wp(13),
    height: wp(13),
    borderRadius: wp(3),
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: wp(7),
    color: COLORS.white,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    gap: hp(2),
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: wp(3),
    overflow: 'hidden',
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: hp(25),
  },
  shopImage: {
    width: '100%',
    height: '100%',
    borderRadius:wp(6),
    paddingHorizontal:wp(5)
  },
  iconADD: {
    width:wp(10),
    height:hp(10),
  },
  dotsContainer: {
    position: 'absolute',
    bottom: hp(2),
    alignSelf: 'center',
    flexDirection: 'row',
    gap: wp(2),
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: COLORS.white,
    opacity: 0.6,
  },
  activeDot: {
    opacity: 1,
  },
  infoContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    gap: hp(1.5),
    flexDirection:"row",
    justifyContent:"space-between"
  },
  shopName: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: COLORS.BlackText,
    fontFamily: FONTS.InterSemiBold,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: wp(6),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  icon: {
    width: wp(4),
    height: wp(4),
  },
  detailText: {
    fontSize: wp(3.5),
    color: COLORS.grayText,
    fontFamily: FONTS.InterRegular,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  viewButton: {
    flex: 1,
    backgroundColor: COLORS.orange,
    borderRadius: wp(2),
    paddingVertical: hp(1.8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: COLORS.white,
    fontSize: wp(3.8),
    fontWeight: '600',
    fontFamily: FONTS.InterSemiBold,
  },
  shareButton: {
    flex: 1,
    backgroundColor: COLORS.Blue,
    borderRadius: wp(2),
    paddingVertical: hp(1.8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: COLORS.white,
    fontSize: wp(3.8),
    fontWeight: '600',
    fontFamily: FONTS.InterSemiBold,
  },
});
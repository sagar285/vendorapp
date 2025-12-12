import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import FullwidthButton from '../Components/FullwidthButton';
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';
import ImageScrollView from "../Components/ImageScrollerContainer/ImageScrollerWithoutDot";
import NavigationStrings from '../Navigations/NavigationStrings';

const ViewShop = ({ navigation, route }) => {
  const shop = route?.params?.shop || {
    name: "Shop Name #1",
    location: "1234, very very long field of address,",
    location1: " then next line is also little length of,",
    location2: "the shop's location,",
    phone: "+91 - 9999999999",
    createdOn: "10 Dec 2025",
    modifiedOn: "10 Dec 2025",
    totalCategories: 13,
    totalMenuItems: 71,
    images: [
      require("../assets/images/img.png"),
      require("../assets/images/img.png"),
      require("../assets/images/img.png"),
    ],
    qrCode: require("../assets/images/QR.png"),
    categories: ["Category Name #1", "Category Name #2", "Category Name #3"],
    menuItems: ["Menu Name #1", "Menu Name #2", "Menu Name #3"],
  };

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllMenuItems, setShowAllMenuItems] = useState(false);

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/images/LeftArrow.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup your shop</Text>
        <View style={styles.emptyView} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Shop Info Section */}
        <View style={styles.detailsContainer}>
          
          {/* Shop Name and QR Code */}
          <View style={styles.shopHeaderRow}>
            <View style={styles.shopInfoSection}>
              <Text style={styles.shopName}>{shop.name}</Text>
              <Text style={styles.shopMeta}>Created on <Text style={styles.MiniText}>{shop.createdOn}</Text></Text>
              <Text style={styles.shopMeta}>Modified on <Text style={styles.MiniText}>{shop.modifiedOn}</Text></Text>
              <Text style={styles.shopMeta}>Total Categories: <Text style={styles.MiniText}>{shop.totalCategories}</Text></Text>
              <Text style={styles.shopMeta}>Total Menu Items: <Text style={styles.MiniText}>{shop.totalMenuItems}</Text></Text>
            </View>

            <Image
              source={shop.qrCode}
              style={styles.qrCode}
              resizeMode="cover"
            />
          </View>

          {/* Location */}
          <View style={styles.infoRowWithIcon}>
            <Image
              source={require("../assets/images/LocationPin.png")}
              style={styles.infoIcon}
              resizeMode="contain"
            />
            <Text style={styles.locationText}>{shop.location}{"\n"}{shop.location1} {"\n"} {shop.location2} </Text>
          </View>

          {/* Phone */}
          <View style={styles.infoRowWithIcon}>
            <Image
              source={require("../assets/images/Call.png")}
              style={styles.infoIcon}
              resizeMode="contain"
            />
            <Text style={styles.phoneText}>{shop.phone}</Text>
          <TouchableOpacity style={styles.generateQRButton}>
            <Text style={styles.generateQRText}>Generate New QR</Text>
          </TouchableOpacity>
          </View>

          {/* Generate QR Button */}

        </View>

        {/* Shop Images Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Shop Images</Text>
          <ImageScrollView images={shop.images} />
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <View style={styles.tagsContainer}>
            {(showAllCategories ? shop.categories : shop.categories.slice(0, 3)).map((category, index) => (
              <>
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{category}</Text>
              </View>
             
                </>
            ))}
             <Image
                  source={require("../assets/images/Down.png")}
                  style={styles.moreIcon}
                  resizeMode="contain"
                />
            {shop.categories.length > 3 && (
              <TouchableOpacity 
                style={styles.moreTag}
                onPress={() => setShowAllCategories(!showAllCategories)}
              >
                <Image
                  source={require("../assets/images/Down.png")}
                  style={styles.moreIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Menu Items Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu Items</Text>
          </View>
          <View style={styles.tagsContainer}>
            {(showAllMenuItems ? shop.menuItems : shop.menuItems.slice(0, 3)).map((item, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
             <Image
                  source={require("../assets/images/Down.png")}
                  style={styles.moreIcon}
                  resizeMode="contain"
                />

          </View>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <FullwidthButton 
          title="Manage Shop" 
          onPress={() => {navigation.navigate(NavigationStrings.DNT_SuccesFull)}}
        />
      </View>

    </View>
  )
}

export default ViewShop

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
  },
  headerTitle: {
    fontSize: wp(4), 
    color: COLORS.BlackText,
    textAlign: 'center',
    fontFamily: FONTS.InterSemiBold, 
  },
  emptyView: {
    width: wp(6), 
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(20),
  },
  detailsContainer: {
    marginBottom: hp(3),
  },
  shopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  shopInfoSection: {
    flex: 1,
    marginRight: wp(3),
  },
  shopName: {
    fontSize: wp(5),
    fontWeight: '700',
    color: COLORS.BlackText,
    fontFamily: FONTS.InterBold,
    marginBottom: hp(0.5),
  },
  shopMeta: {
    fontSize: wp(2.8),
    color: COLORS.grayText,
    fontFamily: FONTS.InterRegular,
    marginBottom: hp(0.3),
  },
   MiniText:{
    color:"#000",
    fontFamily:FONTS.InterSemiBold
  },
  qrCode: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(2),
  },
  infoRowWithIcon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
    justifyContent:"center",
    alignItems:"center"
  },
  infoIcon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(2.5),
    marginTop: hp(0.3),
    tintColor: COLORS.orange,
  },
  locationText: {
    fontSize: wp(3),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterSemiBold,
    flex: 1,
    lineHeight: hp(2.2),
  },
  phoneText: {
    fontSize: wp(3),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterSemiBold,
    flex: 1,
  },
  generateQRButton: {
    backgroundColor:COLORS.orange,
    borderRadius: wp(2.5),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(1.2),
    alignSelf: 'flex-start',
    marginTop: hp(1),
  },
  generateQRText: {
    color: COLORS.white,
    fontSize: wp(3),
    fontWeight: '600',
    fontFamily: FONTS.InterSemiBold,
  },
  sectionContainer: {
    marginBottom: hp(2.5),
  },
  sectionHeader: {
    marginBottom: hp(1),
  },
  sectionTitle: {
    fontSize: wp(4),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterMedium,
    marginBottom: hp(1),
  },
  tagsContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    gap: wp(1),
  },
  tag: {
    backgroundColor:COLORS.Blue10,
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: '#D0E3FF',
    paddingHorizontal:wp(1)
  },
  tagText: {
    fontSize: wp(2.9),
    color:COLORS.Blue,
    fontFamily: FONTS.InterMedium,
    fontWeight: '500',
  },
  moreTag: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  moreIcon: {
    width: wp(3.8),
    height: wp(3.8),
    alignContent:"center",
    marginTop:hp(0.8),
    marginLeft:wp(0.5)
  },
  footer: {
    position: 'absolute',
    bottom:hp(9),
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(5),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
 
});
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import FullwidthButton from '../Components/FullwidthButton';
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';
import UploadCard from "../Components/UploadCard";
import NavigationStrings from '../Navigations/NavigationStrings';

const AddYourShopDetails = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
              <Image
                   source={require("../assets/images/LeftArrow.png")}
                   style={styles.backIcon}
                   resizeMode="contain"
              />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Setup your shop</Text>
          <View style={styles.emptyView} />
      </View>

      <View Style={styles.scrollContainer}>
        
        {/* Shop Info Section */}
        <View style={styles.detailsContainer}>
            
            {/* Shop Name Row */}
            <View style={styles.infoRow}>
                <Text style={styles.shopName}>Shop Name #1</Text>
                <Image
                    source={require("../assets/images/rightCheck.png")}
                    style={styles.checkIcon}
                    resizeMode="contain"
                />
            </View>

            {/* Address Row */}
            <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                <Image
                     source={require("../assets/images/LocationPin.png")}
                     style={styles.icon}
                     resizeMode="contain"
                />
                <Text style={styles.infoText}>
                    1234, very very long field of address, then next line is also little lengthy of the shop’s location
                </Text>
               
                <Image
                    source={require("../assets/images/rightCheck.png")}
                    style={styles.checkIcon}
                    resizeMode="contain"
                />
               
            </View>

            {/* Phone Row */}
            <View style={styles.infoRow}>
                 <Image
                     source={require("../assets/images/Call.png")}
                     style={styles.icon}
                     resizeMode="contain"
                />
                <Text style={styles.infoText}>9999999999</Text>
                <Image
                    source={require("../assets/images/rightCheck.png")}
                    style={styles.checkIcon}
                    resizeMode="contain"
                />
            </View>
        </View>

        {/* Instructions */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Please Upload Pictures</Text>
            <Text style={styles.sectionSubTitle}>upto 5 pictures of your shop and a logo you{"\n"} use for your business.</Text>
        </View>

        {/* Logo Upload */}
        <View style={styles.uploadGroup}>
            <Text style={styles.label}>Logo*</Text>
            <UploadCard />
        </View>

        {/* Shop Images Upload */}
        <View style={styles.uploadGroup}>
            <Text style={styles.label}>Shop Images (upto 5)*</Text>
            <UploadCard />
        </View>

      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <FullwidthButton 
            title="Submit" 
            onPress={() => {navigation.navigate(NavigationStrings.DNT_Home)}}
            style={{ backgroundColor: '#C4C4C4' }} 
        />
      </View>

    </View>
  )
}

export default AddYourShopDetails

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
    paddingBottom: hp(2),
  },
  backButtonContainer: {
    padding: wp(1),
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
  },
  headerTitle: {
    fontSize: wp(4.8), 
    color: COLORS.BlackText,
    textAlign: 'center',
    fontWeight: '700', 
    fontFamily: FONTS.InterSemiBold, 
  },
  emptyView: {
    width: wp(6), 
  },
  scrollContainer: {
    paddingTop: hp(1),
    paddingBottom: hp(2),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  shopName: {
    fontSize: wp(5),
    fontWeight: '700',
    color: COLORS.BlackText,
    flex: 1,
    fontFamily: FONTS.InterBold,
  },
  icon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(3),
    tintColor: '#555555', 
    marginTop: hp(0.5), 
  },
  checkIcon: {
    width: wp(6),
    height: wp(6),
    marginLeft: 'auto', 
  },
  infoText: {
    fontSize: wp(4),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterRegular,
    flex: 1,
    paddingRight: wp(2),
    lineHeight: hp(2.8),
  },
  sectionHeader: {
    marginBottom: hp(1.5),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: COLORS.BlackText,
    marginBottom: hp(0.5),
    fontFamily: FONTS.InterSemiBold,
  },
  sectionSubTitle: {
    fontSize: wp(3.5),
    color: COLORS.grayText || '#999',
    lineHeight: hp(2.2),
    fontFamily: FONTS.InterRegular,
  },
  uploadGroup: {
    marginBottom: hp(0.5),
  },
  label: {
    fontSize: wp(4),
    fontWeight: '500',
    color: COLORS.BlackText,
    fontFamily: FONTS.InterMedium,
  },
  footer: {
    paddingBottom: hp(8),
    marginTop: 'auto',
  },
  Rightcontainer:{
    backgroundColor:COLORS.Green10,
    borderWidth:wp(0.1),
    borderColor:COLORS.Green10,
    borderRadius:wp(1000),
  },
  detailsContainer:{
    marginBottom:hp(1)
  }
})
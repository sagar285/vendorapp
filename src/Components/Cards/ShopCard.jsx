import { StyleSheet, Text, View, Image, TouchableOpacity,Alert } from 'react-native';
import React from 'react';
import { COLORS } from '../../Theme/Colors';
import { wp, hp } from '../../Theme/Dimensions';
import { FONTS } from '../../Theme/FontFamily';
import ImageScrollView from '../ImageScrollerContainer/ImageScrollView';
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../../Navigations/NavigationStrings';
import { apiDelete, BACKEND_URL } from '../../Api/Api';
const ShopCard = ({ shop, onViewShop, onShareQR,getusershops }) => {
  console.log(shop, 'shop');
  const navigation = useNavigation();
  //  const logoUrl = shop.shopLogo
  //               ? `${BACKEND_URL.replace('/api', '')}/${shop.shopLogo.replace(/\\/g, '/')}`
  //               : null;


    const deleteItems = itemId => {
      Alert.alert('Delete Shop', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiDelete(`/vendor/shop/deleteSpecificshop/${itemId}`);
              // setItems(prev => prev.filter(i => i._id !== itemId));
              getusershops()
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]);
    };


  return (
    <View style={styles.cardContainer}>
      {shop.shopImages.length > 0 && (
        <ImageScrollView images={shop.shopImages} />
      )}

      <View style={styles.infoContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={styles.shopName}>{shop?.shopName}</Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Image
                source={require('../../assets/images/LocationPin.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.detailText}>
                {shop?.shopAddress?.addressLine?.length > 9
                  ? shop.shopAddress?.addressLine?.slice(0, 9) + '..'
                  : shop?.shopAddress?.addressLine}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Image
                source={require('../../assets/images/Call.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.detailText}>{shop?.phone}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate(NavigationStrings.DNT_ViewShop, {
              shop: shop,
            })
          }
        >
          <Text style={styles.viewButtonText}>View Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => onShareQR && onShareQR(shop)}
        >
          <Text style={styles.shareButtonText}>Share QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>deleteItems(shop._id)} style={styles.DeleteButton}>
              <Image
                source={require('../../assets/images/Delete.png')}
                style={styles.deleteIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: wp(4),
    overflow: 'hidden',
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  DeleteButton:{
     marginTop:wp(2),
     backgroundColor:COLORS.orange10,
     borderRadius:wp(10),
     width:wp(10),
     height:wp(10),
     justifyContent:"center",
  },
  deleteIcon:{
   width:wp(8),
   height:wp(8),
   alignSelf:"center"
  },
  infoContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
  },
  shopName: {
    fontSize: wp(3.6),
    fontWeight: '600',
    color: COLORS.BlackText,
    fontFamily: FONTS.InterSemiBold,
    marginBottom: hp(1),
  },
  detailsRow: {
    flexDirection: 'row',
    gap: wp(4),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  icon: {
    width: wp(4),
    height: wp(4),
  },
  detailText: {
    fontSize: wp(3.3),
    color: COLORS.grayText,
    fontFamily: FONTS.InterRegular,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: wp(3),
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    paddingBottom: hp(2),
  },
  viewButton: {
    flex: 1,
    backgroundColor: COLORS.orange,
    borderRadius: wp(2),
    paddingVertical: hp(1.5),
    maxWidth:wp(35),
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
    maxWidth:wp(35),
    paddingVertical: hp(1.5),
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

export default ShopCard;

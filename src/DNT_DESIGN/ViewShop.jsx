import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import FullwidthButton from '../Components/FullwidthButton';
import { COLORS } from '../Theme/Colors';
import { wp, hp } from '../Theme/Dimensions';
import { FONTS } from '../Theme/FontFamily';
import NavigationStrings from '../Navigations/NavigationStrings';
import { apiGet } from '../Api/Api';
import ImageScrollView from '../Components/ImageScrollerContainer/ImageScrollerWithoutDot';
import { useFocusEffect } from '@react-navigation/native';
import ImageModal from "../Components/ViewImageModal/ImageModal";
import EditShopModal from "../Components/EditShopModal/EditShopModal"


const ViewShop = ({ navigation, route }) => {
  const paramsshop = route?.params?.shop;
  const [shopDetail, setShopDetail] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllMenuItems, setShowAllMenuItems] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrImageBase64, setQrImageBase64] = useState(null);
  const [imageModalVsible,setimageModalvisible] =useState(false);
const [editModalVisible, setEditModalVisible] = useState(false);
  console.log(paramsshop,"paramsshop")

  /* -------------------------------- FORMAT DATA -------------------------------- */

  const formatShopDetails = apiData => {
    const shop = apiData?.shop;
    const categories = apiData?.categories || [];

    const addressParts = shop?.shopAddress
      ? shop.shopAddress?.addressLine?.match(/.{1,30}/g)
      : [];

    const totalMenuItems = categories.reduce(
      (sum, cat) => sum + (cat?.items?.length || 0),
      0,
    );

    return {
      id: shop?._id,
      name: shop?.shopName || '',
      fullAddress: shop?.shopAddress?.addressLine || '',
      location: addressParts?.[0] || '',
      location1: addressParts?.[1] || '',
      location2: addressParts?.[2] || '',
      phone: shop?.phone ? `+91 - ${shop.phone}` : '',
      createdOn: shop?.createdAt ? new Date(shop.createdAt).toDateString() : '',
      modifiedOn: shop?.updatedAt
      ? new Date(shop.updatedAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : '',
      totalCategories: categories.length,
      totalMenuItems,
      images: shop?.shopImages || [],
      categories: categories.map(cat => cat?.categoryName).filter(Boolean),
      menuItems: categories.flatMap(
        cat => cat?.items?.map(item => item).filter(Boolean) || [],
      ),
    };
  };


  const goToNextPage = async() =>{
    if(shopDetail?.categories?.length == 0 ){
      navigation.navigate(NavigationStrings.DNT_AddNewCategory, {
        shopId: paramsshop?._id,
      })
    }
    else{
      navigation.navigate(NavigationStrings.DNT_CategoryMenu, {
        shopId: paramsshop?._id,
      })
    }
  }

  /* -------------------------------- API CALL -------------------------------- */

  const getShopDetails = async () => {
    try {
      const url = `/vendor/shop/getShopDetail/${paramsshop?._id}`;
      const result = await apiGet(url);
      console.log(result,"hhhjjhhjhjhhhhhhjh")
      const formatted = formatShopDetails(result?.data);
      setShopDetail(formatted);
    } catch (error) {
      Alert.alert('Error', 'Failed to load shop details');
    }
  };

  const getQRCode = async () => {
    try {
      setLoadingQR(true);
      const result = await apiGet(`/vendor/shop/qr/${paramsshop?._id}`);
      const base64 = result?.qrImage;

      if (!base64) {
        setLoadingQR(false);
        Alert.alert('Error', 'Failed to generate QR code.');
        return;
      }

      // DO NOT manipulate base64 string from backend
      setQrImageBase64(base64);

      setLoadingQR(false);
    } catch (error) {
      setLoadingQR(false);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

useFocusEffect(useCallback(()=>{
  if (paramsshop?._id) {
    getShopDetails(); 
  }
},[]))

const onClose = () =>{
  setimageModalvisible(false);
}

  /* -------------------------------- UI -------------------------------- */

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/images/LeftArrow.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Details</Text>
       <View style={styles.emptyView}>
  <TouchableOpacity 
    activeOpacity={0.7} 
    onPress={() => {
      console.log("Opening Modal..."); // Debugging ke liye
      setEditModalVisible(true);
    }}
  >
    <Image
      source={require('../assets/images/Pen.png')}
      style={styles.EditIcon}
    />
  </TouchableOpacity>
</View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* SHOP DETAILS */}
        <View style={styles.topSection}>
          {/* LEFT : SHOP INFO */}
          <View style={styles.leftInfo}>
            <Text style={styles.shopName}>{shopDetail?.name}</Text>

            {/* <Text style={styles.shopMeta}>
              Created on{' '}
              <Text style={styles.MiniText}>{shopDetail?.createdOn}</Text>
            </Text> */}

            <Text style={styles.shopMeta}>
              Modified on{' '}
              <Text style={styles.MiniText}>{shopDetail?.modifiedOn}</Text>
            </Text>

            <Text style={styles.shopMeta}>
              Total Categories:{' '}
              <Text style={styles.MiniText}>{shopDetail?.totalCategories}</Text>
            </Text>

            <Text style={styles.shopMeta}>
              Total Menu Items:{' '}
              <Text style={styles.MiniText}>{shopDetail?.totalMenuItems}</Text>
            </Text>

            {/* ADDRESS */}
            <View style={styles.infoRow}>
              <Image
                source={require('../assets/images/LocationPin.png')}
                style={styles.infoIcon}
              />
              <Text style={styles.locationText}>
                {shopDetail?.location}
                {'\n'}
                {shopDetail?.location1}
                {'\n'}
                {shopDetail?.location2}
              </Text>
            </View>

            {/* PHONE */}
            <View style={styles.infoRow}>
              <Image
                source={require('../assets/images/Call.png')}
                style={styles.infoIcon}
              />
              <Text style={styles.phoneText}>{shopDetail?.phone}</Text>
            </View>
          </View>

          {/* RIGHT : QR + BUTTON */}
          <View style={styles.qrSection}>
            { (
              <TouchableOpacity
              onPress={()=>setimageModalvisible(true)}
              >
             <Image
             source={
               qrImageBase64
                 ? { uri: qrImageBase64 }
                 : require('../assets/images/QR.png')
             }
             style={styles.qrImage}
             blurRadius={qrImageBase64 ? 0 : 6}
           />
           </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.generateQrButton}
              onPress={getQRCode}
              disabled={loadingQR}
            >
              <Text style={styles.generateQrText}>
                {loadingQR ? 'Generating...' : 'Generate QR'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LOCATION */}

        {/* PHONE */}

        {/* SHOP IMAGES */}
        {shopDetail?.images?.length > 0 && (
          <View style={styles.sectionContainer}>
            {/* <Text style={styles.sectionTitle}>Shop Images</Text> */}
            <ImageScrollView images={shopDetail?.images} />
          </View>
        )}

        {/* CATEGORIES */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.tagsContainer}>
            {(showAllCategories
              ? shopDetail?.categories
              : shopDetail?.categories?.slice(0, 3)
            )?.map((cat, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{cat}</Text>
              </View>
            ))}
            {shopDetail?.categories?.length > 3 && (
              <TouchableOpacity
                style={styles.moreTag}
                onPress={() => setShowAllCategories(!showAllCategories)}
              >
                <Image
                  source={require('../assets/images/Down.png')}
                  style={styles.moreIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* MENU ITEMS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Menu Items</Text>
          <View style={styles.tagsContainer}>
            {(showAllMenuItems
              ? shopDetail?.menuItems
              : shopDetail?.menuItems?.slice(0, 3)
            )?.map((item, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
            {shopDetail?.menuItems?.length > 3 && (
              <TouchableOpacity
                style={styles.moreTag}
                onPress={() => setShowAllMenuItems(!showAllMenuItems)}
              >
                <Image
                  source={require('../assets/images/Down.png')}
                  style={styles.moreIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <FullwidthButton
          title="Manage Shop"
          onPress={goToNextPage}
          
        />
      </View>

      <ImageModal 
      visible = {imageModalVsible}
      qrImageBase64={qrImageBase64}
      onClose={onClose}
      id={shopDetail?.id}
      />
     <EditShopModal
        visible={editModalVisible}
        shopData={shopDetail}
        ShopAllData={paramsshop}
        onClose={(refresh) => {
          setEditModalVisible(false);
          if (refresh) {
            getShopDetails(); 
          }
        }}
      />
    </View>
  );
};

export default ViewShop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(3),
  },
  
  leftInfo: {
    flex: 1,
    paddingRight: wp(3),
  },
  
  qrSection: {
    width: wp(32),
    alignItems: 'center',
  },
  
  qrImage: {
    width: wp(32),
    height: wp(32),
    backgroundColor: '#fff',
    borderRadius: wp(2),
    marginBottom: hp(1.5),
  },
  
  generateQrButton: {
    backgroundColor: COLORS.orange,
    width: '90%',
    paddingVertical: hp(1.2),
    borderRadius: wp(2),
  },
  
  generateQrText: {
    color: COLORS.white,
    fontSize: wp(3.2),
    fontFamily: FONTS.InterSemiBold,
    textAlign: 'center',
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
    width: wp(4),
    height: wp(4),
  },
  EditIcon: {
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

  infoRow: {
    display: 'flex',
    flexDirection: 'row',
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
  MiniText: {
    color: '#000',
    fontFamily: FONTS.InterSemiBold,
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
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: COLORS.orange,
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
    backgroundColor: COLORS.Blue10,
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: '#D0E3FF',
    paddingHorizontal: wp(1),
  },
  tagText: {
    fontSize: wp(2.9),
    color: COLORS.Blue,
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
    alignContent: 'center',
    marginTop: hp(0.8),
    marginLeft: wp(0.5),
  },
  footer: {
    position: 'absolute',
    bottom: hp(9),
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(5),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});

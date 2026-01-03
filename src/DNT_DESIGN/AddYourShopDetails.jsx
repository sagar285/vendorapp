import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import FullwidthButton from '../Components/FullwidthButton';
import { COLORS } from '../Theme/Colors';
import { wp, hp } from '../Theme/Dimensions';
import { FONTS } from '../Theme/FontFamily';
import UploadCard from '../Components/UploadCard';
import NavigationStrings from '../Navigations/NavigationStrings';
import { launchImageLibrary } from 'react-native-image-picker';
import { apiPost } from '../Api/Api';
import { useAppContext } from '../Context/AppContext';
const AddYourShopDetails = ({ navigation, route }) => {
  const params = route.params;
  console.log( params.shopAddress,"ye aayayyaayayayayayayaayayayayaaay")
 const { addressLine1, setAddressLine1 } = useAppContext();
  const [shopLogo, setShopLogo] = useState(null);
  const [shopImages, setShopImages] = useState([]);
  const [errormessage,seterrormessage]=useState(null);
  const [imaglimit,setimagelimmit] =useState(5);
  const [formupdate,setformupdate] =useState(false);
  const [uploadshop,setuploadShop] =useState(false)
  const [loading,setisloading] = useState(false)


 const getParsedAddress = () => {
  try {
    if (typeof params?.shopAddress === 'string') {
      return JSON.parse(params.shopAddress);
    }
    return params?.shopAddress || {};
  } catch (e) {
    return {};
  }
};

const addressData = getParsedAddress();

  const pickLogo = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (!result.didCancel && result.assets?.length > 0) {
      setShopLogo(result.assets[0]);
    }
  };

  const MAX_IMAGES = 5;

  const pickMultipleImages = async () => {
    const remainingSlots = MAX_IMAGES - shopImages.length;
  
    // 🔒 If limit reached, do nothing
    if (remainingSlots <= 0) {
      Alert.alert('Limit reached', 'You can upload up to 5 images only.');
      return;
    }
  
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: remainingSlots, // 🔥 dynamic
    });
  
    if (!result.didCancel && result.assets?.length > 0) {
      setShopImages(prevImages => {
        const combinedImages = [...prevImages, ...result.assets];
        return combinedImages.slice(0, MAX_IMAGES); // 🔒 extra safety
      });
    }
  };
  



     const submitShop = async () => {
       
        try {
          setformupdate(true)
          let formData = new FormData()
    
          formData.append("shopName", params.shopName)
          formData.append("phone", params.phone)
          formData.append(
            "shopAddress",
        params.shopAddress
          );

          console.log(formData,"formdata")
          if (shopLogo) {
            formData.append("shopLogo", {
              uri: shopLogo.uri,
              type: shopLogo.type,
              name: shopLogo.fileName || "shop_logo.jpg"
            })
          }
    
          shopImages.forEach((img, index) => {
            formData.append("shopImages", {
              uri: img.uri,
              type: img.type,
              name: img.fileName || `shop_image_${index}.jpg`
            })
          })
  
      // console.log(formData,"formdataa")
      setisloading(true)
    
          const result = await apiPost(
            "/vendor/shop/create",
            formData,
            {},
            true // <-- multipart mode
          );

          console.log("shop addresssssssssssssss",result)
          if(!result.success){
            seterrormessage(result.message)
            setformupdate(false)
            setisloading(false)
             
          }
          if(result?.message == "Shop created successfully"){
  navigation.navigate(NavigationStrings.DNT_SuccesFull)
  setformupdate(false)
          }
          else{
            Alert.alert(result?.message)
            setformupdate(false)
          }
          console.log(result,"apiPost result");
           // true = multipart
         
        } catch (error) {
          console.log(error, "Error in submit shop")
          Alert.alert(error?.message)
          setformupdate(false)
          setisloading(false)

        }
      }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
        >
          <Image
            source={require('../assets/images/LeftArrow.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Shop</Text>
        <View style={styles.emptyView} />
      </View>

      <ScrollView Style={styles.scrollContainer}>
        {/* Shop Info Section */}
        <View style={styles.detailsContainer}>
          {/* Shop Name Row */}
          <View style={styles.infoRow}>
            <Text style={styles.shopName}>{params?.shopName}</Text>
            <Image
              source={require('../assets/images/rightCheck.png')}
              style={styles.checkIcon}
              resizeMode="contain"
            />
          </View>

          {/* Address Row */}
          <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
            <Image
              source={require('../assets/images/LocationPin.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.infoText}>{addressData?.addressLine}</Text>

            <Image
              source={require('../assets/images/rightCheck.png')}
              style={styles.checkIcon}
              resizeMode="contain"
            />
          </View>

          {/* Phone Row */}
          <View style={styles.infoRow}>
            <Image
              source={require('../assets/images/Call.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.infoText}>{params?.phone}</Text>
            <Image
              source={require('../assets/images/rightCheck.png')}
              style={styles.checkIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Please Upload Pictures</Text>
          <Text style={styles.sectionSubTitle}>
          Upload up to 5 photos of your shop and your business logo.
          </Text>
        </View>

        {/* Logo Upload */}
        <View style={styles.uploadGroup}>
          <Text style={styles.label}>Logo*</Text>
          <UploadCard
            onPress={pickLogo}
            image={shopLogo}
            isArray={false}
            onRemove={() => setShopLogo(null)}
          />
        </View>

        {/* Shop Images Upload */}
        <View style={styles.uploadGroup}>
          <Text style={styles.label}>Shop Images (upto 5)*</Text>

          <UploadCard
            onPress={pickMultipleImages}
            isArray={true}
            image={shopImages}
            maxImages={5}
            onRemove={index => {
              const newImages = [...shopImages];
              newImages.splice(index, 1);
              setShopImages(newImages);
            }}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <FullwidthButton
          title="Submit"
          formupdate={formupdate}
          isloading={loading}
          onPress={() => {
            submitShop()
          }}
          // style={{ backgroundColor: '#C4C4C4' }}
        />
      </View>
    </View>
  );
};

export default AddYourShopDetails;

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
  Rightcontainer: {
    backgroundColor: COLORS.Green10,
    borderWidth: wp(0.1),
    borderColor: COLORS.Green10,
    borderRadius: wp(1000),
  },
  detailsContainer: {
    marginBottom: hp(1),
  },
});

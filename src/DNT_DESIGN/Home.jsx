import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  BackHandler
} from 'react-native';
import React, { useState, useEffect ,useRef, useCallback} from 'react';
import { COLORS } from '../Theme/Colors';
import { wp, hp } from '../Theme/Dimensions';
import { FONTS } from '../Theme/FontFamily';
import ShopCard from '../Components/Cards/ShopCard';
import { apiGet, apiPost } from '../Api/Api';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNBlob from 'react-native-blob-util';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../Context/AppContext';
import QR_Template from "../Components/ShareQRTemplate/QR_Template"
import ViewShot from "react-native-view-shot";
import { NativeModules, PermissionsAndroid, Platform, Alert } from 'react-native';
const { ImageToPdfModule } = NativeModules;


const Home = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [userShops, setUserShops] = useState([]); // original data
  const [filteredShops, setFilteredShops] = useState([]); // searched result
  const [loadYourShop,setloadYourshop] =useState(false)
  const {user} =useAppContext()

  const [loadingQR, setLoadingQR] = useState(false);
  const [qrImageBase64, setQrImageBase64] = useState(null);
  const viewShotRef = useRef();
const [tempShopData, setTempShopData] = useState(null);
const [tempQR, setTempQR] = useState(null);
 
   useFocusEffect(
      useCallback(() => {
  
        const backAction = () => {
          Alert.alert(
            "Exit App",
            "Are you sure you want to exit?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "YES", onPress: () => BackHandler.exitApp() },
            ]
          );
          return true;
        };
  
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
  
        return () => backHandler.remove();
      }, [])
    );

  const uploadAsyncFCMtoken =  async () => {
    try {
      const result = await AsyncStorage.getItem('fcm_token');
      console.log(result,"chack fcm toker aarha hai ki nhi ")
      if (result) {
        const url = '/fcmtoken/';
        const payload = {
          userId: user._id,
          token: result,
        };
        const response = await apiPost(url, payload);
        console.log(response, 'dhkdjfjdfhdf');
      }
    } catch (error) {
      console.log(error, 'error in token');
    }
  };

  useEffect(() => {
    uploadAsyncFCMtoken();
  }, []); 

  const getShops = async () => {
    try {
      setloadYourshop(true)
      const result = await apiGet('/vendor/shop/get');
      console.log(result, 'user shop reust');
      if (result.message === 'user shop get succed') {
        setUserShops(result.data);
        setFilteredShops(result.data);
        setloadYourshop(false)
      }
    } catch (error) {
      if (error.message === 'Not have valid role') {
        setopenform(true);
        setloadYourshop(false)
      }
    }
  };

  console.log(userShops, 'kkkkk');

  useEffect(() => {
    getShops();
  }, []);

  const handleViewShop = shop => {
    console.log('View Shop:', shop);
    // Add your navigation logic here
  };

  // const handleShareQR = async shop => {
  //   try {
  //     setLoadingQR(true);

  //     const result = await apiGet(`/vendor/shop/qr/${shop._id}`);
  //     const base64 = result?.qrImage;

  //     if (!base64) {
  //       setLoadingQR(false);
  //       Alert.alert('Error', 'Failed to generate QR code.');
  //       return;
  //     }

  //     // DO NOT manipulate base64 string from backend
  //     setQrImageBase64(base64);

  //     setLoadingQR(false);

  //     const base64Data = base64.split('base64,')[1];
  //     const filePath = RNBlob.fs.dirs.CacheDir + `/qr_${Date.now()}.png`;
  //     await RNBlob.fs.writeFile(filePath, base64Data, 'base64');
  //     console.log('BLOB FILE PATH:', filePath);

  //     const contentUri = await RNBlob.fs.stat(filePath).then(info => info.path);

  //     console.log('CONTENT URI:', contentUri);
  //     await Share.open({
  //       url: 'file://' + contentUri,
  //       type: 'image/png',
  //       failOnCancel: false,
  //     });
  //   } catch (error) {
  //     setLoadingQR(false);
  //     Alert.alert('Error', 'Something went wrong.');
  //   }
  // };

  // const handleShareQR = async (shop) => {
  //   try {
  //     setLoadingQR(true);

  //     // Step 1: API se QR image lo
  //     const result = await apiGet(`/vendor/shop/qr/${shop._id}`);
  //     const base64 = result?.qrImage;

  //     if (!base64) {
  //       setLoadingQR(false);
  //       Alert.alert('Error', 'Failed to generate QR code.');
  //       return;
  //     }

  //     // Step 2: State ko update karo (yeh re-render karega)
  //     setTempShopData(shop);
  //     setTempQR(base64);

  //     // Step 3: ViewShot ko capture karne de (timing important hai)
  //     // 1500ms wait karo - images load ho jayengi
  //     setTimeout(async () => {
  //       try {
  //         if (viewShotRef.current) {
  //           console.log('✅ Capturing ViewShot...');
            
  //           // Capture karo
  //           const uri = await viewShotRef.current.capture();
  //           console.log('✅ Capture success:', uri);

  //           // Share dialog kholo
  //           await Share.open({
  //             url: uri,
  //             type: 'image/png',
  //             failOnCancel: false,
  //           });

  //         } else {
  //           console.log('❌ ViewShot ref not available');
  //           Alert.alert('Error', 'Failed to capture template');
  //         }
  //       } catch (error) {
  //         console.log('❌ Capture error:', error);
  //         Alert.alert('Error', 'Failed to share QR code');
  //       } finally {
  //         setLoadingQR(false);
  //         // Clear data ke baad
  //         setTimeout(() => {
  //           setTempShopData(null);
  //           setTempQR(null);
  //         }, 500);
  //       }
  //     }, 1500);

  //   } catch (error) {
  //     setLoadingQR(false);
  //     console.log('Error:', error);
  //     Alert.alert('Error', 'Something went wrong');
  //   }
  // };

  const handleShareQR = async (shop,setLocalLoading) => {
  try {
      // Step 1: API se QR image lo
    const result = await apiGet(`/vendor/shop/qr/${shop._id}`);
    const base64 = result?.qrImage;

    if (!base64) {
      setLocalLoading(false);
      Alert.alert('Error', 'Failed to generate QR code.');
      return;
    }

    console.log('🔄 Setting shop data and QR...');
    
    // Step 2: State ko update karo
    setTempShopData(shop);
    setTempQR(base64);

    // Step 3: Images load hone de (2-3 seconds)
    // ⏳ Pehle 2 seconds wait - images HTTP se download ho jayein
    setTimeout(async () => {
      console.log('⏳ Waiting for images to load...');
      
      // ⏳ Phir 1 second aur wait - ViewShot render ho jayega
      setTimeout(async () => {
        try {
          if (viewShotRef.current) {
            console.log('✅ Capturing ViewShot...');
            
            const uri = await viewShotRef.current.capture();
            console.log('✅ Capture success:', uri);

            await Share.open({
              url: uri,
              type: 'image/png',
              failOnCancel: false,
            });

          } else {
            console.log('❌ ViewShot ref not available');
            Alert.alert('Error', 'Failed to capture template');
          }
        } catch (error) {
          console.log('❌ Capture error:', error);
          Alert.alert('Error', 'Failed to share QR code');
        } finally {
         setLocalLoading(false);
          
          // Clear data ke baad
          setTimeout(() => {
            setTempShopData(null);
            setTempQR(null);
          }, 300);
        }
      }, 300); // Inner timeout - 1 second
      
    }, 300); // Outer timeout - 2 seconds (logo + QR download ke liye)

  } catch (error) {
    setLoadingQR(false);
    console.log('Error:', error);
    Alert.alert('Error', 'Something went wrong');
  }
};

//    const handleShareQR = async (shop, setLocalLoading) => {
//   try {
//     // Step 1: API se QR image lo
//     const result = await apiGet(`/vendor/shop/qr/${shop._id}`);
//     const base64 = result?.qrImage;

//     if (!base64) {
//       setLocalLoading(false);
//       Alert.alert('Error', 'Failed to generate QR code.');
//       return;
//     }

//     console.log('🔄 Setting shop data and QR...');

//     // Step 2: State ko update karo
//     setTempShopData(shop);
//     setTempQR(base64);

//     // Step 3: Images load hone ka wait karo
//     setTimeout(async () => {
//       console.log('⏳ Waiting for images to load...');

//       setTimeout(async () => {
//         try {
//           if (viewShotRef.current) {
//             console.log('✅ Capturing ViewShot...');

//             // 🔥 FIX: Capture as BASE64 instead of file URI
//             const capturedBase64 = await viewShotRef.current.capture({
//               format: "png",
//               quality: 1.0,
//               result: "base64"  // ✅ Base64 me capture karo
//             });

//             console.log('✅ Image captured as base64');

//             // 🔥 Step 5: Base64 ko temporary file me save karo
//             const tempImagePath = `${RNFS.CachesDirectoryPath}/temp_qr_${Date.now()}.png`;
            
//             await RNFS.writeFile(tempImagePath, capturedBase64, 'base64');
//             console.log('✅ Temp image saved at:', tempImagePath);

//             // 🔥 Step 6: Image ko PDF me convert karo
//             const pdfPath = await ImageToPdfModule.convertImagesToPdf(
//               [tempImagePath], // ✅ Absolute file path pass karo
//               `QR_${shop.shopName.replace(/\s+/g, '_')}_${Date.now()}.pdf`
//             );

//             console.log('✅ PDF created at:', pdfPath);

//             // Step 7: PDF ko share karo
//             await Share.open({
//               url: 'file://' + pdfPath,
//               type: 'application/pdf',
//               failOnCancel: false,
//             });

//             // Cleanup: Temp image delete karo
//             await RNFS.unlink(tempImagePath).catch(() => {});

//             Alert.alert('Success', 'PDF shared successfully!');

//           } else {
//             console.log('❌ ViewShot ref not available');
//             Alert.alert('Error', 'Failed to capture template');
//           }
//         } catch (error) {
//           console.log('❌ Error:', error);
//           Alert.alert('Error', 'Failed to create PDF: ' + error.message);
//         } finally {
//           setLocalLoading(false);

//           setTimeout(() => {
//             setTempShopData(null);
//             setTempQR(null);
//           }, 300);
//         }
//       }, 500);
//     }, 500);
//   } catch (error) {
//     setLocalLoading(false);
//     console.log('Error:', error);
//     Alert.alert('Error', 'Something went wrong: ' + error.message);
//   }
// };
  
  
  const handleSearch = text => {
    setSearchText(text);

    if (!text.trim()) {
      setFilteredShops(userShops);
      return;
    }
    const filtered = userShops.filter(shop =>
      shop?.shopName?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredShops(filtered);
  };

  return (
<>
 <View 
  style={{ 
    position: 'absolute', 
    left: wp(-200),      // Screen se dur
    top: hp(-200),
    opacity: 0,          // Dikhayi na de
    zIndex: -999,
  }} 
  pointerEvents="none"
  collapsable={false}
>
  <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
    {tempShopData && tempQR && (
      <QR_Template shopData={tempShopData} qrBase64={tempQR} />
    )}
  </ViewShot>
</View>
    {
      userShops.length > 0 ? (
        <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Image
              source={require('../assets/images/Search.png')}
              style={styles.searchIcon}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Search shop..."
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate(NavigationStrings.DNT_AddYourShop)}
            style={styles.addButton}
          >
            <Image
              source={require('../assets/images/Add.png')}
              style={styles.iconADD}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
  
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredShops?.map(shop => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onViewShop={handleViewShop}
              onShareQR={handleShareQR}
              getusershops={getShops}
            />
          ))}
        </ScrollView>
      </View>
      ) : (
        <View style={styles.container1}>
             <Image
               source={require("../assets/images/Scoter.png")}
               style={styles.image}
               resizeMode="contain"
             />
             <Text style={styles.title}>Nothing Here Yet...</Text>
             <Text style={styles.subText}>
               Start by adding your shop and watch your{'\n'}business come alive.
             </Text>
       
             <TouchableOpacity onPress={()=>navigation.navigate(NavigationStrings.DNT_AddYourShop)} style={styles.button}>
               <Text style={styles.plusIcon}>+</Text>
               <Text style={styles.btnText}>Add Your shop</Text>
             </TouchableOpacity>
           </View>
      )
    }
   </>
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


  container1: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingBottom: hp(10), 
  },
  image: {
    width: wp(60),
    height: wp(60),
    marginBottom: hp(2),
  },
  title: {
    fontSize: wp(5.5),
    color: COLORS.BlackText,
    marginBottom: hp(1.5),
    textAlign: 'center',
    fontFamily:FONTS.InterMedium
  },
  subText: {
    fontSize: wp(3.8),
    color: COLORS.grayText,
    textAlign: 'center',
    lineHeight: hp(2.5),
    paddingHorizontal: wp(8),
    marginBottom: hp(4),
    fontFamily:FONTS.InterRegular
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.orange,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  plusIcon: {
    color: COLORS.white,
    fontSize: wp(5),
    marginRight: wp(2),
    fontWeight: '600',
  },
  btnText: {
    color: COLORS.white,
    fontSize: wp(4),
    fontWeight: '600',
  }
});

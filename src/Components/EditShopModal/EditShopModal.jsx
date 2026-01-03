import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  PanResponder,
  Alert,
  Image,
  ScrollView,
  Platform,
  PermissionsAndroid,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { wp, hp } from '../../Theme/Dimensions';
import { COLORS } from '../../Theme/Colors';
import { FONTS } from '../../Theme/FontFamily';
import Input from '../Input';
import FullwidthButton from '../FullwidthButton';
import { apiPut, apiDelete, BACKEND_URL } from '../../Api/Api';
import { launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
// aaaaaagagagagagagaaaa    aaaaaaaaga     aaaaaag



const DELETE_ICON = require('../../assets/images/Delete.png');
const LOCATION_ICON = require('../../assets/images/Location.png');

const getImageUrl = (path) => {
  if (!path) return '';

  // Agar path pehle se hi "http" se start ho raha hai, toh directly wahi return karein
  if (path.startsWith('http')) {
    return path;
  }

  // Slashes handle karein
  const cleanPath = path.replace(/\\/g, "/");
  const finalPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;

  // Backend URL se /api hatana (Example: http://3.108.53.177:9001)
  const baseUrl = BACKEND_URL.replace(/\/api$/, "");

  return `${baseUrl}/${finalPath}`;
};

const EditShopModal = ({ visible, onClose, shopData ,ShopAllData}) => {
  console.log(ShopAllData,"asdfghjkl")
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopLogo, setShopLogo] = useState(null);
  const [existingLogoCopy, setExistingLogoCopy] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [inputHeight, setInputHeight] = useState(75);
  const [isInitialized, setIsInitialized] = useState(false);
 const [coords, setCoords] = useState({
  lat: null,
  lng: null,
});
  const slideAnim = useRef(new Animated.Value(600)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {
        translateY.setOffset(lastGestureDy.current);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose = gestureState.dy > 150 || gestureState.vy > 0.5;
        if (shouldClose) {
          Animated.timing(translateY, {
            toValue: 600,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            setTimeout(() => {
              translateY.setValue(0);
              lastGestureDy.current = 0;
            }, 100);
          });
        } else {
          translateY.flattenOffset();
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible && ShopAllData  &&shopData && !isInitialized) {
      setShopName(shopData.name || '');
      setPhone(shopData.phone?.replace('+91 - ', '') || '');
      setShopAddress({addressLine:shopData.fullAddress} || '');
      setExistingImages(shopData.images || []);
      setNewImages([]);
      if (ShopAllData.shopLogo) {
        const logoUri = getImageUrl(ShopAllData.shopLogo);
        setShopLogo({ uri: logoUri, isExisting: true, originalPath: ShopAllData.shopLogo });
        setExistingLogoCopy({ uri: logoUri, isExisting: true, originalPath: ShopAllData.shopLogo });
      } else {
        setShopLogo(null);
        setExistingLogoCopy(null);
      }
      setIsInitialized(true);
    } else if (!visible) {
      setIsInitialized(false);
    }
  }, [visible, shopData, ShopAllData ,isInitialized]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 600,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);


  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
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
      Alert.alert("Permission Required", "Location permission denied");
      return;
    }

    setLoadingLocation(true);

   Geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      // Yahan coordinates save karein
      setCoords({ lat: latitude, lng: longitude }); 
      reverseGeocodeOSM(latitude, longitude);
    },
      error => {
        setLoadingLocation(false);
        Alert.alert("Error", "Unable to fetch location");
        console.log(error);
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
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 VendorApp',
        },
      });

      const data = await res.json();
      const fullAddress = data.display_name || '';
      setShopAddress({addressLine:fullAddress});
    } catch (error) {
      console.log("Reverse Geocode Error:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickLogo = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (res) => {
      if (res?.assets?.[0]) {
        const asset = res.assets[0];
        setShopLogo({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || 'logo.jpg',
          isExisting: false
        });
      }
    });
  };

  const deleteLogoImage = async () => {
    Alert.alert('Delete Logo', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiDelete(`/vendor/shop/delete_logo_image/${shopData.id}`);
            setShopLogo(null);
            setExistingLogoCopy(null);
            Alert.alert('Success', 'Logo deleted');
          } catch (e) {
            Alert.alert('Error', 'Failed to delete logo');
          }
        }
      }
    ]);
  };

  const pickImages = () => {
    const totalCurrent = existingImages.length + newImages.length;
    const limit = 5 - totalCurrent;

    if (limit <= 0) {
      Alert.alert('Limit Reached', 'You can only have a maximum of 5 images.');
      return;
    }

    launchImageLibrary({ mediaType: 'photo', selectionLimit: limit }, (res) => {
      if (res?.assets) {
        const selected = res.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || `img_${Date.now()}.jpg`,
        }));
        setNewImages([...newImages, ...selected]);
      }
    });
  };

  const deleteExistingImage = async (imageId) => {
    Alert.alert('Delete Image', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiDelete(`/vendor/shop/delete-image/${imageId}`);
            setExistingImages(existingImages.filter(img => img.imageId !== imageId));
          } catch (e) {
            Alert.alert('Error', 'Failed to delete');
          }
        }
      }
    ]);
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

const handleUpdate = async () => {
  if (!shopName.trim() || !phone.trim() || !shopAddress) {
    Alert.alert('Error', 'All fields required');
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();

    formData.append('shopName', shopName);
    formData.append('phone', phone);

    // 🔑 SAME STRUCTURE AS AddYourShop
    // console.log(shopAddress,"nnnnnnnnnnnnnnnnnnnnnnnnnn")

    const addressData = {
      addressLine: shopAddress.addressLine,
     lat: coords?.lat ? coords.lat : "",
     lon: coords?.lng ? coords.lng : "",
      // lat: 22.124,
      // lon: 27.129,
    };
    console.log(addressData,"[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[")
    // console.log(addressData,"vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
 
    formData.append('shopAddress',JSON.stringify(addressData));
      console.log(shopAddress,"uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
    
    if (shopLogo && !shopLogo.isExisting) {
      formData.append('shopLogo', {
        uri: shopLogo.uri,
        type: shopLogo.type,
        name: shopLogo.name,
      });
    }

    if (newImages.length > 0) {
      newImages.forEach(img => {
        formData.append('shopImages', img);
      });
    }
    console.log(formData,"pppppppppppppppppppppppppppppppppppppp")
    const result = await apiPut(
      `/vendor/shop/update/${shopData.id}`,
      formData,
      {},
      true
    );

    if (result) {
      Alert.alert('Success', 'Shop updated');
      onClose(true);
    }
  } catch (e) {
    Alert.alert('Error', e.message || 'Update failed');
  } finally {
    setLoading(false);
  }
};

  const canAddMore = (existingImages.length + newImages.length) < 5;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={() => onClose()}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => onClose()} />

      <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }, { translateY: translateY }] }]}>
        <View {...panResponder.panHandlers} style={styles.dragArea}>
          <View style={styles.dragHandle} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.logoSection}>
            <Text style={styles.sectionTitle}>Shop Logo</Text>
            <View style={styles.logoContainer}>
              <TouchableOpacity style={styles.logoPicker} onPress={pickLogo}>
                {shopLogo && shopLogo.uri ? (  // Check karein ki uri exist karti hai
    <Image source={{ uri: shopLogo.uri }} style={styles.logoImg} />
  ) : (
    <View style={styles.logoPlaceholder}>
      <Text style={styles.addIcon}>+</Text>
    </View>
  )}
                <View style={styles.editBadge}>
                  <Text style={styles.editText}>Edit</Text>
                </View>
              </TouchableOpacity>
              {shopLogo && (
                <TouchableOpacity style={styles.logoDeleteBtn} onPress={deleteLogoImage}>
                  <Image source={DELETE_ICON} style={styles.logoDelIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Input label="Shop Name*" value={shopName} onChangeText={setShopName} />
          <Input label="Phone Number*" value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={10} />

          <View style={styles.addressContainer}>
            <View style={styles.addressHeader}>
              <Text style={styles.label}>Shop Address*</Text>
              <TouchableOpacity
                onPress={getCurrentLocation}
                disabled={loadingLocation}
                style={[
                  styles.fetchBtn,
                  loadingLocation && { opacity: 0.6 },
                ]}
              >
                {loadingLocation ? (
                  <>
                    <ActivityIndicator size="small" color={COLORS.LocationBuleColor} />
                    <Text style={styles.fetchText}>Fetching…</Text>
                  </>
                ) : (
                  <>
                    <Image
                      source={LOCATION_ICON}
                      style={styles.locationIcon}
                    />
                    <Text style={styles.fetchText}>Fetch Location</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.addressInputWrapper}>
              <TextInput
                value={shopAddress?.addressLine}
                placeholder="Enter address manually"
                placeholderTextColor={COLORS.placeHolderGray}
                onChangeText={(text)=>setShopAddress({addressLine:text})}
                multiline
                textAlignVertical="top"
                style={[styles.addressInput, { height: inputHeight }]}
                onContentSizeChange={(e) =>
                  setInputHeight(Math.max(75, e.nativeEvent.contentSize.height))
                }
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Shop Images ({existingImages.length + newImages.length}/5)</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {canAddMore && (
              <TouchableOpacity style={styles.addBtn} onPress={pickImages}>
                <Text style={styles.addIcon}>+</Text>
                <Text style={styles.addLabel}>Add Image</Text>
              </TouchableOpacity>
            )}

            {existingImages.map((img) => (
              <View key={img.imageId} style={styles.imageWrapper}>
                <Image source={{ uri: getImageUrl(img.imageUrl) }} style={styles.imgBox} />
                <TouchableOpacity style={styles.delBtn} onPress={() => deleteExistingImage(img.imageId)}>
                  <Image source={DELETE_ICON} style={styles.delIcon} />
                </TouchableOpacity>
              </View>
            ))}

            {newImages.map((img, index) => (
              <View key={index} style={[styles.imageWrapper, styles.newBorder]}>
                <Image source={{ uri: img.uri }} style={styles.imgBox} />
                <TouchableOpacity style={styles.delBtn} onPress={() => removeNewImage(index)}>
                  <Image source={DELETE_ICON} style={styles.delIcon} />
                </TouchableOpacity>
                <View style={styles.newTag}>
                  <Text style={styles.newText}>NEW</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <FullwidthButton title="Update Shop Details" onPress={handleUpdate} isloading={loading} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: wp(6), borderTopRightRadius: wp(6),
    maxHeight: hp(90),
  },
  dragArea: { paddingVertical: hp(2), alignItems: 'center' },
  dragHandle: { width: wp(14), height: hp(0.6), backgroundColor: '#E0E0E0', borderRadius: wp(1) },
  content: { paddingHorizontal: wp(5), paddingBottom: hp(5) },
  logoSection: { alignItems: 'center', marginBottom: hp(2) },
  logoContainer: { position: 'relative', alignItems: 'center' },
  logoPicker: { width: wp(25), height: wp(25), borderRadius: wp(12.5), backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  logoImg: { width: '100%', height: '100%' },
  logoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  editBadge: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', paddingVertical: hp(0.2) },
  editText: { color: COLORS.white, fontSize: wp(2.5), textAlign: 'center', fontFamily: FONTS.InterMedium },
  logoDeleteBtn: { position: 'absolute', top: -wp(2), right: -wp(2), padding: wp(1), zIndex: 10 },
  logoDelIcon: { width: wp(6), height: wp(6), resizeMode: 'contain'},
  label: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.6),
    color: COLORS.BlackText,
  },
  addressContainer: {
    width: wp(90),
    alignSelf: 'center',
    marginBottom: hp(2.5),
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  fetchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LocationBuleColor10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(100),
  },
  fetchText: {
    fontSize: wp(3.2),
    marginLeft: wp(1),
    color: COLORS.LocationBuleColor,
    fontFamily: FONTS.InterMedium,
  },
  locationIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: COLORS.LocationBuleColor,
  },
  addressInputWrapper: {
    borderWidth: 1,
    borderColor: "#4E4E4E99",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
  },
  addressInput: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.8),
    color: COLORS.BlackText,
    minHeight: 75,
  },
  sectionTitle: { fontFamily: FONTS.InterSemiBold, fontSize: wp(4), marginTop: hp(2), marginBottom: hp(1), color: COLORS.black },
  imageScroll: { flexDirection: 'row', marginBottom: hp(3) },
  imageWrapper: { width: wp(22), height: wp(22), marginRight: wp(3), position: 'relative' },
  imgBox: { width: '100%', height: '100%', borderRadius: wp(2), backgroundColor: '#f0f0f0' },
  delBtn: { position: 'absolute', top: -wp(2), right: -wp(2), padding: wp(1), zIndex: 10 },
  delIcon: { width: wp(6), height: wp(6), resizeMode: 'contain' },
  addBtn: {
    width: wp(22), height: wp(22), borderRadius: wp(2),
    borderWidth: 1, borderStyle: 'dashed', borderColor: COLORS.orange,
    justifyContent: 'center', alignItems: 'center', marginRight: wp(3),
  },
  addIcon: { fontSize: wp(8), color: COLORS.orange },
  addLabel: { fontSize: wp(2.5), color: COLORS.orange, fontFamily: FONTS.InterMedium },
  newBorder: { borderWidth: 1, borderColor: COLORS.orange, borderRadius: wp(2) },
  newTag: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: COLORS.orange, borderBottomLeftRadius: wp(2), borderBottomRightRadius: wp(2) },
  newText: { fontSize: wp(2), color: COLORS.white, textAlign: 'center', fontFamily: FONTS.InterBold },
});

export default EditShopModal;
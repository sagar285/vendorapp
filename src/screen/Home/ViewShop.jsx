import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  PermissionsAndroid,

} from "react-native";
import React, { useState } from "react";
import { apiDelete, apiGet, BACKEND_URL } from "../../Api/Api";
import NavigationStrings from "../../Navigations/NavigationStrings";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import RNBlob from "react-native-blob-util";

const { width } = Dimensions.get("window");

const ViewShop = ({ route, navigation }) => {
  const { shopData } = route.params;

  const [images, setImages] = useState(shopData.shopImages || []);
  const [activeIndex, setActiveIndex] = useState(0);

  const [loadingQR, setLoadingQR] = useState(false);
  const [qrImageBase64, setQrImageBase64] = useState(null); // to preview QR

  const getImageUrl = (path) => {
    const clean = path.replace(/\\/g, "/");
    return `${BACKEND_URL.replace("/api", "")}/${clean}`;
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const m = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
  };

  const deleteImage = async (imageId) => {
    Alert.alert("Delete Image", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiDelete(`/vendor/shop/delete-image/${imageId}`);
            setImages(images.filter((img) => img.imageId !== imageId));
          } catch (error) {
            console.log("Delete image error", error);
          }
        },
      },
    ]);
  };

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  // ========================================
  //            GET QR CODE (API)
  // ========================================
  const getQRCode = async () => {
    try {
      setLoadingQR(true);
      const result = await apiGet(`/vendor/shop/qr/${shopData._id}`);
      const base64 = result?.qrImage;
  
      if (!base64) {
        setLoadingQR(false);
        Alert.alert("Error", "Failed to generate QR code.");
        return;
      }
  
      // DO NOT manipulate base64 string from backend  
      setQrImageBase64(base64);
  
      setLoadingQR(false);
  
    } catch (error) {
      setLoadingQR(false);
      Alert.alert("Error", "Something went wrong.");
    }
  };
  

  // ========================================
  //             SHARE QR CODE
  // ========================================
  const shareQRCode = async () => {
    try {
      if (!qrImageBase64) {
        Alert.alert("Error", "Generate QR first.");
        return;
      }
  
      const base64Data = qrImageBase64.split("base64,")[1];
  
      // Save file using BlobUtil
      const filePath = RNBlob.fs.dirs.CacheDir + `/qr_${Date.now()}.png`;
  
      await RNBlob.fs.writeFile(filePath, base64Data, "base64");
  
      console.log("BLOB FILE PATH:", filePath);
  
      // Generate content:// URI automatically
      const contentUri = await RNBlob.fs.stat(filePath).then((info) => info.path);
  
      console.log("CONTENT URI:", contentUri);
  
      await Share.open({
        url: "file://" + contentUri,
        type: "image/png",
        failOnCancel: false,
      });
  
    } catch (error) {
      console.log("Share error:", error);
    }
  };
  
  
  
  
  
  

  // =====================================================
  //                       UI
  // =====================================================
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.screen}>
        {/* IMAGE SLIDER */}
        <View style={styles.sliderBox}>
          <View style={styles.sliderShadow}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {images.map((img, index) => {
                const url = getImageUrl(img.imageUrl);
                return (
                  <View key={index} style={styles.imageWrap}>
                    <Image source={{ uri: url }} style={styles.sliderImage} />

                    <TouchableOpacity
                      style={styles.deleteBadge}
                      onPress={() => deleteImage(img.imageId)}
                    >
                      <Text style={styles.deleteBadgeText}>⋮</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.dotContainer}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, { opacity: i === activeIndex ? 1 : 0.3 }]}
              />
            ))}
          </View>
        </View>

        {/* SHOP INFO */}
        <View style={styles.infoCard}>
          <Text style={styles.shopName}>{shopData.shopName}</Text>
          {qrImageBase64 && (
          <Image
            source={{ uri: qrImageBase64 }}
            style={{
              width: 90,
              height: 90,
              alignSelf: "center",
              marginVertical: 20,
              backgroundColor: "#fff",
              borderRadius: 12,
              position:"absolute",
              right:30,
              bottom:0
            }}
          />
        )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{shopData.shopAddress.slice(0,40)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{shopData.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Created:</Text>
            <Text style={styles.value}>{formatDate(shopData.createdAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Updated:</Text>
            <Text style={styles.value}>{formatDate(shopData.updatedAt)}</Text>
          </View>
        </View>

        

        {/* MANAGE MENU BUTTON */}
        <TouchableOpacity
          style={styles.manageBtn}
          onPress={() =>
            navigation.navigate(NavigationStrings.shopMenuManager, {
              shopId: shopData._id,
            })
          }
        >
          <Text style={styles.manageBtnText}>
            Manage Menu & Categories
          </Text>
        </TouchableOpacity>

        {/* GET QR BUTTON */}
        <TouchableOpacity
          style={[styles.manageBtn, { backgroundColor: "#22aa22" }]}
          onPress={getQRCode}
        >
          <Text style={styles.manageBtnText}>Get QR Code</Text>
        </TouchableOpacity>

        {/* SHARE QR BUTTON */}
        <TouchableOpacity
          style={[styles.manageBtn, { backgroundColor: "#ff8800" }]}
          onPress={shareQRCode}
        >
          <Text style={styles.manageBtnText}>Share QR Code</Text>
        </TouchableOpacity>

  
     
      </View>

      {/* LOADING OVERLAY */}
      {loadingQR && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#123" }}>
              Generating QR Code...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ViewShop;

const SHADOW = Platform.select({
  ios: {
    shadowColor: "#bfcfd9",
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef3f6",
  },

  sliderBox: {
    margin: 16,
    borderRadius: 18,
    overflow: "hidden",
  },

  sliderShadow: {
    backgroundColor: "#eef3f6",
    borderRadius: 18,
    ...SHADOW,
  },

  imageWrap: {
    width,
    height: 280,
    borderRadius: 18,
    overflow: "hidden",
  },

  sliderImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  deleteBadge: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "#00000060",
    padding: 8,
    borderRadius: 18,
  },

  deleteBadgeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },

  dotContainer: {
    position: "absolute",
    bottom: 18,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },

  infoCard: {
    backgroundColor: "#eef3f6",
    margin: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e6eef2",
    position:"relative",
    ...SHADOW,
  },

  shopName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#123033",
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  label: {
    width: 90,
    color: "#51656d",
    fontWeight: "700",
  },

  value: {
    flex: 1,
    color: "#1b2b2f",
    fontWeight: "600",
  },

  manageBtn: {
    backgroundColor: "#0b6bd8",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 14,
    alignItems: "center",
    ...SHADOW,
  },

  manageBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000060",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  loadingBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
});

import {
  StyleSheet,
  View,
  Modal,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  Linking,
} from "react-native";
import React from "react";

const { width, height } = Dimensions.get("window");

const ImageModal = ({
  visible,
  qrImageBase64,
  onClose,
  websiteUrl,
  id
}) => {
  if (!qrImageBase64) return null;

  const handleOpenWebsite = async () => {
     const websiteUrl = `https://balajishopamanshivhare.netlify.app?shopId=${id}`
    await Linking.openURL(websiteUrl);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* CLOSE AREA (NO FEEDBACK) */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.closeArea} />
        </TouchableWithoutFeedback>

        {/* IMAGE */}
        <Image
          source={{ uri: qrImageBase64 }}
          style={styles.image}
          resizeMode="contain"
        />

        {/* BUTTON */}
        <View style={styles.buttonWrapper}>
          <TouchableWithoutFeedback onPress={handleOpenWebsite}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Check Your shop</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  );
};

export default ImageModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: width,
    height: height * 0.65,
  },

  closeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  buttonWrapper: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#22c55e", // green
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

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
} from 'react-native';
import { wp, hp } from '../../Theme/Dimensions';
import { COLORS } from '../../Theme/Colors';
import { FONTS } from '../../Theme/FontFamily';
import Input from '../Input';
import FullwidthButton from '..//FullwidthButton';
import { apiPut } from '../../Api/Api';

const EditShopModal = ({ visible, onClose, shopData }) => {
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (visible && shopData) {
      setShopName(shopData.name || '');
      setPhone(shopData.phone?.replace('+91 - ', '') || '');
      setShopAddress(shopData.fullAddress || '');
    }
  }, [visible, shopData]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 600,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleUpdate = async () => {
    if (!shopName.trim() || !phone.trim() || !shopAddress.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        shopName,
        phone,
        shopAddress
      };

      const result = await apiPut('/vendor/shop/update', payload);
      
      if (result) {
        onClose(true);
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={() => onClose()}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => onClose()}
      />

      <Animated.View
        style={[
          styles.modal,
          {
            transform: [
              { translateY: slideAnim },
              { translateY: translateY }
            ]
          },
        ]}
      >
        <View
          {...panResponder.panHandlers}
          style={styles.dragArea}
        >
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.content}>
          <Input
            label="Shop Name*"
            value={shopName}
            onChangeText={setShopName}
            placeholder="Enter shop name"
          />

          <Input
            label="Phone Number*"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <Input
            label="Shop Address*"
            value={shopAddress}
            onChangeText={setShopAddress}
            placeholder="Enter full address"
            multiline={true}
            numberOfLines={3}
          />

          <FullwidthButton
            title="Update Shop Details"
            onPress={handleUpdate}
            isloading={loading}
          />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingBottom: hp(4),
  },
  dragArea: {
    paddingVertical: hp(2),
    alignItems: 'center',
    width: '100%',
  },
  dragHandle: {
    width: wp(14),
    height: hp(0.6),
    backgroundColor: '#E0E0E0',
    borderRadius: wp(1),
  },
  content: {
    paddingHorizontal: wp(5),
  },
});

export default EditShopModal;
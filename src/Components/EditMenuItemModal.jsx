import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
  PanResponder
} from 'react-native';
import { wp, hp } from '../Theme/Dimensions';
import { COLORS } from '../Theme/Colors';
import { FONTS } from '../Theme/FontFamily';
import Input from './Input';
import BigInput from './BigInput';
import UploadCard from './UploadCard';
import FullwidthButton from './FullwidthButton';
import { launchImageLibrary } from 'react-native-image-picker';
import { apiPost, apiPut, BACKEND_URL } from '../Api/Api';

const EditMenuItemModal = ({
  visible,
  onClose,
  item,
  shopId,
  categoryId,
}) => {
 

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [offer, setOffer] = useState('');
  const [type, setType] = useState('veg');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Indicator control karne ke liye

  const slideAnim = useRef(new Animated.Value(600)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderGrant: () => {
        translateY.setOffset(lastGestureDy.current);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: 600,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            translateY.setValue(0);
            lastGestureDy.current = 0;
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

  /* PREFILL */
  useEffect(() => {
    if (visible && item) {
      setName(item.name || '');
      setDesc(item.description || '');
      setPrice(String(item.realprice || ''));
      setOffer(String(item.price || ''));
      setType(item.type || 'veg');
      if (item.image) {
        setImage({
          uri: `${BACKEND_URL}/${item.image}`,
          type: 'image/jpeg',
          name: 'menu.jpg',
        });
      }
    }
  }, [visible, item]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 600,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (res?.assets?.[0]) {
        const img = res.assets[0];
        setImage({
          uri: img.uri,
          type: img.type,
          name: img.fileName || 'menu.jpg',
        });
      }
    });
  };

  const updateItem = async () => {
    if (!name || !price) {
      Alert.alert('Validation', 'Name & price required');
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('shopId', shopId);
      form.append('categoryId', categoryId);
      form.append('name', name);
      form.append('description', desc);
      form.append('price', Number(offer));
      form.append('realprice', Number(price));
      form.append('type', type);
      if (image?.uri) form.append('image', image);

      await apiPut(`/menu/item/edit/${item._id}`, form, {}, true);
      setLoading(false); 
    onClose(true);
      onClose(true);
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Failed to update item');
    }
  };

 return (
    <Modal 
      transparent 
      visible={visible} 
      animationType="none" 
      onRequestClose={onClose}
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
          }
        ]}
      >
        {/* DRAG HANDLE AREA */}
        <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <Text style={styles.label}>Item Image</Text>
          <UploadCard
            image={image}
            onPress={pickImage}
            onRemove={() => setImage(null)}
            isArray={false}
          />

          <Input label="Item Name*" value={name} onChangeText={setName} />
          <BigInput label="Description" value={desc} onChangeText={setDesc} />
          <Input label="Real Price*" keyboardType="numeric" value={price} onChangeText={setPrice} />
          <Input label="Offer Price" keyboardType="numeric" value={offer} onChangeText={setOffer} />

          <FullwidthButton title="Update Item" onPress={updateItem} isloading={loading} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    padding: wp(5),
    maxHeight:hp(80)
  },
  label: {
    fontFamily: FONTS.InterMedium,
    marginBottom: hp(1),
  },
  dragHandleContainer: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
    width: '100%',
  },
  dragHandle: {
    width: wp(14),
    height: hp(0.5),
    backgroundColor: '#999',
    borderRadius: wp(1),
  },
});

export default EditMenuItemModal;

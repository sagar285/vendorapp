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
import { wp, hp } from '../Theme/Dimensions';
import { COLORS } from '../Theme/Colors';
import { FONTS } from '../Theme/FontFamily';
import Input from './Input';
import UploadCard from './UploadCard';
import FullwidthButton from './FullwidthButton';
import { launchImageLibrary } from 'react-native-image-picker';
import { apiPost, apiPut, BACKEND_URL } from '../Api/Api';

const EditCategoryModal = ({ visible, onClose, category }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(600)).current;
const translateY = useRef(new Animated.Value(0)).current;
const lastGestureDy = useRef(0);

// PanResponder Logic
const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
    onPanResponderGrant: () => {
      translateY.setOffset(lastGestureDy.current);
      translateY.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) { // Sirf niche swipe allow karega
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
          onClose(); // Parent ko close signal dena
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

  /* PREFILL */
  useEffect(() => {
    if (visible && category) {
      setName(category.name || '');
      if (category.icon) {
        setIcon({
          uri: `${BACKEND_URL}/${category.icon}`,
          type: 'image/jpeg',
          name: 'icon.jpg',
        });
      }
    }
  }, [visible, category]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 600,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const pickIcon = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, res => {
      if (res?.assets?.[0]) {
        const img = res.assets[0];
        setIcon({
          uri: img.uri,
          type: img.type,
          name: img.fileName || 'icon.jpg',
        });
      }
    });
  };

  const updateCategory = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Category name required');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('name', name);
      if (icon?.uri) form.append('icon', icon);
      const result =await apiPut(`/menu/category/edit/${category._id}`,form,{},true);
      onClose(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to update category');
    } finally {
      setLoading(false);
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
        onPress={onClose} 
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
          style={{ paddingVertical: hp(1.5), alignItems: 'center', width: '100%' }}
        >
          <View style={styles.dragHandle} />
        </View>

        <View style={{ paddingHorizontal: wp(1) }}>
          <Input
            label="Category Name*"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.uploadText}>Category Icon</Text>
          <UploadCard
            image={icon}
            onPress={pickIcon}
            onRemove={() => setIcon(null)}
            isArray={false}
          />

          <FullwidthButton
            title={loading ? 'Updating...' : 'Update Category'}
            onPress={updateCategory}
            isloading={loading}
          />
        </View>
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
  },
  dragHandle: {
    width: wp(14),
    height: hp(0.5),
    backgroundColor: '#999',
    borderRadius: wp(2),
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  uploadText: {
    fontFamily: FONTS.InterMedium,
    marginVertical: hp(1),
  },
});

export default EditCategoryModal;

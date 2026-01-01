import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Modal,
  PanResponder,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { wp, hp } from '../Theme/Dimensions';
import { FONTS } from '../Theme/FontFamily';
import { COLORS } from '../Theme/Colors';
import UploadCard from './UploadCard';
import Input from './Input';
import FullwidthButton from './FullwidthButton';
import BigInput from './BigInput';
import NavigationStrings from '../Navigations/NavigationStrings';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { apiPost } from '../Api/Api';
const QuantityDropdown = ({ value, onSelect, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownWrapper}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text
          style={[styles.dropdownButtonText, !value && styles.placeholderText]}
        >
          {value || 'Quantity'}
        </Text>
        <Image
          source={require('../assets/images/Down.png')}
          style={styles.dropdownIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownMenu}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const ALL_OPTIONS = ['Quarter', 'Half',];

const getAvailableOptions = (quantities, index) => {
  const selected = quantities.map(q => q.quantity).filter(Boolean);

  return ALL_OPTIONS.filter(option => {
    if (quantities[index].quantity === option) return true;
    return !selected.includes(option);
  });
};

const SmallInput = ({ placeholder, keyboardType, value, onChangeText }) => {
  return (
    <View style={styles.smallInputWrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeHolderGray || '#999'}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const EditAddMenuiIemModal = ({
  visible,
  onClose,
  title = 'Add Menu Item',
  selectedCategoryId,
  shopId,
}) => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(600)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const [selectedType, setSelectedType] = useState('veg');
  const [quantities, setQuantities] = useState([{ quantity: '', price: '' }]);
  const [menuName, setMenuName] = useState('');
  const [menuDesc, setMenuDesc] = useState('');
  const [menuOffer, setMenuOffer] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuImage, setMenuImage] = useState(null);

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
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
          lastGestureDy.current = 0;
        }
      },
    }),
  ).current;

  const typeOptions = ['veg', 'nonveg', 'Type #1', 'Type #2'];

  const addQuantity = () => {
    if (quantities.length < 3) {
      setQuantities([...quantities, { quantity: '', price: '' }]);
    }
  };

  const removeQuantity = indexToRemove => {
    const updatedQuantities = quantities.filter(
      (_, index) => index !== indexToRemove,
    );
    if (updatedQuantities.length === 0) {
      // Ensure at least one empty row remains
      setQuantities([{ quantity: '', price: '' }]);
    } else {
      setQuantities(updatedQuantities);
    }
  };

  const updateQuantity = (index, field, value) => {
    const newQuantities = [...quantities];
    newQuantities[index][field] = value;
    setQuantities(newQuantities);
  };

  const addMenuItem = async () => {
    if (!menuName || !menuPrice || !selectedCategoryId) return;

    try {
      const form = new FormData();
      form.append('shopId', shopId);
      form.append('categoryId', selectedCategoryId);
      form.append('name', menuName);
      form.append('description', menuDesc);
      form.append('type', selectedType);
      form.append('realprice', Number(menuPrice));
      form.append('price', Number(menuOffer));
      form.append('quantityOptions', JSON.stringify(quantities));

      if (menuImage) form.append('image', menuImage);

      const result = await apiPost('/menu/item/add', form, {}, true);
      console.log(result, 'resulttt');
      // setAddMenuModal(false);
      setMenuName('');
      setMenuDesc('');
      setMenuOffer('');
      setMenuPrice('');
      setMenuImage(null);
      setQuantities([{ quantity: '', price: '' }]);
      // getCategories();
      onClose();
    } catch (err) {
      console.log('Add item error:', err);
    }
  };

  const pickMenuImage = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel || response.errorCode) return;
      const img = response?.assets?.[0];
      if (img) {
        setMenuImage({
          uri: img.uri,
          type: img.type,
          name: img.fileName || `menu-${Date.now()}.jpg`,
        });
      }
    });
  };

  const onChangeOfferPrice = value => {
    // allow empty (user backspace)
    if (value === '') {
      setMenuOffer('');
      return;
    }

    // allow only numbers
    if (!/^\d+$/.test(value)) {
      return;
    }

    const price = parseInt(menuPrice, 10);
    const offer = parseInt(value, 10);

    // if menuPrice not set yet, allow typing
    if (!price) {
      setMenuOffer(value);
      return;
    }

    // validation: offer must be less than menu price
    if (offer > price) {
      // optionally show warning once
      Alert.alert("number should les than price")
      return;
    }

    setMenuOffer(value);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
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
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }, { translateY: translateY }],
          },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        <ScrollView
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.UploadContainer}>
            <Text style={styles.UploadText}>Upload Image</Text>
            <UploadCard
              onPress={pickMenuImage}
              isArray={false}
              image={menuImage}
              onRemove={() => setMenuImage(null)}
            />
          </View>

          <Input
            label="Item Name*"
            placeholder="Enter item name"
            value={menuName}
            onChangeText={setMenuName}
          />

          <BigInput
            label="Item Description*"
            placeholder="Enter description"
            value={menuDesc}
            onChangeText={setMenuDesc}
          />

          <View style={styles.sectionContainer}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeContainer}>
              {typeOptions.map(type => {
                const isSelected = selectedType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      isSelected && styles.typeButtonActive,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        isSelected && styles.typeTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Input
            label="Price*"
            placeholder="Enter price"
            keyboardType="numeric"
            value={menuPrice}
            onChangeText={setMenuPrice}
          />

          <Input
            label="Offer Price"
            placeholder="Enter offer price"
            keyboardType="numeric"
            value={menuOffer}
            onChangeText={onChangeOfferPrice}
          />

          <View style={styles.sectionContainer}>
            <Text style={styles.label}>Quantity Options*</Text>

            {quantities.map((item, index) => (
              <View key={index} style={styles.rowContainer}>
                <View style={styles.halfInputContainer}>
                  <QuantityDropdown
                    value={item.quantity}
                    options={getAvailableOptions(quantities, index)}
                    onSelect={value => updateQuantity(index, 'quantity', value)}
                  />
                </View>

                <View
                  style={[
                    styles.halfInputContainer,
                    { marginLeft: wp(3), flex: 0.8 },
                  ]}
                >
                  <SmallInput
                    placeholder="Price"
                    keyboardType="numeric"
                    value={item.price}
                    onChangeText={value =>
                      updateQuantity(index, 'price', value)
                    }
                  />
                </View>

                <TouchableOpacity
                  style={styles.deleteButtonWrapper}
                  onPress={() => removeQuantity(index)}
                >
                  <View style={styles.deleteCircle}>
                    <Image
                      source={require('../assets/images/Delete.png')}
                      style={styles.deleteIcon}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={[
                styles.addQuantityButton,
                quantities.length >= 3 && styles.addQuantityButtonDisabled,
              ]}
              onPress={addQuantity}
              disabled={quantities.length >= 2}
            >
              <Text
                style={[
                  styles.addQuantityText,
                  quantities.length >= 2 && styles.addQuantityTextDisabled,
                ]}
              >
                + Add another quantity
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={{ marginBottom: hp(0.4) }}>
          <FullwidthButton title="Submit" onPress={() => addMenuItem()} />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    top: hp(15),
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white || '#fff',
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    paddingVertical: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white || '#fff',
    zIndex: 1,
  },
  dragHandle: {
    width: wp(14),
    height: hp(0.5),
    backgroundColor: '#888888',
    borderRadius: wp(1),
  },
  modalContent: {
    paddingHorizontal: wp(5),
  },
  UploadText: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.6),
    color: COLORS.BlackText || '#000',
    marginBottom: hp(1),
  },
  UploadContainer: {
    marginBottom: hp(3),
  },
  label: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.6),
    color: COLORS.BlackText || '#000',
    marginBottom: hp(1.2),
  },
  sectionContainer: {
    width: wp(90),
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(3),
  },
  typeButton: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    backgroundColor: '#F3F4F6',
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: hp(1),
    marginRight: wp(2),
  },
  typeButtonActive: {
    backgroundColor: COLORS.Blue,
    borderColor: COLORS.Blue,
  },
  typeText: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.5),
    color: '#333',
  },
  typeTextActive: {
    color: '#FFF',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: hp(1.5),
  },
  halfInputContainer: {
    flex: 1,
  },
  smallInputWrapper: {
    height: hp(7),
    borderWidth: 1,
    borderColor: '#4E4E4E99',
    borderRadius: wp(3),
    justifyContent: 'center',
    paddingHorizontal: wp(3),
  },
  input: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.8),
    color: COLORS.BlackText || '#000',
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    height: hp(7),
    borderWidth: 1,
    borderColor: '#4E4E4E99',
    borderRadius: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    backgroundColor: COLORS.white,
  },
  dropdownButtonText: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.8),
    color: COLORS.BlackText || '#000',
  },
  placeholderText: {
    color: COLORS.placeHolderGray || '#999',
  },
  dropdownIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: '#666',
  },
  dropdownMenu: {
    position: 'absolute',
    top: hp(7.5),
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2000,
  },
  dropdownItem: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.8),
    color: COLORS.BlackText || '#000',
  },
  addQuantityButton: {
    backgroundColor: COLORS.Blue10,
    paddingVertical: hp(1.5),
    borderRadius: wp(3),
    alignItems: 'center',
    width: wp(40),
    alignSelf: 'flex-start',
  },
  addQuantityButtonDisabled: {
    backgroundColor: '#E5E7EB',
    opacity: 0.5,
  },
  addQuantityText: {
    color: COLORS.Blue,
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.5),
  },
  addQuantityTextDisabled: {
    color: '#999',
  },
  deleteButtonWrapper: {
    marginLeft: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteCircle: {
    width: wp(10),
    height: wp(10),
    backgroundColor: '#FFE5E5',
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: '#FF4444',
  },
});

export default EditAddMenuiIemModal;

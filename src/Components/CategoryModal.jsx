 
 import React, { useRef, useEffect,useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Modal,
  PanResponder,
} from 'react-native';
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';
import { COLORS } from "../Theme/Colors";
import UploadCard from './UploadCard';
import Input from './Input';
import FullwidthButton from './FullwidthButton';
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';
import { launchImageLibrary } from 'react-native-image-picker';
import { apiPost } from '../Api/Api';
const CategoryModal = ({ 
  visible, 
  onClose, 
  title = "Modal Title",
  shopId
}) => {
  const slideAnim = useRef(new Animated.Value(600)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const navigation = useNavigation()
const [newCatName, setNewCatName] = useState('');
  const [addCategoryLoaidng, setaddCategoryLoading] = useState(false);

      const [iconFile, setIconFile] = useState(null);
        const pickIcon = async () => {
          launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
            if (response.didCancel || response.errorCode) return;
            const file = response?.assets?.[0];
            if (file) {
              setIconFile({
                uri: file.uri,
                type: file.type,
                name: file.fileName || `cat-${Date.now()}.jpg`,
              });
            }
          });
        };



          const addCategory = async () => {
            if (!newCatName.trim()) return;
            setaddCategoryLoading(true)
            try {
              const form = new FormData();
              form.append('shopId', shopId);
              form.append('name', newCatName);
        
              if (iconFile) form.append('icon', iconFile);
        
             const result = await apiPost('/menu/category/add', form, {}, true);
            console.log(result,"/menu/category/add")
              onClose();
              setNewCatName('');
              setIconFile(null);
              setaddCategoryLoading(false)
              navigation.navigate(NavigationStrings.DNT_CategoryMenu,{shopId:shopId})
            } catch (err) {
              setaddCategoryLoading(false)
              console.log('Add category error:', err);
            }
          };






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
    })
  ).current;

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
            transform: [
              { translateY: slideAnim },
              { translateY: translateY }
            ]
          },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.modalContent}>
          <View style={styles.Inputcontainer} >   
            <Input
                label="Category Name*"
              placeholder="Enter category name"
              value={newCatName}
              onChangeText={setNewCatName}
            />
            <Text style={styles.UploadText}>Upload Image</Text>
            <UploadCard
                       onPress={pickIcon}
                       image={iconFile}
                       isArray={false}
                       onRemove={() => setIconFile(null)}
            />
            {/* onPress={()=>navigation.navigate(NavigationStrings.DNT_CategoryMenu)} */}
          </View>
           <FullwidthButton title="Submit"    onPress={addCategory} />
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingBottom: hp(2.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  dragHandleContainer: {
    paddingVertical: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandle: {
    width: wp(14),
    height: hp(0.5),
    backgroundColor: '#888888',
    borderRadius: wp(1),
  },
  modalContent: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontFamily: FONTS.InterSemiBold,
    color: COLORS.BlackText,
  },
  closeIcon: {
    fontSize: wp(7),
    color: '#999999',
    fontWeight: '300',
  },
  UploadText:{
    fontFamily:FONTS.InterMedium,
    fontSize:wp(3.5)
  },
  Inputcontainer:{
    marginBottom:hp(2)
  }
});

export default CategoryModal;
 
 import React, { useRef, useEffect } from 'react';
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
const CategoryModal = ({ 
  visible, 
  onClose, 
  title = "Modal Title"
}) => {
  const slideAnim = useRef(new Animated.Value(600)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const navigation = useNavigation()
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
            />
            <Text style={styles.UploadText}>Upload Image</Text>
            <UploadCard/>
          </View>
           <FullwidthButton title="Submit" onPress={()=>navigation.navigate(NavigationStrings.DNT_CategoryMenu)} />
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
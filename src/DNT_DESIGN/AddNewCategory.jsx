import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';
import CategoryModal from "../Components/CategoryModal"
const AddNewCategory = () => {
  const navigation = useNavigation()
  const [modalVisible,setModalVisible] = useState(false)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Image
            source={require("../assets/images/LeftArrow.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories & Menu</Text>
        <View style={styles.emptyView} />k
      </View>

      <View style={styles.contentContainer}>
        <Image
          source={require("../assets/images/Box.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Uh-Oh! Seems Like Empty Here..</Text>
        <Text style={styles.subText}>
        You haven’t added any categories or {"\n"} menu for this shop yet {"\n"}
Please start by creating one.
        </Text>

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
          <Text style={styles.plusIcon}>+</Text>
          <Text style={styles.btnText}>Add New Category</Text>
        </TouchableOpacity>
      </View>
      <CategoryModal
    visible={modalVisible}
  onClose={() => setModalVisible(false)}
  title="Your Title"
  />
    </View>
  )
}

export default AddNewCategory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),
    paddingBottom: hp(2),
  },
  backButtonContainer: {
    padding: wp(1),
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
  },
  headerTitle: {
    fontSize: wp(4), 
    color: COLORS.BlackText,
    textAlign: 'center',
    fontFamily: FONTS.InterSemiBold, 
  },
  emptyView: {
    width: wp(6), 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingBottom: hp(10),
    marginTop:hp(8)
  },
  image: {
    width: wp(48),
    height: wp(48),
    marginBottom: hp(2),
  },
  title: {
    fontSize: wp(4.5),
    color: COLORS.BlackText,
    marginBottom: hp(1.5),
    textAlign: 'center',
    fontFamily: FONTS.InterMedium
  },
  subText: {
    fontSize: wp(3.5),
    color: COLORS.grayText,
    textAlign: 'center',
    lineHeight: hp(2.5),
    paddingHorizontal: wp(8),
    marginBottom: hp(4),
    fontFamily: FONTS.InterRegular
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.orange,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
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
    fontSize: wp(3.8),
    fontFamily:FONTS.InterMedium
  },
})
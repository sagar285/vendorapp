import { StyleSheet, Text, View, Image, TouchableOpacity, BackHandler, Alert } from 'react-native'
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';
import React, { useEffect, useState } from 'react';
import Home from './Home';
import { apiGet } from '../Api/Api';
const AddShop = () => {
    const Navigation = useNavigation()
 const [userShops, setUserShops] = useState([]);
  const [openform, setopenform] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');





      const getShops = async () => {
        try {
          const result = await apiGet('/vendor/shop/get');
          if (result.message === 'user shop get succed') {
            if(result.data.length > 0){
              Navigation.navigate(NavigationStrings.DNT_Home)
            }
          }
        } catch (error) {
          if (error.message === 'Not have valid role') {
            setopenform(true);
          }
        }
      };

 useEffect(() => {
    getShops();
  }, []);


 

 
   useEffect(() => {
     const backAction = () => {
       Alert.alert(
         "Exit App",
         "Kya aap app band karna chahte ho?",
         [
           { text: "Cancel", style: "cancel" },
           { text: "Yes", onPress: () => BackHandler.exitApp() },
         ]
       );
       return true; // 🔴 default back disable
     };
 
     const backHandler = BackHandler.addEventListener(
       "hardwareBackPress",
       backAction
     );
 
     return () => backHandler.remove();
   }, []);





  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/Scoter.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Nothing Here Yet...</Text>
      <Text style={styles.subText}>
        Start by adding your shop and watch your{'\n'}business come alive.
      </Text>

      <TouchableOpacity onPress={()=>Navigation.navigate(NavigationStrings.DNT_AddYourShop)} style={styles.button}>
        <Text style={styles.plusIcon}>+</Text>
        <Text style={styles.btnText}>Add Your shop</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AddShop

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingBottom: hp(10), 
  },
  image: {
    width: wp(60),
    height: wp(60),
    marginBottom: hp(2),
  },
  title: {
    fontSize: wp(5.5),
    color: COLORS.BlackText,
    marginBottom: hp(1.5),
    textAlign: 'center',
    fontFamily:FONTS.InterMedium
  },
  subText: {
    fontSize: wp(3.8),
    color: COLORS.grayText,
    textAlign: 'center',
    lineHeight: hp(2.5),
    paddingHorizontal: wp(8),
    marginBottom: hp(4),
    fontFamily:FONTS.InterRegular

  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.orange,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
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
    fontSize: wp(4),
    fontWeight: '600',
  }
})
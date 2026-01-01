import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Share,
  Platform,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { COLORS } from '../Theme/Colors';
import { wp, hp } from '../Theme/Dimensions';
import { FONTS } from '../Theme/FontFamily';
import { apiGet } from '../Api/Api';
import NavigationStrings from '../Navigations/NavigationStrings';
import { useFocusEffect } from '@react-navigation/native';

const Order = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
    const [mapurl,setmapurl] =useState(null)
    const [orderStatus,setOrderStatus] =useState(null)

  // Get all orders
  const getAllOrderApi = async () => {
    try {
      const url = '/vendor/shop/all_order';
      const res = await apiGet(url);
      console.log(res,"eeeeeeerrrrrrrrrttttttttyyyyyyyuuuuuuuuiiiiii")
      setOrders(res?.orders || []);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(useCallback(()=>{
    getAllOrderApi();
  },[]))
  const safeText = text => (text ? String(text) : 'N/A');

  const getMapLinkFromAddress = address => {
    if (!address) return '';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;
  };

  const getDirectionLink = (origin, destination) => {
    if (!origin || !destination) return '';
    return `https://www.google.com/maps/dir/${encodeURIComponent(
      origin
    )}/${encodeURIComponent(destination)}`;
  };

  const shortenUrl = async longUrl => {
    try {
      const res = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
      );
      return await res.text();
    } catch (e) {
      return longUrl;
    }
  };

  const getShopOrderDetail = async(item) =>{
    try {
      const url = `/shopAccess/share-summary/${item?._id}`
      const result = await apiGet(url);
      console.log(result,"what is result")
      const mapurl = result.data.navigation.googleMapUrl;
      setmapurl(mapurl)
      setOrderStatus(result.data.orderStatus)
    } catch (error) {
      console.log(error,"error")
    }
  }
  
  

  // Share Order
  const onShareOrder = async item => {
    // console.log(item?.shopId?.shopAddress?.addressLine,"aaag")
    try {
      const shopAddress = item?.shopId?.shopAddress?.addressLine;

      const orderAddress = item?.address?.addressLine;

      // const shopMapLink = getMapLinkFromAddress(shopAddress);
      // const orderMapLink = getMapLinkFromAddress(orderAddress);
  getShopOrderDetail(item)
      // const longDirectionLink = getDirectionLink(shopAddress, orderAddress);
           console.log(mapurl,"ururururur")
      const directionLink = await shortenUrl(mapurl);

      console.log(directionLink,"djdj")

      const message = `
  🧾 Order Summary
  
  👤 Customer: ${safeText(item.firstName)} ${safeText(item.lastName)}
  📞 Phone: ${safeText(item.phone)}
  🏪 Shop: ${safeText(item?.shopId?.shopName)}
  
  📍 Pickup Location (Shop):
  ${safeText(shopAddress)}

  
  📦 Delivery Location:
  ${safeText(orderAddress)}

  
  🧭 Navigate (Shop ➜ Customer):
  ${directionLink}
  
  💰 Total: ₹${safeText(item.grandTotal)}
  📦 Status: ${safeText(item.status)}
  
  🆔 Order ID: ${safeText(item._id)}
  `.trim();

      await Share.share(
        Platform.OS === 'ios'
          ? { title: 'Order Details', message }
          : { message },
      );
    } catch (error) {
      console.log('Share Error:', error);
    }
  };

  // Render Order Item
  const renderOrderItem = ({ item }) => (
    <View style={styles.menuItemCard}>
      {/* Left Icon */}
      <View style={styles.menuIconContainer}>
        <Image
          source={require('../assets/images/Category.png')}
          style={styles.smallMenuIcon}
          resizeMode="contain"
        />
      </View>

      {/* Order Details */}
      <TouchableOpacity 
          onPress={() =>
            navigation.navigate(NavigationStrings.DNT_Order_Details, {
              order: item,
            })
          }
      style={styles.menuTextContainer}>
        <Text style={styles.menuItemName} numberOfLines={1}>
          {item.firstName} {item.lastName}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>₹{item.grandTotal}</Text>
          <View style={styles.dotSeparator} />
          <Text style={styles.typeText}>{item.status}</Text>
        </View>

        <Text style={styles.DisText}>{item.shopId?.shopName}</Text>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actionContainer}>
        {/* View */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate(NavigationStrings.DNT_Order_Details, {
              order: item,
            })
          }
        >
          {/* <Image
            source={require("../assets/images/Eye.png")}
            style={styles.actionIcon}
          /> */}
          <Text>View</Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => onShareOrder(item)}
        >
          <Image
            source={require('../assets/images/Share.png')}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
        >
          <Image
            source={require('../assets/images/LeftArrow.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Your Orders</Text>

        <View style={{ width: wp(6) }} />
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(4),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2.5),
  },

  backButtonContainer: { padding: wp(1) },
  backIcon: { width: wp(6), height: wp(6) },

  headerTitle: {
    fontSize: wp(4.5),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterSemiBold,
  },

  listContainer: {
    paddingBottom: hp(4),
  },

  menuItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
  },

  menuIconContainer: {
    width: wp(13),
    height: wp(13),
    backgroundColor: '#F6F8FA',
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3.5),
  },

  smallMenuIcon: {
    width: wp(5.5),
    height: wp(5.5),
    tintColor: '#202020',
  },

  menuTextContainer: {
    flex: 1,
  },

  menuItemName: {
    fontSize: wp(3.8),
    fontFamily: FONTS.InterSemiBold,
    color: COLORS.BlackText,
    marginBottom: hp(0.3),
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priceText: {
    fontSize: wp(3.5),
    color: '#666',
    fontFamily: FONTS.InterMedium,
  },

  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF5630',
    marginHorizontal: wp(2),
  },

  typeText: {
    fontSize: wp(3.5),
    color: '#888',
    fontFamily: FONTS.InterRegular,
  },

  DisText: {
    fontSize: wp(3.4),
    color: '#888',
    fontFamily: FONTS.InterRegular,
    marginTop: hp(0.5),
  },

  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    padding: wp(1.5),
    marginLeft: wp(1),
  },

  actionIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: '#555',
  },
});

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  Linking
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../Api/Api';

const OrderDetails = ({ route }) => {
  const [status, setStatus] = useState('Pending');
  const orderDetail = route.params.order;
  const [mapurl,setmapurl] =useState(null)
  const [orderStatus,setOrderStatus] =useState(null)
  // Pending | Accepted | Rejected | Ready | Delivered



const getShopOrderDetail = async() =>{
  try {
    const url = `/shopAccess/share-summary/${orderDetail?._id}`
    const result = await apiGet(url);
    console.log(result,"what is result")
    const mapurl = result.data.navigation.googleMapUrl;
    setmapurl(mapurl)
    setOrderStatus(result.data.orderStatus)
  } catch (error) {
    console.log(error,"error")
  }
}

 const handleCall = phone => Linking.openURL(`tel:${phone}`);

const updateStatusAp = async(val) =>{
  let value ;
  if(val == "Accepted"){
    value = "CONFIRMED"
  }else{
     value = "CANCELLED"
  }
  try {
    const url = `/cart/update_status/${orderDetail?._id}`
    const payload ={
      status: value
    }    
    const result = await apiPost(url,payload)
    console.log(result,"result in updating status")
    if(result.success){
    getShopOrderDetail() 
    }
  } catch (error) {
    console.log(error,"error in updating status")
  }
}


useEffect(()=>{
  getShopOrderDetail()
},[])

  const safeText = text => (text ? String(text) : 'N/A');

  const getDirectionLink = (origin, destination) => {
    if (!origin || !destination) return '';
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin,
    )}&destination=${encodeURIComponent(destination)}`;
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

  const onShareOrder = async item => {
    try {
      if (!item) return;

      const shopAddress = item?.shopId?.shopAddress?.addressLine;

      const orderAddress = item?.address?.addressLine;

      // const shopMapLink = getMapLinkFromAddress(shopAddress);
      // const orderMapLink = getMapLinkFromAddress(orderAddress);
      const longDirectionLink = getDirectionLink(shopAddress, orderAddress);
      const directionLink = await shortenUrl(mapurl);

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

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.orderId}>OID:{orderDetail?._id?.slice(0, 6)}</Text>
        <View style={[styles.statusBadge, badgeColor(status)]}>
          <Text style={styles.statusText}>{orderStatus}</Text>
        </View>
      </View>

      {/* CUSTOMER CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Customer Details</Text>
        <Text style={styles.text}>
          👤 {orderDetail?.firstName} {orderDetail?.lastName}
        </Text>
        <Text onPress={()=>handleCall(orderDetail?.phone)} style={styles.text}>📞 +91 {orderDetail?.phone}</Text>
        <Text style={styles.text}>📍 {orderDetail?.address?.addressLine}</Text>
      </View>

      {/* ITEMS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order Items</Text>

        {orderDetail?.items?.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>
              {item.qty} × {item.name}
            </Text>
            <Text style={styles.itemPrice}>₹{item.quantity * item.price}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.itemRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>₹{orderDetail?.grandTotal}</Text>
        </View>
      </View>

      {/* ACTIONS */}
      {orderStatus === 'PENDING' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.accept]}
            onPress={() => updateStatusAp('Accepted')}
          >
            <Text style={styles.actionText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.reject]}
            onPress={() => updateStatusAp('Rejected')}
          >
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'Accepted' && (
        <TouchableOpacity
          style={[styles.fullBtn, styles.ready]}
          onPress={() => setStatus('Ready')}
        >
          <Text style={styles.actionText}>Mark as Ready</Text>
        </TouchableOpacity>
      )}

      {status === 'Ready' && (
        <TouchableOpacity
          style={[styles.fullBtn, styles.delivered]}
          onPress={() => setStatus('Delivered')}
        >
          <Text style={styles.actionText}>Mark as Delivered</Text>
        </TouchableOpacity>
      )}

      {/* SHARE */}
      <TouchableOpacity
        style={styles.shareBtn}
        onPress={() => onShareOrder(orderDetail)}
      >
        <Text style={styles.shareText}>📤 Share Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OrderDetails;

/* ---------------- STYLES ---------------- */

const badgeColor = status => {
  switch (status) {
    case 'Accepted':
      return { backgroundColor: '#E6F4EA' };
    case 'Rejected':
      return { backgroundColor: '#FDEAEA' };
    case 'Ready':
      return { backgroundColor: '#FFF4E5' };
    case 'Delivered':
      return { backgroundColor: '#E8F0FE' };
    default:
      return { backgroundColor: '#EEE' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  text: {
    fontSize: 14,
    marginBottom: 4,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  itemText: {
    fontSize: 14,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 10,
  },

  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  actionBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  accept: {
    backgroundColor: '#2ECC71',
  },

  reject: {
    backgroundColor: '#E74C3C',
  },

  ready: {
    backgroundColor: '#F39C12',
  },

  delivered: {
    backgroundColor: '#3498DB',
  },

  fullBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },

  actionText: {
    color: '#FFF',
    fontWeight: '600',
  },

  shareBtn: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  shareText: {
    fontWeight: '600',
  },
});

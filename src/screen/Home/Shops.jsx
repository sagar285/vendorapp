import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { apiGet, apiPost, BACKEND_URL } from '../../Api/Api';
import NavigationStrings from '../../Navigations/NavigationStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Shops = ({ navigation }) => {
  const [userShops, setUserShops] = useState([]);
  const [openform, setopenform] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingRequest, setPendingRequest] = useState(false);

  // FORM STATES
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [numShops, setNumShops] = useState('');

  const getUserRequest = async () => {
    const result = await apiGet("/admin/vendor_request");
    if (result.message == "user vedor request succesfully") {
      const request = result.result;
      if (request.status == "PENDING") {
        setPendingRequest(true);
      }
    }
  };

  const getShops = async () => {
    try {
      const result = await apiGet('/vendor/shop/get');

      if (result.message === 'user shop get succed') {
        setUserShops(result.data);
      }
    } catch (error) {
      if (error.message === 'Not have valid role') {
        setopenform(true);
      }
    }
  };

  useEffect(() => {
    getUserRequest();
    getShops();
  }, []);

  // const Logout = async () => {
  //   await AsyncStorage.clear();
  //   navigation.navigate(NavigationStrings.Login);
  // };

  const submitVendorRequest = async () => {
    if (!name || !email || !address || !phone || !whatsapp || !numShops) {
      setErrorMsg('All fields are required');
      return;
    }

    let userId;
    const userInfo = await AsyncStorage.getItem("userdata");
    if (userInfo) {
      userId = JSON.parse(userInfo)?._id;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const payload = {
        fullName: name,
        gmail: email,
        address: address,
        phoneNo: phone,
        whatsappNo: whatsapp,
        numberOfShops: numShops,
        userId: userId
      };

      const res = await apiPost('/admin/vendor_request', payload);

      if (res.success) {
        alert('Request Sent to Admin');
        setopenform(false);
        setPendingRequest(true);
      }
    } catch (error) {
      setErrorMsg(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20 }}>
      
      {/* LOGOUT
      <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
        <TouchableOpacity style={styles.logoutBtn} onPress={Logout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View> */}

      {/* ---------------------------------------------------
           🟡 SHOW PENDING REQUEST UI
        ---------------------------------------------------- */}
      {pendingRequest ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Image
            source={{
              uri: "https://cdn3d.iconscout.com/3d/premium/thumb/pending-status-3d-icon-download-in-png-blend-fbx-gltf-file-formats--time-remaining-wait-loader-pack-files-icons-10407051.png?f=webp"
            }}
            style={{ width: 220, height: 220, marginBottom: 20 }}
            resizeMode="contain"
          />

          <Text style={styles.title}>Your Vendor Request is Pending</Text>

          <Text style={styles.subtitle}>
            Thank you! We have received your details.  
            Our team is reviewing your request.  
            You will be notified once approved.
          </Text>

          <View
            style={{
              backgroundColor: '#eef3f6',
              padding: 16,
              borderRadius: 14,
              marginTop: 30,
              borderWidth: 1,
              borderColor: '#dce5ea',
            }}
          >
            <Text style={{ color: '#123033', fontWeight: '700', fontSize: 15 }}>
              ⏳ Status: Pending Review
            </Text>
          </View>
        </View>
      ) : openform ? (
        <>
          {/* -----------------------------------------
                📝 VENDOR REQUEST FORM
              ----------------------------------------- */}
          <Text style={styles.title}>Apply to Become Vendor</Text>
          <Text style={styles.subtitle}>Your request will be reviewed.</Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phone}
              keyboardType="phone-pad"
              onChangeText={setPhone}
            />

            <Text style={styles.label}>WhatsApp Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter WhatsApp number"
              keyboardType="phone-pad"
              value={whatsapp}
              onChangeText={setWhatsapp}
            />

            <Text style={styles.label}>Number of Shops</Text>
            <TextInput
              style={styles.input}
              placeholder="Eg. 1,2,3..."
              value={numShops}
              keyboardType="numeric"
              onChangeText={setNumShops}
            />

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={submitVendorRequest}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* -----------------------------------------
                🏪 SHOW SHOP LIST IF USER IS VENDOR
              ----------------------------------------- */}
          {userShops.length > 0 ? (
            <>
              <Text style={styles.title}>Your Shops</Text>

              {userShops.map((item, index) => {
                const logoUrl = item.shopLogo
                  ? `${BACKEND_URL.replace('/api', '')}/${item.shopLogo.replace(/\\/g, '/')}`
                  : null;

                return (
                  <View key={index} style={styles.shopCard}>
                    {logoUrl && (
                      <Image
                        source={{ uri: logoUrl }}
                        style={styles.shopImage}
                      />
                    )}

                    <Text style={styles.shopName}>{item.shopName}</Text>
                    <Text style={styles.shopDetails}>{item.shopAddress}</Text>
                    <Text style={styles.shopDetails}>📞 {item.phone}</Text>

                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() =>
                        navigation.navigate(NavigationStrings.viewShop, {
                          shopData: item,
                        })
                      }
                    >
                      <Text style={styles.viewBtnText}>View Shop</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}

              <TouchableOpacity
                style={styles.addShopBtn}
                onPress={() =>
                  navigation.navigate(NavigationStrings.addYourshop)
                }
              >
                <Text style={styles.addShopBtnText}>Add Your Shop</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No Shops Found</Text>
              <Text style={styles.emptySubtitle}>Add your first shop</Text>

              <TouchableOpacity
                style={styles.addShopBtn}
                onPress={() =>
                  navigation.navigate(NavigationStrings.addYourshop)
                }
              >
                <Text style={styles.addShopBtnText}>Add Your Shop</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default Shops;

/* ------------------------------------
          STYLES
------------------------------------ */

const SHADOW = Platform.select({
  ios: {
    shadowColor: '#bfcfd9',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#eef3f6',
  },

  logoutBtn: {
    backgroundColor: '#c62828',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    ...SHADOW,
  },
  logoutBtnText: { color: '#fff', fontWeight: '700' },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#123033',
    marginBottom: 6,
    textAlign: 'center',
  },

  subtitle: {
    color: '#6d7b81',
    marginBottom: 18,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  formCard: {
    backgroundColor: '#eef3f6',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6eef2',
    ...SHADOW,
  },

  label: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
    color: '#123033',
  },

  input: {
    backgroundColor: '#f6fbfc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dfe8ec',
    color: '#1b2b2d',
  },

  errorText: { color: 'red', marginBottom: 12, fontWeight: '700' },

  submitBtn: {
    backgroundColor: '#0b6bd8',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    ...SHADOW,
  },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  shopCard: {
    backgroundColor: '#eef3f6',
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e6eef2',
    ...SHADOW,
  },

  shopImage: {
    width: '100%',
    height: 150,
    borderRadius: 14,
    marginBottom: 14,
  },

  shopName: { fontSize: 20, fontWeight: '800', color: '#123033' },
  shopDetails: { color: '#506065', marginTop: 4, fontWeight: '600' },

  viewBtn: {
    backgroundColor: '#0b6bd8',
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    ...SHADOW,
  },
  viewBtnText: { color: '#fff', fontWeight: '800' },

  emptyBox: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 26, fontWeight: '800', color: '#123033' },
  emptySubtitle: { color: '#6d7b81', marginBottom: 20 },

  addShopBtn: {
    backgroundColor: '#0b6bd8',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    ...SHADOW,
  },
  addShopBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

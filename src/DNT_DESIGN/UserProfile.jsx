import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../Theme/Colors';
import { wp, hp } from '../Theme/Dimensions';
import { FONTS } from '../Theme/FontFamily';
import NavigationStrings from '../Navigations/NavigationStrings';
import { useNavigation } from '@react-navigation/native';
import { apiGet, apiPut, BACKEND_URL } from '../Api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAppContext } from '../Context/AppContext';

const UserProfile = () => {
  const navigation = useNavigation();
  const { setUser } = useAppContext();

  const [user, setuser] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 🔹 NEW: name edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState('');

  /* ---------------- PROFILE ---------------- */
  const getuserProfile = async () => {
    const result = await apiGet('/user/profile');
    setuser(result?.user);
  };

  useEffect(() => {
    getuserProfile();
  }, []);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  /* ---------------- LOGOUT ---------------- */
  const onLogout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  /* ---------------- UPDATE NAME API ---------------- */
  const updateUserName = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      
      setUploading(true);
      const result = await apiPut('/user/update-name', {
        name: name.trim(),
      });
      console.log(result)
      // setuser(result?.user);
      setIsEditingName(false);
      getuserProfile()
    } catch {
      Alert.alert('Error', 'Failed to update name');
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const uploadUserProfileImage = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, async response => {
      if (response.didCancel || response.errorCode) return;
      const image = response?.assets?.[0];
      if (!image) return;

      const formData = new FormData();
      formData.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.fileName || `profile-${Date.now()}.jpg`,
      });

      try {
        setUploading(true);
        const result = await apiPut('/user/upload-image', formData, {}, true);
        setuser(result?.user);
      } catch {
        Alert.alert('Error', 'Image upload failed');
      } finally {
        setUploading(false);
      }
    });
  };

  /* ---------------- CONTACT HELPERS ---------------- */
  const handleOpenLink = url => Linking.openURL(url);
  const handleEmail = email => Linking.openURL(`mailto:${email}`);
  const handleWhatsApp = phone =>
    Linking.openURL(`whatsapp://send?phone=${phone}`);
  const handleCall = phone => Linking.openURL(`tel:${phone}`);

  const img =
    'https://images.unsplash.com/photo-1659885785824-3e72856b8fef';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------- HEADER ---------- */}
      <View style={styles.headerContainer}>
        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={uploadUserProfileImage}>
            <Image
              source={{
                uri: user?.profileImage
                  ? `${BACKEND_URL}/${user.profileImage}`
                  : img,
              }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>

          {/* 🔥 NAME + EDIT (ONLY ADDITION) */}
          <View style={styles.nameRow}>
            {isEditingName ? (
              <>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.nameInput}
                  autoFocus
                />
                <TouchableOpacity onPress={updateUserName}>
                  <Image
                    source={require('../assets/images/SaveIcon.png')}
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.userName}>{user?.name}</Text>
                <TouchableOpacity onPress={() => setIsEditingName(true)}>
                  <Image
                    source={require('../assets/images/EditIcon.png')}
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.vendorBadge}>
            <Text style={styles.vendorText}>{user?.role}</Text>
          </View>
        </View>
      </View>

      {/* ---------- STATS ---------- */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.statCardRed]}>
          <Text style={styles.statLabelRed}>Total Shops</Text>
          <Text style={styles.statCountRed}>{user?.numberOfShops}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Shops Registered</Text>
          <Text style={styles.statCount}>{user?.registeredShop}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Shops Remaining</Text>
          <Text style={styles.statCount}>{user?.numberOfShops - user?.registeredShop}</Text>
        </View>
      </View>

      {/* ---------- ACCOUNT SETTINGS ---------- */}
      <View style={styles.sectionContainerForReset}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(NavigationStrings.DNT_ResetPassword)
          }
          style={styles.settingRow}
        >
          <Text style={styles.settingText}>Reset Password</Text>
          <Image
            source={require('../assets/images/RightArrow.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>

      {/* ---------- CONTACT US ---------- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Contact Us</Text>

        <TouchableOpacity
          onPress={() => handleOpenLink('https://sagar.f24tech.com/')}
          style={styles.contactItem}
        >
          <Text style={styles.contactText}>https://sagar.f24tech.com/</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleEmail('sagarguptagupta@gmail.com')}
          style={styles.contactItem}
        >
          <Text style={styles.contactText}>sagarguptagupta@gmail.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleWhatsApp('918959845657')}
          style={styles.contactItem}
        >
          <Text style={styles.contactText}>+91-8959845657</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCall('8959845657')}
          style={styles.contactItem}
        >
          <Text style={styles.contactText}>+91-8959845657</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- LOGOUT ---------- */}
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserProfile;


/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(10),
    paddingTop: hp(3),
  },

  /* ---------------- HEADER ---------------- */
  headerContainer: {
    marginBottom: hp(3),
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarImage: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  /* ---------------- NAME + EDIT ---------------- */
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  userName: {
    fontSize: wp(5),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterBold,
    marginRight: wp(2),
  },
  nameInput: {
    fontSize: wp(5),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterBold,
    borderWidth: 1,
    borderColor: COLORS.orange,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: wp(2),
    marginRight: wp(2),
    minWidth: wp(40),
  },
  editIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: COLORS.orange,
  },

  vendorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F1FF',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    borderRadius: wp(100),
  },
  vendorText: {
    color: '#2B7FFF',
    fontSize: wp(3.2),
    fontFamily: FONTS.InterMedium,
  },

  /* ---------------- STATS ---------------- */
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(4),
  },
  statCard: {
    width: '31%',
    backgroundColor: '#F6F8FA',
    paddingVertical: hp(2),
    borderRadius: wp(3),
    alignItems: 'center',
  },
  statCardRed: {
    backgroundColor: '#FFF0F0',
  },
  statLabel: {
    fontSize: wp(3),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterMedium,
    marginBottom: hp(0.5),
    textAlign: 'center',
  },
  statLabelRed: {
    fontSize: wp(3),
    color: '#FF5C40',
    fontFamily: FONTS.InterMedium,
    marginBottom: hp(0.5),
    textAlign: 'center',
  },
  statCount: {
    fontSize: wp(6),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterBold,
  },
  statCountRed: {
    fontSize: wp(6),
    color: '#FF5C40',
    fontFamily: FONTS.InterBold,
  },

  /* ---------------- SECTIONS ---------------- */
  sectionContainer: {
    marginBottom: hp(1),
  },
  sectionContainerForReset: {
    marginBottom: hp(8),
  },
  sectionTitle: {
    fontSize: wp(3.5),
    color: '#999999',
    fontFamily: FONTS.InterRegular,
    marginBottom: hp(2),
  },

  /* ---------------- SETTINGS ---------------- */
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    fontSize: wp(4),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterMedium,
  },
  arrowIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: COLORS.BlackText,
  },

  /* ---------------- CONTACT ---------------- */
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  contactIcon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(3),
    tintColor: '#333',
  },
  contactText: {
    fontSize: wp(3.8),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterMedium,
  },

  /* ---------------- FOOTER / LOGOUT ---------------- */
  footerContainer: {
    marginTop: hp(4),
    alignItems: 'flex-end',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(5),
    borderRadius: wp(100),
  },
  logoutIcon: {
    width: wp(4.5),
    height: wp(4.5),
    marginRight: wp(2),
    tintColor: '#FF5C40',
  },
  logoutText: {
    color: '#FF5C40',
    fontSize: wp(3.8),
    fontFamily: FONTS.InterMedium,
  },
});


import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from '../Theme/FontFamily';
import NavigationStrings from '../Navigations/NavigationStrings';
import { useNavigation } from '@react-navigation/native';
const UserProfile = () => {
    const navigation = useNavigation()
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* --- Header Section --- */}
      <View style={styles.headerContainer}>
        {/* Edit Profile Button (Top Right) */}
        <View style={styles.topRightAction}>
            <TouchableOpacity style={styles.editProfilePill}>
                <Image
                    source={require("../assets/images/Pen.png")}
                    style={styles.editIcon}
                    resizeMode="contain"
                />
                <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>

        {/* Profile Image & Name */}
        <View style={styles.profileInfo}>
            <Image
                // Using a placeholder for the avatar since it wasn't in the provided asset list
               source={require("../assets/images/Profileimg.png")}
                style={styles.avatarImage}
            />
            <Text style={styles.userName}>User’s Full Name</Text>
            
            {/* Vendor Level Badge */}
            <View style={styles.vendorBadge}>
                <Image
                    source={require("../assets/images/Star.png")}
                    style={styles.starIcon}
                    resizeMode="contain"
                />
                <Text style={styles.vendorText}>Lv.1 Vendor</Text>
            </View>
        </View>
      </View>

      {/* --- Stats Cards --- */}
      <View style={styles.statsContainer}>
        {/* Card 1: Total Shops (Red Theme) */}
        <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabelRed}>Total Shops</Text>
            <Text style={styles.statCountRed}>20</Text>
        </View>

        {/* Card 2: Registered (Gray Theme) */}
        <View style={styles.statCard}>
            <Text style={styles.statLabel}>Shops Registered</Text>
            <Text style={styles.statCount}>13</Text>
        </View>

        {/* Card 3: Remaining (Gray Theme) */}
        <View style={styles.statCard}>
            <Text style={styles.statLabel}>Shops Remaining</Text>
            <Text style={styles.statCount}>7</Text>
        </View>
      </View>

      {/* --- Account Settings --- */}
      <View style={styles.sectionContainerForReset}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity onPress={()=>navigation.navigate(NavigationStrings.DNT_ResetPassword)} style={styles.settingRow}>
            <Text style={styles.settingText}>Reset Password</Text>
            <Image
                source={require("../assets/images/RightArrow.png")}
                style={styles.arrowIcon}
                resizeMode="contain"
            />
        </TouchableOpacity>
      </View>

      {/* --- Contact Us --- */}
      <View style={[styles.sectionContainer, {marginTop: hp(4)}]}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        
        <View style={styles.contactItem}>
            <Image
                source={require("../assets/images/Internet.png")}
                style={styles.contactIcon}
                resizeMode="contain"
            />
            <Text style={styles.contactText}>www.ghartak.in</Text>
        </View>

        <View style={styles.contactItem}>
            <Image
                source={require("../assets/images/Mail.png")}
                style={styles.contactIcon}
                resizeMode="contain"
            />
            <Text style={styles.contactText}>adminemail@test.com</Text>
        </View>

        <View style={styles.contactItem}>
            <Image
                source={require("../assets/images/Whatsaap.png")}
                style={styles.contactIcon}
                resizeMode="contain"
            />
            <Text style={styles.contactText}>+91-9999999999</Text>
        </View>
      </View>

      {/* --- Log Out Button --- */}
      <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.logoutButton}>
             {/* Note: Assuming you might have a logout icon, otherwise just text works well too */}
             <Image 
                source={require("../assets/images/Logout.png")} // Using Arrow as placeholder or replace with specific Logout.png
                style={[styles.logoutIcon]} // Rotating arrow to look like exit
                resizeMode="contain"
             />
             <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
      </View>

    </ScrollView>
  )
}

export default UserProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(5),
    paddingTop: hp(2),
  },
  
  // Header Styles
  headerContainer: {
    marginBottom: hp(3),
  },
  topRightAction: {
    alignItems: 'flex-end',
    marginBottom: hp(-2), // Pull avatar up slightly overlapping or just tight spacing
    zIndex: 10,
  },
  editProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F1FF', // Light Blue
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: wp(100),
  },
  editIcon: {
    width: wp(3),
    height: wp(3),
    marginRight: wp(1.5),
    tintColor: '#2B7FFF'
  },
  editProfileText: {
    color: '#2B7FFF',
    fontSize: wp(3),
    fontFamily: FONTS.InterMedium,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: hp(1),
  },
  avatarImage: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  userName: {
    fontSize: wp(5),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterBold,
    marginBottom: hp(1),
  },
  vendorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F1FF',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    borderRadius: wp(100),
  },
  starIcon: {
    width: wp(3.5),
    height: wp(3.5),
    marginRight: wp(1),
  },
  vendorText: {
    color: '#2B7FFF',
    fontSize: wp(3.2),
    fontFamily: FONTS.InterMedium,
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(4),
  },
  statCard: {
    width: '31%', // Fits 3 in a row
    backgroundColor: '#F6F8FA', // Default Gray
    paddingVertical: hp(2),
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardRed: {
    backgroundColor: '#FFF0F0', // Light Red for the first card
  },
  statLabel: {
    fontSize: wp(3), // Small text
    color: COLORS.BlackText,
    fontFamily: FONTS.InterMedium,
    marginBottom: hp(0.5),
    textAlign: 'center'
  },
  statLabelRed: {
    fontSize: wp(3),
    color: '#FF5C40', // Red Text
    fontFamily: FONTS.InterMedium,
    marginBottom: hp(0.5),
    textAlign: 'center'
  },
  statCount: {
    fontSize: wp(6), // Big Number
    color: COLORS.BlackText,
    fontFamily: FONTS.InterBold,
  },
  statCountRed: {
    fontSize: wp(6),
    color: '#FF5C40', // Red Number
    fontFamily: FONTS.InterBold,
  },

  // Section Styles
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

  // Contact Styles
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  contactIcon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(3),
    tintColor: '#333' // Dark gray icon color
  },
  contactText: {
    fontSize: wp(3.8),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterMedium,
  },

  // Footer/Logout
  footerContainer: {
    marginTop: hp(4),
    alignItems: 'flex-start',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0', // Light Red
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(5),
    borderRadius: wp(100),
  },
  logoutIcon: {
    width: wp(4.5),
    height: wp(4.5),
    marginRight: wp(2),
    tintColor: '#FF5C40'
  },
  logoutText: {
    color: '#FF5C40',
    fontSize: wp(3.8),
    fontFamily: FONTS.InterMedium,
  }
});
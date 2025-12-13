import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../Components/Header/Header';
import Input from '../Components/Input';
import FullwidthButton from '../Components/FullwidthButton';
import { COLORS } from '../Theme/Colors';
import { wp, hp } from '../Theme/Dimensions';
import { FONTS } from '../Theme/FontFamily';
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../Navigations/NavigationStrings';

const ResetPassword = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // Validation Rules
  const rule1 = password.length >= 8;
  const rule2 = /[!@#$%^&*0-9]/.test(password); // contains symbol or number
  const rule3 = /[A-Z]/.test(password); // contains uppercase

  const allValid = rule1 && rule2 && rule3 && password === confirm;

  const rules = [
    { label: 'Minimum 8 Characters', valid: rule1 },
    { label: 'At least one symbol & number', valid: rule2 },
    { label: 'Minimum one uppercase letter', valid: rule3 },
  ];

  const HandleSetPassword = () => {
    //    navigation.navigate(NavigationStrings.DNT_VENDORREGISTER)
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: hp(20) }}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          {/* <View style={styles.headerSpacing}>
              <Header />
            </View>
   */}{' '}
          <View style={styles.leftRow}>
            <Image
              source={require('../assets/images/backArrow.png')}
              style={styles.backIcon}
            />
            <Text style={styles.title}>Reset Password</Text>
          </View>
          {/* TITLE */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Set New Password</Text>
            <Text style={styles.description}>
              Create a strong password that you can remember
            </Text>
          </View>
          {/* PASSWORD RULES */}
          <View style={styles.rulesContainer}>
            {rules.map((item, index) => (
              <View key={index} style={styles.ruleRow}>
                <View
                  style={[
                    styles.ruleIcon,
                    {
                      backgroundColor: item.valid
                        ? COLORS.green
                        : COLORS.lightGray,
                    },
                  ]}
                >
                  {item.valid && (
                    <Image
                      source={require('../assets/images/rightCheck.png')}
                      style={styles.tickIcon}
                    />
                  )}
                </View>

                <Text
                  style={[
                    styles.ruleText,
                    { color: item.valid ? COLORS.green : COLORS.BlackText },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
           <View style={styles.InputContainer}>
              <Input
            label="Old Password"
            placeholder="Enter Old Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Input
            label="New Password"
            placeholder="Enter New Password "
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Input
            label="Confirm New Password"
            placeholder="Enter Confirm Password"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
          {/* PASSWORD MISMATCH ERROR */}
          {confirm.length > 0 && password !== confirm && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
           </View>
          
        </ScrollView>

        {/* FIXED BOTTOM BUTTON */}
        <View style={styles.bottomButton}>
          <FullwidthButton
            title="Continue"
            disabled={!allValid}
            onPress={HandleSetPassword}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(5),
  },

  headerSpacing: {
    marginTop: hp(2),
  },

  titleContainer: {
    marginTop: hp(3),
    marginBottom: hp(2),
  },

  title: {
    fontFamily: FONTS.InterBold,
    fontSize: wp(6),
    color: COLORS.BlackText,
  },

  description: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.6),
    color: COLORS.grayText,
    marginTop: hp(1),
  },
   InputContainer:{
    marginTop:hp(12)
   },
  rulesContainer: {
    marginVertical: hp(2),
  },

  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },

  ruleIcon: {
    width: wp(5.5),
    height: wp(5.5),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },

  tickIcon: {
    width: wp(3.5),
    height: wp(3.5),
    resizeMode: 'contain',
  },

  ruleText: {
    marginLeft: wp(3),
    fontSize: wp(3.8),
    fontFamily: FONTS.InterRegular,
  },

  errorText: {
    color: 'red',
    fontSize: wp(3.4),
    fontFamily: FONTS.InterRegular,
    marginVertical: hp(1),
  },

  bottomButton: {
    position: 'absolute',
    bottom: hp(9),
    width: wp(90),
    alignSelf: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(3),
  },

  backIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
    marginRight: wp(2),
  },

  title: {
    fontSize: wp(5),
    fontWeight: '600',
    color: COLORS.BlackText,
  },
});

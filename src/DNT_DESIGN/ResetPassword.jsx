import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
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
import { apiPut } from '../Api/Api';

const ResetPassword = () => {
  const navigation = useNavigation();
  const [oldpassword, setoldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errormessage, seterrormessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation Rules
  const rule1 = password.length >= 8;
  const rule2 = /[!@#$%^&*0-9]/.test(password);
  const rule3 = /[A-Z]/.test(password);

  const allValid = rule1 && rule2 && rule3 && password === confirm && oldpassword.length > 0;

  const rules = [
    { label: 'Minimum 8 Characters', valid: rule1 },
    { label: 'At least one symbol & number', valid: rule2 },
    { label: 'Minimum one uppercase letter', valid: rule3 },
  ];

  const HandleSetPassword = async () => {
    if (!allValid) return;

    try {
      setLoading(true);
      seterrormessage(null);

      const url = '/user/change-password';
      const payload = {
        oldPassword: oldpassword,
        newPassword: password,
      };
      const result = await apiPut(url, payload);
      console.log(result);

      if (result.message == 'Password changed successfully') {
        // Success Alert
        Alert.alert(
          '✓ Success',
          'Your password has been changed successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log(error);
      seterrormessage(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(15) }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* BACK BUTTON WITH TITLE */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.leftRow}
          >
            <Image
              source={require('../assets/images/backArrow.png')}
              style={styles.backIcon}
            />
            <Text style={styles.headerTitle}>Reset Password</Text>
          </TouchableOpacity>

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

          {/* INPUT FIELDS */}
          <View style={styles.InputContainer}>
            <Input
              label="Old Password"
              placeholder="Enter Old Password"
              secureTextEntry
              value={oldpassword}
              onChangeText={setoldPassword}
            />
            <Input
              label="New Password"
              placeholder="Enter New Password"
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

            {/* API ERROR MESSAGE */}
            {errormessage && (
              <Text style={styles.errorText}>{errormessage}</Text>
            )}
          </View>
          <FullwidthButton
            title={loading ? 'Changing Password...' : 'Continue'}
            disabled={!allValid || loading}
            onPress={HandleSetPassword}
          />
        </ScrollView>

        {/* FIXED BOTTOM BUTTON */}
        {/* <View style={styles.bottomButton}> */}
         
        {/* </View> */}
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

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(3),
    marginBottom: hp(1),
  },

  backIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
    marginRight: wp(2),
  },

  headerTitle: {
    fontSize: wp(5),
    fontWeight: '600',
    color: COLORS.BlackText,
    fontFamily: FONTS.InterSemiBold,
  },

  titleContainer: {
    marginTop: hp(2),
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

  InputContainer: {
    marginTop: hp(3),
  },

  errorText: {
    color: 'red',
    fontSize: wp(3.4),
    fontFamily: FONTS.InterRegular,
    marginTop: hp(1),
  },

  bottomButton: {
    // position: 'absolute',
    // bottom: Platform.OS === 'ios' ? hp(4) : hp(6),
    left: wp(5),
    right: wp(5),
    backgroundColor: COLORS.white,
    paddingVertical: hp(1),
  },
});
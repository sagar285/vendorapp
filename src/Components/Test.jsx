import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { wp, hp } from '../../Theme/Dimensions';
import { COLORS } from '../../Theme/Colors';
import { FONTS } from '../../Theme/FontFamily';
import { BACKEND_URL } from '../../Api/Api';

const QR_Template = ({ shopData, qrBase64 }) => {
  if (!shopData || !qrBase64) {
    console.log("❌ Missing data in QR_Template");
    return <View />;
  }

  // Address extract karo
  const addressArray = shopData?.shopAddress?.addressLine?.split(',');
  const displayAddress = addressArray 
    ? `${addressArray[1]?.trim()}, ${addressArray[2]?.trim()}` 
    : "Address";

  // 🔥 HART OF THE LOGIC - Logo URL properly format karo
  const getLogoUrl = () => {
    const logoPath = shopData?.shopLogo;
    if (!logoPath) {
      console.log('❌ Logo path missing');
      return null;
    }
    
    console.log('🔍 Original logoPath:', logoPath);
    
    // Step 1: Backslashes ko forward slashes mein convert karo
    const cleanPath = logoPath.replace(/\\\\/g, "/").replace(/\\/g, "/");
    console.log('✏️ Cleaned path:', cleanPath);
    
    // Step 2: BACKEND_URL se /api remove karo
    const baseUrl = BACKEND_URL.replace(/\/api$/, "");
    console.log('🌐 Base URL:', baseUrl);
    
    // Step 3: Full URL bana do
    const fullUrl = `${baseUrl}/${cleanPath}`;
    console.log('📸 Final Logo URL:', fullUrl);
    
    return fullUrl;
  };

  const logoUrl = getLogoUrl();

  return (
    <View style={styles.captureContainer}>
      {/* Blue Background Section */}
      <View style={styles.blueSection}>
        
        {/* Profile Logo */}
        <View style={styles.logoContainer}>
          {logoUrl ? (
            <Image 
              source={{ uri: logoUrl }} 
              style={styles.logo}
              onError={(error) => {
                console.log('❌ Logo load error:', error);
                setLogoReady(true); // Phir bhi ready mark karo
              }}
              onLoad={() => {
                console.log('✅ Logo loaded');
                setLogoReady(true);
              }}
            />
          ) : (
            <View style={{ backgroundColor: COLORS.grayText, ...StyleSheet.absoluteFill }} />
          )}
        </View>

        <Text style={styles.shopName}>{shopData?.shopName}</Text>
        <Text style={styles.addressText}>{displayAddress}</Text>
        <Text style={styles.phoneText}>+91 - {shopData?.phone}</Text>

        {/* QR Code White Box */}
        <View style={styles.qrWhiteBox}>
          <Image 
            source={{ uri: qrBase64 }} 
            style={styles.qrImage} 
            resizeMode="contain"
            onError={(error) => {
              console.log('❌ QR load error:', error);
              setQrReady(true); // Phir bhi ready mark karo
            }}
            onLoad={() => {
              console.log('✅ QR loaded');
              setQrReady(true);
            }}
          />
        </View>

        <Text style={styles.scanText}>SCAN TO ORDER ONLINE</Text>
        <Text style={styles.subScanText}>No app needed • Pay online or on delivery</Text>

        {/* Icons Row */}
        <View style={styles.iconRow}>
          <View style={styles.iconItem}>
            <Image 
              source={require('../../assets/images/OpenCamera.png')} 
              style={styles.smallIcon}
            />
            <Text style={styles.iconLabel}>Open Camera on Your Smartphone</Text>
          </View>
          <View style={styles.iconItem}>
            <Image 
              source={require('../../assets/images/ScanQR.png')} 
              style={styles.smallIcon}
            />
            <Text style={styles.iconLabel}>Scan the QR Code Above</Text>
          </View>
          <View style={styles.iconItem}>
            <Image 
              source={require('../../assets/images/RightQR.png')} 
              style={styles.smallIcon}
            />
            <Text style={styles.iconLabel}>Start Your Order with Ghar Tak</Text>
          </View>
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.poweredBy}>Powered by</Text>
          <Text style={styles.brandName}>GharTak Delevary</Text>
        </View>
        <Image 
          source={require('../../assets/images/GharTakLogoQrTemp.png')} 
          style={styles.footerLogo}
          resizeMode="contain"
        />
        <Text style={styles.website}>www.ghartak.in</Text>
      </View>
    </View>
  );
};

export default QR_Template;

const styles = StyleSheet.create({
  captureContainer: {
    width: wp(100),
    backgroundColor: COLORS.white,
  },
  blueSection: {
    backgroundColor: '#3b82f6',
    paddingTop: hp(4),
    paddingBottom: hp(4),
    alignItems: 'center',
    borderBottomLeftRadius: wp(10),
    borderBottomRightRadius: wp(10),
  },
  logoContainer: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.white,
    marginBottom: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    elevation: 5,
  },
  logo: { 
    width: '100%', 
    height: '100%',
    resizeMode: 'cover',
  },
  shopName: { 
    fontSize: wp(6), 
    color: COLORS.white, 
    fontFamily: FONTS.InterBold, 
    marginTop: 5,
    textAlign: 'center',
  },
  addressText: { 
    fontSize: wp(3.5), 
    color: COLORS.white, 
    opacity: 0.9,
    textAlign: 'center',
  },
  phoneText: { 
    fontSize: wp(3.5), 
    color: COLORS.white, 
    marginBottom: hp(2),
    fontWeight: '500',
  },
  qrWhiteBox: {
    backgroundColor: COLORS.white,
    padding: wp(4),
    borderRadius: wp(5),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    elevation: 10,
  },
  qrImage: { 
    width: wp(55), 
    height: wp(55),
  },
  scanText: { 
    fontSize: wp(5), 
    color: COLORS.white, 
    fontFamily: FONTS.InterBold, 
    marginTop: hp(2),
    fontWeight: '700',
  },
  subScanText: { 
    fontSize: wp(3), 
    color: COLORS.white, 
    opacity: 0.8,
    marginTop: hp(0.5),
  },
  iconRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: hp(3), 
    width: '90%',
    paddingHorizontal: wp(2),
  },
  iconItem: { 
    alignItems: 'center', 
    width: wp(25),
  },
  smallIcon: { 
    width: wp(8), 
    height: wp(8), 
    tintColor: COLORS.white,
    marginBottom: hp(1),
  },
  iconLabel: { 
    fontSize: wp(2), 
    color: COLORS.white, 
    textAlign: 'center', 
    marginTop: 5,
    lineHeight: wp(3),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(5),
    backgroundColor: COLORS.white,
  },
  poweredBy: { 
    fontSize: wp(2.5), 
    color: COLORS.grayText,
  },
  brandName: { 
    fontSize: wp(3), 
    color: 'red', 
    fontWeight: 'bold',
  },
  footerLogo: { 
    width: wp(10), 
    height: wp(10),
  },
  website: { 
    fontSize: wp(3), 
    color: COLORS.grayText,
  }
});
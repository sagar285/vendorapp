import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Image, 
    ScrollView 
  } from 'react-native'
  import React, { useState } from 'react'
  import { launchImageLibrary } from 'react-native-image-picker'
  import { apiPost } from '../../Api/Api'
import { useNavigation } from '@react-navigation/native'
import NavigationStrings from '../../Navigations/NavigationStrings'
  
  const AddShop = () => {
  
    const [shopName, setShopName] = useState("")
    const [phone, setPhone] = useState("")
    const [shopAddress, setShopAddress] = useState("")
    const [shopLogo, setShopLogo] = useState(null)
    const [shopImages, setShopImages] = useState([])
    const navigation =useNavigation();
  
    // ----------------------
    // PICK SHOP LOGO
    // ----------------------
    const pickLogo = async () => {
      const result = await launchImageLibrary({ mediaType: 'photo' })
  
      if (!result.didCancel && result.assets?.length > 0) {
        setShopLogo(result.assets[0])
      }
    }
  
    // ----------------------
    // PICK MULTIPLE IMAGES
    // ----------------------
    const pickMultipleImages = async () => {
      const result = await launchImageLibrary({ 
        mediaType: 'photo', 
        selectionLimit: 5 
      })
  
      if (!result.didCancel && result.assets?.length > 0) {
        setShopImages([...shopImages, ...result.assets])
      }
    }
  
    // ----------------------
    // SUBMIT FORM
    // ----------------------
    const submitShop = async () => {
     
      try {
  
        let formData = new FormData()
  
        formData.append("shopName", shopName)
        formData.append("phone", phone)
        formData.append("shopAddress", shopAddress)
  
        if (shopLogo) {
          formData.append("shopLogo", {
            uri: shopLogo.uri,
            type: shopLogo.type,
            name: shopLogo.fileName || "shop_logo.jpg"
          })
        }
  
        shopImages.forEach((img, index) => {
          formData.append("shopImages", {
            uri: img.uri,
            type: img.type,
            name: img.fileName || `shop_image_${index}.jpg`
          })
        })

    
  
        const result = await apiPost(
          "/vendor/shop/create",
          formData,
          {},
          true // <-- multipart mode
        );
         // true = multipart
         navigation.navigate(NavigationStrings.Shops)
      } catch (error) {
        console.log(error, "Error in submit shop")
      }
    }
  
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        <Text style={styles.title}>Add Your Shop</Text>
  
        {/* Shop Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter shop name"
            placeholderTextColor="#999"
            value={shopName}
            onChangeText={setShopName}
          />
        </View>
  
        {/* Phone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            maxLength={10}
            onChangeText={setPhone}
          />
        </View>
  
        {/* Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Shop Address</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Enter full shop address"
            placeholderTextColor="#999"
            value={shopAddress}
            onChangeText={setShopAddress}
            multiline
          />
        </View>
  
        {/* Logo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Shop Logo</Text>
  
          <TouchableOpacity style={styles.uploadBtn} onPress={pickLogo}>
            <Text style={styles.uploadBtnText}>Choose Logo</Text>
          </TouchableOpacity>
  
          {shopLogo && (
            <Image source={{ uri: shopLogo.uri }} style={styles.logoPreview} />
          )}
        </View>
  
        {/* Multiple Images */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Shop Images</Text>
  
          <TouchableOpacity style={styles.uploadBtn} onPress={pickMultipleImages}>
            <Text style={styles.uploadBtnText}>Choose Images</Text>
          </TouchableOpacity>
  
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {shopImages.map((img, i) => (
              <Image key={i} source={{ uri: img.uri }} style={styles.multiImage} />
            ))}
          </ScrollView>
        </View>
  
        {/* Submit Button */}
        <TouchableOpacity style={styles.saveButton} onPress={submitShop}>
          <Text style={styles.saveButtonText}>SAVE SHOP</Text>
        </TouchableOpacity>
  
      </ScrollView>
    )
  }
  
  export default AddShop
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    content: {
      padding: 24
    },
  
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 24
    },
  
    inputContainer: {
      marginBottom: 22
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: 8
    },
    input: {
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      fontSize: 16,
      color: '#1a1a1a'
    },
  
    uploadBtn: {
      backgroundColor: "#007AFF",
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      shadowColor: "#007AFF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4
    },
    uploadBtnText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600"
    },
  
    logoPreview: {
      width: 100,
      height: 100,
      borderRadius: 12,
      marginTop: 10
    },
  
    multiImage: {
      width: 85,
      height: 85,
      marginRight: 10,
      borderRadius: 12,
      marginTop: 8
    },
  
    saveButton: {
      backgroundColor: "#007AFF",
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 20,
      shadowColor: "#007AFF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600"
    }
  })
  
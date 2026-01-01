import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { wp, hp } from '../Theme/Dimensions';
import { COLORS } from '../Theme/Colors';
import { FONTS } from '../Theme/FontFamily';

const UploadCard = ({ onPress, image, isArray = false, onRemove, maxImages = 5 }) => {
  const hasImages = isArray ? (image?.length > 0) : image;
console.log(image?.length,"hhshhshshssh",maxImages);
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isArray && image?.length >= maxImages}
    >
      {hasImages ? (
        <View style={styles.previewContainer}>
          {isArray ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.imageGrid}>
                {image.map((img, i) => (
                  <View key={i} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.gridImage}
                    />
                    {onRemove && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => onRemove(i)}
                      >
                        <Text style={styles.removeText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {image.length < maxImages && ( 
                  <TouchableOpacity style={styles.addMoreButton} onPress={onPress}>
                    {console.log("kkkkkkk998798798798798789")}
                    <Text style={styles.addMoreText}>+</Text>
                    <Text style={styles.addMoreSubtext}>Add More</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.singleImageContainer}>
              <Image source={{ uri: image.uri }} style={styles.previewimage} />
              <TouchableOpacity style={styles.replaceButton} onPress={onPress}>
                <Text style={styles.replaceText}>Replace</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <>
          <Image
            source={require('../assets/images/Upload.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Tap to upload</Text>
          <Text style={styles.subText}>(.png, .jpg, .svg, .ico)</Text>
          {isArray && <Text style={styles.subText}>Max {maxImages} images</Text>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default UploadCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F5F7FA',
    borderWidth: 1.5,
    borderColor: '#D4D6DD',
    borderStyle: 'dashed',
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(3.5),
    marginTop: hp(2),
  },
  image: {
    width: wp(9),
    height: wp(9),
    marginBottom: hp(1.5),
  },
  previewContainer: {
    width: '100%',
    padding: wp(2),
  },
  singleImageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  previewimage: {
    width: wp(80),
    height: wp(40),
    borderRadius: wp(2),
    marginBottom: hp(1),
  },
  imageGrid: {
    flexDirection: 'row',
    gap: wp(2),
  },
  imageWrapper: {
    position: 'relative',
  },
  gridImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(2),
  },
  removeButton: {
    position: 'absolute',
    top: -hp(0.5),
    right: -wp(1),
    backgroundColor: COLORS.Blue || '#4778FF',
    borderRadius: wp(4),
    width: wp(6),
    height: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: 'white',
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  replaceButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    backgroundColor: COLORS.Blue || '#4778FF',
    borderRadius: wp(2),
  },
  replaceText: {
    color: 'white',
    fontSize: wp(3.5),
    fontFamily: FONTS.InterSemiBold,
  },
  addMoreButton: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(2),
    borderWidth: 1.5,
    borderColor: '#D4D6DD',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  addMoreText: {
    fontSize: wp(8),
    color: COLORS.Blue || '#4778FF',
  },
  addMoreSubtext: {
    fontSize: wp(3),
    color: COLORS.Blue || '#4778FF',
    fontFamily: FONTS.InterRegular,
  },
  title: {
    fontSize: wp(4),
    color: COLORS.Blue || '#4778FF',
    marginBottom: hp(0.5),
    fontFamily: FONTS.InterSemiBold,
  },
  subText: {
    fontSize: wp(3.2),
    color: COLORS.Blue,
    fontFamily: FONTS.InterRegular,
  },
});
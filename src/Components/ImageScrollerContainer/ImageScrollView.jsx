import { View, Image, ScrollView } from 'react-native';
import React, { useState, useRef } from 'react';
import { wp, hp } from "../../Theme/Dimensions";
import { COLORS } from "../../Theme/Colors";
import { BACKEND_URL } from '../../Api/Api';

const ImageScrollView = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewWidth = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(contentOffsetX / viewWidth);
    setCurrentImageIndex(index);
  };

    const getImageUrl = (path) => {
      const clean = path.replace(/\\/g, "/");
      return `${BACKEND_URL.replace("/api", "")}/${clean}`;
    };

  return (
    <View style={{ position: 'relative', width: '100%', height: hp(25) }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ width: '100%', height: '100%' }}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{uri:getImageUrl(image.imageUrl)}}
            style={{ width: wp(92), height: '100%' }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      <View style={{
        position: 'absolute',
        bottom: hp(1.5),
        alignSelf: 'center',
        flexDirection: 'row',
        gap: wp(1.5),
      }}>
        {images.map((_, index) => (
          <View
            key={index}
            style={{
              width: wp(2),
              height: wp(2),
              borderRadius: wp(1),
              backgroundColor: currentImageIndex === index ? COLORS.orange : COLORS.white,
              opacity: currentImageIndex === index ? 1 : 0.6,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageScrollView;
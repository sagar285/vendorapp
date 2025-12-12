import { View, Image, ScrollView } from 'react-native';
import React, { useState, useRef } from 'react';
import { wp, hp } from '../../Theme/Dimensions';
import { COLORS } from '../../Theme/Colors';

const ImageScrollerWithoutDot = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewWidth = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(contentOffsetX / viewWidth);
    setCurrentImageIndex(index);
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
            source={image}
            style={{
              width: wp(89),
              height: '100%',
              borderRadius: wp(6),
              marginLeft: wp(1),
            //   borderCurve: 'continious', //ios only
            }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: hp(1.5),
          alignSelf: 'center',
          flexDirection: 'row',
          gap: wp(1.5),
        }}
      ></View>
    </View>
  );
};

export default ImageScrollerWithoutDot;

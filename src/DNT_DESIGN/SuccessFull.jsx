import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const SuccessScreen = () => {
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const sparkleAnimations = useRef(
    Array.from({ length: 8 }, () => new Animated.Value(0))
  ).current;
  const circlePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Checkmark animation - scale in with bounce
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(checkmarkScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start();

    // Sparkle animations - staggered
    sparkleAnimations.forEach((sparkleAnim, index) => {
      Animated.sequence([
        Animated.delay(600 + index * 150),
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start();
    });

    // Circle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(circlePulse, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: false,
        }),
        Animated.timing(circlePulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [checkmarkScale, sparkleAnimations, circlePulse]);

  const sparklePositions = [
    { top: '15%', left: '25%' },
    { top: '20%', right: '20%' },
    { bottom: '20%', right: '15%' },
    { bottom: '25%', left: '20%' },
    { top: '10%', left: '50%' },
    { top: '12%', right: '35%' },
    { bottom: '10%', right: '48%' },
    { bottom: '12%', left: '48%' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Sparkles */}
        {sparklePositions.map((pos, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.sparkle,
              {
                opacity: sparkleAnimations[index],
                transform: [
                  {
                    scale: sparkleAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
              pos,
            ]}
          >
            ✦
          </Animated.Text>
        ))}

        {/* Circle Container */}
        <Animated.View
          style={[
            styles.circleContainer,
            {
              transform: [{ scale: circlePulse }],
            },
          ]}
        >
          {/* Outer Circle (Light Background) */}
          <View style={styles.circleBg} />

          {/* Inner Circle (Green) */}
          <View style={styles.circleInner}>
            {/* Checkmark */}
            <Animated.Text
              style={[
                styles.checkmark,
                {
                  transform: [{ scale: checkmarkScale }],
                },
              ]}
            >
              ✓
            </Animated.Text>
          </View>
        </Animated.View>

        {/* Text */}
        <Text style={styles.heading}>Shop Created Successfully</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7fa',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  circleContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  circleBg: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  circleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  checkmark: {
    fontSize: 80,
    color: '#fff',
    fontWeight: '700',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 20,
    color: '#4CAF50',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default SuccessScreen;
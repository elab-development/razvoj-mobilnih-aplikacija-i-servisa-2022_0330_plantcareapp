import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { styles } from './SplashScreen.styles';
import { Image } from 'react-native';

export default function SplashScreen() {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 157,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [translateX]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
        source={require('@/assets/images/logo.png')}
        style = {styles.logo}
        resizeMode="contain"
        />

        <Text style={styles.title}>Sprout</Text>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}
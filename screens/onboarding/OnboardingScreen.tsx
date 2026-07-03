import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';

import AppButton from '@/components/AppButton';
import { onboardingData } from './onboardingData';
import { styles } from './OnboardingSceen.styles';

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = onboardingData[currentIndex];
  const isLastSlide = currentIndex === onboardingData.length - 1;

  function handleNext() {
    if (isLastSlide) {
      router.replace('/register');
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>{currentItem.title}</Text>

      <View style={styles.imageWrapper}>
        <View style={styles.circle} />

        <Image
          source={currentItem.image}
          style={styles.plantImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textCard}>
        <Text style={styles.description}>
          {currentItem.description}
        </Text>
      </View>

      <View style={styles.dotsContainer}>
        {onboardingData.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <AppButton
        title={isLastSlide ? 'kraj' : 'dalje'}
        variant="outline"
        onPress={handleNext}
      />
    </View>
  );
}
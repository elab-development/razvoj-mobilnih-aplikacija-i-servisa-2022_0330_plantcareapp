import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    AlfaSlabOne: require('@/assets/fonts/AlfaSlabOne-Regular.ttf'),
    PoppinsRegular: require('@/assets/fonts/Poppins-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
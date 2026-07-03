import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

export async function setBiometricEnabled(enabled: boolean) {
  await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, enabled ? 'true' : 'false');
}

export async function getBiometricEnabled() {
  const value = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
  return value === 'true';
}

export async function isBiometricAvailable() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  return hasHardware && isEnrolled;
}

export async function authenticateWithBiometrics() {
  const available = await isBiometricAvailable();

  if (!available) {
    return {
      success: false,
      error: 'Biometrija nije dostupna ili nije podešena na uređaju.',
    };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Potvrdite identitet',
    cancelLabel: 'Otkaži',
    fallbackLabel: 'Koristi šifru',
    disableDeviceFallback: false,
  });

  if (!result.success) {
    return {
      success: false,
      error: 'Biometrijska provera nije uspela.',
    };
  }

  return {
    success: true,
    error: null,
  };
}
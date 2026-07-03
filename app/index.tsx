import { router } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

import SplashScreen from "@/screens/splash/SplashScreen";
import {
  authenticateWithBiometrics,
  getBiometricEnabled,
} from "@/services/biometricService";
import { supabase } from "@/services/supabase";

export default function Index() {
  useEffect(() => {
    async function checkSessionAndBiometrics() {
      const { data } = await supabase.auth.getSession();

      setTimeout(async () => {
        if (!data.session) {
          router.replace("/onboarding");
          return;
        }

        const biometricEnabled = await getBiometricEnabled();

        if (!biometricEnabled) {
          router.replace("/(tabs)");
          return;
        }

        const biometricResult = await authenticateWithBiometrics();

        if (biometricResult.success) {
          Alert.alert("Biometrija", "Uspešna potvrda.");
          router.replace("/(tabs)");
        } else {
          Alert.alert(
            "Biometrija",
            biometricResult.error ?? "Provera nije uspela.",
          );
          await supabase.auth.signOut();
          router.replace("/login");
        }
      }, 1800);
    }

    checkSessionAndBiometrics();
  }, []);

  return <SplashScreen />;
}

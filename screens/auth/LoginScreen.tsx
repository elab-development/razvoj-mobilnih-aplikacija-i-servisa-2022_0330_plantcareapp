import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppButton from "@/components/AppButton";
import InputField from "@/components/InputField";
import { supabase } from "@/services/supabase";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Greška", "Popunite sva polja.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Greška", error.message);
      return;
    }

    Alert.alert("Uspešan login!");

    router.replace("/(tabs)");
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid
      extraScrollHeight={40}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Prijavite se</Text>

      <View style={styles.form}>
        <InputField
          placeholder="Gmail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <InputField
          placeholder="Lozinka"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.registerLinkWrapper}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.registerText}>
          Nemate nalog?{" "}
          <Text style={styles.registerTextBold}>Registrujte se</Text>
        </Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <AppButton
          title="prijavite se"
          variant="outline"
          onPress={handleLogin}
          buttonStyle={styles.button}
        />
      )}
    </KeyboardAwareScrollView>
  );
}

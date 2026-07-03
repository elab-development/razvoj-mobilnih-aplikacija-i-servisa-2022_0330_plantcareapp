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
import { styles } from "./RegisterScreen.styles";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      Alert.alert("Greška", "Popunite sva polja.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Greška", "Lozinke se ne poklapaju.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Greška", "Lozinka mora imati najmanje 6 karaktera.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          avatar_url: null,
        },
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert("Greška", error.message);
      return;
    }

    Alert.alert("Uspešna registracija", "Proverite email za potvrdu naloga.");

    router.replace("/login");
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

      <Text style={styles.title}>Registrujte se</Text>

      <View style={styles.form}>
        <InputField
          placeholder="Gmail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <InputField
          placeholder="Ime"
          value={firstName}
          onChangeText={setFirstName}
        />

        <InputField
          placeholder="Prezime"
          value={lastName}
          onChangeText={setLastName}
        />

        <InputField
          placeholder="Lozinka"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <InputField
          placeholder="Potvrdite lozinku"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity
        style={styles.textWrapper}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.registerText}>
          Imate nalog? <Text style={styles.registerTextBold}>Ulogujte se</Text>
        </Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <AppButton
          title="registrujte se"
          variant="outline"
          onPress={handleRegister}
          buttonStyle={styles.button}
        />
      )}
    </KeyboardAwareScrollView>
  );
}

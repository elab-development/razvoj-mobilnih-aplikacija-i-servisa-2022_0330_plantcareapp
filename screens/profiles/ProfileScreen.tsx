import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";

import AppButton from "@/components/AppButton";
import InputField from "@/components/InputField";
import { Colors } from "@/constants/theme";
import {
  authenticateWithBiometrics,
  getBiometricEnabled,
  isBiometricAvailable,
  setBiometricEnabled,
} from "@/services/biometricService";
import { supabase } from "@/services/supabase";
import { styles } from "./ProfileScreen.styles";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const colors = Colors.light;

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [biometricEnabled, setBiometricEnabledState] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session?.user) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    const user = sessionData.session.user;
    setUserId(user.id);

    setEmail(user.email ?? "");

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.log(profileError);
    }

    const loadedFirstname = profileData?.first_name ?? "Korisnik";

    setName(loadedFirstname);

    setAvatarUrl(profileData?.avatar_url ?? null);

    const enabled = await getBiometricEnabled();
    setBiometricEnabledState(enabled);

    setLoading(false);
  }

  async function handleToggleBiometrics(value: boolean) {
    if (value) {
      const available = await isBiometricAvailable();

      if (!available) {
        Alert.alert(
          "Biometrija nije dostupna",
          "Uređaj nema podešenu biometriju ili je ne podržava.",
        );
        return;
      }

      const result = await authenticateWithBiometrics();

      if (!result.success) {
        Alert.alert("Greška", result.error ?? "Biometrija nije potvrđena.");
        return;
      }
    }

    await setBiometricEnabled(value);
    setBiometricEnabledState(value);
  }

  async function handleChangePassword() {
    if (!oldPassword || !newPassword) {
      Alert.alert("Greška", "Unesite staru i novu lozinku.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Greška", "Nova lozinka mora imati najmanje 6 karaktera.");
      return;
    }

    if (!email) {
      Alert.alert("Greška", "Email korisnika nije pronađen.");
      return;
    }

    setSaving(true);

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: oldPassword,
    });

    if (reauthError) {
      setSaving(false);
      Alert.alert("Greška", "Stara lozinka nije tačna.");
      return;
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setSaving(false);

    if (passwordError) {
      Alert.alert("Greška", passwordError.message);
      return;
    }

    setOldPassword("");
    setNewPassword("");

    Alert.alert("Uspešno", "Lozinka je promenjena.");
  }

  function handleCancel() {
    setOldPassword("");
    setNewPassword("");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function handlePickAvatar() {
    if (!userId) {
      Alert.alert("Greška", "Korisnik nije pronađen.");
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Dozvola je potrebna",
        "Morate dozvoliti pristup galeriji da biste promenili sliku profila.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const image = result.assets[0];

    try {
      setUploadingAvatar(true);

      const base64 = await FileSystem.readAsStringAsync(image.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileExt =
        image.uri.split(".").pop()?.toLowerCase() === "png" ? "png" : "jpg";

      const contentType =
        image.mimeType ?? (fileExt === "png" ? "image/png" : "image/jpeg");

      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, decode(base64), {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const publicUrl = `${data.publicUrl}?v=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
        })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);

      Alert.alert("Uspešno", "Slika profila je promenjena.");
    } catch (error: any) {
      console.log("Avatar upload error:", error);
      Alert.alert("Greška", error.message ?? "Slika nije sačuvana.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.textLightest} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid
      extraScrollHeight={80}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topShape} />
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Profil</Text>

        <Pressable onPress={handlePickAvatar} style={styles.avatarWrapper}>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require("@/assets/images/logo.png")
            }
            style={styles.avatar}
            resizeMode="cover"
          />

          <View style={styles.avatarEditBadge}>
            <Text style={styles.avatarEditText}>
              {uploadingAvatar ? "..." : "+"}
            </Text>
          </View>
        </Pressable>
        <View>
          <AppButton
            title="odjavi se"
            variant="outline"
            onPress={handleLogout}
            buttonStyle={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>
        <Text style={styles.label}>Ime:</Text>
        <View style={styles.readonlyBox}>
          <Text style={styles.readonlyText}>{name}</Text>
        </View>

        <Text style={styles.label}>Email:</Text>
        <View style={styles.readonlyBox}>
          <Text style={styles.readonlyText}>{email}</Text>
        </View>

        <Text style={styles.label}>Stara lozinka:</Text>
        <InputField
          placeholder="Stara lozinka"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Nova lozinka:</Text>
        <InputField
          placeholder="Nova lozinka"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <View style={styles.biometricCard}>
          <View>
            <Text style={styles.biometricTitle}>Biometrija</Text>
          </View>

          <Switch
            value={biometricEnabled}
            onValueChange={handleToggleBiometrics}
            thumbColor={biometricEnabled ? colors.accent : colors.textLightest}
            trackColor={{
              false: "rgba(244, 241, 233, 0.35)",
              true: colors.darkest,
            }}
          />
        </View>

        {saving ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={colors.textLightest}
          />
        ) : (
          <AppButton
            title="sačuvaj"
            variant="outline"
            onPress={handleChangePassword}
            buttonStyle={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
        )}

        <AppButton
          title="otkaži"
          variant="outline"
          onPress={handleCancel}
          buttonStyle={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

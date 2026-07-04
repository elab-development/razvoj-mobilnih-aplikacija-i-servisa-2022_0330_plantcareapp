import AppButton from "@/components/AppButton";
import PlantImagePickerModal from "@/components/PlantImagePickerModal";
import { Colors } from "@/constants/theme";
import { supabase } from "@/services/supabase";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "./AddPlantScreen.styles";

const colors = Colors.light;

type MoistureCategory = {
  id: string;
  name: string;
  label: string;
  moisture_min: number;
  moisture_max: number;
};

type PlantSpecies = {
  id: string;
  name: string;
  scientific_name: string | null;
  description: string | null;
  watering_interval: number | null;
  moisture_category_id: string | null;
  moisture_category?: MoistureCategory | null;
};

export default function AddPlantScreen() {
  const [plantName, setPlantName] = useState("");
  const [location, setLocation] = useState("");

  const [lastWateredDate, setLastWateredDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [speciesQuery, setSpeciesQuery] = useState("");
  const [speciesSuggestions, setSpeciesSuggestions] = useState<PlantSpecies[]>(
    [],
  );
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpecies | null>(
    null,
  );

  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  const [wateringInterval, setWateringInterval] = useState("");
  const [plantImage, setPlantImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchSpecies(speciesQuery);
    }, 350);

    return () => clearTimeout(timeout);
  }, [speciesQuery]);

  function formatDate(date: Date) {
    return date.toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function handleDateChange(event: any, selectedDate?: Date) {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setLastWateredDate(selectedDate);
    }
  }

  async function searchSpecies(text: string) {
    const query = text.trim();

    if (selectedSpecies) {
      setSpeciesSuggestions([]);
      return;
    }

    if (query.length < 2) {
      setSpeciesSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);

    const { data, error } = await supabase
      .from("plant_species")
      .select(
        "id, name, scientific_name, description, watering_interval, moisture_category_id",
      )
      .ilike("name", `%${query}%`)
      .limit(6);

    setLoadingSuggestions(false);

    if (error) {
      console.log("Species search error:", error);
      return;
    }

    setSpeciesSuggestions(data ?? []);
  }

  async function loadSpeciesWithCategory(speciesId: string) {
    const { data: speciesData, error: speciesError } = await supabase
      .from("plant_species")
      .select(
        "id, name, scientific_name, description, watering_interval, moisture_category_id",
      )
      .eq("id", speciesId)
      .single();

    if (speciesError || !speciesData) {
      throw speciesError ?? new Error("Vrsta biljke nije pronađena.");
    }

    let categoryData: MoistureCategory | null = null;

    if (speciesData.moisture_category_id) {
      const { data, error } = await supabase
        .from("moisture_categories")
        .select("id, name, label, moisture_min, moisture_max")
        .eq("id", speciesData.moisture_category_id)
        .single();

      if (error) {
        console.log("Moisture category error:", error);
      }

      if (data) {
        categoryData = data;
      }
    }

    return {
      ...speciesData,
      moisture_category: categoryData,
    } as PlantSpecies;
  }

  async function handleSelectSpecies(species: PlantSpecies) {
    try {
      const fullSpecies = await loadSpeciesWithCategory(species.id);

      setSelectedSpecies(fullSpecies);
      setSpeciesQuery(fullSpecies.name);
      setSpeciesSuggestions([]);

      if (!plantName.trim()) {
        setPlantName(fullSpecies.name);
      }

      if (fullSpecies.watering_interval) {
        setWateringInterval(String(fullSpecies.watering_interval));
      }
    } catch (error: any) {
      Alert.alert("Greška", error.message ?? "Vrsta nije učitana.");
    }
  }

  function handleClearSpecies() {
    setSelectedSpecies(null);
    setSpeciesQuery("");
    setWateringInterval("");
    setSpeciesSuggestions([]);
  }

  async function uploadPlantImage(userId: string) {
    if (!plantImage) {
      return null;
    }

    const base64 = await FileSystem.readAsStringAsync(plantImage.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileExt =
      plantImage.uri.split(".").pop()?.toLowerCase() === "png" ? "png" : "jpg";

    const contentType =
      plantImage.mimeType ?? (fileExt === "png" ? "image/png" : "image/jpeg");

    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("plant-images")
      .upload(filePath, decode(base64), {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("plant-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSavePlant() {
    if (!plantName.trim()) {
      Alert.alert("Greška", "Unesite naziv biljke.");
      return;
    }

    if (!selectedSpecies) {
      Alert.alert(
        "Greška",
        "Izaberite vrstu biljke iz baze. Automatsku identifikaciju dodajemo kasnije.",
      );
      return;
    }

    if (!wateringInterval.trim()) {
      Alert.alert("Greška", "Unesite interval zalivanja.");
      return;
    }

    const intervalNumber = Number(wateringInterval);

    if (Number.isNaN(intervalNumber) || intervalNumber <= 0) {
      Alert.alert("Greška", "Interval zalivanja mora biti pozitivan broj.");
      return;
    }

    setSaving(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error("Korisnik nije prijavljen.");
      }

      const imageUrl = await uploadPlantImage(userData.user.id);

      const { error: insertError } = await supabase.from("plants").insert({
        user_id: userData.user.id,
        name: plantName.trim(),
        location: location.trim() || null,
        species_id: selectedSpecies.id,
        watering_interval: intervalNumber,
        image_url: imageUrl,
        last_watered: lastWateredDate.toISOString(),
      });

      if (insertError) {
        throw insertError;
      }

      Alert.alert("Uspešno", "Biljka je dodata.");
      router.replace("/(tabs)/plants" as any);
    } catch (error: any) {
      console.log("Add plant error:", error);
      Alert.alert("Greška", error.message ?? "Biljka nije sačuvana.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topShape} />
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Unos biljke</Text>

      <Text style={styles.label}>Slika biljke:</Text>
      <Pressable
        style={styles.imagePicker}
        onPress={() => setImagePickerVisible(true)}
      >
        {plantImage ? (
          <Image
            source={{ uri: plantImage.uri }}
            style={styles.plantImagePreview}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <View style={styles.cameraCircle}>
              <Ionicons name="camera" size={28} color={colors.textDarkest} />
            </View>
            <Text style={styles.imagePlaceholderText}>Dodaj sliku</Text>
          </View>
        )}
      </Pressable>

      <Text style={styles.label}>Naziv biljke:</Text>
      <TextInput
        value={plantName}
        onChangeText={setPlantName}
        placeholder="Aloe vera, bela ruža..."
        placeholderTextColor={colors.textLightest}
        style={styles.input}
      />

      <Text style={styles.label}>Lokacija:</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Kuhinja, dnevna soba..."
        placeholderTextColor={colors.textLightest}
        style={styles.input}
      />

      <Text style={styles.label}>Vrsta biljke:</Text>
      <View style={styles.speciesRow}>
        <TextInput
          value={speciesQuery}
          onChangeText={(text) => {
            setSpeciesQuery(text);
            setSelectedSpecies(null);
          }}
          placeholder="Aloe vera, monstera..."
          placeholderTextColor={colors.textLightest}
          style={[
            styles.input,
            styles.speciesInput,
            selectedSpecies && styles.disabledInput,
          ]}
          editable={!selectedSpecies}
        />

        {selectedSpecies && (
          <Pressable style={styles.clearButton} onPress={handleClearSpecies}>
            <Ionicons name="close" size={22} color={colors.textLightest} />
          </Pressable>
        )}
      </View>

      {loadingSuggestions && (
        <ActivityIndicator
          style={styles.smallLoader}
          color={colors.textLightest}
        />
      )}

      {!selectedSpecies && speciesSuggestions.length > 0 && (
        <View style={styles.suggestionsBox}>
          {speciesSuggestions.map((item) => (
            <Pressable
              key={item.id}
              style={styles.suggestionItem}
              onPress={() => handleSelectSpecies(item)}
            >
              <Text style={styles.suggestionName}>{item.name}</Text>

              {!!item.scientific_name && (
                <Text style={styles.suggestionScientific}>
                  {item.scientific_name}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      )}

      {!selectedSpecies &&
        speciesQuery.trim().length >= 2 &&
        !loadingSuggestions &&
        speciesSuggestions.length === 0 && (
          <View style={styles.notFoundCard}>
            <Text style={styles.notFoundText}>
              Vrsta nije pronađena u bazi.
            </Text>
            <Text style={styles.notFoundSubtext}>
              Automatsku identifikaciju ćemo dodati kasnije.
            </Text>
          </View>
        )}

      <Text style={styles.label}>Interval zalivanja:</Text>
      <TextInput
        value={wateringInterval}
        onChangeText={setWateringInterval}
        placeholder="npr. 4"
        placeholderTextColor={colors.textLightest}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.helperText}>
        *Preporučeni interval zalivanja je u danima. Ovo možete izmeniti za
        konkretnu biljku.
      </Text>

      <Text style={styles.label}>Datum poslednjeg zalivanja:</Text>

      <Pressable
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{formatDate(lastWateredDate)}</Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={lastWateredDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {saving ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={colors.textLightest}
        />
      ) : (
        <AppButton
          title="potvrdi"
          variant="outline"
          onPress={handleSavePlant}
          buttonStyle={styles.confirmButton}
          textStyle={styles.confirmButtonText}
        />
      )}

      <AppButton
        title="otkaži"
        variant="outline"
        onPress={() => router.back()}
        buttonStyle={styles.cancelButton}
        textStyle={styles.cancelButtonText}
      />

      <PlantImagePickerModal
        visible={imagePickerVisible}
        title="Dodaj sliku biljke"
        onClose={() => setImagePickerVisible(false)}
        onImageSelected={(image) => setPlantImage(image)}
      />
    </KeyboardAwareScrollView>
  );
}

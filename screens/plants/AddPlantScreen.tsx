import PlantForm, {
  PlantFormValues,
  PlantSpeciesOption,
} from "@/components/PlantForm";
import { Colors } from "@/constants/theme";
import { supabase } from "@/services/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "./AddPlantScreen.styles";

const colors = Colors.light;

export default function AddPlantScreen() {
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [speciesResults, setSpeciesResults] = useState<PlantSpeciesOption[]>(
    [],
  );
  const [selectedSpecies, setSelectedSpecies] =
    useState<PlantSpeciesOption | null>(null);

  const [saving, setSaving] = useState(false);

  const [formValues, setFormValues] = useState<PlantFormValues>({
    name: "",
    location: "",
    wateringInterval: "",
    lastWateredDate: new Date(),
    imageAsset: null,
    imageUrl: null,
  });

  async function handleSpeciesSearch(value: string) {
    setSpeciesQuery(value);

    if (selectedSpecies && value !== selectedSpecies.name) {
      setSelectedSpecies(null);
    }

    if (value.trim().length < 2) {
      setSpeciesResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("plant_species")
        .select(
          `
          id,
          name,
          scientific_name,
          description,
          watering_interval,
          moisture_categories (
            label,
            moisture_min,
            moisture_max
          )
        `,
        )
        .ilike("name", `%${value.trim()}%`)
        .limit(8);

      if (error) {
        throw error;
      }

      const normalizedSpecies: PlantSpeciesOption[] = (data ?? []).map(
        (species: any) => ({
          ...species,
          moisture_categories: Array.isArray(species.moisture_categories)
            ? (species.moisture_categories[0] ?? null)
            : (species.moisture_categories ?? null),
        }),
      );

      setSpeciesResults(normalizedSpecies);
    } catch (error) {
      console.log("Species search error:", error);
      setSpeciesResults([]);
    }
  }

  async function handleSelectSpecies(species: PlantSpeciesOption) {
    setSelectedSpecies(species);
    setSpeciesQuery(species.name);
    setSpeciesResults([]);

    setFormValues((prev) => ({
      ...prev,
      wateringInterval: String(species.watering_interval ?? 7),
    }));
  }

  async function uploadPlantImage(userId: string) {
    if (!formValues.imageAsset) {
      return null;
    }

    const base64 = await FileSystem.readAsStringAsync(
      formValues.imageAsset.uri,
      {
        encoding: FileSystem.EncodingType.Base64,
      },
    );

    const fileExt =
      formValues.imageAsset.uri.split(".").pop()?.toLowerCase() === "png"
        ? "png"
        : "jpg";

    const contentType =
      formValues.imageAsset.mimeType ??
      (fileExt === "png" ? "image/png" : "image/jpeg");

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
    const trimmedName = formValues.name.trim();
    const trimmedLocation = formValues.location.trim();
    const intervalNumber = Number(formValues.wateringInterval);

    if (!selectedSpecies) {
      Alert.alert("Greška", "Izaberite vrstu biljke.");
      return;
    }

    if (!trimmedName) {
      Alert.alert("Greška", "Unesite naziv biljke.");
      return;
    }

    if (
      !formValues.wateringInterval.trim() ||
      Number.isNaN(intervalNumber) ||
      intervalNumber <= 0
    ) {
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

      const userId = userData.user.id;
      const imageUrl = await uploadPlantImage(userId);

      const { error } = await supabase.from("plants").insert({
        user_id: userId,
        name: trimmedName,
        location: trimmedLocation || null,
        species_id: selectedSpecies.id,
        image_url: imageUrl,
        watering_interval: intervalNumber,
        last_watered: formValues.lastWateredDate.toISOString(),
      });

      if (error) {
        throw error;
      }

      Alert.alert("Uspešno", "Biljka je dodata.");

      setFormValues({
        name: "",
        location: "",
        wateringInterval: "",
        lastWateredDate: new Date(),
        imageAsset: null,
        imageUrl: null,
      });

      setSelectedSpecies(null);
      setSpeciesQuery("");
      setSpeciesResults([]);

      router.replace("/(tabs)" as any);
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

      <PlantForm
        title="Dodaj biljku"
        values={formValues}
        onChange={setFormValues}
        selectedSpecies={selectedSpecies}
        speciesLocked={false}
        speciesQuery={speciesQuery}
        onSpeciesQueryChange={handleSpeciesSearch}
        speciesResults={speciesResults}
        onSelectSpecies={handleSelectSpecies}
        submitTitle="sačuvaj"
        loading={saving}
        onSubmit={handleSavePlant}
        onCancel={() => router.replace("/(tabs)" as any)}
        cancelTitle="nazad"
      />
    </KeyboardAwareScrollView>
  );
}

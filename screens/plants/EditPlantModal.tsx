import { Ionicons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import PlantForm, {
    PlantFormValues,
    PlantSpeciesOption,
} from "@/components/PlantForm";
import { Colors } from "@/constants/theme";
import { supabase } from "@/services/supabase";
import { styles } from "./EditPlantModal.styles";

const colors = Colors.light as any;

export type PlantForEdit = {
  id: string;
  user_id: string;
  name: string;
  location: string | null;
  image_url: string | null;
  watering_interval: number | null;
  last_watered: string | null;
  plant_species: PlantSpeciesOption | null;
};

type EditPlantModalProps = {
  visible: boolean;
  plant: PlantForEdit | null;
  onClose: () => void;
  onSaved: (updatedPlant: {
    name: string;
    location: string | null;
    image_url: string | null;
    watering_interval: number;
    last_watered: string;
  }) => void;
};

export default function EditPlantModal({
  visible,
  plant,
  onClose,
  onSaved,
}: EditPlantModalProps) {
  const [formValues, setFormValues] = useState<PlantFormValues>({
    name: "",
    location: "",
    wateringInterval: "",
    lastWateredDate: new Date(),
    imageAsset: null,
    imageUrl: null,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!plant || !visible) return;

    setFormValues({
      name: plant.name,
      location: plant.location ?? "",
      wateringInterval: String(
        plant.watering_interval ?? plant.plant_species?.watering_interval ?? 7,
      ),
      lastWateredDate: plant.last_watered
        ? new Date(plant.last_watered)
        : new Date(),
      imageAsset: null,
      imageUrl: plant.image_url ?? null,
    });
  }, [plant, visible]);

  async function uploadPlantImage() {
    if (!plant) {
      return null;
    }

    if (!formValues.imageAsset) {
      return formValues.imageUrl;
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

    const filePath = `${plant.user_id}/${plant.id}-${Date.now()}.${fileExt}`;

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

    return `${data.publicUrl}?v=${Date.now()}`;
  }

  async function handleSave() {
    if (!plant) return;

    const trimmedName = formValues.name.trim();
    const trimmedLocation = formValues.location.trim();
    const intervalNumber = Number(formValues.wateringInterval);

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
      const imageUrl = await uploadPlantImage();

      const updatedPlant = {
        name: trimmedName,
        location: trimmedLocation || null,
        image_url: imageUrl,
        watering_interval: intervalNumber,
        last_watered: formValues.lastWateredDate.toISOString(),
      };

      const { error } = await supabase
        .from("plants")
        .update({
          ...updatedPlant,
          updated_at: new Date().toISOString(),
        })
        .eq("id", plant.id)
        .eq("user_id", plant.user_id);

      if (error) {
        throw error;
      }

      onSaved(updatedPlant);
      onClose();

      Alert.alert("Uspešno", "Podaci o biljci su izmenjeni.");
    } catch (error: any) {
      console.log("Edit plant error:", error);

      Alert.alert("Greška", error.message ?? "Podaci o biljci nisu izmenjeni.");
    } finally {
      setSaving(false);
    }
  }

  if (!plant) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color={colors.textLightest} />
        </Pressable>

        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid
          extraScrollHeight={100}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <PlantForm
            title="Izmeni biljku"
            values={formValues}
            onChange={setFormValues}
            selectedSpecies={plant.plant_species}
            speciesLocked
            submitTitle="sačuvaj"
            loading={saving}
            onSubmit={handleSave}
            onCancel={onClose}
            cancelTitle="otkaži"
          />
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}

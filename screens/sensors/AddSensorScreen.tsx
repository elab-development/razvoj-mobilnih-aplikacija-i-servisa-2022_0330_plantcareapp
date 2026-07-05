import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppButton from "@/components/AppButton";
import { Colors } from "@/constants/theme";
import { supabase } from "@/services/supabase";
import { styles } from "./AddSensorScreen.styles";

import PlantDropdown from "@/components/PlantDropdown";

const colors = Colors.light as any;

type PlantOption = {
  id: string;
  name: string;
  location: string | null;
  sensor_id: string | null;
  plant_species: {
    name: string;
  } | null;
};

export default function AddSensorScreen() {
  const [sensorName, setSensorName] = useState("");
  const [macAddress, setMacAddress] = useState("");

  const [plants, setPlants] = useState<PlantOption[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  const [loadingPlants, setLoadingPlants] = useState(true);
  const [saving, setSaving] = useState(false);

  const [plantSearch, setPlantSearch] = useState("");

  useEffect(() => {
    loadPlantsWithoutSensor();
  }, []);

  async function loadPlantsWithoutSensor() {
    setLoadingPlants(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("plants")
        .select(
          `
          id,
          name,
          location,
          sensor_id,
          plant_species (
            name
          )
        `,
        )
        .eq("user_id", userData.user.id)
        .is("sensor_id", null)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const normalizedPlants: PlantOption[] = (data ?? []).map(
        (plant: any) => ({
          ...plant,
          plant_species: Array.isArray(plant.plant_species)
            ? (plant.plant_species[0] ?? null)
            : (plant.plant_species ?? null),
        }),
      );

      setPlants(normalizedPlants);
    } catch (error: any) {
      console.log("Load plants without sensor error:", error);
      Alert.alert("Greška", error.message ?? "Biljke nisu učitane.");
    } finally {
      setLoadingPlants(false);
    }
  }

  function normalizeMacAddress(value: string) {
    return value.trim().toUpperCase();
  }

  function isValidMacAddress(value: string) {
    const mac = normalizeMacAddress(value);

    return /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(mac);
  }

  const selectedPlant = useMemo(() => {
    return plants.find((plant) => plant.id === selectedPlantId) ?? null;
  }, [plants, selectedPlantId]);

  const filteredPlants = useMemo(() => {
    const query = plantSearch.trim().toLowerCase();

    if (!query) {
      return plants;
    }

    return plants.filter((plant) => {
      const plantName = plant.name ?? "";
      const speciesName = plant.plant_species?.name ?? "";
      const location = plant.location ?? "";

      return (
        plantName.toLowerCase().includes(query) ||
        speciesName.toLowerCase().includes(query) ||
        location.toLowerCase().includes(query)
      );
    });
  }, [plants, plantSearch]);

  async function handleSaveSensor() {
    const trimmedName = sensorName.trim();
    const normalizedMac = normalizeMacAddress(macAddress);

    if (!trimmedName) {
      Alert.alert("Greška", "Unesite naziv senzora.");
      return;
    }

    if (!normalizedMac) {
      Alert.alert("Greška", "Unesite MAC adresu senzora.");
      return;
    }

    if (!isValidMacAddress(normalizedMac)) {
      Alert.alert(
        "Greška",
        "MAC adresa mora biti u formatu AA:BB:CC:DD:EE:FF.",
      );
      return;
    }

    if (!selectedPlantId) {
      Alert.alert(
        "Greška",
        "Izaberite biljku sa kojom želite da uparite senzor.",
      );
      return;
    }

    setSaving(true);

    let createdSensorId: string | null = null;

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error("Korisnik nije prijavljen.");
      }

      const userId = userData.user.id;

      const { data: sensorData, error: sensorError } = await supabase
        .from("sensors")
        .insert({
          user_id: userId,
          name: trimmedName,
          mac_address: normalizedMac,
          status: "paired",
        })
        .select("id")
        .single();

      if (sensorError || !sensorData) {
        throw sensorError ?? new Error("Senzor nije kreiran.");
      }

      createdSensorId = sensorData.id;

      const { error: plantUpdateError } = await supabase
        .from("plants")
        .update({
          sensor_id: createdSensorId,
        })
        .eq("id", selectedPlantId)
        .eq("user_id", userId);

      if (plantUpdateError) {
        throw plantUpdateError;
      }

      Alert.alert("Uspešno", "Senzor je dodat i uparen sa biljkom.");
      router.replace("/(tabs)/sensors" as any);
    } catch (error: any) {
      console.log("Add sensor error:", error);

      if (createdSensorId) {
        await supabase.from("sensors").delete().eq("id", createdSensorId);
      }

      const message =
        error?.code === "23505"
          ? "Senzor sa ovom MAC adresom već postoji."
          : (error.message ?? "Senzor nije sačuvan.");

      Alert.alert("Greška", message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topShape}></View>

        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Dodaj senzor</Text>

        <Text style={styles.label}>Naziv senzora:</Text>
        <TextInput
          value={sensorName}
          onChangeText={setSensorName}
          placeholder="ESP32 za sanseveriju..."
          placeholderTextColor={colors.textLightest}
          style={styles.input}
        />

        <Text style={styles.label}>MAC adresa:</Text>
        <TextInput
          value={macAddress}
          onChangeText={setMacAddress}
          placeholder="AA:BB:CC:DD:EE:FF"
          placeholderTextColor={colors.textLightest}
          style={styles.input}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Biljka:</Text>

        {loadingPlants ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={colors.textLightest}
          />
        ) : plants.length === 0 ? (
          <View style={styles.emptyPlantsBox}>
            <Text style={styles.emptyPlantsText}>
              Nema biljaka bez senzora.
            </Text>

            <Text style={styles.emptyPlantsSubtext}>
              Dodajte novu biljku ili uklonite senzor sa postojeće biljke.
            </Text>
          </View>
        ) : (
          <PlantDropdown
            plants={plants}
            selectedPlantId={selectedPlantId}
            onSelect={setSelectedPlantId}
            placeholder="Izaberite biljku"
          />
        )}
        {selectedPlant && (
          <View style={styles.selectedInfoBox}>
            <Text style={styles.selectedInfoText}>
              Senzor će biti uparen sa biljkom:
            </Text>
            <Text style={styles.selectedInfoPlant}>{selectedPlant.name}</Text>
          </View>
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
            onPress={handleSaveSensor}
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
      </KeyboardAwareScrollView>
    </View>
  );
}

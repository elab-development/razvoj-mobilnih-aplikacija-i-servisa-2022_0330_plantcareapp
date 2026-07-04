import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import PlantDropdown from "@/components/PlantDropdown";
import { Colors } from "@/constants/theme";
import { supabase } from "@/services/supabase";
import { styles } from "./SensorDetailsScreen.styles";

const colors = Colors.light as any;

type Sensor = {
  id: string;
  mac_address: string;
  name: string | null;
  status: string | null;
  created_at: string;
  last_seen: string | null;
};

type PlantOption = {
  id: string;
  name: string;
  location: string | null;
  sensor_id: string | null;
  plant_species: {
    name: string;
  } | null;
};

type SensorReading = {
  id: string;
  sensor_id: string;
  moisture: number;
  air_temperature?: number | null;
  air_humidity?: number | null;
  created_at: string;
};

export default function SensorDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const sensorId = params.id;

  const [sensor, setSensor] = useState<Sensor | null>(null);

  const [sensorName, setSensorName] = useState("");
  const [macAddress, setMacAddress] = useState("");

  const [plants, setPlants] = useState<PlantOption[]>([]);
  const [originalPlantId, setOriginalPlantId] = useState<string | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  const [latestReading, setLatestReading] = useState<SensorReading | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSensorDetails();
  }, [sensorId]);

  async function loadSensorDetails() {
    if (!sensorId) {
      Alert.alert("Greška", "Senzor nije pronađen.");
      router.back();
      return;
    }

    setLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.replace("/login");
        return;
      }

      const userId = userData.user.id;

      const { data: sensorData, error: sensorError } = await supabase
        .from("sensors")
        .select("id, mac_address, name, status, created_at, last_seen")
        .eq("id", sensorId)
        .eq("user_id", userId)
        .single();

      if (sensorError || !sensorData) {
        throw sensorError ?? new Error("Senzor nije pronađen.");
      }

      setSensor(sensorData);
      setSensorName(sensorData.name ?? "");
      setMacAddress(sensorData.mac_address ?? "");

      const { data: allPlantsData, error: plantsError } = await supabase
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
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (plantsError) {
        throw plantsError;
      }

      const normalizedPlants: PlantOption[] = (allPlantsData ?? []).map(
        (plant: any) => ({
          ...plant,
          plant_species: Array.isArray(plant.plant_species)
            ? (plant.plant_species[0] ?? null)
            : (plant.plant_species ?? null),
        }),
      );

      const currentPlant =
        normalizedPlants.find((plant) => plant.sensor_id === sensorId) ?? null;

      setOriginalPlantId(currentPlant?.id ?? null);
      setSelectedPlantId(currentPlant?.id ?? null);

      /**
       * Prikazujemo:
       * - biljke koje nemaju senzor
       * - biljku koja je već povezana sa ovim senzorom
       */
      const availablePlants = normalizedPlants.filter(
        (plant) => !plant.sensor_id || plant.sensor_id === sensorId,
      );

      setPlants(availablePlants);

      const { data: readingData, error: readingError } = await supabase
        .from("sensor_readings")
        .select(
          "id, sensor_id, moisture, air_temperature, air_humidity, created_at",
        )
        .eq("sensor_id", sensorId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (readingError) {
        console.log("Latest reading error:", readingError);
      }

      setLatestReading(readingData ?? null);
    } catch (error: any) {
      console.log("Sensor details load error:", error);
      Alert.alert("Greška", error.message ?? "Podaci o senzoru nisu učitani.");
    } finally {
      setLoading(false);
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

  function formatDateTime(value: string | null) {
    if (!value) {
      return "Nikad";
    }

    return new Date(value).toLocaleString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getDisplayStatus() {
    if (!sensor) {
      return "Nepoznat";
    }

    if (sensor.status === "unpaired") {
      return "Nepovezan";
    }

    if (sensor.status === "offline") {
      return "Offline";
    }

    if (!sensor.last_seen) {
      return sensor.status === "paired" ? "Povezan" : "Nepoznat";
    }

    const lastSeen = new Date(sensor.last_seen);
    const now = new Date();

    const diffMinutes = Math.floor(
      (now.getTime() - lastSeen.getTime()) / (1000 * 60),
    );

    if (diffMinutes > 24 * 60) {
      return "Offline";
    }

    return "Povezan";
  }
  async function handleSaveChanges() {
    if (!sensorId || !sensor) {
      return;
    }

    const trimmedName = sensorName.trim();
    const normalizedMac = normalizeMacAddress(macAddress);
    const originalMac = normalizeMacAddress(sensor.mac_address ?? "");

    if (!trimmedName) {
      Alert.alert("Greška", "Unesite naziv senzora.");
      return;
    }

    if (!normalizedMac) {
      Alert.alert("Greška", "Unesite MAC adresu.");
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

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error("Korisnik nije prijavljen.");
      }

      const userId = userData.user.id;

      /**
       * Ako korisnik menja MAC adresu, prvo proveravamo da li već postoji
       * neki drugi senzor sa tom MAC adresom.
       */
      if (normalizedMac !== originalMac) {
        const { data: existingSensor, error: existingSensorError } =
          await supabase
            .from("sensors")
            .select("id")
            .eq("mac_address", normalizedMac)
            .neq("id", sensorId)
            .maybeSingle();

        if (existingSensorError) {
          throw existingSensorError;
        }

        if (existingSensor) {
          Alert.alert("Greška", "Senzor sa ovom MAC adresom već postoji.");
          setSaving(false);
          return;
        }
      }

      /**
       * Update senzora.
       * MAC šaljemo samo ako je stvarno promenjen.
       */
      const sensorUpdateData: {
        name: string;
        status: string;
        mac_address?: string;
      } = {
        name: trimmedName,
        status: "paired",
      };

      if (normalizedMac !== originalMac) {
        sensorUpdateData.mac_address = normalizedMac;
      }

      const { error: sensorUpdateError } = await supabase
        .from("sensors")
        .update(sensorUpdateData)
        .eq("id", sensorId)
        .eq("user_id", userId);

      if (sensorUpdateError) {
        throw sensorUpdateError;
      }

      const { error: unlinkPlantsError } = await supabase
        .from("plants")
        .update({
          sensor_id: null,
        })
        .eq("sensor_id", sensorId)
        .eq("user_id", userId);

      if (unlinkPlantsError) {
        throw unlinkPlantsError;
      }

      const { error: linkPlantError } = await supabase
        .from("plants")
        .update({
          sensor_id: sensorId,
        })
        .eq("id", selectedPlantId)
        .eq("user_id", userId);

      if (linkPlantError) {
        throw linkPlantError;
      }

      Alert.alert("Uspešno", "Senzor je izmenjen.");
      router.replace("/(tabs)/sensors" as any);
    } catch (error: any) {
      console.log("Update sensor error:", error);

      let message = error.message ?? "Senzor nije izmenjen.";

      if (error?.code === "23505") {
        if (
          error.message?.includes("mac_address") ||
          error.message?.includes("sensors_mac_address")
        ) {
          message = "Senzor sa ovom MAC adresom već postoji.";
        } else if (
          error.message?.includes("sensor_id") ||
          error.message?.includes("plants_sensor_id")
        ) {
          message =
            "Ovaj senzor je već povezan sa drugom biljkom. Pokušajte ponovo.";
        } else {
          message = "Već postoji zapis sa ovim podacima.";
        }
      }

      Alert.alert("Greška", message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteSensor() {
    if (!sensorId) {
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

      const { error: unlinkError } = await supabase
        .from("plants")
        .update({
          sensor_id: null,
        })
        .eq("sensor_id", sensorId)
        .eq("user_id", userId);

      if (unlinkError) {
        throw unlinkError;
      }

      const { error: readingsDeleteError } = await supabase
        .from("sensor_readings")
        .delete()
        .eq("sensor_id", sensorId);

      if (readingsDeleteError) {
        console.log("Readings delete error:", readingsDeleteError);
      }

      const { error: sensorDeleteError } = await supabase
        .from("sensors")
        .delete()
        .eq("id", sensorId)
        .eq("user_id", userId);

      if (sensorDeleteError) {
        throw sensorDeleteError;
      }

      Alert.alert("Uspešno", "Senzor je obrisan.");
      router.replace("/(tabs)/sensors" as any);
    } catch (error: any) {
      console.log("Delete sensor error:", error);

      Alert.alert("Greška", error.message ?? "Senzor nije obrisan.");
    } finally {
      setSaving(false);
    }
  }

  function handleDeletePress() {
    Alert.alert(
      "Brisanje senzora",
      "Da li ste sigurni da želite da obrišete ovaj senzor?",
      [
        {
          text: "Otkaži",
          style: "cancel",
        },
        {
          text: "Obriši",
          style: "destructive",
          onPress: deleteSensor,
        },
      ],
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.textLightest} />
      </View>
    );
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
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Detalji senzora</Text>

        <View style={styles.statusCard}>
          <View style={styles.sensorIconCircle}>
            <Ionicons name="hardware-chip" size={52} color={colors.accent} />
          </View>

          <View style={styles.statusTextBox}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusValue}>{getDisplayStatus()}</Text>
          </View>
        </View>

        <View style={styles.readingCard}>
          <Text style={styles.readingTitle}>Poslednje očitavanje</Text>

          <View style={styles.readingRow}>
            <Text style={styles.readingLabel}>Vlaga:</Text>
            <Text style={styles.readingValue}>
              {latestReading ? `${latestReading.moisture}%` : "Nema podataka"}
            </Text>
          </View>

          <View style={styles.readingRow}>
            <Text style={styles.readingLabel}>Temperatura:</Text>
            <Text style={styles.readingValue}>
              {latestReading?.air_temperature != null
                ? `${latestReading.air_temperature}°C`
                : "Nema"}
            </Text>
          </View>

          <View style={styles.readingRow}>
            <Text style={styles.readingLabel}>Vlažnost vazduha:</Text>
            <Text style={styles.readingValue}>
              {latestReading?.air_humidity != null
                ? `${latestReading.air_humidity}%`
                : "Nema"}
            </Text>
          </View>

          <View style={styles.readingRow}>
            <Text style={styles.readingLabel}>Aktivnost:</Text>
            <Text style={styles.readingValue}>
              {formatDateTime(sensor?.last_seen ?? null)}
            </Text>
          </View>
        </View>

        <Text style={styles.label}>Naziv senzora:</Text>
        <TextInput
          value={sensorName}
          onChangeText={setSensorName}
          placeholder="Senzor dnevna soba..."
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

        <Text style={styles.label}>Uparena biljka:</Text>

        {plants.length === 0 ? (
          <View style={styles.emptyPlantsBox}>
            <Text style={styles.emptyPlantsText}>
              Nema dostupnih biljaka za uparivanje.
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
              Senzor je uparen sa biljkom:
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
          <>
            <AppButton
              title="sačuvaj"
              variant="outline"
              onPress={handleSaveChanges}
              buttonStyle={styles.confirmButton}
              textStyle={styles.confirmButtonText}
            />

            <AppButton
              title="obriši"
              variant="outline"
              onPress={handleDeletePress}
              buttonStyle={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            />
          </>
        )}

        <AppButton
          title="nazad"
          variant="outline"
          onPress={() => router.back()}
          buttonStyle={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

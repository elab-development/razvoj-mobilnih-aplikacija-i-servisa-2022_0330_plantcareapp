import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import AppButton from "@/components/AppButton";
import { Colors } from "@/constants/theme";
import { supabase } from "@/services/supabase";
import EditPlantModal from "./EditPlantModal";
import { styles } from "./PlantDetailsScreen.styles";

const colors = Colors.light as any;

const defaultPlantImages: Record<string, ImageSourcePropType> = {
  cactus: require("@/assets/images/default-plants/cactus.png"),
  flower: require("@/assets/images/default-plants/flower.png"),
  rose: require("@/assets/images/default-plants/rose.png"),
  default: require("@/assets/images/default-plants/default.png"),
};

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
  default_image_type: string | null;
  moisture_categories: MoistureCategory | null;
};

type Sensor = {
  id: string;
  name: string | null;
  status: string | null;
  last_seen: string | null;
};

type SensorReading = {
  id: string;
  sensor_id: string;
  moisture: number;
  air_temperature: number | null;
  air_humidity: number | null;
  created_at: string;
};

type Plant = {
  id: string;
  user_id: string;
  name: string;
  location: string | null;
  image_url: string | null;
  sensor_id: string | null;
  last_watered: string | null;
  created_at: string;
  watering_interval: number | null;
  plant_species: PlantSpecies | null;
  sensors: Sensor | null;
};

export default function PlantDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const plantId = params.id;

  const [plant, setPlant] = useState<Plant | null>(null);
  const [latestReading, setLatestReading] = useState<SensorReading | null>(
    null,
  );

  const [activeTab, setActiveTab] = useState<"info" | "logs">("info");
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPlantDetails();
  }, [plantId]);

  async function loadPlantDetails() {
    if (!plantId) {
      Alert.alert("Greška", "Biljka nije pronađena.");
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

      const { data, error } = await supabase
        .from("plants")
        .select(
          `
          id,
          user_id,
          name,
          location,
          image_url,
          sensor_id,
          last_watered,
          created_at,
          watering_interval,
          plant_species (
            id,
            name,
            scientific_name,
            description,
            watering_interval,
            default_image_type,
            moisture_categories (
              id,
              name,
              label,
              moisture_min,
              moisture_max
            )
          ),
          sensors (
            id,
            name,
            status,
            last_seen
          )
        `,
        )
        .eq("id", plantId)
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        throw error ?? new Error("Biljka nije pronađena.");
      }

      const normalizedPlant: Plant = {
        ...(data as any),
        plant_species: Array.isArray((data as any).plant_species)
          ? ((data as any).plant_species[0] ?? null)
          : ((data as any).plant_species ?? null),
        sensors: Array.isArray((data as any).sensors)
          ? ((data as any).sensors[0] ?? null)
          : ((data as any).sensors ?? null),
      };

      setPlant(normalizedPlant);

      if (normalizedPlant.sensor_id) {
        const { data: readingData, error: readingError } = await supabase
          .from("sensor_readings")
          .select(
            "id, sensor_id, moisture, air_temperature, air_humidity, created_at",
          )
          .eq("sensor_id", normalizedPlant.sensor_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (readingError) {
          console.log("Latest reading error:", readingError);
        }

        setLatestReading(readingData ?? null);
      } else {
        setLatestReading(null);
      }
    } catch (error: any) {
      console.log("Plant details error:", error);

      Alert.alert("Greška", error.message ?? "Podaci o biljci nisu učitani.");
    } finally {
      setLoading(false);
    }
  }

  const plantImageSource = useMemo(() => {
    if (plant?.image_url) {
      return { uri: plant.image_url };
    }

    const imageType = plant?.plant_species?.default_image_type ?? "default";

    return defaultPlantImages[imageType] ?? defaultPlantImages.default;
  }, [plant]);

  function formatDate(value: string | null) {
    if (!value) {
      return "Nije uneto";
    }

    return new Date(value).toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatDateTime(value: string | null) {
    if (!value) {
      return "Nema podataka";
    }

    return new Date(value).toLocaleString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getNextWateringText() {
    if (!plant) return "Nema podataka";

    const interval =
      plant.watering_interval ?? plant.plant_species?.watering_interval ?? 7;

    const referenceDate = plant.last_watered ?? plant.created_at;
    const lastDate = new Date(referenceDate);
    const nextDate = new Date(lastDate);

    nextDate.setDate(lastDate.getDate() + interval);

    return formatDate(nextDate.toISOString());
  }

  function getSoilStatus() {
    if (!latestReading) {
      return "Nema merenja";
    }

    const category = plant?.plant_species?.moisture_categories;

    if (!category) {
      return "Izmereno";
    }

    if (latestReading.moisture < category.moisture_min) {
      return "Suvo";
    }

    if (latestReading.moisture > category.moisture_max) {
      return "Previše vlažno";
    }

    return "Vlažno";
  }

  async function deletePlant() {
    if (!plant) return;

    setDeleting(true);

    try {
      const { error: logsError } = await supabase
        .from("plant_logs")
        .delete()
        .eq("plant_id", plant.id);

      if (logsError) {
        throw logsError;
      }

      const { error: notificationsError } = await supabase
        .from("notifications")
        .delete()
        .eq("plant_id", plant.id);

      if (notificationsError) {
        throw notificationsError;
      }

      if (plant.sensor_id) {
        const { error: sensorError } = await supabase
          .from("sensors")
          .update({
            status: "unpaired",
          })
          .eq("id", plant.sensor_id)
          .eq("user_id", plant.user_id);

        if (sensorError) {
          console.log("Sensor unpair error:", sensorError);
        }
      }

      const { error: plantDeleteError } = await supabase
        .from("plants")
        .delete()
        .eq("id", plant.id)
        .eq("user_id", plant.user_id);

      if (plantDeleteError) {
        throw plantDeleteError;
      }

      Alert.alert("Uspešno", "Biljka je obrisana.");
      router.replace("/(tabs)" as any);
    } catch (error: any) {
      console.log("Delete plant error:", error);

      Alert.alert("Greška", error.message ?? "Biljka nije obrisana.");
    } finally {
      setDeleting(false);
    }
  }

  function handleDeletePress() {
    Alert.alert(
      "Brisanje biljke",
      "Da li ste sigurni da želite da obrišete ovu biljku? Ova akcija je nepovratna.",
      [
        {
          text: "Otkaži",
          style: "cancel",
        },
        {
          text: "Obriši",
          style: "destructive",
          onPress: deletePlant,
        },
      ],
    );
  }

  function renderInfoTab() {
    if (!plant) return null;

    return (
      <View>
        <View style={styles.sectionCard}>
          {plant.plant_species?.description && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Opis</Text>
              <Text style={styles.descriptionText}>
                {plant.plant_species.description}
              </Text>
            </View>
          )}

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Podaci o biljci</Text>

          <InfoRow label="Naziv" value={plant.name} />
          <InfoRow
            label="Vrsta"
            value={plant.plant_species?.name ?? "Nije uneta"}
          />
          <InfoRow
            label="Latinski naziv"
            value={plant.plant_species?.scientific_name ?? "Nije uneto"}
          />
          <InfoRow label="Lokacija" value={plant.location ?? "Nije uneta"} />
          <InfoRow
            label="Poslednje zalivanje"
            value={formatDate(plant.last_watered)}
          />
          <InfoRow label="Sledeće zalivanje" value={getNextWateringText()} />
          <InfoRow
            label="Interval"
            value={`${
              plant.watering_interval ??
              plant.plant_species?.watering_interval ??
              7
            } dana`}
          />
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Merenja</Text>

          <InfoRow label="Status zemlje" value={getSoilStatus()} />

          <InfoRow
            label="Vlaga zemlje"
            value={
              latestReading ? `${latestReading.moisture}%` : "Nema podataka"
            }
          />

          <InfoRow
            label="Temperatura"
            value={
              latestReading?.air_temperature != null
                ? `${latestReading.air_temperature}°C`
                : "Nema podataka"
            }
          />

          <InfoRow
            label="Vlažnost vazduha"
            value={
              latestReading?.air_humidity != null
                ? `${latestReading.air_humidity}%`
                : "Nema podataka"
            }
          />

          <InfoRow
            label="Senzor"
            value={plant.sensors?.name ?? "Nije povezan"}
          />

          <InfoRow
            label="Poslednje javljanje"
            value={formatDateTime(plant.sensors?.last_seen ?? null)}
          />

          {plant.plant_species?.moisture_categories && (
            <InfoRow
              label="Optimalna vlaga"
              value={`${plant.plant_species.moisture_categories.moisture_min}% - ${plant.plant_species.moisture_categories.moisture_max}%`}
            />
          )}
        </View>
        <View style={styles.sectionDividerSmall} />
      </View>
    );
  }

  function renderLogsTab() {
    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Dnevnik biljke</Text>
        <Text style={styles.descriptionText}>Uskoro....</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.textLightest} />
      </View>
    );
  }

  if (!plant) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageHeader}>
          <Image
            source={plantImageSource}
            style={styles.headerImage}
            resizeMode={plant.image_url ? "cover" : "contain"}
          />

          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={26}
              color={colors.textLightest}
            />
          </Pressable>

          <Pressable
            style={styles.editTopButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Ionicons name="pencil" size={22} color={colors.textLightest} />
          </Pressable>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.dropIcon}>
            <Image
              source={require("@/assets/images/logoLightest.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.plantTitle}>{plant.name}</Text>

          <Text style={styles.plantSubtitle}>
            {plant.plant_species?.scientific_name ?? "Biljka"}
          </Text>
          <View style={styles.tabsContainer}>
            <Pressable
              style={[
                styles.tabButton,
                activeTab === "info" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("info")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "info" && styles.activeTabText,
                ]}
              >
                Detalji
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.tabButton,
                activeTab === "logs" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("logs")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "logs" && styles.activeTabText,
                ]}
              >
                Dnevnik
              </Text>
            </Pressable>
          </View>

          {activeTab === "info" ? renderInfoTab() : renderLogsTab()}

          {deleting ? (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color={colors.primary}
            />
          ) : (
            <AppButton
              title="obriši biljku"
              variant="outline"
              onPress={handleDeletePress}
              buttonStyle={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            />
          )}
        </View>
      </ScrollView>

      <EditPlantModal
        visible={editModalVisible}
        plant={plant}
        onClose={() => setEditModalVisible(false)}
        onSaved={(updatedPlant) => {
          setPlant((prev) =>
            prev
              ? {
                  ...prev,
                  name: updatedPlant.name,
                  location: updatedPlant.location,
                  image_url: updatedPlant.image_url,
                  watering_interval: updatedPlant.watering_interval,
                  last_watered: updatedPlant.last_watered,
                }
              : prev,
          );
        }}
      />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

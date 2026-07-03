import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageSourcePropType,
    Pressable,
    RefreshControl,
    Text,
    TextInput,
    View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { supabase } from "@/services/supabase";
import { styles } from "./HomeScreen.styles";

const colors = Colors.light as any;

const defaultPlantImages = {
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
  watering_interval: number | null;
  default_image_type: "cactus" | "flower" | "rose" | "default";
  moisture_categories?: MoistureCategory | null;
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
  created_at: string;
};

type PlantItem = {
  id: string;
  name: string;
  location: string | null;
  image_url: string | null;
  sensor_id: string | null;
  last_watered: string | null;
  created_at: string;
  watering_interval: number | null;
  plant_species: PlantSpecies | null;
  sensors: Sensor | null;
  latestReading?: SensorReading | null;
};

export default function HomeScreen() {
  const [displayName, setDisplayName] = useState("Korisnik");
  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, []),
  );

  async function loadHomeData() {
    setLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.replace("/login");
        return;
      }

      const user = userData.user;

      const fallbackName =
        user.user_metadata?.first_name ??
        user.user_metadata?.username ??
        user.email?.split("@")[0] ??
        "Korisnik";

      setDisplayName(fallbackName);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData?.first_name) {
        setDisplayName(profileData.first_name);
      }

      const { data: plantsData, error: plantsError } = await supabase
        .from("plants")
        .select(
          `
          id,
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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (plantsError) {
        throw plantsError;
      }

      const normalizedPlants: PlantItem[] = (plantsData ?? []).map(
        (plant: any) => ({
          ...plant,
          plant_species: Array.isArray(plant.plant_species)
            ? (plant.plant_species[0] ?? null)
            : (plant.plant_species ?? null),
          sensors: Array.isArray(plant.sensors)
            ? (plant.sensors[0] ?? null)
            : (plant.sensors ?? null),
        }),
      );

      const sensorIds = normalizedPlants
        .map((plant) => plant.sensor_id)
        .filter(Boolean) as string[];

      let latestBySensor: Record<string, SensorReading> = {};

      if (sensorIds.length > 0) {
        const { data: readingsData, error: readingsError } = await supabase
          .from("sensor_readings")
          .select("id, sensor_id, moisture, created_at")
          .in("sensor_id", sensorIds)
          .order("created_at", { ascending: false })
          .limit(sensorIds.length * 5);

        if (readingsError) {
          console.log("Readings error:", readingsError);
        }

        for (const reading of readingsData ?? []) {
          if (!latestBySensor[reading.sensor_id]) {
            latestBySensor[reading.sensor_id] = reading;
          }
        }
      }

      const plantsWithReadings = normalizedPlants.map((plant) => ({
        ...plant,
        latestReading: plant.sensor_id
          ? (latestBySensor[plant.sensor_id] ?? null)
          : null,
      }));

      setPlants(plantsWithReadings);
    } catch (error) {
      console.log("Home load error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadHomeData();
  }

  const filteredPlants = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return plants;
    }

    return plants.filter((plant) => {
      const speciesName = plant.plant_species?.name ?? "";
      const location = plant.location ?? "";

      return (
        plant.name.toLowerCase().includes(query) ||
        speciesName.toLowerCase().includes(query) ||
        location.toLowerCase().includes(query)
      );
    });
  }, [plants, search]);

  function getPlantImageSource(plant: PlantItem): ImageSourcePropType {
    const type = plant.plant_species?.default_image_type ?? "default";

    return defaultPlantImages[type] ?? defaultPlantImages.default;
  }

  function getSoilStatus(plant: PlantItem) {
    const moisture = plant.latestReading?.moisture;
    const category = plant.plant_species?.moisture_categories;

    if (moisture === undefined || moisture === null) {
      return "Nema podataka";
    }

    if (!category) {
      return "Izmereno";
    }

    if (moisture < category.moisture_min) {
      return "Suvo";
    }

    if (moisture > category.moisture_max) {
      return "Previše vlažno";
    }

    return "Odlične vlažnosti";
  }

  function getNextWateringText(plant: PlantItem) {
    const interval =
      plant.watering_interval ?? plant.plant_species?.watering_interval ?? 7;

    const referenceDate = plant.last_watered ?? plant.created_at;

    if (!referenceDate) {
      return `${interval} dana`;
    }

    const last = new Date(referenceDate);
    const next = new Date(last);
    next.setDate(last.getDate() + interval);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);

    const diffMs = next.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `kasni ${Math.abs(diffDays)} dana`;
    }

    if (diffDays === 0) {
      return "danas";
    }

    if (diffDays === 1) {
      return "sutra";
    }

    return `${diffDays} dana`;
  }

  function renderPlantCard({ item }: { item: PlantItem }) {
    const hasSensor = !!item.sensor_id;

    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/plant-details/${item.id}` as any)}
      >
        <View style={styles.imageCircle}>
          <Image
            source={getPlantImageSource(item)}
            style={styles.plantImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.titleLine} />

          {hasSensor ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Vlažnost:</Text>
                <Text style={styles.infoValue}>
                  {item.latestReading
                    ? `${item.latestReading.moisture}%`
                    : "Nema"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Zemljište:</Text>
                <Text style={styles.infoValue}>{getSoilStatus(item)}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Zalivanje za:</Text>
                <Text style={styles.infoValue}>
                  {getNextWateringText(item)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Lokacija:</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {item.location || "Nije uneto"}
                </Text>
              </View>
            </>
          )}
        </View>
      </Pressable>
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
      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id}
        renderItem={renderPlantCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.welcomeText}>Dobrodošli, {displayName}</Text>

            <Pressable
              style={styles.addPlantButton}
              onPress={() => router.push("/(tabs)/add-plant" as any)}
            >
              <Ionicons name="add" size={52} color={colors.textLightest} />
              <Text style={styles.addPlantText}>Dodaj biljku</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Vaša bašta</Text>

            <View style={styles.searchBox}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Pretraži"
                placeholderTextColor={colors.textLightest}
                style={styles.searchInput}
              />

              <Ionicons name="search" size={30} color={colors.textLightest} />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Još nema biljaka</Text>
            <Text style={styles.emptySubtext}>
              Dodajte biljku klikom na dugme iznad
            </Text>
          </View>
        }
      />
    </View>
  );
}

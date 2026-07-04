import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { supabase } from "@/services/supabase";
import { styles } from "./SensorsScreen.styles";
const colors = Colors.light as any;

type Sensor = {
  id: string;
  mac_address: string;
  name: string | null;
  status: "unpaired" | "paired" | "offline" | string;
  created_at: string;
  last_seen: string | null;
};

type Plant = {
  id: string;
  name: string;
  sensor_id: string | null;
};

type SensorReading = {
  id: string;
  sensor_id: string;
  moisture: number;
  air_temperature?: number | null;
  air_humidity?: number | null;
  created_at: string;
};

type SensorItem = Sensor & {
  plant?: Plant | null;
  latestReading?: SensorReading | null;
};

export default function SensorsScreen() {
  const [sensors, setSensors] = useState<SensorItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSensors();
    }, []),
  );

  async function loadSensors() {
    setLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.replace("/login");
        return;
      }

      const userId = userData.user.id;

      const { data: sensorsData, error: sensorsError } = await supabase
        .from("sensors")
        .select("id, mac_address, name, status, created_at, last_seen")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (sensorsError) {
        throw sensorsError;
      }

      const sensorIds = (sensorsData ?? []).map((sensor) => sensor.id);

      let plantBySensor: Record<string, Plant> = {};
      let latestReadingBySensor: Record<string, SensorReading> = {};

      if (sensorIds.length > 0) {
        const { data: plantsData, error: plantsError } = await supabase
          .from("plants")
          .select("id, name, sensor_id")
          .eq("user_id", userId)
          .in("sensor_id", sensorIds);

        if (plantsError) {
          console.log("Plants for sensors error:", plantsError);
        }

        for (const plant of plantsData ?? []) {
          if (plant.sensor_id) {
            plantBySensor[plant.sensor_id] = plant;
          }
        }

        const { data: readingsData, error: readingsError } = await supabase
          .from("sensor_readings")
          .select(
            "id, sensor_id, moisture, air_temperature, air_humidity, created_at",
          )
          .in("sensor_id", sensorIds)
          .order("created_at", { ascending: false })
          .limit(sensorIds.length * 5);

        if (readingsError) {
          console.log("Sensor readings error:", readingsError);
        }

        for (const reading of readingsData ?? []) {
          if (!latestReadingBySensor[reading.sensor_id]) {
            latestReadingBySensor[reading.sensor_id] = reading;
          }
        }
      }

      const finalSensors: SensorItem[] = (sensorsData ?? []).map((sensor) => ({
        ...sensor,
        plant: plantBySensor[sensor.id] ?? null,
        latestReading: latestReadingBySensor[sensor.id] ?? null,
      }));

      setSensors(finalSensors);
    } catch (error) {
      console.log("Sensors load error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadSensors();
  }

  const filteredSensors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return sensors;
    }

    return sensors.filter((sensor) => {
      const name = sensor.name ?? "";
      const mac = sensor.mac_address ?? "";
      const plantName = sensor.plant?.name ?? "";

      return (
        name.toLowerCase().includes(query) ||
        mac.toLowerCase().includes(query) ||
        plantName.toLowerCase().includes(query)
      );
    });
  }, [sensors, search]);

  function formatLastSeen(value: string | null) {
    if (!value) {
      return "Nikad";
    }

    const date = new Date(value);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) {
      return "upravo";
    }

    if (diffMinutes < 60) {
      return `pre ${diffMinutes} min`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `pre ${diffHours} h`;
    }

    const diffDays = Math.floor(diffHours / 24);

    return `pre ${diffDays} dana`;
  }

  function getDisplayStatus(sensor: SensorItem) {
    if (sensor.status === "unpaired") {
      return "Nepovezan";
    }

    if (sensor.status === "offline") {
      return "Offline";
    }

    if (!sensor.last_seen) {
      return sensor.status === "paired" ? "Povezan" : "Nepoznat";
    }

    return "Povezan";
  }

  function getStatusStyle(sensor: SensorItem) {
    const status = getDisplayStatus(sensor);

    if (status === "Povezan") {
      return styles.statusGood;
    }

    if (status === "Nepovezan") {
      return styles.statusWarning;
    }

    return styles.statusBad;
  }

  function renderSensorCard({ item }: { item: SensorItem }) {
    const displayName = item.name || "Senzor";
    const status = getDisplayStatus(item);

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/sensor-details/[id]" as any,
            params: { id: item.id },
          })
        }
      >
        {/* <View style={styles.iconArea}>
          <View style={styles.iconCircle} />

          <View style={styles.iconShadowBox}>
            <Ionicons name="hardware-chip" size={72} color={colors.accent} />
          </View>
        </View> */}

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {displayName}
          </Text>

          <View style={styles.titleLine} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, getStatusStyle(item)]}>
              {status}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Biljka:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {item.plant?.name ?? "Nije povezan"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Aktivan:</Text>
            <Text style={styles.infoValue}>
              {formatLastSeen(item.last_seen)}
            </Text>
          </View>
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
        data={filteredSensors}
        keyExtractor={(item) => item.id}
        renderItem={renderSensorCard}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.topShape}></View>

            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.welcomeText}>Senzori</Text>

            <Pressable
              style={styles.addSensorButton}
              onPress={() => router.push("/(tabs)/add-sensor" as any)}
            >
              <Ionicons name="add" size={52} color={colors.textLightest} />
              <Text style={styles.addSensorText}>Dodaj senzor</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Vaši senzori</Text>

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
            <Text style={styles.emptyText}>Još nema senzora.</Text>
            <Text style={styles.emptySubtext}>
              Dodajte prvi senzor klikom na dugme iznad.
            </Text>
          </View>
        }
      />
    </View>
  );
}

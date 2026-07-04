import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { supabase } from "@/services/supabase";
import { styles } from "./NotificationScreen.styles";

const colors = Colors.light as any;

const monthNames = [
  "Januar",
  "Februar",
  "Mart",
  "April",
  "Maj",
  "Jun",
  "Jul",
  "Avgust",
  "Septembar",
  "Oktobar",
  "Novembar",
  "Decembar",
];

const weekDays = ["Ne", "Po", "Ut", "Sr", "Če", "Pe", "Su"];

type MoistureCategory = {
  id: string;
  label: string;
  moisture_min: number;
  moisture_max: number;
};

type PlantSpecies = {
  id: string;
  name: string;
  watering_interval: number | null;
  moisture_categories?: MoistureCategory | null;
};

type PlantNotification = {
  id: string;
  plant_id: string;
  scheduled_for: string | null;
  status: string;
};

type PlantItem = {
  id: string;
  name: string;
  location: string | null;
  sensor_id: string | null;
  last_watered: string | null;
  created_at: string;
  watering_interval: number | null;
  plant_species: PlantSpecies | null;

  activeNotificationId?: string | null;
  activeNotificationScheduledFor?: string | null;
};

export default function NotificationsScreen() {
  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [completedPlantIds, setCompletedPlantIds] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadPlantsAndNotifications();
    }, []),
  );

  async function loadPlantsAndNotifications() {
    setLoading(true);
    setCompletedPlantIds([]);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error("Korisnik nije prijavljen.");
      }

      const userId = userData.user.id;

      const { data: plantsData, error: plantsError } = await supabase
        .from("plants")
        .select(
          `
          id,
          name,
          location,
          sensor_id,
          last_watered,
          created_at,
          watering_interval,
          plant_species (
            id,
            name,
            watering_interval,
            moisture_categories (
              id,
              label,
              moisture_min,
              moisture_max
            )
          )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (plantsError) {
        throw plantsError;
      }

      const { data: notificationsData, error: notificationsError } =
        await supabase
          .from("notifications")
          .select("id, plant_id, scheduled_for, status")
          .eq("user_id", userId)
          .eq("type", "watering")
          .in("status", ["pending", "sent"]);

      if (notificationsError) {
        throw notificationsError;
      }

      const notificationByPlant: Record<string, PlantNotification> = {};

      for (const notification of notificationsData ?? []) {
        if (notification.plant_id) {
          notificationByPlant[notification.plant_id] =
            notification as PlantNotification;
        }
      }

      const normalizedPlants: PlantItem[] = (plantsData ?? []).map(
        (plant: any) => {
          const species = Array.isArray(plant.plant_species)
            ? (plant.plant_species[0] ?? null)
            : (plant.plant_species ?? null);

          const activeNotification = notificationByPlant[plant.id] ?? null;

          return {
            ...plant,
            plant_species: species,
            activeNotificationId: activeNotification?.id ?? null,
            activeNotificationScheduledFor:
              activeNotification?.scheduled_for ?? null,
          };
        },
      );

      setPlants(normalizedPlants);
    } catch (error: any) {
      console.log("Notifications load error:", error);

      Alert.alert("Greška", error.message ?? "Obaveze nisu učitane.");
    } finally {
      setLoading(false);
    }
  }

  function startOfDay(date: Date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function isSameDay(first: Date, second: Date) {
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  }

  function getNextWateringDate(plant: PlantItem) {
    const interval =
      plant.watering_interval ?? plant.plant_species?.watering_interval ?? 7;

    const referenceDate = plant.last_watered ?? plant.created_at;

    const lastWatered = startOfDay(new Date(referenceDate));
    const nextWatering = new Date(lastWatered);

    nextWatering.setDate(lastWatered.getDate() + interval);

    return nextWatering;
  }

  function isPlantDueForDate(plant: PlantItem, date: Date) {
    const selected = startOfDay(date);
    const today = startOfDay(new Date());

    /**
     * Biljke sa senzorom:
     * Prikazujemo ih samo ako postoji pending/sent red u notifications tabeli.
     */
    if (plant.sensor_id) {
      return isSameDay(selected, today) && !!plant.activeNotificationId;
    }

    /**
     * Biljke bez senzora:
     * Računamo po last_watered + watering_interval.
     */
    const nextWateringDate = getNextWateringDate(plant);

    if (isSameDay(selected, today)) {
      return nextWateringDate.getTime() <= today.getTime();
    }

    return isSameDay(nextWateringDate, selected);
  }

  const tasksForSelectedDate = useMemo(() => {
    return plants.filter(
      (plant) =>
        isPlantDueForDate(plant, selectedDate) &&
        !completedPlantIds.includes(plant.id),
    );
  }, [plants, selectedDate, completedPlantIds]);

  function getCalendarDays() {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstWeekDay = firstDay.getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const cells: { date: Date; currentMonth: boolean }[] = [];

    for (let i = firstWeekDay - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, daysInPreviousMonth - i),
        currentMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    while (cells.length % 7 !== 0) {
      const nextDay = cells.length - firstWeekDay - daysInMonth + 1;

      cells.push({
        date: new Date(year, month + 1, nextDay),
        currentMonth: false,
      });
    }

    return cells;
  }

  function changeMonth(direction: -1 | 1) {
    const nextMonth = new Date(calendarMonth);
    nextMonth.setMonth(calendarMonth.getMonth() + direction);
    setCalendarMonth(nextMonth);
  }

  async function handleMarkWatered(plant: PlantItem) {
    setCompletedPlantIds((prev) => {
      if (prev.includes(plant.id)) {
        return prev;
      }

      return [...prev, plant.id];
    });

    try {
      const now = new Date().toISOString();

      const { error: plantError } = await supabase
        .from("plants")
        .update({
          last_watered: now,
        })
        .eq("id", plant.id);

      if (plantError) {
        throw plantError;
      }

      if (plant.activeNotificationId) {
        const { error: notificationError } = await supabase
          .from("notifications")
          .update({
            status: "done",
            sent_at: now,
          })
          .eq("id", plant.activeNotificationId);

        if (notificationError) {
          throw notificationError;
        }
      } else {
        const { error: notificationError } = await supabase
          .from("notifications")
          .update({
            status: "read",
            sent_at: now,
          })
          .eq("plant_id", plant.id)
          .eq("type", "watering")
          .in("status", ["pending", "sent"]);

        if (notificationError) {
          console.log("Notification update error:", notificationError);
        }
      }

      setPlants((prev) =>
        prev.map((item) =>
          item.id === plant.id
            ? {
                ...item,
                last_watered: now,
                activeNotificationId: null,
                activeNotificationScheduledFor: null,
              }
            : item,
        ),
      );
    } catch (error: any) {
      setCompletedPlantIds((prev) => prev.filter((id) => id !== plant.id));

      Alert.alert(
        "Greška",
        error.message ?? "Biljka nije označena kao zalivena.",
      );
    }
  }

  function formatSelectedDate(date: Date) {
    return date.toLocaleDateString("sr-RS", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function renderCalendar() {
    const cells = getCalendarDays();

    return (
      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <Pressable onPress={() => changeMonth(-1)}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.textDarkest}
            />
          </Pressable>

          <View style={styles.monthBox}>
            <Text style={styles.monthText}>
              {monthNames[calendarMonth.getMonth()]}
            </Text>
          </View>

          <View style={styles.yearBox}>
            <Text style={styles.monthText}>{calendarMonth.getFullYear()}</Text>
          </View>

          <Pressable onPress={() => changeMonth(1)}>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.textDarkest}
            />
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {weekDays.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {cells.map((cell) => {
            const selected = isSameDay(cell.date, selectedDate);

            const hasTasks = plants.some((plant) =>
              isPlantDueForDate(plant, cell.date),
            );

            return (
              <Pressable
                key={cell.date.toISOString()}
                style={[
                  styles.dayCell,
                  selected && styles.selectedDayCell,
                  hasTasks && !selected && styles.taskDayCell,
                ]}
                onPress={() => setSelectedDate(cell.date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    !cell.currentMonth && styles.inactiveDayText,
                    selected && styles.selectedDayText,
                  ]}
                >
                  {cell.date.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  function renderTask({ item }: { item: PlantItem }) {
    return (
      <View style={styles.taskCard}>
        <View style={styles.dropCircle}>
          <Ionicons name="water" size={30} color={colors.textLightest} />
        </View>

        <View style={styles.taskTextBox}>
          <Text style={styles.taskType}>ZALIVANJE</Text>
          <Text style={styles.taskPlantName}>{item.name}</Text>
          <Text style={styles.taskText}>Lokacija: {item.location}</Text>
        </View>

        <Pressable
          style={styles.checkCircle}
          onPress={() => handleMarkWatered(item)}
        >
          <Ionicons name="checkmark" size={34} color={colors.mediumgreen} />
        </Pressable>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={tasksForSelectedDate}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.topShape} />
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Obaveze</Text>

            {renderCalendar()}

            <Text style={styles.todayTitle}>
              {isSameDay(selectedDate, new Date()) ? "Danas," : "Izabrani dan,"}
            </Text>

            <Text style={styles.dateText}>
              {formatSelectedDate(selectedDate)}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nema obaveza za ovaj dan.</Text>
          </View>
        }
      />
    </View>
  );
}

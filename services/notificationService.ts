import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const DAILY_WATERING_NOTIFICATION_ID = "daily-watering-reminder";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupDailyWateringReminder() {
  const permission = await Notifications.getPermissionsAsync();

  let finalStatus = permission.status;

  if (finalStatus !== "granted") {
    const request = await Notifications.requestPermissionsAsync();
    finalStatus = request.status;
  }

  if (finalStatus !== "granted") {
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("watering-reminders", {
      name: "Podsetnici za zalivanje",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FFD96A",
    });
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  const alreadyScheduled = scheduled.some(
    (item) => item.identifier === DAILY_WATERING_NOTIFICATION_ID,
  );

  if (alreadyScheduled) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_WATERING_NOTIFICATION_ID,
    content: {
      title: "Sprout",
      body: "Otvorite aplikaciju da vidite koje biljke treba zaliti danas.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 6,
      minute: 0,
      channelId: "watering-reminders",
    },
  });
}

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const SUNDAY_CHECKIN_ID = "sunday-checkin-reminder";
const CHANNEL_ID = "checkin-reminders";
const REMINDER_HOUR = 9;
const REMINDER_MINUTE = 0;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Schedules (or re-schedules) a weekly Sunday morning reminder to do the
 * check-in. No-ops on web, where local scheduled notifications aren't
 * supported, and silently skips if the user declines the permission prompt.
 */
export async function ensureSundayCheckinReminder(): Promise<void> {
  if (Platform.OS === "web") return;

  try {
    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== "granted") {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    if (status !== "granted") return;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "Sunday check-in reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    // Cancel-then-reschedule keeps this idempotent across app launches instead
    // of relying on scheduleNotificationAsync to dedupe by identifier.
    await Notifications.cancelScheduledNotificationAsync(SUNDAY_CHECKIN_ID).catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier: SUNDAY_CHECKIN_ID,
      content: {
        title: "Time for your Sunday check-in",
        body: "Log your Pilates days to set up this week's strength plan.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1, // 1 = Sunday
        hour: REMINDER_HOUR,
        minute: REMINDER_MINUTE,
        channelId: Platform.OS === "android" ? CHANNEL_ID : undefined,
      },
    });
  } catch (e) {
    console.warn("Failed to schedule Sunday check-in reminder", e);
  }
}

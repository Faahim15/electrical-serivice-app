import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const handleNotificationNavigation = (data: any) => {
  if (!data || !data.type) return;

  switch (data.type) {
    // Add your electrical service app notification types here
    // Example:
    // case "Job Assigned":
    //   router.push("/(tabs)/jobs");
    //   break;
    default:
      console.log("Unknown notification type:", data.type);
      break;
  }
};

export const useNotificationHandler = () => {
  useEffect(() => {
    const setup = async () => {
      // ✅ Android notification channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("service-updates", {
          name: "Service Updates",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#E6F4FE",
          sound: "default",
          showBadge: true,
          enableVibrate: true,
        });
      }

      // ✅ Firebase foreground message listener
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log("Firebase foreground message:", remoteMessage);

        const { notification, data } = remoteMessage;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification?.title ?? "Service Update",
            body: notification?.body ?? "",
            data: data ?? {},
            sound: "default",
          },
          trigger: null,
        });
      });

      return unsubscribe;
    };

    let unsubscribeFn: (() => void) | undefined;

    setup().then((unsub) => {
      unsubscribeFn = unsub;
    });

    // ✅ Handle notification tap
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("Notification tapped:", data);
        handleNotificationNavigation(data);
      });

    // ✅ Handle background/quit notification tap
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification opened app:", remoteMessage.data);
      handleNotificationNavigation(remoteMessage.data);
    });

    // ✅ Handle quit state notification tap
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Initial notification:", remoteMessage.data);
          handleNotificationNavigation(remoteMessage.data);
        }
      });

    return () => {
      unsubscribeFn?.();
      responseListener.remove();
    };
  }, []);
};

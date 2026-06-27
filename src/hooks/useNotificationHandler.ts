import { getApp } from "@react-native-firebase/app";
import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
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
    default:
      console.log("Unknown notification type:", data.type);
      break;
  }
};

export const useNotificationHandler = () => {
  useEffect(() => {
    let unsubscribeFn: (() => void) | undefined;

    const setup = async () => {
      try {
        const messagingInstance = getMessaging(getApp());

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

        const unsubscribe = onMessage(
          messagingInstance,
          async (remoteMessage) => {
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
          },
        );

        onNotificationOpenedApp(messagingInstance, (remoteMessage) => {
          console.log("Notification opened app:", remoteMessage.data);
          handleNotificationNavigation(remoteMessage.data);
        });

        const initialMessage = await getInitialNotification(messagingInstance);
        if (initialMessage) {
          console.log("Initial notification:", initialMessage.data);
          setTimeout(() => {
            handleNotificationNavigation(initialMessage.data);
          }, 500);
        }

        unsubscribeFn = unsubscribe;
      } catch (error) {
        console.log("Notification setup error:", error);
      }
    };

    setup();

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("Notification tapped:", data);
        handleNotificationNavigation(data);
      });

    return () => {
      unsubscribeFn?.();
      responseListener.remove();
    };
  }, []);
};

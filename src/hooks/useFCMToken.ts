import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onTokenRefresh,
} from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

export function useFCMToken() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    fetchToken();

    try {
      const messagingInstance = getMessaging(getApp());
      unsubscribe = onTokenRefresh(messagingInstance, (newToken) => {
        console.log("FCM token refreshed:", newToken);
        setFcmToken(newToken);
      });
    } catch (err) {
      console.log("Token refresh listener error:", err);
    }

    return () => unsubscribe?.();
  }, []);

  async function fetchToken() {
    try {
      setLoading(true);
      setError(null);

      if (!Device.isDevice) {
        setError("Push notifications require a physical device");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        setError("Notification permission denied");
        return;
      }

      const messagingInstance = getMessaging(getApp());
      const token = await getToken(messagingInstance);

      if (token) {
        console.log("✅ FCM Token:", token);
        setFcmToken(token);
      } else {
        setError("Failed to retrieve FCM token");
      }
    } catch (err: any) {
      console.log("FCM Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { fcmToken, loading, error };
}

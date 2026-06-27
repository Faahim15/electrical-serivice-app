import messaging from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

export function useFCMToken() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchToken();

    const unsubscribe = messaging().onTokenRefresh((newToken) => {
      setFcmToken(newToken);
      // TODO: send newToken to your backend
    });

    return () => unsubscribe();
  }, []);

  async function fetchToken() {
    try {
      setLoading(true);
      setError(null);

      if (!Device.isDevice) {
        setError("Push notifications require a physical device");
        return;
      }

      // ✅ Use expo-notifications for permission (no deprecation)
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

      // ✅ Use Firebase just for the FCM token
      const token = await messaging().getToken();

      if (token) {
        setFcmToken(token);
      } else {
        setError("Failed to retrieve FCM token");
      }
    } catch (err: any) {
      console.error("FCM Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { fcmToken, loading, error };
}

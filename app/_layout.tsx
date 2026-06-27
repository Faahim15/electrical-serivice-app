import "@/global.css";
import { initFirebase } from "@/src/lib/firebase";

// ✅ Initialize Firebase immediately at module level
initFirebase();

import {
  handleNotificationNavigation,
  useNotificationHandler,
} from "@/src/hooks/useNotificationHandler";
import { store } from "@/src/redux/store";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { Toaster } from "sonner-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useNotificationHandler();

  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      if (!fontsLoaded) return;
      await SplashScreen.hideAsync();
    }
    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponse();
      if (response) {
        const data = response.notification.request.content.data;
        setTimeout(() => {
          handleNotificationNavigation(data);
        }, 500);
      }
    };
    checkInitialNotification();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <Stack screenOptions={{ headerShown: false }} />
        <Toaster />
      </Provider>
    </GestureHandlerRootView>
  );
}

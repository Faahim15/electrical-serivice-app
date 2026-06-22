import CustomStatusBar from "@/src/utils/CustomStatusBar";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="#F4F6FA" barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}

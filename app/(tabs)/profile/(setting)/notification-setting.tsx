import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import {
  useGetMaintenanceAlertsQuery,
  useUpdateMaintenanceAlertsMutation,
} from "@/src/redux/api-slices/profile/maintenance-alert-api";
import { UpdateMaintenanceAlertsPayload } from "@/src/types/maintenanceAlert.api.types";
import Feather from "@expo/vector-icons/build/Feather";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Linking,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

// ── All maintenance alert keys ────────────────────────────────────────────────
const ALL_ALERTS_PAYLOAD = (
  value: boolean,
): UpdateMaintenanceAlertsPayload => ({
  smokeDetectorBatteries: value,
  carbonMonoxideDetector: value,
  testGfciOutlets: value,
  septicSystemAlarm: value,
  testAfciBreakers: value,
  clearDryerVent: value,
  inspectElectricalCords: value,
});

// ── Static notification items ─────────────────────────────────────────────────
const notificationItems = [
  {
    id: 1,
    title: "Reminder Alerts",
    description: "Get notified about upcoming maintenance reminders",
    defaultValue: true,
    isStatic: false,
  },
  {
    id: 3,
    title: "App Notifications",
    description: "General app notifications and updates",
    defaultValue: true,
    isStatic: false,
  },
];

// ── NotificationCard ──────────────────────────────────────────────────────────
const NotificationCard = ({
  item,
  index,
  value,
  onToggle,
  disabled,
}: {
  item: (typeof notificationItems)[0];
  index: number;
  value: boolean;
  onToggle: (id: number, val: boolean) => void;
  disabled?: boolean;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 110,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 110,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY }] }}
      className="mb-3"
    >
      <View
        className="bg-white rounded-2xl px-4 py-4 flex-row items-center justify-between"
        style={{
          shadowColor: "#06B6D4",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <View className="flex-1 mr-4">
          <Text className="text-[15px] font-Inter_Bold text-[#111827] mb-0.5">
            {item.title}
          </Text>
          <Text className="text-[13px] text-[#6B7280] font-Inter_Regular leading-[18px]">
            {item.description}
          </Text>
        </View>

        <Switch
          value={value}
          onValueChange={(val) => onToggle(item.id, val)}
          trackColor={{ false: "#D1D5DB", true: "#06B6D4" }}
          thumbColor="#ffffff"
          ios_backgroundColor="#D1D5DB"
          disabled={disabled}
        />
      </View>
    </Animated.View>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const Notificationsetting = () => {
  const { data: alertsData } = useGetMaintenanceAlertsQuery();
  const [updateMaintenanceAlerts] = useUpdateMaintenanceAlertsMutation();

  // Derive reminder toggle state: true only if at least one alert is enabled
  const reminderEnabled = alertsData?.data
    ? Object.values(alertsData.data).some((a) => a.enabled)
    : false;

  const [isUpdating, setIsUpdating] = useState(false);

  const [appNotifEnabled, setAppNotifEnabled] = useState(
    notificationItems.find((n) => n.id === 3)?.defaultValue ?? true,
  );

  const handleToggle = async (id: number, val: boolean) => {
    // ── Reminder Alerts ──
    if (id === 1) {
      Alert.alert(
        val ? "Enable All Reminders?" : "Disable All Reminders?",
        val
          ? "This will turn ON all safety & maintenance reminders. You'll receive notifications for smoke detectors, GFCI outlets, dryer vents, and more."
          : "This will turn OFF all safety & maintenance reminders. You won't receive any maintenance notifications until you re-enable them.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: val ? "Enable All" : "Disable All",
            style: val ? "default" : "destructive",
            onPress: async () => {
              setIsUpdating(true);
              try {
                await updateMaintenanceAlerts(ALL_ALERTS_PAYLOAD(val)).unwrap();
                toast.success(
                  val
                    ? "All reminders enabled successfully."
                    : "All reminders disabled successfully.",
                );
              } catch {
                toast.error("Failed to update reminders. Please try again.");
              } finally {
                setIsUpdating(false);
              }
            },
          },
        ],
      );
      return;
    }

    // ── App Notifications ──
    if (id === 3) {
      if (val) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
          setAppNotifEnabled(true);
        } else {
          setAppNotifEnabled(false);
        }
      } else {
        setAppNotifEnabled(false);
        Linking.openSettings();
      }
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center pb-2">
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-2xl text-[#111827] font-Inter_Bold">
            Notification Settings
          </Text>
          <View />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        >
          {notificationItems.map((item, index) => (
            <NotificationCard
              key={item.id}
              item={item}
              index={index}
              value={item.id === 1 ? reminderEnabled : appNotifEnabled}
              onToggle={handleToggle}
              disabled={item.id === 1 && isUpdating}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Notificationsetting;

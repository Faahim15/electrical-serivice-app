import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import Feather from "@expo/vector-icons/build/Feather";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const notificationItems = [
  {
    id: 1,
    title: "Reminder Alerts",
    description: "Get notified about upcoming maintenance reminders",
    defaultValue: true,
    isStatic: true,
  },
  {
    id: 3,
    title: "App Notifications",
    description: "General app notifications and updates",
    defaultValue: true,
    isStatic: false,
  },
];

const NotificationCard = ({
  item,
  index,
  value,
  onToggle,
}: {
  item: (typeof notificationItems)[0];
  index: number;
  value: boolean;
  onToggle: (id: number, val: boolean) => void;
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
          disabled={item.isStatic}
        />
      </View>
    </Animated.View>
  );
};

const Notificationsetting = () => {
  const [settings, setSettings] = useState<Record<number, boolean>>(
    Object.fromEntries(notificationItems.map((n) => [n.id, n.defaultValue])),
  );

  useEffect(() => {
    Animated.timing(new Animated.Value(0), {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleToggle = async (id: number, val: boolean) => {
    const item = notificationItems.find((n) => n.id === id);
    if (item?.isStatic) return;

    // ── App Notifications toggle ──
    if (id === 3) {
      if (val) {
        // ── Off → On: permission চাও ──
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
          setSettings((prev) => ({ ...prev, [id]: true }));
        } else {
          // permission denied — toggle false থাকবে
          setSettings((prev) => ({ ...prev, [id]: false }));
        }
      } else {
        // ── On → Off: phone settings এ নিয়ে যাও ──
        setSettings((prev) => ({ ...prev, [id]: false }));
        Linking.openSettings();
      }
      return;
    }

    setSettings((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* ── Header ── */}
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
              value={settings[item.id]}
              onToggle={handleToggle}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Notificationsetting;

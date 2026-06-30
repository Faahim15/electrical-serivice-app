import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import SafetySkeleton from "@/src/components/skeleton/Safetyskeleton";
import {
  useGetMaintenanceAlertsQuery,
  useUpdateMaintenanceAlertsMutation,
} from "@/src/redux/api-slices/profile/maintenance-alert-api";
import { setSelectedItem } from "@/src/redux/slices/seftymaintanceSlice";
import { MaintenanceAlertKey } from "@/src/types/maintenanceAlert.api.types";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { toast } from "sonner-native";

// ── Maps numeric slice id → API field key ────────────────────────────────────
const ID_TO_KEY: Record<string, MaintenanceAlertKey> = {
  "1": "smokeDetectorBatteries",
  "2": "testGfciOutlets",
  "3": "carbonMonoxideDetector",
  "4": "septicSystemAlarm",
  "5": "clearDryerVent",
  "6": "inspectElectricalCords",
  "7": "testAfciBreakers",
};

// ── Frequency labels per key ──────────────────────────────────────────────────
const KEY_FREQUENCY_LABEL: Record<MaintenanceAlertKey, string> = {
  smokeDetectorBatteries: "yearly",
  carbonMonoxideDetector: "yearly",
  testGfciOutlets: "monthly",
  septicSystemAlarm: "monthly",
  testAfciBreakers: "monthly",
  clearDryerVent: "every 3 months",
  inspectElectricalCords: "every 3 months",
};

// ── Static display metadata (matches slice items order) ──────────────────────
const SAFETY_META: Record<
  MaintenanceAlertKey,
  { sliceId: string; icon: string; title: string; description: string }
> = {
  smokeDetectorBatteries: {
    sliceId: "1",
    icon: "clock",
    title: "Smoke Detector\nBatteries",
    description: "Replace batteries annually.",
  },
  testGfciOutlets: {
    sliceId: "2",
    icon: "zap",
    title: "Test GFCI Outlets",
    description: "Ensure outlets are working properly",
  },
  carbonMonoxideDetector: {
    sliceId: "3",
    icon: "clock",
    title: "Carbon Monoxide\nDetector",
    description: "Replace batteries annually",
  },
  septicSystemAlarm: {
    sliceId: "4",
    icon: "home",
    title: "Septic System\nAlarm",
    description: "Check alarm battery and function",
  },
  clearDryerVent: {
    sliceId: "5",
    icon: "wind",
    title: "Clean Dryer\nVent",
    description: "Prevent fire hazards",
  },
  inspectElectricalCords: {
    sliceId: "6",
    icon: "zap",
    title: "Inspect Electrical\nCords",
    description: "Check for damage or wear",
  },
  testAfciBreakers: {
    sliceId: "7",
    icon: "shield",
    title: "Test AFCI\nBreakers",
    description: "Test arc-fault circuit interrupters",
  },
};

const ORDERED_KEYS: MaintenanceAlertKey[] = [
  "smokeDetectorBatteries",
  "testGfciOutlets",
  "carbonMonoxideDetector",
  "septicSystemAlarm",
  "clearDryerVent",
  "inspectElectricalCords",
  "testAfciBreakers",
];

// ── SafetyCard ────────────────────────────────────────────────────────────────
const SafetyCard = ({
  fieldKey,
  index,
  value,
  onToggle,
}: {
  fieldKey: MaintenanceAlertKey;
  index: number;
  value: boolean;
  onToggle: (key: MaintenanceAlertKey, value: boolean) => void;
}) => {
  const meta = SAFETY_META[fieldKey];
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        delay: 300 + index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 450,
        delay: 300 + index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRoute = () => {
    dispatch(setSelectedItem(meta.sliceId));
    router.push("/(tabs)/help/safety-details");
  };

  const handleToggleRequest = (newValue: boolean) => {
    const frequencyLabel = KEY_FREQUENCY_LABEL[fieldKey];
    const title = meta.title.replace("\n", " ");

    if (newValue) {
      Alert.alert(
        "Enable Reminder?",
        `You'll receive a ${frequencyLabel} reminder to check your ${title}. Stay on top of your home's safety.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Enable",
            onPress: () => onToggle(fieldKey, true),
          },
        ],
      );
    } else {
      Alert.alert(
        "Disable Reminder?",
        `You'll no longer receive ${frequencyLabel} reminders for ${title}. You can re-enable this anytime.`,
        [
          { text: "Keep Active", style: "cancel" },
          {
            text: "Disable",
            style: "destructive",
            onPress: () => onToggle(fieldKey, false),
          },
        ],
      );
    }
  };

  return (
    <Pressable onPress={handleRoute}>
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          backgroundColor: "#fff",
          borderRadius: 16,
          marginBottom: 12,
          paddingHorizontal: 16,
          paddingVertical: 16,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#06B6D4",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <LinearGradient
          colors={["#06B6D4", "#14B8A6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name={meta.icon as any} size={20} color="#fff" />
        </LinearGradient>

        <View style={{ flex: 1 }} className="ml-1.5">
          <Text
            className="text-base font-Inter_SemiBold text-[#1F2937]"
            style={{ lineHeight: 21, marginBottom: 1 }}
          >
            {meta.title}
          </Text>
          <Text
            className="font-Inter_Regular text-sm text-[#6B7280]"
            style={{ lineHeight: 17 }}
          >
            {meta.description}
          </Text>
        </View>

        <Switch
          value={value}
          onValueChange={handleToggleRequest}
          trackColor={{ false: "#E5E7EB", true: "#14B8A6" }}
          thumbColor="#fff"
          ios_backgroundColor="#E5E7EB"
        />
      </Animated.View>
    </Pressable>
  );
};

// ── Safety Screen ─────────────────────────────────────────────────────────────
const Safety = () => {
  const { data, isLoading, isError } = useGetMaintenanceAlertsQuery();
  const [updateMaintenanceAlerts] = useUpdateMaintenanceAlertsMutation();

  const [toggleState, setToggleState] = useState<
    Record<MaintenanceAlertKey, boolean>
  >({
    smokeDetectorBatteries: false,
    carbonMonoxideDetector: false,
    testGfciOutlets: false,
    septicSystemAlarm: false,
    testAfciBreakers: false,
    clearDryerVent: false,
    inspectElectricalCords: false,
  });

  useEffect(() => {
    if (data?.data) {
      const alerts = data.data;
      setToggleState({
        smokeDetectorBatteries: alerts.smokeDetectorBatteries.enabled,
        carbonMonoxideDetector: alerts.carbonMonoxideDetector.enabled,
        testGfciOutlets: alerts.testGfciOutlets.enabled,
        septicSystemAlarm: alerts.septicSystemAlarm.enabled,
        testAfciBreakers: alerts.testAfciBreakers.enabled,
        clearDryerVent: alerts.clearDryerVent.enabled,
        inspectElectricalCords: alerts.inspectElectricalCords.enabled,
      });
    }
  }, [data]);

  const handleToggle = async (key: MaintenanceAlertKey, value: boolean) => {
    setToggleState((prev) => ({ ...prev, [key]: value }));
    try {
      await updateMaintenanceAlerts({ [key]: value }).unwrap();
      toast.success("Reminder updated successfully");
    } catch {
      setToggleState((prev) => ({ ...prev, [key]: !value }));
      toast.error("Failed to update reminder. Please try again.");
    }
  };

  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const heroBannerTextSlide = useRef(new Animated.Value(10)).current;
  const heroBannerTextOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(heroBannerTextSlide, {
        toValue: 0,
        duration: 500,
        delay: 220,
        useNativeDriver: true,
      }),
      Animated.timing(heroBannerTextOpacity, {
        toValue: 1,
        duration: 500,
        delay: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <SafeAreaView edges={["top"]} className="flex-1">
        <Animated.View
          style={{
            transform: [{ translateY: headerSlide }],
            opacity: headerOpacity,
          }}
          className="flex-row justify-between items-center pb-2 px-4"
        >
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl text-[#111827] font-Inter_Bold">
            Safety & Maintenance
          </Text>
          <View />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <Animated.View
            className="mt-3 mb-2"
            style={{
              transform: [{ translateY: heroBannerTextSlide }],
              opacity: heroBannerTextOpacity,
              backgroundColor: "#fff",
              borderRadius: 16,
              marginBottom: 12,
              paddingHorizontal: 16,
              paddingVertical: 16,
              shadowColor: "#06B6D4",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              className="text-base font-Inter_SemiBold text-[#1F2937]"
              style={{ marginBottom: 4 }}
            >
              Safety & Maintenance
            </Text>
            <Text
              className="font-Inter_Regular text-sm text-[#6B7280]"
              style={{ lineHeight: 19 }}
            >
              Keep your home safe and your electrical system running
              efficiently. Toggle any item ON to set an automatic reminder - you
              will receive a notification alert when it is time for maintenance
            </Text>
          </Animated.View>

          {isLoading ? (
            <SafetySkeleton />
          ) : isError ? (
            <View className="items-center py-8">
              <Text className="text-sm font-Inter_Regular text-[#6B7280]">
                Failed to load alerts. Please try again.
              </Text>
            </View>
          ) : (
            ORDERED_KEYS.map((key, index) => (
              <SafetyCard
                key={key}
                fieldKey={key}
                index={index}
                value={toggleState[key]}
                onToggle={handleToggle}
              />
            ))
          )}

          <View className="h-40" />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Safety;

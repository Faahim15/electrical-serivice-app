import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { useGetMaintenanceAlertsQuery } from "@/src/redux/api-slices/profile/maintenance-alert-api";
import { selectSelectedItem } from "@/src/redux/slices/seftymaintanceSlice";
import { MaintenanceAlertKey } from "@/src/types/maintenanceAlert.api.types";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

// ── Maps numeric slice id → API field key for the reminder banner ─────────────
const ID_TO_KEY: Record<string, MaintenanceAlertKey> = {
  "1": "smokeDetectorBatteries",
  "2": "testGfciOutlets",
  "3": "carbonMonoxideDetector",
  "4": "septicSystemAlarm",
  "5": "clearDryerVent",
  "6": "inspectElectricalCords",
  "7": "testAfciBreakers",
};

// ── Frequency per API key (for the reminder banner badge) ────────────────────
const KEY_FREQUENCY: Record<
  MaintenanceAlertKey,
  { label: string; short: string }
> = {
  smokeDetectorBatteries: { label: "Every Year", short: "Yearly" },
  carbonMonoxideDetector: { label: "Every Year", short: "Yearly" },
  testGfciOutlets: { label: "Every Month", short: "Monthly" },
  septicSystemAlarm: { label: "Every Month", short: "Monthly" },
  testAfciBreakers: { label: "Every Month", short: "Monthly" },
  clearDryerVent: { label: "Every 3 Months", short: "Every 3 Months" },
  inspectElectricalCords: { label: "Every 3 Months", short: "Every 3 Months" },
};

const FREQUENCY_STYLE: Record<string, { bg: string; text: string }> = {
  "Every Year": { bg: "#FEF3C7", text: "#92400E" },
  "Every Month": { bg: "#DCFCE7", text: "#166534" },
  "Every 3 Months": { bg: "#E0F2FE", text: "#075985" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ── MaintenanceDetails ────────────────────────────────────────────────────────
const MaintenanceDetails = () => {
  const selectedItem = useSelector(selectSelectedItem);
  const { data: alertsData, refetch } = useGetMaintenanceAlertsQuery();

  // ── Refetch whenever this screen comes into focus ──
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Derive API key + reminder state from the selected item's numeric id
  const apiKey = selectedItem ? ID_TO_KEY[selectedItem.id] : null;
  const alertState = apiKey ? alertsData?.data?.[apiKey] : null;
  const isEnabled = alertState?.enabled ?? false;
  const nextDueAt = alertState?.nextDueAt ?? null;
  const frequency = apiKey ? KEY_FREQUENCY[apiKey] : null;
  const frequencyStyle = frequency
    ? (FREQUENCY_STYLE[frequency.label] ?? { bg: "#F3F4F6", text: "#374151" })
    : { bg: "#F3F4F6", text: "#374151" };

  // ── Animations ──
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const heroBannerSlide = useRef(new Animated.Value(20)).current;
  const heroBannerOpacity = useRef(new Animated.Value(0)).current;
  const heroBannerTextSlide = useRef(new Animated.Value(10)).current;
  const heroBannerTextOpacity = useRef(new Animated.Value(0)).current;
  const reminderBannerSlide = useRef(new Animated.Value(15)).current;
  const reminderBannerOpacity = useRef(new Animated.Value(0)).current;

  const cardAnims = useRef(
    Array.from({ length: 4 }, () => ({
      slide: new Animated.Value(30),
      opacity: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    cardAnims.forEach((a) => {
      a.slide.setValue(30);
      a.opacity.setValue(0);
    });
    reminderBannerSlide.setValue(15);
    reminderBannerOpacity.setValue(0);

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
      Animated.timing(heroBannerSlide, {
        toValue: 0,
        duration: 500,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heroBannerOpacity, {
        toValue: 1,
        duration: 500,
        delay: 150,
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
      Animated.timing(reminderBannerSlide, {
        toValue: 0,
        duration: 450,
        delay: 280,
        useNativeDriver: true,
      }),
      Animated.timing(reminderBannerOpacity, {
        toValue: 1,
        duration: 450,
        delay: 280,
        useNativeDriver: true,
      }),
      ...cardAnims.flatMap((anim, i) => [
        Animated.timing(anim.slide, {
          toValue: 0,
          duration: 450,
          delay: 340 + i * 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 450,
          delay: 340 + i * 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [selectedItem?.id]);

  // ── Fallback ──
  if (!selectedItem) {
    return (
      <ScreenWrapper>
        <SafeAreaView
          edges={["top"]}
          className="flex-1 items-center justify-center"
        >
          <Text className="text-[#6B7280] font-Inter_Regular text-sm">
            No item selected.
          </Text>
          <Pressable onPress={() => router.back()} className="mt-4">
            <Text className="text-[#155DFC] font-Inter_SemiBold">Go Back</Text>
          </Pressable>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* ── Header ── */}
        <Animated.View
          style={{
            transform: [{ translateY: headerSlide }],
            opacity: headerOpacity,
          }}
          className="flex-row justify-between items-center pb-2"
        >
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl text-[#1F2937] font-Inter_SemiBold">
            Maintenance Details
          </Text>
          <View />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 4 }}
        >
          {/* ── Page Title (from Redux slice) ── */}
          <Animated.View
            style={{
              transform: [{ translateY: heroBannerSlide }],
              opacity: heroBannerOpacity,
            }}
            className="pt-2 pb-3"
          >
            <Text className="text-xl font-Inter_Medium text-[#111827]">
              {selectedItem.pageTitle}
            </Text>
          </Animated.View>

          {/* ── Reminder Status Banner (from API) ── */}
          <Animated.View
            style={{
              transform: [{ translateY: reminderBannerSlide }],
              opacity: reminderBannerOpacity,
              borderRadius: 14,
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            {isEnabled && nextDueAt ? (
              <View
                style={{
                  backgroundColor: "#F0FDF9",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#99F6E4",
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: "#CCFBF1",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  <Feather name="bell" size={16} color="#0F766E" />
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 3,
                    }}
                  >
                    <Text className="text-sm font-Inter_SemiBold text-[#0F766E]">
                      Reminder Active
                    </Text>
                    {frequency && (
                      <View
                        style={{
                          backgroundColor: frequencyStyle.bg,
                          borderRadius: 20,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: frequencyStyle.text,
                            fontFamily: "Inter_Medium",
                          }}
                        >
                          {frequency.short}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs font-Inter_Regular text-[#374151]">
                    Next reminder scheduled for{" "}
                    <Text className="font-Inter_SemiBold text-[#0F766E]">
                      {formatDate(nextDueAt)}
                    </Text>
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: "#F3F4F6",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  <Feather name="bell-off" size={16} color="#9CA3AF" />
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 3,
                    }}
                  >
                    <Text className="text-sm font-Inter_SemiBold text-[#374151]">
                      No Reminder Set
                    </Text>
                    {frequency && (
                      <View
                        style={{
                          backgroundColor: frequencyStyle.bg,
                          borderRadius: 20,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: frequencyStyle.text,
                            fontFamily: "Inter_Medium",
                          }}
                        >
                          {frequency.short}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs font-Inter_Regular text-[#6B7280]">
                    Toggle this item ON from the Safety & Maintenance screen to
                    receive a{" "}
                    <Text className="font-Inter_Medium text-[#374151]">
                      {frequency?.label.toLowerCase()}
                    </Text>{" "}
                    reminder.
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>

          {/* ── Detail Cards (from Redux slice) ── */}
          <View className="gap-y-3">
            {selectedItem.details.map((detail, index) => (
              <Animated.View
                key={detail.title}
                style={{
                  transform: [
                    {
                      translateY:
                        cardAnims[index]?.slide ?? new Animated.Value(0),
                    },
                  ],
                  opacity: cardAnims[index]?.opacity ?? new Animated.Value(1),
                }}
                className="bg-white rounded-2xl shadow-sm p-4"
              >
                <Text className="text-base font-Inter_Medium text-[#1F2937] mb-2">
                  {detail.title}
                </Text>
                <Text className="text-sm text-[#6B7280] font-Inter_Regular leading-5">
                  {detail.body}
                </Text>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default MaintenanceDetails;

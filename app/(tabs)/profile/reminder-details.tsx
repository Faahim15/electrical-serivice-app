import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import ReminderDetailsSkeleton from "@/src/components/skeleton/Remiderdetailsskeleton";
import { useGetMaintenanceAlertsQuery } from "@/src/redux/api-slices/profile/maintenance-alert-api";
import { RootState } from "@/src/redux/store";
import { MaintenanceAlertKey } from "@/src/types/maintenanceAlert.api.types";
import Feather from "@expo/vector-icons/build/Feather";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

// ─── Notes content per reminder key ──────────────────────────────────────────

const REMINDER_NOTES: Record<
  MaintenanceAlertKey,
  { title: string; body: string }[]
> = {
  smokeDetectorBatteries: [
    {
      title: "Why It Matters",
      body: "A smoke detector with a dead battery provides no protection. Replacing batteries annually ensures your alarm is always ready to alert you in an emergency.",
    },
    {
      title: "How to Test",
      body: "Press and hold the test button on your detector for a few seconds. A loud beep confirms it is working. If there is no sound, replace the battery immediately.",
    },
  ],
  carbonMonoxideDetector: [
    {
      title: "Why It Matters",
      body: "Carbon monoxide is odorless and colorless. A functioning detector is your only reliable warning against CO buildup, which can be life-threatening.",
    },
    {
      title: "How to Test",
      body: "Press the test button and listen for the alarm pattern. Replace batteries if the unit chirps intermittently or fails to sound during the test.",
    },
  ],
  testGfciOutlets: [
    {
      title: "Why It Matters",
      body: "GFCI outlets protect against electric shock in wet areas like kitchens and bathrooms. A tripped or faulty GFCI can leave you unprotected without any visible sign.",
    },
    {
      title: "How to Test",
      body: "Press the TEST button — the outlet should lose power. Then press RESET to restore it. If the outlet does not respond correctly, contact a licensed electrician.",
    },
  ],
  septicSystemAlarm: [
    {
      title: "Why It Matters",
      body: "A septic alarm warns you of high water levels or pump failures before they become costly or hazardous. Regular checks prevent sewage backups and system damage.",
    },
    {
      title: "What to Check",
      body: "Verify the alarm light and audible signal are functional. Check the float switch and pump operation. Schedule a professional inspection if anything seems off.",
    },
  ],
  testAfciBreakers: [
    {
      title: "Why It Matters",
      body: "Arc-fault circuit interrupters detect dangerous electrical arcs that standard breakers miss. Faulty AFCI breakers can fail to prevent electrical fires.",
    },
    {
      title: "How to Test",
      body: "Press the TEST button on the breaker — it should trip immediately. Press RESET to restore power. If it does not trip or reset correctly, have it replaced by an electrician.",
    },
  ],
  clearDryerVent: [
    {
      title: "Why It Matters",
      body: "Lint buildup in dryer vents is one of the leading causes of house fires. A clogged vent also forces your dryer to work harder, increasing energy costs.",
    },
    {
      title: "How to Clean",
      body: "Disconnect the vent duct from the back of the dryer and use a vent brush kit to remove lint from the duct and the exterior vent cap. Reconnect and run a short dry cycle to confirm airflow.",
    },
  ],
  inspectElectricalCords: [
    {
      title: "Why It Matters",
      body: "Damaged or frayed electrical cords are a serious fire and shock hazard. Regular inspection catches wear early before it becomes dangerous.",
    },
    {
      title: "What to Look For",
      body: "Check for cracked insulation, exposed wires, kinks, or scorch marks near plugs. Replace any damaged cord immediately — do not use tape as a permanent fix.",
    },
  ],
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ─── Reminderdetails ──────────────────────────────────────────────────────────

const Reminderdetails = () => {
  const reminder = useSelector(
    (state: RootState) => state.reminderDetails.selectedReminder,
  );

  const { data: alertsData, isLoading } = useGetMaintenanceAlertsQuery();

  const apiKey = reminder?.key as MaintenanceAlertKey | undefined;
  const alertState = apiKey ? alertsData?.data?.[apiKey] : null;
  const nextDueAt = alertState?.nextDueAt ?? null;
  const notes = apiKey ? REMINDER_NOTES[apiKey] : [];

  // ── Animations ──
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;

  const noteAnims = useRef(
    Array.from({ length: 2 }, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(100, [
      Animated.timing(card1Anim, {
        toValue: 1,
        duration: 350,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(card2Anim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(card3Anim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      ...noteAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ),
    ]).start();
  }, []);

  const makeCardStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="flex-row justify-between items-center pb-2"
        >
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-2xl text-[#111827] font-Inter_Bold">
            Reminder Details
          </Text>
          <View />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32, gap: 12 }}
        >
          {isLoading ? (
            <ReminderDetailsSkeleton />
          ) : (
            <>
              {/* Reminder Title Card */}
              <Animated.View
                style={makeCardStyle(card1Anim)}
                className="bg-white rounded-2xl px-4 py-4 mt-3"
              >
                <Text className="text-xs text-gray-400 mb-1 font-Inter_Regular">
                  Reminder Title
                </Text>
                <Text className="text-base text-[#111827] font-Inter_Bold">
                  {reminder?.title}
                </Text>
              </Animated.View>

              {/* Frequency + Next Due Date Card */}
              <Animated.View
                style={makeCardStyle(card2Anim)}
                className="bg-white rounded-2xl px-4 py-4"
              >
                {/* Frequency Row */}
                <View className="flex-row items-center gap-3 pb-3 border-b border-gray-100">
                  <Feather name="clock" size={18} color="#9CA3AF" />
                  <View>
                    <Text className="text-xs text-gray-400 font-Inter_Regular">
                      Frequency
                    </Text>
                    <Text className="text-sm text-[#111827] font-Inter_SemiBold mt-0.5">
                      {reminder?.frequency}
                    </Text>
                  </View>
                </View>

                {/* Next Due Date Row */}
                <View className="flex-row items-center gap-3 pt-3">
                  <Feather name="calendar" size={18} color="#9CA3AF" />
                  <View>
                    <Text className="text-xs text-gray-400 font-Inter_Regular">
                      Next Due Date
                    </Text>
                    <Text className="text-sm text-[#111827] font-Inter_SemiBold mt-0.5">
                      {nextDueAt ? formatDate(nextDueAt) : "—"}
                    </Text>
                  </View>
                </View>
              </Animated.View>

              {/* Status Card */}
              <Animated.View
                style={makeCardStyle(card3Anim)}
                className="bg-white rounded-2xl px-4 py-4"
              >
                <Text className="text-xs text-gray-400 mb-2 font-Inter_Regular">
                  Status
                </Text>
                <View
                  className={`self-start rounded-full px-4 py-1 ${
                    reminder?.status === "Active" ? "bg-sky-50" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-Inter_SemiBold ${
                      reminder?.status === "Active"
                        ? "text-[#1DA1F2]"
                        : "text-gray-500"
                    }`}
                  >
                    {reminder?.status}
                  </Text>
                </View>
              </Animated.View>

              {/* Notes Cards */}
              {notes.map((note, index) => (
                <Animated.View
                  key={note.title}
                  style={makeCardStyle(
                    noteAnims[index] ?? new Animated.Value(1),
                  )}
                  className="bg-white rounded-2xl px-4 py-4"
                >
                  <Text className="text-base text-[#111827] font-Inter_Bold mb-2">
                    {note.title}
                  </Text>
                  <Text className="text-sm text-[#6B7280] font-Inter_Regular leading-5">
                    {note.body}
                  </Text>
                </Animated.View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Reminderdetails;

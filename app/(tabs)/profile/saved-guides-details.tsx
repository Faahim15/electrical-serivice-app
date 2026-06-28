import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import {
  useGetGuideByIdQuery,
  useSaveGuideMutation,
  useUnsaveGuideMutation,
} from "@/src/redux/api-slices/home/home-api";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const SavedGuideDetails = () => {
  const { guideId } = useLocalSearchParams<{ guideId?: string }>();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ─── API Hooks ──────────────────────────────────────────────────────────────
  const { data: guideData, isLoading: isLoadingGuide } = useGetGuideByIdQuery(
    guideId || "",
    {
      skip: !guideId,
    },
  );

  const [saveGuide] = useSaveGuideMutation();
  const [unsaveGuide] = useUnsaveGuideMutation();

  const guide = guideData?.data;
  const steps = guide?.steps ?? [];
  const safetyWarning = guide?.safetyWarnings ?? "";
  const pageTitle = guide?.name ?? "Troubleshooting";

  // ─── Set initial saved state ────────────────────────────────────────────────
  useEffect(() => {
    if (guide) {
      setIsSaved(guide.isSaved || false);
    }
  }, [guide]);

  // ─── Animations ──────────────────────────────────────────────────────────────
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const warningAnim = useRef(new Animated.Value(0)).current;
  const stepsLabelAnim = useRef(new Animated.Value(0)).current;
  const stepAnims = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(0)),
  ).current;
  const bottomCardAnim = useRef(new Animated.Value(0)).current;
  const btn1Anim = useRef(new Animated.Value(0)).current;
  const btn2Anim = useRef(new Animated.Value(0)).current;
  const saveBtnAnim = useRef(new Animated.Value(0)).current;

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
    ]).start();

    Animated.sequence([
      Animated.delay(200),
      Animated.timing(warningAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(stepsLabelAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.stagger(
        80,
        stepAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ),
      ),
      Animated.timing(bottomCardAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(btn1Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(btn2Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(saveBtnAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // ─── Handle Remove from Saved (Unsave) ─────────────────────────────────────
  const handleRemoveFromSaved = async () => {
    if (!guideId && !guide) {
      toast.error("Guide not found");
      return;
    }

    const id = guideId || guide?._id;
    if (!id) {
      toast.error("Guide ID not found");
      return;
    }

    setIsLoading(true);
    try {
      await unsaveGuide(id).unwrap();
      setIsSaved(false);
      toast.success("Guide removed from saved!");
      // Navigate back after successful unsave
      setTimeout(() => {
        router.back();
      }, 800);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove guide");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (isLoadingGuide && guideId) {
    return (
      <ScreenWrapper paddingHorizontal={0}>
        <SafeAreaView edges={["top"]} className="flex-1 mt-[4%]">
          <View className="flex-1 items-center justify-center">
            <Text className="text-[#64748B] font-Inter_Regular">
              Loading guide...
            </Text>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  // ─── If no guide found ──────────────────────────────────────────────────────
  if (!guide) {
    return (
      <ScreenWrapper paddingHorizontal={0}>
        <SafeAreaView edges={["top"]} className="flex-1 mt-[4%]">
          <View className="flex-1 items-center justify-center px-4">
            <Feather name="file-text" size={48} color="#CBD5E1" />
            <Text className="text-[#64748B] font-Inter_Regular text-center mt-4">
              Guide not found.{"\n"}Please try again.
            </Text>
            <Pressable
              onPress={() => router.back()}
              className="mt-4 bg-[#0EA5E9] px-6 py-2 rounded-full"
            >
              <Text className="text-white font-Inter_SemiBold">Go Back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper paddingHorizontal={0}>
      <SafeAreaView edges={["top"]} className="flex-1 mt-[4%]">
        {/* ── Header ── */}
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
            {pageTitle}
          </Text>
          <View />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* ── Safety Warning Card ── */}
          <Animated.View
            style={{
              opacity: warningAnim,
              transform: [
                {
                  translateY: warningAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
            className="mx-4 mt-3 border border-[#EF4444] rounded-xl p-4 bg-white"
          >
            <View className="flex-row items-center gap-2 mb-1">
              <Feather name="alert-triangle" size={18} color="#EF4444" />
              <Text className="text-[#EF4444] font-Inter_SemiBold text-base">
                Safety Warnings
              </Text>
            </View>
            <Text className="text-gray-600 text-sm leading-5">
              {safetyWarning}
            </Text>
          </Animated.View>

          {/* ─── Steps Label ── */}
          <Animated.View
            style={{ opacity: stepsLabelAnim }}
            className="px-4 mt-5 mb-2 flex-row justify-between items-center"
          >
            <Text className="text-base font-Inter_SemiBold text-[#1F2937]">
              Steps to Follow
            </Text>

            {/* ─── Remove from Saved Button ── */}
            <Animated.View style={{ opacity: saveBtnAnim }}>
              <Pressable
                onPress={handleRemoveFromSaved}
                disabled={isLoading}
                className="px-4 py-2 rounded-full flex-row items-center gap-2 bg-red-500"
                style={{ opacity: isLoading ? 0.6 : 1 }}
              >
                <Feather name="trash-2" size={14} color="white" />
                <Text className="font-Inter_SemiBold text-xs text-white">
                  {isLoading ? "Removing..." : "Remove from Saved"}
                </Text>
              </Pressable>
            </Animated.View>
          </Animated.View>

          {/* ─── Steps List ── */}
          <View className="px-4 gap-3">
            {steps.map((step: any, index: number) => (
              <Animated.View
                key={step._id || index}
                style={{
                  opacity: stepAnims[index] ?? new Animated.Value(1),
                  transform: [
                    {
                      translateX: (
                        stepAnims[index] ?? new Animated.Value(1)
                      ).interpolate({
                        inputRange: [0, 1],
                        outputRange: [-24, 0],
                      }),
                    },
                  ],
                  shadowColor: "#06B6D4",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.07,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                className="items-center bg-white rounded-2xl px-4 py-4 flex-row gap-4"
              >
                <View className="w-8 h-8 rounded-lg border border-[#1F2937] bg-white items-center justify-center">
                  <Text className="text-base font-Inter_SemiBold text-[#1F2937]">
                    {index + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-Inter_SemiBold text-[#1F2937] mb-0.5">
                    {step.subtitle}
                  </Text>
                  <Text className="text-[#6B7280] text-sm leading-4">
                    {step.description}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* ── Still Having Issues Card + Buttons ── */}
          <Animated.View
            style={{
              opacity: bottomCardAnim,
              transform: [
                {
                  translateY: bottomCardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
              shadowColor: "#06B6D4",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.07,
              shadowRadius: 8,
              elevation: 3,
            }}
            className="mx-4 mt-5 bg-white rounded-2xl px-4 py-4 flex-col gap-3"
          >
            <Text className="text-base font-Inter_SemiBold text-[#1F2937]">
              Still Having Issues?
            </Text>
            <Text className="text-sm font-Inter_Regular text-[#6B7280] leading-5">
              Contact us for professional service.
            </Text>

            {/* Contact Us */}
            <Pressable
              onPress={() => router.push("/(tabs)/help/contact-details")}
            >
              <LinearGradient
                colors={["#06B6D4", "#14B8A6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-white font-Inter_Bold text-[15px]">
                  Contact Us
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Request Service */}
            <Pressable
              onPress={() =>
                router.replace("/(tabs)/quotes/quote/choose-category")
              }
              className="rounded-2xl py-4 items-center border border-[#14B8A6]"
            >
              <Text
                className="font-Inter_Bold text-base"
                style={{ color: "#14B8A6" }}
              >
                Request Service
              </Text>
            </Pressable>
          </Animated.View>
          <View className="h-40" />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default SavedGuideDetails;

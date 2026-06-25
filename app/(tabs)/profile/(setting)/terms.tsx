import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import TermsSkeleton from "@/src/components/skeleton/TermsSkeleton";
import { useGetTermsAndConditionsQuery } from "@/src/redux/api-slices/profile/terms-api";
import Feather from "@expo/vector-icons/build/Feather";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Terms = () => {
  const { data, isLoading, isError, refetch } = useGetTermsAndConditionsQuery();

  const content = data?.data?.content ?? "";
  const updatedAt = data?.data?.updatedAt
    ? new Date(data.data.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "April 8, 2026";

  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!isLoading && !isError && content) {
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.spring(contentSlide, {
          toValue: 0,
          delay: 100,
          useNativeDriver: true,
          tension: 60,
          friction: 9,
        }),
      ]).start();
    }
  }, [isLoading, isError, content]);

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* ── Header ── */}
        <View className="flex-row justify-between items-center pb-2">
          <Pressable onPress={() => router.back()} className="">
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-2xl text-[#111827] font-Inter_Bold">
            Terms & Conditions
          </Text>
          <View />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        >
          {/* ── Loading ── */}
          {isLoading && <TermsSkeleton />}

          {/* ── Error ── */}
          {isError && (
            <View className="items-center justify-center mt-16">
              <Feather name="alert-circle" size={48} color="#EF4444" />
              <Text className="text-base font-Inter_SemiBold text-gray-800 mt-3 mb-1">
                Failed to load
              </Text>
              <Text className="text-sm font-Inter_Regular text-gray-500 mb-4 text-center">
                Please check your connection and try again.
              </Text>
              <Pressable
                onPress={refetch}
                className="bg-[#0EA5E9] px-6 py-3 rounded-xl"
              >
                <Text className="text-white font-Inter_SemiBold text-sm">
                  Retry
                </Text>
              </Pressable>
            </View>
          )}

          {/* ── Content ── */}
          {!isLoading && !isError && (
            <Animated.View
              className="bg-white rounded-2xl px-4 pt-4 pb-6"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
                opacity: contentFade,
                transform: [{ translateY: contentSlide }],
              }}
            >
              {/* ── Last Updated ── */}
              <Animated.Text
                style={{ opacity: headerFade }}
                className="text-[12px] text-[#9CA3AF] font-Inter_Regular mb-1"
              >
                Last updated: {updatedAt}
              </Animated.Text>

              {/* ── Content ── */}
              <Text className="text-[13px] text-[#6B7280] font-Inter_Regular leading-[21px] mt-4">
                {content}
              </Text>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Terms;

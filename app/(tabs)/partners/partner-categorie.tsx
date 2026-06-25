import PartnerCard from "@/src/components/pratner/PartnerCard";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import PartnerCardSkeleton from "@/src/components/skeleton/PartnerCardSkeleton";
import { useGetPartnersByCategoryQuery } from "@/src/redux/api-slices/profile/partners-api";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Partnercategorie = () => {
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const heroBannerSlide = useRef(new Animated.Value(20)).current;
  const heroBannerOpacity = useRef(new Animated.Value(0)).current;

  // ── Params from Partners.tsx ─────────────────────────────────────────────
  const { categoryId, categoryName, categoryDescription, partnerCount } =
    useLocalSearchParams<{
      categoryId: string;
      categoryName: string;
      categoryDescription: string;
      partnerCount: string;
    }>();

  // ── API ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useGetPartnersByCategoryQuery(
    categoryId ?? "",
    { skip: !categoryId },
  );

  const partners = data?.data?.filter((p) => p.isActive) ?? [];

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
    ]).start();
  }, []);

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* ── Header ──────────────────────────────────────────────────────── */}
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
            {categoryName}
          </Text>
          <View />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* ── Hero Banner ─────────────────────────────────────────────── */}
          <Animated.View
            className="mb-4 bg-white rounded-2xl px-4 py-4 mt-3"
            style={[
              {
                transform: [{ translateY: heroBannerSlide }],
                opacity: heroBannerOpacity,
              },
              {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
              },
            ]}
          >
            <View className="flex-row items-center gap-3 mb-2">
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
                <Text className="text-white text-sm font-Inter_Bold">
                  {partnerCount}
                </Text>
              </LinearGradient>

              <Text className="text-[17px] font-Inter_Bold text-[#0F172A] flex-1 leading-snug">
                {categoryName}
              </Text>
            </View>
            <Text className="text-[13px] font-Inter_Regular text-[#64748B] leading-relaxed">
              {categoryDescription}
            </Text>
          </Animated.View>

          {/* ── Loading ──────────────────────────────────────────────────── */}
          {isLoading && <PartnerCardSkeleton />}

          {/* ── Error ────────────────────────────────────────────────────── */}
          {isError && (
            <View className="items-center justify-center mt-10">
              <Text className="text-[#64748B] font-Inter_Regular text-sm">
                Failed to load partners. Please try again.
              </Text>
            </View>
          )}

          {/* ── Empty ────────────────────────────────────────────────────── */}
          {!isLoading && !isError && partners.length === 0 && (
            <View className="items-center justify-center mt-10">
              <Text className="text-[#64748B] font-Inter_Regular text-sm">
                No partners available in this category.
              </Text>
            </View>
          )}

          {/* ── Partner Cards ─────────────────────────────────────────────── */}
          {!isLoading &&
            !isError &&
            partners.map((item, index) => (
              <PartnerCard key={item.id} item={item} index={index} />
            ))}

          <View className="h-40" />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Partnercategorie;

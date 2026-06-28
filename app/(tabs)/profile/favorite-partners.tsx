import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import FavoritePartnerSkeleton from "@/src/components/skeleton/FavoritePartnerSkeleton";
import { useGetFavoritePartnersQuery } from "@/src/redux/api-slices/profile/partners-api";
import { selectIsFavorite } from "@/src/redux/slices/favouritePartnerSlice";
import type { FavoritePartner } from "@/src/types/partners.types";
import { verticalScale } from "@/src/utils/Scaling";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const PartnerCard = ({
  partner,
  index,
}: {
  partner: FavoritePartner;
  index: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const isLove = useSelector((state: any) =>
    selectIsFavorite(state, partner.id),
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNavigate = () => {
    router.push({
      pathname: "/(tabs)/profile/fav-partner-details",
      params: {
        partnerId: partner.id,
        companyName: partner.companyName,
        category: partner.category,
        description: partner.description,
        phoneNumber: partner.phoneNumber,
        websiteUrl: partner.websiteUrl,
        isVerified: String(partner.isVerified),
      },
    });
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="mb-3"
    >
      <Pressable
        onPress={handleNavigate}
        className="bg-white rounded-2xl px-4 py-4"
        style={{
          shadowColor: "#06B6D4",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        {/* ── Top row: emoji + name + category + chevron ── */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-11 h-11 rounded-xl bg-slate-50 items-center justify-center mr-3">
              <Feather name="briefcase" size={20} color="#06B6D4" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text
                  className="text-base text-[#111827] font-Inter_Bold"
                  numberOfLines={1}
                >
                  {partner.companyName}
                </Text>
                {partner.isVerified && (
                  <Feather name="check-circle" size={14} color="#14B8A6" />
                )}
              </View>
              <View className="self-start bg-blue-50 rounded-full px-3 py-0.5">
                <Text
                  className="text-xs text-[#6B7280] font-Inter_Regular"
                  numberOfLines={1}
                >
                  {partner.category}
                </Text>
              </View>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color="#9CA3AF" />
        </View>

        {/* ── Contact info ── */}
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 mr-3" />
          <View className="gap-1.5">
            <View className="flex-row items-center gap-2">
              <Feather name="phone" size={14} color="#9CA3AF" />
              <Text className="text-sm text-gray-500 font-Inter_Regular">
                {partner.phoneNumber}
              </Text>
            </View>
            {partner.websiteUrl && (
              <View className="flex-row items-center gap-2">
                <Feather name="globe" size={14} color="#9CA3AF" />
                <Text
                  className="text-sm text-gray-500 font-Inter_Regular"
                  numberOfLines={1}
                >
                  {partner.websiteUrl}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const Favoritepartners = () => {
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  const { data, isLoading, isError } = useGetFavoritePartnersQuery();
  const partners = data?.data ?? [];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper paddingHorizontal={0}>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* ── Header ── */}
        <Animated.View
          style={{
            opacity: headerFade,
            transform: [{ translateY: headerSlide }],
          }}
          className="flex-row justify-between items-center pb-2 px-4"
        >
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-2xl text-[#111827] font-Inter_Bold">
            Favorite Partners
          </Text>
          <View />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: verticalScale(120),
            paddingTop: 8,
            paddingHorizontal: 16,
          }}
        >
          {/* ── Loading ── */}
          {isLoading && <FavoritePartnerSkeleton />}

          {/* ── Error ── */}
          {isError && (
            <View className="items-center justify-center mt-10">
              <Text className="text-[#64748B] font-Inter_Regular text-sm">
                Failed to load favorite partners. Please try again.
              </Text>
            </View>
          )}

          {/* ── Empty ── */}
          {!isLoading && !isError && partners.length === 0 && (
            <View className="items-center justify-center mt-10">
              <Feather name="heart" size={40} color="#E2E8F0" />
              <Text className="text-[#64748B] font-Inter_Regular text-sm mt-3">
                No favorite partners yet.
              </Text>
            </View>
          )}

          {/* ── List ── */}
          {!isLoading &&
            !isError &&
            partners.map((partner, index) => (
              <PartnerCard key={partner.id} partner={partner} index={index} />
            ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Favoritepartners;

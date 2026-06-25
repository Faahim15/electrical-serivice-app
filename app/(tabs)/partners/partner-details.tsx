import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { useAddFavoritePartnerMutation } from "@/src/redux/api-slices/profile/partners-api";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const Partnerdetails = () => {
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(40)).current;
  const contactOpacity = useRef(new Animated.Value(0)).current;
  const contactSlide = useRef(new Animated.Value(40)).current;
  const reasonsOpacity = useRef(new Animated.Value(0)).current;
  const reasonsSlide = useRef(new Animated.Value(40)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsSlide = useRef(new Animated.Value(40)).current;

  const [isLove, setIsLove] = useState(false);

  // ── Params from PartnerCard ──────────────────────────────────────────────
  const {
    partnerId,
    companyName,
    category,
    description,
    phoneNumber,
    websiteUrl,
    isVerified,
  } = useLocalSearchParams<{
    partnerId: string;
    companyName: string;
    category: string;
    description: string;
    phoneNumber: string;
    websiteUrl: string;
    isVerified: string;
  }>();

  // ── API ──────────────────────────────────────────────────────────────────
  const [addFavorite, { isLoading: isAddingFavorite }] =
    useAddFavoritePartnerMutation();

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(100, [
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(cardSlide, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(contactOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(contactSlide, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(reasonsOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(reasonsSlide, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(buttonsOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(buttonsSlide, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWebsite = () => {
    if (!websiteUrl) return;
    const finalUrl =
      websiteUrl.startsWith("http://") || websiteUrl.startsWith("https://")
        ? websiteUrl
        : "https://" + websiteUrl;
    Linking.openURL(finalUrl);
  };

  const handleSavePartner = async () => {
    if (!partnerId) return;
    try {
      await addFavorite({ partnerId, isFavourite: !isLove }).unwrap();
      setIsLove((prev) => !prev);
      toast.success(
        isLove
          ? "Partner removed from favorites!"
          : "Partner saved to favorites!",
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save partner.");
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Animated.View
          style={{
            transform: [{ translateY: headerSlide }],
            opacity: headerOpacity,
          }}
          className="flex-row justify-between items-center pb-2 px-4 pt-2"
        >
          <Pressable onPress={() => router.back()} className="p-1">
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl text-[#111827] font-Inter_Bold">
            Partner Details
          </Text>
          <View className="w-8" />
        </Animated.View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* ── Partner Card ─────────────────────────────────────────────── */}
          <Animated.View
            style={{
              opacity: cardOpacity,
              transform: [{ translateY: cardSlide }],
            }}
            className="bg-white rounded-2xl p-4 mt-3 shadow-sm border border-gray-100"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
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
                  <Feather name="briefcase" size={20} color="white" />
                </LinearGradient>

                <View className="w-[70%]">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-Inter_Bold text-[#111827]">
                      {companyName}
                    </Text>
                    {isVerified === "true" && (
                      <AntDesign
                        name="check-circle"
                        size={14}
                        color="#14B8A6"
                      />
                    )}
                  </View>
                  <Text className="text-sm text-gray-500 font-Inter_Regular">
                    {category}
                  </Text>
                </View>
              </View>

              {/* ── Heart Toggle ── */}
              <Pressable
                onPress={handleSavePartner}
                disabled={isAddingFavorite}
                className="p-1"
              >
                {isLove ? (
                  <AntDesign name="heart" size={24} color="#991b1b" />
                ) : (
                  <Feather name="heart" size={22} color="#9CA3AF" />
                )}
              </Pressable>
            </View>

            {/* Description */}
            <Text className="text-sm text-gray-500 mt-3 font-Inter_Regular">
              {description}
            </Text>

            {/* Badge */}
            <View className="mt-3 bg-[#EFF6FF] rounded-xl px-3 py-2">
              <Text className="text-sm text-[#155DFC] font-Inter_Regular leading-5">
                Trusted partner verified by Four Elements Electric
              </Text>
            </View>
          </Animated.View>

          {/* ── Contact Information ──────────────────────────────────────── */}
          <Animated.View
            style={{
              opacity: contactOpacity,
              transform: [{ translateY: contactSlide }],
            }}
            className="bg-white rounded-2xl p-4 mt-3 shadow-sm border border-gray-100"
          >
            <Text className="text-base font-Inter_Bold text-[#111827] mb-3">
              Contact Information
            </Text>

            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-9 h-9 rounded-full bg-[#EFF6FF] items-center justify-center">
                <Feather name="phone" size={16} color="#155DFC" />
              </View>
              <View>
                <Text className="text-xs text-gray-400 font-Inter_Regular">
                  Phone
                </Text>
                <Text className="text-sm text-[#111827] font-Inter_SemiBold">
                  {phoneNumber}
                </Text>
              </View>
            </View>

            {websiteUrl && (
              <View>
                <View className="h-px bg-gray-100 mb-3" />
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-[#EFF6FF] items-center justify-center">
                    <Feather name="globe" size={16} color="#155DFC" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-gray-400 font-Inter_Regular">
                      Website
                    </Text>
                    <Text className="text-sm font-Inter_Regular text-[#0F172A] flex-shrink flex-wrap">
                      {websiteUrl}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>

          {/* ── Action Buttons ───────────────────────────────────────────── */}
          <Animated.View
            style={{
              opacity: buttonsOpacity,
              transform: [{ translateY: buttonsSlide }],
            }}
            className="mt-4 gap-3"
          >
            {/* Call */}
            <Pressable onPress={handleCall}>
              <LinearGradient
                colors={["#0EA5E9", "#14B8A6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 16 }}
                className="py-4 flex-row gap-2 items-center justify-center"
              >
                <Feather name="phone-call" size={18} color="white" />
                <Text className="text-white font-Inter_Bold text-base">
                  Call Now
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Visit Website */}
            {websiteUrl && (
              <Pressable
                onPress={handleWebsite}
                className="border border-gray-200 rounded-2xl py-4 flex-row items-center justify-center gap-2 bg-white"
              >
                <Feather name="globe" size={18} color="#374151" />
                <Text className="text-[#374151] font-Inter_SemiBold text-base">
                  Visit Website
                </Text>
              </Pressable>
            )}

            {/* Save Partner */}
            <Pressable
              onPress={handleSavePartner}
              disabled={isAddingFavorite}
              className="border border-gray-200 rounded-2xl py-4 flex-row items-center justify-center gap-2 bg-white"
              style={{ opacity: isAddingFavorite ? 0.6 : 1 }}
            >
              <Feather
                name="heart"
                size={18}
                color={isLove ? "#991b1b" : "#374151"}
              />
              <Text className="text-[#374151] font-Inter_SemiBold text-base">
                {isAddingFavorite
                  ? "Saving..."
                  : isLove
                    ? "Saved!"
                    : "Save Partner"}
              </Text>
            </Pressable>
          </Animated.View>

          <View className="h-40" />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Partnerdetails;

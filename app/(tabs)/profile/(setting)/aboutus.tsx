import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import AboutUsSkeleton from "@/src/components/skeleton/AboutUsSkeleton";
import { useGetAboutUsQuery } from "@/src/redux/api-slices/profile/about-api";
import Feather from "@expo/vector-icons/build/Feather";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Aboutus = () => {
  const { data, isLoading, isError, refetch } = useGetAboutUsQuery();
  const aboutContent = data?.data?.content ?? "";

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-16)).current;

  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const card4Anim = useRef(new Animated.Value(0)).current;

  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const makeSlide = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [22, 0],
        }),
      },
    ],
  });

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

    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        delay: 150,
        damping: 14,
        stiffness: 220,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 300,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(100, [
      Animated.timing(card1Anim, {
        toValue: 1,
        duration: 380,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(card2Anim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(card3Anim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(card4Anim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* ── Header ── */}
        <Animated.View
          style={{
            opacity: headerFade,
            transform: [{ translateY: headerSlide }],
          }}
          className="flex-row justify-between items-center pb-2"
        >
          <Pressable onPress={() => router.back()} className="">
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-2xl text-[#111827] font-Inter_Bold">
            About Us
          </Text>
          <View />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8, gap: 12 }}
        >
          {/* ── Loading ── */}
          {isLoading && <AboutUsSkeleton />}

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
            <>
              {/* ── Brand Card ── */}
              <Animated.View
                style={makeSlide(card1Anim)}
                className="bg-white rounded-2xl px-5 py-6 items-center"
              >
                <Animated.View
                  style={{
                    opacity: logoOpacity,
                    transform: [{ scale: logoScale }],
                  }}
                  className="w-20 h-20 rounded-2xl bg-teal-500 items-center justify-center mb-4"
                >
                  <Text className="text-white text-2xl font-Inter_Bold">
                    FE
                  </Text>
                </Animated.View>

                <Text className="text-xl text-[#111827] font-Inter_Bold mb-1 text-center">
                  Four Elements Electric
                </Text>
                <Text className="text-sm text-gray-400 font-Inter_Regular text-center">
                  Your trusted partner for all electrical services
                </Text>
              </Animated.View>

              {/* ── About Our Company ── */}
              <Animated.View
                style={makeSlide(card2Anim)}
                className="bg-white rounded-2xl px-5 py-5"
              >
                <Text className="text-base text-[#111827] font-Inter_Bold mb-3">
                  About Our Company
                </Text>
                <Text className="text-sm text-gray-500 font-Inter_Regular leading-5">
                  {aboutContent}
                </Text>
              </Animated.View>

              {/* ── App Information ── */}
              <Animated.View
                style={makeSlide(card3Anim)}
                className="bg-white rounded-2xl px-5 py-5"
              >
                <Text className="text-base text-[#111827] font-Inter_Bold mb-3">
                  App Information
                </Text>

                <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                  <Text className="text-sm text-gray-500 font-Inter_Regular">
                    Version
                  </Text>
                  <Text className="text-sm text-[#111827] font-Inter_SemiBold">
                    1.0.0
                  </Text>
                </View>

                <View className="flex-row justify-between items-center pt-2">
                  <Text className="text-sm text-gray-500 font-Inter_Regular">
                    Build
                  </Text>
                  <Text className="text-sm text-[#111827] font-Inter_SemiBold">
                    2026.04.06
                  </Text>
                </View>
              </Animated.View>

              {/* ── Contact Information ── */}
              <Animated.View
                style={makeSlide(card4Anim)}
                className="bg-white rounded-2xl px-5 py-5"
              >
                <Text className="text-base text-[#111827] font-Inter_Bold mb-3">
                  Contact Information
                </Text>
                <Text className="text-sm text-gray-500 font-Inter_Regular mb-1.5">
                  Email: theAteam@feecva.com
                </Text>
                <Text className="text-sm text-gray-500 font-Inter_Regular mb-1.5">
                  Phone: 540-623-7599
                </Text>
                <Text className="text-sm text-gray-500 font-Inter_Regular">
                  Website: www.feecva.com
                </Text>
              </Animated.View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Aboutus;

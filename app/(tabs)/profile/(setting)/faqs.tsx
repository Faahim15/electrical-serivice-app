import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import FAQSkeleton from "@/src/components/skeleton/FAQSkeleton";
import { useGetFAQsQuery } from "@/src/redux/api-slices/profile/faq-api";
import { FAQ } from "@/src/types/faq.types";
import Feather from "@expo/vector-icons/build/Feather";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQCard = ({ item, index }: { item: FAQ; index: number }) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const answerHeight = useRef(new Animated.Value(index === 0 ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 100,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
    ]).start();
  }, []);

  const toggle = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);
    Animated.spring(answerHeight, {
      toValue,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  };

  const maxHeight = answerHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  const opacity = answerHeight.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY }] }}
      className="mb-3"
    >
      <View
        className="bg-white rounded-2xl px-4 pt-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        {/* Question row */}
        <Pressable
          onPress={toggle}
          className="flex-row items-start justify-between pb-4"
        >
          <Text className="text-[15px] font-Inter_Bold text-[#111827] flex-1 mr-3 leading-[22px]">
            {item.question}
          </Text>
          {isOpen ? (
            <Feather name="minus" size={18} color="#06B6D4" />
          ) : (
            <Feather name="plus" size={18} color="#9CA3AF" />
          )}
        </Pressable>

        {/* Answer - animated */}
        <Animated.View style={{ maxHeight, opacity, overflow: "hidden" }}>
          <View className="pb-4">
            <Text className="text-[13px] text-[#6B7280] font-Inter_Regular leading-[20px]">
              {item.answer}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const Faqs = () => {
  const { data, isLoading, isError, refetch } = useGetFAQsQuery();
  const faqs = data?.data ?? [];

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* ── Header ── */}
        <View className="flex-row justify-between items-center pb-2">
          <Pressable onPress={() => router.back()} className="">
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-2xl text-[#111827] font-Inter_Bold">FAQS</Text>
          <View />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        >
          {/* ── Loading ── */}
          {isLoading && <FAQSkeleton />}

          {/* ── Error ── */}
          {isError && (
            <View className="items-center justify-center mt-16">
              <Feather name="alert-circle" size={48} color="#EF4444" />
              <Text className="text-base font-Inter_SemiBold text-gray-800 mt-3 mb-1">
                Failed to load FAQs
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

          {/* ── Empty ── */}
          {!isLoading && !isError && faqs.length === 0 && (
            <View className="items-center justify-center mt-16">
              <Feather name="help-circle" size={48} color="#9CA3AF" />
              <Text className="text-base font-Inter_SemiBold text-gray-700 mt-3">
                No FAQs Available
              </Text>
              <Text className="text-sm font-Inter_Regular text-gray-500 mt-1">
                Check back later for updates.
              </Text>
            </View>
          )}

          {/* ── FAQ List ── */}
          {!isLoading &&
            !isError &&
            faqs.map((item, index) => (
              <FAQCard key={item._id} item={item} index={index} />
            ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Faqs;

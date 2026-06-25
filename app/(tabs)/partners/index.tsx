import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import PartnerCategorySkeleton from "@/src/components/skeleton/PartnerCategorySkeleton";
import { useGetPartnerCategoriesQuery } from "@/src/redux/api-slices/profile/partners-api";
import type { PartnerCategory } from "@/src/types/partners.types";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CategoryCard = ({
  item,
  index,
}: {
  item: PartnerCategory;
  index: number;
}) => {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 450,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 60,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
    ]).start();
  }, []);

  const handleRoute = () => {
    router.push({
      pathname: "/(tabs)/partners/partner-categorie",
      params: {
        categoryId: item.id,
        categoryName: item.name,
        categoryDescription: item.description,
        partnerCount: String(item.partnerCount),
      },
    });
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        opacity: opacityAnim,
      }}
      className="mb-3"
    >
      <Pressable
        className="bg-white rounded-2xl px-4 py-4 flex-row items-center shadow-sm"
        style={{
          shadowColor: "#06B6D4",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}
        onPress={handleRoute}
      >
        <View className="flex-1 mr-2">
          <Text className="text-base font-Inter_Bold text-[#101828] leading-snug mb-0.5">
            {item.name}
          </Text>
          <Text className="text-sm font-Inter_Regular text-[#6A7282] leading-snug mb-1">
            {item.description}
          </Text>
          <Text className="text-sm font-Inter_Regular text-[#0092B8]">
            {item.partnerCount} partners available
          </Text>
        </View>

        <View className="w-6 h-6 items-center justify-center">
          <Entypo name="chevron-small-right" size={24} color="#99A1AF" />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const Partners = () => {
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  const { data, isLoading, isError } = useGetPartnerCategoriesQuery();
  const categories = data?.data?.filter((c) => c.isActive) ?? [];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1 mt-[2%]">
        <Animated.View
          style={{
            transform: [{ translateY: headerSlide }],
            opacity: headerOpacity,
          }}
          className="pb-4"
        >
          <Text className="text-2xl font-Inter_Bold text-[#0F172A]">
            Partners Categories
          </Text>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {isLoading && <PartnerCategorySkeleton />}

          {isError && (
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-[#64748B] font-Inter_Regular text-sm">
                Failed to load categories. Please try again.
              </Text>
            </View>
          )}

          {!isLoading &&
            !isError &&
            categories.map((item, index) => (
              <CategoryCard key={item.id} item={item} index={index} />
            ))}

          <View className="h-80" />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Partners;

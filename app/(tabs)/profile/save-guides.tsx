import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { useGetSavedGuidesQuery } from "@/src/redux/api-slices/home/home-api";
import Feather from "@expo/vector-icons/build/Feather";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Get icon for guide name ──────────────────────────────────────────────
const getIconForGuide = (name: string): any => {
  if (name === "Outlet Not Working") return "power";
  if (name === "Reset Circuit Breaker") return "git-branch";
  if (name === "Reset GFCI Outlets") return "shield";
  return "bookmark";
};

// ─── Get category color ────────────────────────────────────────────────────
const getCategoryColor = (name: string): string => {
  if (name.includes("Outlet")) return "#06B6D4";
  if (name.includes("Circuit") || name.includes("Breaker")) return "#10B981";
  if (name.includes("GFCI")) return "#8B5CF6";
  return "#06B6D4";
};

// ─── Get category name ─────────────────────────────────────────────────────
const getCategory = (name: string): string => {
  if (name.includes("Outlet")) return "Troubleshooting";
  if (name.includes("Circuit") || name.includes("Breaker"))
    return "Maintenance";
  if (name.includes("GFCI")) return "Safety";
  return "Guide";
};

// ─── Guide Card ──
const GuideCard = ({ item, index }: { item: any; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();
  };

  const handlePress = () => {
    router.push({
      pathname: "/(tabs)/profile/saved-guides-details",
      params: {
        guideId: item._id,
      },
    });
  };

  const iconName = getIconForGuide(item.name);
  const categoryColor = getCategoryColor(item.name);
  const categoryName = getCategory(item.name);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }, { scale: scaleAnim }],
      }}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        className="bg-white rounded-2xl px-4 py-4 mb-3 flex-row items-center justify-between"
        style={{
          shadowColor: "#000000bd",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        {/* Left: icon + text */}
        <View className="flex-row items-start flex-1">
          {/* Icon */}
          <View className="mr-3 mt-1">
            <Feather name={iconName} size={20} color="#93C5FD" />
          </View>

          {/* Text content */}
          <View className="flex-1">
            {/* Category badge */}
            <Text
              className="text-xs font-Inter_Medium mb-0.5"
              style={{ color: categoryColor }}
            >
              {categoryName}
            </Text>
            {/* Title */}
            <Text className="text-[15px] font-Inter_Bold text-[#111827] mb-0.5">
              {item.name}
            </Text>
            {/* Description - show first step or step count */}
            <Text className="text-[13px] text-[#6B7280] font-Inter_Regular leading-[18px]">
              {item.steps?.length || 0} steps • Saved{" "}
              {new Date(item.savedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// ── Skeleton Card ──
const SkeletonCard = ({ index }: { index: number }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: opacityAnim }}>
      <View
        className="bg-white rounded-2xl px-4 py-4 mb-3 flex-row items-center"
        style={{
          shadowColor: "#000000bd",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <View className="w-5 h-5 bg-gray-200 rounded mr-3" />
        <View className="flex-1">
          <View className="w-20 h-3 bg-gray-200 rounded-full mb-1.5" />
          <View className="w-3/4 h-5 bg-gray-200 rounded-full mb-1.5" />
          <View className="w-1/2 h-4 bg-gray-200 rounded-full" />
        </View>
      </View>
    </Animated.View>
  );
};

// ── Main Screen ──
const Saveguides = () => {
  const { data, isLoading, isError, refetch } = useGetSavedGuidesQuery({
    page: 1,
    limit: 20,
  });

  const guides = data?.data || [];

  // ─── Render Content ─────────────────────────────────────────────────────────
  const renderContent = () => {
    if (isLoading) {
      return (
        <View>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <SkeletonCard key={index} index={index} />
          ))}
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 items-center justify-center mt-10">
          <Feather name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-[#EF4444] font-Inter_SemiBold text-base mt-4">
            Failed to load saved guides
          </Text>
          <Text className="text-[#64748B] font-Inter_Regular text-sm text-center mt-2">
            Please check your connection and try again.
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-4 bg-[#0EA5E9] px-6 py-2 rounded-full"
          >
            <Text className="text-white font-Inter_SemiBold">Retry</Text>
          </Pressable>
        </View>
      );
    }

    if (guides.length === 0) {
      return (
        <View className="flex-1 items-center justify-center mt-20">
          <Feather name="bookmark" size={48} color="#CBD5E1" />
          <Text className="text-[#64748B] font-Inter_SemiBold text-base mt-4">
            No saved guides
          </Text>
          <Text className="text-[#64748B] font-Inter_Regular text-sm text-center mt-2">
            Save troubleshooting guides to{"\n"}access them quickly.
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/home/trobleshooting")}
            className="mt-4 bg-[#0EA5E9] px-6 py-2 rounded-full"
          >
            <Text className="text-white font-Inter_SemiBold">
              Browse Guides
            </Text>
          </Pressable>
        </View>
      );
    }

    return guides.map((item, index) => (
      <GuideCard key={item._id} item={item} index={index} />
    ));
  };

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* header */}
        <View className="flex-row justify-between items-center pb-2">
          <Pressable onPress={() => router.back()} className="">
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-2xl text-[#111827] font-Inter_Bold">
            Saved Guides
          </Text>
          <View />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        >
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Saveguides;

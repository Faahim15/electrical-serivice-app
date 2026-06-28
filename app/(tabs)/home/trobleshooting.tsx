import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { useGetGuidesQuery } from "@/src/redux/api-slices/home/home-api";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

// ─── Map guide names to Feather icons ──────────────────────────────────────
const getIconForGuide = (name: string): any => {
  // Exact match based on API response
  if (name === "Outlet Not Working") return "power";
  if (name === "Reset Circuit Breaker") return "git-branch";
  if (name === "Reset GFCI Outlets") return "shield";

  // Fallback
  return "help-circle";
};

// ─── Animated Troubleshooting Card ──
const TroubleshootingCard = ({ item, index }: { item: any; index: number }) => {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 480,
        delay: 200 + index * 110,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 480,
        delay: 200 + index * 110,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    router.push({
      pathname: "/(tabs)/home/troubleshooting-guides",
      params: {
        guideId: item._id,
      },
    });
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
      }}
      className="mb-3"
    >
      <Pressable onPress={handlePress}>
        <View
          className="bg-white rounded-2xl px-4 py-4 flex-row items-center gap-4"
          style={{
            shadowColor: "#06B6D4",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Icon with gradient background */}
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
            <Feather
              name={getIconForGuide(item.name)}
              size={20}
              color="white"
            />
          </LinearGradient>

          {/* Text */}
          <View className="flex-1">
            <Text className="text-base font-Inter_SemiBold text-[#1F2937] mb-0.5">
              {item.name}
            </Text>
            <Text className="text-sm font-Inter_Regular text-[#64748B] leading-5">
              {item.steps?.length || 0} steps • {item.isSaved ? "⭐ Saved" : ""}
            </Text>
          </View>

          {/* Chevron */}
          <Feather name="chevron-right" size={18} color="#CBD5E1" />
        </View>
      </Pressable>
    </Animated.View>
  );
};

// ── Skeleton Loading Card ──
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
    <Animated.View style={{ opacity: opacityAnim }} className="mb-3">
      <View
        className="bg-white rounded-2xl px-4 py-4 flex-row items-center gap-4"
        style={{
          shadowColor: "#06B6D4",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.07,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="w-11 h-11 rounded-xl bg-gray-200" />
        <View className="flex-1">
          <View className="w-3/4 h-5 bg-gray-200 rounded-full mb-2" />
          <View className="w-1/2 h-4 bg-gray-200 rounded-full" />
        </View>
        <View className="w-5 h-5 bg-gray-200 rounded-full" />
      </View>
    </Animated.View>
  );
};

// ── Error State ──
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <View className="flex-1 items-center justify-center mt-10 px-4">
    <Feather name="alert-circle" size={48} color="#EF4444" />
    <Text className="text-[#EF4444] font-Inter_SemiBold text-base mt-4">
      Failed to load guides
    </Text>
    <Text className="text-[#64748B] font-Inter_Regular text-sm text-center mt-2">
      Please check your connection and try again.
    </Text>
    <Pressable
      onPress={onRetry}
      className="mt-4 bg-[#0EA5E9] px-6 py-2 rounded-full"
    >
      <Text className="text-white font-Inter_SemiBold">Retry</Text>
    </Pressable>
  </View>
);

// ── Empty State ──
const EmptyState = () => (
  <View className="flex-1 items-center justify-center mt-10 px-4">
    <Feather name="file-text" size={48} color="#CBD5E1" />
    <Text className="text-[#64748B] font-Inter_SemiBold text-base mt-4">
      No guides available
    </Text>
    <Text className="text-[#64748B] font-Inter_Regular text-sm text-center mt-2">
      Check back later for troubleshooting guides.
    </Text>
  </View>
);

// ─── Main Troubleshooting Screen ──
const Trobleshooting = () => {
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const heroBannerSlide = useRef(new Animated.Value(20)).current;
  const heroBannerOpacity = useRef(new Animated.Value(0)).current;
  const safetySlide = useRef(new Animated.Value(30)).current;
  const safetyOpacity = useRef(new Animated.Value(0)).current;
  const footerSlide = useRef(new Animated.Value(30)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  // ─── API Hook ──────────────────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useGetGuidesQuery({
    page: 1,
    limit: 20,
  });

  const guides = data?.data || [];

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
      Animated.timing(safetySlide, {
        toValue: 0,
        duration: 480,
        delay: 260,
        useNativeDriver: true,
      }),
      Animated.timing(safetyOpacity, {
        toValue: 1,
        duration: 480,
        delay: 260,
        useNativeDriver: true,
      }),
      Animated.timing(footerSlide, {
        toValue: 0,
        duration: 480,
        delay: 200 + guides.length * 110 + 100,
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 480,
        delay: 200 + guides.length * 110 + 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [guides.length]);

  const handleRetry = () => {
    refetch();
    toast.info("Refreshing guides...");
  };

  // ─── Render Content ─────────────────────────────────────────────────────────
  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="px-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <SkeletonCard key={index} index={index} />
          ))}
        </View>
      );
    }

    if (isError) {
      return <ErrorState onRetry={handleRetry} />;
    }

    if (guides.length === 0) {
      return <EmptyState />;
    }

    return guides.map((item, index) => (
      <TroubleshootingCard key={item._id} item={item} index={index} />
    ));
  };

  return (
    <ScreenWrapper paddingHorizontal={0}>
      <SafeAreaView edges={["top"]} className="flex-1 mt-[4%] ">
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
            Troubleshooting
          </Text>
          <View />
        </Animated.View>

        {/* ── Main ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 16 }}
        >
          {/* ── Hero Banner ── */}
          <Animated.View
            style={{
              transform: [{ translateY: heroBannerSlide }],
              opacity: heroBannerOpacity,
            }}
            className="mt-3 mb-3"
          >
            <View
              className="bg-white rounded-2xl px-4 py-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Text className="text-base font-Inter_SemiBold text-[#1F2937] mb-1">
                Troubleshooting Guides
              </Text>
              <Text className="text-sm font-Inter_Regular text-[#64748B] leading-5">
                Step-by-step help for common electrical issues, with
                safety-first instructions.
              </Text>
            </View>
          </Animated.View>

          {/* ── Safety First Card ── */}
          <Animated.View
            style={{
              transform: [{ translateY: safetySlide }],
              opacity: safetyOpacity,
            }}
            className="mb-3"
          >
            <View
              className="bg-white rounded-2xl px-4 py-4"
              style={{
                borderWidth: 1.5,
                borderColor: "#F59E0B",
                shadowColor: "#F59E0B",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center gap-2 mb-1.5">
                <Feather name="alert-triangle" size={18} color="#F59E0B" />
                <Text className="text-base font-Inter_SemiBold text-[#1F2937]">
                  Safety First
                </Text>
              </View>
              <Text className="text-sm font-Inter_Regular text-[#64748B] leading-5 mb-3">
                Stop and call our trained professionals if you notice sparks,
                burning smells, heat, or visible damage.
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/home/safety-warning")}
              >
                <Text className="text-[13px] font-Inter_SemiBold text-[#F59E0B]">
                  View Safety Warning
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* ── Troubleshooting Cards ── */}
          {renderContent()}

          {/* ── Still Need Help Footer ── */}
          <Animated.View
            style={{
              transform: [{ translateY: footerSlide }],
              opacity: footerOpacity,
            }}
            className="mt-1"
          >
            <View
              className="bg-white rounded-2xl px-4 py-4"
              style={{
                shadowColor: "#06B6D4",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Text className="text-base font-Inter_SemiBold text-[#1F2937] mb-1">
                Still need help?
              </Text>
              <Text className="text-sm font-Inter_Regular text-[#64748B] leading-5 mb-4">
                Contact us or request service if your issue is not resolved.
              </Text>
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
            </View>
          </Animated.View>
          <View className="h-40" />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Trobleshooting;

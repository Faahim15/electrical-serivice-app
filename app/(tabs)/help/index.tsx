import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// ── Help categories data ──
interface HelpItem {
  id: string;
  icon: "zap" | "shield" | "star";
  title: string;
  description: string;
  route: Href;
}
const HELP_ITEMS: HelpItem[] = [
  {
    id: "1",
    icon: "zap",
    title: "Troubleshooting",
    description: "Step-by-step guides for common electrical issues",
    route: "/(tabs)/help/troubleshooting",
  },
  {
    id: "2",
    icon: "shield",
    title: "Safety & Maintenance",
    description: "Keep your home safe with regular maintenance",
    route: "/(tabs)/help/safety-maintenance",
  },
  {
    id: "3",
    icon: "star",
    title: "Elemental Harmony",
    description:
      "Maintenance Program memberships for your home electrical system, EV charger, and generator.",
    route: "https://www.fourelementselectric.com/elemental-harmony",
  },
];

// ── Animated Help Card ──
const HelpCard = ({
  item,
  index,
}: {
  item: (typeof HELP_ITEMS)[0];
  index: number;
}) => {
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

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
      }}
      className="mb-3"
    >
      <Pressable
        onPress={() => {
          const url = item.route as string;
          if (url.startsWith("http")) {
            Linking.openURL(url);
          } else {
            router.push(item.route as any);
          }
        }}
      >
        <View
          className="bg-white rounded-2xl px-2 py-4 flex-row items-center gap-4"
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
            <Feather name={item.icon} size={20} color="white" />
          </LinearGradient>

          {/* Text */}
          <View className="flex-1">
            <Text className="  text-base font-Inter_SemiBold text-[#0F172A] mb-0.5">
              {item.title}
            </Text>
            <Text className="text-sm font-Inter_Medium text-[#6B7280] leading-5">
              {item.description}
            </Text>
          </View>

          {/* Chevron */}
          <Feather name="chevron-right" size={18} color="#CBD5E1" />
        </View>
      </Pressable>
    </Animated.View>
  );
};

// ── Main Screen ──
const Help = () => {
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

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
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* ── Header (original, untouched) ── */}
        <Animated.View
          style={{
            transform: [{ translateY: headerSlide }],
            opacity: headerOpacity,
          }}
          className="pb-4"
        >
          <Text className="text-2xl font-Inter_Bold text-[#0F172A]">Help</Text>
        </Animated.View>

        {/* ── Help Cards ── */}
        {HELP_ITEMS.map((item, index) => (
          <HelpCard key={item.id} item={item} index={index} />
        ))}
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Help;

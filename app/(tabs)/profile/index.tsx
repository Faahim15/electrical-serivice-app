import {
  clockIcon,
  favoriteIcon,
  notesIcon,
  openbookIcon,
  settingsIcon,
} from "@/assets/iocns/icon";
import MenuRowProfile from "@/src/components/profile/MenuRowProfile";
import StatCardProfile from "@/src/components/profile/StatCardProfile";
import UserProfileCard from "@/src/components/profile/UserProfileCard";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { useGetProfileQuery } from "@/src/redux/api-slices/home/home-api";
import { Href } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ----------- Animated menu row --------------------------------
type MenuRowProps = {
  emoji: string;
  route: Href;
  title: string;
  subtitle: string;
  delay: number;
};

const menuItems: MenuRowProps[] = [
  {
    emoji: notesIcon,
    route: "/(tabs)/profile/profile-quotation",
    title: "My Quotes",
    subtitle: "View all quote requests",
    delay: 400,
  },
  {
    emoji: clockIcon,
    route: "/(tabs)/profile/my-reminder",
    title: "My Reminders",
    subtitle: "Manage maintenance alerts",
    delay: 480,
  },
  {
    emoji: openbookIcon,
    route: "/(tabs)/profile/save-guides",
    title: "Saved Guides",
    subtitle: "Bookmarked help articles",
    delay: 560,
  },
  {
    emoji: favoriteIcon,
    route: "/(tabs)/profile/favorite-partners",
    title: "Saved Partners",
    subtitle: "Your preferred contractors",
    delay: 640,
  },
  {
    emoji: settingsIcon,
    route: "/(tabs)/profile/settings",
    title: "Settings",
    subtitle: "App preferences",
    delay: 720,
  },
];

// --------- Main profile screen -------------------------------------
const Profile = () => {
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.93)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const { data } = useGetProfileQuery();
  const profile = data?.data;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        delay: 100,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        <Animated.View
          style={{
            transform: [{ translateY: headerSlide }],
            opacity: headerOpacity,
          }}
          className="pb-4"
        >
          <Text className="text-2xl font-Inter_Bold text-[#0F172A]">
            Profile
          </Text>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Profile card */}
          <UserProfileCard />
          <View className="mb-4" />

          {/* Stats row */}
          <View className="flex-row mb-4">
            <StatCardProfile
              value={profile?.Quotes ?? 0}
              label="Quotes"
              delay={250}
            />
            <StatCardProfile
              value={profile?.Reminder ?? 0}
              label="Reminders"
              delay={320}
            />
            <StatCardProfile
              value={profile?.savedPartner ?? 0}
              label="Saved"
              delay={390}
            />
          </View>

          {/* Menu items */}
          <View>
            {menuItems.map((item) => (
              <MenuRowProfile key={item.title} {...item} />
            ))}
          </View>

          {/* Footer */}
          <View className="items-center mt-6">
            <Text className="text-xs text-[#94A3B8] font-Inter_Regular">
              Four Elements Electric
            </Text>
            <Text className="text-xs text-[#94A3B8] font-Inter_Regular">
              Version 1.0.0
            </Text>
            <Text className="text-xs text-[#6B7280] font-Inter_Medium">
              Grounded in Excellence
            </Text>
          </View>
          <View className="h-40" />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Profile;

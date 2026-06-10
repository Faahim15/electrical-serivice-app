import { useGetProfileQuery } from "@/src/redux/api-slices/home/home-api";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const UserProfileCard = () => {
  const cardScale = useRef(new Animated.Value(0.88)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const { data } = useGetProfileQuery();
  const profile = data?.data;
  const initials = profile?.name ? getInitials(profile.name) : "";

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View
        style={{ transform: [{ scale: cardScale }], opacity: cardOpacity }}
        className=" w-full "
      >
        <LinearGradient
          colors={["#0EA5E9", "#14B8A6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 24,
            padding: 22,
            paddingBottom: 18,
            overflow: "hidden",
            shadowColor: "#0EA5E9",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.35,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Top circles */}
          <View className="absolute -right-7 -top-7 w-[120px] h-[120px] rounded-full bg-[#FFFFFF1A]" />
          <View className="absolute right-[30px] top-[38px] w-[72px] h-[72px] rounded-full bg-[#FFFFFF1A]" />

          {/* Bottom corner circles */}
          <View className="absolute -left-7 -bottom-7 w-[120px] h-[120px] rounded-full bg-[#FFFFFF1A]" />
          <View className="absolute left-[30px] bottom-[38px] w-[72px] h-[72px] rounded-full bg-[#FFFFFF1A]" />

          {/* ==============The main content of the card */}
          <View className="flex-row items-center mb-[18px]">
            <View className="w-[66px] h-[66px] bg-white rounded-[18px] items-center justify-center mr-4 shadow-md elevation-6">
              <Text className="text-[22px] font-extrabold text-[#0EA5E9] tracking-[1px]">
                {initials}
              </Text>
            </View>

            <View className="gap-[2px] flex-1 mr-2">
              <Text
                className="text-white text-[20px] font-Inter_Bold leading-[24px]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {profile?.name ?? ""}
              </Text>
              <Text
                className="text-[#FFFFFFE5] text-[13.5px] font-Inter_Medium"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {profile?.email ?? ""}
              </Text>
              <Text
                className="text-[#FFFFFFE5] text-[13.5px] font-Inter_Medium"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {profile?.phone ?? ""}
              </Text>
            </View>
          </View>

          {/* Edit Profile button */}
          <Pressable
            onPress={() => router.push("/(tabs)/profile/editprofile")}
            className="bg-white rounded-[18px] py-[13px] flex-row items-center justify-center gap-[9px]"
          >
            <Feather name="edit" size={18} color="#0ea5e9" />
            <Text className="text-sky-500 text-[15px] font-Inter_Bold">
              Edit Profile
            </Text>
          </Pressable>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

export default UserProfileCard;

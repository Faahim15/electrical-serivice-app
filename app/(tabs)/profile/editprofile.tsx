import ProfileEditForm from "@/src/components/profile/profileEdit/ProfileEditForm";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { useGetProfileQuery } from "@/src/redux/api-slices/home/home-api";
import { verticalScale } from "@/src/utils/Scaling";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const EditProfile = () => {
  const { data } = useGetProfileQuery();
  const profile = data?.data;
  const initials = profile?.name ? getInitials(profile.name) : "";

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* header */}
        <View className="flex-row justify-between items-center pb-2">
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-2xl text-[#111827] font-Inter_Bold">
            Edit Profile
          </Text>
          <View />
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: verticalScale(120) }}
          >
            <LinearGradient
              colors={["#0EA5E9", "#14B8A6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 15,
                borderRadius: 24,
                overflow: "hidden",
                shadowColor: "#0EA5E9",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.35,
                shadowRadius: 20,
                elevation: 10,
                marginTop: 20,
                marginBottom: 16,
              }}
            >
              <View className="flex-row items-center">
                <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center mr-4 shadow-md elevation-6">
                  <Text className="text-2xl font-extrabold text-[#0EA5E9] tracking-[1px]">
                    {initials}
                  </Text>
                </View>
                <View className="gap-1">
                  <Text className="text-white text-xl font-Inter_Bold leading-[24px]">
                    {profile?.name ?? ""}
                  </Text>
                  <Text className="text-[#FFFFFFE5] text-sm font-Inter_Medium">
                    Update your profile information
                  </Text>
                </View>
              </View>
            </LinearGradient>

            <ProfileEditForm />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default EditProfile;

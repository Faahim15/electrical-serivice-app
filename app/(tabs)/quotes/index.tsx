import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { setSelectedRouteCategory } from "@/src/redux/slices/categoryRouteSlice";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useDispatch } from "react-redux";

// Quick Actions এর জন্য টাইপ
interface QuickAction {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  iconColor: string;
  iconBg: string;
}

const quickActions: QuickAction[] = [
  {
    id: "1",
    icon: "time-outline",
    label: "Resume Draft Quote",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    id: "2",
    icon: "checkmark-circle-outline",
    label: "View Submitted Quotes",
    iconColor: "#10B981",
    iconBg: "#D1FAE5",
  },
  {
    id: "3",
    icon: "document-text-outline",
    label: "Explore Quote Categories",
    iconColor: "#0EA5E9",
    iconBg: "#E0F2FE",
  },
];

interface Category {
  id: string;
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const popularServices: Category[] = [
  {
    id: "1",
    title: "Service Call",
    description: "Quick electrical inspection.",
    iconName: "construct-outline",
    iconColor: "#14B8A6",
    iconBg: "#CCFBF1",
  },
  {
    id: "2",
    title: "EV Charger\n Installation",
    description: "EV charging station setup.",
    iconName: "flash-outline",
    iconColor: "#0EA5E9",
    iconBg: "#E0F2FE",
  },
  {
    id: "3",
    title: "Panel Upgrade\n/ Replacement",
    description: "Modernize electrical panel.",
    iconName: "cube-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    id: "9",
    title: "Generator\n Installation",
    description: "Backup power solutions.",
    iconName: "battery-charging-outline",
    iconColor: "#8B5CF6",
    iconBg: "#EDE9FE",
  },
];

export default function QuotesScreen() {
  const dispatch = useDispatch(); // হুকটি এখানে নিয়ে আসা হয়েছে

  const handleServicePress = (item: Category) => {
    dispatch(setSelectedRouteCategory(item));
    router.push("/(tabs)/quotes/quote/service-details");
  };

  return (
    <ScreenWrapper paddingHorizontal={0}>
      <View className="flex-1 bg-[#F0F6FF]">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="px-[4%] pt-[8%] pb-[4%]">
            <Text className="text-[#1E293B] text-[24px] font-Inter_Bold">
              Quotes
            </Text>
            <Text className="text-[#64748B] text-[13.5px] font-Inter_Regular mt-1">
              Request service and manage your quote requests
            </Text>
          </View>

          {/* New Quote Card */}
          <View className="mx-[4%] mb-[4%]">
            <View className="bg-white rounded-3xl px-[6%] py-[7%] items-center shadow-sm">
              <View className="w-[68px] h-[68px] rounded-full bg-[#E0F7F7] items-center justify-center mb-4">
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color="#0EA5E9"
                />
              </View>
              <Text className="text-[#1E293B] text-[18px] font-Inter_Bold mb-2">
                Start a new quote
              </Text>
              <Text className="text-[#64748B] text-[13px] font-Inter_Regular text-center mb-6">
                Choose a service and send us your request in just a few steps.
              </Text>
              <Pressable
                onPress={() =>
                  router.push("/(tabs)/quotes/quote/choose-category")
                }
                className="w-full rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={["#0EA5E9", "#14B8A6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ paddingVertical: 14, alignItems: "center" }}
                >
                  <Text className="text-white text-[15px] font-Inter_SemiBold">
                    New Quote
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* Quick Actions - Using .map instead of FlatList */}
          <View className="px-[4%] mb-[4%]">
            {quickActions.map((item) => (
              <View
                key={item.id}
                className="bg-white flex-row items-center px-[4%] py-[4%] mb-[2.5%] rounded-2xl shadow-sm"
              >
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: item.iconBg }}
                >
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <Text className="text-[#1E293B] text-sm font-Inter_Medium flex-1">
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Popular Services - Grid using .map */}
          <View className="px-[4%] mb-[4%]">
            <Text className="text-[#1E293B] text-[16px] font-Inter_Bold mb-3">
              Popular Services
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {popularServices.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleServicePress(item)}
                  className="bg-white rounded-2xl items-center justify-center py-[6%] shadow-sm"
                  style={{ width: "48%", marginBottom: 12 }}
                >
                  <View
                    className="w-11 h-11 rounded-xl items-center justify-center mb-3"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <Ionicons
                      name={item.iconName}
                      size={22}
                      color={item.iconColor}
                    />
                  </View>
                  <Text className="text-[#1E293B] text-[12.5px] font-Inter_Medium text-center">
                    {item.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Need Help Banner */}
          <View className="mx-[4%]">
            <View className="rounded-3xl px-[6%] py-[6%] bg-[#FFFBEB] border border-[#FDE68A]">
              <Text className="text-[#1E293B] text-[15px] font-Inter_Bold mb-1">
                Need help choosing?
              </Text>
              <Text className="text-[#64748B] text-[13px] font-Inter_Regular mb-4">
                Contact us and find the right option for your project
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/help/contact-details")}
                className="bg-white rounded-2xl py-[3.5%] items-center shadow-sm"
              >
                <Text className="text-[#1E293B] text-[13.5px] font-Inter_SemiBold">
                  Contact for Services
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

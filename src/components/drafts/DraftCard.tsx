import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { getResumeRoute } from "@/src/utils/draftRouting";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import moment from "moment";
import React from "react";
import { Animated, Pressable, Text, View } from "react-native";

interface DraftCardProps {
  id: string;
  serviceType: string;
  updatedAt?: string;
  completionPercentage?: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
  onDelete: (id: string, serviceType: string) => void;
}

const DraftCard = ({
  id,
  serviceType,
  updatedAt,
  completionPercentage = 0,
  opacity,
  translateY,
  onDelete,
}: DraftCardProps) => {
  const handleResume = () => {
    router.push({
      pathname: getResumeRoute(serviceType, completionPercentage) as any,
      params: {
        serviceCallId: id,
        serviceType,
      },
    });
  };

  console.log("serive", serviceType);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        backgroundColor: "white",
        borderRadius: 20,
        padding: 18,
        shadowColor: "#0EA5E9",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      {/* Title Row */}
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-[#0F172A] font-Inter_SemiBold text-base flex-1 pr-2">
          {serviceType}
        </Text>
        <Pressable onPress={() => onDelete(id, serviceType)} className="p-1">
          <Feather name="trash-2" size={18} color="#EF4444" />
        </Pressable>
      </View>

      {/* Last edited */}
      <Text className="text-[#64748B] font-Inter_Regular text-sm mb-3">
        Last edited {moment(updatedAt).format("MMMM D, YYYY")}
      </Text>

      {/* Progress label */}
      <Text
        className="text-[#64748B] font-Inter_Regular text-sm mb-1.5"
        style={{ fontFamily: "Inter_Regular" }}
      >
        {completionPercentage}% complete
      </Text>

      {/* Progress bar */}
      <View className="w-full h-2 bg-[#E2E8F0] rounded-full mb-4 overflow-hidden">
        <LinearGradient
          colors={["#0EA5E9", "#14B8A6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${completionPercentage}%`,
            height: 8,
            borderRadius: 999,
          }}
        />
      </View>

      <GradientButton label="Resume" onPress={handleResume} />
    </Animated.View>
  );
};

export default DraftCard;

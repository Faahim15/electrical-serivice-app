import { ActivityItem } from "@/src/types/tabs.home.types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

function capitalizeFirst(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function ActivityCard({ item }: { item: ActivityItem }) {
  return (
    <Pressable
      className="bg-white rounded-2xl px-4 py-3 mb-3 flex-row items-center border border-gray-100"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
      }}
      onPress={() =>
        router.push({
          pathname: item.route as any,
          params: {
            id: item.id,
            guideId: item.id,
            title: item.title,
            subtitle: item.subtitle,
            badge: item.badge ?? "",
            badgeColor: item.badgeColor ?? "",
            icon: item.icon,
            status: item.badge ?? "",
            type: item.type ?? "",
            iconColor: item.iconColor ?? "",
            iconBg: item.iconBg ?? "",
            qId: item.id,
            submitted: item.subtitle,
          },
        })
      }
    >
      {/* ── Icon ── */}
      <View className="w-9 h-9 rounded-full bg-[#E0F2FE] items-center justify-center mr-3 shrink-0">
        <Ionicons name={item.icon} size={18} color="#00ABB0" />
      </View>

      {/* ── Title + Subtitle ── */}
      <View className="flex-1 mr-2 min-w-0">
        <Text
          className="font-Inter_SemiBold text-sm text-gray-800"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
        <Text
          className="font-Inter_Regular text-xs text-gray-400 mt-0.5"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.subtitle}
        </Text>
      </View>

      {/* ── Badge ── */}
      {item.badge && (
        <View
          className="px-2 py-0.5 rounded-full mr-2 shrink-0"
          style={{
            backgroundColor: item.badgeColor
              ? item.badgeColor + "20"
              : "#6B728020",
          }}
        >
          <Text
            className="font-Inter_Medium text-xs"
            style={{ color: item.badgeColor ?? "#6B7280" }}
            numberOfLines={1}
          >
            {capitalizeFirst(item.badge)}
          </Text>
        </View>
      )}

      {/* ── Chevron ── */}
      <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
    </Pressable>
  );
}

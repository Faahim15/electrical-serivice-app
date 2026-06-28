import { GradientPressable } from "@/src/components/shared/GradientPressable";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import { useGetRecentActivityQuery } from "@/src/redux/api-slices/home/home-api";
import { RecentActivityItem } from "@/src/types/guides.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";

const TABS = ["All", "Quotes", "Reminders", "Guides"];

const GRADIENT_COLORS = [
  "#0EA5E9",
  "#0CA7E4",
  "#0AA8E0",
  "#09AADB",
  "#08ABD7",
  "#07ADD2",
  "#07AECD",
  "#08AFC9",
  "#08B1C4",
  "#0AB2BF",
  "#0BB3BA",
  "#0DB5B5",
  "#10B6B0",
  "#12B7AB",
  "#14B8A6",
] as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

function getIconForType(type: string): {
  icon: string;
  iconColor: string;
  iconBg: string;
} {
  switch (type) {
    case "guide":
      return { icon: "book-outline", iconColor: "#F59E0B", iconBg: "#FEF3C7" };
    case "reminder":
      return { icon: "alarm-outline", iconColor: "#8B5CF6", iconBg: "#F3F0FF" };
    default:
      return {
        icon: "document-text-outline",
        iconColor: "#3B82F6",
        iconBg: "#EFF6FF",
      };
  }
}

function getStatusStyle(status: string | null): { color: string; bg: string } {
  switch (status) {
    case "pending":
      return { color: "#F59E0B", bg: "#FEF3C7" };
    case "in_review":
      return { color: "#3B82F6", bg: "#EFF6FF" };
    case "send":
      return { color: "#10B981", bg: "#D1FAE5" };
    case "upcoming":
      return { color: "#8B5CF6", bg: "#F3F0FF" };
    default:
      return { color: "#6B7280", bg: "#F3F4F6" };
  }
}

function getStatusLabel(status: string | null): string {
  if (!status) return "";
  const map: Record<string, string> = {
    pending: "Pending",
    in_review: "In Review",
    send: "Sent",
    upcoming: "Upcoming",
  };
  return map[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
}

function getRouteForType(type: string): string {
  switch (type) {
    case "guide":
      return "/(tabs)/home/troubleshooting-guides";
    case "reminder":
      return "/(tabs)/home/maintenance-details";
    default:
      return "/(tabs)/home/details";
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "quote":
      return "Quote";
    case "reminder":
      return "Reminder";
    case "guide":
      return "Guide";
    default:
      return type;
  }
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function RecentActivitySkeleton() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          className="bg-white rounded-2xl px-4 py-4"
          style={{
            shadowColor: "#94A3B8",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center mb-3">
            <SkeletonElement
              width={40}
              height={40}
              style={{ borderRadius: 20, marginRight: 12 }}
            />
            <View className="flex-1 gap-y-2">
              <SkeletonElement width={80} height={11} />
              <SkeletonElement width={160} height={14} />
              <SkeletonElement width={110} height={11} />
            </View>
          </View>
          <SkeletonElement
            width="100%"
            height={38}
            style={{ borderRadius: 12 }}
          />
        </View>
      ))}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function RecentActivity() {
  const [activeTab, setActiveTab] = useState("All");
  const { data, isLoading, isError } = useGetRecentActivityQuery();

  const activities = data?.data ?? [];

  const filteredActivities = activities.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Quotes") return item.type === "quote";
    if (activeTab === "Reminders") return item.type === "reminder";
    if (activeTab === "Guides") return item.type === "guide";
    return true;
  });

  return (
    <ScreenWrapper paddingHorizontal={0}>
      <View className="flex-1">
        {/* ── Header ── */}
        <View className="px-[4%] pt-[10%] pb-[4%] bg-white">
          <Pressable onPress={() => router.back()} className="mb-3">
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </Pressable>
          <Text className="text-[#1E293B] text-[22px] font-Inter_Bold">
            Recent Activity
          </Text>
          <Text className="text-[#64748B] text-[13px] font-Inter_Regular mt-1">
            Pick up where you left off
          </Text>
        </View>

        {/* ── Tabs ── */}
        <View className="bg-white px-[4%] pb-3 border-b border-[#F1F5F9]">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {TABS.map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{ borderRadius: 999, overflow: "hidden" }}
                >
                  {activeTab === tab ? (
                    <LinearGradient
                      colors={GRADIENT_COLORS}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    >
                      <Text className="text-[13px] font-Inter_Medium text-white">
                        {tab}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        backgroundColor: "#F1F5F9",
                      }}
                    >
                      <Text className="text-[13px] font-Inter_Medium text-[#64748B]">
                        {tab}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* ── Loading ── */}
        {isLoading && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <RecentActivitySkeleton />
          </ScrollView>
        )}

        {/* ── Error ── */}
        {isError && !isLoading && (
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="text-red-500 font-Inter_Regular text-sm mt-3 text-center">
              Failed to load recent activity. Please try again.
            </Text>
          </View>
        )}

        {/* ── Empty ── */}
        {!isLoading && !isError && filteredActivities.length === 0 && (
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
            <Text className="text-[#94A3B8] font-Inter_Regular text-sm mt-3 text-center">
              No activity found for this category.
            </Text>
          </View>
        )}

        {/* ── List ── */}
        {!isLoading && !isError && filteredActivities.length > 0 && (
          <FlatList
            data={filteredActivities}
            keyExtractor={(item, index) => item.id ?? `${index}`}
            contentContainerStyle={{
              padding: 16,
              gap: 12,
              paddingBottom: verticalScale(120),
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }: { item: RecentActivityItem }) => {
              const { icon, iconColor, iconBg } = getIconForType(item.type);
              const { color: statusColor, bg: statusBg } = getStatusStyle(
                item.status,
              );
              const route = getRouteForType(item.type);
              const statusLabel = getStatusLabel(item.status);
              const typeLabel = getTypeLabel(item.type);

              return (
                <View
                  className="bg-white rounded-2xl px-4 py-4"
                  style={{
                    shadowColor: "#94A3B8",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row items-center mb-3">
                    {/* ── Icon ── */}
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: iconBg }}
                    >
                      <Ionicons
                        name={icon as any}
                        size={20}
                        color={iconColor}
                      />
                    </View>

                    {/* ── Title + Subtitle ── */}
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-[2px]">
                        <Text className="text-[#94A3B8] text-[11px] font-Inter_Medium">
                          {typeLabel}
                        </Text>
                        {item.status && (
                          <View
                            className="px-2 py-[2px] rounded-full"
                            style={{ backgroundColor: statusBg }}
                          >
                            <Text
                              className="text-[10.5px] font-Inter_SemiBold"
                              style={{ color: statusColor }}
                            >
                              {statusLabel}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        className="text-[#1E293B] text-[14px] font-Inter_SemiBold"
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text className="text-[#94A3B8] text-[12px] font-Inter_Regular mt-[2px]">
                        {item.timestamp}
                      </Text>
                    </View>
                  </View>

                  {/* ── View Details Button ── */}
                  <GradientPressable
                    label="View Details"
                    onPress={() =>
                      router.push({
                        pathname: route as any,
                        params: {
                          id: item.id ?? "",
                          guideId: item.id ?? "",
                          title: item.title,
                          subtitle: item.timestamp,
                          badge: statusLabel,
                          badgeColor: statusColor,
                          type: typeLabel,
                          icon,
                          iconColor,
                          iconBg,
                          qId: item.id ?? "",
                          submitted: item.timestamp,
                          status: item.status ?? "",
                        },
                      })
                    }
                  />
                </View>
              );
            }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

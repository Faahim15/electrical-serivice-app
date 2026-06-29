import ActivityCard from "@/src/components/home/AcitivityCard";
import SearchModal from "@/src/components/home/Modal/SearchModal";
import QuickActionCard from "@/src/components/home/QuickActionCard";
import QuickActionFullCard from "@/src/components/home/QuickActionFullCard";
import ElectricalHelpCard from "@/src/components/profile/ElectricalHelpCard";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import HomeScreenSkeleton from "@/src/components/skeleton/HomeScreenSkeleton";
import { quickActions } from "@/src/constants/tabs.home.constant";
import {
  useGetNotificationsQuery,
  useGetProfileQuery,
  useGetRecentActivityQuery,
} from "@/src/redux/api-slices/home/home-api";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}

function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function HomeScreen() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch: refetchProfile } = useGetProfileQuery();
  const {
    data: activityData,
    refetch: refetchActivity,
    isLoading: recentActivityLoader,
  } = useGetRecentActivityQuery();

  const {
    data: notificationData,
    isLoading: notificationLoader,
    refetch: refetchNotification,
  } = useGetNotificationsQuery({
    page: 1,
    limit: 100,
  });

  const unreadCount = notificationData?.meta?.unreadCount ?? 0;

  // ── Refetch notifications on screen focus ─────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      refetchNotification();
    }, [refetchNotification]),
  );

  const profile = data?.data;
  const firstName = profile?.name?.split(" ")[0] ?? "";
  const initials = profile?.name ? getInitials(profile.name) : "";

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchProfile(),
      refetchActivity(),
      refetchNotification(),
    ]);
    setRefreshing(false);
  }, [refetchProfile, refetchActivity, refetchNotification]);

  // ── Map API data → ActivityCard shape, first 4 only ──────────────────────
  type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

  const recentActivities = (activityData?.data ?? [])
    .slice(0, 4)
    .map((item) => {
      const icon: IoniconsName =
        item.type === "guide"
          ? "book-outline"
          : item.type === "reminder"
            ? "alarm-outline"
            : "document-text-outline";

      const iconColor =
        item.type === "guide"
          ? "#F59E0B"
          : item.type === "reminder"
            ? "#8B5CF6"
            : "#3B82F6";

      const iconBg =
        item.type === "guide"
          ? "#FEF3C7"
          : item.type === "reminder"
            ? "#F3F0FF"
            : "#EFF6FF";

      const badgeColor =
        item.status === "pending"
          ? "#F59E0B"
          : item.status === "in_review"
            ? "#3B82F6"
            : item.status === "send"
              ? "#10B981"
              : item.status === "upcoming"
                ? "#8B5CF6"
                : item.status === null
                  ? undefined
                  : "#6B7280";

      const route =
        item.type === "quote"
          ? "/(tabs)/home/details"
          : item.type === "reminder"
            ? "/(tabs)/home/maintenance-details"
            : "/(tabs)/home/troubleshooting-guides";

      return {
        id: item.id ?? item.title,
        icon,
        title: item.title,
        subtitle: item.timestamp,
        badge: item.status ?? undefined,
        badgeColor,
        route: route as any,
        type: item.type,
        iconColor,
        iconBg,
      };
    });

  if (isLoading || notificationLoader || recentActivityLoader) {
    return (
      <ScreenWrapper>
        <HomeScreenSkeleton />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00ABB0"
            colors={["#00ABB0"]}
          />
        }
      >
        <View className="pt-[14%]">
          {/* ── Top Bar ── */}
          <View className="flex-row items-center justify-between mb-1">
            <View>
              <Text className="font-Inter_Bold text-2xl text-gray-900">
                {getGreeting()}
              </Text>
              <Text className="font-Inter_Bold text-2xl text-gray-900">
                {firstName}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Pressable
                className="w-10 h-10 rounded-full bg-white items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                onPress={() => router.push("/(tabs)/home/notifications")}
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#374151"
                />

                {/* 🔴 Notification Badge */}
                {unreadCount > 0 && (
                  <View
                    className="absolute -top-1 -right-1 bg-red-500 rounded-full items-center justify-center"
                    style={{ minWidth: 16, height: 16, paddingHorizontal: 3 }}
                  >
                    <Text
                      className="font-Inter_Bold text-white"
                      style={{ fontSize: 9, lineHeight: 12 }}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={() => router.push("/(tabs)/profile/editprofile")}
              >
                <View className="w-10 h-10 rounded-full bg-[#00ABB0] items-center justify-center">
                  <Text className="font-Inter_Bold text-sm text-white">
                    {initials}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <Text className="font-Inter_Regular text-sm text-gray-400 mb-5">
            How can we help today?
          </Text>

          {/* ── Search Bar ── */}
          <Pressable
            onPress={() => setSearchVisible(true)}
            className="flex-row items-center border-2 border-[#E2E8F0] bg-white rounded-2xl px-4 mb-6"
            style={{
              height: 46,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <Text className="font-Inter_Regular text-sm text-gray-400 ml-2">
              Search services, activity, actions...
            </Text>
          </Pressable>

          {/* ── Hero Banner ── */}
          <ElectricalHelpCard />

          {/* ── Quick Actions ── */}
          <Text className="font-Inter_Bold text-base text-gray-900 mb-3">
            Quick Actions
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {quickActions.slice(0, 4).map((item) => (
              <QuickActionCard key={item.id} item={item} />
            ))}
          </View>

          {quickActions[4] && <QuickActionFullCard item={quickActions[4]} />}

          {/* ── Recent Activity ── */}
          <View className="flex-row items-center justify-between mb-3 mt-1">
            <Text className="font-Inter_Bold text-base text-gray-900">
              Recent Activity
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/home/recent-activity")}
            >
              <Text className="font-Inter_Medium text-sm text-[#00ABB0]">
                View All &rsaquo;
              </Text>
            </Pressable>
          </View>

          {recentActivities.map((item) => (
            <ActivityCard key={item.id} item={item} />
          ))}

          {/* ── Emergency Banner ── */}
          <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-2">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
                <Ionicons name="warning-outline" size={16} color="#EF4444" />
              </View>
              <Text className="font-Inter_SemiBold text-sm text-gray-800">
                Power issue or urgent{"\n"}concern?
              </Text>
            </View>
            <Text className="font-Inter_Regular text-xs text-gray-500 mb-4 ml-11">
              Get immediate help from our team.{"\n"}If you're dealing with an
              electrical emergency.
            </Text>
            <View className="flex-row items-center gap-3 ml-11">
              <Pressable
                className="bg-red-500 rounded-xl px-4 py-2.5"
                onPress={() => router.push("/(tabs)/help/contact-details")}
              >
                <Text className="font-Inter_SemiBold text-sm text-white">
                  Call Now
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/(tabs)/home/safety-warning")}
              >
                <Text className="font-Inter_Medium text-sm text-gray-600">
                  View Safety Tips
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Search Modal ── */}
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
      />
    </ScreenWrapper>
  );
}

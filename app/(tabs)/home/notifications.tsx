import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import NotificationsSkeleton from "@/src/components/skeleton/Notificationsskeleton";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/src/redux/api-slices/home/home-api";
import { Notification } from "@/src/types/notification.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { toast } from "sonner-native";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const handleNotificationPress = (item: Notification) => {
  if (item.type === "QUOTE_SUBMITTED" || item.type === "STATUS_CHANGED") {
    router.push({
      pathname: "/(tabs)/home/details",
      params: {
        id: item.serviceId,
        qId: item.qId,
        status: item.status,
        type: item.serviceType,
      },
    });
  } else if (item.type === "MAINTENANCE_REMINDER") {
    router.push({
      pathname: "/(tabs)/home/maintenance-details",
      params: { title: item.title },
    });
  }
};

// ─── Notification Card ────────────────────────────────────────────────────────

function NotificationCard({
  item,
  onPress,
}: {
  item: Notification;
  onPress: (id: string) => void;
}) {
  return (
    <Pressable
      onPress={() => {
        onPress(item._id);
        handleNotificationPress(item);
      }}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        shadowColor: "#94A3B8",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
        borderLeftWidth: !item.isRead ? 3 : 0,
        borderLeftColor: !item.isRead ? "#0EA5E9" : "transparent",
      }}
    >
      <View style={{ flex: 1 }}>
        {/* Title row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <Text
            className="text-[#1E293B] text-[13.5px] font-Inter_SemiBold flex-1"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {/* Unread dot */}
          {!item.isRead && (
            <View
              className="w-2 h-2 rounded-full mt-[5px]"
              style={{ backgroundColor: "#0EA5E9" }}
            />
          )}
        </View>

        {/* Body */}
        <Text
          className="text-[#64748B] text-[12.5px] font-Inter_Regular leading-[18px]"
          numberOfLines={3}
        >
          {item.message}
        </Text>

        {/* Footer */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Text className="text-[#94A3B8] text-[11.5px] font-Inter_Regular">
            {formatTime(item.createdAt)}
          </Text>
          <View
            className="px-2 py-[3px] rounded-full"
            style={{ backgroundColor: "#EFF6FF" }}
          >
            <Text
              className="text-[10.5px] font-Inter_SemiBold"
              style={{ color: "#0EA5E9" }}
            >
              {item.serviceType}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View className="items-center justify-center pt-20 gap-3">
      <View className="w-16 h-16 rounded-full bg-sky-50 items-center justify-center mb-1">
        <Ionicons name="notifications-off-outline" size={28} color="#0EA5E9" />
      </View>
      <Text className="text-base font-Inter_SemiBold text-gray-700">
        No Notifications
      </Text>
      <Text className="text-[13px] font-Inter_Regular text-gray-400 text-center max-w-[220px]">
        You're all caught up. We'll notify you when something new arrives.
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function Notifications() {
  const { data, isLoading, isError } = useGetNotificationsQuery({
    page: 1,
    limit: 100,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const notifications = data?.data ?? [];
  const hasUnread = notifications.some((n) => !n.isRead);

  const handleMarkAsRead = async (id: string) => {
    const notification = notifications.find((n) => n._id === id);
    if (!notification || notification.isRead) return;
    try {
      await markAsRead(id).unwrap();
    } catch {
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleMarkAllRead = async () => {
    if (!hasUnread) return;
    try {
      await markAllAsRead().unwrap();
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to mark all as read. Please try again.");
    }
  };

  return (
    <ScreenWrapper paddingHorizontal={0}>
      <View className="flex-1 pt-[4%]">
        {/* Header */}
        <View className="bg-white px-[4%] pt-[4%] pb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="#1E293B" />
              </Pressable>
              <Text className="text-[#1E293B] text-[20px] font-Inter_Bold">
                Notifications
              </Text>
            </View>
            {hasUnread && (
              <Pressable onPress={handleMarkAllRead}>
                <Text className="text-[#0EA5E9] text-[13px] font-Inter_Medium">
                  Mark all read
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <NotificationsSkeleton />
        ) : isError ? (
          <View className="items-center justify-center pt-20 gap-3">
            <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-1">
              <Ionicons name="alert-circle-outline" size={28} color="#EF4444" />
            </View>
            <Text className="text-base font-Inter_SemiBold text-gray-700">
              Something went wrong
            </Text>
            <Text className="text-[13px] font-Inter_Regular text-gray-400 text-center max-w-[220px]">
              Failed to load notifications. Please try again.
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 16,
              gap: 10,
              paddingBottom: verticalScale(200),
            }}
            ListEmptyComponent={<EmptyState />}
            renderItem={({ item }) => (
              <NotificationCard item={item} onPress={handleMarkAsRead} />
            )}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

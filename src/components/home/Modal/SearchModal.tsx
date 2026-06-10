import {
  quickActions,
  recentActivity,
  SERVICE_CATEGORIES,
} from "@/src/constants/tabs.home.constant";
import { setSelectedRouteCategory } from "@/src/redux/slices/categoryRouteSlice";
import {
  ActivityItem,
  QuickAction,
  ServiceCategory,
} from "@/src/types/tabs.home.types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import ScreenWrapper from "../../shared/ScreenWrapper";
type SearchResultItem =
  | { type: "service"; data: ServiceCategory }
  | { type: "activity"; data: ActivityItem }
  | { type: "action"; data: QuickAction };
const OTHER_IDS = ["13", "14", "15", "16", "17", "18", "19", "20"];
export default function SearchModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const getResults = (): SearchResultItem[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const services: SearchResultItem[] = SERVICE_CATEGORIES.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    ).map((data) => ({ type: "service", data }));

    const activities: SearchResultItem[] = recentActivity
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q),
      )
      .map((data) => ({ type: "activity", data }));

    const actions: SearchResultItem[] = quickActions
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q),
      )
      .map((data) => ({ type: "action", data }));

    return [...services, ...activities, ...actions];
  };

  const results = getResults();

  const handleSelectService = (item: ServiceCategory) => {
    dispatch(setSelectedRouteCategory(item));
    onClose();
    setQuery("");
    const isOther = OTHER_IDS.includes(item.id);
    if (isOther) {
      router.push("/(page)/(quote)/(othercustom)/other-form-progress" as any);
    } else if (item.title === "Solar Installation") {
      router.push("/sollar-installation" as any);
    } else {
      router.push("/quote/service-details" as any);
    }
  };

  const handleSelectAction = (item: QuickAction) => {
    onClose();
    setQuery("");
    const url = item.route as string;
    if (url.startsWith("http")) {
      Linking.openURL(url);
    } else {
      router.push(item.route);
    }
  };

  const handleSelectActivity = (item: ActivityItem) => {
    onClose();
    setQuery("");
    router.push({
      pathname: "/recent-activity/details",
      params: {
        id: item.id,
        icon: item.icon,
        title: item.title,
        subtitle: item.subtitle,
        badge: item.badge ?? "",
        badgeColor: item.badgeColor ?? "",
      },
    });
  };

  const handleClose = () => {
    onClose();
    setQuery("");
  };

  const SUGGESTION_TAGS = [
    "EV Charger",
    "Panel Upgrade",
    "Lighting",
    "Outlets",
    "Starlink",
  ];

  const renderItem = ({ item }: { item: SearchResultItem }) => {
    // ── Service ──
    if (item.type === "service") {
      const s = item.data;
      return (
        <Pressable
          onPress={() => handleSelectService(s)}
          className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-3"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View
            className="w-11 h-11 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: s.iconBg }}
          >
            <Ionicons name={s.iconName} size={20} color={s.iconColor} />
          </View>
          <View className="flex-1">
            {/* FIXED: flex-wrap prevents badge overlap on narrow screens */}
            <View className="flex-row flex-wrap items-center gap-2 mb-0.5">
              <Text className="font-Inter_SemiBold text-sm text-gray-900">
                {s.title}
              </Text>
              <View className="bg-[#E0F2FE] px-2 py-0.5 rounded-full">
                <Text className="font-Inter_Medium text-[10px] text-[#00ABB0]">
                  Service
                </Text>
              </View>
            </View>
            <Text
              className="font-Inter_Regular text-xs text-gray-400"
              numberOfLines={1}
            >
              {s.description}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
        </Pressable>
      );
    }

    // ── Activity ──
    if (item.type === "activity") {
      const a = item.data;
      return (
        <Pressable
          onPress={() => handleSelectActivity(a)}
          className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-3"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="w-11 h-11 rounded-full bg-[#E0F2FE] items-center justify-center mr-3">
            <Ionicons name={a.icon} size={20} color="#00ABB0" />
          </View>
          <View className="flex-1">
            {/*  FIXED: flex-wrap prevents "Activity" badge + status badge overlap */}
            <View className="flex-row flex-wrap items-center gap-2 mb-0.5">
              <Text className="font-Inter_SemiBold text-sm text-gray-900">
                {a.title}
              </Text>
              <View className="bg-purple-100 px-2 py-0.5 rounded-full">
                <Text className="font-Inter_Medium text-[10px] text-purple-500">
                  Activity
                </Text>
              </View>
              {/* Status badge moved inside title row so it wraps correctly */}
              {a.badge && (
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: a.badgeColor + "20" }}
                >
                  <Text
                    className="font-Inter_Medium text-[10px]"
                    style={{ color: a.badgeColor }}
                  >
                    {a.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text
              className="font-Inter_Regular text-xs text-gray-400"
              numberOfLines={1}
            >
              {a.subtitle}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
        </Pressable>
      );
    }

    // ── Quick Action ──
    if (item.type === "action") {
      const ac = item.data;
      return (
        <Pressable
          onPress={() => handleSelectAction(ac)}
          className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-3"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="w-11 h-11 rounded-full bg-[#E0F2FE] items-center justify-center mr-3">
            <Ionicons name={ac.icon} size={20} color="#00ABB0" />
          </View>
          <View className="flex-1">
            {/*  FIXED: flex-wrap prevents badge overflow on narrow screens */}
            <View className="flex-row flex-wrap items-center gap-2 mb-0.5">
              <Text className="font-Inter_SemiBold text-sm text-gray-900">
                {ac.title}
              </Text>
              <View className="bg-orange-100 px-2 py-0.5 rounded-full">
                <Text className="font-Inter_Medium text-[10px] text-orange-500">
                  Quick Action
                </Text>
              </View>
            </View>
            <Text
              className="font-Inter_Regular text-xs text-gray-400"
              numberOfLines={1}
            >
              {ac.subtitle}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
        </Pressable>
      );
    }

    return null;
  };

  return (
    <>
      <ScreenWrapper paddingHorizontal={0}>
        <Modal
          visible={visible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleClose}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#fff" }}
          >
            {/* ── Header ── */}
            <View
              style={{
                paddingTop: Platform.OS === "ios" ? 20 : 40,
                paddingHorizontal: 20,
                paddingBottom: 12,
                backgroundColor: "#fff",
                borderBottomWidth: 1,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="flex-1 flex-row border-2 border-[#E2E8F0] items-center bg-white rounded-2xl px-4"
                  style={{ height: 46 }}
                >
                  <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    autoFocus
                    className="flex-1 font-Inter_Regular bg-white text-sm text-gray-800 ml-2"
                    placeholder="Search services, activity, actions..."
                    placeholderTextColor="#9CA3AF"
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                  />
                  {query.length > 0 && (
                    <Pressable onPress={() => setQuery("")}>
                      <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </Pressable>
                  )}
                </View>
                <Pressable onPress={handleClose}>
                  <Text className="font-Inter_Medium text-sm text-[#00ABB0]">
                    Cancel
                  </Text>
                </Pressable>
              </View>

              {query.trim().length > 0 && (
                <Text className="font-Inter_Regular text-xs text-gray-400 mt-3">
                  {results.length} result{results.length !== 1 ? "s" : ""} for "
                  {query}"
                </Text>
              )}
            </View>

            {/* ── Body ── */}
            {query.trim().length === 0 ? (
              // ── Default state ──
              <View className="items-center justify-center mt-24 px-8">
                <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                  <Ionicons name="search-outline" size={28} color="#9CA3AF" />
                </View>
                <Text className="font-Inter_SemiBold text-base text-gray-700 mb-1">
                  Search anything
                </Text>
                <Text className="font-Inter_Regular text-sm text-gray-400 text-center">
                  Find services, recent activity,{"\n"}or quick actions
                </Text>
                <View className="flex-row flex-wrap justify-center gap-2 mt-5">
                  {SUGGESTION_TAGS.map((tag) => (
                    <Pressable
                      key={tag}
                      onPress={() => setQuery(tag)}
                      className="bg-white border border-gray-200 rounded-full px-4 py-2"
                      style={{ elevation: 1 }}
                    >
                      <Text className="font-Inter_Medium text-xs text-gray-600">
                        {tag}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : (
              // ── Results ──
              <FlatList
                data={results}
                keyExtractor={(item, index) =>
                  `${item.type}-${item.data.id ?? index}`
                }
                contentContainerStyle={{ padding: 16 }}
                keyboardShouldPersistTaps="handled"
                renderItem={renderItem}
                ListEmptyComponent={
                  <View className="items-center justify-center mt-20">
                    <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                      <Ionicons
                        name="search-outline"
                        size={28}
                        color="#9CA3AF"
                      />
                    </View>
                    <Text className="font-Inter_SemiBold text-base text-gray-700 mb-1">
                      No results found
                    </Text>
                    <Text className="font-Inter_Regular text-sm text-gray-400 text-center">
                      Try searching for a different{"\n"}service or category
                    </Text>
                  </View>
                }
              />
            )}
          </KeyboardAvoidingView>
        </Modal>
      </ScreenWrapper>
    </>
  );
}

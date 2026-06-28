import SearchBar from "@/src/components/common/SearchBar";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import { useGetMyQuotesQuery } from "@/src/redux/api-slices/quote/my-quotes-api";
import {
  badgeColorMap,
  FILTER_TABS,
  FilterTab,
  Quote,
  statusStyles,
} from "@/src/types/quotes.types";
import { scale, verticalScale } from "@/src/utils/Scaling";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

// ── Icon map per quote title keyword ───────────────────────────────────────

const TITLE_ICON_MAP: {
  keyword: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}[] = [
  {
    keyword: "ev charger",
    icon: "flash-outline",
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
  {
    keyword: "panel",
    icon: "hardware-chip-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "service call",
    icon: "construct-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    keyword: "circuit",
    icon: "git-branch-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "smoke",
    icon: "alert-circle-outline",
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
  },
  {
    keyword: "lighting",
    icon: "bulb-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    keyword: "outlet",
    icon: "power-outline",
    iconColor: "#10B981",
    iconBg: "#D1FAE5",
  },
  {
    keyword: "ceiling fan",
    icon: "sync-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "switches",
    icon: "toggle-outline",
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
  {
    keyword: "dedicated circuit",
    icon: "git-branch-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "electric system",
    icon: "hardware-chip-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "dock power",
    icon: "boat-outline",
    iconColor: "#0EA5E9",
    iconBg: "#E0F2FE",
  },
  {
    keyword: "hot tub",
    icon: "water-outline",
    iconColor: "#0EA5E9",
    iconBg: "#E0F2FE",
  },
  {
    keyword: "accessory building",
    icon: "business-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    keyword: "remodeling",
    icon: "hammer-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    keyword: "panel upgrade",
    icon: "hardware-chip-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "generator",
    icon: "flash-outline",
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
  },
  {
    keyword: "new construction",
    icon: "build-outline",
    iconColor: "#10B981",
    iconBg: "#D1FAE5",
  },
  {
    keyword: "starlink",
    icon: "wifi-outline",
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
  {
    keyword: "surge protection",
    icon: "shield-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "exhaust fan",
    icon: "repeat-outline",
    iconColor: "#0EA5E9",
    iconBg: "#E0F2FE",
  },
];

const DEFAULT_ICON_META = {
  icon: "document-text-outline",
  iconColor: "#3B82F6",
  iconBg: "#EFF6FF",
};

function getIconMeta(serviceType: string) {
  const lower = serviceType.toLowerCase();
  return (
    TITLE_ICON_MAP.find((m) => lower.includes(m.keyword)) ?? DEFAULT_ICON_META
  );
}

// ── Skeleton Card ──────────────────────────────────────────────────────────

const SkeletonQuoteCard = () => (
  <View className="bg-white mb-3 rounded-2xl px-[5%] py-4">
    <View className="flex-row items-start justify-between">
      <View className="flex-1 pr-2">
        <SkeletonElement width={200} height={20} style={{ marginBottom: 8 }} />
        <SkeletonElement width={150} height={14} style={{ marginBottom: 12 }} />
        <SkeletonElement width={180} height={14} style={{ marginBottom: 12 }} />
        <View className="flex-row items-center justify-between">
          <SkeletonElement
            width={80}
            height={28}
            style={{ borderRadius: 20 }}
          />
          <SkeletonElement width={60} height={14} />
        </View>
      </View>
      <SkeletonElement width={18} height={18} />
    </View>
  </View>
);

// ── QuoteCard ──────────────────────────────────────────────────────────────

const QuoteCard = ({ item }: { item: Quote }) => {
  const style = statusStyles[item.status];
  const iconMeta = getIconMeta(item.serviceType);

  return (
    <Pressable
      className="bg-white mb-3 rounded-2xl px-[5%] py-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/home/details",
          params: {
            id: item.id,
            title: item.serviceType,
            subtitle: item.additionalNotes || "No additional notes",
            badge: style.label,
            badgeColor: badgeColorMap[item.status],
            type: "Quote",
            icon: iconMeta.icon,
            iconColor: iconMeta.iconColor,
            iconBg: iconMeta.iconBg,
            qId: item.qId,
            submitted: item.Submitted,
            status: item.status,
          },
        })
      }
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <Text className="font-Inter_Bold text-lg text-[#0F172A] mb-0.5">
            {item.serviceType}
          </Text>
          <Text className="font-Inter_Medium text-sm text-[#64748B] mb-2">
            Submitted {item.Submitted}
          </Text>
          {item.additionalNotes ? (
            <Text className="font-Inter_Medium text-sm text-[#475569] mb-3">
              {item.additionalNotes}
            </Text>
          ) : null}
          <View className="flex-row items-center justify-between">
            <View className={`${style.bg} px-3 py-1 rounded-full self-start`}>
              <Text className={`${style.text} font-Inter_Medium text-[12px]`}>
                {style.label}
              </Text>
            </View>
            <Text className="font-Inter_Regular text-xs text-[#94A3B8]">
              {item.qId}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
      </View>
    </Pressable>
  );
};

// ── Screen ─────────────────────────────────────────────────────────────────

export default function MyQuotesScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [searchText, setSearchText] = useState("");
  const { width } = useWindowDimensions();
  const isSmall = width < 360;

  const { data, isLoading, isError, error } = useGetMyQuotesQuery();

  const quotes = data?.data || [];

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesFilter = activeFilter === "All" || q.status === activeFilter;
      const matchesSearch =
        q.serviceType.toLowerCase().includes(searchText.toLowerCase()) ||
        (q.additionalNotes?.toLowerCase() || "").includes(
          searchText.toLowerCase(),
        );
      return matchesFilter && matchesSearch;
    });
  }, [quotes, activeFilter, searchText]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => `skeleton-${item}`}
          renderItem={() => <SkeletonQuoteCard />}
          contentContainerStyle={{ paddingBottom: verticalScale(30) }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (isError) {
      return (
        <View className="items-center mt-16">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="font-Inter_Regular text-[14px] text-red-500 mt-3 text-center">
            Failed to load quotes. Please try again.
          </Text>
          <Pressable
            onPress={() => window.location.reload()}
            className="mt-4 bg-[#0EA5E9] px-6 py-2 rounded-full"
          >
            <Text className="text-white font-Inter_SemiBold">Retry</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredQuotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <QuoteCard item={item} />}
        contentContainerStyle={{ paddingBottom: verticalScale(130) }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center mt-16">
            <Ionicons name="document-text-outline" size={48} color="#C7C7CC" />
            <Text className="font-Inter_Regular text-[14px] text-gray-400 mt-3">
              No quotes found
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row gap-3 items-center pt-4 pb-2">
          <BackButton />
          <Text className="font-Inter_Bold text-xl text-[#0F172A]">
            My Quotes
          </Text>
        </View>

        {/* Subtitle */}
        <Text className="font-Inter_Regular text-base text-[#475569] mb-4">
          Track your submitted requests
        </Text>

        {/* Search Bar */}
        <SearchBar value={searchText} onChangeText={setSearchText} />

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, flexShrink: 0 }}
          contentContainerStyle={{
            paddingVertical: isSmall ? 5 : 7,
            gap: isSmall ? 6 : 8,
            alignItems: "center",
            flexGrow: 0,
          }}
          className="mb-4"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveFilter(tab)}
                style={[
                  {
                    paddingHorizontal: isSmall ? 12 : 16,
                    paddingVertical: isSmall ? 5 : 7,
                    borderRadius: 999,
                    backgroundColor: isActive ? "#0EA5E9" : "#FFFFFF",
                    borderWidth: scale(2),
                    borderColor: isActive ? "#0EA5E9" : "#E2E8F0",
                  },
                  !isActive && {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 2,
                    elevation: 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: isSmall ? 12 : 13,
                    color: isActive ? "#FFFFFF" : "#475569",
                  }}
                  className="font-Inter_SemiBold"
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Quotes List */}
        {renderContent()}
      </View>
    </ScreenWrapper>
  );
}

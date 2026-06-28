import { useSearchQuotesQuery } from "@/src/redux/api-slices/home/home-api";
import { badgeColorMap } from "@/src/types/quotes.types";
import { getIconMeta } from "@/src/utils/quoteIconUtils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
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
  | { type: "quote"; data: any }
  | { type: "partner"; data: any };

// ─── Get status color ──────────────────────────────────────────────────────
const getStatusColor = (status: string): string => {
  const s = status?.toLowerCase() || "";
  if (s === "pending") return "#F59E0B";
  if (s === "approved" || s === "completed") return "#22C55E";
  if (s === "rejected" || s === "cancelled") return "#EF4444";
  if (s === "in_progress" || s === "in progress") return "#3B82F6";
  return "#6B7280";
};

// ─── Get status label ──────────────────────────────────────────────────────
const getStatusLabel = (status: string): string => {
  const s = status?.toLowerCase() || "";
  if (s === "pending") return "Pending";
  if (s === "approved") return "Approved";
  if (s === "completed") return "Completed";
  if (s === "rejected") return "Rejected";
  if (s === "cancelled") return "Cancelled";
  if (s === "in_progress" || s === "in progress") return "In Progress";
  return status || "Unknown";
};

export default function SearchModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const dispatch = useDispatch();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Debounce search query ────────────────────────────────────────────────
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  // ─── API search for quotes and partners ────────────────────────────────────
  const { data: searchResults, isLoading: isSearching } = useSearchQuotesQuery(
    debouncedQuery,
    {
      skip: debouncedQuery.length < 2,
    },
  );

  // ─── Get results (only from API) ──────────────────────────────────────────
  const getResults = useCallback((): SearchResultItem[] => {
    if (debouncedQuery.length >= 2 && searchResults?.data?.length) {
      return searchResults.data
        .map((item: any) => {
          if (item.type === "quote") {
            return { type: "quote", data: item };
          } else if (item.type === "partner") {
            return { type: "partner", data: item };
          }
          return null;
        })
        .filter(Boolean) as SearchResultItem[];
    }
    return [];
  }, [debouncedQuery, searchResults]);

  const results = getResults();

  // ─── Handlers ──────────────────────────────────────────────────────────────

  // ─── Quote Selection ─────────────────────────────────────────────────────
  const handleSelectQuote = (quote: any) => {
    onClose();
    setQuery("");

    // Navigate to quote details - same as MyQuotesScreen
    router.push({
      pathname: "/(tabs)/home/details",
      params: {
        id: quote.id || quote._id,
        title: quote.serviceType || "Quote",
        subtitle: quote.additionalNotes || "No additional notes",
        badge: getStatusLabel(quote.status),
        badgeColor: badgeColorMap[quote.status] || "#6B7280",
        type: "Quote",
        qId: quote.qId || "Q-000",
        submitted: quote.submitted || "N/A",
        status: quote.status || "pending",
        icon: getIconMeta(quote.serviceType || "").icon,
        iconColor: getIconMeta(quote.serviceType || "").iconColor,
        iconBg: getIconMeta(quote.serviceType || "").iconBg,
      },
    });
  };

  // ─── Partner Selection ────────────────────────────────────────────────────
  const handleSelectPartner = (partner: any) => {
    onClose();
    setQuery("");

    // Navigate to partner details - same as Partnerdetails screen
    router.push({
      pathname: "/(tabs)/partners/partner-details",
      params: {
        partnerId: partner.id || partner._id,
        companyName: partner.companyName || "Partner",
        category: partner.category || "",
        description: partner.description || "",
        phoneNumber: partner.phoneNumber || "",
        websiteUrl: partner.websiteUrl || "",
        isVerified: String(partner.isVerified || false),
      },
    });
  };

  const handleClose = () => {
    onClose();
    setQuery("");
    setDebouncedQuery("");
  };

  const SUGGESTION_TAGS = [
    "EV Charger",
    "Panel Upgrade",
    "Lighting",
    "Outlets",
    "Starlink",
  ];

  // ─── Render item ───────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: SearchResultItem }) => {
    // ── Quote ──
    if (item.type === "quote") {
      const q = item.data;
      const serviceType = q.serviceType || "Service";
      const iconMeta = getIconMeta(serviceType);
      const statusColor = getStatusColor(q.status);
      const statusLabel = getStatusLabel(q.status);

      return (
        <Pressable
          onPress={() => handleSelectQuote(q)}
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
            style={{ backgroundColor: iconMeta.iconBg }}
          >
            <Ionicons
              name={iconMeta.icon as any}
              size={20}
              color={iconMeta.iconColor}
            />
          </View>
          <View className="flex-1">
            <View className="flex-row flex-wrap items-center gap-2 mb-0.5">
              <Text className="font-Inter_SemiBold text-sm text-gray-900">
                {serviceType}
              </Text>
              <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                <Text className="font-Inter_Medium text-[10px] text-blue-600">
                  Quote
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="font-Inter_Regular text-xs text-gray-400">
                {q.qId || "Q-000"}
              </Text>
              <View
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: statusColor + "20" }}
              >
                <Text
                  className="font-Inter_Medium text-[10px]"
                  style={{ color: statusColor }}
                >
                  {statusLabel}
                </Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
        </Pressable>
      );
    }

    // ── Partner ──
    if (item.type === "partner") {
      const p = item.data;
      return (
        <Pressable
          onPress={() => handleSelectPartner(p)}
          className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-3"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="w-11 h-11 rounded-full bg-[#FEF3E8] items-center justify-center mr-3">
            <Ionicons name="business-outline" size={20} color="#F5A623" />
          </View>
          <View className="flex-1">
            <View className="flex-row flex-wrap items-center gap-2 mb-0.5">
              <Text className="font-Inter_SemiBold text-sm text-gray-900">
                {p.companyName || "Partner"}
              </Text>
              <View className="bg-purple-100 px-2 py-0.5 rounded-full">
                <Text className="font-Inter_Medium text-[10px] text-purple-500">
                  Partner
                </Text>
              </View>
              {p.isVerified && (
                <View className="bg-green-100 px-2 py-0.5 rounded-full">
                  <Text className="font-Inter_Medium text-[10px] text-green-600">
                    ✓ Verified
                  </Text>
                </View>
              )}
            </View>
            <Text
              className="font-Inter_Regular text-xs text-gray-400"
              numberOfLines={1}
            >
              {p.category || ""} {p.description ? `• ${p.description}` : ""}
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
                    placeholder="Search quotes, partners..."
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
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="font-Inter_Regular text-xs text-gray-400">
                    {results.length} result{results.length !== 1 ? "s" : ""} for
                    "{query}"
                  </Text>
                  {isSearching && debouncedQuery.length >= 2 && (
                    <ActivityIndicator size="small" color="#00ABB0" />
                  )}
                </View>
              )}
            </View>

            {/* ── Body ── */}
            {query.trim().length === 0 ? (
              <View className="items-center justify-center mt-24 px-8">
                <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                  <Ionicons name="search-outline" size={28} color="#9CA3AF" />
                </View>
                <Text className="font-Inter_SemiBold text-base text-gray-700 mb-1">
                  Search anything
                </Text>
                <Text className="font-Inter_Regular text-sm text-gray-400 text-center">
                  Find quotes, partners, or{"\n"}search by service type
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
            ) : debouncedQuery.length < 2 ? (
              <View className="items-center justify-center mt-24 px-8">
                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                <Text className="font-Inter_SemiBold text-base text-gray-700 mt-4 mb-1">
                  Type at least 2 characters
                </Text>
                <Text className="font-Inter_Regular text-sm text-gray-400 text-center">
                  Start typing to search for quotes and partners
                </Text>
              </View>
            ) : isSearching ? (
              <View className="items-center justify-center mt-24">
                <ActivityIndicator size="large" color="#00ABB0" />
                <Text className="font-Inter_Regular text-sm text-gray-400 mt-4">
                  Searching...
                </Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(item, index) =>
                  `${item.type}-${item.data.id || item.data._id || index}`
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
                      Try searching for a different{"\n"}service, quote, or
                      partner
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

import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import { useGetQuoteDetailsQuery } from "@/src/redux/api-slices/quote/my-quotes-api";
import { scale, verticalScale } from "@/src/utils/Scaling";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { toast } from "sonner-native";

// ── Image Viewer Modal ───────────────────────────────────────────────────────

const ImageViewerModal = ({
  visible,
  uri,
  onClose,
}: {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
    statusBarTranslucent
  >
    <StatusBar backgroundColor="#000" barStyle="light-content" />
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Close button */}
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          top: 50,
          right: 20,
          zIndex: 10,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "rgba(255,255,255,0.15)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="close" size={22} color="#fff" />
      </Pressable>

      {/* Full-screen image */}
      {uri && (
        <Image
          source={{ uri }}
          style={{ flex: 1 }}
          contentFit="contain"
          transition={200}
        />
      )}
    </View>
  </Modal>
);

// ── Sub-components ──────────────────────────────────────────────────────────

const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) => (
  <View className="flex-row justify-between items-center py-[10px] border-b border-[#F1F5F9]">
    <View className="flex-row items-center flex-1 gap-2">
      {icon && <Ionicons name={icon as any} size={15} color="#94A3B8" />}
      <Text className="text-[#94A3B8] text-[12.5px] font-Inter_Regular">
        {label}
      </Text>
    </View>
    <Text
      className="text-[#1E293B] text-[12.5px] font-Inter_Medium flex-1"
      style={{ textAlign: "right" }}
    >
      {value}
    </Text>
  </View>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View className="py-[10px] border-b border-[#F1F5F9]">
    <Text className="text-[#94A3B8] text-[11.5px] font-Inter_Regular mb-[4px]">
      {label}
    </Text>
    <Text className="text-[#1E293B] text-[13px] font-Inter_Medium">
      {value || "—"}
    </Text>
  </View>
);

// ── Screen ──────────────────────────────────────────────────────────────────

export default function ActivityDetails() {
  const {
    id,
    title,
    subtitle,
    badge,
    badgeColor,
    type,
    icon,
    iconColor,
    iconBg,
    qId,
    submitted,
    status,
  } = useLocalSearchParams<{
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    badgeColor: string;
    type: string;
    icon: string;
    iconColor: string;
    iconBg: string;
    qId: string;
    submitted: string;
    status: string;
  }>();
  const badgeLabel = badge
    ? badge.charAt(0).toUpperCase() + badge.slice(1)
    : "";
  const {
    data: detailsData,
    isLoading,
    isError,
    error,
  } = useGetQuoteDetailsQuery(id);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  React.useEffect(() => {
    if (isError) {
      toast.error("Failed to load quote details. Please try again.");
    }
  }, [isError]);

  const details = detailsData?.data;

  const cardIcon = icon ?? "flash-outline";
  const cardIconColor = iconColor ?? "#3B82F6";
  const cardIconBg = iconBg ?? "#EFF6FF";
  const cardType = type ?? "Quote";
  const badgeBg = badgeColor ? badgeColor + "20" : "#F1F5F9";

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Pending",
      in_review: "In Review",
      send: "Sent",
      closed: "Closed",
    };
    return statusMap[status] || status;
  };

  const renderSkeleton = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: 16,
        gap: 12,
        paddingBottom: verticalScale(120),
      }}
    >
      <View className="bg-white rounded-2xl px-4 py-4">
        <SkeletonElement width={60} height={14} style={{ marginBottom: 12 }} />
        <View className="flex-row items-center gap-3 mb-1">
          <SkeletonElement
            width={40}
            height={40}
            style={{ borderRadius: 20 }}
          />
          <SkeletonElement width={200} height={24} />
        </View>
        <SkeletonElement width={180} height={14} style={{ marginBottom: 16 }} />
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="py-[10px] border-b border-[#F1F5F9]">
            <SkeletonElement
              width={100}
              height={12}
              style={{ marginBottom: 4 }}
            />
            <SkeletonElement width={150} height={14} />
          </View>
        ))}
      </View>
      <View className="bg-white rounded-2xl px-4 py-4">
        <SkeletonElement width={80} height={18} style={{ marginBottom: 12 }} />
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="py-[10px] border-b border-[#F1F5F9]">
            <SkeletonElement
              width={120}
              height={12}
              style={{ marginBottom: 4 }}
            />
            <SkeletonElement width={180} height={14} />
          </View>
        ))}
      </View>
      <View className="bg-white rounded-2xl px-4 py-4">
        <SkeletonElement width={120} height={18} style={{ marginBottom: 12 }} />
        {[1, 2, 3].map((i) => (
          <View key={i} className="flex-row items-start mb-3">
            <SkeletonElement
              width={20}
              height={20}
              style={{ borderRadius: 10, marginRight: 12 }}
            />
            <View className="flex-1">
              <SkeletonElement
                width={150}
                height={14}
                style={{ marginBottom: 4 }}
              />
              <SkeletonElement width={100} height={12} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  if (isLoading) {
    return (
      <ScreenWrapper paddingHorizontal={0}>
        <View className="flex-1">
          <View className="bg-white px-[4%] pt-[10%] pb-4">
            <SkeletonElement
              width={24}
              height={24}
              style={{ marginBottom: 12 }}
            />
            <View className="flex-row items-center justify-between">
              <SkeletonElement width={150} height={24} />
              <SkeletonElement
                width={80}
                height={28}
                style={{ borderRadius: 20 }}
              />
            </View>
            <SkeletonElement width={200} height={14} style={{ marginTop: 8 }} />
          </View>
          {renderSkeleton()}
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !details) {
    return (
      <ScreenWrapper paddingHorizontal={0}>
        <View className="flex-1">
          <View className="bg-white px-[4%] pt-[10%] pb-4">
            <Pressable onPress={() => router.back()} className="mb-3">
              <Ionicons name="arrow-back" size={22} color="#1E293B" />
            </Pressable>
            <View className="flex-row items-center justify-between">
              <Text className="text-[#1E293B] text-[20px] font-Inter_Bold flex-1">
                Activity Details
              </Text>
            </View>
          </View>
          <View className="items-center mt-16">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="font-Inter_Regular text-[14px] text-red-500 mt-3 text-center px-8">
              Failed to load quote details. Please try again.
            </Text>
            <Pressable
              onPress={() => router.back()}
              className="mt-4 bg-[#0EA5E9] px-6 py-2 rounded-full"
            >
              <Text className="text-white font-Inter_SemiBold">Go Back</Text>
            </Pressable>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  const updates = [
    {
      id: "1",
      icon: "checkmark-circle",
      iconColor: "#10B981",
      label: "Quote submitted",
      time: details.Submitted,
    },
    {
      id: "2",
      icon: "time-outline",
      iconColor: "#F59E0B",
      label: "Current status",
      time: getStatusLabel(status || details.Details.currentProgress || ""),
    },
    {
      id: "3",
      icon: "calendar-outline",
      iconColor: "#8B5CF6",
      label: "Last updated",
      time: details.LastUpdated,
    },
  ];

  const detailRows = [
    {
      label: "Service Requested",
      value: details.Details.ServiceRequested || "Not specified",
    },
    {
      label: "Property Type",
      value: details.Details.propertyType || "Not specified",
    },
    {
      label: "Current Progress",
      value: details.Details.currentProgress || "Not specified",
    },
    { label: "Notes", value: details.Details.notes || "No additional notes" },
  ];

  return (
    <ScreenWrapper paddingHorizontal={0}>
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-[4%] pt-[10%] pb-4">
          <Pressable onPress={() => router.back()} className="mb-3">
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </Pressable>
          <View className="flex-row items-center justify-between">
            <Text className="text-[#1E293B] text-[20px] font-Inter_Bold flex-1">
              Activity Details
            </Text>
            {badge ? (
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: badgeBg }}
              >
                <Text
                  className="text-[12px] font-Inter_SemiBold"
                  style={{ color: badgeColor }}
                >
                  {badgeLabel}
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="text-[#94A3B8] text-[12px] font-Inter_Regular mt-1">
            Review the full details for this item
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 16,
            gap: 12,
            paddingBottom: verticalScale(120),
          }}
        >
          {/* Main Card */}
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
            <Text className="text-[#94A3B8] text-[11px] font-Inter_Medium mb-2">
              {cardType}
            </Text>
            <View className="flex-row items-center gap-3 mb-1">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: cardIconBg }}
              >
                <Ionicons
                  name={cardIcon as any}
                  size={20}
                  color={cardIconColor}
                />
              </View>
              <Text className="text-[#1E293B] text-[18px] font-Inter_Bold flex-1">
                {details.ServiceType || title}
              </Text>
            </View>
            <Text className="text-[#94A3B8] text-[12px] font-Inter_Regular mb-4">
              {subtitle || details.Details.notes || "No additional notes"}
            </Text>
            <InfoRow
              label="Request ID"
              value={details.qId || qId || "—"}
              icon="document-text-outline"
            />
            <InfoRow
              label="Submitted"
              value={details.Submitted || submitted || "—"}
              icon="calendar-outline"
            />
            <InfoRow
              label="Last Updated"
              value={details.LastUpdated || "—"}
              icon="time-outline"
            />
            <InfoRow
              label="Service Type"
              value={details.ServiceType || title || "—"}
              icon="person-outline"
            />
          </View>

          {/* Details Card */}
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
            <Text className="text-[#1E293B] text-[15px] font-Inter_Bold mb-3">
              Details
            </Text>
            {detailRows.map((row) => (
              <DetailRow key={row.label} label={row.label} value={row.value} />
            ))}
          </View>

          {/* Recent Updates */}
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
            <Text className="text-[#1E293B] text-[15px] font-Inter_Bold mb-3">
              Recent Updates
            </Text>
            {updates.map((update, index) => (
              <View key={update.id} className="flex-row items-start mb-3">
                <View className="items-center mr-3">
                  <Ionicons
                    name={update.icon as any}
                    size={20}
                    color={update.iconColor}
                  />
                  {index < updates.length - 1 && (
                    <View
                      style={{
                        width: 1.5,
                        flex: 1,
                        marginTop: 4,
                        backgroundColor: "#E2E8F0",
                        minHeight: 20,
                      }}
                    />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-[#1E293B] text-[13px] font-Inter_SemiBold">
                    {update.label}
                  </Text>
                  <Text className="text-[#94A3B8] text-[11.5px] font-Inter_Regular mt-[2px]">
                    {update.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Attachments */}
          {details.UploadedPhotos.count > 0 && (
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
              <Text className="text-[#1E293B] text-[15px] font-Inter_Bold mb-3">
                Attachments ({details.UploadedPhotos.count})
              </Text>
              <FlatList
                data={details.UploadedPhotos.url}
                horizontal
                keyExtractor={(item, index) => `photo-${index}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => (
                  <Pressable onPress={() => setSelectedImage(item)}>
                    <Image
                      source={{ uri: item }}
                      style={{
                        width: scale(80),
                        height: verticalScale(80),
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#E2E8F0",
                      }}
                      contentFit="cover"
                      transition={200}
                    />
                  </Pressable>
                )}
              />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Full-screen image viewer */}
      <ImageViewerModal
        visible={selectedImage !== null}
        uri={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </ScreenWrapper>
  );
}

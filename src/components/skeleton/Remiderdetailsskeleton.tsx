import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import React from "react";
import { View } from "react-native";

const ReminderDetailsSkeleton = () => (
  <View style={{ gap: 12, marginTop: 12 }}>
    {/* Title Card */}
    <View className="bg-white rounded-2xl px-4 py-4">
      <SkeletonElement
        width="30%"
        height={10}
        style={{ borderRadius: 4, marginBottom: 8 }}
      />
      <SkeletonElement width="70%" height={16} style={{ borderRadius: 6 }} />
    </View>

    {/* Frequency + Next Due Date Card */}
    <View className="bg-white rounded-2xl px-4 py-4">
      {/* Frequency Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <SkeletonElement width={18} height={18} style={{ borderRadius: 4 }} />
        <View style={{ gap: 6 }}>
          <SkeletonElement width={60} height={10} style={{ borderRadius: 4 }} />
          <SkeletonElement width={80} height={14} style={{ borderRadius: 4 }} />
        </View>
      </View>

      {/* Next Due Date Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingTop: 12,
        }}
      >
        <SkeletonElement width={18} height={18} style={{ borderRadius: 4 }} />
        <View style={{ gap: 6 }}>
          <SkeletonElement width={80} height={10} style={{ borderRadius: 4 }} />
          <SkeletonElement
            width={120}
            height={14}
            style={{ borderRadius: 4 }}
          />
        </View>
      </View>
    </View>

    {/* Status Card */}
    <View className="bg-white rounded-2xl px-4 py-4">
      <SkeletonElement
        width="25%"
        height={10}
        style={{ borderRadius: 4, marginBottom: 10 }}
      />
      <SkeletonElement width={80} height={26} style={{ borderRadius: 20 }} />
    </View>

    {/* Notes Card 1 */}
    <View className="bg-white rounded-2xl px-4 py-4">
      <SkeletonElement
        width="40%"
        height={16}
        style={{ borderRadius: 6, marginBottom: 10 }}
      />
      <SkeletonElement
        width="100%"
        height={12}
        style={{ borderRadius: 4, marginBottom: 6 }}
      />
      <SkeletonElement
        width="100%"
        height={12}
        style={{ borderRadius: 4, marginBottom: 6 }}
      />
      <SkeletonElement width="65%" height={12} style={{ borderRadius: 4 }} />
    </View>

    {/* Notes Card 2 */}
    <View className="bg-white rounded-2xl px-4 py-4">
      <SkeletonElement
        width="35%"
        height={16}
        style={{ borderRadius: 6, marginBottom: 10 }}
      />
      <SkeletonElement
        width="100%"
        height={12}
        style={{ borderRadius: 4, marginBottom: 6 }}
      />
      <SkeletonElement
        width="100%"
        height={12}
        style={{ borderRadius: 4, marginBottom: 6 }}
      />
      <SkeletonElement width="50%" height={12} style={{ borderRadius: 4 }} />
    </View>
  </View>
);

export default ReminderDetailsSkeleton;

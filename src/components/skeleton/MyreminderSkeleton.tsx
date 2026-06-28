import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import React from "react";
import { View } from "react-native";

const ReminderCardSkeleton = () => (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#94A3B8",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    }}
  >
    {/* Title row */}
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
      }}
    >
      <SkeletonElement width="65%" height={16} style={{ borderRadius: 6 }} />
      <SkeletonElement width={16} height={16} style={{ borderRadius: 4 }} />
    </View>

    {/* Frequency · Date */}
    <SkeletonElement
      width="45%"
      height={12}
      style={{ borderRadius: 4, marginBottom: 12 }}
    />

    {/* Status badge */}
    <SkeletonElement width={64} height={24} style={{ borderRadius: 20 }} />
  </View>
);

const MyReminderSkeleton = () => (
  <View>
    {Array.from({ length: 4 }).map((_, i) => (
      <ReminderCardSkeleton key={i} />
    ))}
  </View>
);

export default MyReminderSkeleton;

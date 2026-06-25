import React from "react";
import { View } from "react-native";
import SkeletonElement from "./SkeletonElement";

const PartnerCardSkeletonItem = () => (
  <View
    className="bg-white rounded-2xl px-4 py-4 mb-3"
    style={{
      shadowColor: "#06B6D4",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    {/* Company name */}
    <SkeletonElement width="50%" height={16} style={{ marginBottom: 8 }} />
    {/* Description */}
    <SkeletonElement width="90%" height={12} style={{ marginBottom: 6 }} />
    <SkeletonElement width="75%" height={12} style={{ marginBottom: 12 }} />
    {/* Phone + website row */}
    <View className="flex-row gap-3">
      <SkeletonElement width="40%" height={12} />
      <SkeletonElement width="40%" height={12} />
    </View>
  </View>
);

const PartnerCardSkeleton = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <PartnerCardSkeletonItem key={i} />
    ))}
  </>
);

export default PartnerCardSkeleton;

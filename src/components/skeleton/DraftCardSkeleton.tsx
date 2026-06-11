import React from "react";
import { View } from "react-native";
import SkeletonElement from "./SkeletonElement";

const DraftCardSkeleton = () => (
  <View
    style={{
      backgroundColor: "white",
      borderRadius: 20,
      padding: 18,
      shadowColor: "#0EA5E9",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
      gap: 10,
    }}
  >
    <View className="flex-row justify-between items-center">
      <SkeletonElement width="65%" height={18} style={{ borderRadius: 6 }} />
      <SkeletonElement width={28} height={28} style={{ borderRadius: 8 }} />
    </View>
    <SkeletonElement width="40%" height={13} style={{ borderRadius: 4 }} />
    <SkeletonElement width="25%" height={13} style={{ borderRadius: 4 }} />
    <SkeletonElement width="100%" height={8} style={{ borderRadius: 999 }} />
    <SkeletonElement width="100%" height={44} style={{ borderRadius: 999 }} />
  </View>
);

export default DraftCardSkeleton;

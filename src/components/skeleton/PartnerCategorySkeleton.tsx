import React from "react";
import { View } from "react-native";
import SkeletonElement from "./SkeletonElement";

const PartnerCategorySkeletonCard = () => (
  <View
    className="bg-white rounded-2xl px-4 py-4 flex-row items-center mb-3"
    style={{
      shadowColor: "#06B6D4",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    {/* Text lines */}
    <View className="flex-1 mr-2 gap-y-2">
      <SkeletonElement width="60%" height={16} />
      <SkeletonElement width="90%" height={12} />
      <SkeletonElement width="40%" height={12} />
    </View>

    {/* Chevron */}
    <SkeletonElement width={24} height={24} style={{ borderRadius: 12 }} />
  </View>
);

const PartnerCategorySkeleton = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <PartnerCategorySkeletonCard key={i} />
    ))}
  </>
);

export default PartnerCategorySkeleton;

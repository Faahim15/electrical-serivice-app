import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import React from "react";
import { View } from "react-native";

const FAQSkeletonItem = () => (
  <View
    className="bg-white rounded-2xl px-4 py-4 mb-3"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    <View className="flex-row items-center justify-between mb-2">
      <SkeletonElement width="75%" height={16} style={{ borderRadius: 8 }} />
      <SkeletonElement width={20} height={20} style={{ borderRadius: 10 }} />
    </View>
  </View>
);

const FAQSkeleton = () => (
  <View>
    {[1, 2, 3, 4, 5].map((i) => (
      <FAQSkeletonItem key={i} />
    ))}
  </View>
);

export default FAQSkeleton;

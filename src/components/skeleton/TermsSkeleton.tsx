import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import React from "react";
import { View } from "react-native";

const TermsSkeleton = () => (
  <View
    className="bg-white rounded-2xl px-4 pt-4 pb-6"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    }}
  >
    {/* Last updated */}
    <SkeletonElement
      width={160}
      height={12}
      style={{ borderRadius: 6, marginBottom: 16 }}
    />

    {/* Sections */}
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <View key={i} style={{ marginTop: 16 }}>
        <SkeletonElement
          width="50%"
          height={15}
          style={{ borderRadius: 8, marginBottom: 8 }}
        />
        <SkeletonElement
          width="100%"
          height={13}
          style={{ borderRadius: 6, marginBottom: 4 }}
        />
        <SkeletonElement
          width="100%"
          height={13}
          style={{ borderRadius: 6, marginBottom: 4 }}
        />
        <SkeletonElement width="80%" height={13} style={{ borderRadius: 6 }} />
      </View>
    ))}
  </View>
);

export default TermsSkeleton;

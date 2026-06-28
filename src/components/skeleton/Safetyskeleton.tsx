import React from "react";
import { View } from "react-native";
import SkeletonElement from "./SkeletonElement";

const SafetyCardSkeleton = () => (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 16,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#06B6D4",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    {/* Icon placeholder */}
    <SkeletonElement width={44} height={44} style={{ borderRadius: 12 }} />

    {/* Text placeholder */}
    <View style={{ flex: 1, marginLeft: 10, gap: 6 }}>
      <SkeletonElement width="55%" height={14} style={{ borderRadius: 6 }} />
      <SkeletonElement width="75%" height={12} style={{ borderRadius: 6 }} />
    </View>

    {/* Toggle placeholder */}
    <SkeletonElement width={51} height={31} style={{ borderRadius: 16 }} />
  </View>
);

const SafetySkeleton = () => (
  <View>
    {Array.from({ length: 7 }).map((_, i) => (
      <SafetyCardSkeleton key={i} />
    ))}
  </View>
);

export default SafetySkeleton;

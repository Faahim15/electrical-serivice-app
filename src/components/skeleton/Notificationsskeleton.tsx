import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import React from "react";
import { View } from "react-native";

const NotificationCardSkeleton = () => (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 14,
      shadowColor: "#94A3B8",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
      {/* Content */}
      <View style={{ flex: 1, gap: 6 }}>
        {/* Title row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          <SkeletonElement
            width="70%"
            height={13}
            style={{ borderRadius: 5 }}
          />
          <SkeletonElement width={8} height={8} style={{ borderRadius: 4 }} />
        </View>

        {/* Body lines */}
        <SkeletonElement width="100%" height={11} style={{ borderRadius: 4 }} />
        <SkeletonElement width="80%" height={11} style={{ borderRadius: 4 }} />

        {/* Footer */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <SkeletonElement width={70} height={10} style={{ borderRadius: 4 }} />
          <SkeletonElement
            width={52}
            height={20}
            style={{ borderRadius: 20 }}
          />
        </View>
      </View>
    </View>
  </View>
);

const NotificationsSkeleton = () => (
  <View style={{ padding: 16, gap: 10 }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <NotificationCardSkeleton key={i} />
    ))}
  </View>
);

export default NotificationsSkeleton;

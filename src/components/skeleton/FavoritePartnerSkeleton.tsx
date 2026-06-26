import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import React from "react";
import { View } from "react-native";

const FavoritePartnerSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          className="bg-white rounded-2xl px-4 py-4 mb-3"
          style={{ elevation: 2 }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-3 flex-1">
              <SkeletonElement
                width={44}
                height={44}
                style={{ borderRadius: 12 }}
              />
              <View className="flex-1 gap-2">
                <SkeletonElement width="60%" height={14} />
                <SkeletonElement
                  width="35%"
                  height={12}
                  style={{ borderRadius: 999 }}
                />
              </View>
            </View>
            <SkeletonElement
              width={18}
              height={18}
              style={{ borderRadius: 4 }}
            />
          </View>
          <View className="flex-row items-center gap-3">
            <View style={{ width: 44 }} />
            <View className="gap-2">
              <SkeletonElement width={140} height={12} />
              <SkeletonElement width={120} height={12} />
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

export default FavoritePartnerSkeleton;

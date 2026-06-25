import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import React from "react";
import { View } from "react-native";

const AboutUsSkeleton = () => (
  <View style={{ gap: 12 }}>
    {/* Brand Card */}
    <View
      className="bg-white rounded-2xl px-5 py-6 items-center"
      style={{ elevation: 2 }}
    >
      <SkeletonElement
        width={80}
        height={80}
        style={{ borderRadius: 16, marginBottom: 16 }}
      />
      <SkeletonElement
        width={200}
        height={18}
        style={{ borderRadius: 8, marginBottom: 8 }}
      />
      <SkeletonElement width={160} height={13} style={{ borderRadius: 6 }} />
    </View>

    {/* About Card */}
    <View className="bg-white rounded-2xl px-5 py-5" style={{ elevation: 2 }}>
      <SkeletonElement
        width={160}
        height={16}
        style={{ borderRadius: 8, marginBottom: 12 }}
      />
      {[1, 2, 3, 4].map((i) => (
        <SkeletonElement
          key={i}
          width="100%"
          height={13}
          style={{ borderRadius: 6, marginBottom: 8 }}
        />
      ))}
    </View>

    {/* App Info Card */}
    <View className="bg-white rounded-2xl px-5 py-5" style={{ elevation: 2 }}>
      <SkeletonElement
        width={140}
        height={16}
        style={{ borderRadius: 8, marginBottom: 12 }}
      />
      <SkeletonElement
        width="100%"
        height={13}
        style={{ borderRadius: 6, marginBottom: 8 }}
      />
      <SkeletonElement width="100%" height={13} style={{ borderRadius: 6 }} />
    </View>

    {/* Contact Card */}
    <View className="bg-white rounded-2xl px-5 py-5" style={{ elevation: 2 }}>
      <SkeletonElement
        width={160}
        height={16}
        style={{ borderRadius: 8, marginBottom: 12 }}
      />
      {[1, 2, 3].map((i) => (
        <SkeletonElement
          key={i}
          width="80%"
          height={13}
          style={{ borderRadius: 6, marginBottom: 8 }}
        />
      ))}
    </View>
  </View>
);

export default AboutUsSkeleton;

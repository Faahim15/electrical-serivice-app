import SkeletonElement from "@/src/components/skeleton/SkeletonElement";
import React from "react";
import { ScrollView, View } from "react-native";

// ── Top Bar ──────────────────────────────────────────────
function TopBarSkeleton() {
  return (
    <View className="flex-row items-center justify-between mb-1">
      <View className="gap-y-2">
        <SkeletonElement width={160} height={28} style={{ borderRadius: 6 }} />
        <SkeletonElement width={120} height={28} style={{ borderRadius: 6 }} />
      </View>
      <View className="flex-row items-center gap-3">
        <SkeletonElement width={40} height={40} style={{ borderRadius: 20 }} />
        <SkeletonElement width={40} height={40} style={{ borderRadius: 20 }} />
      </View>
    </View>
  );
}

// ── Search Bar ───────────────────────────────────────────
function SearchBarSkeleton() {
  return (
    <SkeletonElement
      width="100%"
      height={46}
      style={{ borderRadius: 16, marginBottom: 24 }}
    />
  );
}

// ── Hero Banner ──────────────────────────────────────────
function HeroBannerSkeleton() {
  return (
    <SkeletonElement
      width="100%"
      height={160}
      style={{ borderRadius: 24, marginBottom: 16 }}
    />
  );
}

// ── Section Title ─────────────────────────────────────────
function SectionTitleSkeleton({ width = 120 }: { width?: number }) {
  return (
    <SkeletonElement
      width={width}
      height={18}
      style={{ borderRadius: 6, marginBottom: 12 }}
    />
  );
}

// ── Quick Action Cards (2 per row) ────────────────────────
function QuickActionGridSkeleton() {
  return (
    <View className="flex-row flex-wrap justify-between">
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: "48%", marginBottom: 12 }}>
          <SkeletonElement
            width="100%"
            height={110}
            style={{ borderRadius: 16 }}
          />
        </View>
      ))}
    </View>
  );
}

// ── Quick Action Full Card ────────────────────────────────
function QuickActionFullCardSkeleton() {
  return (
    <SkeletonElement
      width="100%"
      height={70}
      style={{ borderRadius: 16, marginBottom: 12 }}
    />
  );
}

// ── Recent Activity Header ────────────────────────────────
function ActivityHeaderSkeleton() {
  return (
    <View className="flex-row items-center justify-between mb-3 mt-1">
      <SkeletonElement width={130} height={18} style={{ borderRadius: 6 }} />
      <SkeletonElement width={60} height={16} style={{ borderRadius: 6 }} />
    </View>
  );
}

// ── Activity Card ─────────────────────────────────────────
function ActivityCardSkeleton() {
  return (
    <View
      className="bg-white rounded-2xl px-4 py-3 mb-3 flex-row items-center"
      style={{ elevation: 1 }}
    >
      <SkeletonElement
        width={36}
        height={36}
        style={{ borderRadius: 18, marginRight: 12 }}
      />
      <View className="flex-1 gap-y-2">
        <SkeletonElement width={140} height={14} style={{ borderRadius: 4 }} />
        <SkeletonElement width={100} height={12} style={{ borderRadius: 4 }} />
      </View>
      <SkeletonElement width={16} height={16} style={{ borderRadius: 4 }} />
    </View>
  );
}

// ── Emergency Banner ──────────────────────────────────────
function EmergencyBannerSkeleton() {
  return (
    <SkeletonElement
      width="100%"
      height={140}
      style={{ borderRadius: 16, marginTop: 8 }}
    />
  );
}

// ── Main Skeleton Screen ──────────────────────────────────
export default function HomeScreenSkeleton() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="pt-[14%]">
        <TopBarSkeleton />

        {/* subtitle line */}
        <SkeletonElement
          width={180}
          height={14}
          style={{ borderRadius: 4, marginTop: 4, marginBottom: 20 }}
        />

        <SearchBarSkeleton />
        <HeroBannerSkeleton />

        <SectionTitleSkeleton width={110} />
        <QuickActionGridSkeleton />
        <QuickActionFullCardSkeleton />

        <ActivityHeaderSkeleton />
        {[1, 2, 3].map((i) => (
          <ActivityCardSkeleton key={i} />
        ))}

        <EmergencyBannerSkeleton />
      </View>
    </ScrollView>
  );
}

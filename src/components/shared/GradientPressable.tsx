// src/components/shared/GradientPressable.tsx
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

const GRADIENT_COLORS = [
  "#0EA5E9",
  "#0CA7E4",
  "#0AA8E0",
  "#09AADB",
  "#08ABD7",
  "#07ADD2",
  "#07AECD",
  "#08AFC9",
  "#08B1C4",
  "#0AB2BF",
  "#0BB3BA",
  "#0DB5B5",
  "#10B6B0",
  "#12B7AB",
  "#14B8A6",
] as const;

interface GradientPressableProps {
  label: string;
  onPress?: () => void;
  style?: object;
  disabled?: boolean;
  isLoading?: boolean;
}

export const GradientPressable = ({
  label,
  onPress,
  style,
  disabled = false,
  isLoading = false,
}: GradientPressableProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || isLoading}
    style={[
      {
        borderRadius: 12,
        overflow: "hidden",
        opacity: disabled || isLoading ? 0.6 : 1,
      },
      style,
    ]}
  >
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
      }}
    >
      {isLoading && <ActivityIndicator size="small" color="white" />}
      <Text className="text-white text-[13.5px] font-Inter_SemiBold">
        {isLoading ? "Loading..." : label}
      </Text>
    </LinearGradient>
  </Pressable>
);

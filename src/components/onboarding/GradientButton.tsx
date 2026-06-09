import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

interface GradientButtonProps {
  label: string;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const GradientButton = ({
  label,
  onPress,
  isLoading = false,
  disabled = false,
}: GradientButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={!isDisabled ? onPress : undefined}
      className="rounded-2xl overflow-hidden mb-3"
      style={{
        shadowColor: isDisabled ? "transparent" : "#0EA5E9",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isDisabled ? 0 : 0.35,
        shadowRadius: 12,
        elevation: isDisabled ? 0 : 6,
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      <LinearGradient
        colors={["#0EA5E9", "#14B8A6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="py-4 items-center"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text
            className="font-Inter_SemiBold text-white"
            style={{ fontSize: 16 }}
          >
            {label}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

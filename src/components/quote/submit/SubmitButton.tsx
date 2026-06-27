import { verticalScale } from "@/src/utils/Scaling";
import React from "react";
import { Animated, Pressable, Text } from "react-native";

interface SubmitButtonProps {
  onPress: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  btnAnim: Animated.Value;
  label?: string;
  loadingLabel?: string;
}

const SubmitButton = ({
  onPress,
  isSubmitting,
  isDisabled,
  btnAnim,
  label = "Submit Request",
  loadingLabel = "Submitting...",
}: SubmitButtonProps) => {
  return (
    <Animated.View style={{ opacity: btnAnim, marginTop: verticalScale(20) }}>
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className="rounded-full py-4 items-center mb-4"
        style={{
          backgroundColor: isDisabled ? "#94A3B8" : "#06B6D4",
          shadowColor: "#06B6D4",
          shadowOpacity: isDisabled ? 0 : 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: isDisabled ? 0 : 4,
        }}
      >
        <Text className="text-white text-base font-Inter_SemiBold">
          {isSubmitting ? loadingLabel : label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default SubmitButton;

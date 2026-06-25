import React from "react";
import { Animated, Pressable, Text } from "react-native";

interface ConfirmCheckboxProps {
  checked: boolean;
  onPress: () => void;
  checkScale: Animated.Value;
  checkboxAnim: Animated.Value;
  label?: string;
}

const ConfirmCheckbox = ({
  checked,
  onPress,
  checkScale,
  checkboxAnim,
  label = "I confirm the information is correct and authorize Four Elements Electric to contact me about this request",
}: ConfirmCheckboxProps) => {
  return (
    <Animated.View
      className="flex-row items-start p-6 bg-white rounded-lg"
      style={{ opacity: checkboxAnim }}
    >
      <Pressable
        onPress={onPress}
        className="mt-[2px] mr-3 items-center justify-center"
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: checked ? "#14B8A6" : "#CBD5E1",
          backgroundColor: checked ? "#14B8A6" : "white",
        }}
      >
        <Animated.Text
          className="text-white text-[12px] font-Inter_Bold"
          style={{ transform: [{ scale: checkScale }] }}
        >
          ✓
        </Animated.Text>
      </Pressable>
      <Text className="text-[#334155] font-Inter_Regular text-[13px] flex-1 leading-5">
        {label}
      </Text>
    </Animated.View>
  );
};

export default ConfirmCheckbox;

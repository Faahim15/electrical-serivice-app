import React, { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

const AnimatedTouchable = ({
  onPress,
  children,
  style,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: object;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={press}>{children}</Pressable>
    </Animated.View>
  );
};

export const OptionButton = ({
  label,
  selected,
  onPress,
  fullWidth = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  fullWidth?: boolean;
}) => (
  <AnimatedTouchable onPress={onPress}>
    <View
      className={`rounded-xl border py-3 px-3 items-center justify-center ${
        fullWidth ? "w-full" : ""
      } ${selected ? "bg-[#4AA9F5] border-[#4AA9F5]" : "bg-white border-gray-200"}`}
      style={{ minHeight: 48 }}
    >
      <Text
        className={`text-sm font-Inter_SemiBold text-center ${
          selected ? "text-white" : "text-[#1F2937]"
        }`}
      >
        {label}
      </Text>
    </View>
  </AnimatedTouchable>
);

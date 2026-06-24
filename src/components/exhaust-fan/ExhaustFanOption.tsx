import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text } from "react-native";

interface ExhaustFanOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  variant?: "animated" | "row" | "chip";
}

export const AnimatedOption = ({
  label,
  selected,
  onPress,
}: ExhaustFanOptionProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(bgAnim, {
      toValue: selected ? 1 : 0,
      useNativeDriver: false,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [selected]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
    ]).start();
    onPress();
  };

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#60A5FA"],
  });
  const borderColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E2E8F0", "#60A5FA"],
  });

  return (
    <Pressable onPress={handlePress} style={{ flex: 1 }}>
      <Animated.View
        style={{
          backgroundColor,
          borderColor,
          borderWidth: 1.5,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="py-3 px-4 items-center justify-center"
        >
          <Text
            className={`text-base text-center ${
              selected
                ? "font-Inter_SemiBold text-white"
                : "font-Inter_Medium text-[#1F2937]"
            }`}
          >
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export const RowOption = ({
  label,
  selected,
  onPress,
}: ExhaustFanOptionProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(bgAnim, {
      toValue: selected ? 1 : 0,
      useNativeDriver: false,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [selected]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
    ]).start();
    onPress();
  };

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#60A5FA"],
  });
  const borderColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E2E8F0", "#60A5FA"],
  });

  return (
    <Pressable onPress={handlePress} className="mb-2">
      <Animated.View
        style={{
          backgroundColor,
          borderColor,
          borderWidth: 1.5,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="py-3.5 px-4"
        >
          <Text
            className={`text-base font-Inter_SemiBold ${
              selected ? "text-white" : "font-Inter_Regular text-gray-700"
            }`}
          >
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export const ChipOption = ({
  label,
  selected,
  onPress,
}: ExhaustFanOptionProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(bgAnim, {
      toValue: selected ? 1 : 0,
      useNativeDriver: false,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [selected]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.94,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
    ]).start();
    onPress();
  };

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#60A5FA"],
  });
  const borderColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E2E8F0", "#60A5FA"],
  });

  return (
    <Pressable onPress={handlePress} className="mr-2 mb-2">
      <Animated.View
        style={{
          backgroundColor,
          borderColor,
          borderWidth: 1.5,
          borderRadius: 50,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="py-2 px-3.5"
        >
          <Text
            className={`text-base font-Inter_Medium ${
              selected ? "text-white" : "text-[#1F2937]"
            }`}
          >
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { Animated, TextInput } from "react-native";

interface StyledInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}

export const StyledInput = ({
  placeholder,
  value,
  onChangeText,
  multiline = false,
}: StyledInputProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="font-Inter_Regular text-sm text-slate-800"
      style={{
        borderWidth: 1.5,
        borderColor: focused ? "#60A5FA" : "#E2E8F0",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 16,
        minHeight: multiline ? 80 : undefined,
        textAlignVertical: multiline ? "top" : undefined,
      }}
    />
  );
};

interface OtherInputProps {
  visible: boolean;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
}

export const OtherInput = ({
  visible,
  placeholder,
  value,
  onChangeText,
}: OtherInputProps) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [visible]);

  const maxHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  return (
    <Animated.View
      style={{ maxHeight, opacity: opacityAnim, overflow: "hidden" }}
    >
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </Animated.View>
  );
};

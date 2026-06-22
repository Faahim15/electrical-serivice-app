import React from "react";
import { TextInput } from "react-native";

interface LightingTextFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
}

export const LightingTextField = ({
  placeholder,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 4,
  className = "",
}: LightingTextFieldProps) => (
  <TextInput
    className={`border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular ${className}`}
    placeholder={placeholder}
    placeholderTextColor="#aaa"
    value={value}
    onChangeText={onChangeText}
    multiline={multiline}
    numberOfLines={numberOfLines}
    style={multiline ? { minHeight: 100, textAlignVertical: "top" } : undefined}
  />
);

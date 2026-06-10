import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
}

const InputField2: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "",
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-3">
      <Text className="text-base font-Inter_SemiBold text-[#111827] mb-2 tracking-[0.1px]">
        {label}
      </Text>

      <TextInput
        className={`h-[50px] font-Inter_Regular rounded-xl border px-4 text-sm text-[#111827] bg-[#FFFFFF] ${
          error
            ? "border-red-400"
            : isFocused
              ? "border-cyan-500 bg-[#FFFFFF]"
              : "border-[#E2E8F0]"
        }`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#11182780"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {error && (
        <Text className="text-red-500 text-xs font-Inter_Regular mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputField2;

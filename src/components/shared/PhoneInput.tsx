import { verticalScale } from "@/src/utils/Scaling";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

const USA_CODE = "+1";
const MAX_DIGITS = 11;

type PhoneInputProps = {
  label?: string;
  value: string;
  onChangeText: (val: string) => void;
  onBlur?: () => void;
  error?: string;
  labelColor?: string;
};

export default function PhoneInput({
  label = "Phone Number",
  value,
  onChangeText,
  onBlur,
  error,
  labelColor = "#0F172A",
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? "border-red-500"
    : isFocused
      ? "border-[#12B7AB]"
      : "border-[#E2E8F0]";

  const handleChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, "");
    if (digitsOnly.length <= MAX_DIGITS) {
      onChangeText(digitsOnly);
    }
  };

  return (
    <View className="mb-2">
      {label ? (
        <Text
          style={{ color: labelColor }}
          className="font-Inter_Medium text-sm mb-1"
        >
          {label}
        </Text>
      ) : null}

      <View
        className={`flex-row items-center border ${borderColor} bg-white rounded-2xl px-3`}
        style={{ minHeight: verticalScale(58) }}
      >
        {/* Left icon */}
        <Ionicons
          name="call-outline"
          size={18}
          color="#6C6C70"
          style={{ marginRight: 8 }}
        />

        {/* Country code badge */}
        <View className="flex-row items-center gap-x-1 pr-3 mr-1 border-r border-[#E2E8F0]">
          <Text style={{ fontSize: 16 }}>🇺🇸</Text>
          <Text className="font-Inter_Medium text-sm text-black">
            {USA_CODE}
          </Text>
        </View>

        {/* Number input */}
        <TextInput
          value={value}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          keyboardType="phone-pad"
          placeholder="XXXXXXXXXXX"
          placeholderTextColor="#898989"
          maxLength={MAX_DIGITS}
          className="flex-1 font-Inter_Regular text-sm text-black"
        />

        {/* Digit counter */}
        <Text className="font-Inter_Regular text-xs text-gray-400">
          {value.length}/{MAX_DIGITS}
        </Text>
      </View>

      {error && (
        <Text className="text-red-500 font-Inter_Regular text-xs mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}

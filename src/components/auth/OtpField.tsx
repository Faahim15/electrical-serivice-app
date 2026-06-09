import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";

interface OtpFieldProps {
  onOtpChange?: (otp: string[]) => void;
  error?: string;
}

export default function OtpField({ onOtpChange, error }: OtpFieldProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const hiddenInputRef = useRef<TextInput | null>(null);

  // ✅ central updater (like your second code)
  const updateOtp = (newOtp: string[]) => {
    setOtp(newOtp);
    onOtpChange?.(newOtp);

    const nextIndex = newOtp.findIndex((v) => v === "");
    setActiveIndex(nextIndex === -1 ? 5 : nextIndex);
  };

  // ✅ paste + typing handler (improved logic)
  const handleChange = (text: string) => {
    const value = text.replace(/\D/g, "").slice(0, 6);

    const newOtp = ["", "", "", "", "", ""];

    value.split("").forEach((char, i) => {
      newOtp[i] = char;
    });

    updateOtp(newOtp);

    // focus next empty input
    const nextIndex = newOtp.findIndex((v) => v === "");
    const focusIndex = nextIndex === -1 ? 5 : nextIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  // ✅ backspace logic (fixed from second code)
  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key !== "Backspace") return;

    const newOtp = [...otp];

    const lastFilled = newOtp.findLastIndex((v) => v !== "");

    if (lastFilled >= 0) {
      newOtp[lastFilled] = "";
      updateOtp(newOtp);
      inputRefs.current[lastFilled]?.focus();
    }
  };

  const handleBoxPress = () => {
    hiddenInputRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="mt-2">
        {/* 🔥 Hidden input (handles paste + keyboard reliably) */}
        <TextInput
          ref={hiddenInputRef}
          value={otp.join("")}
          onChangeText={handleChange}
          onKeyPress={handleKeyPress}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          style={{
            position: "absolute",
            opacity: 0,
            height: 1,
            width: 1,
          }}
        />

        {/* UI (UNCHANGED DESIGN) */}
        <View className="flex-row justify-between w-[100%] mb-6">
          {otp.map((digit, index) => {
            const isActive = index === activeIndex;

            return (
              <View
                key={index}
                onTouchStart={handleBoxPress}
                className="w-[14%] mt-[3%] aspect-square"
              >
                <TextInput
                  ref={(ref: TextInput | null) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={() => {}} // disabled (handled by hidden input)
                  editable={false}
                  maxLength={1}
                  className={`border-b-2 text-center text-2xl pt-[3%] font-Inter_SemiBold ${
                    error
                      ? "border-red-500 text-red-500"
                      : "border-[#07ADD2] text-[#0EA5E9]"
                  }`}
                  style={{
                    textAlignVertical: "center",
                    opacity: digit === "" && isActive ? 1 : 1,
                  }}
                />

                {/* optional cursor feel (very subtle UX improvement) */}
                {digit === "" && isActive && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: "50%",
                      width: 2,
                      height: 18,
                      backgroundColor: error ? "red" : "#07ADD2",
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>

        {error && (
          <Text className="text-red-500 font-Inter_Regular text-xs -mt-4 mb-2">
            {error}
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

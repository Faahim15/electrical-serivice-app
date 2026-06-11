import { updateContactDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const OPTIONS = ["Call", "Text", "Email"] as const;

interface PreferredContactSelectorProps {
  value: string;
  onChange: (val: "Call" | "Text" | "Email") => void;
  error?: string;
}
export default function PreferredContactSelector({
  value,
  onChange,
  error,
}: PreferredContactSelectorProps) {
  const dispatch = useDispatch();
  const selected = useSelector(
    (state: RootState) => state.serviceForm.contactDetails.preferredContact,
  );

  return (
    <View className="mb-[4%] mt-[2%]">
      <View className="flex-row items-center mb-2">
        <Text className="text-[#1E293B] text-[13.5px] font-Inter_SemiBold">
          Preferred contact method
        </Text>
        <Text className="text-red-500 ml-1 text-[13.5px]">*</Text>
      </View>

      <View className="flex-row gap-3">
        {OPTIONS.map((option) => {
          const isSelected = selected === option;
          return (
            <Pressable
              key={option}
              onPress={() =>
                dispatch(updateContactDetails({ preferredContact: option }))
              }
              style={{
                paddingHorizontal: 24,
                paddingVertical: 11,
                borderRadius: 12,
                backgroundColor: isSelected ? "#0EA5E9" : "#FFFFFF",
                borderWidth: isSelected ? 0 : 1,
                borderColor: "#E2E8F0",
                shadowColor: "#94A3B8",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isSelected ? 0 : 0.08,
                shadowRadius: 4,
                elevation: isSelected ? 0 : 2,
              }}
            >
              <Text
                className="text-[14px] font-Inter_SemiBold"
                style={{ color: isSelected ? "#FFFFFF" : "#64748B" }}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

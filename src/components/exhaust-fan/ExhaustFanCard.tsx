import React from "react";
import { Text, View } from "react-native";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
}

export const SectionCard = ({ title, children }: SectionCardProps) => (
  <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
    {title ? (
      <Text className="text-lg font-Inter_SemiBold text-[#1F2937] mb-3">
        {title}
      </Text>
    ) : null}
    {children}
  </View>
);

export const Label = ({ text, sub }: { text: string; sub?: string }) => (
  <View className="mb-2.5">
    <Text className="font-Inter_SemiBold text-base text-slate-800">{text}</Text>
    {sub ? (
      <Text className="font-Inter_Regular text-[11px] text-[#717182] mt-0.5">
        {sub}
      </Text>
    ) : null}
  </View>
);

export const Divider = () => <View className="h-px bg-slate-100 my-3" />;

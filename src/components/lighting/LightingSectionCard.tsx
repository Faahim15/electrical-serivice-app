import React from "react";
import { Text, View } from "react-native";

export const SectionCard = ({
  children,
  className: cls = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View className={`bg-white rounded-2xl p-4 mb-4 shadow-sm ${cls}`}>
    {children}
  </View>
);

export const Label = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-[#364153] font-Inter_Medium text-base mb-3 leading-5">
    {children}
  </Text>
);

export const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-[#364153] font-Inter_Medium text-xs mb-1">
    {children}
  </Text>
);

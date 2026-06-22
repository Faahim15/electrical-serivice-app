import React from "react";
import { View } from "react-native";

interface LightingSectionRendererProps {
  lightingType: string;
  children: React.ReactNode;
}

export const LightingSectionRenderer = ({
  lightingType,
  children,
}: LightingSectionRendererProps) => {
  if (!lightingType) return null;
  return <View>{children}</View>;
};

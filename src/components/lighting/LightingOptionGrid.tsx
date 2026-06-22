import React from "react";
import { View } from "react-native";
import { OptionButton } from "./LightingOptionButton";

export const TwoColGrid = ({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string | null;
  onSelect: (v: string) => void;
}) => (
  <View className="flex-row flex-wrap gap-2">
    {items.map((item) => (
      <View key={item} style={{ width: "48%" }}>
        <OptionButton
          label={item}
          selected={selected === item}
          onPress={() => onSelect(item)}
        />
      </View>
    ))}
  </View>
);

export const YesNoRow = ({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: "Yes" | "No") => void;
}) => (
  <View className="flex-row gap-3">
    {(["Yes", "No"] as const).map((opt) => (
      <View key={opt} style={{ flex: 1 }}>
        <OptionButton
          label={opt}
          selected={value === opt}
          onPress={() => onChange(opt)}
        />
      </View>
    ))}
  </View>
);

import React from "react";
import { Animated, Text, View } from "react-native";

interface InfoRow {
  label: string;
  value: string;
}

interface InfoCardProps {
  rows: InfoRow[];
  cardAnim: Animated.Value;
}

const InfoCard = ({ rows, cardAnim }: InfoCardProps) => {
  return (
    <Animated.View
      className="bg-white rounded-2xl px-5 py-4 mb-4"
      style={{
        opacity: cardAnim,
        transform: [
          {
            translateY: cardAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
        shadowColor: "#0EA5E9",
        shadowOpacity: 0.07,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      {rows.map((row, i) => (
        <View key={row.label} className={i < rows.length - 1 ? "mb-4" : ""}>
          <Text className="text-[#94A3B8] text-xs mb-[2px] font-Inter_Bold">
            {row.label}
          </Text>
          <Text className="text-[#0F172A] text-[15px] font-Inter_SemiBold">
            {row.value}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
};

export default InfoCard;

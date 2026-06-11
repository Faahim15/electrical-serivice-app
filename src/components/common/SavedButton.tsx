import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface SavedEditActionProps {
  onPress?: () => void;
  title?: string;
}

export default function SavedEditAction({
  onPress = () => {
    router.push("/(tabs)/home/saved-draft");
  },
  title = "Save for Later",
}: SavedEditActionProps) {
  return (
    <Pressable onPress={onPress}>
      <View className="items-center mt-1">
        <Text className="font-Inter_SemiBold text-base text-[#0EA5E9] ">
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

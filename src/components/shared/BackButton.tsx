import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";

interface BackButtonProps {
  onPress?: () => void;
}

const BackButton = ({ onPress }: BackButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="w-10 h-10 items-center justify-center"
    >
      <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
    </Pressable>
  );
};

export default BackButton;

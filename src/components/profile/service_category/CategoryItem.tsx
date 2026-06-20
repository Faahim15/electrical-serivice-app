import { setSelectedRouteCategory } from "@/src/redux/slices/categoryRouteSlice";
import { ServiceCategory } from "@/src/types/tabs.home.types";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useDispatch } from "react-redux";

const CategoryItem = ({
  item,
  onPress,
  trailingIcon,
}: {
  item: ServiceCategory;
  onPress?: () => void;
  trailingIcon?: React.ReactNode;
}) => {
  const dispatch = useDispatch();

  const handlePress = () => {
    const categoryId = Number(item.id);

    // ─── Solar Installation (id: 11) - Single screen, no Redux slice ────────
    if (categoryId === 11) {
      router.push("/(tabs)/quotes/quote/other/sollar-installation");
    }
    // ─── All other categories (1-10, 12-19) ──────────────────────────────────
    else {
      // Set the category in Redux for the service-details page
      dispatch(setSelectedRouteCategory(item));
      router.push("/(tabs)/quotes/quote/service-details");
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row border border-green-50 items-center bg-white rounded-2xl mb-3 px-4 py-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Icon Container */}
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
        style={{ backgroundColor: item.iconBg }}
      >
        {item.title === "Ceiling Fan" ? (
          <FontAwesome5 name="fan" size={22} color={item.iconColor} />
        ) : (
          <Ionicons name={item.iconName} size={22} color={item.iconColor} />
        )}
      </View>

      {/* Text Content */}
      <View className="flex-1">
        <Text
          className="font-Inter_SemiBold text-[15px] text-gray-900 leading-5"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          className="font-Inter_Regular text-[13px] text-gray-500 mt-0.5 leading-[18px]"
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={18} color="#BBBBBB" />
    </Pressable>
  );
};

export default CategoryItem;

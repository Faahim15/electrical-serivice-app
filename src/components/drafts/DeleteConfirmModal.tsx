import { Feather } from "@expo/vector-icons";
import React from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";

interface DeleteConfirmModalProps {
  visible: boolean;
  isDeleting: boolean;
  opacity: Animated.Value;
  scale: Animated.Value;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({
  visible,
  isDeleting,
  opacity,
  scale,
  title = "Delete Draft?",
  description = "This draft will be permanently removed. This action cannot be undone.",
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
    >
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      >
        <Animated.View
          style={{
            opacity,
            transform: [{ scale }],
            backgroundColor: "white",
            borderRadius: 24,
            paddingHorizontal: 24,
            paddingVertical: 28,
            width: "82%",
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
            elevation: 10,
          }}
        >
          {/* Icon + copy */}
          <View className="items-center mb-4">
            <View
              className="w-14 h-14 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: "#FEE2E2" }}
            >
              <Feather name="trash-2" size={24} color="#EF4444" />
            </View>
            <Text
              className="text-[#0F172A] text-lg text-center"
              style={{ fontFamily: "Inter_Bold" }}
            >
              {title}
            </Text>
            <Text
              className="text-[#64748B] text-sm text-center mt-1.5 leading-5"
              style={{ fontFamily: "Inter_Regular" }}
            >
              {description}
            </Text>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-x-3 mt-2">
            <Pressable
              onPress={onCancel}
              disabled={isDeleting}
              className="flex-1 rounded-full py-3.5 items-center"
              style={{
                backgroundColor: "#F1F5F9",
                opacity: isDeleting ? 0.6 : 1,
              }}
            >
              <Text
                className="text-[#334155] text-[15px]"
                style={{ fontFamily: "Inter_SemiBold" }}
              >
                No
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-full py-3.5 items-center"
              style={{
                backgroundColor: "#EF4444",
                shadowColor: "#EF4444",
                shadowOpacity: 0.28,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
                elevation: 4,
                opacity: isDeleting ? 0.6 : 1,
              }}
            >
              <Text
                className="text-white text-[15px]"
                style={{ fontFamily: "Inter_SemiBold" }}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmModal;

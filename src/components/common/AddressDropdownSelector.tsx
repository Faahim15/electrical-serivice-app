import { useGetProfileQuery } from "@/src/redux/api-slices/home/home-api";
import { Address } from "@/src/types/home.api.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface Props {
  onSelect: (address: Address) => void;
}

export default function AddressDropdownSelector({ onSelect }: Props) {
  const { data } = useGetProfileQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const buttonRef = useRef<View>(null);

  const addresses = data?.data?.addresses ?? [];

  // Auto-select default address on load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddress(defaultAddr);
      onSelect(defaultAddr);
    }
  }, [addresses]);

  const handleSelect = (address: Address) => {
    setSelectedAddress(address);
    onSelect(address);
    setIsOpen(false);
  };

  const openDropdown = () => {
    buttonRef.current?.measure((_fx, _fy, _w, _h, px, py) => {
      setDropdownPosition({ top: py + _h + 4, right: 0 });
      setIsOpen(true);
    });
  };

  if (addresses.length === 0) return null;

  return (
    <>
      {/* Trigger Button */}
      <View ref={buttonRef}>
        <Pressable
          onPress={openDropdown}
          className="flex-row items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl px-3 py-[7px]"
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 4,
          }}
        >
          <Ionicons name="location-outline" size={14} color="#0EA5E9" />
          <Text
            className="text-[13px] font-Inter_Medium text-[#111827] max-w-[100px]"
            numberOfLines={1}
          >
            {selectedAddress?.addressName ?? "Select"}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={13}
            color="#6B7280"
          />
        </Pressable>
      </View>

      {/* Dropdown Modal */}
      <Modal
        transparent
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable className="flex-1" onPress={() => setIsOpen(false)}>
          <View
            style={{
              position: "absolute",
              top: dropdownPosition.top,
              right: 20,
              width: 220,
              backgroundColor: "#fff",
              borderRadius: 16,
              elevation: 8,
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              overflow: "hidden",
            }}
          >
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {addresses.map((address, index) => {
                const isSelected = selectedAddress?._id === address._id;
                return (
                  <Pressable
                    key={address._id}
                    onPress={() => handleSelect(address)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      backgroundColor: isSelected ? "#F0F9FF" : "#fff",
                      borderBottomWidth: index < addresses.length - 1 ? 1 : 0,
                      borderBottomColor: "#F1F5F9",
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2 flex-1">
                        <View
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: isSelected ? "#0EA5E9" : "#F1F5F9",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons
                            name="location"
                            size={14}
                            color={isSelected ? "#fff" : "#9CA3AF"}
                          />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-1">
                            <Text
                              className="text-[14px] font-Inter_SemiBold text-[#111827]"
                              numberOfLines={1}
                            >
                              {address.addressName}
                            </Text>
                            {address.isDefault && (
                              <View className="bg-[#DCFCE7] px-[6px] py-[2px] rounded-full">
                                <Text className="text-[10px] font-Inter_Medium text-[#16A34A]">
                                  Default
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text
                            className="text-[12px] font-Inter_Regular text-[#6B7280] mt-[1px]"
                            numberOfLines={1}
                          >
                            {address.streetAddress}, {address.city}
                          </Text>
                        </View>
                      </View>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color="#0EA5E9"
                        />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

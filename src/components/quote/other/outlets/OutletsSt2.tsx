import { nemaChart } from "@/assets/images/svg/tabs-svg";
import CustomSvg from "@/src/components/shared/CustomSvg";
import { useImagePicker } from "@/src/hooks/useImagePicker";
// import {

// } from "@/src/store/outletsDataSlice";
import {
  AmpOption,
  InstallType,
  selectOutletsSt2,
  setSt2InstallType,
  setSt2NemaConfig,
  setSt2Photos,
  setSt2SelectedAmp,
  setSt2SelectedVolt,
  VoltOption,
} from "@/src/redux/slices/globalstore/outletsDataSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PhotoUploadSection from "../../PhotoUploadSection";

const AMPS: AmpOption[] = ["15", "20", "30", "50"];
const VOLTS: VoltOption[] = ["110 or 120", "220 or 240", "110/220 or 120/240"];

const OutletsSt2 = () => {
  const dispatch = useDispatch();
  const { installType, photos, selectedAmp, selectedVolt, nemaConfig } =
    useSelector(selectOutletsSt2);

  const { width: screenWidth } = useWindowDimensions();
  const outletImages = useImagePicker();
  const [isvisiable, setIsVisiable] = useState(false);

  const installAnims = useRef(
    ["New install", "Replacement"].map(() => new Animated.Value(1)),
  ).current;
  const ampAnims = useRef(AMPS.map(() => new Animated.Value(1))).current;
  const voltAnims = useRef(VOLTS.map(() => new Animated.Value(1))).current;

  const animatePressIn = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Badge */}
        <View className="self-start bg-[#EFF6FF] rounded-full px-3 py-1 mb-5">
          <Text className="text-[#60A5FA] text-[11px] font-Inter_SemiBold tracking-wide">
            Outlets
          </Text>
        </View>

        <Text className="text-2xl font-Inter_Bold text-[#1F2937] mb-5">
          Installation type
        </Text>

        <Text className="text-base font-Inter_SemiBold text-[#1F2937] mb-3">
          Is this a new install or replacement?
        </Text>

        {/* Install Type */}
        {(["New install", "Replacement"] as InstallType[]).map(
          (item, index) => {
            const isSelected = installType === item;
            return (
              <Animated.View
                key={item}
                style={{ transform: [{ scale: installAnims[index] }] }}
              >
                <Pressable
                  onPress={() => {
                    animatePressIn(installAnims[index]);
                    dispatch(setSt2InstallType(item));
                  }}
                  className="mb-2 rounded-xl border px-4 py-4"
                  style={{
                    backgroundColor: isSelected ? "#60A5FA" : "#ffffff",
                    borderColor: isSelected ? "#60A5FA" : "#E5E7EB",
                  }}
                >
                  <Text
                    className={`text-base font-Inter_Medium ${
                      isSelected ? "text-white" : "text-[#1F2937]"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          },
        )}

        {/* Photo Upload */}
        <PhotoUploadSection
          label="Please upload photos of where the outlet(s) will be installed."
          photos={photos}
          onPhotosChange={(p) => dispatch(setSt2Photos(p))}
        />

        {/* Amps — only for New install */}
        {installType === "New install" && (
          <>
            <Text className="text-base font-Inter_SemiBold text-[#1F2937] mt-5 mb-3">
              How many Amps?
            </Text>
            {AMPS.map((amp, index) => {
              const isSelected = selectedAmp === amp;
              return (
                <Animated.View
                  key={amp}
                  style={{ transform: [{ scale: ampAnims[index] }] }}
                >
                  <Pressable
                    onPress={() => {
                      animatePressIn(ampAnims[index]);
                      dispatch(setSt2SelectedAmp(amp));
                    }}
                    className="mb-2 rounded-xl border px-4 py-4"
                    style={{
                      backgroundColor: isSelected ? "#60A5FA" : "#ffffff",
                      borderColor: isSelected ? "#60A5FA" : "#E5E7EB",
                    }}
                  >
                    <Text
                      className={`text-base font-Inter_Medium ${
                        isSelected ? "text-white" : "text-[#1F2937]"
                      }`}
                    >
                      {amp}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}

            {/* Volts */}
            <Text className="text-base font-Inter_SemiBold text-[#1F2937] mt-5 mb-3">
              How many amps/volts do you need?
            </Text>
            {VOLTS.map((volt, index) => {
              const isSelected = selectedVolt === volt;
              return (
                <Animated.View
                  key={volt}
                  style={{ transform: [{ scale: voltAnims[index] }] }}
                >
                  <Pressable
                    onPress={() => {
                      animatePressIn(voltAnims[index]);
                      dispatch(setSt2SelectedVolt(volt));
                    }}
                    className="mb-2 rounded-xl border px-4 py-4"
                    style={{
                      backgroundColor: isSelected ? "#60A5FA" : "#ffffff",
                      borderColor: isSelected ? "#60A5FA" : "#E5E7EB",
                    }}
                  >
                    <Text
                      className={`text-base font-Inter_Medium ${
                        isSelected ? "text-white" : "text-[#1F2937]"
                      }`}
                    >
                      {volt}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}

            {/* NEMA */}
            <Pressable onPress={() => setIsVisiable(true)}>
              <Text className="text-base font-Inter_SemiBold text-[#1F2937] mt-5 mb-4">
                What is the NEMA configuration for the receptacle (if there will
                be one)? <Text style={{ color: "#60A5FA" }}>ⓘ</Text>
              </Text>
            </Pressable>
            <TextInput
              value={nemaConfig}
              onChangeText={(v) => dispatch(setSt2NemaConfig(v))}
              keyboardType="numeric"
              placeholder="14-50, 6-50, 14-30, unsure, etc."
              placeholderTextColor="#9CA3AF"
              className="font-Inter_Regular text-sm text-gray-800 bg-[#F8FAFC] rounded-xl px-4 py-4"
              style={{
                borderWidth: 1.5,
                borderColor: "#E5E7EB",
              }}
            />

            {isvisiable && (
              <View
                className="mt-3 rounded-2xl overflow-hidden"
                style={{
                  borderWidth: 1,
                  borderColor: "#BAE6FD",
                  shadowColor: "#0EA5E9",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View
                  className="flex-row items-center justify-between px-4 py-3"
                  style={{ backgroundColor: "#EEF9FF" }}
                >
                  <Text className="text-lg font-Inter_SemiBold text-[#0369A1]" />
                  <Pressable
                    onPress={() => setIsVisiable(false)}
                    className="w-[26px] h-[26px] rounded-full items-center justify-center"
                    style={{ backgroundColor: "#BAE6FD" }}
                  >
                    <Ionicons name="close" size={14} color="#0369A1" />
                  </Pressable>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  style={{ backgroundColor: "#F0F9FF", maxHeight: 900 }}
                >
                  <CustomSvg
                    xml={nemaChart}
                    width={screenWidth - 48}
                    height={800}
                  />
                </ScrollView>
              </View>
            )}
          </>
        )}

        <View className="mb-6" />
      </ScrollView>
    </View>
  );
};

export default OutletsSt2;

import { VoltageType } from "@/src/redux/slices/globalstore/lightingDataSlice";
import { updateLightingDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import React from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { OptionButton } from "../LightingOptionButton";
import { Label, SectionCard } from "../LightingSectionCard";

export const LandscapeSection = () => {
  const dispatch = useDispatch();
  const lightingDetails = useSelector(
    (state: RootState) => state.serviceForm.categoryData?.details,
  );

  const updateField = (field: string, value: any) => {
    dispatch(updateLightingDetails({ [field]: value }));
  };

  const getValue = (field: string) => {
    return (lightingDetails as any)?.[field] ?? "";
  };

  return (
    <SectionCard>
      <Text className="text-[#0A0A0A] font-Inter_SemiBold text-base mb-4">
        Landscape Lighting Details
      </Text>

      <Label>
        Will this be Line Voltage (120 volt) or Low Voltage (12–24 volt)?
      </Label>
      <View className="gap-2 mb-4">
        {(["Line Voltage", "Low Voltage"] as VoltageType[]).map((v) => (
          <OptionButton
            key={v!}
            label={v!}
            selected={getValue("landscapeVoltage") === v}
            onPress={() => updateField("landscapeVoltage", v)}
            fullWidth
          />
        ))}
      </View>

      <View className="border border-[#4AA9F5] rounded-xl p-4 bg-blue-50">
        <Text className="text-[#4AA9F5] font-Inter_Regular text-sm leading-5">
          We will reach out to schedule a site visit as soon as possible in
          order to provide you a quote.
        </Text>
      </View>
    </SectionCard>
  );
};

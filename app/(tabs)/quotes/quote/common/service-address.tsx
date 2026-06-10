import AuthHeading from "@/src/components/auth/AuthHeading";
import TermsAndPolicy from "@/src/components/auth/TermsAndPolicy";
import AddressDropdownSelector from "@/src/components/common/AddressDropdownSelector";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import InfoBanner from "@/src/components/quote/InfoBanner";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomInput from "@/src/components/shared/CustomInput";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { updateServiceAddress } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { Address } from "@/src/types/home.api.types";
import { CATEGORY_TOTAL_STEPS } from "@/src/utils/CategorySteps";
import { verticalScale } from "@/src/utils/Scaling";
import { router } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function ServiceAddress() {
  const dispatch = useDispatch();
  const { streetAddress, apartment, city, state, zipCode, isHomeAddress } =
    useSelector((state: RootState) => state.serviceForm.serviceAddress);
  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );
  const totalSteps = CATEGORY_TOTAL_STEPS[selectedCategory?.id ?? ""] ?? 8;

  const handleAddressSelect = (address: Address) => {
    dispatch(
      updateServiceAddress({
        streetAddress: address.streetAddress ?? "",
        apartment: address.apartmentUnit ?? "",
        city: address.city ?? "",
        state: address.state ?? "",
        zipCode: address.zipCode ?? "",
      }),
    );
  };

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Top row: back button + address dropdown */}
        <View className="flex-row items-center justify-between">
          <BackButton />
          <AddressDropdownSelector onSelect={handleAddressSelect} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(120) }}
        >
          <StepProgressBar currentStep={2} totalSteps={totalSteps} />

          {selectedCategory && <CategoryTag title={selectedCategory.title} />}
          <AuthHeading
            title="Your service address"
            subtitle="Where is the work needed?"
          />

          <CustomInput
            label="Street Address *"
            leftIcon="location-outline"
            textInputConfig={{
              placeholder: "Enter your street address",
              autoCapitalize: "words",
              value: streetAddress,
              onChangeText: (text) =>
                dispatch(updateServiceAddress({ streetAddress: text })),
            }}
          />

          <CustomInput
            label="Apartment / Unit"
            leftIcon="business-outline"
            textInputConfig={{
              placeholder: "Apt, suite, unit (optional)",
              keyboardType: "default",
              autoCapitalize: "none",
              value: apartment,
              onChangeText: (text) =>
                dispatch(updateServiceAddress({ apartment: text })),
            }}
          />

          <CustomInput
            label="City *"
            leftIcon="map-outline"
            textInputConfig={{
              placeholder: "Enter your city",
              keyboardType: "default",
              autoCapitalize: "words",
              value: city,
              onChangeText: (text) =>
                dispatch(updateServiceAddress({ city: text })),
            }}
          />

          <CustomInput
            label="State *"
            leftIcon="flag-outline"
            textInputConfig={{
              placeholder: "Enter your state",
              keyboardType: "default",
              autoCapitalize: "characters",
              value: state,
              onChangeText: (text) =>
                dispatch(updateServiceAddress({ state: text })),
            }}
          />

          <CustomInput
            label="Zip Code *"
            leftIcon="mail-open-outline"
            textInputConfig={{
              placeholder: "Enter your zip code",
              keyboardType: "number-pad",
              autoCapitalize: "none",
              value: zipCode,
              onChangeText: (text) =>
                dispatch(updateServiceAddress({ zipCode: text })),
            }}
          />

          <TermsAndPolicy
            shouldShowTitle={false}
            subtitle="This is my home address"
            subtitleColor="#6b7280"
            value={isHomeAddress}
            onToggle={(val) =>
              dispatch(updateServiceAddress({ isHomeAddress: val }))
            }
          />
          <InfoBanner />

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push("/(tabs)/quotes/quote/common/project-basics")
            }
          />
          <SavedEditAction />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

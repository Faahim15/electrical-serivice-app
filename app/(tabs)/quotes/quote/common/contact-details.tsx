import AuthHeading from "@/src/components/auth/AuthHeading";
import TermsAndPolicy from "@/src/components/auth/TermsAndPolicy";
import AddressDropdownSelector from "@/src/components/common/AddressDropdownSelector";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import PreferredContactSelector from "@/src/components/quote/PreferredContactSelector";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomInput from "@/src/components/shared/CustomInput";
import PhoneInput from "@/src/components/shared/PhoneInput";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useGetProfileQuery } from "@/src/redux/api-slices/home/home-api";
import { updateContactDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { Address } from "@/src/types/home.api.types";
import { CATEGORY_TOTAL_STEPS } from "@/src/utils/CategorySteps";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function ContactDetails() {
  const dispatch = useDispatch();
  const { data: profileData } = useGetProfileQuery();
  const [agreed, setAgreed] = useState(false);

  const { fullName, email, phone } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );
  const totalSteps = CATEGORY_TOTAL_STEPS[selectedCategory?.id ?? ""] ?? 8;

  const profile = profileData?.data;

  // Auto-fill with profile data on mount
  useEffect(() => {
    if (profile) {
      dispatch(
        updateContactDetails({
          fullName: profile.name ?? "",
          email: profile.email ?? "",
          phone: profile.phone ?? "",
        }),
      );
    }
  }, [profile]);

  const handleAddressSelect = (address: Address) => {
    dispatch(
      updateContactDetails({
        fullName: profile?.name ?? "",
        email: profile?.email ?? "",
        phone: profile?.phone ?? "",
      }),
    );
  };

  return (
    <ScreenWrapper paddingHorizontal={20}>
      {/* Top row: back button + address dropdown */}
      <View className="flex-row items-center justify-between">
        <BackButton />
        <AddressDropdownSelector onSelect={handleAddressSelect} />
      </View>

      <View>
        <StepProgressBar currentStep={1} totalSteps={totalSteps} />

        {selectedCategory && <CategoryTag title={selectedCategory.title} />}

        <AuthHeading
          title="Your contact details"
          subtitle="We'll use this to follow up on your request"
        />

        <CustomInput
          label="Full Name *"
          leftIcon="person-outline"
          textInputConfig={{
            placeholder: "Enter your full name",
            autoCapitalize: "words",
            value: fullName,
            onChangeText: (text) =>
              dispatch(updateContactDetails({ fullName: text })),
          }}
        />

        <CustomInput
          label="Email Address *"
          leftIcon="mail-outline"
          textInputConfig={{
            placeholder: "Enter your email",
            keyboardType: "email-address",
            autoCapitalize: "none",
            value: email,
            onChangeText: (text) =>
              dispatch(updateContactDetails({ email: text })),
          }}
        />

        <PhoneInput
          label="Phone Number *"
          value={phone}
          onChangeText={(text) =>
            dispatch(updateContactDetails({ phone: text }))
          }
        />

        <PreferredContactSelector />

        <TermsAndPolicy
          title="I agree to be"
          subtitle="contacted about this request"
          subtitleColor="#6b7280"
          value={agreed}
          onToggle={setAgreed}
        />

        <GradientButton
          label="Continue"
          onPress={() =>
            router.push("/(tabs)/quotes/quote/common/service-address")
          }
          disabled={!agreed}
        />

        <SavedEditAction />
      </View>
    </ScreenWrapper>
  );
}

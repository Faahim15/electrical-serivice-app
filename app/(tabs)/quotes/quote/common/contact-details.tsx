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
import { useDraftSave } from "@/src/hook/useDraftSave";
import { useGetProfileQuery } from "@/src/redux/api-slices/home/home-api";
import { updateContactDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  ContactFormValues,
  contactSchema,
} from "@/src/schemas/quotes/common/contactDetailsSchema";
import { Address } from "@/src/types/home.api.types";
import { CATEGORY_TOTAL_STEPS } from "@/src/utils/CategorySteps";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 1;

export default function ContactDetails() {
  const dispatch = useDispatch();
  const { data: profileData } = useGetProfileQuery();
  const [agreed, setAgreed] = useState(false);

  const { createDraft, updateDraft, isSaving } = useDraftSave();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );
  const totalSteps = CATEGORY_TOTAL_STEPS[selectedCategory?.id ?? ""] ?? 8;
  const profile = profileData?.data;

  // Prefer serviceType from params (resuming a draft); fall back to redux category
  const serviceType = serviceTypeParam || selectedCategory?.title || "N/A";

  // Same formula as StepProgressBar
  const completionPercentage = Math.round((CURRENT_STEP / totalSteps) * 100);

  // ─── RHF Setup ──────────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: fullName || "",
      email: email || "",
      phone: phone || "",
      preferredContact:
        (preferredContact as "Call" | "Text" | "Email") || "Call",
    },
  });

  // Auto-fill with profile data on mount
  useEffect(() => {
    if (profile) {
      const name = profile.name ?? "";
      const mail = profile.email ?? "";
      const tel = profile.phone ?? "";

      setValue("fullName", name);
      setValue("email", mail);
      setValue("phone", tel);

      dispatch(
        updateContactDetails({ fullName: name, email: mail, phone: tel }),
      );
    }
  }, [profile]);

  // ─── Address select handler ──────────────────────────────────────────────────
  const handleAddressSelect = (_address: Address) => {
    const name = profile?.name ?? "";
    const mail = profile?.email ?? "";
    const tel = profile?.phone ?? "";

    setValue("fullName", name);
    setValue("email", mail);
    setValue("phone", tel);

    dispatch(updateContactDetails({ fullName: name, email: mail, phone: tel }));
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const values = getValues();

    try {
      const payload = {
        fullName: values.fullName || "",
        emailAddress: values.email || "",
        phoneNumber: values.phone || "",
        preferredContactMethod: values.preferredContact || "Call",
        status: "draft" as const,
        completionPercentage,
      };

      if (serviceCallId) {
        await updateDraft(serviceCallId, serviceType, payload);
      } else {
        await createDraft(serviceType, {
          serviceType,
          ...payload,
          streetAddress: "",
          city: "",
          state: "",
          zipCode: "",
          propertyType: "",
          ownershipStatus: "",
          timelineUrgency: "",
        });
      }

      toast.success("Draft saved successfully!");
      router.push("/(tabs)/home/saved-draft");
    } catch {
      toast.error("Failed to save draft. Please try again.");
    }
  };

  // ─── Continue handler ────────────────────────────────────────────────────────
  const onSubmit = (values: ContactFormValues) => {
    dispatch(
      updateContactDetails({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        preferredContact: values.preferredContact,
      }),
    );
    router.push("/(tabs)/quotes/quote/common/service-address");
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <ScreenWrapper paddingHorizontal={20}>
      {/* Top row: back button + address dropdown */}
      <View className="flex-row items-center justify-between">
        <BackButton />
        <AddressDropdownSelector onSelect={handleAddressSelect} />
      </View>

      <View>
        <StepProgressBar currentStep={CURRENT_STEP} totalSteps={totalSteps} />

        <CategoryTag title={serviceType} />

        <AuthHeading
          title="Your contact details"
          subtitle="We'll use this to follow up on your request"
        />

        {/* Full Name */}
        <Controller
          control={control}
          name="fullName"
          render={({ field: { value, onChange } }) => (
            <CustomInput
              label="Full Name *"
              leftIcon="person-outline"
              error={errors.fullName?.message}
              textInputConfig={{
                placeholder: "Enter your full name",
                autoCapitalize: "words",
                value,
                onChangeText: onChange,
              }}
            />
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <CustomInput
              label="Email Address *"
              leftIcon="mail-outline"
              error={errors.email?.message}
              textInputConfig={{
                placeholder: "Enter your email",
                keyboardType: "email-address",
                autoCapitalize: "none",
                value,
                onChangeText: onChange,
              }}
            />
          )}
        />

        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange } }) => (
            <PhoneInput
              label="Phone Number *"
              value={value}
              onChangeText={onChange}
              error={errors.phone?.message}
            />
          )}
        />

        {/* Preferred Contact */}
        <Controller
          control={control}
          name="preferredContact"
          render={({ field: { value, onChange } }) => (
            <PreferredContactSelector
              value={value}
              onChange={onChange}
              error={errors.preferredContact?.message}
            />
          )}
        />

        <TermsAndPolicy
          title="I agree to be"
          subtitle="contacted about this request"
          subtitleColor="#6b7280"
          value={agreed}
          onToggle={setAgreed}
        />

        <GradientButton
          label="Continue"
          onPress={handleSubmit(onSubmit)}
          disabled={!agreed}
        />

        <SavedEditAction
          onPress={handleSaveForLater}
          title={isSaving ? "Saving..." : "Save for Later"}
        />
      </View>
    </ScreenWrapper>
  );
}

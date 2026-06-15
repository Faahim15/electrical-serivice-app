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
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import { useGetProfileQuery } from "@/src/redux/api-slices/home/home-api";
import { updateServiceAddress } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  ServiceAddressFormValues,
  serviceAddressSchema,
} from "@/src/schemas/quotes/common/serviceAddressSchema";
import { Address } from "@/src/types/home.api.types";
import { CATEGORY_TOTAL_STEPS } from "@/src/utils/CategorySteps";
import { verticalScale } from "@/src/utils/Scaling";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 2;

export default function ServiceAddress() {
  const dispatch = useDispatch();

  const { streetAddress, apartment, city, state, zipCode, isHomeAddress } =
    useSelector((state: RootState) => state.serviceForm.serviceAddress);
  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );
  const totalSteps = CATEGORY_TOTAL_STEPS[selectedCategory?.id ?? ""] ?? 8;

  const { createDraft, updateDraft, isSaving } = useDraftSave();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || selectedCategory?.title || "N/A";
  const completionPercentage = Math.round((CURRENT_STEP / totalSteps) * 100);

  // ─── Fetch existing draft (if resuming) ─────────────────────────────────────
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);

  // ─── Fetch user profile for addresses ───────────────────────────────────────
  const { data: profileData } = useGetProfileQuery();
  const addresses = profileData?.data?.addresses ?? [];

  // ─── RHF Setup ──────────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ServiceAddressFormValues>({
    resolver: zodResolver(serviceAddressSchema),
    mode: "onChange",
    defaultValues: {
      streetAddress: streetAddress || "",
      apartment: apartment || "",
      city: city || "",
      state: state || "",
      zipCode: zipCode || "",
      isHomeAddress: isHomeAddress || false,
    },
  });

  // ─── Prefill from API draft (first priority) ─────────────────────────────────
  useEffect(() => {
    if (draftData && (draftData.streetAddress || draftData.city)) {
      // Draft has address data - use it
      const values = {
        streetAddress: draftData.streetAddress || "",
        apartment: draftData.apartmentUnit || "",
        city: draftData.city || "",
        state: draftData.state || "",
        zipCode: draftData.zipCode || "",
      };

      setValue("streetAddress", values.streetAddress, { shouldValidate: true });
      setValue("apartment", values.apartment, { shouldValidate: true });
      setValue("city", values.city, { shouldValidate: true });
      setValue("state", values.state, { shouldValidate: true });
      setValue("zipCode", values.zipCode.trim(), { shouldValidate: true });

      dispatch(updateServiceAddress(values));
    }
  }, [draftData]);

  // ─── Prefill from profile addresses if no draft data exists ──────────────────
  useEffect(() => {
    // Only prefill from profile if:
    // 1. No draft data exists OR draft has no address
    // 2. Profile has addresses
    // 3. Redux doesn't already have values
    const hasDraftAddress =
      draftData && (draftData.streetAddress || draftData.city);
    const hasReduxAddress = streetAddress || city;

    if (!hasDraftAddress && !hasReduxAddress && addresses.length > 0) {
      const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

      if (defaultAddress) {
        const values = {
          streetAddress: defaultAddress.streetAddress || "",
          apartment: defaultAddress.apartmentUnit || "",
          city: defaultAddress.city || "",
          state: defaultAddress.state || "",
          zipCode: defaultAddress.zipCode?.trim() || "",
        };

        setValue("streetAddress", values.streetAddress, {
          shouldValidate: true,
        });
        setValue("apartment", values.apartment, { shouldValidate: true });
        setValue("city", values.city, { shouldValidate: true });
        setValue("state", values.state, { shouldValidate: true });
        setValue("zipCode", values.zipCode, { shouldValidate: true });

        dispatch(updateServiceAddress(values));
      }
    }
  }, [addresses, draftData]);

  // ─── Address select handler from dropdown ────────────────────────────────────
  const handleAddressSelect = (address: Address) => {
    const values = {
      streetAddress: address.streetAddress ?? "",
      apartment: address.apartmentUnit ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      zipCode: address.zipCode?.trim() ?? "",
    };

    setValue("streetAddress", values.streetAddress, { shouldValidate: true });
    setValue("apartment", values.apartment, { shouldValidate: true });
    setValue("city", values.city, { shouldValidate: true });
    setValue("state", values.state, { shouldValidate: true });
    setValue("zipCode", values.zipCode, { shouldValidate: true });

    dispatch(updateServiceAddress(values));
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const values = getValues();

    const resolvedEmail = draftData?.emailAddress || email || "";
    const resolvedFullName = draftData?.fullName || fullName || "";
    const resolvedPhone = draftData?.phoneNumber || phone || "";
    const resolvedPreferredContact =
      draftData?.preferredContactMethod || preferredContact || "Call";

    const payload = {
      fullName: resolvedFullName,
      emailAddress: resolvedEmail,
      phoneNumber: resolvedPhone,
      preferredContactMethod: resolvedPreferredContact,
      streetAddress: values.streetAddress || "",
      apartmentUnit: values.apartment || "",
      city: values.city || "",
      state: values.state || "",
      zipCode: values.zipCode || "",
      status: "draft" as const,
      completionPercentage,
    };

    try {
      if (serviceCallId) {
        await updateDraft(serviceCallId, serviceType, payload);
      } else {
        await createDraft(serviceType, {
          serviceType,
          ...payload,
          propertyType: "",
          ownershipStatus: "",
          timelineUrgency: "",
        });
      }

      toast.success("Draft saved successfully!");
      router.push("/(tabs)/home/saved-draft");
    } catch (err: any) {
      toast.error("Failed to save draft. Please try again.");
    }
  };

  // ─── Continue handler ────────────────────────────────────────────────────────
  const onSubmit = (values: ServiceAddressFormValues) => {
    dispatch(updateServiceAddress(values));
    router.push({
      pathname: "/(tabs)/quotes/quote/common/project-basics",
      params: { serviceType, serviceCallId },
    });
  };

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Top row: back button + address dropdown */}
        <View className="flex-row items-center justify-between">
          <BackButton
            onPress={() =>
              router.push({
                pathname: "/(tabs)/quotes/quote/common/contact-details",
                params: {
                  serviceType: serviceType,
                  serviceCallId: serviceCallId,
                },
              })
            }
          />
          <AddressDropdownSelector onSelect={handleAddressSelect} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(120) }}
        >
          <StepProgressBar currentStep={CURRENT_STEP} totalSteps={totalSteps} />

          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Your service address"
            subtitle="Where is the work needed?"
          />

          <Controller
            control={control}
            name="streetAddress"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="Street Address *"
                leftIcon="location-outline"
                error={errors.streetAddress?.message}
                textInputConfig={{
                  placeholder: "Enter your street address",
                  autoCapitalize: "words",
                  value,
                  onChangeText: (text) => onChange(text.trim()),
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="apartment"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="Apartment / Unit"
                leftIcon="business-outline"
                error={errors.apartment?.message}
                textInputConfig={{
                  placeholder: "Apt, suite, unit (optional)",
                  keyboardType: "default",
                  autoCapitalize: "none",
                  value,
                  onChangeText: onChange,
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="City *"
                leftIcon="map-outline"
                error={errors.city?.message}
                textInputConfig={{
                  placeholder: "Enter your city",
                  keyboardType: "default",
                  autoCapitalize: "words",
                  value,
                  onChangeText: (text) => onChange(text.trim()),
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="state"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="State *"
                leftIcon="flag-outline"
                error={errors.state?.message}
                textInputConfig={{
                  placeholder: "Enter your state",
                  keyboardType: "default",
                  autoCapitalize: "characters",
                  maxLength: 2,
                  value,
                  onChangeText: (text) => onChange(text.trim().toUpperCase()),
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="zipCode"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="Zip Code *"
                leftIcon="mail-open-outline"
                error={errors.zipCode?.message}
                textInputConfig={{
                  placeholder: "Enter your zip code",
                  keyboardType: "number-pad",
                  autoCapitalize: "none",
                  maxLength: 5,
                  value,
                  onChangeText: (text) => onChange(text.trim()),
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="isHomeAddress"
            render={({ field: { value, onChange } }) => (
              <TermsAndPolicy
                shouldShowTitle={false}
                subtitle="This is my home address"
                subtitleColor="#6b7280"
                value={value || false}
                onToggle={onChange}
              />
            )}
          />

          <InfoBanner />

          <GradientButton label="Continue" onPress={handleSubmit(onSubmit)} />

          <SavedEditAction
            onPress={handleSaveForLater}
            title={isSaving ? "Saving..." : "Save for Later"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

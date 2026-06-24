import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  selectCategory,
  updateOutletsDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { OutletRecord } from "@/src/types/quotes/outlet.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 6;
const TOTAL_STEPS = 8;

const OUTLET_TYPES = [
  "Standard (Rounded)",
  "Decorator (Rectangle)",
  "GFI",
  "Surge protected",
  "Floor",
  "Smart",
  "Night light",
  "I'll provide my own",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function OutletType() {
  const dispatch = useDispatch();
  const [localSelectedTypes, setLocalSelectedTypes] = useState<string[]>([]);
  const isInitialMount = useRef(true);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Outlets";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as OutletRecord | undefined;

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );
  const categoryData = useSelector(
    (state: RootState) => state.serviceForm.categoryData,
  );

  // ─── Animated refs ──────────────────────────────────────────────────────────
  const chipAnims = useRef(
    OUTLET_TYPES.map(() => new Animated.Value(1)),
  ).current;

  const animatePressIn = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.93,
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

  // ─── Ensure category is set ──────────────────────────────────────────────────
  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "15") {
      dispatch(selectCategory("15"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxOutletTypes =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.outletTypes || []
      : [];

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxOutletTypes.length > 0) {
      setLocalSelectedTypes(reduxOutletTypes);
    }
  }, [reduxOutletTypes]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.typeOfOutletsNeed) {
      // If draft has a string, split it into array
      const types = draft.typeOfOutletsNeed.split(", ").filter(Boolean);
      setLocalSelectedTypes(types);
      dispatch(updateOutletsDetails({ outletTypes: types }));
    }
    isInitialMount.current = false;
  }, [draft]);

  // ─── Toggle outlet type ─────────────────────────────────────────────────────
  const toggleOutletType = (type: string) => {
    const index = OUTLET_TYPES.indexOf(type);
    if (index !== -1) {
      animatePressIn(chipAnims[index]);
    }

    let newSelectedTypes;
    if (localSelectedTypes.includes(type)) {
      newSelectedTypes = localSelectedTypes.filter((t) => t !== type);
    } else {
      newSelectedTypes = [...localSelectedTypes, type];
    }
    setLocalSelectedTypes(newSelectedTypes);
    dispatch(updateOutletsDetails({ outletTypes: newSelectedTypes }));
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    // Get all data from Redux
    const details =
      categoryData?.categoryId === "15" ? (categoryData.details as any) : {};

    const payload = {
      fullName: draft?.fullName || fullName || "",
      emailAddress: draft?.emailAddress || email || "",
      phoneNumber: draft?.phoneNumber || phone || "",
      preferredContactMethod:
        draft?.preferredContactMethod || preferredContact || "Call",
      streetAddress: draft?.streetAddress || streetAddress || "",
      apartmentUnit: draft?.apartmentUnit || apartment || "",
      city: draft?.city || city || "",
      state: draft?.state || state || "",
      zipCode: draft?.zipCode || zipCode || "",
      propertyType: draft?.propertyType || propertyType || "",
      ownershipStatus: draft?.ownershipStatus || ownershipStatus || "",
      timelineUrgency: draft?.timelineUrgency || timeline || "",

      // Outlet specific fields - keep all data
      intendedUseOfOutlets: details.intendedUse || "",
      howManyOutletsNeeds: details.numberOfOutlets || "",
      newInstallationOrReplacement: details.installationType || "",
      photosOfWhereOutletsInstall: details.photosOfWhereOutletsInstall || [],
      typeOfOutletsNeed: localSelectedTypes.join(", ") || "",
      howManyAmps: details.ampsNeeded || "",
      ampsOrVoltsNeeded: details.voltsNeeded || "",
      NEMAConfiguration: details.NEMAConfiguration || "",
      additionalInformation: details.additionalInformation || "",

      status: "draft" as const,
      completionPercentage,
    };

    try {
      if (serviceCallId) {
        await updateDraft(serviceCallId, serviceType, createFormData(payload));
      } else {
        await createDraft(
          serviceType,
          createFormData({ serviceType, ...payload }),
        );
      }
      toast.success("Draft saved successfully!");
      router.push("/(tabs)/home/saved-draft");
    } catch (error: any) {
      console.log("Save draft error:", error);
      toast.error(
        error?.data?.message || "Failed to save draft. Please try again.",
      );
    }
  };

  const handleContinue = () => {
    if (localSelectedTypes.length > 0) {
      dispatch(updateOutletsDetails({ outletTypes: localSelectedTypes }));
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/outlets/outlet-additional",
      params: { serviceCallId, serviceType },
    });
  };

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BackButton
          onPress={() =>
            router.push({
              pathname: "/(tabs)/quotes/quote/outlets/outlet-install",
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Outlet Type"
            subtitle="What type of outlet(s) do you need?"
          />

          <Text className="text-base font-Inter_SemiBold text-[#1F2937] mb-4">
            What type of outlet(s) do you need? (Select all that apply)
          </Text>

          {/* ─── Chips Grid ──────────────────────────────────────────────────── */}
          <View className="flex-col gap-2 mb-6">
            {OUTLET_TYPES.map((type, index) => {
              const isSelected = localSelectedTypes.includes(type);
              return (
                <Animated.View
                  key={type}
                  style={{ transform: [{ scale: chipAnims[index] }] }}
                >
                  <Pressable
                    onPress={() => toggleOutletType(type)}
                    className="px-4 py-2 rounded-full border"
                    style={{
                      backgroundColor: isSelected ? "#60A5FA" : "#ffffff",
                      borderColor: isSelected ? "#60A5FA" : "#D1D5DB",
                    }}
                  >
                    <Text
                      className={`font-Inter_Medium text-sm ${
                        isSelected ? "text-white" : "text-[#1F2937]"
                      }`}
                    >
                      {type}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          <View className="mt-6">
            <GradientButton
              label="Continue"
              onPress={handleContinue}
              disabled={localSelectedTypes.length === 0 || isSaving}
            />
          </View>
          <SavedEditAction
            onPress={handleSaveForLater}
            title={isSaving ? "Saving..." : "Save for Later"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

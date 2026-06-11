import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import PhotoUploadSection from "@/src/components/quote/PhotoUploadSection";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { updateEVChargerDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { router } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function GeneratorPhotosNeeded() {
  const dispatch = useDispatch();

  const chargerAreaPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "2") return data?.details?.chargerAreaPhotos;
    return [];
  });
  const panelPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "2") return data?.details?.panelPhotos;
    return [];
  });

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <StepProgressBar currentStep={7} totalSteps={9} />
          <CategoryTag title="EV Charger Installation" />

          <AuthHeading title="Photos needed" subtitle="" />

          <PhotoUploadSection
            label="Upload photo of area you want EV charger installed"
            photos={chargerAreaPhotos || []}
            maxPhotos={1}
            onPhotosChange={(p) =>
              dispatch(updateEVChargerDetails({ chargerAreaPhotos: p }))
            }
          />

          <PhotoUploadSection
            label="Upload photos of your electrical panel up close so we can see the breakers/panel label and about 10 ft away"
            photos={panelPhotos || []}
            onPhotosChange={(p) =>
              dispatch(updateEVChargerDetails({ panelPhotos: p }))
            }
          />

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push("/(tabs)/quotes/quote/ev-charger/additional-info")
            }
          />
          <SavedEditAction />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

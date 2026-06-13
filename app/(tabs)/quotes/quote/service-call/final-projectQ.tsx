import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import InfoBanner from "@/src/components/quote/InfoBanner";
import MultiSelectList from "@/src/components/quote/MultiSelectList";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import {
  toggleSchedulingDay,
  updateServiceCallDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { router } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const DAYS = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays"];

export default function FinalProjectQuestions() {
  const dispatch = useDispatch();

  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );

  const schedulingDays = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;

    if (
      selectedCategory?.id === "1" &&
      data?.categoryId === "1" &&
      data.details
    ) {
      return data.details.schedulingDays;
    }
    return [] as string[];
  });

  const preferredTime = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (
      selectedCategory?.id === "1" &&
      data?.categoryId === "1" &&
      data.details
    ) {
      return data.details.preferredTime;
    }
    return "" as const;
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
          <StepProgressBar currentStep={5} />

          <CategoryTag title="Service Call" />

          <AuthHeading title="Final project questions" />

          <OptionGrid
            label="Preferred time for Service"
            options={["AM (8-11)", "PM (12-2)"]}
            selected={preferredTime ?? ""}
            onSelect={(val) =>
              dispatch(updateServiceCallDetails({ preferredTime: val as any }))
            }
            numColumns={1}
          />

          <MultiSelectList
            label="Scheduling preference"
            options={DAYS}
            selected={schedulingDays ?? []}
            onToggle={(val) => dispatch(toggleSchedulingDay(val))}
          />

          <InfoBanner message="You can add extra details and photos next." />

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push("/(tabs)/quotes/quote/service-call/upload-photos")
            }
          />
          <SavedEditAction />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

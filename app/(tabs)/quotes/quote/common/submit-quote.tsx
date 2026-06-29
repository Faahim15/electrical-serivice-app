import { successfull } from "@/assets/iocns/icon";
import ConfirmCheckbox from "@/src/components/quote/submit/ConfirmCheckbox";
import InfoCard from "@/src/components/quote/submit/InfoCard";
import SubmitButton from "@/src/components/quote/submit/SubmitButton";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { SERVICE_CATEGORIES } from "@/src/constants/tabs.home.constant";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import { clearServiceForm } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { buildPayload } from "@/src/utils/payloadBuilders";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

// ─── Helper to normalize service type ──────────────────────────────────────
const normalizeServiceType = (type?: string | null): string => {
  if (!type) return "Service Call";
  // Remove extra spaces, tabs, newlines and trim
  return type.replace(/\s+/g, " ").trim();
};

const SubmitQuoteRequest = () => {
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScaleAnim = useRef(new Animated.Value(0.6)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const checkboxAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Params ──────────────────────────────────────────────────────────────
  const { serviceCallId, serviceType } = useLocalSearchParams<{
    serviceCallId?: string;
    serviceType?: string;
  }>();

  // ⭐ Normalize service type
  const normalizedServiceType = normalizeServiceType(serviceType);

  const { updateDraft, createDraft } = useDraftSave();

  // ── draftData fetch ─────────────────────────────────────────────────────
  const { data: draftData, isLoading: isDraftLoading } = useDraftDetails(
    serviceCallId,
    normalizedServiceType,
  );

  // ── Redux ───────────────────────────────────────────────────────────────
  const selectedCategoryId = useSelector(
    (state: RootState) => state.serviceForm.selectedCategoryId,
  );
  const contactDetails = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const serviceAddress = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const projectBasics = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );
  const categoryData = useSelector(
    (state: RootState) => state.serviceForm.categoryData,
  );

  const selectedCategory = SERVICE_CATEGORIES.find(
    (c) => c.id === selectedCategoryId,
  );

  const preferredContactMap: Record<string, string> = {
    Call: "Phone Call",
    Text: "Text Message",
    Email: "Email",
  };

  const infoRows = [
    {
      label: "Selected Service",
      value: normalizedServiceType ?? selectedCategory?.title ?? "—",
    },
    {
      label: "Expected Response",
      value: "Within 24-48 hours",
    },
    {
      label: "Best Contact Method",
      value:
        preferredContactMap[contactDetails.preferredContact] ??
        contactDetails.preferredContact ??
        "—",
    },
  ];

  // ── Animations ──────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 350,
        delay: 80,
        useNativeDriver: true,
      }),
      Animated.timing(checkboxAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(btnAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCheck = () => {
    setChecked((prev) => {
      const next = !prev;
      Animated.spring(checkScale, {
        toValue: next ? 1 : 0,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }).start();
      return next;
    });
  };

  // ── Final Submit ────────────────────────────────────────────────────────
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // ⭐ Use normalized service type
      const resolvedServiceType = normalizedServiceType || "Service Call";
      const payload = buildPayload(
        resolvedServiceType,
        draftData,
        categoryData,
        contactDetails,
        serviceAddress,
        projectBasics,
      );

      if (serviceCallId) {
        await updateDraft(
          serviceCallId,
          resolvedServiceType,
          createFormData(payload),
        );
      } else {
        await createDraft(
          resolvedServiceType,
          createFormData({
            serviceType: resolvedServiceType,
            ...payload,
          }),
        );
      }

      dispatch(clearServiceForm());
      toast.success("Request submitted! We'll be in touch soon. 🎉");
      router.push("/(tabs)/quotes/quote/common/request-received");
    } catch (error: any) {
      console.log(error.data);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <View className="mt-[1%]">
        <BackButton
          onPress={() =>
            router.push({
              pathname: "/(tabs)/quotes/quote/common/review-request",
              params: { serviceCallId, serviceType: normalizedServiceType },
            })
          }
        />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
          <View className="flex-1 pb-6 justify-between">
            {/* Top Section */}
            <View className="items-center pt-10 pb-4">
              <Animated.View
                className="rounded-full bg-[#06B6D4] items-center justify-center mb-5 shadow-md"
                style={{
                  opacity: fadeAnim,
                  transform: [{ scale: iconScaleAnim }],
                }}
              >
                <SvgXml xml={successfull} width={88} height={88} />
              </Animated.View>

              <Animated.Text
                className="text-[#0F172A] text-2xl text-center mb-1 font-Inter_Bold"
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                Submit quote request
              </Animated.Text>
              <Animated.Text
                className="text-[#64748B] text-sm text-center font-Inter_Regular"
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                {`You're almost done`}
              </Animated.Text>
            </View>

            {/* Info Card */}
            <InfoCard rows={infoRows} cardAnim={cardAnim} />

            {/* Checkbox */}
            <ConfirmCheckbox
              checked={checked}
              onPress={handleCheck}
              checkScale={checkScale}
              checkboxAnim={checkboxAnim}
            />

            {/* Buttons */}
            <SubmitButton
              onPress={handleFinalSubmit}
              isSubmitting={isSubmitting}
              isDisabled={isSubmitting || isDraftLoading || !checked}
              btnAnim={btnAnim}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SubmitQuoteRequest;

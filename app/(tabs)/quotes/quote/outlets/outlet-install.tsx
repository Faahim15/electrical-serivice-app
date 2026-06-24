import { nemaChart } from "@/assets/images/svg/tabs-svg";
import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import PhotoUploadSection from "@/src/components/quote/PhotoUploadSection";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomSvg from "@/src/components/shared/CustomSvg";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  useDeleteImageMutation,
  useUploadImagesMutation,
} from "@/src/redux/api-slices/quote/quote-api";
import {
  selectCategory,
  updateOutletsDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { OutletRecord } from "@/src/types/quotes/outlet.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 5;
const TOTAL_STEPS = 8;

// ✅ Fix: Use "New Install" with capital 'I' to match backend
const INSTALL_TYPES = ["New Install", "Replacement"];
const AMPS = ["15", "20", "30", "50"];
const VOLTS = ["110 or 120", "220 or 240", "110/220 or 120/240"];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function OutletInstall() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"install" | null>(
    null,
  );
  const [localInstallType, setLocalInstallType] = useState("");
  const [localPhotos, setLocalPhotos] = useState<string[]>([]);
  const [localSelectedAmp, setLocalSelectedAmp] = useState("");
  const [localSelectedVolt, setLocalSelectedVolt] = useState("");
  const [localNemaConfig, setLocalNemaConfig] = useState("");
  const [isNemaVisible, setIsNemaVisible] = useState(false);
  const isInitialMount = useRef(true);
  const { width: screenWidth } = useWindowDimensions();

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

  const [uploadImages] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

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
  const installAnims = useRef(
    INSTALL_TYPES.map(() => new Animated.Value(1)),
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

  // ─── Ensure category is set ──────────────────────────────────────────────────
  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "15") {
      dispatch(selectCategory("15"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxInstallType =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.installationType || ""
      : "";
  const reduxPhotos =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.photosOfWhereOutletsInstall || []
      : [];
  const reduxAmp =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.ampsNeeded || ""
      : "";
  const reduxVolt =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.voltsNeeded || ""
      : "";
  const reduxNema =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.NEMAConfiguration || ""
      : "";

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxInstallType) setLocalInstallType(reduxInstallType);
  }, [reduxInstallType]);

  useEffect(() => {
    if (reduxAmp) setLocalSelectedAmp(reduxAmp);
  }, [reduxAmp]);

  useEffect(() => {
    if (reduxVolt) setLocalSelectedVolt(reduxVolt);
  }, [reduxVolt]);

  useEffect(() => {
    if (reduxNema) setLocalNemaConfig(reduxNema);
  }, [reduxNema]);

  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPhotos) !== JSON.stringify(localPhotos);
    if (photosChanged && !isInitialMount.current) {
      setLocalPhotos(reduxPhotos);
    }
  }, [reduxPhotos]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.newInstallationOrReplacement) {
      setLocalInstallType(draft.newInstallationOrReplacement);
      dispatch(
        updateOutletsDetails({
          installationType: draft.newInstallationOrReplacement,
        }),
      );
    }
    if (draft.photosOfWhereOutletsInstall?.length) {
      setLocalPhotos(draft.photosOfWhereOutletsInstall);
      dispatch(
        updateOutletsDetails({
          photosOfWhereOutletsInstall: draft.photosOfWhereOutletsInstall,
        }),
      );
    }
    if (draft.howManyAmps) {
      setLocalSelectedAmp(draft.howManyAmps);
      dispatch(updateOutletsDetails({ ampsNeeded: draft.howManyAmps }));
    }
    if (draft.ampsOrVoltsNeeded) {
      setLocalSelectedVolt(draft.ampsOrVoltsNeeded);
      dispatch(updateOutletsDetails({ voltsNeeded: draft.ampsOrVoltsNeeded }));
    }
    if (draft.NEMAConfiguration) {
      setLocalNemaConfig(draft.NEMAConfiguration);
      dispatch(
        updateOutletsDetails({ NEMAConfiguration: draft.NEMAConfiguration }),
      );
    }
    isInitialMount.current = false;
  }, [draft]);

  // ─── Upload helpers ──────────────────────────────────────────────────────────
  const uploadImage = async (localUri: string): Promise<string> => {
    const formData = new FormData();
    formData.append("images", {
      uri: localUri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);
    const res = await uploadImages(formData).unwrap();
    return res.data[0];
  };

  const handleInstallUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("install");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      return url;
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const deleteImageHandler = async (imageUrl: string) => {
    await deleteImage({ imageUrl }).unwrap();
  };

  // ─── Photo change handlers ──────────────────────────────────────────────────
  const handlePhotosChange = (photos: string[]) => {
    setLocalPhotos(photos);
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
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
      // ✅ Fix: Use "New Install" with capital 'I'
      newInstallationOrReplacement: localInstallType || "",
      photosOfWhereOutletsInstall: localPhotos || [],
      howManyAmps: localSelectedAmp || "",
      ampsOrVoltsNeeded: localSelectedVolt || "",
      NEMAConfiguration: localNemaConfig || "",
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
    if (localInstallType) {
      dispatch(updateOutletsDetails({ installationType: localInstallType }));
    }
    if (localPhotos.length > 0) {
      dispatch(
        updateOutletsDetails({ photosOfWhereOutletsInstall: localPhotos }),
      );
    }
    if (localSelectedAmp) {
      dispatch(updateOutletsDetails({ ampsNeeded: localSelectedAmp }));
    }
    if (localSelectedVolt) {
      dispatch(updateOutletsDetails({ voltsNeeded: localSelectedVolt }));
    }
    if (localNemaConfig) {
      dispatch(updateOutletsDetails({ NEMAConfiguration: localNemaConfig }));
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/outlets/outlet-type",
      params: { serviceCallId, serviceType },
    });
  };

  // ─── Render installation type options ──────────────────────────────────────
  const renderInstallOptions = () => {
    return INSTALL_TYPES.map((item, index) => {
      const isSelected = localInstallType === item;
      return (
        <Animated.View
          key={item}
          style={{ transform: [{ scale: installAnims[index] }] }}
        >
          <Pressable
            onPress={() => {
              animatePressIn(installAnims[index]);
              setLocalInstallType(item);
              dispatch(updateOutletsDetails({ installationType: item }));
              // Clear new install fields when switching to Replacement
              if (item === "Replacement") {
                setLocalSelectedAmp("");
                setLocalSelectedVolt("");
                setLocalNemaConfig("");
                dispatch(
                  updateOutletsDetails({
                    ampsNeeded: "",
                    voltsNeeded: "",
                    NEMAConfiguration: "",
                  }),
                );
              }
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
    });
  };

  // ─── Render AMP options ─────────────────────────────────────────────────────
  const renderAmpOptions = () => {
    return AMPS.map((amp, index) => {
      const isSelected = localSelectedAmp === amp;
      return (
        <Animated.View
          key={amp}
          style={{ transform: [{ scale: ampAnims[index] }] }}
        >
          <Pressable
            onPress={() => {
              animatePressIn(ampAnims[index]);
              setLocalSelectedAmp(amp);
              dispatch(updateOutletsDetails({ ampsNeeded: amp }));
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
    });
  };

  // ─── Render VOLT options ────────────────────────────────────────────────────
  const renderVoltOptions = () => {
    return VOLTS.map((volt, index) => {
      const isSelected = localSelectedVolt === volt;
      return (
        <Animated.View
          key={volt}
          style={{ transform: [{ scale: voltAnims[index] }] }}
        >
          <Pressable
            onPress={() => {
              animatePressIn(voltAnims[index]);
              setLocalSelectedVolt(volt);
              dispatch(updateOutletsDetails({ voltsNeeded: volt }));
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
              pathname: "/(tabs)/quotes/quote/outlets/outlets-details",
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(132) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Installation Type"
            subtitle="Is this a new install or replacement?"
          />

          {/* ─── Installation Type Options ──────────────────────────────────── */}
          <Text className="text-base font-Inter_SemiBold text-[#1F2937] mb-3">
            Is this a new install or replacement?
          </Text>
          {renderInstallOptions()}

          {/* ─── Photo Upload Section ───────────────────────────────────────── */}
          <Text className="text-base font-Inter_SemiBold text-[#1F2937] mt-5 mb-3">
            Photos
          </Text>
          <PhotoUploadSection
            label="Please upload photos of where the outlet(s) will be installed."
            photos={localPhotos}
            onPhotosChange={handlePhotosChange}
            onUploadSingle={handleInstallUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "install"}
          />

          {/* ─── Amps — only for New Install ────────────────────────────────── */}
          {localInstallType === "New Install" && (
            <>
              <Text className="text-base font-Inter_SemiBold text-[#1F2937] mt-5 mb-3">
                How many Amps?
              </Text>
              {renderAmpOptions()}

              {/* Volts */}
              <Text className="text-base font-Inter_SemiBold text-[#1F2937] mt-5 mb-3">
                How many amps/volts do you need?
              </Text>
              {renderVoltOptions()}

              {/* NEMA */}
              <Pressable onPress={() => setIsNemaVisible(true)}>
                <Text className="text-base font-Inter_SemiBold text-[#1F2937] mt-5 mb-4">
                  What is the NEMA configuration for the receptacle (if there
                  will be one)? <Text style={{ color: "#60A5FA" }}>ⓘ</Text>
                </Text>
              </Pressable>
              <TextInput
                value={localNemaConfig}
                onChangeText={(v) => {
                  setLocalNemaConfig(v);
                  dispatch(updateOutletsDetails({ NEMAConfiguration: v }));
                }}
                keyboardType="numeric"
                placeholder="14-50, 6-50, 14-30, unsure, etc."
                placeholderTextColor="#9CA3AF"
                className="font-Inter_Regular text-sm text-gray-800 bg-[#F8FAFC] rounded-xl px-4 py-4"
                style={{
                  borderWidth: 1.5,
                  borderColor: "#E5E7EB",
                }}
              />

              {/* NEMA Chart Modal */}
              {isNemaVisible && (
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
                      onPress={() => setIsNemaVisible(false)}
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

          <View className="mt-6">
            <GradientButton
              label="Continue"
              onPress={handleContinue}
              disabled={isSaving || uploadingSection !== null}
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

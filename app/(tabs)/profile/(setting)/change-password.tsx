import { GradientButton } from "@/src/components/onboarding/GradientButton";
import CustomInput from "@/src/components/shared/CustomInput";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { useChangePasswordMutation } from "@/src/redux/api-slices/profile/profile-api";
import { verticalScale } from "@/src/utils/Scaling";
import Feather from "@expo/vector-icons/build/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { z } from "zod";

// ── helpers ───────────────────────────────────────────────────────────────────
const CRITERIA = [
  {
    id: "len",
    label: "At least 8 characters",
    test: (v: string) => v.length >= 8,
  },
  {
    id: "upper",
    label: "Uppercase letter (A–Z)",
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    id: "lower",
    label: "Lowercase letter (a–z)",
    test: (v: string) => /[a-z]/.test(v),
  },
  { id: "num", label: "Number (0–9)", test: (v: string) => /[0-9]/.test(v) },
  {
    id: "sym",
    label: "Special character (!@#$…)",
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
];

const LEVELS = [
  { max: 1, label: "Weak", color: "#ff3b30" },
  { max: 2, label: "Fair", color: "#ff9500" },
  { max: 4, label: "Good", color: "#ffcc00" },
  { max: 5, label: "Strong", color: "#34c759" },
];

function getLevel(score: number) {
  return LEVELS.find((l) => score <= l.max) ?? LEVELS[LEVELS.length - 1];
}

// ── schema ────────────────────────────────────────────────────────────────────
const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters long"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ── component ─────────────────────────────────────────────────────────────────
export default function ChangePassword() {
  const insets = useSafeAreaInsets();
  const [serverError, setServerError] = useState<string | null>(null);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");
  const metCount = CRITERIA.filter((c) => c.test(newPasswordValue)).length;
  const level = getLevel(metCount);
  const allCriteriaMet = metCount === CRITERIA.length;
  const showMeter = newPasswordValue.length > 0 && !allCriteriaMet;

  const onSubmit = async (data: ChangePasswordFormData) => {
    setServerError(null);
    try {
      await changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Password updated successfully!");
      router.dismissAll();
      router.replace("/auth/sign-in");
    } catch (err: any) {
      const message =
        err?.data?.message || "Something went wrong. Please try again.";
      setServerError(message);
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={{ paddingTop: insets.top }}
        className="flex-row justify-between items-center pb-2"
      >
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </Pressable>
        <Text className="text-2xl text-[#111827] font-Inter_Bold">
          Change Password
        </Text>
        <View />
      </View>

      <View style={{ flex: 1, marginTop: verticalScale(50), width: "100%" }}>
        <View
          style={{ width: "100%" }}
          className="bg-white rounded-[20px] px-5 py-5 gap-1 shadow-md"
        >
          {/* Server Error Banner */}
          {serverError && (
            <View className="bg-red-50 rounded-xl px-4 py-3 mb-2 flex-row items-center gap-2">
              <Feather name="alert-circle" size={15} color="#EF4444" />
              <Text className="text-red-500 text-sm font-Inter_Regular flex-1">
                {serverError}
              </Text>
            </View>
          )}

          {/* Current Password */}
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="Current Password"
                error={errors.currentPassword?.message}
                textInputConfig={{
                  value,
                  onChangeText: onChange,
                  placeholder: "Enter current password",
                  secureTextEntry: true,
                  autoCapitalize: "none",
                }}
              />
            )}
          />

          {/* New Password */}
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="New Password"
                error={errors.newPassword?.message}
                textInputConfig={{
                  value,
                  onChangeText: onChange,
                  placeholder: "Enter new password",
                  secureTextEntry: true,
                  autoCapitalize: "none",
                }}
              />
            )}
          />

          {/* Strength Meter */}
          {showMeter && (
            <View className="px-1 mb-3 -mt-2">
              <View className="flex-row mt-[2%] gap-x-1.5 mb-1.5">
                {[1, 2, 3, 4].map((seg) => (
                  <View
                    key={seg}
                    className="flex-1 h-1 rounded-full"
                    style={{
                      backgroundColor:
                        metCount >= seg ? level.color : "#e5e5ea",
                    }}
                  />
                ))}
              </View>

              <Text
                className="text-xs font-Inter_SemiBold mb-2"
                style={{ color: level.color }}
              >
                {level.label}
              </Text>

              {CRITERIA.map((c) => {
                const met = c.test(newPasswordValue);
                return (
                  <View
                    key={c.id}
                    className="flex-row items-center gap-x-2 mb-1"
                  >
                    <View
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: met ? "#34c759" : "transparent",
                        borderWidth: 1.5,
                        borderColor: met ? "#34c759" : "#c7c7cc",
                      }}
                    />
                    <Text
                      className="font-Inter_Regular text-xs"
                      style={{ color: met ? "#34c759" : "#8e8e93" }}
                    >
                      {c.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Confirm New Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="Confirm New Password"
                error={errors.confirmPassword?.message}
                textInputConfig={{
                  value,
                  onChangeText: onChange,
                  placeholder: "Confirm new password",
                  secureTextEntry: true,
                  autoCapitalize: "none",
                }}
              />
            )}
          />
        </View>

        <View className="mt-[5%]">
          <GradientButton
            label={isLoading ? "Updating..." : "Update Password"}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

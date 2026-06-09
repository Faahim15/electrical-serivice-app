import AuthHeading from "@/src/components/auth/AuthHeading";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import CustomInput from "@/src/components/shared/CustomInput";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { useResetPasswordMutation } from "@/src/redux/api-slices/auth/auth-api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { toast } from "sonner-native";

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

// ── component ─────────────────────────────────────────────────────────────────
const ResetPassword = () => {
  const { token } = useLocalSearchParams<{ token: string }>();

  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const metCount = CRITERIA.filter((c) => c.test(newpassword)).length;
  const level = getLevel(metCount);

  const allMet = metCount === CRITERIA.length;
  const allCriteriaMet = metCount === CRITERIA.length;
  const showMeter = newpassword.length > 0 && !allCriteriaMet;
  const handleSave = async () => {
    if (!allMet) {
      toast.error("Please meet all password requirements.");
      return;
    }
    if (newpassword !== confirmpassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await resetPassword({
        resetPasswordToken: token,
        newPassword: newpassword,
      }).unwrap();
      toast.success("Password reset successfully!");
      router.replace("/auth/sign-in");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(
        error?.data?.message ?? "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="mt-[30%] justify-center">
          <AuthHeading title="Reset Password" subtitle="Change your password" />
        </View>

        <View>
          {/* ── New Password ── */}
          <CustomInput
            label="New Password"
            leftIcon="lock-closed-outline"
            textInputConfig={{
              placeholder: "Enter your new password",
              secureTextEntry: true,
              value: newpassword,
              onChangeText: setNewPassword,
            }}
          />

          {/* ── Strength meter ── */}
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
                const met = c.test(newpassword);
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

          {/* ── Confirm Password ── */}
          <CustomInput
            label="Confirm Password"
            leftIcon="lock-closed-outline"
            textInputConfig={{
              placeholder: "Enter confirm password",
              secureTextEntry: true,
              value: confirmpassword,
              onChangeText: setConfirmPassword,
            }}
          />

          {/* ── Mismatch hint ── */}
          {confirmpassword.length > 0 && newpassword !== confirmpassword && (
            <Text
              className="text-xs font-Inter_Regular px-1 -mt-2 mb-2"
              style={{ color: "#ff3b30" }}
            >
              Passwords do not match.
            </Text>
          )}
        </View>

        <View className="mt-[3%]">
          <GradientButton
            label="Save"
            onPress={handleSave}
            isLoading={isLoading}
            disabled={!allMet || newpassword !== confirmpassword || isLoading}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ResetPassword;

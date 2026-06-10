import { verifyAccountIcon, verifyIcon } from "@/assets/images/svg/auth-svg";
import AuthFooter from "@/src/components/auth/AuthFooter";
import AuthHeading from "@/src/components/auth/AuthHeading";
import ChangeEmail from "@/src/components/auth/ChangeEmail";
import OtpField from "@/src/components/auth/OtpField";
import SignUpLink from "@/src/components/auth/SignUpLink";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import CustomSvg from "@/src/components/shared/CustomSvg";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/src/redux/api-slices/auth/auth-api";
import { scale, verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

const VerifyAccount = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(""));

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const maskedEmail = email
    ? email.replace(
        /^(.{2})(.*)(@.*)$/,
        (_, a, b, c) => a + "*".repeat(b.length) + c,
      )
    : "your email";

  const handleVerify = async () => {
    const otp = otpValue.join("");
    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }
    try {
      const res = await verifyOtp({ userEmail: email, otp }).unwrap();

      await SecureStore.setItemAsync("token", res.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);

      toast.success("Account verified successfully!");
      router.push("/(tabs)/home");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(
        error?.data?.message ?? "Something went wrong. Please try again.",
      );
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    try {
      await resendOtp({ userEmail: email }).unwrap();
      toast.success("A new OTP has been sent to your email.");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(
        error?.data?.message ?? "Failed to resend OTP. Please try again.",
      );
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="justify-center items-center mt-[10%]">
          <CustomSvg
            xml={verifyIcon}
            height={verticalScale(144)}
            width={scale(144)}
          />
        </View>
        <View className="items-center ml-[5%]">
          <AuthHeading
            title="Verify your account"
            subtitle="Enter the 6-digit code sent to your email to continue."
          />
          <AuthFooter
            iconXml={verifyAccountIcon}
            iconWidth={scale(16)}
            iconHeight={verticalScale(16)}
            title="Code sent to"
            subtitle={maskedEmail}
          />
        </View>

        <OtpField onOtpChange={setOtpValue} />

        <SignUpLink
          title="Didn't receive the code?"
          subtitle={isResending ? "Sending..." : "Resend"}
          onPress={handleResend}
        />

        <View className="mt-[3%]">
          <GradientButton
            label="Verify"
            onPress={handleVerify}
            isLoading={isVerifying}
            disabled={otpValue.join("").length < 6}
          />
        </View>

        <ChangeEmail />
      </View>
    </ScreenWrapper>
  );
};

export default VerifyAccount;

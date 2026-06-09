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
  useResendForgotPasswordOtpMutation,
  useVerifyForgotPasswordOtpMutation,
} from "@/src/redux/api-slices/auth/auth-api";
import { scale, verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

const VerifyForgotPassword = () => {
  const { email, token } = useLocalSearchParams<{
    email: string;
    token: string;
  }>();
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(""));

  const [verifyForgotPasswordOtp, { isLoading: isVerifying }] =
    useVerifyForgotPasswordOtpMutation();
  const [resendForgotPasswordOtp, { isLoading: isResending }] =
    useResendForgotPasswordOtpMutation();

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
      const response = await verifyForgotPasswordOtp({ token, otp }).unwrap();
      toast.success("OTP verified!");
      router.replace({
        pathname: "/auth/reset-password",
        params: { token: response.data.resetPasswordToken },
      });
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
      await resendForgotPasswordOtp({ token }).unwrap();
      toast.success("A new code has been sent to your email.");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(
        error?.data?.message ?? "Failed to resend. Please try again.",
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
            title="Forgot your password?"
            subtitle="Enter your email address and we'll send you a verification code to reset your password."
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

export default VerifyForgotPassword;

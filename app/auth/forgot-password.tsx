import { forgotPasswordIcon } from "@/assets/images/svg/auth-svg";
import AuthFooter from "@/src/components/auth/AuthFooter";
import AuthHeading from "@/src/components/auth/AuthHeading";
import BackToSignIn from "@/src/components/auth/BackToSignIn";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import CustomInput from "@/src/components/shared/CustomInput";
import CustomSvg from "@/src/components/shared/CustomSvg";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { useForgotPasswordMutation } from "@/src/redux/api-slices/auth/auth-api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/src/schemas/auth/forgotPasswordSchema";
import { scale, verticalScale } from "@/src/utils/Scaling";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { toast } from "sonner-native";

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onSubmit = async (formData: ForgotPasswordFormData) => {
    try {
      const res = await forgotPassword({ email: formData.email }).unwrap();
      toast.success("Verification code sent! Please check your email.");
      router.replace({
        pathname: "/auth/verify-forgot-password",
        params: {
          email: formData.email,
          token: res.data.token,
        },
      });
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
        <View className="justify-center items-center mt-[20%]">
          <CustomSvg
            xml={forgotPasswordIcon}
            height={verticalScale(128)}
            width={scale(128)}
          />
        </View>

        <View>
          <AuthHeading
            title="Forgot your password?"
            subtitle="Enter your email address and we'll send you a verification code to reset your password."
          />
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Email Address"
              labelColor="#0F172A"
              leftIcon="mail-outline"
              error={errors.email?.message}
              textInputConfig={{
                placeholder: "Enter your email",
                keyboardType: "email-address",
                autoCapitalize: "none",
                value,
                onChangeText: onChange,
                onBlur,
              }}
            />
          )}
        />

        <View>
          <AuthFooter />
        </View>

        <View className="mt-[4%]">
          <GradientButton
            label="Send Code"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />
        </View>

        <BackToSignIn />
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

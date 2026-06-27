import {
  appIcon,
  appleIconXml,
  googleIconXml,
} from "@/assets/images/svg/auth-svg";
import Apptext from "@/src/components/auth/Apptext";
import AuthHeading from "@/src/components/auth/AuthHeading";
import Divider from "@/src/components/auth/Divider";
import Footer from "@/src/components/auth/Footer";
import ForgotPassword from "@/src/components/auth/ForgotPassword";
import SignUpLink from "@/src/components/auth/SignUpLink";
import SocialButton from "@/src/components/auth/SocialButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import CustomInput from "@/src/components/shared/CustomInput";
import CustomSvg from "@/src/components/shared/CustomSvg";
import { useFCMToken } from "@/src/hooks/useFCMToken";
import { useSigninMutation } from "@/src/redux/api-slices/auth/auth-api";
import {
  signInSchema,
  type SignInFormData,
} from "@/src/schemas/auth/signInSchema";
import { scale, verticalScale } from "@/src/utils/Scaling";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { toast } from "sonner-native";
export default function LoginScreen() {
  const [signin, { isLoading }] = useSigninMutation();
  const { fcmToken } = useFCMToken();

  console.log({ fcmToken });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (formData: SignInFormData) => {
    try {
      const res = await signin({
        email: formData.email,
        password: formData.password,
        fcmToken: fcmToken ?? "using emulator",
      }).unwrap();

      await SecureStore.setItemAsync("token", res.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);

      toast.success("Welcome back!");
      router.replace("/(tabs)/home");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(
        error?.data?.message ?? "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <LinearGradient
      colors={["#F9FBFD", "#E0F2FE"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-[6%] pt-[10%] pb-[9%]">
            {/* Logo */}
            <View className="items-center">
              <CustomSvg
                xml={appIcon}
                height={verticalScale(92)}
                width={scale(158)}
              />
            </View>

            {/* Brand Name */}
            <Apptext
              title="Four Elements Electric"
              className="font-Inter_Bold text-center text-2xl"
            />

            {/* Heading */}
            <AuthHeading
              title="Welcome back"
              subtitle="Sign in to manage quotes, reminders, saved services, and notifications."
            />

            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Email Address"
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

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Password"
                  leftIcon="lock-closed-outline"
                  error={errors.password?.message}
                  textInputConfig={{
                    placeholder: "Enter your password",
                    secureTextEntry: true,
                    value,
                    onChangeText: onChange,
                    onBlur,
                  }}
                />
              )}
            />

            {/* Remember Me + Forgot Password */}
            <ForgotPassword
              onPress={() => router.push("/auth/forgot-password")}
              title="Remember me"
              subtitle="Forgot Password?"
            />

            {/* Sign In Button */}
            <GradientButton
              label="Sign In"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
            />

            {/* Divider */}
            <Divider title="or continue with" />

            {/* Social Buttons */}
            <View className="gap-3">
              <SocialButton
                onPress={() => {}}
                label="Continue with Google"
                svgXml={googleIconXml}
              />
              <SocialButton
                onPress={() => {}}
                label="Continue with Apple"
                svgXml={appleIconXml}
              />
            </View>

            {/* Sign Up Link */}
            <SignUpLink
              onPress={() => router.push("/auth/sign-up")}
              title="Don't have an account?"
              subtitle="Sign Up"
            />

            {/* Footer */}
            <Footer />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

import {
  appleIconXml,
  createAccountIcon,
  googleIconXml,
} from "@/assets/images/svg/auth-svg";
import AuthHeading from "@/src/components/auth/AuthHeading";
import Divider from "@/src/components/auth/Divider";
import Footer from "@/src/components/auth/Footer";
import SignInLink from "@/src/components/auth/SignUpLink";
import SocialButton from "@/src/components/auth/SocialButton";
import TermsAndPolicy from "@/src/components/auth/TermsAndPolicy";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import CustomInput from "@/src/components/shared/CustomInput";
import CustomSvg from "@/src/components/shared/CustomSvg";
import PhoneInput from "@/src/components/shared/PhoneInput";
import { useFCMToken } from "@/src/hook/useFCMToken";
import { useSignupMutation } from "@/src/redux/api-slices/auth/auth-api";
import {
  signUpSchema,
  type SignUpFormData,
} from "@/src/schemas/auth/signUpSchema";
import { scale, verticalScale } from "@/src/utils/Scaling";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { toast } from "sonner-native";

// ── helpers ──────────────────────────────────────────────────────────────────
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
export default function SignUpScreen() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signup, { isLoading }] = useSignupMutation();
  const { fcmToken } = useFCMToken();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const passwordValue = watch("password");
  const metCount = CRITERIA.filter((c) => c.test(passwordValue)).length;
  const level = getLevel(metCount);
  const allCriteriaMet = metCount === CRITERIA.length;
  const showMeter = passwordValue.length > 0 && !allCriteriaMet;

  const onSubmit = async (formData: SignUpFormData) => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        fcmToken: fcmToken ?? "using emulator",
      };

      await signup(payload).unwrap();

      toast.success(
        "Account created successfully. Please check your email and enter the OTP to verify your account",
      );

      router.replace({
        pathname: "/auth/verify-account",
        params: { email: formData.email.trim() },
      });
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        data?: {
          message?: string;
          isVerified?: boolean;
        };
      };

      const isVerified = error?.data?.isVerified;
      const message =
        error?.data?.message ?? "Something went wrong. Please try again.";
      toast.error(message);
      if (error.status === 400 && !isVerified) {
        router.replace({
          pathname: "/auth/verify-account",
          params: { email: formData.email.trim() },
        });
        return;
      }
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
                xml={createAccountIcon}
                height={verticalScale(92)}
                width={scale(108)}
              />
            </View>

            {/* Heading */}
            <AuthHeading
              title="Create your account"
              subtitle="Set up your profile to request quotes faster, track reminders, and save helpful resources."
            />

            {/* Full Name Input */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Full Name"
                  leftIcon="person-outline"
                  error={errors.name?.message}
                  textInputConfig={{
                    placeholder: "Enter your full name",
                    autoCapitalize: "words",
                    value,
                    onChangeText: onChange,
                    onBlur,
                  }}
                />
              )}
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

            {/* Phone Number Input */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <PhoneInput
                  label="Phone Number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
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
                    placeholder: "Create a password",
                    secureTextEntry: true,
                    value,
                    onChangeText: onChange,
                    onBlur,
                  }}
                />
              )}
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
                  const met = c.test(passwordValue);
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

            {/* Confirm Password Input */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Confirm Password"
                  leftIcon="lock-closed-outline"
                  error={errors.confirmPassword?.message}
                  textInputConfig={{
                    placeholder: "Confirm your password",
                    secureTextEntry: true,
                    value,
                    onChangeText: onChange,
                    onBlur,
                  }}
                />
              )}
            />

            {/* Terms & Privacy Policy */}
            <TermsAndPolicy
              value={termsAccepted}
              onToggle={() => setTermsAccepted((prev) => !prev)}
              onPressTerms={() =>
                router.push("/shared/termsAndCondition" as any)
              }
            />

            {/* Create Account Button */}
            <GradientButton
              onPress={handleSubmit(onSubmit)}
              label="Create Account"
              isLoading={isLoading}
              disabled={!termsAccepted}
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

            {/* Sign In Link */}
            <SignInLink
              onPress={() => router.push("/auth/sign-in")}
              title="Already have an account?"
              subtitle="Sign In"
            />

            {/* Footer */}
            <Footer />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

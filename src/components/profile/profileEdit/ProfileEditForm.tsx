import { useGetProfileQuery } from "@/src/redux/api-slices/home/home-api";
import { useUpdateProfileMutation } from "@/src/redux/api-slices/profile/profile-api";
import EvilIcons from "@expo/vector-icons/build/EvilIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { toast } from "sonner-native";
import { z } from "zod";
import { GradientButton } from "../../onboarding/GradientButton";
import CustomInput from "../../shared/CustomInput";
import LinearButton from "../../shared/LinearButton";

// ── schema ────────────────────────────────────────────────
const addressSchema = z.object({
  addressName: z.string().min(1, "Location nickname is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  apartmentUnit: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  isDefault: z.boolean(),
});

const profileSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  addresses: z.array(addressSchema),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ── component ─────────────────────────────────────────────
const ProfileEditForm: React.FC = () => {
  const { data } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const profile = data?.data;
  const initialDataRef = useRef<ProfileFormData | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      addresses: [
        {
          addressName: "",
          streetAddress: "",
          apartmentUnit: "",
          city: "",
          state: "",
          zipCode: "",
          isDefault: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  // populate form with existing profile data
  useEffect(() => {
    if (profile) {
      const initialData: ProfileFormData = {
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        addresses:
          profile.addresses?.length > 0
            ? profile.addresses.map((addr) => ({
                addressName: addr.addressName ?? "",
                streetAddress: addr.streetAddress ?? "",
                apartmentUnit: addr.apartmentUnit ?? "",
                city: addr.city ?? "",
                state: addr.state ?? "",
                zipCode: addr.zipCode ?? "",
                isDefault: addr.isDefault ?? false,
              }))
            : [
                {
                  addressName: "",
                  streetAddress: "",
                  apartmentUnit: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  isDefault: true,
                },
              ],
      };

      initialDataRef.current = initialData;
      reset(initialData);
    }
  }, [profile, reset]);

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      const hasChanges =
        JSON.stringify(formData) !== JSON.stringify(initialDataRef.current);

      if (!hasChanges) {
        toast.info("No changes detected");
        return;
      }

      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        addresses: formData.addresses,
      }).unwrap();

      toast.success("Profile updated successfully!");

      // Update reference data after successful save
      initialDataRef.current = formData;
    } catch (err: any) {
      const message =
        err?.data?.message || "Something went wrong. Please try again.";

      toast.error(message);
    }
  };

  return (
    <View className="flex-1 flex-col gap-4">
      {/* Profile Info Card */}
      <View className="bg-white rounded-[20px] px-5 py-5 gap-1 shadow-md">
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <CustomInput
              label="Full Name"
              error={errors.name?.message}
              textInputConfig={{
                value,
                onChangeText: onChange,
                placeholder: "Enter your full name",
                autoCapitalize: "words",
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange } }) => (
            <CustomInput
              label="Phone Number"
              error={errors.phone?.message}
              textInputConfig={{
                value,
                onChangeText: onChange,
                placeholder: "Enter your phone number",
                keyboardType: "phone-pad",
                autoCapitalize: "none",
              }}
            />
          )}
        />
      </View>

      {/* Service Addresses */}
      {fields.map((field, index) => (
        <View
          key={field.id}
          className="bg-white rounded-[20px] px-5 py-5 gap-1 shadow-md"
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-[6px]">
              <EvilIcons name="location" size={24} color="#6B7280" />
              <Text className="text-[16px] font-Inter_SemiBold text-[#111827] tracking-[-0.3px]">
                {index === 0
                  ? "Service Address"
                  : `Service Address ${index + 1}`}
              </Text>
            </View>

            {index > 0 && (
              <Pressable
                onPress={() => remove(index)}
                className="bg-red-50 px-3 py-1 rounded-full border border-red-200"
              >
                <Text className="text-red-500 text-xs font-semibold">
                  Remove
                </Text>
              </Pressable>
            )}
          </View>

          <Controller
            control={control}
            name={`addresses.${index}.addressName`}
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="Location NickName"
                error={errors.addresses?.[index]?.addressName?.message}
                textInputConfig={{
                  value,
                  onChangeText: onChange,
                  placeholder: "Home/Office",
                  autoCapitalize: "none",
                }}
              />
            )}
          />

          <Controller
            control={control}
            name={`addresses.${index}.streetAddress`}
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="Street Address"
                error={errors.addresses?.[index]?.streetAddress?.message}
                textInputConfig={{
                  value,
                  onChangeText: onChange,
                  placeholder: "123 Main Street",
                  autoCapitalize: "none",
                }}
              />
            )}
          />

          <Controller
            control={control}
            name={`addresses.${index}.apartmentUnit`}
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="Apartment / Unit (Optional)"
                textInputConfig={{
                  value: value ?? "",
                  onChangeText: onChange,
                  placeholder: "Apt 4B",
                  autoCapitalize: "none",
                }}
              />
            )}
          />

          <Controller
            control={control}
            name={`addresses.${index}.city`}
            render={({ field: { value, onChange } }) => (
              <CustomInput
                label="City"
                error={errors.addresses?.[index]?.city?.message}
                textInputConfig={{
                  value,
                  onChangeText: onChange,
                  placeholder: "San Francisco",
                  autoCapitalize: "none",
                }}
              />
            )}
          />

          <View className="flex-row gap-2 items-center justify-between">
            <View className="w-[45%]">
              <Controller
                control={control}
                name={`addresses.${index}.state`}
                render={({ field: { value, onChange } }) => (
                  <CustomInput
                    label="State"
                    error={errors.addresses?.[index]?.state?.message}
                    textInputConfig={{
                      value,
                      onChangeText: onChange,
                      placeholder: "CA",
                      autoCapitalize: "none",
                    }}
                  />
                )}
              />
            </View>
            <View className="w-[45%]">
              <Controller
                control={control}
                name={`addresses.${index}.zipCode`}
                render={({ field: { value, onChange } }) => (
                  <CustomInput
                    label="ZIP Code"
                    error={errors.addresses?.[index]?.zipCode?.message}
                    textInputConfig={{
                      value,
                      onChangeText: onChange,
                      placeholder: "255852",
                      autoCapitalize: "none",
                    }}
                  />
                )}
              />
            </View>
          </View>

          {/* Add button only on last card */}
          {index === fields.length - 1 && (
            <Pressable
              className="border border-[#E2E8F0] bg-[#F6F6F6] h-[54px] justify-center items-center rounded-2xl"
              onPress={() =>
                append({
                  addressName: "",
                  streetAddress: "",
                  apartmentUnit: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  isDefault: false,
                })
              }
            >
              <Text className="text-[16px] tracking-[0.2px] text-[#6B7280] font-Inter_Medium">
                Add Other Location
              </Text>
            </Pressable>
          )}
        </View>
      ))}

      {/* Actions */}
      <View className="gap-3 mt-1">
        <GradientButton
          label="Save Changes"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
        <LinearButton
          title="Cancel"
          onPress={() => router.back()}
          variant="secondary"
        />
      </View>
    </View>
  );
};

export default ProfileEditForm;

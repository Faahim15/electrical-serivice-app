// ev-chargerDetailsSchema.ts
import { z } from "zod";

export const evChargerDetailsSchema = z.object({
  chargerType: z.string().min(1, "Please select charger type"),
  nemaConfig: z.string().optional(),
  providingCharger: z.string().optional(),
  chargerStatus: z.string().optional(),
});

export const evChargerInstallationLocationSchema = z
  .object({
    installationLocation: z
      .string()
      .min(1, "Please select installation location"),
    installationLocationOther: z.string().optional(),
  })
  .refine(
    (data) => {
      // If "Other" is selected, installationLocationOther is required
      if (data.installationLocation === "Other") {
        return (
          data.installationLocationOther &&
          data.installationLocationOther.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Please specify your installation location",
      path: ["installationLocationOther"],
    },
  );

export type EVChargerInstallationLocationFormValues = z.infer<
  typeof evChargerInstallationLocationSchema
>;
export type EVChargerDetailsFormValues = z.infer<typeof evChargerDetailsSchema>;

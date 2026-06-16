import { z } from "zod";

export const evChargerPanelLocationSchema = z
  .object({
    panelLocation: z.string().min(1, "Please select panel location"),
    panelLocationOther: z.string().optional(),
    panelDistance: z.string().min(1, "Please select panel distance"),
  })
  .refine(
    (data) => {
      // If "Other (please specify)" is selected, panelLocationOther is required
      if (data.panelLocation === "Other (please specify)") {
        return (
          data.panelLocationOther && data.panelLocationOther.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Please specify your panel location",
      path: ["panelLocationOther"],
    },
  );

export type EVChargerPanelLocationFormValues = z.infer<
  typeof evChargerPanelLocationSchema
>;

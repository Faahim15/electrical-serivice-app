import {
  useDeleteImageMutation,
  useUploadImagesMutation,
} from "@/src/redux/api-slices/quote/quote-api";
import { updateLightingDetails } from "@/src/redux/slices/serviceFormSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner-native";

export const useLighting = () => {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);
  const [uploadImages] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  const uploadSingleImage = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("uploading");
      const formData = new FormData();
      formData.append("images", {
        uri: localUri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const res = await uploadImages(formData).unwrap();
      toast.success("Photo uploaded successfully!");
      return res.data[0];
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const deleteSingleImage = async (imageUrl: string) => {
    try {
      await deleteImage({ imageUrl }).unwrap();
      toast.success("Photo deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete photo. Please try again.");
      throw error;
    }
  };

  const updateField = (field: string, value: any) => {
    dispatch(updateLightingDetails({ [field]: value }));
  };

  return {
    uploadingSection,
    uploadSingleImage,
    deleteSingleImage,
    updateField,
  };
};

import PhotoUploadSection from "@/src/components/quote/PhotoUploadSection";
import React from "react";

interface LightingPhotoUploadProps {
  label: string;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  onUploadSingle: (uri: string) => Promise<string>;
  onDeleteSingle: (url: string) => Promise<void>;
  isUploading?: boolean;
  maxPhotos?: number;
}

export const LightingPhotoUpload = ({
  label,
  photos,
  onPhotosChange,
  onUploadSingle,
  onDeleteSingle,
  isUploading = false,
  maxPhotos = 5,
}: LightingPhotoUploadProps) => {
  return (
    <PhotoUploadSection
      label={label}
      photos={photos}
      onPhotosChange={onPhotosChange}
      onUploadSingle={onUploadSingle}
      onDeleteSingle={onDeleteSingle}
      isUploading={isUploading}
      maxPhotos={maxPhotos}
    />
  );
};

import { photoUploadSvg } from "@/assets/images/svg/tabs-svg";
import { scale, verticalScale } from "@/src/utils/Scaling";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { toast } from "sonner-native";
import CustomSvg from "../shared/CustomSvg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PhotoUploadSectionProps {
  label: string;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  onUploadSingle?: (localUri: string) => Promise<string>;
  onDeleteSingle?: (imageUrl: string) => Promise<void>;
  maxPhotos?: number;
  isUploading?: boolean;
}

const PhotoUploadSection = ({
  label,
  photos,
  onPhotosChange,
  onUploadSingle,
  onDeleteSingle,
  maxPhotos = 5,
  isUploading = false,
}: PhotoUploadSectionProps) => {
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [uploadingIndices, setUploadingIndices] = useState<Set<number>>(
    new Set(),
  );
  const [deletingIndices, setDeletingIndices] = useState<Set<number>>(
    new Set(),
  );
  const [localPhotos, setLocalPhotos] = useState<string[]>(photos);

  // Sync localPhotos with props.photos
  useEffect(() => {
    setLocalPhotos(photos);
  }, [photos]);

  const isSingle = maxPhotos === 1;
  const isLimitReached = localPhotos.length >= maxPhotos;

  const handleAddPhotos = async (uris: string[]) => {
    console.log("[PhotoUpload] handleAddPhotos called with uris:", uris);
    const newLocalUris = uris.filter((uri) => !uri.startsWith("http"));
    console.log("[PhotoUpload] newLocalUris (not uploaded):", newLocalUris);

    if (newLocalUris.length === 0) return;

    // Get current photos
    const currentPhotos = [...localPhotos];
    const startIndex = currentPhotos.length;

    // Add placeholder local URIs to UI immediately
    const updatedPhotos = [...currentPhotos, ...newLocalUris];
    setLocalPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
    console.log("[PhotoUpload] Added placeholder images to UI");

    // Upload each photo one by one
    for (let i = 0; i < newLocalUris.length; i++) {
      const uri = newLocalUris[i];
      const actualIndex = startIndex + i;

      console.log(
        `[PhotoUpload] Starting upload for image ${i + 1}/${newLocalUris.length}:`,
        uri,
      );

      // Mark this index as uploading
      setUploadingIndices((prev) => new Set(prev).add(actualIndex));

      try {
        if (onUploadSingle) {
          console.log("[PhotoUpload] Calling onUploadSingle...");
          const uploadedUrl = await onUploadSingle(uri);
          console.log(
            "[PhotoUpload] Upload successful, Cloudinary URL:",
            uploadedUrl,
          );

          if (uploadedUrl) {
            // Update the specific photo with the uploaded URL
            setLocalPhotos((prevPhotos) => {
              const newPhotos = [...prevPhotos];
              newPhotos[actualIndex] = uploadedUrl;
              console.log(
                "[PhotoUpload] Updated localPhotos with Cloudinary URL",
              );
              // Notify parent of the change
              onPhotosChange(newPhotos);
              return newPhotos;
            });
          }
        } else {
          console.log("[PhotoUpload] onUploadSingle is not provided!");
        }
      } catch (error) {
        console.error("[PhotoUpload] Upload failed:", error);
        Alert.alert(
          "Upload Failed",
          "Failed to upload image. Please try again.",
        );
        // Remove the failed upload
        setLocalPhotos((prevPhotos) => {
          const failedPhotos = prevPhotos.filter(
            (_, idx) => idx !== actualIndex,
          );
          onPhotosChange(failedPhotos);
          return failedPhotos;
        });
      } finally {
        // Remove uploading indicator
        setUploadingIndices((prev) => {
          const newSet = new Set(prev);
          newSet.delete(actualIndex);
          return newSet;
        });
      }
    }
  };

  const pickFromGallery = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!perm.granted) {
        Alert.alert(
          "Permission required",
          "Allow access to your photo library.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: !isSingle,
        quality: 0.8,
      });

      if (!result.canceled) {
        const uris = result.assets.map((a) => a.uri);
        await handleAddPhotos(uris);
      }
    } catch (err) {
      console.error("[PhotoUpload] Gallery error:", err);
      Alert.alert("Error", "Failed to pick images from gallery.");
    }
  };

  const pickFromCamera = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();

      if (!perm.granted) {
        Alert.alert("Permission required", "Allow access to your camera.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        await handleAddPhotos([uri]);
      }
    } catch (err) {
      console.error("[PhotoUpload] Camera error:", err);
      Alert.alert("Error", "Failed to capture image from camera.");
    }
  };

  const showPickerOptions = () => {
    Alert.alert("Add Photo", "Choose a source", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemovePhoto = async (index: number) => {
    console.log("[PhotoUpload] Remove button clicked for index:", index);
    const photoToRemove = localPhotos[index];
    console.log("[PhotoUpload] Photo to remove:", photoToRemove);

    // If it's a local URI (not uploaded yet), just remove it
    if (!photoToRemove.startsWith("http")) {
      console.log("[PhotoUpload] Removing local photo (not uploaded yet)");
      const updated = localPhotos.filter((_, i) => i !== index);
      setLocalPhotos(updated);
      onPhotosChange(updated);
      toast.info("Photo removed");
      return;
    }

    console.log("[PhotoUpload] Removing uploaded photo - calling delete API");
    console.log("[PhotoUpload] Delete API payload:", {
      imageUrl: photoToRemove,
    });

    // Mark as deleting and show loader
    setDeletingIndices((prev) => new Set(prev).add(index));

    try {
      // Call delete API if provided
      if (onDeleteSingle) {
        console.log(
          "[PhotoUpload] Calling onDeleteSingle with:",
          photoToRemove,
        );
        await onDeleteSingle(photoToRemove);
        console.log("[PhotoUpload] Delete API call successful");
      } else {
        console.log("[PhotoUpload] onDeleteSingle is not provided");
      }

      // Remove from local state after successful deletion
      const updated = localPhotos.filter((_, i) => i !== index);
      setLocalPhotos(updated);
      onPhotosChange(updated);
      toast.success("Photo removed successfully");
      console.log("[PhotoUpload] Photo removed from state");
    } catch (error) {
      console.error("[PhotoUpload] Delete failed:", error);
      toast.error("Failed to remove photo. Please try again.");
    } finally {
      // Remove deleting indicator
      setDeletingIndices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  return (
    <View
      className="bg-white rounded-2xl px-4 py-5 mb-4"
      style={{
        borderWidth: 1,
        borderColor: "#E8F4FD",
        shadowColor: "#94A3B8",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      {/* Header */}
      <View className="items-center mb-3">
        <View
          style={{
            width: scale(48),
            height: verticalScale(48),
            borderRadius: scale(24),
            backgroundColor: "#EFF6FF",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomSvg
            xml={photoUploadSvg.replace(/currentColor/g, "#60A5FA")}
            width={24}
            height={24}
          />
        </View>
        <Text
          className="text-[#1E293B] text-[14px] font-Inter_SemiBold mt-2 text-center"
          style={{ paddingHorizontal: scale(8) }}
        >
          {label}
        </Text>
      </View>

      {/* Photo List */}
      {localPhotos.length > 0 && (
        <FlatList
          data={localPhotos}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={{
            gap: 8,
            marginBottom: 12,
            paddingHorizontal: 6,
          }}
          renderItem={({ item, index }) => {
            const isUploading = uploadingIndices.has(index);
            const isDeleting = deletingIndices.has(index);
            const showLoader = isUploading || isDeleting;

            return (
              <View style={{ overflow: "visible", margin: 6 }}>
                <Pressable onPress={() => !showLoader && setPreviewUri(item)}>
                  <View>
                    <Image
                      key={`image-${index}-${item}`}
                      source={{ uri: item }}
                      style={{ width: 90, height: 90, borderRadius: 10 }}
                      contentFit="cover"
                    />
                    {/* Loading Overlay for upload/delete */}
                    {showLoader && (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                </Pressable>

                {/* Delete Button with loader */}
                <Pressable
                  onPress={() => {
                    console.log(
                      "[PhotoUpload] Delete button pressed for index:",
                      index,
                    );
                    !isDeleting && !isUploading && handleRemovePhoto(index);
                  }}
                  disabled={isDeleting || isUploading}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    backgroundColor: "#EF4444",
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                >
                  <Ionicons name="close" size={12} color="white" />
                </Pressable>
              </View>
            );
          }}
        />
      )}

      {/* Choose File button */}
      {!isLimitReached && (
        <Pressable
          onPress={isUploading ? undefined : showPickerOptions}
          style={{
            borderWidth: 1,
            borderColor: "#EFF6FF",
            alignSelf: "center",
            borderRadius: scale(16),
            paddingVertical: verticalScale(14),
            alignItems: "center",
            backgroundColor: "#EFF6FF",
            justifyContent: "center",
            height: verticalScale(50),
            width: scale(130),
            opacity: isUploading ? 0.5 : 1,
          }}
        >
          <Text className="text-[#60A5FA] text-base font-Inter_SemiBold">
            {isUploading ? "Uploading..." : "Choose File"}
          </Text>
        </Pressable>
      )}

      {/* Full Screen Preview Modal */}
      <Modal
        visible={!!previewUri}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewUri(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000CC",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() => setPreviewUri(null)}
            style={{ position: "absolute", top: 52, right: 20, zIndex: 10 }}
          >
            <Ionicons name="close-circle" size={36} color="white" />
          </Pressable>
          {previewUri && (
            <Image
              source={{ uri: previewUri }}
              style={{
                width: SCREEN_WIDTH - 32,
                height: SCREEN_WIDTH - 32,
                borderRadius: 16,
              }}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default PhotoUploadSection;

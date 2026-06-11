import { photoUploadSvg } from "@/assets/images/svg/tabs-svg";
import { scale, verticalScale } from "@/src/utils/Scaling";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import CustomSvg from "../shared/CustomSvg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PhotoUploadSectionProps {
  label: string;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number; // 1 = single mode, >1 = multiple mode
}

const PhotoUploadSection = ({
  label,
  photos,
  onPhotosChange,
  maxPhotos = 5,
}: PhotoUploadSectionProps) => {
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const isSingle = maxPhotos === 1;
  const isLimitReached = photos.length >= maxPhotos;

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "Allow access to your photo library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: !isSingle,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      if (isSingle) {
        onPhotosChange(uris); // replace existing
      } else {
        onPhotosChange([...photos, ...uris].slice(0, maxPhotos));
      }
    }
  };

  const pickFromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "Allow access to your camera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      if (isSingle) {
        onPhotosChange([result.assets[0].uri]); // replace existing
      } else {
        onPhotosChange([...photos, result.assets[0].uri]);
      }
    }
  };

  const showPickerOptions = () => {
    Alert.alert("Add Photo", "Choose a source", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
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
            borderColor: "#EFF6FF",
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
      {photos.length > 0 && (
        <FlatList
          data={photos}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{
            gap: 8,
            marginBottom: 12,
            paddingHorizontal: 6,
          }}
          renderItem={({ item, index }) => (
            <View style={{ overflow: "visible", margin: 6 }}>
              <Pressable onPress={() => setPreviewUri(item)}>
                <Image
                  source={{ uri: item }}
                  style={{ width: 90, height: 90, borderRadius: 10 }}
                  contentFit="cover"
                />
              </Pressable>
              <Pressable
                onPress={() => removePhoto(index)}
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
          )}
        />
      )}

      {/* Choose File — hidden when limit reached */}
      {!isLimitReached && (
        <Pressable
          onPress={showPickerOptions}
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
          }}
        >
          <Text className="text-[#60A5FA] text-base font-Inter_SemiBold">
            Choose File
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

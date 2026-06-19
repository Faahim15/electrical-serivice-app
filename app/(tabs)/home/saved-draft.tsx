import DeleteConfirmModal from "@/src/components/drafts/DeleteConfirmModal";
import DraftCard from "@/src/components/drafts/DraftCard";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import DraftCardSkeleton from "@/src/components/skeleton/DraftCardSkeleton";
import { useDeleteDraft } from "@/src/hook/useDeleteDraft";
import { useGetDraftsQuery } from "@/src/redux/api-slices/quote/quote-api";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

// ─── Main ─────────────────────────────────────────────────────────────────────

const SavedDraft = () => {
  const { data, isLoading, isError, refetch } = useGetDraftsQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Flatten grouped draft response into a single list of drafts
  const drafts: ServiceCallResponse[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.flatMap((group) => group.data);
  }, [data]);

  const skeletonCount = drafts.length || 3;

  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    serviceType: string;
  } | null>(null);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.88)).current;

  // Card animations — keyed by draft id so they survive list re-renders
  const cardAnimsRef = useRef<
    Record<string, { opacity: Animated.Value; translateY: Animated.Value }>
  >({});

  const getCardAnim = (id: string) => {
    if (!cardAnimsRef.current[id]) {
      cardAnimsRef.current[id] = {
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(24),
      };
    }
    return cardAnimsRef.current[id];
  };

  const { deleteDraft, isDeleting } = useDeleteDraft(() => {
    // Refetch after successful delete
    refetch();
  });

  // Header entrance
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Card entrance after data loads
  useEffect(() => {
    if (!drafts.length) return;

    Animated.stagger(
      120,
      drafts.map((draft) => {
        const anim = getCardAnim(draft._id);
        return Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
        ]);
      }),
    ).start();
  }, [drafts]);

  // Error toast
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load drafts. Please try again.");
    }
  }, [isError]);

  // ─── Refresh handler ──────────────────────────────────────────────────────────
  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // ─── Modal helpers ───────────────────────────────────────────────────────────

  const openDeleteModal = (id: string, serviceType: string) => {
    console.log("=== OPEN DELETE MODAL ===");
    console.log("Draft ID:", id);
    console.log("Service Type:", serviceType);

    setDeleteTarget({ id, serviceType });
    modalOpacity.setValue(0);
    modalScale.setValue(0.88);
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(modalScale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    console.log("=== CLOSE DELETE MODAL ===");
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setDeleteTarget(null));
  };

  const handleConfirmDelete = async () => {
    console.log("=== CONFIRM DELETE ===");
    console.log("Delete Target:", deleteTarget);

    if (!deleteTarget) {
      console.log("No delete target found!");
      return;
    }

    console.log("Calling deleteDraft with:", {
      id: deleteTarget.id,
      serviceType: deleteTarget.serviceType,
    });

    await deleteDraft(deleteTarget.id, deleteTarget.serviceType);
    console.log("Delete operation completed, closing modal");
    closeModal();
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <ScreenWrapper paddingHorizontal={0}>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <Animated.View
          style={{
            transform: [{ translateY: headerSlide }],
            opacity: headerOpacity,
          }}
          className="flex-row items-center px-4 pt-2 pb-3"
        >
          <Pressable onPress={() => router.back()} className="p-1 mr-2">
            <Feather name="arrow-left" size={22} color="#0F172A" />
          </Pressable>
          <Text className="text-xl text-[#0F172A] font-Inter_Bold">
            Saved Drafts
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text className="text-[#475569] text-sm px-4 mb-4">
          Finish your quote requests anytime
        </Animated.Text>

        {/* Draft List */}
        {isLoading ? (
          <View className="px-4 gap-y-3">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <DraftCardSkeleton key={i} />
            ))}
          </View>
        ) : (
          <FlatList
            data={drafts}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: verticalScale(120),
              flexGrow: 1,
            }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={["#0EA5E9"]}
                tintColor="#0EA5E9"
              />
            }
            renderItem={({ item: draft }) => {
              const anim = getCardAnim(draft._id);
              return (
                <DraftCard
                  id={draft._id}
                  serviceType={draft.serviceType}
                  updatedAt={draft.updatedAt}
                  completionPercentage={draft.completionPercentage}
                  opacity={anim.opacity}
                  translateY={anim.translateY}
                  onDelete={openDeleteModal}
                />
              );
            }}
            ListEmptyComponent={
              <View className="items-center mt-16">
                <Feather name="inbox" size={40} color="#CBD5E1" />
                <Text className="text-[#94A3B8] font-Inter_Regular text-sm mt-3">
                  No saved drafts yet
                </Text>
              </View>
            }
          />
        )}

        <DeleteConfirmModal
          visible={!!deleteTarget}
          isDeleting={isDeleting}
          opacity={modalOpacity}
          scale={modalScale}
          onCancel={closeModal}
          onConfirm={handleConfirmDelete}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default SavedDraft;

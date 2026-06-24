import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GeneratorResponse,
  GetGeneratorByIdResponse,
  GetMyGeneratorsResponse,
} from "@/src/types/quotes/generator.api.types";

const generatorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Generator ────────────────────────────────────────────────────
    createGenerator: builder.mutation<GeneratorResponse, FormData>({
      query: (formData) => ({
        url: "/generators",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Generator, TagTypes.Draft],
    }),

    // ─── Update Generator ────────────────────────────────────────────────────
    updateGenerator: builder.mutation<
      GeneratorResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/generators/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Generator, TagTypes.Draft],
    }),

    // ─── Get My Generators ───────────────────────────────────────────────────
    getMyGenerators: builder.query<GetMyGeneratorsResponse, void>({
      query: () => ({
        url: "/generators/my",
        method: "GET",
      }),
      providesTags: [TagTypes.Generator],
    }),

    // ─── Get Generator By ID ─────────────────────────────────────────────────
    getGeneratorById: builder.query<GetGeneratorByIdResponse, string>({
      query: (recordId) => ({
        url: `/generators/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Generator],
    }),

    // ─── Delete Generator ────────────────────────────────────────────────────
    deleteGenerator: builder.mutation<void, string>({
      query: (id) => ({
        url: `/generators/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.Generator, TagTypes.Draft],
    }),
  }),
});

export const {
  useCreateGeneratorMutation,
  useUpdateGeneratorMutation,
  useGetMyGeneratorsQuery,
  useGetGeneratorByIdQuery,
  useDeleteGeneratorMutation,
} = generatorApi;

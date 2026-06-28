export interface GuideStep {
  _id: string;
  subtitle: string;
  description: string;
}

export interface Guide {
  _id: string;
  name: string;
  safetyWarnings: string;
  steps: GuideStep[];
  createdAt: string;
  updatedAt: string;
  isSaved: boolean;
  savedAt?: string;
}

export interface GuidesMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface GetGuidesResponse {
  success: boolean;
  message: string;
  meta: GuidesMeta;
  data: Guide[];
}

export interface GetGuideByIdResponse {
  success: boolean;
  message: string;
  data: Guide;
}

export interface SaveGuideResponse {
  success: boolean;
  message: string;
  data: {
    guideId: string;
    isSaved: boolean;
  };
}

export interface GetSavedGuidesResponse {
  success: boolean;
  message: string;
  meta: GuidesMeta;
  data: Guide[];
}
export type RecentActivityItem = {
  id?: string;
  type: "reminder" | "quote" | "guide";
  title: string;
  status: string | null;
  serviceModel?: string;
  timestamp: string;
};

export type GetRecentActivityResponse = {
  success: boolean;
  message: string;
  data: RecentActivityItem[];
};

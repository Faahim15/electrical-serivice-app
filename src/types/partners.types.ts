export interface PartnerCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  partnerCount: number;
}

export interface PartnerCategoriesResponse {
  success: boolean;
  message: string;
  data: PartnerCategory[];
}

// ── New ──────────────────────────────────────────────────────────────────────
export interface Partner {
  id: string;
  companyName: string;
  category: string;
  description: string;
  phoneNumber: string;
  websiteUrl: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnersResponse {
  success: boolean;
  message: string;
  data: Partner[];
}
export interface AddFavoriteResponse {
  success: boolean;
  message: string;
}

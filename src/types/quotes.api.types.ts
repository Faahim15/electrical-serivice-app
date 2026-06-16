export interface ServiceCallPayloadFields {
  serviceType: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  preferredContactMethod: string;
  streetAddress: string;
  apartmentUnit?: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  ownershipStatus: string;
  timelineUrgency: string;
  issueDescription?: string;
  preferredTime?: string;
  schedulingPreference?: string[];
  panelPhotos?: string[];
  workAreaPhotos?: string[];
  extraReferencePhotos?: string[];
  notes?: string;
  quickTags?: string[];
  completionPercentage?: number;
  status?:
    | "draft"
    | "submitted"
    | "in_review"
    | "quoted"
    | "scheduled"
    | "completed"
    | "cancelled";
}

// ─── API payload types (FormData) ─────────────────────────────────────────────
export type CreateServiceCallPayload = FormData;
export type UpdateServiceCallPayload = FormData;

export interface ServiceCallResponse {
  _id: string;
  serviceType: string;
  createdBy: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  preferredContactMethod: string;
  streetAddress: string;
  apartmentUnit?: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  ownershipStatus: string;
  timelineUrgency: string;
  issueDescription?: string;
  preferredTime?: string;
  schedulingPreference?: string[];
  panelPhotos?: string[];
  workAreaPhotos?: string[];
  extraReferencePhotos?: string[];
  photos?: string[];
  notes?: string;
  completionPercentage: number;
  quickTags?: string[];
  status:
    | "draft"
    | "submitted"
    | "in_review"
    | "quoted"
    | "scheduled"
    | "completed"
    | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceCallResponse {
  success: boolean;
  message: string;
  data: ServiceCallResponse;
}

export interface GetServiceCallsResponse {
  success: boolean;
  message: string;
  data: ServiceCallResponse[];
}

export type UpdateServiceCallResponse = CreateServiceCallResponse;

export interface DraftGroup {
  serviceName: string;
  count: number;
  data: ServiceCallResponse[];
}

export interface GetDraftsResponse {
  success: boolean;
  message: string;
  data: DraftGroup[];
}

// ─── Photo Upload Types ───────────────────────────────────────────────────────
export interface UpdateProfilePhotoResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      _id: string;
      address: string;
      email: string;
      image: string;
      name: string;
      phone: string;
      role: string;
    };
  };
}

export interface DeleteImagePayload {
  imageUrl: string;
}

export interface DeleteImageResponse {
  success: boolean;
  message: string;
}

export interface UploadImagesResponse {
  success: boolean;
  message: string;
  data: string[];
}

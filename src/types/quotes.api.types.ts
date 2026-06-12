export interface CreateServiceCallPayload {
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

// ─── Update (PATCH) ───────────────────────────────────────────────────────────
// Reuses the same payload/response shapes as create, since a PATCH is just a
// partial update of the same resource and returns the same updated object.

export type UpdateServiceCallPayload = Partial<CreateServiceCallPayload>;

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

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

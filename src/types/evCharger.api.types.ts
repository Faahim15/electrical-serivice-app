export interface EvChargerInstallationResponse {
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
  chargerConnectionType?: string;
  nemaConfiguration?: string;
  chargerProvidedByUser?: boolean;
  chargerStatus?: string;
  installationLocation?: string;
  panelLocation?: string;
  panelDistance?: string;
  environment?: string;
  budget?: string;
  accessibility?: string;
  schedule?: string;
  additionalInformation?: string;
  areaPhoto?: string;
  panelPhotos?: string[];
  status:
    | "draft"
    | "submitted"
    | "in_review"
    | "quoted"
    | "scheduled"
    | "completed"
    | "cancelled";
  completionPercentage: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEvChargerInstallationPayload {
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
  chargerConnectionType?: string;
  nemaConfiguration?: string;
  chargerProvidedByUser?: boolean;
  chargerStatus?: string;
  installationLocation?: string;
  panelLocation?: string;
  panelDistance?: string;
  environment?: string;
  budget?: string;
  accessibility?: string;
  schedule?: string;
  additionalInformation?: string;
  areaPhoto?: string;
  panelPhotos?: string[];
  status?:
    | "draft"
    | "submitted"
    | "in_review"
    | "quoted"
    | "scheduled"
    | "completed"
    | "cancelled";
  completionPercentage?: number;
}

export type UpdateEvChargerInstallationPayload =
  Partial<CreateEvChargerInstallationPayload>;

export interface CreateEvChargerInstallationResponse {
  success: boolean;
  message: string;
  data: EvChargerInstallationResponse;
}

export type UpdateEvChargerInstallationResponse =
  CreateEvChargerInstallationResponse;

export interface GetEvChargerInstallationsResponse {
  success: boolean;
  message: string;
  data: EvChargerInstallationResponse[];
}

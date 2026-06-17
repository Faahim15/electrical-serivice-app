export interface RemodelingPayload {
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
  panelLocation: string;
  remodelingAreas: string;
  hasPlansDrawings: boolean;
  electricalNeeds: string;
  permitApplied: boolean;
  permitNumber?: string;
  additionalInformation?: string;
  plansDrawings?: string[];
  existingSpacePhotos?: string[];
  panelPhotos?: string[];
}

export interface RemodelingRecord extends RemodelingPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface RemodelingResponse {
  success: boolean;
  message: string;
  data: RemodelingRecord;
}

export interface GetMyRemodelingResponse {
  success: boolean;
  message: string;
  data: RemodelingRecord[];
}

export interface GetRemodelingByIdResponse {
  success: boolean;
  message: string;
  data: RemodelingRecord;
}

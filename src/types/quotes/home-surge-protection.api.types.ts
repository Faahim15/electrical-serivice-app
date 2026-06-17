export interface HomeSurgeProtectionPayload {
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
  additionalNotes?: string;
  photosOfElectricalPanel?: string[];
}

export interface HomeSurgeProtectionRecord extends HomeSurgeProtectionPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface HomeSurgeProtectionResponse {
  success: boolean;
  message: string;
  data: HomeSurgeProtectionRecord;
}

export interface GetMyHomeSurgeProtectionsResponse {
  success: boolean;
  message: string;
  data: HomeSurgeProtectionRecord[];
}

export interface GetHomeSurgeProtectionByIdResponse {
  success: boolean;
  message: string;
  data: HomeSurgeProtectionRecord;
}

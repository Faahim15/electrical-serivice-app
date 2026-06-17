export interface NewConstructionPayload {
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
  hasConstructionBegun: boolean;
  stageOfConstruction: string;
  haveBuildingPlans: boolean;
  photosOfBuildingPlans?: string[];
}

export interface NewConstructionRecord extends NewConstructionPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface NewConstructionResponse {
  success: boolean;
  message: string;
  data: NewConstructionRecord;
}

export interface GetMyNewConstructionsResponse {
  success: boolean;
  message: string;
  data: NewConstructionRecord[];
}

export interface GetNewConstructionByIdResponse {
  success: boolean;
  message: string;
  data: NewConstructionRecord;
}

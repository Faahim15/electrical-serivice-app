export interface AccessoryBuildingPayload {
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
  entireSquareFootage: number;
  intendedUse: string;
  buildingStatus: string;
  constructionType: string;
  hasHeatingOrCooling: boolean;
  floorType: string;
  electricalServiceType: string;
  serviceSize: string;
  panelLocation: string;
  routeDetails: string;
  hasPlansDrawings: boolean;
  permitApplied: boolean;
  additionalInformation?: string;
  panelPhotos?: string[];
  existingSpacePhotos?: string[];
  plansDrawings?: string[];
  permitNumber: number;
  electricalNeeds: string;
}

export interface AccessoryBuildingRecord extends AccessoryBuildingPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface AccessoryBuildingResponse {
  success: boolean;
  message: string;
  data: AccessoryBuildingRecord;
}

export interface GetMyAccessoryBuildingsResponse {
  success: boolean;
  message: string;
  data: AccessoryBuildingRecord[];
}

export interface GetAccessoryBuildingByIdResponse {
  success: boolean;
  message: string;
  data: AccessoryBuildingRecord;
}

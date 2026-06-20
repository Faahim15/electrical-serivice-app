export interface ExhaustFanPayload {
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
  newOrReplacement: string;
  locationOfExhaustFan: string;
  isRoofOrGableFan: string;
  willSupplyAtticFan: boolean;
  howManyStories: number;
  whereElectricalPanelLocated: string;
  existingDuctAndVentDiameterLocation: string;
  willProvideKitchenExhaustFan: boolean;
  willProvideBathroomExhaustFan: boolean;
  typeOfExhaustFanWanted: string;
  specialityControlsWanted: string;
  aboveBelowAreaOfExhaustFan: string;
  distanceOfElectricalPanelToExhaustFan: string;
  additionalInformation?: string;
  photoOfNewFan?: string[];
  photosOfInstallationArea?: string[];
  photosOfPanelCloseUp?: string[];
  photosOfPanelWideShot?: string[];
  photosOfCurrentKitchenExhaustFan?: string[];
  photosOfCurrentBathroomExhaustFan?: string[];
}

export interface ExhaustFanRecord extends ExhaustFanPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface ExhaustFanResponse {
  success: boolean;
  message: string;
  data: ExhaustFanRecord;
}

export interface GetMyExhaustFansResponse {
  success: boolean;
  message: string;
  data: ExhaustFanRecord[];
}

export interface GetExhaustFanByIdResponse {
  success: boolean;
  message: string;
  data: ExhaustFanRecord;
}

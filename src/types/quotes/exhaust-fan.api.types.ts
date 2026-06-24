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

  // ─── Exhaust Fan specific fields ──────────────────────────────────────────
  newOrReplacement: string;
  locationOfExhaustFan: string;
  isRoofOrGableFan?: string;
  willSupplyAtticFan?: boolean;
  photoOfNewFan?: string[];
  howManyStories?: number;
  photosOfInstallationArea?: string[];
  whereElectricalPanelLocated?: string;
  photosOfPanelCloseUp?: string[];
  photosOfPanelWideShot?: string[];
  photosOfCurrentKitchenExhaustFan?: string[];
  photosOfCurrentBathroomExhaustFan?: string[];
  existingDuctAndVentDiameterLocation?: string;
  willProvideKitchenExhaustFan?: boolean;
  willProvideBathroomExhaustFan?: boolean;
  typeOfExhaustFanWanted?: string;
  specialityControlsWanted?: string;
  aboveBelowAreaOfExhaustFan?: string;
  distanceOfElectricalPanelToExhaustFan?: string;
  additionalInformation?: string;
}

export interface ExhaustFanRecord extends ExhaustFanPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
  qId?: string;
  internalNote?: string;
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

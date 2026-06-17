export interface StarlinkPayload {
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
  haveStarlinkEquipment: boolean;
  whenHaveEquipment: string;
  dishLocation: string;
  haveMountingEquipment: boolean;
  roomOfRouterIn: string;
  roomCondition: string;
  additionalNotes?: string;
  areaOfInstallationPhotos?: string[];
  photosOfRoomForRouter?: string[];
}

export interface StarlinkRecord extends StarlinkPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface StarlinkResponse {
  success: boolean;
  message: string;
  data: StarlinkRecord;
}

export interface GetMyStarlinksResponse {
  success: boolean;
  message: string;
  data: StarlinkRecord[];
}

export interface GetStarlinkByIdResponse {
  success: boolean;
  message: string;
  data: StarlinkRecord;
}

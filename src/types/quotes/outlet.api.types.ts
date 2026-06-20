export interface OutletPayload {
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
  intendedUseOfOutlets: string;
  howManyOutletsNeeds: string;
  newInstallationOrReplacement: string;
  typeOfOutletsNeed: string;
  howManyAmps: string;
  ampsOrVoltsNeeded: string;
  NEMAConfiguration: string;
  additionalInformation?: string;
  photosOfWhereOutletsInstall?: string[];
  photosOfCurrentOutlets?: string[];
}

export interface OutletRecord extends OutletPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface OutletResponse {
  success: boolean;
  message: string;
  data: OutletRecord;
}

export interface GetMyOutletsResponse {
  success: boolean;
  message: string;
  data: OutletRecord[];
}

export interface GetOutletByIdResponse {
  success: boolean;
  message: string;
  data: OutletRecord;
}

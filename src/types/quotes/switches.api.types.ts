export interface SwitchesPayload {
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
  howManySwitchesNeeded: string;
  isNewInstallationOrReplacement: string;
  typeOfSwitchesNeeded: string;
  additionalInformation?: string;
  photosOfWhereSwitchesInstallationNeeded?: string[];
}

export interface SwitchesRecord extends SwitchesPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface SwitchesResponse {
  success: boolean;
  message: string;
  data: SwitchesRecord;
}

export interface GetMySwitchesResponse {
  success: boolean;
  message: string;
  data: SwitchesRecord[];
}

export interface GetSwitchesByIdResponse {
  success: boolean;
  message: string;
  data: SwitchesRecord;
}

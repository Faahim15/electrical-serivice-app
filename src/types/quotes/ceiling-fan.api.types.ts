export interface CeilingFanPayload {
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
  installationType: string;
  aboveBelowAreaOfCeilingFan: string;
  isThereCurrentLightFixture: boolean;
  wasAreaPrewired: string;
  willProvideNewCeilingFan: boolean;
  describeFanWantInstalled: string;
  tallOfCeilingFanFromFloor: string;
  willConnectNewOrExistingSwitch: string;
  wantUpgradeSwitch: boolean;
  kindOfSwitchWant: string;
  additionalInformation?: string;
  photosOfCurrentCeilingFan?: string[];
  photosOfNewCeilingFan?: string[];
}

export interface CeilingFanRecord extends CeilingFanPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface CeilingFanResponse {
  success: boolean;
  message: string;
  data: CeilingFanRecord;
}

export interface GetMyCeilingFansResponse {
  success: boolean;
  message: string;
  data: CeilingFanRecord[];
}

export interface GetCeilingFanByIdResponse {
  success: boolean;
  message: string;
  data: CeilingFanRecord;
}

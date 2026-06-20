export interface LightingPayload {
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
  lightingType: string;
  typeOfInteriorLightingFixture?: string;
  kindOfLightingFixture?: string;
  isFixtureHaveComplexAssembly?: boolean;
  isNewOrReplacement?: string;
  tallOfCeiling?: string;
  detailsOnTypeOfFixture?: string;
  willProvideNewLight?: boolean;
  fixtureConnectedToNewOrExistingSwitch?: string;
  kindOfSwitchWant?: string;
  wantToUpgradeSwitch?: boolean;
  moreThanOneSwitchLocation?: boolean;
  additionalInformation?: string;
  photosOfWhereWantToInstall?: string[];
  photosOfCurrentLightFixture?: string[];
  photosOfNewLightFixture?: string[];
  photosOfInstallationAreaFloodLight?: string[];
  photosOfCurrentFloodLight?: string[];
  photosOfNewFloodLight?: string[];
}

export interface LightingRecord extends LightingPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface LightingResponse {
  success: boolean;
  message: string;
  data: LightingRecord;
}

export interface GetMyLightingsResponse {
  success: boolean;
  message: string;
  data: LightingRecord[];
}

export interface GetLightingByIdResponse {
  success: boolean;
  message: string;
  data: LightingRecord;
}

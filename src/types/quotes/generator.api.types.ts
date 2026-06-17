export interface GeneratorPayload {
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
  generatorType: string;
  isAlreadyHaveGenerator: boolean;
  generatorOutputPower: string;
  preferredBackupInstallation: string;
  generatorDistanceFromInletLocation: string;
  electricPanelLocation: string;
  sizeOfGeneratorWanted: string;
  backupNeeds: string;
  isHavePropane: boolean;
  additionalInformation?: string;
  photosOfWhereGeneratorWillBeInlet?: string[];
  photosOfReceptacleOnGenerator?: string[];
  electricPanelPhotos?: string[];
  generatorInstallationLocationPhotos?: string[];
  photosOfElectricalMeter?: string[];
}

export interface GeneratorRecord extends GeneratorPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface GeneratorResponse {
  success: boolean;
  message: string;
  data: GeneratorRecord;
}

export interface GetMyGeneratorsResponse {
  success: boolean;
  message: string;
  data: GeneratorRecord[];
}

export interface GetGeneratorByIdResponse {
  success: boolean;
  message: string;
  data: GeneratorRecord;
}

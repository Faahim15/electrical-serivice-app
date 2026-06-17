export interface DedicatedCircuitPayload {
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
  whyNeedDedicatedCircuit: string;
  electricalPanelLocation: string;
  whereWillDedicatedCircuitInstalled: string;
  aboveBelowArea: string;
  distanceElectricalPanelToInstallationArea: string;
  ampsNeeded: string;
  voltsNeeded: string;
  NEMAConfiguration: string;
  additionalInformation?: string;
  photosOfElectricalMeter?: string[];
  photosOfInstallationLocation?: string[];
}

export interface DedicatedCircuitRecord extends DedicatedCircuitPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface DedicatedCircuitResponse {
  success: boolean;
  message: string;
  data: DedicatedCircuitRecord;
}

export interface GetMyDedicatedCircuitsResponse {
  success: boolean;
  message: string;
  data: DedicatedCircuitRecord[];
}

export interface GetDedicatedCircuitByIdResponse {
  success: boolean;
  message: string;
  data: DedicatedCircuitRecord;
}

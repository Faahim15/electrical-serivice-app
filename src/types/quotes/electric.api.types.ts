export interface ElectricPayload {
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
  inspectionType: string;
  panelNeedForInspected: string;
  additionalInformation?: string;
  panelPhotos?: string[];
}

export interface ElectricRecord extends ElectricPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface ElectricResponse {
  success: boolean;
  message: string;
  data: ElectricRecord;
}

export interface GetMyElectricsResponse {
  success: boolean;
  message: string;
  data: ElectricRecord[];
}

export interface GetElectricByIdResponse {
  success: boolean;
  message: string;
  data: ElectricRecord;
}

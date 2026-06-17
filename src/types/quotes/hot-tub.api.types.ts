export interface HotTubPayload {
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
  hasDigitalManual: boolean;
  hotTubManufacturer: string;
  hotTubModelNumber: string;
  amperageNeeded: string;
  location: string;
  panelLocation: string;
  panelDistance: string;
  additionalInformation?: string;
  manualDocument?: string[];
  panelPhotos?: string[];
  hotTubPhotos?: string[];
  receptaclePhotos?: string[];
}

export interface HotTubRecord extends HotTubPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface HotTubResponse {
  success: boolean;
  message: string;
  data: HotTubRecord;
}

export interface GetMyHotTubsResponse {
  success: boolean;
  message: string;
  data: HotTubRecord[];
}

export interface GetHotTubByIdResponse {
  success: boolean;
  message: string;
  data: HotTubRecord;
}

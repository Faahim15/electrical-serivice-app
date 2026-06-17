export interface PanelUpgradePayload {
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
  panelServiceType: string;
  currentPanelAmperage: string;
  desiredPanelAmperage: string;
  panelLocation: string;
  powerFeedType: string;
  additionalInformation?: string;
  meterPhotos?: string[];
  panelPhotos?: string[];
}

export interface PanelUpgradeResponse {
  success: boolean;
  message: string;
  data: PanelUpgradePayload & {
    _id: string;
    serviceType: string;
    createdBy: string;
    status: string;
    completionPercentage: number;
  };
}
export interface PanelUpgradeRecord extends PanelUpgradePayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface GetMyPanelUpgradesResponse {
  success: boolean;
  message: string;
  data: PanelUpgradeRecord[];
}
export interface GetPanelUpgradeByIdResponse {
  success: boolean;
  message: string;
  data: PanelUpgradeRecord;
}

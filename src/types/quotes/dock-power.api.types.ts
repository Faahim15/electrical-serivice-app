export interface DockPowerPayload {
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
  isDockBuilt: boolean;
  electricalNeedsDetails: string;
  receptacleCount: number;
  electricalServiceType: string;
  subPanelSize: string;
  panelLocation: string;
  routeDistanceDetails: string;
  hasPlansDrawings: boolean;
  permitApplied: boolean;
  additionalInformation?: string;
  panelPhotos?: string[];
  existingSpacePhotos?: string[];
  plansDrawingsPhotos?: string[];
}

export interface DockPowerRecord extends DockPowerPayload {
  _id: string;
  serviceType: string;
  createdBy: string;
  status: string;
  completionPercentage: number;
}

export interface DockPowerResponse {
  success: boolean;
  message: string;
  data: DockPowerRecord;
}

export interface GetMyDockPowersResponse {
  success: boolean;
  message: string;
  data: DockPowerRecord[];
}

export interface GetDockPowerByIdResponse {
  success: boolean;
  message: string;
  data: DockPowerRecord;
}

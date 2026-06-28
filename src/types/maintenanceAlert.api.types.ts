export interface MaintenanceAlert {
  enabled: boolean;
  nextDueAt: string | null;
}

export interface MaintenanceAlertsData {
  smokeDetectorBatteries: MaintenanceAlert;
  carbonMonoxideDetector: MaintenanceAlert;
  testGfciOutlets: MaintenanceAlert;
  septicSystemAlarm: MaintenanceAlert;
  testAfciBreakers: MaintenanceAlert;
  clearDryerVent: MaintenanceAlert;
  inspectElectricalCords: MaintenanceAlert;
}

export interface GetMaintenanceAlertsResponse {
  success: boolean;
  message: string;
  data: MaintenanceAlertsData;
}

export interface UpdateMaintenanceAlertsPayload {
  smokeDetectorBatteries?: boolean;
  carbonMonoxideDetector?: boolean;
  testGfciOutlets?: boolean;
  septicSystemAlarm?: boolean;
  testAfciBreakers?: boolean;
  clearDryerVent?: boolean;
  inspectElectricalCords?: boolean;
}

export interface UpdateMaintenanceAlertsResponse {
  success: boolean;
  message: string;
  data: MaintenanceAlertsData;
}

export type MaintenanceAlertKey = keyof MaintenanceAlertsData;

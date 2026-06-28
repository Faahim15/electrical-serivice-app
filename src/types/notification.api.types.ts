// ─── Notification Types ───────────────────────────────────────────────────────

export interface Notification {
  _id: string;
  user: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  serviceModel: string;
  serviceId: string;
  qId: string;
  serviceType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  unreadCount: number;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  meta: NotificationMeta;
  data: Notification[];
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

export interface AboutUs {
  _id: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AboutUsResponse {
  success: boolean;
  message: string;
  data: AboutUs;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQResponse {
  success: boolean;
  message: string;
  data: FAQ[];
}

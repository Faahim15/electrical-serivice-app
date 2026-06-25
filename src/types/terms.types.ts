export interface TermsAndConditions {
  _id: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TermsAndConditionsResponse {
  success: boolean;
  message: string;
  data: TermsAndConditions;
}

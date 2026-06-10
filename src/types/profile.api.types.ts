export interface UpdateAddressRequest {
  addressName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  address?: string;
  phone?: string;
  addresses?: UpdateAddressRequest[];
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

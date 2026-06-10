export interface Address {
  _id: string;
  addressName: string;
  streetAddress: string;
  apartmentUnit?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  email: string;
  isVerifiedByOTP: boolean;
  authProvider: string;
  role: string;
  addresses: Address[];
}

export interface GetProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

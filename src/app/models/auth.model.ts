export interface LoginModel {
  email: string;
  password: string;
}

export interface SignupModel extends LoginModel {
  username: string;
}

export interface ResetPasswordModel {
  email: string;
}

export interface PatchPasswordModel {
  password: string;
}

export interface APIAuthResponseModel {
  status: string;
  token: string;
}

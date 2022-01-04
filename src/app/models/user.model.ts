export interface ContactModel {
  _id: string;
  email: string;
  username: string;
  userId: {_id: string, photo: string };
}

export interface UserForAuth extends UserModel{
   token: string | null ;
   tokenExpiration: Date;

}

export interface UserModel {
  _id: string;
  photo: string;
  username: string;
  email: string;
  contacts:ContactModel[]
}

export interface UpdatePasswordModel {
  oldPassword: string;
  updatedPassword: string;
}

export interface UserDataAPIResponseModel{
  status: string;
  data: {data: UserModel};
  message: string;
}

export class UserPrototype implements UserForAuth{
  constructor(
  public _id: string,
  private _token: string,
  private _tokenExpiration: Date,
  public photo: string,
  public username: string,
  public email: string,
  public contacts:ContactModel[]
  ){}

  get token(){
    if (!this._tokenExpiration || this._tokenExpiration < new Date()){
      return null
    }
    return this._token;
  };

  get tokenExpiration(): Date{
    return this._tokenExpiration;
  }

}

import {Injectable} from '@angular/core';
import {ContactModel, UserDataAPIResponseModel, UserPrototype} from "../models/user.model";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {
    APIAuthResponseModel,
    LoginModel,
    PatchPasswordModel,
    ResetPasswordModel,
    SignupModel
} from "../models/auth.model";
import {tap} from "rxjs/operators";
import {
    MessageModel,
    RoomFactoryDataModel, RoomModel, ServerLoadedMessagesModel
} from "../models/message.model";
import {ApiResponseModel} from "../models/api";
import {FormDataParserService} from "./form-data-parser.service";
import {environment} from "../../environments/environment";

const API_URL = environment.API_URL;

// this service contains all the possible requests that can be made on the app,
@Injectable()
export class HttpService {

    constructor(
        private formDataParser: FormDataParserService,
        private http: HttpClient) {
    }

    uploadFile(file: File): Observable<boolean> {
        //not implemented
        return of(false)

    }

    //portal
    loginRequest(payload: LoginModel): Observable<APIAuthResponseModel> {
        return this.http.post<APIAuthResponseModel>(
            `${API_URL}/portal/login`, payload,)
    }

    signUpRequest(payload: SignupModel): Observable<APIAuthResponseModel> {
        return this.http.post<APIAuthResponseModel>(`${API_URL}/portal/new-user`, payload)
    }

    resetPasswordRequest(payload: ResetPasswordModel): Observable<APIAuthResponseModel | null> {
        return this.http.post<APIAuthResponseModel>('set url', payload)
    }

    resetPasswordEditionRequest(payload: PatchPasswordModel): Observable<APIAuthResponseModel | null> {
        return this.http.patch<APIAuthResponseModel>('set url', payload)
    }

    getUserRequest(options?: Object): Observable<UserDataAPIResponseModel> {
        let _options = Object.create(options || {});
        let use_token = false;
        if (_options.token) {
            use_token = true
        }
        if (!use_token) {
            return this.http.get<UserDataAPIResponseModel>(`${API_URL}/users/Me`);
        } else {
            return this.http.get<UserDataAPIResponseModel>(`${API_URL}/users/Me`, {
                responseType: 'json',
                observe: 'body',
                headers: new HttpHeaders({Authorization: `Bearer ${_options.token}`})
            })
        }
    }

    // contacts
    getAllContactsRequest(): Observable<ApiResponseModel<ContactModel[]>> {
        return this.http.get<ApiResponseModel<ContactModel[]>>(
            `${API_URL}/users/Me/Contacts`
        )
    }

    createContactRequest(payload: { username: string, email: string }): Observable<ContactModel[]> {
        return this.http.post<ContactModel[]>(
            `${API_URL}/users/Me/Contacts`, payload
        )
    }

    //msg
    loadMessagesFromRoomRequest(room: string): Observable<ApiResponseModel<MessageModel|MessageModel[]>> {
        return this.http.get<ApiResponseModel<MessageModel|MessageModel[]>>(`${API_URL}/messages/${room}`)
    }

    loadAllUserMessagesSortedByRoomRequest():
        Observable<ApiResponseModel<ServerLoadedMessagesModel[]>> {
        return this
            .http.get<ApiResponseModel<ServerLoadedMessagesModel[]>>(
                `${API_URL}/messages`
            )
    }

    loadRoomsFromUserRequest(): Observable<ApiResponseModel<RoomModel | RoomModel[]>> {
        return this.http.get<ApiResponseModel<RoomModel[]>>(`${API_URL}/rooms`)
    }

    createRoomRequest(payload: RoomFactoryDataModel): Observable<ApiResponseModel<RoomModel>> {
        const _formData = this.formDataParser.generate(payload,undefined,true);
        return this.http.post<ApiResponseModel<RoomModel>>(`${API_URL}/rooms`, _formData/*,{
            headers: new HttpHeaders({contentType: 'multipart/form-data'})}*/)
    }


    //todo

    updateContactRequest() {
    }

    deleteContactRequest() {
    }

    getContactRequest() {
    }

    //side-bar
    deleteRoomsRequest() {
    }

    getRoomDetailsRequest() {
    }

    updateRoom() {
    }

    //msg
    // no longer needed since using socket io.
    // sendMessageRequest(){}
    // editMessageRequest(){}
    // deleteMessageRequest(){}

    //profile
    editProfileRequest() {
    }

    changeProfilePasswordRequest() {
    }

    changeProfileEmailRequest() {
    }

    deleteAccountRequest() {
    }

}

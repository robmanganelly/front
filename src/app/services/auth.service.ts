import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {UserDataAPIResponseModel, UserModel, UserPrototype} from "../models/user.model";
import {APIAuthResponseModel, LoginModel, SignupModel} from "../models/auth.model";
import {HttpService} from "./http.service";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {DataService} from "./data.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CustomErrorHandlerService} from "./custom-error-handler.service";
import {CoreService} from "./core.service";

@Injectable()
export class AuthService {
    private tokenExpirationTimer: any;




    constructor(
        private coreService: CoreService,
        private errHandler: CustomErrorHandlerService,
        private snack: MatSnackBar,
        private dataService: DataService,
        private router: Router,
        private appHttp: HttpService) {
    }

    signupRoutine(data: SignupModel): Observable<UserModel> {
        return this.appHttp.signUpRequest(data).pipe(
            catchError(this.errHandler.errorHandler),
            switchMap((response) => {
                this.autologout(1000*60*120)
                return this.loadUserData(response.token);
            }),
            map((apiResponse)=>{
                return apiResponse.data.data
            })
        )
    }

    loginRoutine(data: LoginModel): Observable<UserModel> {
        return this.appHttp.loginRequest(data).pipe(
            catchError(this.errHandler.errorHandler),
            switchMap((response) => {
                this.autologout(1000*60*120)
                return this.loadUserData(response.token);
            }),
            map((data)=>{
                return data.data.data;
            })
        )
    }

    logOutRoutine() {
        // cleaning subjects...
        this.coreService.userBehaviorSubject.next(null);
        this.coreService.activeRoomBehaviorSubject.next(null);
        this.coreService.loadedRoomsBehaviorSubject.next([]);
        this.coreService.messageListStateSnapshotSubject.next(undefined);
        this.coreService.ContactsBehaviorSubject.next(null);

        localStorage.removeItem('USER_DATA');
        localStorage.removeItem('USER_CONTACTS');
        localStorage.clear(); // ??
        this.router.navigate(['portal']);
        if (this.tokenExpirationTimer){
            clearInterval(this.tokenExpirationTimer);
        }
    }

    autologin() {
        const loggedUser = this.getLoadedUser();
        if (!loggedUser) return;

        if (!loggedUser.token) return;

        if (loggedUser.token) {
            this.autologout(new Date(loggedUser.tokenExpiration).getTime()-Date.now())
            this.coreService.userBehaviorSubject.next(loggedUser);
            this.coreService.informLogin();
            this.router.navigate(['session',loggedUser._id,'home'])
        }

    }


    autologout(countdown: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logOutRoutine()
        }, countdown);
    }

    loadUserData(token?: string): Observable<UserDataAPIResponseModel> {
        if (!token){
            token = JSON.parse(localStorage.getItem('USER_DATA') || 'null').token;
        }
        //should grab the user from the database, by using the token
        // also writes localStorage??
        return this.appHttp.getUserRequest({token}).pipe(tap(
            this.writeLocally(token)
        ))
    }

    writeLocally(token: string | undefined){
        if (!token){
            throw Error('cant write without token')
        }
        return (userData: UserDataAPIResponseModel) => {
            const {_id, username, email, photo, contacts} = userData.data.data
            const _tokenExpiration = new Date(Date.now() + 1000 * 60 * 120)
            const loadedUser = new UserPrototype(
                _id, token, _tokenExpiration, photo, username, email, contacts)
            localStorage.setItem('USER_DATA', JSON.stringify(loadedUser));
            this.coreService.userBehaviorSubject.next(loadedUser);
        }
    }

    getLoadedUser(){
        const loadedLocalStorage = localStorage.getItem('USER_DATA') || 'null';
        const user =  JSON.parse(loadedLocalStorage);

        if (!user){ return null; }
        const { _token, _tokenExpiration, _id, email, username, photo , contacts} = user;
        return new UserPrototype(_id, _token, _tokenExpiration,photo, username, email, contacts);
    }



}

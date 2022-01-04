import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {DataService} from "./data.service";
import {exhaustMap, take} from "rxjs/operators";
import { UserPrototype} from "../models/user.model";
import {CoreService} from "./core.service";

@Injectable()
export class SetTokenInterceptorService implements  HttpInterceptor{

  constructor(
    private coreService: CoreService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // @ts-ignore
    return this.coreService.userBehaviorSubject.pipe(take(1),
      exhaustMap(
        (userData: UserPrototype)=>{
          if (!userData){
            return next.handle(req)
          }
          const modifiedRequest = req.clone({
              headers: new HttpHeaders({
              Authorization: `Bearer ${userData.token}`
            })
          })
          return next.handle(modifiedRequest)
        }
      ))
  }

}

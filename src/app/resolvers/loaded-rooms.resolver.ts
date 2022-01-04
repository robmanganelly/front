import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ExtendedRoomModel} from "../models/message.model";
import {CoreService} from "../services/core.service";
import {map, switchMap, take, tap} from "rxjs/operators";
import {ContactModel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class LoadedRoomsResolver implements Resolve<ExtendedRoomModel[]> {
  constructor(private coreService: CoreService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ExtendedRoomModel[]> {
    return this.coreService.loadedRoomsBehaviorSubject.pipe(
        take(1),
        tap((data)=>{
            if (data.length === 0){
                this.coreService.loadRoomsFromUser()
            }
        })
    );
  }
}

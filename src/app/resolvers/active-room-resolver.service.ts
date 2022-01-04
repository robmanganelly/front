import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {ExtendedRoomModel, RoomModel} from "../models/message.model";
import {Observable, of} from "rxjs";
import {CoreService} from "../services/core.service";
import {map, pluck, switchMap, take, tap} from "rxjs/operators";
import {HttpService} from "../services/http.service";

@Injectable({
    providedIn: 'root'
})
export class ActiveRoomResolverService implements Resolve<RoomModel | ExtendedRoomModel | null> {


    constructor(
        private appHttp: HttpService,
        private coreService: CoreService
    ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot):
        Observable<RoomModel | ExtendedRoomModel | null> |
        Promise<RoomModel | ExtendedRoomModel | null> |
        RoomModel | ExtendedRoomModel | null {
        console.log('dev log: calling resolver : active Room')
        return this.coreService.activeRoomBehaviorSubject.pipe(take(1), // if missing blocks component displaying forever
            switchMap((room) => {
                if (!!room){
                    console.log('return resolver clean data ')
                    console.log(room)
                    return of(room).pipe(take(1));
                }
                else return this.appHttp.loadRoomsFromUserRequest().pipe(
                    tap(console.log),
                    pluck('data'),
                    pluck('data'),
                    map((rooms) => {
                        if ((rooms as RoomModel[]).length === 0) {
                            console.log('return resolver null')
                            return null;
                        } else{
                            console.log('return resolver data')
                            console.log((rooms as RoomModel[])[0] as unknown)// dev log
                            return (rooms as RoomModel[])[0];
                        }
                    }),
                    tap((room)=>{
                        console.log('dev log: emitting behavior subject with new activeRoom')
                        this.coreService.activeRoomBehaviorSubject.next(room)
                    })
                )
            }))
    }
}

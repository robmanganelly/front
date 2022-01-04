import {Component, OnDestroy, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {map, shareReplay, tap} from 'rxjs/operators';
import {ActivatedRoute, Data, Router} from "@angular/router";
import {UserPrototype} from "../../models/user.model";
import {AssetsService} from "../../services/assets.service";
import {CoreService} from "../../services/core.service";
import {ExtendedRoomModel, RoomModel} from "../../models/message.model";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

    activeRoom: RoomModel | ExtendedRoomModel | undefined   = undefined;
    // havePrevious: boolean = false;

    activeRoomSub: Subscription = new Subscription();
    currentUser: UserPrototype| undefined = undefined;

    // ui fields
    selectedChat: string = '';
    chatPhoto: string = "";
    emptyChat: boolean = true; // hides photo and replaces chat text


    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    constructor(
        private coreService: CoreService,
        private router: Router,
        private asset: AssetsService,
        private activatedRoute: ActivatedRoute,
        private breakpointObserver: BreakpointObserver) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(tap(console.log))
            .subscribe(
            (data: Data) => {
                this.emptyChat = !(!!data.loadedRooms && data.loadedRooms.length > 0);
                this.currentUser = data.loggedUser;
                this.activeRoom = !!data.currentActiveRoom ? data.currentActiveRoom : null;
                this.updateUiOnActiveRoomChange(this.activeRoom as RoomModel);
            },(e)=>{console.log(e)}, ()=>{console.log('\n\ncomplete subscription on home\n\n')}
        )
        this.activeRoomSub = this.coreService.catchActiveRoom().pipe().subscribe(
            (r) => {
                if(!!r) this.activeRoom = r;
                this.updateUiOnActiveRoomChange(r);
            }
        )
    }

    ngOnDestroy(): void {
        this.activeRoomSub.unsubscribe();
    }

    updateUiOnActiveRoomChange(room: RoomModel|ExtendedRoomModel|null){
        if(!room){
            this.emptyChat = true;
            return;
        }
        this.emptyChat = false;
        this.selectedChat = <string>room?.roomName;
        this.chatPhoto = this.asset.buildAsset(<string>room?.roomPhoto);
    }


    addFirstContact() {
        return this.router.navigate(['session', (this.currentUser as UserPrototype)._id, 'contacts'])
    }
}

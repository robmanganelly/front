import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExtendedRoomModel, RoomModel} from "../../models/message.model";
import {ActivatedRoute, Data} from "@angular/router";
import {Subscription} from "rxjs";
import {AssetsService} from "../../services/assets.service";
import {CoreService} from "../../services/core.service";

@Component({
    selector: 'app-room-tile',
    templateUrl: './room-tile.component.html',
    styleUrls: ['./room-tile.component.css']
})
export class RoomTileComponent implements OnInit, OnDestroy {

    loadedRooms: ExtendedRoomModel[] = [];
    roomSub: Subscription = new Subscription();
    activeRoomSub: Subscription = new Subscription();

    constructor(
        private asset: AssetsService,
        private coreService: CoreService,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(
            (data: Data)=>{
                this.onReceiveRoomData(data.loadedRooms);
            }
        )
        this.coreService.loadedRoomsBehaviorSubject.pipe().subscribe(this.onReceiveRoomData.bind(this))
        this.coreService.messageListStateSnapshotSubject
            .pipe().subscribe(
                (state)=>this.coreService.updateBadges(state,this.loadedRooms)
        )
    }

    ngOnDestroy(): void {
        if (this.roomSub) {
            this.roomSub.unsubscribe()
        }

        if(this.activeRoomSub) {
            this.activeRoomSub.unsubscribe()
        }
    }

    onClickCardNameAndAvatar(i: number ) {
        this.coreService.pickRoom(i).subscribe((room)=>{
            this.coreService.emitJoinRoomEvent(room._id);
        })
    }

    onDeleteRoom(room: RoomModel) {
        alert('implement Delete Room')
        // send a request to delete room providing user id,
        // deleting a room means:
        // remove your own id from the room.
        // subscribe and resend the loadedRooms with the subject.
        // update loaded Rooms,
    }

    onEditRoom(room: RoomModel) {
        alert('implement Edit Room')
        //send a request to edit the room .
        // a room can be edited by changing their name and
    }

    onReceiveRoomData(rooms: RoomModel[]|ExtendedRoomModel[]){
        this.loadedRooms = rooms;
        this.loadedRooms.forEach(room=>room.roomPhoto = this.asset.buildAsset(room.roomPhoto))
    }


}

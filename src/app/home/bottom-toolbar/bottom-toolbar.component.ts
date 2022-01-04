import {Component, OnChanges, OnInit} from '@angular/core';
import {MessageService} from "../../services/message.service";
import {MessagePrototype} from "../../models/message.model";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {CoreService} from "../../services/core.service";
import {ActivatedRoute, Data} from "@angular/router";

@Component({
    selector: 'app-bottom-toolbar',
    templateUrl: './bottom-toolbar.component.html',
    styleUrls: ['./bottom-toolbar.component.css']
})
export class BottomToolbarComponent implements OnInit, OnChanges {

    activeRoomSub: Subscription = new Subscription();
    private activeRoom: string | null = '';
    displayBar: boolean = true;
    private loggedUserId: string | boolean = true;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private msgService: MessageService,
        private coreService: CoreService
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(
            (data: Data) => {
                this.loggedUserId = data.loggedUser._id;
                this.displayBar = !!data.currentActiveRoom;
                this.activeRoom = this.displayBar ? data.currentActiveRoom.id : null;
            }
        )
        // this is for update active room whenever emitted...
        this.activeRoomSub = this.coreService.catchActiveRoom().subscribe(
            (room) => {
                if (!!room) {
                    this.displayBar = true;
                    this.activeRoom = <string>room._id
                }
            }
        )
    }


    postMessage(msgcontent: HTMLTextAreaElement): void {
        let msg = new MessagePrototype(
            msgcontent.value,
            this.activeRoom as string,
            this.loggedUserId  as string, 0
        )
        //resets textarea and give it back focus
        msgcontent.value = "";
        msgcontent.focus()

        this.coreService.emitMessageEvent(msg)
    }

    ngOnChanges() {
        this.activeRoomSub.unsubscribe()
    }

}

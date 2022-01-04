import {NgModule} from '@angular/core';
import {BottomToolbarComponent} from "./bottom-toolbar/bottom-toolbar.component";
import {HomeComponent} from "./home/home.component";
import {MsgBubbleComponent} from "./msg-bubble/msg-bubble.component";
import {MsgListComponent} from "./msg-list/msg-list.component";
import {RoomTileComponent} from "./room-tile/room-tile.component";
import {SideToolbarComponent} from "./side-toolbar/side-toolbar.component";
import {SharedModule} from "../shared-module/shared.module";
import {HomeRoutingModule} from "./home-routing.module";


@NgModule({
    declarations: [
        BottomToolbarComponent,
        HomeComponent,
        MsgBubbleComponent,
        MsgListComponent,
        RoomTileComponent,
        SideToolbarComponent
    ],
    imports: [
        SharedModule,
        HomeRoutingModule
    ]
})
export class HomeModule {
}

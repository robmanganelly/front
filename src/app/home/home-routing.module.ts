import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {UserResolverService} from "../resolvers/user.resolver.service";
import {ActiveRoomResolverService} from "../resolvers/active-room-resolver.service";
import {LoadedRoomsResolver} from "../resolvers/loaded-rooms.resolver";

const homeRoutes: Routes = [
    {
        path: '', component: HomeComponent,
        resolve: {
            loadedRooms: LoadedRoomsResolver,
            loggedUser: UserResolverService,
            currentActiveRoom: ActiveRoomResolverService
        }
    }
]


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(homeRoutes)
    ],
    exports: [RouterModule]
})
export class HomeRoutingModule {
}

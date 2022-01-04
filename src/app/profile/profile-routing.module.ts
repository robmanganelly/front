import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ProfileComponent} from "./profile/profile.component";
import {UserResolverService} from "../resolvers/user.resolver.service";
import {ActiveRoomResolverService} from "../resolvers/active-room-resolver.service";

const profileRoutes: Routes = [
    {
        path: '', component: ProfileComponent, resolve: {
            loggedUser: UserResolverService,
            currentActiveRoom: ActiveRoomResolverService
        }
    }
]


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(profileRoutes)
    ],
    exports: [RouterModule]
})
export class ProfileRoutingModule {
}

import {NgModule} from '@angular/core';
import {ProfileComponent} from "./profile/profile.component";
import {SharedModule} from "../shared-module/shared.module";
import {ProfileRoutingModule} from "./profile-routing.module";


@NgModule({
    declarations: [ProfileComponent],
    imports: [
        SharedModule,
        ProfileRoutingModule

    ]
})
export class ProfileModule {
}

import {NgModule} from '@angular/core';
import {AuthFormComponent} from "./auth-form/auth-form.component";
import {RecoverComponent} from "./recover/recover.component";
import {SharedModule} from "../shared-module/shared.module";
import {AuthRoutingModule} from "./auth-routing.module";


@NgModule({
    declarations: [AuthFormComponent,RecoverComponent],
    imports: [
        SharedModule,
        AuthRoutingModule
    ]
})
export class AuthModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RecoverComponent} from "./recover/recover.component";
import {AuthFormComponent} from "./auth-form/auth-form.component";

const authRoutes: Routes = [
  {path: '', component: AuthFormComponent},
  {path: 'recovery', component: RecoverComponent},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports:[RouterModule]
})
export class AuthRoutingModule { }

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthFormComponent} from "./auth/auth-form/auth-form.component";
import {SessionComponent} from "./session/session.component";
import {AuthGuardService} from "./guards/auth.guard.service";
import {CanDeactivateGuardService} from "./guards/can-deactivate-guard.service";
import {NotFoundComponent} from "./not-found/not-found.component";
import {UserResolverService} from "./resolvers/user.resolver.service";
import {ActiveRoomResolverService} from "./resolvers/active-room-resolver.service";

const appRoutes: Routes = [
     {path: '', component: AuthFormComponent , pathMatch: 'full' },
    {path:'portal', loadChildren:()=>import('./auth/auth.module').then(m=>m.AuthModule)},
    {path: 'session/:id',
        component: SessionComponent,
        resolve: {
            loggedUser: UserResolverService,
            currentActiveRoom: ActiveRoomResolverService
        },
        canActivate: [AuthGuardService], // canActivateChild: [AuthGuardService],
        canDeactivate: [CanDeactivateGuardService],
        children: [{
                path: 'home',
                loadChildren: ()=>import('./home/home.module').then(m=>m.HomeModule)
            }, {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
            }, {
                path: 'contacts',
                loadChildren:()=>import('./contacts/contacts.module').then(m=>m.ContactsModule)
            }]
    },
    {path: 'not-found', component: NotFoundComponent},
    {path: '**', redirectTo: '/not-found'}
]


@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports:[
        RouterModule
    ]
})
export class AppRoutingModule{}

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SetTokenInterceptorService} from "./services/set.token.interceptor.service";
import {AuthService} from "./services/auth.service";
import {DataService} from "./services/data.service";
import {HttpService} from "./services/http.service";
import {MessageService} from "./services/message.service";
import {SessionComponent} from './session/session.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {AppRoutingModule} from "./app-routing.module";
import {SharedModule} from "./shared-module/shared.module";

@NgModule({
    declarations: [
        AppComponent,
        SessionComponent,
        NotFoundComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        LayoutModule,
        HttpClientModule,
        AppRoutingModule,
        SharedModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: SetTokenInterceptorService,
        multi: true
    }, AuthService, DataService, HttpService, MessageService ],
    bootstrap: [AppComponent]
})
export class AppModule {}

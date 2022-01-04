import {NgModule} from "@angular/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatMenuModule} from "@angular/material/menu";
import {MatBadgeModule} from "@angular/material/badge";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
    declarations:[],
    providers:[],
    // imports:[  // as long as imports array remain the same, it can be omitted
    //     MatToolbarModule,
    //     MatButtonModule,
    //     MatSidenavModule,
    //     MatIconModule,
    //     MatListModule,
    //     MatCardModule,
    //     MatGridListModule,
    //     MatInputModule,
    //     MatTooltipModule,
    //     MatExpansionModule,
    //     MatCheckboxModule,
    //     MatProgressSpinnerModule,
    //     MatMenuModule,
    //     MatBadgeModule,
    // ],
    exports:[
        MatSnackBarModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatCardModule,
        MatGridListModule,
        MatInputModule,
        MatTooltipModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatBadgeModule,
    ]
})
export class AngularMaterialModule{}

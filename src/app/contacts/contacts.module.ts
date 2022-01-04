import {NgModule} from '@angular/core';
import {ContactChartComponent} from "./contact-chart/contact.chart.component";
import {ContactTileComponent} from "./contact-tile/contact.tile.component";
import {SharedModule} from "../shared-module/shared.module";
import {ContactsRoutingModule} from "./contacts-routing.module";


@NgModule({
  declarations: [
      ContactChartComponent,
      ContactTileComponent
  ],
  imports: [
      SharedModule,
      ContactsRoutingModule
  ]
})
export class ContactsModule { }

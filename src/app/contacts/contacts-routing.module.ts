import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ContactResolverService} from "../resolvers/contact-resolver.service";
import {ContactChartComponent} from "./contact-chart/contact.chart.component";

const contactsRoutes: Routes = [
  {path: '', component: ContactChartComponent, resolve: {contacts: ContactResolverService}}
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(contactsRoutes)
  ],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }

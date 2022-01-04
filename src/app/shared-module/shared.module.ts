import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TruncatePipe} from "./pipes/truncate.pipe";
import {DatetimePipe} from "./pipes/datetime.pipe";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AngularMaterialModule} from "../angular-material.module";

@NgModule({
  declarations: [
      TruncatePipe,
      DatetimePipe
  ],
  // imports: [
  //   CommonModule,
  // ],
    exports:[
        TruncatePipe,
        DatetimePipe,
        ReactiveFormsModule,
        RouterModule,
        AngularMaterialModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
    ]
})
export class SharedModule { }

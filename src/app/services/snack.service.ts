import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {PartialObserver} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  constructor(
      private snack: MatSnackBar
  ) { }

  green(
      msg: string,
      duration: number = 4000,
      vpos: any = 'top',
      hpos:any  = 'right'
  ){
    console.log('dev log on snack service.ts : called green ')
    return ()=>{this.snack.open(msg,undefined,{
      panelClass: ['snack'],
      duration: duration,
      verticalPosition:vpos,
      horizontalPosition: hpos,
      politeness: "polite"
    })}
  }

  warn(
      msg: string,
      duration: number = 4000,
      vpos: any = 'bottom',
      hpos:any  = 'right'
  ){
    return ()=>{
      this.snack.open(msg,undefined,{
        panelClass: ['snack-error'],
        duration: duration,
        verticalPosition:vpos,
        horizontalPosition: hpos,
        politeness: "polite"
      })
    }

  }

  execute(message:string,label:string,config:MatSnackBarConfig,perform:(v: void)=>void){
    return this.snack.open(message,label,config).onAction().subscribe(perform)

  }

}

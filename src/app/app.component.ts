import { Component } from '@angular/core';
import {DataService} from "./services/data.service";
import {SnackService} from "./services/snack.service";
import {MessageService} from "./services/message.service";
import {MessageModel} from "./models/message.model";
import {CoreService} from "./services/core.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
      private coreService: CoreService,
      private msgService: MessageService,
      private dataService: DataService,
      private snack: SnackService
  ) {
    // this.dataService.socket.on("connect_error",(e)=>{
    //   snack.warn(`${e.name}: ${e.message} `)()
    // });
    // this.dataService.socket.on('msg',(msg)=>{
    //   console.log('message: ',msg);
    //   this.msgService.send.next(<MessageModel>msg);
    // })
  }



  title = 'MEAN Chat';

}

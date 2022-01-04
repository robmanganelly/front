import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MessageModel, MessagePrototype} from "../../models/message.model";

@Component({
  selector: 'app-msg-bubble',
  templateUrl: './msg-bubble.component.html',
  styleUrls: ['./msg-bubble.component.css']
})
export class MsgBubbleComponent implements OnInit, OnDestroy {

  // @Input()data: MessageModel|MessagePrototype = {text:"", sent: new Date(), owner: true, state: 0};
  @Input()data: MessagePrototype = new MessagePrototype('','','',0)
  constructor(
      // private coreService: CoreService, // not used yet
  ) { }


  ngOnInit(): void {
  }

  ngOnDestroy(): void{
  }

}

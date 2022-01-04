import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import { MessageModel} from "../models/message.model";
import {DataService} from "./data.service";

@Injectable()
export class MessageService {

  send: Subject<MessageModel[] | MessageModel> = new Subject<MessageModel[] | MessageModel>()



  msgStateSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  loadingMsgListState: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(){  }

}

import {ApiResponseModel} from "./api";

export interface ServerLoadedMessagesModel{
  _id: string;
  sent_messages: MessageModel[]|MessagePrototype[]
}
export interface MessageStateSnapshot{
  [id: string]: number
}

export interface MessageDispatcherModel {
  dispatcher:ServerLoadedMessagesModel[]
}
export class MessageDispatcherPrototype implements MessageDispatcherModel{

  dispatcher: ServerLoadedMessagesModel[] = [];

  constructor() {}

  load(loadedData: ServerLoadedMessagesModel[] | ApiResponseModel<ServerLoadedMessagesModel[]>):void{
    this.dispatcher = [] // cleans the array
    if (Array.isArray(loadedData)){
      loadedData.forEach((roomGroup)=>{
        roomGroup.sent_messages = roomGroup.sent_messages.map((message)=>{
          const {_id, text,room, state, owner, sent } = message;
          return new MessagePrototype(text,room as string,owner as string,state,_id,sent)
        })
      })
      this.dispatcher.push(...loadedData);
      return;
    }else{
      return this.load(loadedData.data.data);
    }
  }

  snapshot(options?:{id?:string, active?: string}):MessageStateSnapshot {
    let state: MessageStateSnapshot = {};

    if(!!options?.id){
      let single: number = this.dispatcher.filter(entry=>entry._id===options.id)[0].sent_messages.length;
      state[options.id] = (!!options?.active && options.active !==options.id) ? single : 0;
    }
    else{ // there are options(or not) but no never id
      this.dispatcher.forEach(
          (entry)=>{
            state[entry._id] =  (!!options?.active && options?.active === entry._id) ? 0 : entry.sent_messages.length;
          }
      )
    }
    return state;
  }

  getFrom(id:string,clear: boolean=true): MessagePrototype[]{
    let fMsg = this.dispatcher.filter(entry=>entry._id===id)
    console.log('fMsg is: ')
    console.log(fMsg)
    this._delete(id,clear)
    return (fMsg.length > 0 ? fMsg[0].sent_messages as MessagePrototype[] : []);
  }

  store(message: MessagePrototype){
    const {room} = message;
    this.dispatcher.forEach((messageList)=>{
      if (<string>messageList._id===<string>room){messageList.sent_messages.push(message)}
    })
  }

  private _delete(id:string, confirm:boolean = true){
    if(confirm){
      this.dispatcher = this.dispatcher.filter(entry=>entry._id !== id);
    }
  }

}

export interface MessageModel {
  _id?:string;
  room?: string,
  owner: boolean | string;
  text: string;
  sent: Date;
  state: number;
}

export class MessagePrototype implements MessageModel{
  owner: boolean | string;
  room: string;
  sent: Date;
  text: string;
  _state = 0;
  _id: undefined | string;

  constructor(
      text:string,
      room: string,
      owner: string,
      state: number,
      _id?: string,
      sent?: Date) {
    this.sent = !!sent ? sent : new Date();
    this.room = room;
    this.owner = owner;
    this.text = text;
    this._id = !!_id ? _id : undefined
    this.state = !!state ?state : 0;
  }

  get state(){
    return this._state > 2 ? 2 : this._state;
  }

  set state(value){
    this._state = this._state === 0 ? 1 : 2;
  }

  register(id:string){
    this._id = id;
    this.state++;
  }
}

export interface RoomFactoryDataModel{
  isGroup?: boolean, file?: File,
  members: string[], roomName: string, roomPhoto: string
}

export interface ExtendedRoomModel extends RoomModel{
  activeState?: boolean;
  pending?: number;
}

export interface RoomModel{
  roomPhoto: string,
  _id: string;
  members: string[],
  createdAt: Date,
  roomName: string

}

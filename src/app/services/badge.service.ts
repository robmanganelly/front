import { Injectable } from '@angular/core';
import {DataService} from "./data.service";
import {MessageService} from "./message.service";
import {Subject} from "rxjs";
import { MessageModel} from "../models/message.model";
import {map} from "rxjs/operators";

interface Watcher{ [id:string]: number };

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  hotRooms: Watcher = Object.create({});

  roomWatcher: Subject<Watcher> = new Subject<Watcher>();

  constructor(
      private dataService: DataService,
      private msgService: MessageService
  ) {
      this.dataService.loadRoomsFromUser()
          .pipe(map((re)=>{
                      if(Array.isArray(re)){
                          return re.map((room)=> {
                              return room._id
                          })}else{return re._id}}))
          .subscribe(
          (roomsIds)=>{
              if (Array.isArray(roomsIds)){
                  roomsIds.forEach(r=> this.hotRooms[r]= 0)
              }else{
                  this.hotRooms[roomsIds]=0
              }
          }
      )

      this.dataService.socket.on('msg',(msg:MessageModel)=>{
          const roomId = <string>msg.room;
          if (roomId in this.hotRooms){
              this.hotRooms[roomId]++
          }else{
              this.hotRooms[roomId] = 1
          }
          this.roomWatcher.next(this.hotRooms)

          //logs
          console.log('emitted');
          console.log(this.hotRooms);
      })

  }

  clearWatcher(id: string, remove: boolean = false, propagate:boolean = true ){
      if (id === 'wipe'){
          this.hotRooms = Object.create({});
      }else{
          this.hotRooms[id] = 0;
      }
      if (remove){
           delete this.hotRooms[id]
      }
      if (propagate) this.roomWatcher.next(this.hotRooms)
  }

}

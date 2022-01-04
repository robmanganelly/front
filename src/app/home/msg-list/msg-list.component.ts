import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ExtendedRoomModel, MessagePrototype, RoomModel} from "../../models/message.model";
import {ActivatedRoute, Data} from "@angular/router";
import {Subscription} from "rxjs";
import {filter, tap} from "rxjs/operators";
import {CoreService} from "../../services/core.service";

@Component({
  selector: 'app-msg-list',
  templateUrl: './msg-list.component.html',
  styleUrls: ['./msg-list.component.css']
})
export class MsgListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren("msgTemplateRef") messageInstances: QueryList<ElementRef> | undefined = undefined;

  currentConversationMessages:MessagePrototype[] =  [];
  currentActiveRoom: RoomModel| ExtendedRoomModel | null | undefined = undefined;

  listState: number = 0; // handles the spinner 0: spinner 1: empty 2: list



  loggedUserId: string  | undefined = undefined;

  sendSub: Subscription = new Subscription();
  msgSub: Subscription = new Subscription();
  scrollSub: Subscription = new Subscription();
  activeRoomSub: Subscription | undefined = new Subscription() ;
  listStateSub: Subscription = new Subscription();

  constructor(
      private activatedRoute: ActivatedRoute,
      private coreService: CoreService
  ) { }

  setAlign(owner: string | boolean): boolean{
    if (typeof(owner) === "boolean"){
      return <boolean>owner;
    }
    else {
      return this.loggedUserId === owner
    }
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
        (data: Data) => {
          this.loggedUserId = data.loggedUser._id;
          this.listState = (!!data.loadedRooms && data.loadedRooms.length > 0)? 2 : 1;
        } );

    this.activeRoomSub = this.coreService.activeRoomBehaviorSubject.pipe(
        tap((room)=> {
            this.listState = 0;
            console.log('\n\n\nset list to zero\n\n\n')
            this.currentActiveRoom = room
        })
    ).subscribe((room)=>{
        this.currentConversationMessages = this.coreService.readRoomMessages(room?._id as string);
        this.currentConversationMessages.forEach(message=>message.register(message._id as string));
        this.listState = 2;
        console.log('\n\n\nset list to two\n\n\n')
    },console.log)

    this.sendSub = this.coreService.messageSubject.pipe(
        filter((message)=>{
            return message.room === this.currentActiveRoom?._id as string}
    )).subscribe(
        (message)=>{
            this.currentConversationMessages.push(message as MessagePrototype)
        })

  }



  ngAfterViewInit(): void {
    this.scrollSub = this.messageInstances?.changes.subscribe(()=>{
      if (this.messageInstances && this.messageInstances.last){
        this.messageInstances.last.nativeElement.scrollIntoView(
            {behavior: "smooth", block: "end"})
      }
    }) as Subscription;
  }

  ngOnDestroy(): void {
    this.listStateSub.unsubscribe();
    this.sendSub.unsubscribe();
    this.msgSub.unsubscribe();
    this.scrollSub.unsubscribe();
    if (this.activeRoomSub) this.activeRoomSub.unsubscribe();
  }

}

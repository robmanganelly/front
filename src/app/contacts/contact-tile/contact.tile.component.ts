import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ContactModel} from "../../models/user.model";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {AssetsService} from "../../services/assets.service";
import {MessageService} from "../../services/message.service";
import {RoomFactoryDataModel} from "../../models/message.model";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";
import {GroupFactoryModel} from "../../models/group.factory.model";
import {SnackService} from "../../services/snack.service";
import {CoreService} from "../../services/core.service";


@Component({
  selector: 'app-contact-tile',
  templateUrl: './contact.tile.component.html',
  styleUrls: ['./contact.tile.component.css']
})
export class ContactTileComponent implements OnInit, OnDestroy {

  @Input()selectable: boolean = false;

  editContact = false;

  roomFactorySub: Subscription = new Subscription();
  contactSub: Subscription = new Subscription();

  @Output('flag')StateReporter: EventEmitter<GroupFactoryModel> = new EventEmitter<GroupFactoryModel>();

  contacts: ContactModel[] | undefined;

  buttons = [
    {icon: 'chat', action: this.onClickChat.bind(this)},
    {icon: 'edit', action: this.onClickEdit.bind(this)},
    {icon: 'delete', action: this.onClickDelete.bind(this)},
  ]

  constructor(
      private coreService: CoreService,
      private snack: SnackService,
      private router: Router,
      private msgService: MessageService,
      private asset: AssetsService,
      private activatedRoute: ActivatedRoute
  ) {}

  onClickChat(contact: ContactModel) {
    const payload: RoomFactoryDataModel = {
      roomName: contact.username,
      roomPhoto: contact.userId.photo,
      members: [contact.userId._id],
    }
    this.coreService.createRoom(payload).pipe(
        take(1),
        // tap(this.snack.green('switching to chat')) // unnecessary
    ).subscribe(
        (room)=>{
          this.router.navigate(['../home'],{
            relativeTo: this.activatedRoute, state: {rememberRoom: true} // deprecated ?
          })
        },
        ()=>{
          console.log('failed create room')
        }

    )
    // launch a request to create room (needs backend)
    // navigate to home and loads the new room (peer username on home screen).
  }

  onClickEdit() {
    this.editContact = !this.editContact;
  }

  onClickDelete() {
    return undefined;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
        ((data: Data)=>{
          this.contacts = data.contacts;
          this.contacts?.forEach((contact)=>{
            contact.userId.photo = this.asset.buildAsset(contact.userId.photo);
          })
        })
    )
    this.contactSub = this.coreService.ContactsBehaviorSubject.subscribe(
        (contacts)=>{
          this.contacts = <ContactModel[]>contacts;
          this.contacts?.forEach((contact)=>{
            contact.userId.photo = this.asset.buildAsset(contact.userId.photo);
          })
        }
    );
  }

  ngOnDestroy(){
    this.contactSub.unsubscribe();
  }

  reportState(id: string, checked: boolean) {
    this.StateReporter.emit({id, checked});
  }
}

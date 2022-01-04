import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Router} from "@angular/router";
import { Subscription} from "rxjs";
import {SnackService} from "../../services/snack.service";
import { take, tap} from "rxjs/operators";
import {AssetsService} from "../../services/assets.service";
import {GroupFactoryModel} from "../../models/group.factory.model";
import {CoreService} from "../../services/core.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ContactModel} from "../../models/user.model";
import {CustomErrorHandlerService} from "../../services/custom-error-handler.service";

@Component({
  selector: 'app-contact.chart',
  templateUrl: './contact.chart.component.html',
  styleUrls: ['./contact.chart.component.css']
})
export class ContactChartComponent implements OnInit, OnDestroy {

  createSub: Subscription = new Subscription();

  createContact: boolean = false;

  contactsForValidation: ContactModel[] = [];

  //room creation fields
  createRoom: boolean = false;
  newGroupImagePreview: string|undefined = undefined;
  newGroupMembers: string[] = [];

  // room factory form   todo fix this form , reacondicionar el form para ser usado aqui para poder subir img
  newRoomForm = new FormGroup({
    newGroupName: new FormControl(null,[
        Validators.required, Validators.max(50),Validators.min(5)
    ]),
    newGroupImage: new FormControl(null),
    imageToUpload: new FormControl(null)
  },{ validators: ()=>{return this.newGroupMembers.length>=1?null:{emptyGroupError:true} }})

  newContactForm = new FormGroup({
    newContactName: new FormControl(null,[Validators.required]),
    newContactEmail: new FormControl(null,[
        Validators.required, Validators.email,(control)=>{
      return this.coreService.testContactEmail(control.value, this.contactsForValidation) ? {DuplicatedEmailError: true}: null
      }])
  })


  constructor(
      private errHandler: CustomErrorHandlerService,
      private coreService: CoreService,
      private asset: AssetsService,
      private snackService: SnackService,
      private router: Router,
      private activatedRoute: ActivatedRoute
  ) {
    if (this.router.getCurrentNavigation()?.extras.state?.createRoom) this.createRoom = true;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
        (data: Data)=>{
          this.contactsForValidation = data.contacts;
        }
    )
    this.coreService.ContactsBehaviorSubject.subscribe((ctx)=>{
      if(!!ctx)this.contactsForValidation= ctx;
    })
  }

  goHome() {
    this.onDiscardImage()
    this.router.navigate(['../home'],{relativeTo: this.activatedRoute})
  }
  onSubmitCreateRoom(){
    console.log('launched on Submit');
    // todo create a spinner for block inputs while creating rooms
    if(!this.newRoomForm.valid){
      return this.snackService.warn('Can not create Group. Please check your input ')();
    }
    console.log('dev log calling service on create room method')
      return this.coreService.createRoom({
        isGroup: true,
        roomName: this.newRoomForm.value.newGroupName,
        roomPhoto: this.newRoomForm.value.newGroupImage,
        file: this.newRoomForm.value.imageToUpload,
        members: [...this.newGroupMembers]
      }).pipe().subscribe(
          (room)=>{
            this.newRoomForm.reset();
            this.onDiscardImage();
            this.router.navigate(['..','home'],{relativeTo: this.activatedRoute})
          }
      )

  }

  switchCreateContact(){
    this.createContact = !this.createContact;
    if(!this.createContact)this.newContactForm.reset();
  }

  onSaveNewContact(){
    if(!this.newContactForm.valid){
      this.snackService.warn('Can not create Contact. Please check your input ')();
      return;
    }
    return this.coreService.createContact({
      username: this.newContactForm.value.newContactName,
      email: this.newContactForm.value.newContactEmail
    }).pipe(take(1),
        tap((_)=>{this.snackService.green('contact created')();this.newContactForm.reset()}),
    ).subscribe(
        (ctx)=>{
          // console.log('contact created') // dev log
          this.switchCreateContact();
        },()=>{this.newContactForm.controls.newContactEmail.setErrors({notFoundEmail:true})}
    )
  }

  ngOnDestroy(){
    if (this.createSub){ // not used anymore
      this.createSub.unsubscribe()
    }
  }

  onPickedGroupImage(eve: Event) {
    const file:File = ((eve.target as HTMLInputElement).files as FileList)[0];
    this.newRoomForm.patchValue({imageToUpload: file})
    this.newRoomForm.patchValue({newGroupImage: file.name})
    this.newRoomForm.updateValueAndValidity();
    const reader = new FileReader()
    reader.onload = (e)=>{
      this.newGroupImagePreview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  onFlagReceived($event: GroupFactoryModel) {
    if ($event.checked){ // add checked value to array
      this.newGroupMembers.push($event.id)
    }else{ // remove unchecked value from array.
      this.newGroupMembers = this.newGroupMembers.filter((v)=> v !== $event.id);
    }
    this.newRoomForm.updateValueAndValidity()
  }

  onDiscardImage() {
    this.newGroupImagePreview = this.coreService.buildAsset('user-default.png');
    this.newRoomForm.controls.newGroupImage.reset();
    this.newRoomForm.controls.imageToUpload.reset();
  }
}

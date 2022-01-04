import {Injectable} from '@angular/core';
import {io, Socket} from "socket.io-client";
import {
    ExtendedRoomModel,
    MessageDispatcherModel,
    MessageDispatcherPrototype,
    MessageModel, MessagePrototype, MessageStateSnapshot, RoomFactoryDataModel,
    RoomModel, ServerLoadedMessagesModel
} from "../models/message.model";
import {BehaviorSubject, concat, Observable, of, Subject, Subscribable, Subscription, throwError} from "rxjs";
import {ContactModel, UserForAuth, UserModel, UserPrototype} from "../models/user.model";
import {catchError, map, pluck, switchMap, take, tap} from "rxjs/operators";
import {HttpService} from "./http.service";
import {CustomErrorHandlerService} from "./custom-error-handler.service";
import {SnackService} from "./snack.service";
import {ApiResponseModel} from "../models/api";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CoreService {

    private SERVER_URL = environment.DEVSERVER_URL;
    private socket = io(this.SERVER_URL);
    private loadedMessagesContainer = new MessageDispatcherPrototype();

    //emits every time a message is received or sent
    messageSubject: Subject<MessageModel|MessagePrototype> = new Subject<MessageModel|MessagePrototype>();
    userBehaviorSubject: BehaviorSubject<UserModel | UserPrototype | UserForAuth | null> = new BehaviorSubject<UserModel | UserPrototype | UserForAuth | null>(null);
    activeRoomBehaviorSubject: BehaviorSubject<RoomModel| ExtendedRoomModel| null> = new BehaviorSubject<RoomModel| ExtendedRoomModel| null>(null);
    messageListStateSnapshotSubject: Subject<MessageStateSnapshot> = new Subject<MessageStateSnapshot>();
    loadedRoomsBehaviorSubject: BehaviorSubject<RoomModel[]|ExtendedRoomModel[]> = new BehaviorSubject([] as RoomModel[]);
    ContactsBehaviorSubject: BehaviorSubject<ContactModel[]|null> = new BehaviorSubject<ContactModel[]|null>(null);

    constructor(
        private snack: SnackService,
       private appHttp: HttpService,
       private errHandler: CustomErrorHandlerService
    ) {
    }

    //socket.io methods
    informLogin(){
       console.log('informing log in');
       this.socket.emit('logged','nodata');
    }
    emitScanEvent() {
        // tells the server to scan
        // all rooms that a client belongs to and joins them
        this.userBehaviorSubject.pipe(take(1)).subscribe(
            (user) => {
                if (!user) {
                    return console.log('can not scan from empty user...')
                }
                this.socket.emit('scan', <string>user?._id)
            }
        )
    }
    emitMessageEvent(msgData: MessagePrototype) {
        this.userBehaviorSubject.pipe(take(1)).subscribe(
            (user) => {
                if (!user) {
                    return console.log('can not emit if user is empty')
                }
                this.socket.emit('new-message', msgData, msgData.register)
            }
        )
    }
    emitJoinRoomEvent(roomId: string) {
        this.userBehaviorSubject.pipe(take(1)).subscribe(
            (user) => {
                if (!user) {
                    console.log('can not emit if user is empty');
                    return;
                }
                console.log('emitting join new room to server with room: ', roomId)
                this.socket.emit('join-new-room', roomId);
            }
        )
    }
    emitNewRoomCreatedEvent(roomId: string){
        this.userBehaviorSubject.pipe(take(1)).subscribe(
            (user) => {
                if (!user) {
                    console.log('can not emit if user is empty');
                    return;
                }
                console.log('emitting new room created with room: ', roomId)
                this.socket.emit('new-room', roomId);
            }
        )
    }

    //socket.io listeners
    setListeners(user: UserPrototype) {
        console.log('setting listeners with user'+user);
        this.socket.on('connect_error',(error)=>{
            this.snack.warn(`${error.name}: ${error.message} `)()
        })
        this.socket.on('server-msg', (message) => {
            console.log('detected server-msg event...')
            return this.userBehaviorSubject.pipe(
                take(1),
                switchMap((user)=>{
                    return of(!!user)}),
                switchMap((execute)=>{
                    if(!execute)return of(false);
                    return this.activeRoomBehaviorSubject.pipe(
                        tap((room )=>{
                            if (String((room as ExtendedRoomModel)._id) !== String(message.room)){
                                console.log('room are not equal, storing message');
                                this.loadedMessagesContainer.store(
                                    new MessagePrototype(
                                        message.text,message.room,message.owner,
                                        message.state,message._id,message.sent
                                    )
                                );
                                this.messageListStateSnapshotSubject.next(
                                    this.loadedMessagesContainer.snapshot({active: room?._id})
                                )
                            }
                        }),
                        switchMap((room)=>{
                            const result = String((room as ExtendedRoomModel)._id)===String(message.room);
                            return of(result)})
                    )
                })

            ).subscribe(
                (audible)=>{
                    console.log('emitting after detected true  audible ')
                    if(audible) this.messageSubject.next(message)
                }
            )
        });
        this.socket.on('reload-rooms', (members:string[]) => {
            console.log('detected reload rooms event...')
            this.userBehaviorSubject.pipe(
                take(1),
                switchMap((user)=>{
                    return of(!!user && members.includes(<string>user?._id))
                })
            ).subscribe((execute)=>{
                if(!execute)return;
                return this.loadRoomsFromUser();
            })

        });
        this.socket.on('welcome', (nodata) => {
            console.log('detected welcome event...')
            return this.userBehaviorSubject.pipe(
                take(1),
                tap((_)=>{this.loadRoomsFromUser()}),
            ).subscribe(
                (loggedUser)=>{
                    this.pickRoom(0).subscribe(console.log)
                }
            )
        });
        this.socket.on('joined-to', (room: RoomModel[]) => {
            console.log('detected joined to event...')
            this.activeRoomBehaviorSubject.next(room[0]);
            this.messageListStateSnapshotSubject.next(
                this.loadedMessagesContainer.snapshot())
        });
    }


    //subject emission data handling methods
    catchReceivedMessage(): Observable<MessageModel>{ // use for update ui
        return this.messageSubject.pipe(
            tap((_)=>{
                console.log('dev log: handling message from core method')
            })
        )
    }
    catchReloadedRooms():Observable<RoomModel[]>{
        return this.loadedRoomsBehaviorSubject.pipe(
            tap((_)=>{
                const snapshot = this.loadedMessagesContainer.snapshot()
                this.messageListStateSnapshotSubject.next(snapshot);
            })
        )
    }
    catchActiveRoom(): Observable<RoomModel>{
        // this method can not be used with take one
        // since can be null, use to detect active room changes
        return this.activeRoomBehaviorSubject.pipe(
            tap(console.log) // console.log dev log
        )
    }

    // request wrappers
    loadRoomsFromUser(): Subscription{ // todo check
        return this.loadAllUserMessagesSortedByRoom().pipe(
            tap(console.log),
            switchMap((_)=>{
                return this.appHttp.loadRoomsFromUserRequest()
            }),
            catchError(this.errHandler.errorHandler)
        ).subscribe((rooms)=>{
            const data = rooms.data.data;
            this.loadedRoomsBehaviorSubject.next(<RoomModel[]>data)
        })
    }
    loadAllUserMessagesSortedByRoom(): Observable<ServerLoadedMessagesModel[]>{
        return this.appHttp.loadAllUserMessagesSortedByRoomRequest().pipe(
            tap((response)=>{
                const data = response.data.data;
                if(!data)return;
                this.loadedMessagesContainer.load(data);
                this.messageListStateSnapshotSubject.next(
                    this.loadedMessagesContainer.snapshot()
                )
            }),
            map((response)=>response.data.data)
        )
    }
    createRoom(payload: RoomFactoryDataModel):Observable<string>{
        // emit reload rooms to all members
        // flag room created as active (with subject active room,
        return this.appHttp.createRoomRequest(payload).pipe(
            map((response)=>{
                return <RoomModel>response.data.data
            }),
            tap((room)=>{
                this.activeRoomBehaviorSubject.next(room);
                this.snack.green(`Chat ${room.roomName} has been created`)();
            }),
            pluck('_id'),
            tap((room)=>{
                this.emitNewRoomCreatedEvent(room);
                this.emitJoinRoomEvent(room);
                this.loadRoomsFromUser()
            })
        )
    }// todo create this function
    _deprecated_createRoom(payload: RoomFactoryDataModel): Observable<string> {
        return this.appHttp.createRoomRequest(payload).pipe(
            // catchError(this.errHandler.errorHandler),
            map((response)=>{
                return <RoomModel>response.data.data
            }),
            tap((room)=>{
                this.activeRoomBehaviorSubject.next(room);
                this.snack.green(`Room ${room.roomName} has been created`)();
            }),
            pluck('_id'),
            tap((room)=>{
                this.emitJoinRoomEvent(room);
                this.loadRoomsFromUser()
            })
        ) // *todo elaborate request for creating room: verify backend : logic still missing
    }
    createContact(payload: { username: string, email: string }): Observable<ApiResponseModel<ContactModel[]>>{
        return this.appHttp.createContactRequest(payload).pipe(
            catchError(this.errHandler.errorHandler),
            switchMap(
                ()=> {
                    return this.loadContacts()
                }
            )
        )
    }
    loadContacts(): Observable<ApiResponseModel<ContactModel[]>>{
        return this.appHttp.getAllContactsRequest().pipe(
            tap((contacts)=>{
                    localStorage.setItem('USER_CONTACTS',JSON.stringify(contacts.data.data));
                contacts.data.data.forEach((c)=>{c.userId.photo = this.buildAsset(c.userId.photo)})
                this.ContactsBehaviorSubject.next(contacts.data.data);
                }
            )
        )
    }
    _not_implemented_uploadFile(file:File): Observable<boolean>{
        return this.appHttp.uploadFile(file).pipe()
    }



    //utils
    pickRoom(index:number=0): Observable<RoomModel>{
        return this.loadedRoomsBehaviorSubject.pipe(take(1),
            tap((d)=>{
                console.log('logging loaded Rooms Behavior Subject resuklt')
                console.log(d)
            }),
            map((roomsList)=>{return roomsList[index]}),
            tap((room)=>{
                const currentSnapshot: MessageStateSnapshot = this.loadedMessagesContainer.snapshot({active: room._id})
                this.messageListStateSnapshotSubject.next(currentSnapshot);
                this.activeRoomBehaviorSubject.next(room)}))
    }
    buildAsset(chunk: string| null | undefined): string{
        if (!chunk){
            return ''
        }
        if (chunk.startsWith(this.SERVER_URL)){
            return chunk;
        }
        return `${this.SERVER_URL}/${chunk}`
    }
    readLoadedContacts(): ContactModel[]|null{
        try{
            return JSON.parse(localStorage.getItem('USER_CONTACTS') as string);
        }catch (e){
            return null;
        }
    }
    testContactEmail(email:string, universe?: ContactModel[]): boolean{
        if(!email) return false;
        const contacts = (!!universe && universe.length > 0) ? universe: this.readLoadedContacts();

        console.log('dev log');
        console.log(contacts);

        if (!contacts) return false;
        for (let contact of contacts){
            if (contact.email === email.trim()){
                return true
            }
        }return false;
    }
    readRoomMessages(id:string): MessagePrototype[]{
        console.log('log on readRoomMessages id is: '+id)
        return this.loadedMessagesContainer.getFrom(id,false)
    }
    updateBadges(roomState: MessageStateSnapshot, rooms: ExtendedRoomModel[]):void{
        rooms.forEach((room)=>{
            if(room._id in roomState){
                room.pending = roomState[room._id];
            }
        })
    }
}


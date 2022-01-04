import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, of} from "rxjs";
import {ContactModel, UserDataAPIResponseModel, UserForAuth, UserModel, UserPrototype} from "../models/user.model";
import {HttpService} from "./http.service";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {io} from 'socket.io-client';
import {MessageModel, RoomFactoryDataModel, RoomModel} from "../models/message.model";
import {CustomErrorHandlerService} from "./custom-error-handler.service";
import {ApiResponseModel} from "../models/api";

class FakeSocket{
    constructor() {
    }
    on(...args:any[]){console.log('fake socket on')}
    emit(...args:any[]){console.log('fake socket emit')}
}


@Injectable()
export class DataService {

    // subscribe to this properties on ngOnInit to keep fields updated
    // use a subscription object to avoid memory leaks
    deprecateduserSubject = new BehaviorSubject<UserModel | UserPrototype | UserForAuth | null>(null);

    activeRoom: BehaviorSubject<RoomModel|null> = new BehaviorSubject<RoomModel|null>(null);
    ContactsBehaviorSubject: BehaviorSubject<ContactModel[] | null> = new BehaviorSubject<ContactModel[] | null>(null);


    //socket = io('https://<server>',{withCredentials:true}); // for private apis
    // socket = io('http://127.0.0.1:3000/users'); // users is a namespace
    socket = new FakeSocket();

    constructor( // warning can not depend on messgeService
        private errHandler: CustomErrorHandlerService,
        private appHttp: HttpService) {
    }






    getLoadedContacts(retry:boolean = false): Observable<ContactModel[]>
        // | ContactModel[] | null
    {
        let _rawData: string = <string>localStorage.getItem('USER_CONTACTS')
        let _contacts = JSON.parse(_rawData);
        if (retry && !_contacts){
            return this.loadContacts().pipe(
                tap((ctx)=>{
                    localStorage.setItem(
                        'USER_CONTACTS',
                        JSON.stringify(ctx.data.data)
                    );
                }),
                map((d)=>{return d.data.data})
            )
        }
        return of(_contacts);
    }

    loadContacts(): Observable<ApiResponseModel<ContactModel[]>>{
        return this.appHttp.getAllContactsRequest().pipe(
            tap(
                (contacts)=>{
                    localStorage.setItem('USER_CONTACTS',JSON.stringify(contacts.data.data))
                }
            )
        )
    }

    loadMessagesFromRoom(room: string): Observable<MessageModel|MessageModel[]> {
        return this.appHttp.loadMessagesFromRoomRequest(room).pipe(
            map((response)=>{
                if(Array.isArray(response.data.data)){
                    response.data.data.forEach((m) => m.state++);
                }
                return response.data.data;
            })
        )
    }

    loadRoomsFromUser(): Observable<RoomModel|RoomModel[]>{
        return this.getLoadedContacts(true).pipe(
            tap(c=>console.log(c)),
            switchMap(
            (contacts)=>{
                const emails = contacts.map(cnt=>cnt.email);
                const mapped = contacts.map((cnt)=>{
                    return {username: cnt.username, photo: cnt.userId.photo, email: cnt.email}
                })

                return this.appHttp.loadRoomsFromUserRequest().pipe(
                    map((apiRes)=>{
                        let _rooms =  apiRes.data.data;

                        if(Array.isArray(_rooms)){
                            _rooms.forEach((room)=>{
                                if(emails.includes(room.roomName)){
                                    const selectedPair = mapped.find((r)=>{ return (r.email === room.roomName) });
                                    room.roomPhoto = <string>selectedPair?.photo;
                                    room.roomName = <string>selectedPair?.username;
                                }
                            })
                        }else{
                            if(emails.includes(_rooms.roomName)){
                                const selectedPair = mapped.find((r)=>{ return ("roomName" in _rooms ? r.email === _rooms.roomName : false) });
                                _rooms.roomPhoto = <string>selectedPair?.photo;
                                _rooms.roomName = <string>selectedPair?.username;
                            }
                        }

                        return _rooms;
                    })
                )
            }
            )
        )
    }


    createRoom(payload: RoomFactoryDataModel): Observable<RoomModel[]|RoomModel> {
        return this.appHttp.createRoomRequest(payload).pipe(
            catchError(this.errHandler.errorHandler),
            // map(()=>{}),
            switchMap(
                (room)=>{
                    this.activeRoom.next(<RoomModel>room.data.data);
                    this.socket.emit(
                        'join-new-room',
                        room.data.data._id
                    )
                    return this.loadRoomsFromUser()
                }
            )
        ) // *todo elaborate request for creating room: verify backend : logic still missing
    }

    createContact(payload: { username: string, email: string }):
        Observable<ApiResponseModel<ContactModel[]>>{
        return this.appHttp.createContactRequest(payload).pipe(
            catchError(this.errHandler.errorHandler),
            switchMap(
                ()=> {
                    return this.loadContacts()
                }
            )
        )
    }
}

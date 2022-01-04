import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {ContactModel} from "../models/user.model";
import {Observable} from "rxjs";
import {DataService} from "../services/data.service";
import {map, take} from "rxjs/operators";
import {CoreService} from "../services/core.service";

@Injectable({
  providedIn: 'root'
})
export class ContactResolverService implements Resolve<ContactModel[] > {

  constructor(
      private coreService: CoreService,
      private dataService: DataService
  ) { }

  resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ):
      Observable<ContactModel[]> |
      Promise<ContactModel[]> |
      ContactModel[]  {
    return this.coreService.loadContacts().pipe(take(1),
        map((apiResponse)=>apiResponse.data.data))
  }
}

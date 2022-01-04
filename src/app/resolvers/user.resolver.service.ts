import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {UserPrototype} from "../models/user.model";
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<UserPrototype | null>{

  constructor(
      private authService: AuthService
  ) { }

  resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ):
      Observable<UserPrototype| null> |
      Promise<UserPrototype| null> |
      UserPrototype | null
  {
    console.log('dev log calling resolver: user')
    return this.authService.getLoadedUser()
  }
}

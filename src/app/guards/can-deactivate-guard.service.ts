import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from "@angular/router";
import {CanDeactivateInterface} from "../models/can.deactivate.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuardService implements CanDeactivate<CanDeactivateInterface>{

  constructor() { }

  canDeactivate(
      component: CanDeactivateInterface,
      currentRoute: ActivatedRouteSnapshot,
      currentState: RouterStateSnapshot,
      nextState?: RouterStateSnapshot

  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }
}

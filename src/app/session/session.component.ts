import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Router} from "@angular/router";
import {CanDeactivateInterface} from "../models/can.deactivate.model";
import {Observable} from "rxjs";
import {UserPrototype} from "../models/user.model";
import {tap} from "rxjs/operators";
import {DataService} from "../services/data.service";
import {CoreService} from "../services/core.service";

@Component({
  selector: 'app-session',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit, OnDestroy, CanDeactivateInterface{
  currentUser: UserPrototype | undefined = undefined;

  constructor(
      private coreService: CoreService,
      private activatedRoute: ActivatedRoute,
      private dataService: DataService,
      private router: Router) { }

  ngOnDestroy(): void {
    console.log('dev log: destroying listeners')
    }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(tap((data)=>{})).subscribe((data: Data) => {
      this.currentUser = data.loggedUser;
      this.coreService.setListeners(<UserPrototype>this.currentUser);
      this.coreService.informLogin()
      this.router.navigate(['session',data.loggedUser._id,'home'])
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    const user = JSON.parse(localStorage.getItem('USER_DATA')|| 'null');
    return !user;
  }
}

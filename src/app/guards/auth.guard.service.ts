import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";
import {Observable} from "rxjs";
import {map, take} from "rxjs/operators";
import {CoreService} from "../services/core.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

    constructor(
        private coreService: CoreService,
        private router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        console.log('calling can activate')
        return this.coreService.userBehaviorSubject.pipe(
            take(1),
            map((user) => {
                const isLogged = !!user;
                if (isLogged) {
                    console.log('can activate is true')
                    return true;
                }
                else return this.router.createUrlTree(['portal']);
            }))
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(childRoute, state);
    }
}

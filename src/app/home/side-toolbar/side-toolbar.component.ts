import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoreService} from "../../services/core.service";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {AssetsService} from "../../services/assets.service";
import {UserPrototype} from "../../models/user.model"
import {SnackService} from "../../services/snack.service";
import {tap} from "rxjs/operators";

interface cButton {
    icon: string,
    tooltip: string,
    action: Function
}

@Component({
    selector: 'app-side-toolbar',
    templateUrl: './side-toolbar.component.html',
    styleUrls: ['./side-toolbar.component.css']
})
export class SideToolbarComponent implements OnInit, OnDestroy {
    user: UserPrototype  = new UserPrototype('','',new Date(),'','','',[]);// load from a service
    hideOptions = true;
    AllCardsSelected = false;

    mainButtons: cButton[] = [
        {icon: 'manage_accounts', tooltip: 'show account options', action: this.viewProfile.bind(this)},
        {
            icon: 'more_vert',
            tooltip: 'display a menu with options for managing chats',
            action: this.viewOptions.bind(this)
        },
        {icon: 'logout', tooltip: 'Exit the App', action: this.logout.bind(this)}
    ]
    moreButtons: cButton[] = [
        {icon: 'done_outlined', tooltip: 'Select Chats for Deletion', action: this.activateSelectFlag.bind(this)},
        {icon: 'add_circle_outlined', tooltip: 'create new Chat', action: this.createRoom.bind(this)},
        {icon: 'delete_outlined', tooltip: 'Delete all Selected Chats', action: this.deleteFlagged.bind(this)},
        {icon: 'search', tooltip: 'not implemented yet', action: this.createRoom.bind(this)},
        {icon: 'contacts', tooltip: 'view and edit all contacts', action: this.displayContacts.bind(this)}
    ]


    constructor(
        private coreService: CoreService,
        private asset: AssetsService,
        private authService: AuthService,
        private snack: SnackService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
    }

    viewOptions(): void {
        this.hideOptions = !this.hideOptions
    }

    activateSelectFlag(): void {
        this.AllCardsSelected = !this.AllCardsSelected;
        this.moreButtons[0].icon = this.AllCardsSelected ? 'done_outlined' : 'select_all'
    }


    deleteFlagged(): void {
    }

    viewProfile(): void {
        this.router.navigate(['../profile'], {relativeTo: this.route})
    }

    createRoom(): void {
        this.router.navigate(['../contacts'], {
            relativeTo: this.route, state: {
                createRoom: true,
            }
        })
    }

    displayContacts() {
        this.router.navigate(['../contacts'], {relativeTo: this.route})
    }

    logout() {
        // todo show alert if want to leave.
        this.snack.execute(
            'Sure to close your session?',
            'Confirm', {duration: 2000},
            () => this.authService.logOutRoutine())
    }

    ngOnInit(): void {
        this.route.data
            .pipe(tap(()=>console.log('\n\n\nºtapping data side\n\n\n\nº')),tap(console.log))
            .subscribe(
            (data: Data) => {
                this.user = <UserPrototype>data.loggedUser;
                if (!!this.user) this.user.photo = this.asset.buildAsset(this.user.photo);
            }
        )
    }

    ngOnDestroy() {
    }


}

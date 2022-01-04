import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {UserPrototype} from "../../models/user.model";
import {AssetsService} from "../../services/assets.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    /*todo  form fields must take initial values from user values*/

    user: UserPrototype | undefined = undefined;

    profileForm: FormGroup = new FormGroup({
        username: new FormControl(null, [Validators.required, Validators.pattern(/^\w{5,40}$/)]),
        photo: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.pattern(/^\S{12,}$/)]),
        passwordRepeat: new FormControl(null, [Validators.required, Validators.pattern(/^\S{12,}$/)]),
        currentPasswordForChangeEmail: new FormControl(null, [Validators.required, Validators.pattern(/^\S{12,}$/)]),
        currentPasswordForChangePassword: new FormControl(null, [Validators.required, Validators.pattern(/^\S{12,}$/)])

    });
    usernameOnEdition = false;
    imageOnEdition = false;
    photoPreview = "";
    emailOnEdition = false;
    passwordOnEdition = false;


    onPickedImage(e: Event): void {
        const file: File = ((e.target as HTMLInputElement).files as FileList)[0];
        this.profileForm.patchValue({photo: file});
        this.profileForm.get('photo')?.updateValueAndValidity({});
        const reader = new FileReader()
        reader.onload = (ev) => {
            this.photoPreview = reader.result as string;
        }
        reader.readAsDataURL(file)
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private snack: MatSnackBar,
        private asset: AssetsService,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(
            (data: Data) => {
                this.user = data.loggedUser
                //load this data from service
                this.photoPreview = this.asset.buildAsset((this.user as UserPrototype).photo)
                this.profileForm.setValue({
                    username: (this.user as UserPrototype).username,
                    email: (this.user as UserPrototype).email,
                    photo: this.asset.buildAsset((this.user as UserPrototype).photo),
                    password: null,
                    passwordRepeat: null,
                    currentPasswordForChangeEmail: null,
                    currentPasswordForChangePassword: null,
                })

            });
    }

    onLeaveProfile() {
        this.snack.open(
            'Sure to Leave?\nAll unsaved changes will be lost.', 'Confirm',
            {duration: 4000, verticalPosition: "bottom"})
            .onAction().subscribe(
            () => {
                this.profileForm.reset()
                this.router.navigate(['../home'], {relativeTo: this.route})
            }
        )
    }

    onSubmitProfile(): void {
    }


}

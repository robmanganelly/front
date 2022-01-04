import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {SnackService} from "../../services/snack.service";
import {tap} from "rxjs/operators";
import {CoreService} from "../../services/core.service";

@Component({
    selector: 'app-auth-form',
    templateUrl: './auth-form.component.html',
    styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit, OnDestroy {
    isLogin = true;
    isRequesting = false;
    hidePass = true;  // for implementing visibility icon on password
    retrySubmit = false;
    bannerMessage = "";
    subscription: Subscription = new Subscription();

    authForm = new FormGroup({
        username: new FormControl(null),
        email: new FormControl(null, [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl(null, [
            Validators.required,
            Validators.pattern(/^\S{12,}$/)]
        ),
        passwordRepeat: new FormControl(null)
    }, {validators: this.comparePasswordsValidator().bind(this)})

    constructor(
        private coreService: CoreService,
        private snack: SnackService,
        private router: Router,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.authService.autologin()
    }

    onSubmit(): void {
        this.isRequesting = true;

        if (this.isLogin) {
            this.onLogin()
        } else {
            this.onSignUp()
        }
        this.authForm.reset()
    }

    onLogin() {
        if (!this.authForm.valid) {
            return this.snack.warn('invalid form, can not submit')();
        }
        this.isRequesting = true;
        this.subscription = this.authService.loginRoutine({
            email: this.authForm.value.email,
            password: this.authForm.value.password
        }).pipe(
            tap((user) => {
                this.snack.green(`Hi ${user.username}, welcome!`)()
            }),
            tap(console.log) // console.log dev log
        ).subscribe(
            (loggedUser) => {
                console.log('subscribing')
                // place here a non invasive alert showing success on login
                return this.router.navigate(['session', loggedUser._id, 'home'])
            },
            this.updateUIonError(),
            () => { console.log('\n\n dev log: complete auth subscription\n\n')}
        )
    }

    onSignUp() {
        this.isLogin = false;
        if (!this.authForm.valid) {
            return alert('invalid form todo: switch to dialog');
        }
        this.isRequesting = true;
        this.subscription = this.authService.signupRoutine({
            username: this.authForm.value.username,
            email: this.authForm.value.email,
            password: this.authForm.value.password
        }).pipe(
            tap((user) => {
                this.snack.green(`Hi ${user.username}, welcome!`)()
            })
        ).subscribe(
            (loggedUser) => {
                return this.router.navigate(['session', loggedUser._id, 'home'])
            },
            this.updateUIonError(),
            () => { console.log('\n\n dev log: complete auth subscription\n\n')}
        )

    }

    // ui methods
    changeTab(): void {
        this.isLogin = !this.isLogin
        this.retrySubmit = false;
        if (this.isLogin) {
            this.authForm.controls.username.clearValidators();
            this.authForm.controls.passwordRepeat.clearValidators();
        } else {
            this.authForm.controls.username.setValidators([
                Validators.required,
                Validators.pattern(/\w{5,50}/)
            ])
            this.authForm.controls.passwordRepeat.setValidators([
                Validators.required,
                Validators.pattern(/^\S{12,}$/)
            ])
        }
        this.authForm.reset();
    }

    updateUIonError() {
        return (e: string) => {
            this.bannerMessage = e
            this.isRequesting = false;
            this.retrySubmit = true;
        }
    }

    //custom form validators
    comparePasswordsValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.isLogin) {
                return null
            } else if (control.get('password')?.value !== control.get('passwordRepeat')?.value) {
                return {'passwordDoesNotMatchError': true}
            }
            return null
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}

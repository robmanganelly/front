import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {SnackService} from "../../services/snack.service";

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {

  waitingToSendEmail =  true;

  passRecoverForm = new FormGroup({
    email: new FormControl(null,[Validators.required,Validators.email]),
  })


  constructor(
      private snack: SnackService
  ) {}

  onSubmit(): void {
    // logic here
    this.passRecoverForm.reset()
    this.waitingToSendEmail =  false;
    this.snack.green(`values are ${this.passRecoverForm.statusChanges}`); // this is the placeholder for the submit action

  }

  ngOnInit(): void {
  }

}

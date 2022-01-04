import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {SnackService} from "./snack.service";

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandlerService {

  constructor(
      private snack: SnackService
  ) {}

  handleUIError(e: Error ){
    let message: string = e.message
    return this.snack.warn(message as string)();

  }

  errorHandler = (errorRes: HttpErrorResponse) => {
    console.log(errorRes)
    let message = errorRes.error.error.message || errorRes.error.message ||errorRes.message;
    switch (errorRes.status) {
      case 404:
        message = 'the requested resource was not found on this server!!';
        break;
      case 400:
        break;
      case 401:
        message = 'Invalid credentials, please check your input or login again';
        break;
      case 403:
        message = 'Invalid credentials, please check your input or create an account';
        break;
      case 429:
        message = 'Too many request, please try to log in in a few minutes';
        break;
      default:
        message = 'unknown error, try in a few minutes'
        break;
    }
    this.snack.warn(`${message}`)();
    return throwError(message)
  }
}

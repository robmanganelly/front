import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetime'
})
export class DatetimePipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): string {
    // yyyy-mm-ddThh:mm:ss.iiiZ
    return value
        .toLocaleString()
        .replace('T','  ')
        .split(':').slice(0,2).join(':')
  }

}

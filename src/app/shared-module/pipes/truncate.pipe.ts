import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, ...args: number[]): string {
    let limit = args [0] || 10;
    let start = args[1] || 0;
    if (value.length > limit){
      return `${value.substring(start, limit)}...`;
    }
    return value;
  }

}

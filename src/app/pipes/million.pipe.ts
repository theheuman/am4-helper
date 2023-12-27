import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'million',
  standalone: true,
})
export class MillionPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    return (value/1000000).toFixed(1) + ' M';
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addUser'
})
export class AddUserPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

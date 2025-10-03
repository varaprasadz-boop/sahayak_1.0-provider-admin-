import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  public transform(price: any): string {
    const number = +price;
    // India uses thousands/lakh/crore separators
    return number.toLocaleString('en-IN');
  }

}

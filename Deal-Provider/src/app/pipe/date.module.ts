import { NgModule } from '@angular/core';
import { DateFormatPipe } from './date';
import { CurrencyFormatPipe } from './currency-format.pipe'; 

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [ 
    DateFormatPipe, CurrencyFormatPipe,
   
  ],
  exports: [
    DateFormatPipe,
 
  ],
  
})
export class DatePipesModule {}
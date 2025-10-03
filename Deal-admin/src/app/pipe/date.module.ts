import { NgModule } from '@angular/core';
import { DateFormatPipe } from './date';
import { TimeAgoPipe } from './time-ago.pipe'; 

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [ 
    DateFormatPipe,
   
  ],
  exports: [
    DateFormatPipe,
 
  ],
  
})
export class DatePipesModule {}
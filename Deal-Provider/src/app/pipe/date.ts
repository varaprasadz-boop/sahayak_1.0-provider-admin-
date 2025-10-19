import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'DateFormat',
})
export class DateFormatPipe implements PipeTransform {
  transform(date: Date | string | number): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  }
}

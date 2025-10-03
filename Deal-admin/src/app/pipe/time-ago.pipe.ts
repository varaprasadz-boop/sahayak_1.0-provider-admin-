import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(input: number | string): string {
    let date: Date;

    // Check if input is a number (Unix timestamp in seconds)
    if (typeof input === 'number') {
      date = new Date(input * 1000); // Convert seconds to milliseconds
    } else if (typeof input === 'string') {
      // If it's a date string, check if it is in dd-mm-yyyy format
      const parts = input.split('-');
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        date = new Date(year, month - 1, day); // JavaScript months are 0-based
      } else {
        return 'Invalid date format';
      }
    } else {
      return 'Invalid input';
    }

    // Check for valid date
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    // Calculate how many days ago
    const daysAgo = this.getDaysDifference(date, new Date());

    return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  }

  private getDaysDifference(fromDate: Date, toDate: Date): number {
    const timeDiff = toDate.getTime() - fromDate.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }
}

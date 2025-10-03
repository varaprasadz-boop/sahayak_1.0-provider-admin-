import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, EventEmitter, Output } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
})
export class EventCalendarComponent implements OnInit, AfterViewInit, ViewDidEnter {
  @ViewChildren('dateElement') dateElements: QueryList<ElementRef>;
  @Output() getBookings = new EventEmitter<Date | null>();
  currentMonth: Date;
  dates: Date[] = [];
  selectedDate: Date | null = null;

  constructor() {
    this.currentMonth = new Date();
    this.selectedDate = new Date();
    this.generateCalendarDates();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.scrollToCurrentDate();
  }
  public ionViewDidEnter() {
    this.scrollToCurrentDate();
  }
  generateCalendarDates() {
    this.dates = [];
    const start = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    for (let i = start.getDate(); i <= end.getDate(); i++) {
      this.dates.push(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i));
    }
  }

  getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  previousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.currentMonth = new Date(this.currentMonth); // update the date object
    this.generateCalendarDates();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.currentMonth = new Date(this.currentMonth); // update the date object
    this.generateCalendarDates();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    console.log(this.selectedDate);
    this.getBookings.emit(this.selectedDate);
  }

  isSelectedDate(date: Date): boolean {
    return (
      this.selectedDate &&
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  scrollToCurrentDate() {
    setTimeout(() => {
      this.getBookings.emit(new Date());
      const currentDate = new Date();
      const currentDateDiv = this.dateElements.find(element =>
        element.nativeElement.getAttribute('data-date') === currentDate.getDate().toString()
      );
      if (currentDateDiv) {
        currentDateDiv.nativeElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
  
      // Update selectedDate and currentMonth to today's date
      this.selectedDate = currentDate;
      this.currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      this.generateCalendarDates();
    }, 0);
  }
  
}

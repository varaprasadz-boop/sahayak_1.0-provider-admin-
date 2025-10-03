import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { TranslateModule } from '@ngx-translate/core'; 
import { FullCalendarModule } from '@fullcalendar/angular';
import { EventCalendarComponent } from '../components/event-calendar/event-calendar.component';
import { EventTimelineComponent } from '../components/event-timeline/event-timeline.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    HomePageRoutingModule,
    FullCalendarModule
  ],
  declarations: [HomePage,EventCalendarComponent , EventTimelineComponent]
})
export class HomePageModule {}

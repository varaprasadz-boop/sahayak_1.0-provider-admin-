import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingViewPage } from './booking-view.page';

const routes: Routes = [
  {
    path: '',
    component: BookingViewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingViewPageRoutingModule {}

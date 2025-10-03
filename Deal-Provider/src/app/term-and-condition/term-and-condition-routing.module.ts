import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermAndConditionPage } from './term-and-condition.page';

const routes: Routes = [
  {
    path: '',
    component: TermAndConditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermAndConditionPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSubadminsPage } from './add-subadmins.page';

const routes: Routes = [
  {
    path: '',
    component: AddSubadminsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSubadminsPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditVehicleListPage } from './edit-vehicle-list.page';

const routes: Routes = [
  {
    path: '',
    component: EditVehicleListPage
  },
  {
    path: 'auto-complete',
    loadChildren: () => import('./components/auto-complete/auto-complete.module').then( m => m.AutoCompletePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditVehicleListPageRoutingModule {}

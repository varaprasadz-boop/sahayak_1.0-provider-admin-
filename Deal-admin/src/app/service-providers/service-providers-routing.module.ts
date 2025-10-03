import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceProvidersPage } from './service-providers.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceProvidersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceProvidersPageRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsersPage } from './users.page';

import { SharedModule } from '../shared/shared/shared.module';
@NgModule({
  imports: [
    SharedModule,
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule
  ],
  declarations: [UsersPage]
})
export class UsersPageModule {}

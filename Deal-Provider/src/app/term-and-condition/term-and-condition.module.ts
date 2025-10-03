import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermAndConditionPageRoutingModule } from './term-and-condition-routing.module';

import { TermAndConditionPage } from './term-and-condition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermAndConditionPageRoutingModule
  ],
  declarations: [TermAndConditionPage]
})
export class TermAndConditionPageModule {}

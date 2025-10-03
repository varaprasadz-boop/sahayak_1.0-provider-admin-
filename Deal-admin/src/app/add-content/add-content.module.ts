import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddContentPageRoutingModule } from './add-content-routing.module';

import { AddContentPage } from './add-content.page';

import { QuillModule } from 'ngx-quill';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddContentPageRoutingModule,
    QuillModule.forRoot({
      modules: {
        syntax: true
      }
    }),
  ],
  declarations: [AddContentPage]
})
export class AddContentPageModule {}

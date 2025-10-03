import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSubcategoriesPageRoutingModule } from './edit-subcategories-routing.module';

import { EditSubcategoriesPage } from './edit-subcategories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditSubcategoriesPageRoutingModule
  ],
  declarations: [EditSubcategoriesPage]
})
export class EditSubcategoriesPageModule {}

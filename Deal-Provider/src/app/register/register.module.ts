import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterPageRoutingModule } from './register-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterPage } from './register.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicSelectableComponent } from 'ionic-selectable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    IonicModule,
    IonicSelectableModule,
    RegisterPageRoutingModule
  ],
  declarations: [RegisterPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterPageModule {}

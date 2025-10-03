import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailPageRoutingModule } from './product-detail-routing.module';

import { ProductDetailPage } from './product-detail.page';
import { DatePipesModule } from "../pipe/date.module";

@NgModule({
    declarations: [ProductDetailPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProductDetailPageRoutingModule,
        DatePipesModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailPageModule {}

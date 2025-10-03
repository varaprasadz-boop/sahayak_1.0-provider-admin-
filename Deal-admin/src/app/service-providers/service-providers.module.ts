import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared/shared.module';
import { ServiceProvidersPageRoutingModule } from './service-providers-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ServiceProvidersPage } from './service-providers.page';
import { SubcatgoryComponent } from './subcategory/subcatgory/subcatgory.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViewDocComponent } from './view-doc/view-doc';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    SharedModule,
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    IonicModule,
    PdfViewerModule,
    MatPaginatorModule,
    MatTableModule,
    OverlayModule,
    ServiceProvidersPageRoutingModule
  ],
  declarations: [ServiceProvidersPage,SubcatgoryComponent, ViewDocComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ServiceProvidersPageModule {}

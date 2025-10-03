import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceBookingsPageRoutingModule } from './service-bookings-routing.module';
import { NearByCityModalComponent } from '../components/near-by-city-modal/near-by-city-modal.component';
import { ServiceBookingsPage } from './service-bookings.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from "../shared/shared/shared.module";
import { SearchPipe } from '../pipe/search.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { InvoiceComponentComponent } from '../components/invoice-component/invoice-component.component';
import { InoviceService } from './shared/service/invoice.service';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DropdownmodalComponent } from './component/dropdownmodal/dropdownmodal.component';
@NgModule({
    declarations: [ServiceBookingsPage, NearByCityModalComponent,InvoiceComponentComponent,DropdownmodalComponent],
    imports: [
        NgxPaginationModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatChipsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        ServiceBookingsPageRoutingModule,
        ScrollingModule,
        SharedModule,
        MatTableModule
    ],
    providers: [SearchPipe,DatePipe,InoviceService,TitleCasePipe],
})
export class ServiceBookingsPageModule {}

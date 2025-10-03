import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckPermissionService } from '../services/check-permission.service';
import { DataService } from '../services/data.service';
import { Category, Subcategory } from '../models/category';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { UserProviderFcmService } from '../services/fcm/user-provider-fcm.service';
import { ModalController } from '@ionic/angular';
import { SubcatgoryComponent } from './subcategory/subcatgory/subcatgory.component';
import { ViewDocComponent } from './view-doc/view-doc';

@Component({
  selector: 'app-service-providers',
  templateUrl: './service-providers.page.html',
  styleUrls: ['./service-providers.page.scss'],
})
export class ServiceProvidersPage implements OnInit {
  filteredItems: any[] = [];
  specificSubcategory: any;
  isModalOpen = false;
  items = [];
  searchValue: string = '';
  public img: boolean = true;
  public categories: Category[] = [];
  public cities: any = [];
  public citiesByArea: any = [];
  subCategories: Subcategory[] = [];
  subCategoryIds: any;
  public segment: string = 'all';
  public p: number = 1; // Current page for pagination
  db = getFirestore();

  constructor(
    public router: Router,
    public permsision: CheckPermissionService,
    public dataService: DataService,
    private fcm: UserProviderFcmService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute // Add ActivatedRoute to the constructor
  ) {}

  ngOnInit() {
    // Subscribe to query params to filter on page load
    this.route.queryParams.subscribe((params) => {
      if (params['segment']) {
        this.segment = params['segment'];
        this.filterData(this.segment);
      } else {
        // Default to 'all' if no segment is provided
        this.filterData('all');
      }
    });

    // Fetch data for service providers, categories, and cities
    this.dataService.getUsersProviders().subscribe((users) => {
      this.items = users;
      this.filterData(this.segment);
      console.log(this.items);

      // this.filteredItems = this.items; // Initialize filteredItems
    });

    this.dataService.getCategories().subscribe((data) => {
      if (data != null) {
        this.categories = data;
      }
    });

    this.dataService.getSubCategories().subscribe((data) => {
      if (data != null) {
        this.subCategories = data;
      }
    });

    this.dataService.getAllCitiesById().subscribe((data) => {
      if (data != null) {
        this.cities = data;
      }
    });

    this.dataService.getAllCitiesbyArea().subscribe((data) => {
      if (data != null) {
        this.citiesByArea = data;
      }
    });
  }
  public onsegmentChanged(event: any): void {
    // Update the URL with the new segment value
    this.filterData(event.detail.value);
  }
  public filterData(filterValue: any): void {
    // Update the URL with the new segment value
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { segment: filterValue },
      queryParamsHandling: 'merge', // Preserve existing query params
    });

    if (filterValue === 'all') {
      this.filteredItems = this.items; // Show all items
    } else {
      this.filteredItems = this.items.filter(
        (item) => item.status.toLowerCase() === filterValue.toLowerCase()
      );
    }
  }

  addServiceProvider() {
    this.router.navigate(['/add-service-provider']);
  }

  public async documentOne(item: string): Promise<void> {
    if(item) {
      const modal = await this.modalCtrl.create({
        component: ViewDocComponent,
        componentProps: {
          type: item.includes('.pdf') ? 'pdf' : 'png',
          url: item,
        },
      });
      modal.present();
    } 
    console.log(item.toString().includes('.pdf'));
    return;
    if (item !== '') {
      window.open(item, '_blank');
    }
    console.log(item);
  }

  public hasPermission(requiredPermissions: string[]): boolean {
    return this.permsision.hasPermission(requiredPermissions);
  }

  getCategory(category: string) {
    for (let item of this.categories) {
      if (item.id === category) {
        return item.name;
      }
    }
  }

  getSubCategory(subCategoryIds: any) {
    return subCategoryIds.map((id: any) => {
      const subCategory: any = this.subCategories.find(
        (item: any) => item.id === id
      );
      return subCategory ? subCategory.name : '';
    });
  }

  async setOpen(subCategoryIds: any) {
    this.specificSubcategory = this.getSubCategory(subCategoryIds);
    const modal = await this.modalCtrl.create({
      component: SubcatgoryComponent,
      componentProps: {
        specificSubcategory: this.specificSubcategory,
      },
    });
    modal.present();
  }

  getCities(citi: any) {
    for (let item of this.cities) {
      if (item.id === citi) {
        return item.name;
      }
    }
  }

  getCitiesById(citi: any) {
    for (let item of this.citiesByArea) {
      if (item.id === citi) {
        return item.name;
      }
    }
  }

  public async changeStatus($event: any, id: any, item: any): Promise<void> {
    const date: Date = new Date();
    const isoDate: string = date.toISOString();
    const formattedDate: string = format(parseISO(isoDate), 'yyyy-MM-dd');
    const catRef = doc(this.db, 'provider', id);
    await updateDoc(catRef, {
      status: $event.target.value,
      dateOfApproval: $event.target.value === 'approved' ? formattedDate : '',
    });
    this.sendMessageAndToken(
      $event.target.value.toUpperCase(),
      'Hi ' +
        item.name +
        ', ' +
        'your application is ' +
        $event.target.value.toUpperCase(),
      item.fcm_token
    );
  }

  public getStatus(status: string): string {
    switch (status) {
      case 'approved':
        return 'success';
      case 'received':
        return 'warning';
      case 'rejected':
        return 'danger';
      case 'hold':
        return 'warning';
      default:
        return 'danger';
    }
  }

  public convertTimeStamp(value: any): any {
    if (value) {
      return new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
    } else {
      return '';
    }
  }

  private sendMessageAndToken(
    title: string,
    body: string,
    token: string
  ): void {
    this.fcm.sendMessageAndGetToken(title, body, token).subscribe(
      (response) => {
        console.log('FCM message sent successfully:', response);
      },
      (error) => {
        console.error('Error sending FCM message:', error);
      }
    );
  }

  onClick(item: any) {
    this.router.navigate(['edit-service-provider'], {
      state: { item: item, segment : this.segment },
    });
  }
}

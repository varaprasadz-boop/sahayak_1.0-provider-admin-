import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { deleteDoc, getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Category, Subcategory } from '../models/category';
import { Item } from '../models/item';
import { DataService } from '../services/data.service';
import { ModalController } from '@ionic/angular';
import { ProductDetailPage } from '../product-detail/product-detail.page';
import { User } from '../models/user';
import { CurrencyPipe } from '@angular/common';
import { Service } from '../models/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CheckPermissionService } from '../services/check-permission.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  public items: Item[] = [];
  public services: Service[] = [];
  public dummy = Array(1);
  public db = getFirestore();
  public categories: Category[] = [];
  public subCategories: Subcategory[] = [];
  public subCategoriesByCategory: Subcategory[] = [];
  public filteredServices: Service[] = [];
  public users: User[] = [];
  public selectedCategory: string = 'all';
  public selectedSubCategory: string = 'all';
  public search: string = '';
  public p: number = 1;

  constructor(
    public alertCtrl: AlertController,
    public dataService: DataService,
    private modalCtrl: ModalController,
    private currency: CurrencyPipe,
    private modalController: ModalController,
    public router: Router,
    private route: ActivatedRoute,
    public permission: CheckPermissionService
  ) {
    // Subscribe to router events to handle back navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Get current URL parameters
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams.category || queryParams.subcategory) {
          this.selectedCategory = queryParams.category || 'all';
          this.selectedSubCategory = queryParams.subcategory || 'all';
          
          // Load subcategories if category is selected
          if (this.selectedCategory !== 'all') {
            this.loadSubCategories(this.selectedCategory);
          }
          
          // Apply filters based on URL parameters
          if (this.services.length > 0) {
            this.filterServices();
          }
        }
      });
  }

  ngOnInit() {
    this.loadData();
    
    // Handle initial URL parameters
    const queryParams = this.route.snapshot.queryParams;
    this.selectedCategory = queryParams.category || 'all';
    this.selectedSubCategory = queryParams.subcategory || 'all';
    
    if (this.selectedCategory !== 'all') {
      this.loadSubCategories(this.selectedCategory);
    }
  }

  private loadData(): void {
    // Fetch all services
    this.dataService.getServices().subscribe((data) => {
      if (data != null) {
        this.services = data;
        this.filterServices();  // Apply filters after loading services
        this.dummy = [];
      } else {
        this.dummy = [];
      }
    });

    // Fetch all categories
    this.dataService.getCategories().subscribe((data) => {
      if (data != null) {
        this.categories = data;
      }
    });

    // Fetch all subcategories
    this.dataService.getSubCategories().subscribe((data) => {
      if (data != null) {
        this.subCategories = data;
      }
    });
  }

  private loadSubCategories(categoryId: string): void {
    if (categoryId !== 'all') {
      this.dataService.getSubCategoriesByCategories(categoryId).subscribe((data) => {
        this.subCategoriesByCategory = data;
      });
    } else {
      this.subCategoriesByCategory = [];
      this.selectedSubCategory = 'all';  // Reset subcategory when category is 'all'
    }
  }

  public categoriesById(event: any): void {
    const categoryId = event.detail.value;
    this.selectedCategory = categoryId;

    // Reset subcategory only when changing to 'all'
    if (categoryId === 'all') {
      this.selectedSubCategory = 'all';
      this.subCategoriesByCategory = [];
    } else {
      this.loadSubCategories(categoryId);
    }
    
    this.filterServices();
    this.updateQueryParams();
  }

  public subCategoryById(event: any): void {
    this.selectedSubCategory = event.detail.value;
    this.filterServices();
    this.updateQueryParams();
  }

  public filterServices(): void {
    let filtered = this.services;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === this.selectedCategory);
    }

    if (this.selectedSubCategory !== 'all') {
      filtered = filtered.filter(service => service.subCategory === this.selectedSubCategory);
    }

    this.filteredServices = filtered;
  }

  public updateQueryParams(): void {
    const queryParams: any = {};
    
    // Only add parameters if they're not 'all'
    if (this.selectedCategory !== 'all') {
      queryParams.category = this.selectedCategory;
    }
    if (this.selectedSubCategory !== 'all') {
      queryParams.subcategory = this.selectedSubCategory;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true  // Use replaceUrl to avoid building up history stack
    });
  }

  public getCategory(categoryId: string): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : '';
  }

  public getSubCategory(subCategoryId: string): string {
    const subCategory = this.subCategories.find((sub) => sub.id === subCategoryId);
    return subCategory ? subCategory.name : '';
  }

  public hasPermission(permissions: string[]): boolean {
    return this.permission.hasPermission(permissions);
  }

  public async presentConfirm(id: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteItem(id);
          },
        },
      ],
    });

    await alert.present();
  }

  public async deleteItem(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'items', id));
    this.loadData();
  }

  public async changeStatus(event: any, id: string): Promise<void> {
    const status = event.detail.value;
    const docRef = doc(this.db, 'services', id);
    await updateDoc(docRef, { status });
    this.loadData();
  }

  public async addService(): Promise<void> {
    this.router.navigate(['/add-service']);
  }

  public async openProductDetail(service: Service): Promise<void> {
    const modal = await this.modalController.create({
      component: ProductDetailPage,
      componentProps: {
        item: service,
      },
    });
    await modal.present();

    // Handle modal dismiss
    const { data } = await modal.onDidDismiss();
    if (data && data.refresh) {
      this.loadData();
    }
  }

  public getStatusColor(status: string): string {
    return status === 'active' ? 'success' : 'warning';
  }

  public calculateSerialNumber(index: number): number {
    return index + 1 + (this.p - 1) * 10;
  }
}
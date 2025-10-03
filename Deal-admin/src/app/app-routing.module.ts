import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './services/auth-guard.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then( m => m.CategoriesPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'sub-categories',
    loadChildren: () => import('./sub-categories/sub-categories.module').then( m => m.SubCategoriesPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'items',
    loadChildren: () => import('./items/items.module').then( m => m.ItemsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'feature-items',
    loadChildren: () => import('./feature-items/feature-items.module').then( m => m.FeatureItemsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'add-categories',
    loadChildren: () => import('./add-categories/add-categories.module').then( m => m.AddCategoriesPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'edit-categories',
    loadChildren: () => import('./edit-categories/edit-categories.module').then( m => m.EditCategoriesPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'add-sub-category',
    loadChildren: () => import('./add-sub-category/add-sub-category.module').then( m => m.AddSubCategoryPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'edit-subcategories',
    loadChildren: () => import('./edit-subcategories/edit-subcategories.module').then( m => m.EditSubcategoriesPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'view-categories',
    loadChildren: () => import('./view-categories/view-categories.module').then( m => m.ViewCategoriesPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'product-detail',
    loadChildren: () => import('./product-detail/product-detail.module').then( m => m.ProductDetailPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'cities',
    loadChildren: () => import('./cities/cities.module').then( m => m.CitiesPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'add-cities',
    loadChildren: () => import('./add-cities/add-cities.module').then( m => m.AddCitiesPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'update-city-model',
    loadChildren: () => import('./update-city-model/update-city-model.module').then( m => m.UpdateCityModelPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'package',
    loadChildren: () => import('./package/package.module').then( m => m.PackagePageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'subscriber',
    loadChildren: () => import('./subscriber/subscriber.module').then( m => m.SubscriberPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'add-package',
    loadChildren: () => import('./add-package/add-package.module').then( m => m.AddPackagePageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'add-subscription',
    loadChildren: () => import('./add-subscription/add-subscription.module').then( m => m.AddSubscriptionPageModule)
  },
  {
    path: 'edit-service-list',
    loadChildren: () => import('./edit-vehicle-list/edit-vehicle-list.module').then( m => m.EditVehicleListPageModule)
  },
  {
    path: 'loan',
    loadChildren: () => import('./loan/loan.module').then( m => m.LoanPageModule)
  },
  {
    path: 'service-bookings',
    loadChildren: () => import('./service-bookings/service-bookings.module').then( m => m.ServiceBookingsPageModule)
  },
  {
    path: 'add-service',
    loadChildren: () => import('./add-service/add-service.module').then( m => m.AddServicePageModule)
  },
  {
    path: 'service-providers',
    loadChildren: () => import('./service-providers/service-providers.module').then( m => m.ServiceProvidersPageModule)
  },
  {
    path: 'add-service-provider',
    loadChildren: () => import('./add-service-provider/add-service-provider.module').then( m => m.AddServiceProviderPageModule)
  },
  {
    path: 'subadmins',
    loadChildren: () => import('./subadmins/subadmins.module').then( m => m.SubadminsPageModule)
  },
  {
    path: 'add-subadmins',
    loadChildren: () => import('./add-subadmins/add-subadmins.module').then( m => m.AddSubadminsPageModule)
  },
  {
    path: 'area',
    loadChildren: () => import('./area/area.module').then( m => m.AreaPageModule)
  },
  {
    path: 'add-area',
    loadChildren: () => import('./add-area/add-area.module').then( m => m.AddAreaPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calander/calander.module').then( m => m.CalanderPageModule)
  },
  {
    path: 'content-management',
    loadChildren: () => import('./content-management/content-management.module').then( m => m.ContentManagementPageModule)
  },
  {
    path: 'add-content',
    loadChildren: () => import('./add-content/add-content.module').then( m => m.AddContentPageModule)
  },
  {
    path: 'view-content',
    loadChildren: () => import('./view-content/view-content.module').then( m => m.ViewContentPageModule)
  },
  {
    path: 'complaint',
    loadChildren: () => import('./complaint/complaint.module').then( m => m.ComplaintPageModule)
  },
  {
    path: 'add-complaint',
    loadChildren: () => import('./add-complaint/add-complaint.module').then( m => m.AddComplaintPageModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./report/report.module').then( m => m.ReportPageModule)
  },
  {
    path: 'booking-details',
    loadChildren: () => import('./booking-details/booking-details.module').then( m => m.BookingDetailsPageModule)
  },
  {
    path: 'edit-service-provider',
    loadChildren: () => import('./edit-service-provider/edit-service-provider.module').then( m => m.EditServiceProviderPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

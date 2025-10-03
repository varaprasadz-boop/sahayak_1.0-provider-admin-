import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'favorite',
        loadChildren: () => import('../favorite/favorite.module').then(m => m.FavoritePageModule)
      },
      {
        path: 'book-now',
        loadChildren: () => import('../book-now/book-now.module').then(m => m.BookNowPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'sub-categories',
        loadChildren: () => import('../sub-categories/sub-categories.module').then( m => m.SubCategoriesPageModule)
      },
      {
        path: 'items',
        loadChildren: () => import('../items/items.module').then( m => m.ItemsPageModule)
      },
      {
        path: 'earnings',
        loadChildren: () => import('../earnings/earnings.module').then( m => m.EarningsPageModule)
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
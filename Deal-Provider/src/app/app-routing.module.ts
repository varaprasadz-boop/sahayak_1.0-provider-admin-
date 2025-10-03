import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './services/auth-guard.guard';
const routes: Routes = [
   {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
     canActivate: [AuthGuardGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
    // canActivate: [AuthGuardGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'chatting', 
    loadChildren: () => import('./chatting/chatting.module').then( m => m.ChattingPageModule),
    // canActivate: [AuthGuardGuard]
  },
  {
    path: 'my-adverts',
    loadChildren: () => import('./my-adverts/my-adverts.module').then( m => m.MyAdvertsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'post-ads',
    loadChildren: () => import('./post-ads/post-ads.module').then( m => m.PostAdsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'auto-complete',
    loadChildren: () => import('./auto-complete/auto-complete.module').then( m => m.AutoCompletePageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'item-details',
    loadChildren: () => import('./item-details/item-details.module').then( m => m.ItemDetailsPageModule),
    canActivate: [AuthGuardGuard]
  },

  {
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'review',
    loadChildren: () => import('./review/review.module').then( m => m.ReviewPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'report',
    loadChildren: () => import('./report/report.module').then( m => m.ReportPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then( m => m.OnboardingPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'language',
    loadChildren: () => import('./language/language.module').then( m => m.LanguagePageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then( m => m.FaqPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'edit-item',
    loadChildren: () => import('./edit-item/edit-item.module').then( m => m.EditItemPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'modal-image',
    loadChildren: () => import('./modal-image/modal-image.module').then( m => m.ModalImagePageModule)
  },
  {
    path: 'term-and-condition',
    loadChildren: () => import('./term-and-condition/term-and-condition.module').then( m => m.TermAndConditionPageModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule),
  },
  {
    path: 'subscription',
    loadChildren: () => import('./subscription/subscription.module').then( m => m.SubscriptionPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'apply-loan',
    loadChildren: () => import('./apply-loan/apply-loan.module').then( m => m.ApplyLoanPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'book-now',
    loadChildren: () => import('./book-now/book-now.module').then( m => m.BookNowPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule),
    // canActivate: [AuthGuardGuard]
  },
  {
    path: 'address',
    loadChildren: () => import('./address/address.module').then( m => m.AddressPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'choose-address',
    loadChildren: () => import('./choose-address/choose-address.module').then( m => m.ChooseAddressPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'add-address',
    loadChildren: () => import('./add-address/add-address.module').then( m => m.AddAddressPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'complaints',
    loadChildren: () => import('./complaints/complaints.module').then( m => m.ComplaintsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'complaint-detail',
    loadChildren: () => import('./complaint-detail/complaint-detail.module').then( m => m.ComplaintDetailPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'earnings',
    loadChildren: () => import('./earnings/earnings.module').then( m => m.EarningsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'booking-view',
    loadChildren: () => import('./booking-view/booking-view.module').then( m => m.BookingViewPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'view-detail',
    loadChildren: () => import('./view-detail/view-detail.module').then( m => m.ViewDetailPageModule),  
    canActivate: [AuthGuardGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

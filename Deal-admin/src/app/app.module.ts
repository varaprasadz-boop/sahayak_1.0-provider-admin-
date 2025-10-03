import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, enableIndexedDbPersistence } from '@angular/fire/firestore';
import { provideAuth, getAuth, initializeAuth, indexedDBLocalPersistence} from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AddUserPipe } from './add-user.pipe';
// initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent, AddUserPipe],
  entryComponents: [],
  imports: [ 
    ScrollingModule,
    BrowserModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    IonicModule.forRoot({mode:'ios', scrollAssist: true}),
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebase);
        if (Capacitor.isNativePlatform) {
          initializeAuth(app, {
              persistence: indexedDBLocalPersistence
          });
      }
        return app;
      }),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFirestore(() => {
      const firestore = getFirestore();
      enableIndexedDbPersistence(firestore);
      return firestore;
    }),
    provideStorage(() => getStorage()),
    //IonicRatingModule
    NgxPaginationModule
  ],
  providers: [
    {  provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

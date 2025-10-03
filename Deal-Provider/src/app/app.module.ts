import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, enableIndexedDbPersistence } from '@angular/fire/firestore';
import { provideAuth, getAuth, initializeAuth, indexedDBLocalPersistence} from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core'; 
import { TimelineComponent } from './timeline/timeline.component';
//import { IonicStorageModule } from '@ionic/storage-angular';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';

// Translate json file from assets load with HttpClient
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        
        BrowserModule,
        IonicModule.forRoot({ mode: 'md', scrollAssist: true }),
        IonicModule.forRoot(),
        //IonicStorageModule.forRoot(),
        HttpClientModule,
        AppRoutingModule,
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
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}


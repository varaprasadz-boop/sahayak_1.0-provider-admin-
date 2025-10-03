import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(public router:Router,public auth:AuthService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const userLoggedIn: boolean = localStorage.getItem('isProviderLoggedIn') === 'true';
      if (!userLoggedIn) {
        if(route.routeConfig?.path != 'login'){
         this.router.navigate(['/login'])
         return false;
        }
        // return true;
      } 
      else {
        if(route.routeConfig?.path === 'login') {
          this.router.navigate(['/tabs/home']);
        }
        return true;
      }


  }
  
}

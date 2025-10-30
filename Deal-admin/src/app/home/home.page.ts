 

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, PopoverController, isPlatform, AlertController } from '@ionic/angular';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { Category, Subcategory } from '../models/category';
import { Item } from '../models/item';
import { User } from '../models/user';
import { CommonService } from '../services/common.service';
import { DataService } from '../services/data.service';
import { Service } from '../models/services';
import { Sidemenu } from './models/sidemenu.model';

//declare var google;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public map: any;
  public marker: any;
  menuClose = false;
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  users: User[] = [];
  usersList: User[] = []; 
  items: Service[] = [];
  desktop: boolean = false;
  public bookings:any[] = [];
  pendingBookings: any[] = [];
  completeBookings: any[] = [];
  serviceProvider: any[]=[];
  mobile = false;
  db = getFirestore()
  public sideMenuItems = [
    { title: 'Categories', icon: 'assets/icon/categories.png', route: '/categories', permission: 'view_categories' },
    { title: 'Services List', icon: 'assets/icon/services.png', route: '/items', permission: 'view_items' },
    { title: 'Users', icon: 'assets/icon/team.png', route: '/users', permission: 'view_users' },
    { title: 'Subcategories', icon: 'assets/icon/subcategories.png', route: '/sub-categories', permission: 'view_subcategories' },
    { title: 'Comments', icon: 'assets/icon/emergency.png', route: '/comments', permission: 'view_comments' },
    { title: 'Notifications', icon: 'assets/icon/notification.png', route: '/notifications', permission: 'view_notifications' },
    { title: 'Cities', icon: 'assets/icon/map.png', route: '/cities', permission: 'view_cities' },
    { title: 'Subscribers', icon: 'assets/icon/rupee-indian.png', route: '/subscribers', permission: 'view_subscribers' },
    { title: 'Packages', icon: 'assets/icon/package.png', route: '/packages', permission: 'view_packages' }
  ];
  
  constructor(
    public platform: Platform, 
    public menuCtrl: MenuController,
    public common: CommonService, 
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public dataService: DataService,
    public router: Router) { 
    this.platform.ready().then(()=> {
     // this.getMaps()
    })
    if(isPlatform('desktop')) {
      this.desktop = true;
    } else {
      this.mobile = true;
    }
  }

  ngOnInit() {
    this.dataService.getCategories().subscribe((data) => {
      if(data != null){
        this.categories = data;
      } else {}
     })
     this.dataService.getServices().subscribe((data) => {
      if(data != null){
        this.items = data;
      } else {

      }
     })
     this.dataService.getUsers().subscribe((data) => {
      if(data != null){
        this.users = data;
      } else {

      }
     })
     this.dataService.getUsersList().subscribe((data) => {
      if(data != null){
        this.usersList = data;
      } else {

      }
     })
     this.dataService.getSubCategories().subscribe((data) => {
      if(data != null){
        this.subcategories = data;
      } else {

      }
     })
     this.dataService.getAllBookings().subscribe((data) => { 
      this.bookings = data;  
      const pendingBookings = this.bookings.filter(booking => booking.jobStatus === 'pending'); 
      this.pendingBookings = pendingBookings; 
      const completeBookings = this.bookings.filter(booking => booking.jobStatus === 'completed'); 
      this.completeBookings = completeBookings;  
    });
   
    this.dataService.getServiceProvidersLength().subscribe((users) => {
      this.serviceProvider = users; 
      console.log(this.serviceProvider);
    })
  }
  hasAccess(permission: any): boolean {
    return true
  }
  closeMenu(){
    this.menuCtrl.enable(false)
    this.menuClose = true
  }

  openMenu(){
    this.menuCtrl.enable(true)
    this.menuClose = false
  }

  

    logout() {
      // this.menuCtrl.enable(false)
      // this.common.logout();
      localStorage.removeItem('isLoggedInAdmins');
      this.router.navigate(['/login']);
      // , { skipLocationChange: true, replaceUrl: true }
    }

    async presentConfirm(id) {
      let alert = await this.alertCtrl.create({
        message: 'Are you sure to Delete?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Delete',
            handler: async () => {
              await deleteDoc(doc(this.db, "users", id));
              // this.warning()
            }
          }
        ]
      });
      alert.present();
    }
  
    async warning(){
      let alert = await this.alertCtrl.create({
        header: 'THIS IS DEMO',
        message: 'This is a demo app, you dont have access to Delete',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  

}

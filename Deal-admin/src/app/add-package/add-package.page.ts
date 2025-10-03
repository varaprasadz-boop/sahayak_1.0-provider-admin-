import { Component, Input, OnInit } from '@angular/core';
import { getFirestore } from 'firebase/firestore';
import { DataService } from '../services/data.service';
import { Packages } from '../models/packages';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.page.html',
  styleUrls: ['./add-package.page.scss'],
})
export class AddPackagePage implements OnInit {
  @Input() type:string = 'add';
  public packagesSelector = {name:['silver','gold','diamond'], cost:['199','299','399'], duration:['365','365','365'], noOfBookings:['100','300','500']};
  @Input() public package : Packages = {
    name:'',
    cost:'',
    duration:'',
    noOfBookings:''
  }
  public constructor(private data : DataService, private loadingController: LoadingController) { 
  }

  public ngOnInit() : void {}
  public async addPackages():Promise<void>{
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 4000
    });
    await loading.present();
    if(this.type == 'add'){
      this.data.addPackage(this.package).then((res) => {
        loading.dismiss();
        this.data.showToast('Package Added Successfully');
        this.package = {
          name:'',
          cost:'',
          duration:'',
          noOfBookings:''
        }
      });
    } else {
      this.data.updatePackage(this.package).then((res) => {
        console.log(res);
        loading.dismiss();
        this.data.showToast('Package Updated Successfully');
        this.package = {
          name:'',
          cost:'',
          duration:'',
          noOfBookings:''
        }
      });
    }
  }

}

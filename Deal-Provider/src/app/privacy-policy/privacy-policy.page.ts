import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  public data;
  public constructor(private dataService : DataService) { }

  public ngOnInit() :void {
    this.dataService.getAllContent().subscribe((data:any) => {
      if(data != null){
        console.log(data);
        data.forEach(data => {
          if(data.type == 'privacy-provider'){
            this.data = data.data;
          }
        });
      }
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  public data;
  public constructor(private dataService : DataService) { }

  public ngOnInit() :void {
    this.dataService.getAllContent().subscribe((data:any) => {
      if(data != null){
        console.log(data);
        data.forEach(data => {
          if(data.type == 'about'){
            this.data = data.data;
          }
        });
      }
    })
  }

}

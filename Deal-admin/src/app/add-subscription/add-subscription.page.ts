import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.page.html',
  styleUrls: ['./add-subscription.page.scss'],
})
export class AddSubscriptionPage implements OnInit {
  public Package:any=[{name: 'wellcome'},{name: 'business'},{name: 'business plus'}]
  public user:any=[{name:'Nazim'},{name:'Ali'},{name:'Bilal'}]
  public cost:any=[{price:'Free'},{price:'299'},{price:'499'}]

  constructor() { }

  ngOnInit() {
  }

}

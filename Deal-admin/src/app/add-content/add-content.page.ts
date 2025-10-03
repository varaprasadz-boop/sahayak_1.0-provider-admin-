import { Component, Input, OnInit } from '@angular/core';
import { Content } from '../models/content.model';
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.page.html',
  styleUrls: ['./add-content.page.scss'],
})
export class AddContentPage implements OnInit {
  @Input() public type : string = 'view';
  @Input() public content : Content = {
    type: '',
    title: '',
    data: ''
  };
  private db = getFirestore();
  public spin: boolean = false;
  public constructor(private navCtrl : NavController, public modalController: ModalController, private router: Router) {}

  public ngOnInit() : void {
  }
  public async editContent() : Promise<void> {
    // update
    await updateDoc(doc(this.db, 'content', this.content.type), {
      type: this.content.type,
      title: this.content.title,
      data: this.content.data
    });
    this.navCtrl.pop();
    this.modalController.dismiss();
  }

  public async addContent() : Promise<void> {
    this.spin = true;
    await setDoc(doc(this.db, 'content', this.content.type), {
      type: this.content.type,
      title: this.content.title,
      data: this.content.data
    });
    this.router.navigate(['/content-management']);
    this.spin = false;
  }

}

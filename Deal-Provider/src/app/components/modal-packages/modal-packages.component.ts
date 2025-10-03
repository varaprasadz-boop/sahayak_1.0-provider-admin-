import { Component, Input, OnInit } from '@angular/core';
import { AnimationController, ModalController } from '@ionic/angular';
import { AddressPage } from 'src/app/address/address.page';
import { ChooseAddressPage } from 'src/app/choose-address/choose-address.page';
import { Schedule } from 'src/app/model/schedule.model';
import { Service } from 'src/app/model/services';
@Component({
  selector: 'app-modal-packages',
  templateUrl: './modal-packages.component.html',
  styleUrls: ['./modal-packages.component.scss'],
})
export class ModalPackagesComponent implements OnInit {
  @Input() public service: Service;
  public checkboxChecked: boolean = false;
  public times : string[] = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
  public schedule : Schedule = {date: '', time: ''};
  public constructor(private animationCtrl: AnimationController, public  modalController: ModalController) {}
  public ngOnInit() : void {}
  public chooseTime(time:string) : void {
    this.schedule.time = this.schedule.time === time ? '' : time;
  }
  public chooseDate(date) : void {
    const selectedDate = new Date(date.detail.value);

    // Get the year, month, and day
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-based month, so add 1
    const day = selectedDate.getDate().toString().padStart(2, '0');
    
    // Construct the date string in yyyy-mm-dd format
    const formattedDate = `${year}-${month}-${day}`;
    
    this.schedule.date = formattedDate;
  }
  public convertTo12HourFormat(time: string): string {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const adjustedHour = hourNum % 12 || 12;
    return `${adjustedHour}:${minute.padStart(2, '0')} ${ampm}`;
}
  public bookNow() : void {
    this.chooseAddress();
  }
  public async chooseAddress(): Promise<void>{
    const modal = await this.modalController.create({
      component: ChooseAddressPage,
      componentProps: {
        schedule: this.schedule,
        service: this.service
      }
    });

    await modal.present();

    const { role, data } = await modal.onDidDismiss();
    if(role === 'success') {
      this.modalController.dismiss()
    }
  }

  // public changeColor(item: any, index: number) : void {
  //   this.array.forEach((el: any, i: number) => {
  //     el.checkboxChecked = i === index ? !item.checkboxChecked : false;
  //   });
  // }
}

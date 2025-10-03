import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Country, State, City } from 'country-state-city';
import { ModalController } from '@ionic/angular';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { id } from 'date-fns/locale';
@Component({
  selector: 'app-update-city-model',
  templateUrl: './update-city-model.page.html',
  styleUrls: ['./update-city-model.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateCityModelPage implements OnInit {
  @Input() public item: any;
  public editcities:any;
  public selectedCity= [];
  public search: string='';
  checkboxChecked: boolean = false;
  public db = getFirestore();
  constructor(private modalCtrl: ModalController,)
  {
    this.editcities = this.item
    console.log(this.editcities);
    
    // const country = Country.getCountryByCode('IN');
    // console.log(country);
    // const states = State.getStatesOfCountry('IN');
    // console.log(states);
    // this.editcities = City.getCitiesOfCountry('IN');
    // console.log(this.editcities)
   }

  ngOnInit() {
  }
  cancel() {
    return this.modalCtrl.dismiss('cancel');
  }

  async confirm() {
    const catRef = doc(this.db, "cities", this.item.id);
    await updateDoc(catRef, {
     name: this.item.name,
     stateCode: this.item.stateCode
  });
    return this.modalCtrl.dismiss( 'Submit');
  }

//   checkboxChanged(checked: boolean, index: number, city:any) {
//     if (checked) { 
//       this.selectedCity = city;
//       console.log(this.selectedCity);
//         this.editcities.forEach(( citi: { checkboxChecked: boolean; }, i: number) => {
//             if (i !== index) {
//               citi.checkboxChecked = false;
//             }
//         });
//         this.editcities[index].checkboxChecked = true;
//     } else { 
//       this.selectedCity = null;
//     }
// }

}

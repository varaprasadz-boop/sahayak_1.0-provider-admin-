import { Component, OnInit } from '@angular/core';
import { Country, State, City } from 'country-state-city';
import { ModalController } from '@ionic/angular';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { DataService } from '../services/data.service';
import { Auth, createUserWithEmailAndPassword } from 'firebase/auth';
@Component({
  selector: 'app-add-cities',
  templateUrl: './add-cities.page.html',
  styleUrls: ['./add-cities.page.scss'],
})
export class AddCitiesPage implements OnInit {
  checkboxChecked: boolean = false;
  public search: string='';
  public cities:any=[];
  public selectedCity= {city:'',state:'',country:'India'};
  public db = getFirestore();
  auth: Auth;
  constructor(private modalCtrl: ModalController, public data: DataService) {
    // const country = Country.getCountryByCode('IN');
    // console.log(country);
    // const states = State.getStatesOfCountry('IN');
    // console.log(states);
    // this.cities = City.getCitiesOfCountry('IN');
    // console.log(this.cities)
   }

  ngOnInit() {
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.selectedCity.city || !this.selectedCity.state) {
      console.error("City and state are required");
      return;
    } else {
      this.data.addCity(this.selectedCity).then(result => {
        if (result) {
          console.log("City added successfully:", this.selectedCity);
        } else {
          console.error("Failed to add city");
        }
        this.modalCtrl.dismiss('Submit');
      }).catch(error => {
        console.error("Error in confirm:", error);
      });
    }
  }
   

//   checkboxChanged(checked: boolean, index: number, city:any) {
//     if (checked) {
//       this.selectedCity = city;
//       console.log(this.selectedCity)
//         this.cities.forEach((item: { checkboxChecked: boolean; }, i: number) => {
//             if (i !== index) {
//                 item.checkboxChecked = false;
//             }
//         });
//         this.cities[index].checkboxChecked = true;
//     } 
//     else { 
//       this.selectedCity = null;
//     }
// }
}

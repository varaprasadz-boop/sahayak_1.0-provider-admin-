import { User } from "src/app/models/user";
import { DataService } from "src/app/services/data.service";

export class Booking {

    constructor(private data : DataService) { }
    public getAllUsers():any {
        this.data.getUsersList().subscribe(data => {
            return data;
        })
    }

}
import { SubAdmin } from "src/app/models/subadmins.model";

export interface Sidemenu {
    title: string;
    icon: string;
    route?: string;
    permission: SubAdmin;
    subItems?: Sidemenu[];
}
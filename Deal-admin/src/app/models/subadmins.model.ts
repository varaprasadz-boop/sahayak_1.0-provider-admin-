export interface SubAdmins {
    id?: string;
    email: string;
    password: string;
    name: string;
    status: string;
    permissions: SubAdmin[];
    type?: string;
    displayName?: string;
    block?: boolean | string;
}
export interface SubAdmin{
    name:string;
    permissions:string[];
};
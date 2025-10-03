import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionService {

  public constructor() { }
  public hasPermission(requiredPermissions: string[]): boolean {
    const storedPermissions = localStorage.getItem('permissions');
    if (!storedPermissions) {
      return false;
    }

    const userPermissions = JSON.parse(storedPermissions).reduce((acc: string[], entry: { permissions: string[] }) => {
      return acc.concat(entry.permissions);
    }, []);

    return requiredPermissions.every((perm: string) => userPermissions.includes(perm));
  }
}

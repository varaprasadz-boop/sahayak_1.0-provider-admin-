import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  public transform( array: any,searchedablevlue:string,key:string):any{
    if (!searchedablevlue) {
      return array;
    }
    return array.filter((item:any)=>{
    return item[key].toLowerCase().includes(searchedablevlue)
    });
  } 

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface BusinessClosure {
  id: number;
  name: string;
  date: string;
  type: number;
}


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class BusinessClosureModule { }

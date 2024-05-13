import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Project {
  id: number;
  name: string;
  description: string;
  file: string;
  manager: string;
  lock: boolean;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ProjectModule { }
